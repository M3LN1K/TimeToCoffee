<?php
// get_bookings.php - Получение всех бронирований
require_once 'config.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    $sql = "SELECT * FROM arm_tables ORDER BY visit_date DESC, visit_time DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'bookings' => $bookings,
        'count' => count($bookings)
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>