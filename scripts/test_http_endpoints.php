<?php
/**
 * LE PHOTOGRAM - Live HTTP Endpoint & Security Integration Test
 * Starts PHP built-in server on 127.0.0.1:8088, runs HTTP requests, and verifies responses.
 */

$host = '127.0.0.1';
$port = 8088;
$baseUrl = "http://{$host}:{$port}";

echo "Starting PHP built-in server on {$baseUrl}...\n";

// Launch PHP server in background process
$serverCmd = "php -S {$host}:{$port} -t \"" . dirname(__DIR__) . "\"";
$descriptors = [
    0 => ["pipe", "r"],
    1 => ["pipe", "w"],
    2 => ["pipe", "w"]
];
$serverProcess = proc_open($serverCmd, $descriptors, $pipes, dirname(__DIR__));

if (!is_resource($serverProcess)) {
    die("Failed to start PHP development server.\n");
}

// Give server 500ms to bind port
usleep(600000);

$cookieJar = tempnam(sys_get_temp_dir(), 'lp_cookie_');

function http_req(string $url, string $method = 'GET', $data = null, array $headers = [], $cookieJar = null): array {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    if ($cookieJar) {
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
    }

    if ($data !== null) {
        if (is_array($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        } else {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
    }

    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    $raw = curl_exec($ch);
    $info = curl_getinfo($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $headerStr = substr($raw, 0, $headerSize);
    $bodyStr = substr($raw, $headerSize);

    return [
        'status'  => $info['http_code'],
        'headers' => $headerStr,
        'body'    => $bodyStr,
        'json'    => json_decode($bodyStr, true)
    ];
}

$allPassed = true;

try {
    echo "\n--- 1. Testing Public Gallery API ---\n";
    $res = http_req("{$baseUrl}/api/gallery.php");
    echo "Gallery API status: {$res['status']}\n";
    if ($res['status'] === 200 && $res['json']['success'] === true && count($res['json']['data']) >= 27) {
        echo " [PASS] Public gallery returned 200 OK with {$res['json']['total']} images.\n";
    } else {
        echo " [FAIL] Unexpected gallery response.\n";
        $allPassed = false;
    }

    echo "\n--- 2. Testing Gallery Category Filter ---\n";
    $resWed = http_req("{$baseUrl}/api/gallery.php?category=weddings");
    if ($resWed['status'] === 200 && $resWed['json']['success'] === true) {
        $wedCount = count($resWed['json']['data']);
        echo " [PASS] Category filter 'weddings' returned {$wedCount} items.\n";
    } else {
        echo " [FAIL] Category filter failed.\n";
        $allPassed = false;
    }

    echo "\n--- 3. Testing Public About & Works APIs ---\n";
    $resAbout = http_req("{$baseUrl}/api/about.php");
    if ($resAbout['status'] === 200 && !empty($resAbout['json']['data']['hero_title'])) {
        echo " [PASS] Public About API returned 200 OK.\n";
    } else {
        echo " [FAIL] About API failed.\n";
        $allPassed = false;
    }

    $resWorks = http_req("{$baseUrl}/api/works.php");
    if ($resWorks['status'] === 200 && count($resWorks['json']['data']) === 6) {
        echo " [PASS] Public Works API returned 200 OK with 6 stories.\n";
    } else {
        echo " [FAIL] Works API failed.\n";
        $allPassed = false;
    }

    echo "\n--- 4. Testing Unauthorized Protection on Admin APIs ---\n";
    $resUnauthUpload = http_req("{$baseUrl}/admin/api/upload.php", 'POST');
    if ($resUnauthUpload['status'] === 401) {
        echo " [PASS] Unauthenticated upload request rejected with 401 Unauthorized.\n";
    } else {
        echo " [FAIL] Unauthenticated upload returned status {$resUnauthUpload['status']}.\n";
        $allPassed = false;
    }

    $resUnauthDelete = http_req("{$baseUrl}/admin/api/delete.php", 'POST');
    if ($resUnauthDelete['status'] === 401) {
        echo " [PASS] Unauthenticated delete request rejected with 401 Unauthorized.\n";
    } else {
        echo " [FAIL] Unauthenticated delete returned status {$resUnauthDelete['status']}.\n";
        $allPassed = false;
    }

    echo "\n--- 5. Testing Admin Login Workflow ---\n";
    // 5a. Fetch login page to get CSRF token
    $resLoginPage = http_req("{$baseUrl}/admin/login.php", 'GET', null, [], $cookieJar);
    preg_match('/name="csrf_token"\s+value="([^"]+)"/', $resLoginPage['body'], $csrfMatch);
    $loginCsrf = $csrfMatch[1] ?? '';

    if (empty($loginCsrf)) {
        echo " [FAIL] Could not extract login CSRF token.\n";
        $allPassed = false;
    } else {
        echo " [PASS] Obtained login CSRF token: " . substr($loginCsrf, 0, 10) . "...\n";

        // 5b. Submit login form with valid credentials
        $loginPost = http_req("{$baseUrl}/admin/login.php", 'POST', [
            'username'   => 'admin',
            'password'   => 'AdminPassword2026!',
            'csrf_token' => $loginCsrf
        ], [], $cookieJar);

        // Login should redirect with 302 to index.php
        if ($loginPost['status'] === 302 && str_contains($loginPost['headers'], 'Location: index.php')) {
            echo " [PASS] Authentication succeeded: 302 Redirect to index.php.\n";
        } else {
            echo " [FAIL] Login failed. Status: {$loginPost['status']}\n";
            $allPassed = false;
        }

        // 5c. Request admin dashboard with authenticated session
        $resDash = http_req("{$baseUrl}/admin/index.php", 'GET', null, [], $cookieJar);
        preg_match('/name="csrf-token"\s+content="([^"]+)"/', $resDash['body'], $dashCsrfMatch);
        $adminCsrf = $dashCsrfMatch[1] ?? '';

        if ($resDash['status'] === 200 && !empty($adminCsrf)) {
            echo " [PASS] Admin dashboard loaded with authenticated session. Admin CSRF token verified.\n";
        } else {
            echo " [FAIL] Admin dashboard could not be loaded.\n";
            $allPassed = false;
        }

        echo "\n--- 6. Testing Authenticated Image Upload via HTTP API ---\n";
        // Create a test image to upload via multipart/form-data
        $testUploadImg = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'http_test_' . time() . '.jpg';
        $im = imagecreatetruecolor(800, 600);
        $c = imagecolorallocate($im, 70, 130, 180);
        imagefilledrectangle($im, 0, 0, 800, 600, $c);
        imagejpeg($im, $testUploadImg, 95);
        imagedestroy($im);

        $cfile = new CURLFile($testUploadImg, 'image/jpeg', 'http_test_ceremony.jpg');
        $uploadRes = http_req(
            "{$baseUrl}/admin/api/upload.php",
            'POST',
            [
                'images[]'   => $cfile,
                'category'   => 'weddings',
                'title'      => 'HTTP Live Test Ceremony',
                'csrf_token' => $adminCsrf
            ],
            ["X-CSRF-Token: {$adminCsrf}"],
            $cookieJar
        );
        @unlink($testUploadImg);

        $newImageId = null;
        if ($uploadRes['status'] === 201 && $uploadRes['json']['success'] === true) {
            $newImageId = $uploadRes['json']['items'][0]['id'] ?? null;
            echo " [PASS] Image uploaded and converted to WebP. HTTP 201 Created. Item ID: {$newImageId}\n";
        } else {
            echo " [FAIL] Image upload failed: " . ($uploadRes['body'] ?: 'empty') . "\n";
            $allPassed = false;
        }

        echo "\n--- 7. Testing Public Gallery Dynamic Synchronization ---\n";
        $galleryCheck = http_req("{$baseUrl}/api/gallery.php");
        $foundInPublic = false;
        if ($galleryCheck['json'] && !empty($galleryCheck['json']['data'])) {
            foreach ($galleryCheck['json']['data'] as $it) {
                if ($it['id'] === $newImageId) {
                    $foundInPublic = true;
                    break;
                }
            }
        }
        if ($foundInPublic) {
            echo " [PASS] Newly uploaded image immediately available in public gallery API.\n";
        } else {
            echo " [FAIL] Uploaded image not found in public gallery API.\n";
            $allPassed = false;
        }

        echo "\n--- 8. Testing Protected Seed Image Deletion Rejection ---\n";
        $seedDeleteRes = http_req(
            "{$baseUrl}/admin/api/delete.php",
            'POST',
            json_encode(['id' => 'seed-1', 'csrf_token' => $adminCsrf]),
            ['Content-Type: application/json', "X-CSRF-Token: {$adminCsrf}"],
            $cookieJar
        );
        if ($seedDeleteRes['status'] === 403) {
            echo " [PASS] Attempt to delete protected seed image 'seed-1' rejected with 403 Forbidden.\n";
        } else {
            echo " [FAIL] Protected seed deletion returned status {$seedDeleteRes['status']}.\n";
            $allPassed = false;
        }

        echo "\n--- 9. Testing Authenticated Image Deletion via HTTP API ---\n";
        if ($newImageId) {
            $delRes = http_req(
                "{$baseUrl}/admin/api/delete.php",
                'POST',
                json_encode(['id' => $newImageId, 'csrf_token' => $adminCsrf]),
                ['Content-Type: application/json', "X-CSRF-Token: {$adminCsrf}"],
                $cookieJar
            );

            if ($delRes['status'] === 200 && $delRes['json']['success'] === true && $delRes['json']['deleted_count'] === 1) {
                echo " [PASS] Uploaded image deleted cleanly via HTTP API. Count: 1\n";
            } else {
                echo " [FAIL] Deletion failed. Status: {$delRes['status']}\n";
                $allPassed = false;
            }

            // Verify it disappeared from public gallery
            $galleryAfterDel = http_req("{$baseUrl}/api/gallery.php");
            $stillInPublic = false;
            foreach ($galleryAfterDel['json']['data'] as $it) {
                if ($it['id'] === $newImageId) {
                    $stillInPublic = true;
                    break;
                }
            }
            if (!$stillInPublic) {
                echo " [PASS] Deleted image successfully removed from public gallery catalogue.\n";
            } else {
                echo " [FAIL] Deleted image still present in gallery.\n";
                $allPassed = false;
            }
        }

        echo "\n--- 10. Testing Admin Logout ---\n";
        $logoutRes = http_req("{$baseUrl}/admin/logout.php", 'GET', null, [], $cookieJar);
        if ($logoutRes['status'] === 302 && str_contains($logoutRes['headers'], 'login.php')) {
            echo " [PASS] Logout destroyed session and redirected to login.php.\n";
        } else {
            echo " [FAIL] Logout did not redirect to login.\n";
            $allPassed = false;
        }

        // Verify session is really gone
        $postLogoutDash = http_req("{$baseUrl}/admin/index.php", 'GET', null, [], $cookieJar);
        if ($postLogoutDash['status'] === 302 && str_contains($postLogoutDash['headers'], 'login.php')) {
            echo " [PASS] Access to admin dashboard after logout is immediately redirected to login page.\n";
        } else {
            echo " [FAIL] Dashboard accessible after logout!\n";
            $allPassed = false;
        }
    }
} finally {
    // Terminate server process
    proc_terminate($serverProcess);
    @unlink($cookieJar);
    echo "\nServer terminated.\n";
}

if ($allPassed) {
    echo "\n=======================================================\n";
    echo "ALL HTTP ENDPOINT & SECURITY TESTS PASSED PERFECTLY!\n";
    echo "=======================================================\n";
    exit(0);
} else {
    echo "\n=======================================================\n";
    echo "SOME HTTP TESTS FAILED.\n";
    echo "=======================================================\n";
    exit(1);
}
