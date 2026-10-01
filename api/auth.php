<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method !== 'POST') {
            json_response(['success' => false, 'message' => 'Method not allowed'], 405);
        }
        $data = get_json_input();
        $identity = trim($data['username'] ?? $data['email'] ?? '');
        $password = (string)($data['password'] ?? '');

        if (empty($identity) || empty($password)) {
            json_response(['success' => false, 'message' => 'Please provide username/email and password.'], 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1');
        $stmt->execute([$identity, $identity]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            json_response(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        // Regenerate session ID for security
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['last_activity'] = time();

        json_response([
            'success' => true,
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email']
            ]
        ]);
        break;

    case 'check':
        if (is_admin_logged_in()) {
            json_response([
                'success' => true,
                'authenticated' => true,
                'admin' => [
                    'id' => $_SESSION['admin_id'],
                    'username' => $_SESSION['admin_username'],
                    'email' => $_SESSION['admin_email']
                ]
            ]);
        } else {
            json_response([
                'success' => true,
                'authenticated' => false
            ]);
        }
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();
        json_response(['success' => true, 'message' => 'Logged out successfully']);
        break;

    case 'change_password':
        require_auth();
        if ($method !== 'POST') {
            json_response(['success' => false, 'message' => 'Method not allowed'], 405);
        }
        $data = get_json_input();
        $currentPassword = (string)($data['current_password'] ?? '');
        $newPassword = (string)($data['new_password'] ?? '');

        if (strlen($newPassword) < 6) {
            json_response(['success' => false, 'message' => 'New password must be at least 6 characters.'], 400);
        }

        $stmt = $pdo->prepare('SELECT password_hash FROM admins WHERE id = ? LIMIT 1');
        $stmt->execute([$_SESSION['admin_id']]);
        $hash = $stmt->fetchColumn();

        if (!$hash || !password_verify($currentPassword, $hash)) {
            json_response(['success' => false, 'message' => 'Current password is incorrect.'], 400);
        }

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $updateStmt = $pdo->prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
        $updateStmt->execute([$newHash, $_SESSION['admin_id']]);

        json_response(['success' => true, 'message' => 'Password updated successfully.']);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action'], 400);
}
