<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

// Public message submission
if ($method === 'POST' && empty($action)) {
    $data = get_json_input();

    // Basic anti-spam honeypot
    if (!empty($data['website_honeypot'])) {
        json_response(['success' => true, 'message' => 'Message sent successfully.']);
    }

    $name = sanitize_string($data['name'] ?? '');
    $email = sanitize_string($data['email'] ?? '');
    $subject = sanitize_string($data['subject'] ?? '');
    $message = trim((string)($data['message'] ?? ''));

    if (empty($name)) {
        json_response(['success' => false, 'message' => 'Please enter your name.'], 400);
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['success' => false, 'message' => 'Please enter a valid email address.'], 400);
    }
    if (empty($subject)) {
        json_response(['success' => false, 'message' => 'Please enter a subject.'], 400);
    }
    if (empty($message) || strlen($message) < 5) {
        json_response(['success' => false, 'message' => 'Message must be at least 5 characters long.'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO contact_messages (name, email, subject, message, is_read) VALUES (?, ?, ?, ?, 0)');
    $stmt->execute([$name, $email, $subject, $message]);

    json_response([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ], 201);
}

// Below endpoints require admin authorization
require_auth();

if ($method === 'GET') {
    $where = [];
    $params = [];

    if (isset($_GET['is_read']) && $_GET['is_read'] !== '') {
        $where[] = 'is_read = ?';
        $params[] = (int)$_GET['is_read'];
    }

    if (!empty($_GET['search'])) {
        $term = '%' . trim($_GET['search']) . '%';
        $where[] = '(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $sql = 'SELECT * FROM contact_messages';
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $sort = isset($_GET['sort']) && strtolower($_GET['sort']) === 'asc' ? 'ASC' : 'DESC';
    $sql .= ' ORDER BY created_at ' . $sort;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $messages = $stmt->fetchAll();

    $unreadCount = $pdo->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();

    json_response([
        'success' => true,
        'data' => $messages,
        'unread_count' => (int)$unreadCount
    ]);
}

if ($method === 'POST') {
    if ($action === 'toggle_read' && $id) {
        $stmt = $pdo->prepare('UPDATE contact_messages SET is_read = 1 - is_read WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Message status updated.']);
    }

    if ($action === 'mark_all_read') {
        $pdo->query('UPDATE contact_messages SET is_read = 1 WHERE is_read = 0');
        json_response(['success' => true, 'message' => 'All messages marked as read.']);
    }

    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Message deleted successfully.']);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Message deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
