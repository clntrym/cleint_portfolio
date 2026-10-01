<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET: current resume details
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT resume_url, name FROM profiles LIMIT 1');
    $profile = $stmt->fetch();
    $resumeUrl = $profile['resume_url'] ?? '';

    if ($action === 'download') {
        if (empty($resumeUrl)) {
            http_response_code(404);
            die('No resume available.');
        }
        $filePath = __DIR__ . '/../' . ltrim($resumeUrl, '/');
        if (!file_exists($filePath)) {
            http_response_code(404);
            die('Resume file not found on server.');
        }
        $filename = 'Resume-' . preg_replace('/[^A-Za-z0-9_-]/', '-', $profile['name'] ?? 'Portfolio') . '.pdf';
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }

    json_response([
        'success' => true,
        'resume_url' => $resumeUrl,
        'has_resume' => !empty($resumeUrl) && file_exists(__DIR__ . '/../' . ltrim($resumeUrl, '/'))
    ]);
}

// Upload & Delete require admin
require_auth();

if ($method === 'POST') {
    if ($action === 'delete') {
        $stmt = $pdo->query('SELECT resume_url FROM profiles LIMIT 1');
        $oldResume = $stmt->fetchColumn();
        if ($oldResume) {
            $oldPath = __DIR__ . '/../' . ltrim($oldResume, '/');
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }
        }
        $pdo->query("UPDATE profiles SET resume_url = '' WHERE id = 1");
        json_response(['success' => true, 'message' => 'Resume deleted successfully.']);
    }

    // Upload PDF
    if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
        $errCode = $_FILES['resume']['error'] ?? 'No file';
        json_response(['success' => false, 'message' => 'Please select a valid PDF file. Error: ' . $errCode], 400);
    }

    $file = $_FILES['resume'];
    $maxSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxSize) {
        json_response(['success' => false, 'message' => 'Resume must be smaller than 10MB.'], 400);
    }

    // Check mime type & extension
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($ext !== 'pdf' || ($mime !== 'application/pdf' && $mime !== 'application/x-pdf')) {
        json_response(['success' => false, 'message' => 'Only PDF files are allowed.'], 400);
    }

    $uploadDir = __DIR__ . '/../uploads/resume/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Delete existing old file if present
    $stmt = $pdo->query('SELECT resume_url FROM profiles LIMIT 1');
    $oldResume = $stmt->fetchColumn();
    if ($oldResume) {
        $oldPath = __DIR__ . '/../' . ltrim($oldResume, '/');
        if (file_exists($oldPath)) {
            @unlink($oldPath);
        }
    }

    $fileName = 'resume_' . time() . '_' . bin2hex(random_bytes(4)) . '.pdf';
    $dest = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        json_response(['success' => false, 'message' => 'Failed to save uploaded file.'], 500);
    }

    $dbPath = 'uploads/resume/' . $fileName;
    $pdo->prepare('UPDATE profiles SET resume_url = ? WHERE id = 1')->execute([$dbPath]);

    json_response([
        'success' => true,
        'message' => 'Resume uploaded successfully.',
        'resume_url' => $dbPath
    ]);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
