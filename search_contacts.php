<?php
require 'config.php';

header('Content-Type: application/json');

$searchTerm = $_GET['q'] ?? '';

try {
    $stmt = $pdo->prepare("SELECT * FROM contacts 
        WHERE fullname LIKE ? OR 
              phone_number LIKE ? OR 
              email LIKE ? 
        ORDER BY fullname");
    
    $searchParam = "%$searchTerm%";
    $stmt->execute([$searchParam, $searchParam, $searchParam]);
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Filter out null values
    $filteredContacts = array_map(function($contact) {
        return array_filter($contact, function($value) {
            return $value !== null;
        });
    }, $contacts);
    
    echo json_encode($filteredContacts);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>