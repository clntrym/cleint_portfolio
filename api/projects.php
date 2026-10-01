<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;

// Slugify helper
function generate_slug($title, $pdo, $currentId = null) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    $slug = trim($slug, '-');
    if (empty($slug)) $slug = 'project-' . time();

    // Check uniqueness
    $originalSlug = $slug;
    $counter = 1;
    while (true) {
        $sql = 'SELECT COUNT(*) FROM projects WHERE slug = ?';
        $params = [$slug];
        if ($currentId) {
            $sql .= ' AND id != ?';
            $params[] = $currentId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if ($stmt->fetchColumn() == 0) {
            break;
        }
        $slug = $originalSlug . '-' . $counter;
        $counter++;
    }
    return $slug;
}

if ($method === 'GET') {
    // 1. Single Project by Slug or ID
    if ($slug || $id) {
        if ($slug) {
            $stmt = $pdo->prepare('SELECT * FROM projects WHERE slug = ? LIMIT 1');
            $stmt->execute([$slug]);
        } else {
            $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ? LIMIT 1');
            $stmt->execute([$id]);
        }
        $project = $stmt->fetch();
        if (!$project) {
            json_response(['success' => false, 'message' => 'Project not found.'], 404);
        }
        // Decode JSON additional_images if present
        $project['additional_images'] = !empty($project['additional_images']) ? json_decode($project['additional_images'], true) : [];
        json_response(['success' => true, 'data' => $project]);
    }

    // 2. Projects List
    $isAdmin = is_admin_logged_in();
    $params = [];
    $where = [];

    // If not admin, only return published
    if (!$isAdmin && !isset($_GET['admin_view'])) {
        $where[] = 'published = 1';
    }

    // Filters
    if (!empty($_GET['category'])) {
        $where[] = 'category = ?';
        $params[] = trim($_GET['category']);
    }

    if (isset($_GET['featured']) && $_GET['featured'] !== '') {
        $where[] = 'featured = ?';
        $params[] = (int)$_GET['featured'];
    }

    if (isset($_GET['published']) && $_GET['published'] !== '') {
        $where[] = 'published = ?';
        $params[] = (int)$_GET['published'];
    }

    if (!empty($_GET['search'])) {
        $searchTerm = '%' . trim($_GET['search']) . '%';
        $where[] = '(title LIKE ? OR description LIKE ? OR technologies LIKE ?)';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $sql = 'SELECT * FROM projects';
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY sort_order ASC, created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();

    foreach ($projects as &$p) {
        $p['additional_images'] = !empty($p['additional_images']) ? json_decode($p['additional_images'], true) : [];
    }

    // Also get distinct categories for filter buttons
    $catStmt = $pdo->query('SELECT DISTINCT category FROM projects WHERE category IS NOT NULL AND category != "" ORDER BY category ASC');
    $categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

    json_response([
        'success' => true,
        'data' => $projects,
        'categories' => $categories
    ]);
}

// All write operations require admin auth
require_auth();

if ($method === 'POST') {
    $data = get_json_input();

    // Reorder action
    if ($action === 'reorder') {
        $orderList = $data['orders'] ?? []; // array of {id, sort_order}
        $stmt = $pdo->prepare('UPDATE projects SET sort_order = ? WHERE id = ?');
        foreach ($orderList as $item) {
            $stmt->execute([(int)$item['sort_order'], (int)$item['id']]);
        }
        json_response(['success' => true, 'message' => 'Project order updated.']);
    }

    // Toggle status
    if ($action === 'toggle_status' && $id) {
        $stmt = $pdo->prepare('UPDATE projects SET published = 1 - published WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Publish status toggled.']);
    }

    // Toggle featured
    if ($action === 'toggle_featured' && $id) {
        $stmt = $pdo->prepare('UPDATE projects SET featured = 1 - featured WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Featured status toggled.']);
    }

    // Delete project
    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Project deleted successfully.']);
    }

    // Create or Update
    $title = sanitize_string($data['title'] ?? '');
    if (empty($title)) {
        json_response(['success' => false, 'message' => 'Project title is required.'], 400);
    }

    $description = sanitize_string($data['description'] ?? '');
    $long_description = trim((string)($data['long_description'] ?? ''));
    $image = sanitize_string($data['image'] ?? '');
    $additional_images = isset($data['additional_images']) ? (is_array($data['additional_images']) ? json_encode($data['additional_images']) : (string)$data['additional_images']) : '[]';
    $technologies = sanitize_string($data['technologies'] ?? '');
    $github_url = sanitize_string($data['github_url'] ?? '');
    $live_url = sanitize_string($data['live_url'] ?? '');
    $category = sanitize_string($data['category'] ?? 'Web App');
    $featured = isset($data['featured']) && $data['featured'] ? 1 : 0;
    $published = isset($data['published']) && $data['published'] ? 1 : 0;
    $sort_order = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;

    $customSlug = sanitize_string($data['slug'] ?? '');

    if ($action === 'update' || $id) {
        $targetId = $id ?: (int)($data['id'] ?? 0);
        if (!$targetId) {
            json_response(['success' => false, 'message' => 'Project ID required for update.'], 400);
        }

        $slugFinal = !empty($customSlug) ? generate_slug($customSlug, $pdo, $targetId) : generate_slug($title, $pdo, $targetId);

        $stmt = $pdo->prepare('UPDATE projects SET title = ?, slug = ?, description = ?, long_description = ?, image = ?, additional_images = ?, technologies = ?, github_url = ?, live_url = ?, category = ?, featured = ?, published = ?, sort_order = ? WHERE id = ?');
        $stmt->execute([$title, $slugFinal, $description, $long_description, $image, $additional_images, $technologies, $github_url, $live_url, $category, $featured, $published, $sort_order, $targetId]);

        json_response(['success' => true, 'message' => 'Project updated successfully.', 'id' => $targetId, 'slug' => $slugFinal]);
    } else {
        // Create new project
        $slugFinal = !empty($customSlug) ? generate_slug($customSlug, $pdo) : generate_slug($title, $pdo);

        $stmt = $pdo->prepare('INSERT INTO projects (title, slug, description, long_description, image, additional_images, technologies, github_url, live_url, category, featured, published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$title, $slugFinal, $description, $long_description, $image, $additional_images, $technologies, $github_url, $live_url, $category, $featured, $published, $sort_order]);
        $newId = $pdo->lastInsertId();

        json_response(['success' => true, 'message' => 'Project created successfully.', 'id' => $newId, 'slug' => $slugFinal], 201);
    }
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Project deleted successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request'], 400);
