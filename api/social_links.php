<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $isAdmin = is_admin_logged_in();
    $sql = 'SELECT * FROM social_links';
    if (!$isAdmin && !isset($_GET['admin_view'])) {
        $sql .= ' WHERE enabled = 1';
    }
    $sql .= ' ORDER BY sort_order ASC, id ASC';

    $stmt = $pdo->query($sql);
    $links = $stmt->fetchAll();
    json_response(['success' => true, 'data' => $links]);
}

require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    if ($action === 'toggle_status' && $id) {
        $stmt = $pdo->prepare('UPDATE social_links SET enabled = 1 - enabled WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Social link status toggled.']);
    }

    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM social_links WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Social link deleted successfully.']);
    }

    $platform = sanitize_string($data['platform'] ?? '');
    $url = sanitize_string($data['url'] ?? '');
    $icon = sanitize_string($data['icon'] ?? 'globe');
    $sort_order = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
    $enabled = isset($data['enabled']) && $data['enabled'] ? 1 : 0;

    if (empty($platform) || empty($url)) {
        json_response(['success' => false, 'message' => 'Platform and URL are required.'], 400);
    }

    if ($action === 'update' || $id) {
        $targetId = $id ?: (int)($data['id'] ?? 0);
        $stmt = $pdo->prepare('UPDATE social_links SET platform = ?, url = ?, icon = ?, sort_order = ?, enabled = ? WHERE id = ?');
        $stmt->execute([$platform, $url, $icon, $sort_order, $enabled, $targetId]);
        json_response(['success' => true, 'message' => 'Social link updated successfully.']);
    } else {
        $stmt = $pdo->prepare('INSERT INTO social_links (platform, url, icon, sort_order, enabled) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$platform, $url, $icon, $sort_order, $enabled]);
        json_response(['success' => true, 'message' => 'Social link added successfully.', 'id' => $pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM social_links WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Social link deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
