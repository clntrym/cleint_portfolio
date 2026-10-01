<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $isAdmin = is_admin_logged_in();
    $sql = 'SELECT * FROM skills';
    if (!$isAdmin && !isset($_GET['admin_view'])) {
        $sql .= ' WHERE enabled = 1';
    }
    $sql .= ' ORDER BY sort_order ASC, id ASC';

    $stmt = $pdo->query($sql);
    $skills = $stmt->fetchAll();

    // Group by category for convenience
    $grouped = [];
    foreach ($skills as $skill) {
        $cat = $skill['category'] ?: 'Other';
        if (!isset($grouped[$cat])) {
            $grouped[$cat] = [];
        }
        $grouped[$cat][] = $skill;
    }

    json_response([
        'success' => true,
        'data' => $skills,
        'grouped' => $grouped
    ]);
}

require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    // Toggle enabled
    if ($action === 'toggle_status' && $id) {
        $stmt = $pdo->prepare('UPDATE skills SET enabled = 1 - enabled WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Skill status toggled.']);
    }

    // Delete skill
    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM skills WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Skill deleted successfully.']);
    }

    $name = sanitize_string($data['name'] ?? '');
    $category = sanitize_string($data['category'] ?? 'Frontend');
    $proficiency = isset($data['proficiency']) ? (int)$data['proficiency'] : 80;
    $icon = sanitize_string($data['icon'] ?? 'code');
    $sort_order = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
    $enabled = isset($data['enabled']) && $data['enabled'] ? 1 : 0;

    if (empty($name)) {
        json_response(['success' => false, 'message' => 'Skill name is required.'], 400);
    }

    if ($action === 'update' || $id) {
        $targetId = $id ?: (int)($data['id'] ?? 0);
        $stmt = $pdo->prepare('UPDATE skills SET name = ?, category = ?, proficiency = ?, icon = ?, sort_order = ?, enabled = ? WHERE id = ?');
        $stmt->execute([$name, $category, $proficiency, $icon, $sort_order, $enabled, $targetId]);
        json_response(['success' => true, 'message' => 'Skill updated successfully.']);
    } else {
        $stmt = $pdo->prepare('INSERT INTO skills (name, category, proficiency, icon, sort_order, enabled) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$name, $category, $proficiency, $icon, $sort_order, $enabled]);
        json_response(['success' => true, 'message' => 'Skill added successfully.', 'id' => $pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM skills WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Skill deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
