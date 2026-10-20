<?php
/**
 * LE PHOTOGRAM - Secure Admin About Page Content API
 * Updates editable editorial About content stored in data/about.json.
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

$raw = file_get_contents('php://input');
$input = json_decode($raw, true) ?: $_POST;

$current = read_json_file(ABOUT_JSON, []);

// Update fields with validation & sanitization
if (isset($input['hero_title'])) {
    $current['hero_title'] = htmlspecialchars(trim($input['hero_title']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['hero_subtitle'])) {
    $current['hero_subtitle'] = htmlspecialchars(trim($input['hero_subtitle']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['story_eyebrow'])) {
    $current['story_eyebrow'] = htmlspecialchars(trim($input['story_eyebrow']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['story_manifesto'])) {
    $current['story_manifesto'] = htmlspecialchars(trim($input['story_manifesto']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['pullquote_text'])) {
    $current['pullquote_text'] = htmlspecialchars(trim($input['pullquote_text']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['pullquote_desc'])) {
    $current['pullquote_desc'] = htmlspecialchars(trim($input['pullquote_desc']), ENT_QUOTES, 'UTF-8');
}
if (isset($input['pullquote_author'])) {
    $current['pullquote_author'] = htmlspecialchars(trim($input['pullquote_author']), ENT_QUOTES, 'UTF-8');
}

if (!empty($input['story_paragraphs'])) {
    if (is_array($input['story_paragraphs'])) {
        $paragraphs = array_filter(array_map('trim', $input['story_paragraphs']));
        $current['story_paragraphs'] = array_values($paragraphs);
    } elseif (is_string($input['story_paragraphs'])) {
        // Split by double newlines
        $parts = preg_split('/\r\n\r\n|\n\n/', trim($input['story_paragraphs']));
        $current['story_paragraphs'] = array_values(array_filter(array_map('trim', $parts)));
    }
}

$saved = write_json_file(ABOUT_JSON, $current);

if (!$saved) {
    json_response(['success' => false, 'error' => 'Failed to save updated About content.'], 500);
}

json_response([
    'success' => true,
    'message' => 'About page content updated successfully.',
    'data'    => $current
]);
