<?php
// booking_handler.php - Обработчик формы бронирования
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Включаем вывод ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Логируем начало обработки
error_log("=== START BOOKING PROCESSING ===");

// Получаем данные из тела запроса
$input = json_decode(file_get_contents('php://input'), true);

// Логируем полученные данные
error_log("Received booking data: " . print_r($input, true));

if (!$input) {
    error_log("Invalid JSON data for booking");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный формат данных']);
    exit;
}

try {
    // Подключаемся к базе данных SQLite
    $db_path = "H:/OSPanel/home/TimeToCoffe/public/database/timetocoffe_arms_table.db";
    
    // Логируем путь к базе данных
    error_log("Database path: " . $db_path);
    
    // Создаем папку database если её нет
    $db_dir = dirname($db_path);
    if (!is_dir($db_dir)) {
        error_log("Creating database directory: " . $db_dir);
        if (!mkdir($db_dir, 0755, true)) {
            throw new Exception("Не удалось создать папку для базы данных: " . $db_dir);
        }
    }
    
    // Создаем файл базы данных если его нет
    if (!file_exists($db_path)) {
        error_log("Database file does not exist, creating new one");
        // Создаем пустой файл
        if (touch($db_path)) {
            error_log("Database file created successfully");
            // Устанавливаем права на запись
            chmod($db_path, 0666);
        } else {
            throw new Exception("Не удалось создать файл базы данных: " . $db_path);
        }
    }
    
    // Проверяем права доступа к файлу
    if (!is_writable($db_path)) {
        error_log("Database file is not writable, trying to change permissions");
        if (!chmod($db_path, 0666)) {
            throw new Exception("Нет прав на запись в базу данных: " . $db_path);
        }
    }
    
    $db = new PDO("sqlite:" . $db_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Логируем успешное подключение
    error_log("Database connection successful");

    // Создаем таблицы если их нет
    createBookingTables($db);

    // Начинаем транзакцию
    $db->beginTransaction();

    // Сохраняем основное бронирование
    $booking_sql = "INSERT INTO table_reservations (
        name, phone, email, visit_date, visit_time, guests, 
        occasion, comment, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')";

    $stmt = $db->prepare($booking_sql);
    
    // Подготавливаем данные для вставки
    $booking_data = [
        $input['name'] ?? '',
        $input['phone'] ?? '',
        $input['email'] ?? null,
        $input['date'] ?? '',
        $input['time'] ?? '',
        intval($input['guests'] ?? 1),
        $input['occasion'] ?? null,
        $input['message'] ?? null
    ];

    // Простая валидация обязательных полей
    if (empty($booking_data[0]) || empty($booking_data[1]) || empty($booking_data[3]) || empty($booking_data[4])) {
        throw new Exception('Заполните все обязательные поля: имя, телефон, дата и время');
    }

    error_log("Executing booking insert with data: " . print_r($booking_data, true));
    
    $stmt->execute($booking_data);

    $booking_id = $db->lastInsertId();
    error_log("Booking created with ID: " . $booking_id);

    // Подтверждаем транзакцию
    $db->commit();

    // Логируем успешное бронирование
    error_log("Бронирование #{$booking_id} успешно создано. Гостей: {$booking_data[5]}");

    echo json_encode([
        'success' => true,
        'message' => 'Бронирование успешно сохранено!',
        'booking_id' => $booking_id,
        'data' => [
            'name' => $booking_data[0],
            'phone' => $booking_data[1],
            'email' => $booking_data[2],
            'visit_date' => $booking_data[3],
            'visit_time' => $booking_data[4],
            'guests' => $booking_data[5],
            'occasion' => $booking_data[6],
            'message' => $booking_data[7]
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Откатываем транзакцию в случае ошибки
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    // Логируем ошибку PDO
    error_log("PDO Error: " . $e->getMessage());
    error_log("PDO Error Code: " . $e->getCode());

    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Ошибка базы данных: ' . $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
    
} catch (Exception $e) {
    // Откатываем транзакцию в случае ошибки
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    // Логируем общую ошибку
    error_log("General Error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Ошибка: ' . $e->getMessage()
    ]);
}

function createBookingTables($db) {
    try {
        // Таблица бронирований столов
        $db->exec("CREATE TABLE IF NOT EXISTS table_reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            visit_date TEXT NOT NULL,
            visit_time TEXT NOT NULL,
            guests INTEGER NOT NULL,
            occasion TEXT,
            comment TEXT,
            status TEXT DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        error_log("Booking tables created or already exist");
        
        // Проверяем что таблица создана
        $stmt = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='table_reservations'");
        $tableExists = $stmt->fetch() !== false;
        error_log("Table 'table_reservations' exists: " . ($tableExists ? 'YES' : 'NO'));
        
    } catch (Exception $e) {
        error_log("Error creating booking tables: " . $e->getMessage());
        throw $e;
    }
}

error_log("=== END BOOKING PROCESSING ===");
?>