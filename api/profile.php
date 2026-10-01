<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM profiles LIMIT 1');
    $profile = $stmt->fetch();
    if (!$profile) {
        // Return default empty profile structure
        $profile = [
            'id' => 1,
            'name' => '',
            'title' => '',
            'short_bio' => '',
            'biography' => '',
            'career_goals' => '',
            'email' => '',
            'phone' => '',
            'location' => '',
            'profile_image' => '',
            'resume_url' => '',
            'availability' => 'Available',
            'website_title' => '',
            'website_description' => ''
        ];
    }
    json_response(['success' => true, 'data' => $profile]);
}

if ($method === 'POST' || $method === 'PUT') {
    require_auth();
    $data = get_json_input();

    $name = sanitize_string($data['name'] ?? '');
    $title = sanitize_string($data['title'] ?? '');
    $short_bio = sanitize_string($data['short_bio'] ?? '');
    $biography = trim((string)($data['biography'] ?? ''));
    $career_goals = sanitize_string($data['career_goals'] ?? '');
    $email = sanitize_string($data['email'] ?? '');
    $phone = sanitize_string($data['phone'] ?? '');
    $location = sanitize_string($data['location'] ?? '');
    $profile_image = sanitize_string($data['profile_image'] ?? '');
    $resume_url = sanitize_string($data['resume_url'] ?? '');
    $availability = sanitize_string($data['availability'] ?? '');
    $website_title = sanitize_string($data['website_title'] ?? '');
    $website_description = sanitize_string($data['website_description'] ?? '');

    if (empty($name)) {
        json_response(['success' => false, 'message' => 'Full Name is required.'], 400);
    }

    // Check if profile exists
    $count = $pdo->query('SELECT COUNT(*) FROM profiles')->fetchColumn();
    if ($count == 0) {
        $stmt = $pdo->prepare('INSERT INTO profiles (name, title, short_bio, biography, career_goals, email, phone, location, profile_image, resume_url, availability, website_title, website_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$name, $title, $short_bio, $biography, $career_goals, $email, $phone, $location, $profile_image, $resume_url, $availability, $website_title, $website_description]);
    } else {
        $stmt = $pdo->prepare('UPDATE profiles SET name = ?, title = ?, short_bio = ?, biography = ?, career_goals = ?, email = ?, phone = ?, location = ?, profile_image = ?, resume_url = ?, availability = ?, website_title = ?, website_description = ? WHERE id = 1');
        $stmt->execute([$name, $title, $short_bio, $biography, $career_goals, $email, $phone, $location, $profile_image, $resume_url, $availability, $website_title, $website_description]);
    }

    $stmt = $pdo->query('SELECT * FROM profiles LIMIT 1');
    $profile = $stmt->fetch();

    json_response([
        'success' => true,
        'message' => 'Profile updated successfully.',
        'data' => $profile
    ]);
}

json_response(['success' => false, 'message' => 'Method not allowed'], 405);
