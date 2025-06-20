<?php
require 'config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM contacts ORDER BY fullname");
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Filter out null values from each contact
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