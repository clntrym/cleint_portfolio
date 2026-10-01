<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM educations ORDER BY sort_order ASC, start_year DESC');
    $educations = $stmt->fetchAll();
    json_response(['success' => true, 'data' => $educations]);
}

require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM educations WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Education record deleted successfully.']);
    }

    $school = sanitize_string($data['school'] ?? '');
    $degree = sanitize_string($data['degree'] ?? '');
    $field = sanitize_string($data['field'] ?? '');
    $start_year = sanitize_string($data['start_year'] ?? '');
    $end_year = sanitize_string($data['end_year'] ?? '');
    $description = trim((string)($data['description'] ?? ''));
    $certificate_url = sanitize_string($data['certificate_url'] ?? '');
    $logo = sanitize_string($data['logo'] ?? '');
    $sort_order = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;

    if (empty($school) || empty($degree)) {
        json_response(['success' => false, 'message' => 'School and Degree are required.'], 400);
    }

    if ($action === 'update' || $id) {
        $targetId = $id ?: (int)($data['id'] ?? 0);
        $stmt = $pdo->prepare('UPDATE educations SET school = ?, degree = ?, field = ?, start_year = ?, end_year = ?, description = ?, certificate_url = ?, logo = ?, sort_order = ? WHERE id = ?');
        $stmt->execute([$school, $degree, $field, $start_year, $end_year, $description, $certificate_url, $logo, $sort_order, $targetId]);
        json_response(['success' => true, 'message' => 'Education updated successfully.']);
    } else {
        $stmt = $pdo->prepare('INSERT INTO educations (school, degree, field, start_year, end_year, description, certificate_url, logo, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$school, $degree, $field, $start_year, $end_year, $description, $certificate_url, $logo, $sort_order]);
        json_response(['success' => true, 'message' => 'Education record added.', 'id' => $pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM educations WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Education deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
