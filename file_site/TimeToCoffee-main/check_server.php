<?php
// check_server.php - Проверка сервера
echo "<h1>Проверка сервера</h1>";

echo "<h2>Информация о сервере:</h2>";
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";

echo "<h2>Проверка файлов:</h2>";
$files = ['booking_handler.php', 'test_booking.php', 'config.php'];
foreach ($files as $file) {
    echo "$file: " . (file_exists($file) ? '✅ Существует' : '❌ Не найден') . "<br>";
}

echo "<h2>Проверка прав:</h2>";
echo "Текущая директория: " . getcwd() . "<br>";
echo "Доступ на запись: " . (is_writable('.') ? '✅ Да' : '❌ Нет') . "<br>";

echo "<h2>Проверка POST данных:</h2>";
if ($_POST) {
    echo "POST данные получены: " . print_r($_POST, true);
} else {
    echo "Нет POST данных";
}
?>