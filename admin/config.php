<?php
/**
 * LE PHOTOGRAM - Central Backend Configuration & Storage Helpers
 * Pure PHP backend without external frameworks.
 */

// Error reporting: Production mode by default; can enable in dev
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Security & Session Settings
define('SESSION_NAME', 'LE_PHOTOGRAM_SESSION');
define('SESSION_LIFETIME', 7200); // 2 hours

// Storage Paths
define('DATA_DIR', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data');
define('GALLERY_JSON', DATA_DIR . DIRECTORY_SEPARATOR . 'gallery.json');
define('ABOUT_JSON', DATA_DIR . DIRECTORY_SEPARATOR . 'about.json');
define('WORKS_JSON', DATA_DIR . DIRECTORY_SEPARATOR . 'works.json');
define('CREDENTIALS_JSON', DATA_DIR . DIRECTORY_SEPARATOR . 'credentials.json');

// Admin Credentials
// Fallback defaults to 'admin' / 'AdminPassword2026!'
// Can be customized via admin dashboard, environment, or credentials.json
function get_admin_credentials(): array {
    $creds = read_json_file(CREDENTIALS_JSON, []);
    $user = !empty($creds['username']) ? $creds['username'] : (getenv('LP_ADMIN_USER') ?: 'admin');
    $hash = !empty($creds['password_hash']) ? $creds['password_hash'] : (getenv('LP_ADMIN_HASH') ?: '$2y$10$K9eBd79AJjz1bAdYTieAju8vT8GKVXftHvKToNrc/fUXJqXTI.lbi');
    return ['username' => $user, 'password_hash' => $hash];
}

define('ADMIN_USERNAME', get_admin_credentials()['username']);
define('ADMIN_PASSWORD_HASH', get_admin_credentials()['password_hash']);

define('UPLOAD_DIR', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'uploads');
define('UPLOAD_URL_PREFIX', 'assets/uploads/');

// Image Processing Constraints
define('MAX_UPLOAD_SIZE', 15 * 1024 * 1024); // 15 Megabytes
define('MAX_IMAGE_WIDTH', 2400);
define('MAX_IMAGE_HEIGHT', 2400);
define('WEBP_QUALITY', 88);

// Allowed MIMEs and extensions
const ALLOWED_MIME_TYPES = [
    'image/jpeg' => ['jpg', 'jpeg'],
    'image/png'  => ['png'],
    'image/webp' => ['webp']
];

const ALLOWED_CATEGORIES = [
    'weddings'  => 'Weddings',
    'portraits' => 'Studio Portraits',
    'events'    => 'Life Events',
    'editorial' => 'Editorial & Fine Art'
];

/**
 * Safely reads a JSON file using shared locking.
 * Returns the parsed array or $default on failure.
 */
function read_json_file(string $path, array $default = []): array {
    if (!file_exists($path)) {
        return $default;
    }

    $fp = @fopen($path, 'rb');
    if (!$fp) {
        return $default;
    }

    if (!flock($fp, LOCK_SH)) {
        fclose($fp);
        return $default;
    }

    $content = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    if ($content === false || trim($content) === '') {
        return $default;
    }

    $data = json_decode($content, true);
    return is_array($data) ? $data : $default;
}

/**
 * Safely writes data to a JSON file atomically with exclusive locking.
 * Protects against race conditions and file corruption.
 */
function write_json_file(string $path, array $data): bool {
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }

    $tempPath = $path . '.tmp.' . bin2hex(random_bytes(6));
    $fp = @fopen($tempPath, 'wb');
    if (!$fp) {
        return false;
    }

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        @unlink($tempPath);
        return false;
    }

    $written = fwrite($fp, $json);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    if ($written === false || $written !== strlen($json)) {
        @unlink($tempPath);
        return false;
    }

    // Atomic replace on POSIX, on Windows handles rename/unlink
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        if (file_exists($path)) {
            @unlink($path);
        }
    }

    return @rename($tempPath, $path);
}

/**
 * Standard structured JSON response helper.
 */
function json_response(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
