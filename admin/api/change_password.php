<?php
/**
 * LE PHOTOGRAM - Secure Admin Password Change API
 * Allows authenticated administrator to update their password.
 * Enforces current password verification, Bcrypt hashing, and CSRF protection.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth.php';

header('Content-Type: application/json; charset=utf-8');

require_admin_api();
require_csrf_api();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'error' => 'Method not allowed. POST required.'], 405);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$currentPassword = (string)($data['current_password'] ?? '');
$newPassword = (string)($data['new_password'] ?? '');
$confirmPassword = (string)($data['confirm_password'] ?? '');

if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    json_response(['success' => false, 'error' => 'All password fields are required.'], 400);
}

$creds = get_admin_credentials();

if (!password_verify($currentPassword, $creds['password_hash'])) {
    json_response(['success' => false, 'error' => 'Current password entered is incorrect.'], 403);
}

if ($newPassword !== $confirmPassword) {
    json_response(['success' => false, 'error' => 'New password and confirmation do not match.'], 400);
}

if (strlen($newPassword) < 8) {
    json_response(['success' => false, 'error' => 'New password must be at least 8 characters long.'], 400);
}

$newHash = password_hash($newPassword, PASSWORD_BCRYPT);
$updatedCreds = [
    'username'      => $creds['username'],
    'password_hash' => $newHash,
    'updated_at'    => date('Y-m-d H:i:s')
];

$saved = write_json_file(CREDENTIALS_JSON, $updatedCreds);

if (!$saved) {
    json_response(['success' => false, 'error' => 'Failed to save new credentials securely to storage.'], 500);
}

json_response([
    'success' => true,
    'message' => 'Studio master password updated successfully.'
]);
