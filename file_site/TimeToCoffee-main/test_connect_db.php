<?php
// test_db.php - Тест подключения к базе данных
header('Content-Type: text/plain; charset=utf-8');

try {
    $db_path = "H:/OSPanel/home/TimeToCoffe/database/timetocoffe.db";
    
    echo "Testing database connection...\n";
    echo "Database path: $db_path\n";
    
    if (!file_exists($db_path)) {
        echo "ERROR: Database file not found!\n";
        
        // Попробуем создать директорию и файл
        $dir = dirname($db_path);
        if (!is_dir($dir)) {
            echo "Creating directory: $dir\n";
            mkdir($dir, 0755, true);
        }
        
        // Создаем пустую базу данных
        touch($db_path);
        echo "Created empty database file\n";
    }
    
    if (!is_writable($db_path)) {
        echo "WARNING: Database file is not writable\n";
    }
    
    $db = new PDO("sqlite:" . $db_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "SUCCESS: Database connection established!\n";
    
    // Тестируем создание таблиц
    $db->exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)");
    echo "SUCCESS: Table creation test passed!\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>