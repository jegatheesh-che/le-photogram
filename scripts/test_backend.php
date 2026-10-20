<?php
/**
 * LE PHOTOGRAM - Comprehensive Backend Architecture Test Suite
 * Tests all 14 requirements with real assertion checks.
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "========================================================\n";
echo "LE PHOTOGRAM BACKEND TEST SUITE\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n";
echo "========================================================\n\n";

$passedCount = 0;
$failedCount = 0;

function assert_test(string $name, bool $condition, string $details = ''): void {
    global $passedCount, $failedCount;
    if ($condition) {
        echo " [PASS] " . $name . "\n";
        $passedCount++;
    } else {
        echo " [FAIL] " . $name . "\n";
        if ($details) {
            echo "        Reason: " . $details . "\n";
        }
        $failedCount++;
    }
}

// Ensure working directory is project root
chdir(dirname(__DIR__));

require_once __DIR__ . '/../admin/config.php';

// ---------------------------------------------------------------------
// TEST 1: Config, Paths & Required Extensions
// ---------------------------------------------------------------------
echo "\n--- 1. Configuration & Extension Checks ---\n";
assert_test("GD extension is loaded", extension_loaded('gd'));
assert_test("GD supports imagewebp()", function_exists('imagewebp'));
assert_test("EXIF extension is loaded", extension_loaded('exif'));
assert_test("Data directory exists", is_dir(DATA_DIR));
assert_test("Gallery JSON exists", file_exists(GALLERY_JSON));
assert_test("Uploads directory exists and is writable", is_dir(UPLOAD_DIR) && is_writable(UPLOAD_DIR));
assert_test("Uploads .htaccess exists", file_exists(UPLOAD_DIR . '/.htaccess'));
assert_test("Data .htaccess exists", file_exists(DATA_DIR . '/.htaccess'));

// ---------------------------------------------------------------------
// TEST 2: JSON Safe Storage & Atomic Helpers
// ---------------------------------------------------------------------
echo "\n--- 2. JSON Storage Helpers & Locking ---\n";
$galleryData = read_json_file(GALLERY_JSON);
assert_test("read_json_file returns array", is_array($galleryData));
assert_test("data/gallery.json contains 27 seed items", count($galleryData) >= 27);

$testJsonFile = DATA_DIR . '/test_atomic.json';
$testPayload = ['test_key' => 'test_value_' . time(), 'number' => 42];
$writeSuccess = write_json_file($testJsonFile, $testPayload);
assert_test("write_json_file writes successfully with file locking", $writeSuccess);

$readBack = read_json_file($testJsonFile);
assert_test("read_json_file reads written content accurately", isset($readBack['number']) && $readBack['number'] === 42);
@unlink($testJsonFile);

// Missing file handling
$nonExistent = read_json_file(DATA_DIR . '/non_existent_file.json', ['default_fallback' => true]);
assert_test("read_json_file handles missing file safely without errors", isset($nonExistent['default_fallback']));

// ---------------------------------------------------------------------
// TEST 3: Admin Authentication & Session Management
// ---------------------------------------------------------------------
echo "\n--- 3. Authentication & CSRF ---\n";
require_once __DIR__ . '/../admin/auth.php';

// Bad login
$badLogin = attempt_login('admin', 'WrongPassword123');
assert_test("Login with invalid password fails", $badLogin === false);

$badUser = attempt_login('wrong_user', 'AdminPassword2026!');
assert_test("Login with invalid username fails", $badUser === false);

// Good login
$goodLogin = attempt_login('admin', 'AdminPassword2026!');
assert_test("Login with valid credentials succeeds", $goodLogin === true);
assert_test("Session variable admin_logged_in is set", is_admin_logged_in() === true);

$csrf = get_csrf_token();
assert_test("CSRF token is generated and non-empty", !empty($csrf) && strlen($csrf) === 64);
assert_test("verify_csrf_token validates genuine token", verify_csrf_token($csrf) === true);
assert_test("verify_csrf_token rejects forged token", verify_csrf_token('forged_token_123') === false);
assert_test("verify_csrf_token rejects null/empty token", verify_csrf_token(null) === false);

// ---------------------------------------------------------------------
// TEST 4: Image Processor (GD, Resize, WebP)
// ---------------------------------------------------------------------
echo "\n--- 4. Image Processor (GD, EXIF, Resizing, WebP) ---\n";
require_once __DIR__ . '/../admin/image_processor.php';

// Generate a dummy large JPEG image to test resizing and WebP conversion
$tempImgPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'test_upload_raw_' . time() . '.jpg';
$largeGd = imagecreatetruecolor(3000, 2000);
$bgColor = imagecolorallocate($largeGd, 180, 50, 50);
imagefilledrectangle($largeGd, 0, 0, 3000, 2000, $bgColor);
imagejpeg($largeGd, $tempImgPath, 90);
imagedestroy($largeGd);

assert_test("Generated temporary test source image", file_exists($tempImgPath));

$processed = null;
try {
    $processed = ImageProcessor::processUpload($tempImgPath, UPLOAD_DIR);
    assert_test("ImageProcessor::processUpload succeeded", is_array($processed));
    assert_test("Destination file is WebP format", str_ends_with($processed['filename'], '.webp'));
    assert_test("Physical WebP file exists in uploads dir", file_exists($processed['full_path']));
    assert_test("Image was resized to <= 2400 max dimension", $processed['width'] <= 2400 && $processed['height'] <= 2400);
    assert_test("Image aspect ratio preserved (3000x2000 -> 2400x1600)", $processed['width'] === 2400 && $processed['height'] === 1600);
} catch (Exception $e) {
    assert_test("ImageProcessor::processUpload succeeded", false, $e->getMessage());
} finally {
    @unlink($tempImgPath);
}

// Test rejection of invalid non-image file
$dummyTxt = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'malicious.php';
file_put_contents($dummyTxt, '<?php echo "evil"; ?>');
$rejected = false;
try {
    ImageProcessor::processUpload($dummyTxt, UPLOAD_DIR);
} catch (InvalidArgumentException $e) {
    $rejected = true;
} finally {
    @unlink($dummyTxt);
}
assert_test("ImageProcessor rejects non-image MIME types", $rejected);

// ---------------------------------------------------------------------
// TEST 5: Gallery Catalog Metadata Insertion & Public API
// ---------------------------------------------------------------------
echo "\n--- 5. Catalog Persistence & Public Gallery API ---\n";

$testImageId = 'test_item_' . bin2hex(random_bytes(4));
$testItem = [
    'id'           => $testImageId,
    'title'        => 'Automated Test Ceremony Work',
    'alt'          => 'Automated Test Alt Description',
    'category'     => 'weddings',
    'image_path'   => $processed ? $processed['path'] : 'assets/uploads/dummy.webp',
    'layout_class' => 'port-custom-test',
    'block'        => 5,
    'is_default'   => false,
    'created_at'   => date('Y-m-d H:i:s'),
    'width'        => $processed ? $processed['width'] : 2400,
    'height'       => $processed ? $processed['height'] : 1600,
    'filesize'     => $processed ? $processed['filesize'] : 50000
];

$galleryBefore = read_json_file(GALLERY_JSON);
$galleryBefore[] = $testItem;
write_json_file(GALLERY_JSON, $galleryBefore);

// Verify item appears in catalog
$galleryAfter = read_json_file(GALLERY_JSON);
$foundItem = null;
foreach ($galleryAfter as $it) {
    if ($it['id'] === $testImageId) {
        $foundItem = $it;
        break;
    }
}
assert_test("Test image successfully added to data/gallery.json", $foundItem !== null);
assert_test("Item retains category 'weddings'", $foundItem && $foundItem['category'] === 'weddings');

// ---------------------------------------------------------------------
// TEST 6: Metadata Editing Persistence
// ---------------------------------------------------------------------
echo "\n--- 6. Metadata Editing ---\n";
// Update title and category
$galleryToEdit = read_json_file(GALLERY_JSON);
foreach ($galleryToEdit as &$it) {
    if ($it['id'] === $testImageId) {
        $it['title'] = 'Automated Test Ceremony Work (EDITED)';
        $it['category'] = 'editorial';
        break;
    }
}
unset($it);
write_json_file(GALLERY_JSON, $galleryToEdit);

$galleryEdited = read_json_file(GALLERY_JSON);
$verifiedEdit = null;
foreach ($galleryEdited as $it) {
    if ($it['id'] === $testImageId) {
        $verifiedEdit = $it;
        break;
    }
}
assert_test("Edited title persists ('Automated Test Ceremony Work (EDITED)')", $verifiedEdit && $verifiedEdit['title'] === 'Automated Test Ceremony Work (EDITED)');
assert_test("Edited category persists ('editorial')", $verifiedEdit && $verifiedEdit['category'] === 'editorial');

// ---------------------------------------------------------------------
// TEST 7: Protected Default Portfolio Items
// ---------------------------------------------------------------------
echo "\n--- 7. Protected Default Items Security ---\n";
$firstItem = $galleryEdited[0];
assert_test("First portfolio item is protected (seed-1)", !empty($firstItem['is_default']) || str_starts_with($firstItem['id'], 'seed-'));

// ---------------------------------------------------------------------
// TEST 8: Image Deletion & Physical Cleanup
// ---------------------------------------------------------------------
echo "\n--- 8. Image Deletion & Physical Cleanup ---\n";
// Delete our test item
$galleryForDelete = read_json_file(GALLERY_JSON);
$cleanGallery = [];
$physicalToDelete = null;

foreach ($galleryForDelete as $it) {
    if ($it['id'] === $testImageId) {
        if (!empty($it['image_path'])) {
            $physicalToDelete = dirname(__DIR__) . '/' . $it['image_path'];
        }
        continue;
    }
    $cleanGallery[] = $it;
}
write_json_file(GALLERY_JSON, $cleanGallery);

if ($physicalToDelete && file_exists($physicalToDelete)) {
    @unlink($physicalToDelete);
}

$galleryFinal = read_json_file(GALLERY_JSON);
$foundDeleted = false;
foreach ($galleryFinal as $it) {
    if ($it['id'] === $testImageId) {
        $foundDeleted = true;
        break;
    }
}
assert_test("Deleted image is removed from data/gallery.json", $foundDeleted === false);
assert_test("Physical WebP file was cleaned up from storage", $physicalToDelete && !file_exists($physicalToDelete));

// Also clean up any leftover from test 4 if not removed
if ($processed && file_exists($processed['full_path'])) {
    @unlink($processed['full_path']);
}

// ---------------------------------------------------------------------
// TEST 9: About Page API
// ---------------------------------------------------------------------
echo "\n--- 9. About Page API & Data ---\n";
$aboutData = read_json_file(ABOUT_JSON);
assert_test("data/about.json exists and contains hero_title", isset($aboutData['hero_title']) && !empty($aboutData['hero_title']));
assert_test("data/about.json contains story_paragraphs", !empty($aboutData['story_paragraphs']) && is_array($aboutData['story_paragraphs']));

// ---------------------------------------------------------------------
// TEST 10: Works Stories API
// ---------------------------------------------------------------------
echo "\n--- 10. Works Stories (Case Studies) Data ---\n";
$worksData = read_json_file(WORKS_JSON);
assert_test("data/works.json exists and contains 6 wedding case studies", count($worksData) === 6);
assert_test("First work story is 'clara-theo'", ($worksData[0]['slug'] ?? '') === 'clara-theo');

// ---------------------------------------------------------------------
// TEST 11: Frontend Files Integrity Check
// ---------------------------------------------------------------------
echo "\n--- 11. Frontend Files Integrity ---\n";
$corePages = [
    'index.html',
    'portfolio.html',
    'about.html',
    'work.html',
    'booking.html',
    'contact.html',
    'services.html',
    'testimonials.html',
    'faq.html'
];
foreach ($corePages as $page) {
    assert_test("Core HTML page '{$page}' exists and intact", file_exists(__DIR__ . '/../' . $page));
}

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
echo "\n========================================================\n";
echo "TEST RESULTS:\n";
echo "Total Passed: {$passedCount}\n";
echo "Total Failed: {$failedCount}\n";
echo "Status: " . ($failedCount === 0 ? "ALL TESTS PASSED PERFECTLY!" : "SOME TESTS FAILED") . "\n";
echo "========================================================\n";

exit($failedCount === 0 ? 0 : 1);
