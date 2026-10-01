<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT key_name, key_value FROM settings');
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['key_name']] = $r['key_value'];
    }
    json_response(['success' => true, 'data' => $settings]);
}

require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    $stmt = $pdo->prepare('INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)');

    foreach ($data as $key => $val) {
        $cleanKey = sanitize_string($key);
        $cleanVal = is_array($val) ? json_encode($val) : (string)$val;
        $stmt->execute([$cleanKey, $cleanVal]);
    }

    $stmt = $pdo->query('SELECT key_name, key_value FROM settings');
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['key_name']] = $r['key_value'];
    }

    json_response([
        'success' => true,
        'message' => 'Settings updated successfully.',
        'data' => $settings
    ]);
}

json_response(['success' => false, 'message' => 'Method not allowed'], 405);
