<?php
require_once __DIR__ . '/../config/config.php';

require_auth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['image']['error'] ?? 'No image file uploaded';
    json_response(['success' => false, 'message' => 'Upload error: ' . $err], 400);
}

$file = $_FILES['image'];
$type = sanitize_string($_POST['type'] ?? 'projects');
$allowedTypes = ['projects', 'profile', 'education', 'general'];
if (!in_array($type, $allowedTypes)) {
    $type = 'general';
}

$maxSize = 8 * 1024 * 1024; // 8MB
if ($file['size'] > $maxSize) {
    json_response(['success' => false, 'message' => 'File size exceeds 8MB limit.'], 400);
}

// Mime type validation
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'image/svg+xml' => 'svg'
];

if (!isset($allowedMimes[$mime])) {
    json_response(['success' => false, 'message' => 'Invalid file format. Only JPG, PNG, WEBP, GIF, and SVG are supported.'], 400);
}

$ext = $allowedMimes[$mime];
$targetDir = __DIR__ . '/../uploads/' . $type . '/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$safeFilename = $type . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = $targetDir . $safeFilename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_response(['success' => false, 'message' => 'Failed to save uploaded image.'], 500);
}

$url = 'uploads/' . $type . '/' . $safeFilename;

json_response([
    'success' => true,
    'message' => 'Image uploaded successfully.',
    'url' => $url,
    'filename' => $safeFilename
]);
