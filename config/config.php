<?php
// Database connection (PDO). This folder is blocked from the web by config/.htaccess.
// XAMPP default: root with no password.

// Auto-detect Localhost vs InfinityFree Live Server
$httpHost = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = (strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false);

if ($isLocal) {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'portfolio_db');
    define('DB_USER', 'root');
    define('DB_PASS', '');
} else {
    // InfinityFree MySQL Credentials
    define('DB_HOST', 'sql109.infinityfree.com');
    define('DB_NAME', 'if0_43062399_portfolio_db');
    define('DB_USER', 'if0_43062399');
    define('DB_PASS', 'Hawarli0203');
}

// Session rules (seconds)
const SESSION_IDLE_TIMEOUT = 60 * 60;      // 1 hour
const SESSION_ABSOLUTE_TIMEOUT = 12 * 3600; // 12 hours

date_default_timezone_set('Asia/Manila');

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    $pdo->exec("SET time_zone = '+08:00'");
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP and database portfolio_db exists.',
        'error' => $e->getMessage()
    ]);
    exit;
}

/**
 * Return JSON response and exit
 */
function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get request JSON body
 */
function get_json_input() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? array_merge($_POST, $decoded) : $_POST;
}

/**
 * Check if the user is authenticated as admin
 */
function require_auth() {
    if (!isset($_SESSION['admin_id']) || empty($_SESSION['admin_id'])) {
        json_response([
            'success' => false,
            'message' => 'Unauthorized. Please sign in.'
        ], 401);
    }

    // Check idle timeout
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_IDLE_TIMEOUT)) {
        session_unset();
        session_destroy();
        json_response([
            'success' => false,
            'message' => 'Session expired. Please sign in again.'
        ], 401);
    }
    $_SESSION['last_activity'] = time();
}

/**
 * Check if admin is currently logged in (boolean)
 */
function is_admin_logged_in() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

/**
 * Clean & sanitize text input
 */
function sanitize_string($input, $default = '') {
    if ($input === null) return $default;
    return trim(strip_tags((string)$input));
}
