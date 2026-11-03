<?php
// config.php - Конфигурация базы данных

use PhpMyAdmin\Sql;

class Database {
    private $db_path = "H:\OSPanel\home\TimeToCoffe\public\database\timetocoffe_arms_table.db";
    private $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("sqlite:" . $this->db_path);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->createDatabase();
            $this->createTable();
        } catch(PDOException $e) {
            die("Ошибка подключения к базе данных: " . $e->getMessage());
        }
    }

    public function createDatabase() {
        $sql = "CREATE DATABASE IF NOT EXISTS timetocoffe_arms_table.db". $this->db_path;
        $this->conn->exec($sql);
    }

    private function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS arm_tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            visit_date DATE NOT NULL,
            visit_time TIME NOT NULL,
            guests INTEGER NOT NULL,
            occasion TEXT,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";

        $this->conn->exec($sql);
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>