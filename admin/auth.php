<?php
/**
 * LE PHOTOGRAM - Native Admin Authentication & CSRF Protection
 */

require_once __DIR__ . '/config.php';

// Configure session cookie parameters BEFORE starting session
if (session_status() === PHP_SESSION_NONE) {
    if (!headers_sent()) {
        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                   || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
                   || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path'     => '/',
            'domain'   => '',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        session_start();
    } elseif (session_status() !== PHP_SESSION_ACTIVE) {
        @session_start();
    }
}

// Check session expiration
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_LIFETIME)) {
        // Session expired
        logout_admin();
        if (str_contains($_SERVER['REQUEST_URI'] ?? '', '/api/')) {
            json_response(['success' => false, 'error' => 'Session expired. Please log in again.'], 401);
        } else {
            header('Location: ' . get_base_admin_url() . 'login.php?error=expired');
            exit;
        }
    }
    $_SESSION['last_activity'] = time();
}

/**
 * Returns the base path to the admin directory
 */
function get_base_admin_url(): string {
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if (str_contains($script, '/admin/api/')) {
        return '../';
    } elseif (str_contains($script, '/admin/')) {
        return './';
    }
    return 'admin/';
}

/**
 * Check if the current user is an authenticated administrator.
 */
function is_admin_logged_in(): bool {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * Authenticate administrator with username and password.
 */
function attempt_login(string $username, string $password): bool {
    $creds = get_admin_credentials();
    $userValid = hash_equals($creds['username'], trim($username));
    $passValid = password_verify($password, $creds['password_hash']);

    if ($userValid && $passValid) {
        // Mitigate session fixation by regenerating session ID
        if (session_status() === PHP_SESSION_ACTIVE && !headers_sent()) {
            @session_regenerate_id(true);
        }
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $creds['username'];
        $_SESSION['last_activity'] = time();
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        return true;
    }

    return false;
}

/**
 * Log out and destroy session completely.
 */
function logout_admin(): void {
    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    @session_destroy();
}

/**
 * Retrieves the current CSRF token, generating one if missing.
 */
function get_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verifies the CSRF token using constant-time comparison.
 */
function verify_csrf_token(?string $token): bool {
    if (!$token || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Extracts CSRF token from headers, POST data, or JSON payload.
 */
function extract_request_csrf(): ?string {
    if (!empty($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        return $_SERVER['HTTP_X_CSRF_TOKEN'];
    }
    if (!empty($_POST['csrf_token'])) {
        return (string)$_POST['csrf_token'];
    }

    $raw = file_get_contents('php://input');
    if ($raw) {
        $json = json_decode($raw, true);
        if (is_array($json) && !empty($json['csrf_token'])) {
            return (string)$json['csrf_token'];
        }
    }

    return null;
}

/**
 * Guard for administrative HTML views.
 * Redirects unauthorized visitors to the login page.
 */
function require_admin(): void {
    if (!is_admin_logged_in()) {
        header('Location: ' . get_base_admin_url() . 'login.php');
        exit;
    }
}

/**
 * Guard for administrative API endpoints.
 * Returns 401 Unauthorized for unauthenticated requests.
 */
function require_admin_api(): void {
    if (!is_admin_logged_in()) {
        json_response([
            'success' => false,
            'error'   => 'Unauthorized. Administrative session required.'
        ], 401);
    }
}

/**
 * Guard for administrative API mutation endpoints.
 * Validates CSRF token and returns 403 Forbidden on failure.
 */
function require_csrf_api(): void {
    $token = extract_request_csrf();
    if (!verify_csrf_token($token)) {
        json_response([
            'success' => false,
            'error'   => 'Forbidden: Invalid or missing CSRF token.'
        ], 403);
    }
}
