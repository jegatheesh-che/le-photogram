<?php
/**
 * LE PHOTOGRAM - Secure Admin Image Upload API
 * Handles single and multiple file uploads, validation, EXIF correction,
 * proportional resizing, WebP conversion, and atomic metadata persistence.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../image_processor.php';

header('Content-Type: application/json; charset=utf-8');

// Administrative guards
require_admin_api();
require_csrf_api();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'error' => 'Method not allowed. POST required.'], 405);
}

// Check if any files were uploaded
$uploadedFiles = [];
if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
    $count = count($_FILES['images']['name']);
    for ($i = 0; $i < $count; $i++) {
        if (!empty($_FILES['images']['name'][$i])) {
            $uploadedFiles[] = [
                'name'     => $_FILES['images']['name'][$i],
                'type'     => $_FILES['images']['type'][$i] ?? '',
                'tmp_name' => $_FILES['images']['tmp_name'][$i],
                'error'    => $_FILES['images']['error'][$i],
                'size'     => $_FILES['images']['size'][$i]
            ];
        }
    }
} elseif (!empty($_FILES['image']) && is_string($_FILES['image']['name'])) {
    $uploadedFiles[] = $_FILES['image'];
}

if (empty($uploadedFiles)) {
    json_response(['success' => false, 'error' => 'No image files were provided for upload.'], 400);
}

// Request metadata parameters
$categoryInput = trim($_POST['category'] ?? 'weddings');
$validCategory = array_key_exists($categoryInput, ALLOWED_CATEGORIES) ? $categoryInput : 'weddings';

$customTitle = trim($_POST['title'] ?? '');
$customAlt = trim($_POST['alt'] ?? '');
$customLayout = trim($_POST['layout_class'] ?? '');

$createdFiles = [];
$newItems = [];
$errors = [];

// Load existing gallery items safely
$gallery = read_json_file(GALLERY_JSON, []);

foreach ($uploadedFiles as $index => $file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $file['error'];
        $errors[] = "Upload failed for '{$file['name']}': PHP error code {$errorCode}.";
        continue;
    }

    if ($file['size'] > MAX_UPLOAD_SIZE) {
        $errors[] = "File '{$file['name']}' exceeds the maximum allowed size of 15MB.";
        continue;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowedExts, true)) {
        $errors[] = "File '{$file['name']}' has an unsupported extension (.'{$ext}'). Allowed: JPG, PNG, WebP.";
        continue;
    }

    try {
        $result = ImageProcessor::processUpload($file['tmp_name'], UPLOAD_DIR);
        $createdFiles[] = $result['full_path'];

        // Determine title & alt
        $filenameWithoutExt = pathinfo($file['name'], PATHINFO_FILENAME);
        $cleanName = ucwords(trim(preg_replace('/[_\-\+]+/', ' ', $filenameWithoutExt)));
        
        $itemTitle = !empty($customTitle) && count($uploadedFiles) === 1 ? $customTitle : ($cleanName ?: 'Portfolio Image');
        $itemAlt = !empty($customAlt) && count($uploadedFiles) === 1 ? $customAlt : $itemTitle;

        $newItems[] = [
            'id'           => 'img_' . bin2hex(random_bytes(6)),
            'title'        => htmlspecialchars($itemTitle, ENT_QUOTES, 'UTF-8'),
            'alt'          => htmlspecialchars($itemAlt, ENT_QUOTES, 'UTF-8'),
            'category'     => $validCategory,
            'image_path'   => $result['path'],
            'layout_class' => $customLayout ?: 'port-custom',
            'block'        => 5, // Appended dynamic block
            'is_default'   => false,
            'created_at'   => date('Y-m-d H:i:s'),
            'width'        => $result['width'],
            'height'       => $result['height'],
            'filesize'     => $result['filesize']
        ];
    } catch (\Throwable $e) {
        $errors[] = "Processing failed for '{$file['name']}': " . $e->getMessage();
    }
}

// If no items were successfully processed, cleanup and return error
if (empty($newItems)) {
    foreach ($createdFiles as $f) {
        if (file_exists($f)) {
            @unlink($f);
        }
    }
    json_response([
        'success' => false,
        'error'   => 'All file uploads failed.',
        'details' => $errors
    ], 400);
}

// Append new items to gallery catalog
$updatedGallery = array_merge($gallery, $newItems);

// Write to JSON atomically with file lock
$saved = write_json_file(GALLERY_JSON, $updatedGallery);

if (!$saved) {
    // Revert files to prevent orphaned files
    foreach ($createdFiles as $f) {
        if (file_exists($f)) {
            @unlink($f);
        }
    }
    json_response([
        'success' => false,
        'error'   => 'Failed to update gallery catalog database safely. Upload rolled back.'
    ], 500);
}

json_response([
    'success' => true,
    'message' => count($newItems) . ' image(s) processed and published successfully.',
    'count'   => count($newItems),
    'items'   => $newItems,
    'warnings'=> $errors
], 201);
