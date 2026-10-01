<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $isAdmin = is_admin_logged_in();
    $sql = 'SELECT * FROM experiences';
    if (!$isAdmin && !isset($_GET['admin_view'])) {
        $sql .= ' WHERE enabled = 1';
    }
    $sql .= ' ORDER BY sort_order ASC, start_date DESC';

    $stmt = $pdo->query($sql);
    $experiences = $stmt->fetchAll();

    json_response(['success' => true, 'data' => $experiences]);
}

require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    if ($action === 'toggle_status' && $id) {
        $stmt = $pdo->prepare('UPDATE experiences SET enabled = 1 - enabled WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Experience status toggled.']);
    }

    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM experiences WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Experience deleted successfully.']);
    }

    $job_title = sanitize_string($data['job_title'] ?? '');
    $company = sanitize_string($data['company'] ?? '');
    $location = sanitize_string($data['location'] ?? '');
    $start_date = sanitize_string($data['start_date'] ?? '');
    $end_date = sanitize_string($data['end_date'] ?? 'Present');
    $currently_working = isset($data['currently_working']) && $data['currently_working'] ? 1 : 0;
    if ($currently_working) {
        $end_date = 'Present';
    }
    $description = trim((string)($data['description'] ?? ''));
    $responsibilities = trim((string)($data['responsibilities'] ?? ''));
    $technologies = sanitize_string($data['technologies'] ?? '');
    $sort_order = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
    $enabled = isset($data['enabled']) && $data['enabled'] ? 1 : 0;

    if (empty($job_title) || empty($company)) {
        json_response(['success' => false, 'message' => 'Job title and Company are required.'], 400);
    }

    if ($action === 'update' || $id) {
        $targetId = $id ?: (int)($data['id'] ?? 0);
        $stmt = $pdo->prepare('UPDATE experiences SET job_title = ?, company = ?, location = ?, start_date = ?, end_date = ?, currently_working = ?, description = ?, responsibilities = ?, technologies = ?, sort_order = ?, enabled = ? WHERE id = ?');
        $stmt->execute([$job_title, $company, $location, $start_date, $end_date, $currently_working, $description, $responsibilities, $technologies, $sort_order, $enabled, $targetId]);
        json_response(['success' => true, 'message' => 'Experience updated successfully.']);
    } else {
        $stmt = $pdo->prepare('INSERT INTO experiences (job_title, company, location, start_date, end_date, currently_working, description, responsibilities, technologies, sort_order, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$job_title, $company, $location, $start_date, $end_date, $currently_working, $description, $responsibilities, $technologies, $sort_order, $enabled]);
        json_response(['success' => true, 'message' => 'Experience added successfully.', 'id' => $pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM experiences WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Experience deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
