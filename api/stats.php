<?php
require_once __DIR__ . '/../config/config.php';

require_auth();

$totalProjects = (int)$pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();
$publishedProjects = (int)$pdo->query('SELECT COUNT(*) FROM projects WHERE published = 1')->fetchColumn();
$featuredProjects = (int)$pdo->query('SELECT COUNT(*) FROM projects WHERE featured = 1')->fetchColumn();
$totalSkills = (int)$pdo->query('SELECT COUNT(*) FROM skills')->fetchColumn();
$totalExperience = (int)$pdo->query('SELECT COUNT(*) FROM experiences')->fetchColumn();
$totalEducation = (int)$pdo->query('SELECT COUNT(*) FROM educations')->fetchColumn();
$totalMessages = (int)$pdo->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
$unreadMessages = (int)$pdo->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();

// Recent projects
$stmt = $pdo->query('SELECT id, title, slug, category, published, featured, created_at FROM projects ORDER BY created_at DESC LIMIT 5');
$recentProjects = $stmt->fetchAll();

// Recent messages
$stmt = $pdo->query('SELECT id, name, email, subject, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5');
$recentMessages = $stmt->fetchAll();

json_response([
    'success' => true,
    'data' => [
        'stats' => [
            'total_projects' => $totalProjects,
            'published_projects' => $publishedProjects,
            'featured_projects' => $featuredProjects,
            'total_skills' => $totalSkills,
            'total_experience' => $totalExperience,
            'total_education' => $totalEducation,
            'total_messages' => $totalMessages,
            'unread_messages' => $unreadMessages
        ],
        'recent_projects' => $recentProjects,
        'recent_messages' => $recentMessages
    ]
]);
