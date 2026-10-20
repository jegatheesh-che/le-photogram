<?php
/**
 * LE PHOTOGRAM - Public About API
 * Read-only endpoint returning About page editorial content.
 */

require_once __DIR__ . '/../admin/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Cache-Control: public, max-age=120');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'error' => 'Method not allowed. GET required.'], 405);
}

$aboutData = read_json_file(ABOUT_JSON, []);

json_response([
    'success' => true,
    'data'    => $aboutData
]);
