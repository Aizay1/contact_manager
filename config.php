<?php
$host = 'mariadb';
$dbname = 'contact_db';
$username = 'contact';
$password = '12?34?56?Aa';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create the table if it doesn't exist
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone_number VARCHAR(20) NOT NULL,
        extra_phone_number VARCHAR(20),
        city VARCHAR(50),
        house_number VARCHAR(20),
        zipcode VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    ";
    $pdo->exec($createTableSQL);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
