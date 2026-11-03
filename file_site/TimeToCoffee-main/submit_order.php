<?php
require_once 'config.php';


// submit_order.php - Обработчик оформления заказа
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
error_log("=== START ORDER PROCESSING ===");

// Получаем данные из тела запроса
$input = json_decode(file_get_contents('php://input'), true);

// Логируем полученные данные
error_log("Received data: " . print_r($input, true));

if (!$input) {
    error_log("Invalid JSON data");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный формат данных']);
    exit;
}

try {
    // Подключаемся к базе данных SQLite
    $db_path = "H:/OSPanel/home/TimeToCoffe/public/database/timetocoffe_menu.db";
    
    // Логируем путь к базе данных
    error_log("Database path: " . $db_path);
    
    // Проверяем существование файла базы данных
    if (!file_exists($db_path)) {
        error_log("Database file not found");
        throw new Exception("Файл базы данных не найден: " . $db_path);
    }
    
    // Проверяем права доступа к файлу
    if (!is_writable($db_path) && !is_writable(dirname($db_path))) {
        error_log("Database file is not writable");
        throw new Exception("Нет прав на запись в базу данных");
    }
    
    $db = new PDO("sqlite:" . $db_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Логируем успешное подключение
    error_log("Database connection successful");

    // Создаем таблицы если их нет
    createOrderTables($db);

    // Начинаем транзакцию
    $db->beginTransaction();

    // Сохраняем основной заказ
    $order_sql = "INSERT INTO orders (
        delivery_type, first_name, last_name, phone, email, 
        address, entrance, floor, intercom, delivery_comment,
        payment_method, order_comment, subtotal, delivery_cost, total_amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";

    $stmt = $db->prepare($order_sql);
    
    // Подготавливаем данные для вставки
    $order_data = [
        $input['delivery_type'] ?? '',
        $input['first_name'] ?? '',
        $input['last_name'] ?? '',
        $input['phone'] ?? '',
        $input['email'] ?? null,
        $input['address'] ?? null,
        $input['entrance'] ?? null,
        $input['floor'] ?? null,
        $input['intercom'] ?? null,
        $input['delivery_comment'] ?? null,
        $input['payment_method'] ?? '',
        $input['order_comment'] ?? null,
        floatval($input['subtotal'] ?? 0),
        floatval($input['delivery_cost'] ?? 0),
        floatval($input['total'] ?? 0)
    ];

    error_log("Executing order insert with data: " . print_r($order_data, true));
    
    $stmt->execute($order_data);

    $order_id = $db->lastInsertId();
    error_log("Order created with ID: " . $order_id);

    // Сохраняем товары заказа
    $item_sql = "INSERT INTO order_items (order_id, item_name, price, quantity) VALUES (?, ?, ?, ?)";
    $item_stmt = $db->prepare($item_sql);

    $items_count = 0;
    foreach ($input['items'] as $item) {
        $item_data = [
            $order_id,
            $item['name'] ?? 'Неизвестный товар',
            floatval($item['price'] ?? 0),
            intval($item['quantity'] ?? 1)
        ];
        
        $item_stmt->execute($item_data);
        $items_count++;
    }

    error_log("Added {$items_count} items to order");

    // Подтверждаем транзакцию
    $db->commit();

    // Логируем успешный заказ
    error_log("Заказ #{$order_id} успешно создан. Сумма: {$input['total']}₽");

    echo json_encode([
        'success' => true,
        'message' => 'Заказ успешно создан',
        'order_id' => $order_id,
        'total' => $input['total']
    ]);

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
    // Логируем общую ошибку
    error_log("General Error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Ошибка: ' . $e->getMessage()
    ]);
}

function createOrderTables($db) {
    try {
        // Таблица заказов
        $db->exec("CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            delivery_type TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            address TEXT,
            entrance TEXT,
            floor INTEGER,
            intercom TEXT,
            delivery_comment TEXT,
            payment_method TEXT NOT NULL,
            order_comment TEXT,
            subtotal REAL NOT NULL,
            delivery_cost REAL NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Таблица товаров заказа
        $db->exec("CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )");

        error_log("Tables created or already exist");
        
    } catch (Exception $e) {
        error_log("Error creating tables: " . $e->getMessage());
        throw $e;
    }
}

error_log("=== END ORDER PROCESSING ===");
?>