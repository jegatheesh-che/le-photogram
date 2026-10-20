<?php
/**
 * LE PHOTOGRAM - Secure Admin Image Metadata Update API
 * Allows authorized administrators to edit titles, alt text, categories, and layout classes.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth.php';

header('Content-Type: application/json; charset=utf-8');

// Administrative guards
require_admin_api();
require_csrf_api();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'error' => 'Method not allowed. POST required.'], 405);
}

// Parse input from JSON body or POST parameters
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$id = trim($data['id'] ?? '');
if (empty($id)) {
    json_response(['success' => false, 'error' => 'Missing required item ID.'], 400);
}

$gallery = read_json_file(GALLERY_JSON, []);

$itemIndex = -1;
foreach ($gallery as $index => $item) {
    if (($item['id'] ?? '') === $id) {
        $itemIndex = $index;
        break;
    }
}

if ($itemIndex === -1) {
    json_response(['success' => false, 'error' => "Image with ID '{$id}' not found in catalog."], 404);
}

// Sanitize & validate fields
$currentItem = $gallery[$itemIndex];

if (isset($data['title'])) {
    $title = trim($data['title']);
    if ($title !== '') {
        $currentItem['title'] = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    }
}

if (isset($data['alt'])) {
    $alt = trim($data['alt']);
    $currentItem['alt'] = htmlspecialchars($alt, ENT_QUOTES, 'UTF-8');
}

if (isset($data['category'])) {
    $cat = trim($data['category']);
    if (array_key_exists($cat, ALLOWED_CATEGORIES)) {
        $currentItem['category'] = $cat;
    }
}

if (isset($data['layout_class'])) {
    $layout = trim($data['layout_class']);
    $currentItem['layout_class'] = preg_replace('/[^a-zA-Z0-9_\-\s]/', '', $layout);
}

$gallery[$itemIndex] = $currentItem;

$saved = write_json_file(GALLERY_JSON, $gallery);

if (!$saved) {
    json_response(['success' => false, 'error' => 'Failed to save updated metadata to catalog.'], 500);
}

json_response([
    'success' => true,
    'message' => 'Metadata updated successfully.',
    'item'    => $currentItem
]);
