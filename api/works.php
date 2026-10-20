<?php
/**
 * LE PHOTOGRAM - Public Works API
 * Read-only endpoint returning portfolio works and case studies.
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

$works = read_json_file(WORKS_JSON, []);

$slug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : '';
if (!empty($slug)) {
    foreach ($works as $work) {
        if (($work['slug'] ?? '') === $slug) {
            json_response([
                'success' => true,
                'data'    => $work
            ]);
        }
    }
    json_response(['success' => false, 'error' => "Work story '{$slug}' not found."], 404);
}

json_response([
    'success' => true,
    'count'   => count($works),
    'data'    => $works
]);
