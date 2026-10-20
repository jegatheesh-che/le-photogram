<?php
/**
 * LE PHOTOGRAM - Public Gallery API
 * Read-only endpoint returning portfolio gallery items.
 * Supports category and pagination filtering.
 */

require_once __DIR__ . '/../admin/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: public, max-age=60'); // 1 minute cache for performance

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'error' => 'Method not allowed. GET required.'], 405);
}

// Load gallery catalog
$items = read_json_file(GALLERY_JSON, []);

// Optional category filter
$category = isset($_GET['category']) ? trim((string)$_GET['category']) : '';
if (!empty($category) && $category !== 'all') {
    $items = array_values(array_filter($items, function ($item) use ($category) {
        $itemCat = $item['category'] ?? '';
        return strcasecmp($itemCat, $category) === 0;
    }));
}

// Optional pagination
$total = count($items);
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
$page  = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

if ($limit > 0) {
    $offset = ($page - 1) * $limit;
    $items = array_slice($items, $offset, $limit);
}

json_response([
    'success' => true,
    'total'   => $total,
    'count'   => count($items),
    'page'    => $limit > 0 ? $page : 1,
    'limit'   => $limit > 0 ? $limit : $total,
    'data'    => $items
]);
