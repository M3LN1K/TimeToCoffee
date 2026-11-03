<?php
// test_booking.php - Простой тест для бронирования
header('Content-Type: application/json; charset=utf-8');

// Простой ответ без базы данных
$response = [
    'success' => true,
    'message' => 'Тестовый ответ от сервера - форма работает!',
    'booking_id' => 'TEST-' . time(),
    'data' => $_POST
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>