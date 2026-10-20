<?php
/**
 * LE PHOTOGRAM - Luxury Admin Portal Login
 * Pure PHP session-based authentication with Bcrypt and CSRF protection.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

// Redirect if already authenticated
if (is_admin_logged_in()) {
    header('Location: index.php');
    exit;
}

$errorMessage = '';
$noticeMessage = '';

if (isset($_GET['error']) && $_GET['error'] === 'expired') {
    $noticeMessage = 'Your administrative session has timed out. Please sign in again.';
} elseif (isset($_GET['logged_out'])) {
    $noticeMessage = 'You have been securely signed out of the studio portal.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedCsrf = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($submittedCsrf)) {
        $errorMessage = 'Security verification failed (invalid CSRF token). Please refresh and try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = (string)($_POST['password'] ?? '');

        if (empty($username) || empty($password)) {
            $errorMessage = 'Please enter both your studio username and master password.';
        } elseif (attempt_login($username, $password)) {
            header('Location: index.php');
            exit;
        } else {
            $errorMessage = 'Access denied. The credentials provided do not match studio records.';
        }
    }
}

$csrfToken = get_csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Access | Le PhotoGRAM Atelier</title>
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/components.css">
  <style>
    html, body {
      background-color: #0c0c0c !important;
      background: #0c0c0c !important;
      color: #FAF8F5;
      font-family: var(--font-sans);
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
      position: relative;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    body::before {
      content: "";
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 500px;
      background: radial-gradient(circle, rgba(128, 0, 0, 0.16) 0%, rgba(14, 14, 14, 0) 70%);
      pointer-events: none;
      z-index: 0;
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      background: #141414;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
      padding: 44px 38px 40px;
      box-sizing: border-box;
    }

    .login-brand {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-brand-title {
      font-family: var(--font-serif);
      font-size: 26px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #FAF8F5;
      margin: 0 0 8px 0;
      font-weight: 400;
    }

    .login-brand-subtitle {
      font-family: var(--font-sans);
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(250, 248, 245, 0.5);
      margin: 0;
    }

    .login-divider {
      width: 40px;
      height: 1px;
      background: #800000;
      margin: 16px auto 0;
    }

    .login-alert {
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 22px;
      border-left: 2px solid;
    }

    .login-alert-error {
      background: rgba(128, 0, 0, 0.15);
      border-color: #800000;
      color: #ff9999;
    }

    .login-alert-notice {
      background: rgba(253, 240, 213, 0.08);
      border-color: #FDF0D5;
      color: #FDF0D5;
    }

    .login-form-group {
      margin-bottom: 22px;
    }

    .login-label {
      display: block;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(250, 248, 245, 0.7);
      margin-bottom: 8px;
    }

    .login-input {
      width: 100%;
      background: #1c1c1c;
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #FAF8F5;
      padding: 13px 16px;
      font-family: var(--font-sans);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.25s ease, background 0.25s ease;
    }

    .login-input:focus {
      border-color: #800000;
      background: #222222;
    }

    .login-btn {
      width: 100%;
      background: #800000;
      color: #FFFFFF;
      border: 1px solid #800000;
      padding: 14px 20px;
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.25s ease, transform 0.15s ease;
      margin-top: 10px;
    }

    .login-btn:hover {
      background: #9E0000;
      border-color: #9E0000;
    }

    .login-btn:active {
      transform: scale(0.99);
    }

    .login-back-link {
      display: block;
      text-align: center;
      margin-top: 26px;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: rgba(250, 248, 245, 0.45);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .login-back-link:hover {
      color: #FDF0D5;
    }
  </style>
</head>
<body>

  <div class="login-container">
    <div class="login-brand">
      <h1 class="login-brand-title">LE PHOTOGRAM</h1>
      <p class="login-brand-subtitle">STUDIO ATELIER &bull; PORTAL AUTHENTICATION</p>
      <div class="login-divider"></div>
    </div>

    <?php if (!empty($errorMessage)): ?>
      <div class="login-alert login-alert-error" role="alert">
        <?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?>
      </div>
    <?php endif; ?>

    <?php if (!empty($noticeMessage)): ?>
      <div class="login-alert login-alert-notice" role="status">
        <?= htmlspecialchars($noticeMessage, ENT_QUOTES, 'UTF-8') ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="login.php" autocomplete="off">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

      <div class="login-form-group">
        <label for="username" class="login-label">Administrator Account</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          class="login-input" 
          required 
          autofocus 
          placeholder="admin"
          value="<?= isset($_POST['username']) ? htmlspecialchars($_POST['username'], ENT_QUOTES, 'UTF-8') : '' ?>"
        >
      </div>

      <div class="login-form-group">
        <label for="password" class="login-label">Master Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="login-input" 
          required 
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
        >
      </div>

      <button type="submit" class="login-btn">
        Enter Atelier Portal &rarr;
      </button>

      <a href="../portfolio.html" class="login-back-link">
        &larr; Return to Public Portfolio
      </a>
    </form>
  </div>

</body>
</html>
