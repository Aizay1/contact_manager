<?php
require 'config.php';

header('Content-Type: application/json');

$required = ['id', 'fullname', 'phone_number'];
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "The $field field is required."]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("UPDATE contacts SET 
        fullname = ?, 
        email = ?, 
        phone_number = ?, 
        extra_phone_number = ?, 
        city = ?, 
        house_number = ?, 
        zipcode = ? 
        WHERE id = ?");
    
    $stmt->execute([
        $data['fullname'],
        $data['email'] ?? null,
        $data['phone_number'],
        $data['extra_phone_number'] ?? null,
        $data['city'] ?? null,
        $data['house_number'] ?? null,
        $data['zipcode'] ?? null,
        $data['id']
    ]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>