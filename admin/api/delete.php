<?php
/**
 * LE PHOTOGRAM - Secure Admin Image Deletion API
 * Supports individual and batch deletion, CSRF protection,
 * default portfolio image protection, and path traversal prevention.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth.php';

header('Content-Type: application/json; charset=utf-8');

// Administrative guards
require_admin_api();
require_csrf_api();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
}

// Parse input (supports JSON body or POST form data)
$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];

$targetIds = [];
if (!empty($body['ids']) && is_array($body['ids'])) {
    $targetIds = $body['ids'];
} elseif (!empty($body['id'])) {
    $targetIds = [(string)$body['id']];
} elseif (!empty($_POST['ids']) && is_array($_POST['ids'])) {
    $targetIds = $_POST['ids'];
} elseif (!empty($_POST['id'])) {
    $targetIds = [(string)$_POST['id']];
}

if (empty($targetIds)) {
    json_response(['success' => false, 'error' => 'No image ID(s) provided for deletion.'], 400);
}

$gallery = read_json_file(GALLERY_JSON, []);

$deletedIds = [];
$protectedItems = [];
$notFoundIds = [];
$physicalFilesToRemove = [];

$uploadDirReal = realpath(UPLOAD_DIR);

$updatedGallery = [];

foreach ($gallery as $item) {
    $id = (string)($item['id'] ?? '');

    if (!in_array($id, $targetIds, true)) {
        $updatedGallery[] = $item;
        continue;
    }

    // Protection for default seed images
    if (!empty($item['is_default']) || str_starts_with($id, 'seed-')) {
        $protectedItems[] = [
            'id'    => $id,
            'title' => $item['title'] ?? 'Default Image',
            'error' => 'Protected default image cannot be deleted.'
        ];
        $updatedGallery[] = $item; // keep it in catalog
        continue;
    }

    // Verify physical file path is safely within UPLOAD_DIR
    $rawRelPath = $item['image_path'] ?? '';
    if (!empty($rawRelPath)) {
        $baseDir = dirname(__DIR__, 2);
        $candidatePath = $baseDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rawRelPath);
        $realPath = realpath($candidatePath);

        // Path traversal validation
        if ($realPath && $uploadDirReal && str_starts_with($realPath, $uploadDirReal)) {
            $physicalFilesToRemove[] = $realPath;
        }
    }

    $deletedIds[] = $id;
}

// Identify any requested IDs that were not found
foreach ($targetIds as $tid) {
    if (!in_array($tid, $deletedIds, true) && !in_array($tid, array_column($protectedItems, 'id'), true)) {
        $notFoundIds[] = $tid;
    }
}

if (empty($deletedIds) && !empty($protectedItems)) {
    json_response([
        'success'         => false,
        'error'           => 'Operation rejected: Selected image(s) are protected default items and cannot be deleted.',
        'protected_count' => count($protectedItems),
        'protected'       => $protectedItems
    ], 403);
}

// Write the updated catalogue to JSON first (atomic write)
$saved = write_json_file(GALLERY_JSON, $updatedGallery);

if (!$saved) {
    json_response([
        'success' => false,
        'error'   => 'Failed to update database catalog safely. Physical files were not deleted.'
    ], 500);
}

// Remove physical files only after catalog write succeeds
$failedUnlinks = [];
foreach ($physicalFilesToRemove as $filePath) {
    if (file_exists($filePath)) {
        if (!@unlink($filePath)) {
            $failedUnlinks[] = $filePath;
        }
    }
}

json_response([
    'success'         => true,
    'message'         => count($deletedIds) . ' image(s) removed successfully.',
    'deleted_count'   => count($deletedIds),
    'deleted_ids'     => $deletedIds,
    'protected_count' => count($protectedItems),
    'protected'       => $protectedItems,
    'not_found'       => $notFoundIds
]);
