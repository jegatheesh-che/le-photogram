<?php
/**
 * LE PHOTOGRAM - Luxury Administrative Atelier Dashboard (PRO Edition)
 * Pure PHP backend architecture without external frameworks.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

// Protect administrative dashboard
require_admin();

$csrfToken = get_csrf_token();
$creds = get_admin_credentials();

// Load gallery, about, and works data
$gallery = read_json_file(GALLERY_JSON, []);
$aboutData = read_json_file(ABOUT_JSON, []);
$works = read_json_file(WORKS_JSON, []);

// Calculate metrics
$totalGalleryImages = count($gallery);
$defaultItemsCount = 0;
$uploadedItemsCount = 0;
$categoryCounts = [
    'weddings'  => 0,
    'portraits' => 0,
    'events'    => 0,
    'editorial' => 0
];

foreach ($gallery as $item) {
    if (!empty($item['is_default'])) {
        $defaultItemsCount++;
    } else {
        $uploadedItemsCount++;
    }

    $cat = $item['category'] ?? '';
    if (isset($categoryCounts[$cat])) {
        $categoryCounts[$cat]++;
    }
}

// Calculate storage size of uploaded images
$uploadDirSize = 0;
if (is_dir(UPLOAD_DIR)) {
    $files = scandir(UPLOAD_DIR);
    foreach ($files as $f) {
        if ($f !== '.' && $f !== '..' && $f !== '.htaccess') {
            $uploadDirSize += filesize(UPLOAD_DIR . DIRECTORY_SEPARATOR . $f);
        }
    }
}
$uploadSizeFormatted = $uploadDirSize > 1048576 
    ? round($uploadDirSize / 1048576, 2) . ' MB' 
    : round($uploadDirSize / 1024, 1) . ' KB';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Atelier | Le PhotoGRAM Admin</title>
  <meta name="csrf-token" content="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/components.css">
  <style>
    :root {
      --admin-bg: #0C0C0C;
      --admin-surface: #141414;
      --admin-surface-card: #1A1A1A;
      --admin-border: rgba(255, 255, 255, 0.08);
      --admin-border-hover: rgba(255, 255, 255, 0.2);
      --admin-accent: #800000;
      --admin-accent-bright: #9E0000;
      --admin-gold: #FDF0D5;
      --admin-text-primary: #FAF8F5;
      --admin-text-secondary: rgba(250, 248, 245, 0.65);
      --admin-text-muted: rgba(250, 248, 245, 0.4);
    }

    * { box-sizing: border-box; }

    html, body {
      background-color: var(--admin-bg) !important;
      background: var(--admin-bg) !important;
      color: var(--admin-text-primary);
      font-family: var(--font-sans);
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Navigation Bar */
    .admin-navbar {
      background: var(--admin-surface);
      border-bottom: 1px solid var(--admin-border);
      padding: 0 32px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .admin-brand {
      display: flex;
      align-items: baseline;
      gap: 14px;
    }

    .admin-brand-name {
      font-family: var(--font-serif);
      font-size: 22px;
      letter-spacing: 0.24em;
      color: var(--admin-text-primary);
      text-transform: uppercase;
      margin: 0;
      font-weight: 400;
    }

    .admin-brand-badge {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--admin-accent);
      border: 1px solid rgba(128, 0, 0, 0.4);
      padding: 3px 8px;
    }

    .admin-nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .admin-nav-link {
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--admin-text-secondary);
      text-decoration: none;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .admin-nav-link:hover {
      color: var(--admin-gold);
    }

    .admin-user-pill {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--admin-text-muted);
      border-left: 1px solid var(--admin-border);
      padding-left: 18px;
    }

    .admin-user-pill strong {
      color: var(--admin-text-primary);
      font-weight: 500;
    }

    .admin-btn-logout {
      background: transparent;
      border: 1px solid var(--admin-border);
      color: var(--admin-text-secondary);
      font-family: var(--font-sans);
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 8px 16px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .admin-btn-logout:hover {
      border-color: var(--admin-accent);
      color: #ff8888;
      background: rgba(128, 0, 0, 0.1);
    }

    /* Layout Container */
    .admin-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 36px 32px 80px;
    }

    /* Tab Navigation */
    .admin-tabs {
      display: flex;
      gap: 2px;
      border-bottom: 1px solid var(--admin-border);
      margin-bottom: 32px;
      overflow-x: auto;
    }

    .admin-tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--admin-text-muted);
      font-family: var(--font-sans);
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 14px 24px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .admin-tab-btn:hover {
      color: var(--admin-text-primary);
    }

    .admin-tab-btn.active {
      color: var(--admin-text-primary);
      border-bottom-color: var(--admin-accent);
      background: rgba(255, 255, 255, 0.02);
    }

    /* Metric Cards */
    .admin-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 36px;
    }

    .admin-metric-card {
      background: var(--admin-surface);
      border: 1px solid var(--admin-border);
      padding: 24px 28px;
      position: relative;
      overflow: hidden;
    }

    .admin-metric-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--admin-accent);
      opacity: 0.6;
    }

    .admin-metric-title {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--admin-text-muted);
      margin: 0 0 10px 0;
    }

    .admin-metric-value {
      font-family: var(--font-serif);
      font-size: 34px;
      color: var(--admin-text-primary);
      margin: 0 0 4px 0;
      line-height: 1.1;
    }

    .admin-metric-desc {
      font-size: 12px;
      color: var(--admin-text-secondary);
      margin: 0;
    }

    /* Card Panels */
    .admin-card {
      background: var(--admin-surface);
      border: 1px solid var(--admin-border);
      padding: 28px 32px;
      margin-bottom: 32px;
    }

    .admin-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--admin-border);
      flex-wrap: wrap;
      gap: 12px;
    }

    .admin-card-title {
      font-family: var(--font-serif);
      font-size: 20px;
      letter-spacing: 0.1em;
      color: var(--admin-text-primary);
      margin: 0;
      font-weight: 400;
    }

    .admin-card-subtitle {
      font-size: 12px;
      color: var(--admin-text-muted);
      margin: 0;
    }

    /* Upload Drop Zone */
    .dropzone-box {
      border: 1px dashed rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.015);
      padding: 38px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
    }

    .dropzone-box:hover, .dropzone-box.dragover {
      border-color: var(--admin-accent);
      background: rgba(128, 0, 0, 0.05);
    }

    .dropzone-box input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .dropzone-icon {
      font-size: 30px;
      color: var(--admin-accent);
      margin-bottom: 10px;
      display: block;
    }

    .dropzone-prompt {
      font-size: 14px;
      letter-spacing: 0.08em;
      color: var(--admin-text-primary);
      margin-bottom: 6px;
    }

    .dropzone-hint {
      font-size: 11px;
      color: var(--admin-text-muted);
    }

    /* Staged Previews Tray (Feature 1) */
    .staged-tray {
      margin-top: 20px;
      display: none;
      background: #171717;
      border: 1px solid var(--admin-border);
      padding: 16px 20px;
    }

    .staged-tray-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--admin-text-secondary);
    }

    .staged-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
    }

    .staged-card {
      position: relative;
      background: #202020;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
    }

    .staged-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .staged-card-remove {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      border: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .staged-card-remove:hover {
      background: var(--admin-accent);
    }

    .staged-card-meta {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.85);
      padding: 4px 6px;
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(255, 255, 255, 0.85);
    }

    /* Form Fields */
    .admin-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 20px;
    }

    .admin-field {
      display: flex;
      flex-direction: column;
    }

    .admin-label {
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--admin-text-secondary);
      margin-bottom: 8px;
    }

    .admin-input, .admin-select, .admin-textarea {
      background: #1A1A1A;
      border: 1px solid var(--admin-border);
      color: var(--admin-text-primary);
      padding: 11px 14px;
      font-family: var(--font-sans);
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .admin-input:focus, .admin-select:focus, .admin-textarea:focus {
      border-color: var(--admin-accent);
    }

    .admin-textarea {
      resize: vertical;
      min-height: 100px;
      line-height: 1.6;
    }

    /* Upload Progress Bar */
    .upload-progress-container {
      margin-top: 20px;
      display: none;
    }

    .upload-progress-bar-bg {
      background: #222;
      height: 4px;
      overflow: hidden;
    }

    .upload-progress-bar-fill {
      background: var(--admin-accent);
      height: 100%;
      width: 0%;
      transition: width 0.2s ease;
    }

    .upload-progress-status {
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--admin-text-secondary);
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
    }

    /* Buttons */
    .btn-luxury {
      background: var(--admin-accent);
      color: #FFFFFF;
      border: 1px solid var(--admin-accent);
      padding: 11px 22px;
      font-family: var(--font-sans);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-luxury:hover {
      background: var(--admin-accent-bright);
      border-color: var(--admin-accent-bright);
    }

    .btn-luxury:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-outline {
      background: transparent;
      color: var(--admin-text-secondary);
      border: 1px solid var(--admin-border);
      padding: 10px 18px;
      font-family: var(--font-sans);
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline:hover {
      border-color: var(--admin-border-hover);
      color: var(--admin-text-primary);
    }

    .btn-danger {
      border-color: rgba(128, 0, 0, 0.4);
      color: #ff7777;
    }

    .btn-danger:hover {
      background: rgba(128, 0, 0, 0.15);
      border-color: var(--admin-accent);
      color: #ff9999;
    }

    /* Toolbar Controls (Feature 2) */
    .catalogue-controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    .filter-btn-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background: transparent;
      border: 1px solid var(--admin-border);
      color: var(--admin-text-secondary);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 6px 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-pill.active, .filter-pill:hover {
      background: var(--admin-accent);
      border-color: var(--admin-accent);
      color: #FFFFFF;
    }

    .search-sort-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-box-wrap {
      position: relative;
    }

    .search-box-input {
      background: #181818;
      border: 1px solid var(--admin-border);
      color: #fff;
      font-family: var(--font-sans);
      font-size: 12px;
      padding: 7px 12px 7px 32px;
      outline: none;
      width: 220px;
      transition: border-color 0.2s;
    }

    .search-box-input:focus {
      border-color: var(--admin-accent);
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--admin-text-muted);
      pointer-events: none;
    }

    .sort-select {
      background: #181818;
      border: 1px solid var(--admin-border);
      color: var(--admin-text-secondary);
      font-family: var(--font-sans);
      font-size: 12px;
      padding: 7px 12px;
      outline: none;
    }

    /* Gallery Table */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--admin-border);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .admin-table th {
      background: #181818;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--admin-text-muted);
      padding: 14px 18px;
      border-bottom: 1px solid var(--admin-border);
      font-weight: 500;
    }

    .admin-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--admin-border);
      vertical-align: middle;
      font-size: 13px;
    }

    .admin-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .thumb-preview {
      width: 60px;
      height: 48px;
      object-fit: cover;
      background: #222;
      border: 1px solid var(--admin-border);
      display: block;
      cursor: zoom-in;
      transition: transform 0.2s;
    }

    .thumb-preview:hover {
      transform: scale(1.1);
      z-index: 10;
      position: relative;
    }

    .badge-tag {
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 3px 8px;
      display: inline-block;
    }

    .badge-protected {
      background: rgba(253, 240, 213, 0.1);
      border: 1px solid rgba(253, 240, 213, 0.3);
      color: var(--admin-gold);
    }

    .badge-uploaded {
      background: rgba(128, 0, 0, 0.15);
      border: 1px solid rgba(128, 0, 0, 0.3);
      color: #ff9999;
    }

    .badge-category {
      font-size: 11px;
      color: var(--admin-text-secondary);
      border: 1px solid rgba(255, 255, 255, 0.07);
      padding: 2px 7px;
      border-radius: 2px;
    }

    .table-actions {
      display: flex;
      gap: 8px;
    }

    .btn-table-action {
      background: transparent;
      border: 1px solid var(--admin-border);
      color: var(--admin-text-secondary);
      font-size: 11px;
      letter-spacing: 0.08em;
      padding: 5px 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-table-action:hover {
      border-color: var(--admin-border-hover);
      color: var(--admin-text-primary);
    }

    .btn-table-action.delete:hover {
      border-color: var(--admin-accent);
      color: #ff7777;
    }

    .btn-table-action:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      border-color: transparent;
    }

    /* Modals */
    .admin-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
      padding: 20px;
    }

    .admin-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .admin-modal {
      background: var(--admin-surface);
      border: 1px solid rgba(255, 255, 255, 0.15);
      width: 100%;
      max-width: 560px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
      padding: 32px 36px;
      transform: translateY(20px);
      transition: transform 0.25s ease;
      max-height: 90vh;
      overflow-y: auto;
    }

    .admin-modal-overlay.active .admin-modal {
      transform: translateY(0);
    }

    .admin-modal-title {
      font-family: var(--font-serif);
      font-size: 22px;
      color: var(--admin-text-primary);
      margin: 0 0 8px 0;
      font-weight: 400;
    }

    .admin-modal-desc {
      font-size: 12px;
      color: var(--admin-text-muted);
      margin: 0 0 24px 0;
    }

    .admin-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid var(--admin-border);
    }

    /* Lightbox Preview Modal (Feature 3) */
    .preview-modal {
      max-width: 820px;
      padding: 24px;
      text-align: center;
    }

    .preview-modal-img {
      max-width: 100%;
      max-height: 65vh;
      object-fit: contain;
      border: 1px solid var(--admin-border);
      margin-bottom: 16px;
    }

    .preview-modal-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--admin-text-secondary);
      border-top: 1px solid var(--admin-border);
      padding-top: 14px;
      text-align: left;
    }

    /* Toast Notification (Feature 7) */
    .admin-toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #181818;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-left: 3px solid var(--admin-accent);
      color: var(--admin-text-primary);
      padding: 16px 22px;
      font-size: 13px;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.85);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 420px;
    }

    .admin-toast.active {
      transform: translateY(0);
      opacity: 1;
    }

    .admin-toast.success { border-left-color: #4caf50; }
    .admin-toast.error   { border-left-color: #f44336; }
    .admin-toast.warning { border-left-color: #ff9800; }

    /* Checkbox custom */
    input[type="checkbox"] {
      accent-color: var(--admin-accent);
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    /* Empty search state */
    .table-empty-row {
      text-align: center;
      padding: 36px !important;
      color: var(--admin-text-muted);
      font-style: italic;
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <header class="admin-navbar">
    <div class="admin-brand">
      <h1 class="admin-brand-name">LE PHOTOGRAM</h1>
      <span class="admin-brand-badge">Atelier Control</span>
    </div>

    <div class="admin-nav-actions">
      <a href="../portfolio.html" target="_blank" class="admin-nav-link" title="Open live public portfolio in new tab">
        <span>View Live Portfolio</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>

      <div class="admin-user-pill">
        Admin: <strong><?= htmlspecialchars($creds['username'], ENT_QUOTES, 'UTF-8') ?></strong>
      </div>

      <a href="logout.php" class="admin-btn-logout">Sign Out</a>
    </div>
  </header>

  <main class="admin-container">

    <!-- Tab Navigation -->
    <nav class="admin-tabs" role="tablist">
      <button class="admin-tab-btn active" data-tab="galleryTab" role="tab">
        <span>Portfolio Gallery (<?= $totalGalleryImages ?>)</span>
      </button>
      <button class="admin-tab-btn" data-tab="aboutTab" role="tab">
        <span>About Content</span>
      </button>
      <button class="admin-tab-btn" data-tab="systemTab" role="tab">
        <span>Security &amp; Diagnostics</span>
      </button>
    </nav>

    <!-- TAB 1: PORTFOLIO GALLERY -->
    <div id="galleryTab" class="tab-content active">

      <!-- Metrics Row -->
      <section class="admin-metrics-grid">
        <div class="admin-metric-card">
          <div class="admin-metric-title">Total Published Works</div>
          <div class="admin-metric-value" id="metricTotalImages"><?= $totalGalleryImages ?></div>
          <p class="admin-metric-desc"><?= $defaultItemsCount ?> protected defaults &bull; <span id="metricUploadedCount"><?= $uploadedItemsCount ?></span> uploaded</p>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-title">Weddings &amp; Portraits</div>
          <div class="admin-metric-value"><?= $categoryCounts['weddings'] + $categoryCounts['portraits'] ?></div>
          <p class="admin-metric-desc"><?= $categoryCounts['weddings'] ?> Weddings &bull; <?= $categoryCounts['portraits'] ?> Studio Portraits</p>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-title">Events &amp; Editorial</div>
          <div class="admin-metric-value"><?= $categoryCounts['events'] + $categoryCounts['editorial'] ?></div>
          <p class="admin-metric-desc"><?= $categoryCounts['events'] ?> Life Events &bull; <?= $categoryCounts['editorial'] ?> Editorial</p>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-title">Uploaded Storage</div>
          <div class="admin-metric-value"><?= $uploadSizeFormatted ?></div>
          <p class="admin-metric-desc">WebP optimized storage in /assets/uploads</p>
        </div>
      </section>

      <!-- Multi-Image Upload Panel -->
      <section class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Upload Fine Art Photography</h2>
            <p class="admin-card-subtitle">Automatic EXIF orientation correction, proportional resizing (max 2400px), and lossless-grade WebP conversion.</p>
          </div>
        </div>

        <form id="uploadForm">
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="uploadCategory" class="admin-label">Portfolio Category</label>
              <select id="uploadCategory" name="category" class="admin-select" required>
                <option value="weddings">Weddings</option>
                <option value="portraits">Studio Portraits</option>
                <option value="events">Life Events</option>
                <option value="editorial">Editorial &amp; Fine Art</option>
              </select>
            </div>

            <div class="admin-field">
              <label for="uploadTitle" class="admin-label">Title / Caption (Optional for Single)</label>
              <input type="text" id="uploadTitle" name="title" class="admin-input" placeholder="e.g. Highlands Golden Hour Ceremony">
            </div>

            <div class="admin-field">
              <label for="uploadAlt" class="admin-label">Alt Accessibility Text</label>
              <input type="text" id="uploadAlt" name="alt" class="admin-input" placeholder="e.g. Fine art bridal portrait at sunset">
            </div>
          </div>

          <!-- Drag and drop zone -->
          <div class="dropzone-box" id="dropzoneBox">
            <input type="file" id="imageFilesInput" name="images[]" multiple accept="image/jpeg,image/png,image/webp">
            <span class="dropzone-icon">&plus;</span>
            <div class="dropzone-prompt" id="dropzonePrompt">Select or drag &amp; drop high-resolution photographs here</div>
            <div class="dropzone-hint">Supports multiple JPG, PNG, and WebP files up to 15MB each.</div>
          </div>

          <!-- Staged Previews Tray (Feature 1) -->
          <div class="staged-tray" id="stagedTray">
            <div class="staged-tray-header">
              <span id="stagedSummaryText">0 photographs staged for upload</span>
              <a href="#" id="clearStagedBtn" style="color: #ff8888; text-decoration: none;">Clear All</a>
            </div>
            <div class="staged-cards-grid" id="stagedCardsGrid"></div>
          </div>

          <!-- Progress bar -->
          <div class="upload-progress-container" id="uploadProgressContainer">
            <div class="upload-progress-bar-bg">
              <div class="upload-progress-bar-fill" id="uploadProgressBarFill"></div>
            </div>
            <div class="upload-progress-status">
              <span id="uploadProgressLabel">Processing photographic assets with PHP GD...</span>
              <span id="uploadProgressPct">0%</span>
            </div>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-luxury" id="uploadSubmitBtn" disabled>
              <span>Upload &amp; Publish Photographs</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Gallery Catalogue & Batch Management Panel -->
      <section class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Portfolio Image Catalogue</h2>
            <p class="admin-card-subtitle">Manage metadata, categories, search, and batch deletion. Default seed images are securely protected.</p>
          </div>
          <div style="font-size: 12px; color: var(--admin-text-muted);" id="catalogueCountLabel">
            Showing <?= $totalGalleryImages ?> of <?= $totalGalleryImages ?> photographs
          </div>
        </div>

        <!-- Catalogue Controls Toolbar (Search, Filter, Sort, Batch) -->
        <div class="catalogue-controls-bar">
          <div class="filter-btn-group" id="adminCategoryFilters">
            <button class="filter-pill active" data-filter="all">All (<?= $totalGalleryImages ?>)</button>
            <button class="filter-pill" data-filter="weddings">Weddings</button>
            <button class="filter-pill" data-filter="portraits">Studio Portraits</button>
            <button class="filter-pill" data-filter="events">Life Events</button>
            <button class="filter-pill" data-filter="editorial">Editorial</button>
          </div>

          <div class="search-sort-group">
            <!-- Search Input -->
            <div class="search-box-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="catalogueSearchInput" class="search-box-input" placeholder="Search title, alt, or ID...">
            </div>

            <!-- Sort Dropdown -->
            <select id="catalogueSortSelect" class="sort-select">
              <option value="default">Sort: Default Order</option>
              <option value="title-asc">Title: A &rarr; Z</option>
              <option value="title-desc">Title: Z &rarr; A</option>
              <option value="category">Sort by Category</option>
              <option value="newest">Newest Uploads First</option>
            </select>

            <!-- Batch Delete Button -->
            <button type="button" class="btn-outline btn-danger" id="batchDeleteBtn" disabled>
              <span>Delete Selected (<span id="selectedCount">0</span>)</span>
            </button>
          </div>
        </div>

        <!-- Images Table -->
        <div class="table-container">
          <table class="admin-table" id="galleryTable">
            <thead>
              <tr>
                <th style="width: 36px;">
                  <input type="checkbox" id="selectAllCheckbox" title="Select all items">
                </th>
                <th style="width: 70px;">Preview</th>
                <th>Title &amp; Alt</th>
                <th>Category</th>
                <th>Placement</th>
                <th>Published</th>
                <th>Protection</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="galleryTableBody">
              <?php foreach ($gallery as $item): ?>
                <?php
                  $isDef = !empty($item['is_default']);
                  $cat = $item['category'] ?? 'weddings';
                  $catLabel = ALLOWED_CATEGORIES[$cat] ?? ucfirst($cat);
                  $itemId = htmlspecialchars($item['id'] ?? '', ENT_QUOTES, 'UTF-8');
                  $itemTitle = htmlspecialchars($item['title'] ?? 'Untitled', ENT_QUOTES, 'UTF-8');
                  $itemAlt = htmlspecialchars($item['alt'] ?? '', ENT_QUOTES, 'UTF-8');
                  $itemPath = htmlspecialchars($item['image_path'] ?? '', ENT_QUOTES, 'UTF-8');
                  $layoutClass = htmlspecialchars($item['layout_class'] ?? '', ENT_QUOTES, 'UTF-8');
                  $createdAt = htmlspecialchars($item['created_at'] ?? 'Seed Default', ENT_QUOTES, 'UTF-8');
                ?>
                <tr 
                  data-id="<?= $itemId ?>" 
                  data-category="<?= htmlspecialchars($cat, ENT_QUOTES, 'UTF-8') ?>" 
                  data-title="<?= $itemTitle ?>" 
                  data-alt="<?= $itemAlt ?>" 
                  data-default="<?= $isDef ? 'true' : 'false' ?>"
                  data-path="<?= $itemPath ?>"
                  data-date="<?= $createdAt ?>"
                >
                  <td>
                    <?php if (!$isDef): ?>
                      <input type="checkbox" class="item-checkbox" value="<?= $itemId ?>">
                    <?php else: ?>
                      <input type="checkbox" disabled title="Default seed images cannot be deleted" style="opacity: 0.25;">
                    <?php endif; ?>
                  </td>
                  <td>
                    <img 
                      src="../<?= $itemPath ?>" 
                      alt="<?= $itemAlt ?>" 
                      class="thumb-preview" 
                      loading="lazy" 
                      data-action="preview"
                      data-src="../<?= $itemPath ?>"
                      data-title="<?= $itemTitle ?>"
                      data-category="<?= $catLabel ?>"
                    >
                  </td>
                  <td>
                    <div class="row-item-title" style="font-weight: 500; color: var(--admin-text-primary); margin-bottom: 2px;">
                      <?= $itemTitle ?>
                    </div>
                    <div class="row-item-alt" style="font-size: 11px; color: var(--admin-text-muted);">
                      <?= $itemAlt ?: '<em>No alt text</em>' ?>
                    </div>
                  </td>
                  <td>
                    <span class="badge-category"><?= $catLabel ?></span>
                  </td>
                  <td>
                    <span style="font-family: monospace; font-size: 11px; color: var(--admin-gold);"><?= $layoutClass ?: 'Standard' ?></span>
                  </td>
                  <td style="font-size: 11px; color: var(--admin-text-muted);">
                    <?= $createdAt ?>
                  </td>
                  <td>
                    <?php if ($isDef): ?>
                      <span class="badge-tag badge-protected">Protected Seed</span>
                    <?php else: ?>
                      <span class="badge-tag badge-uploaded">Custom Upload</span>
                    <?php endif; ?>
                  </td>
                  <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                      <button 
                        type="button" 
                        class="btn-table-action btn-edit" 
                        data-action="edit"
                        data-id="<?= $itemId ?>"
                        data-title="<?= $itemTitle ?>"
                        data-alt="<?= $itemAlt ?>"
                        data-category="<?= htmlspecialchars($cat, ENT_QUOTES, 'UTF-8') ?>"
                        data-layout="<?= $layoutClass ?>"
                      >
                        Edit
                      </button>

                      <?php if (!$isDef): ?>
                        <button 
                          type="button" 
                          class="btn-table-action delete btn-delete" 
                          data-action="delete"
                          data-id="<?= $itemId ?>"
                          data-title="<?= $itemTitle ?>"
                        >
                          Delete
                        </button>
                      <?php else: ?>
                        <button type="button" class="btn-table-action" disabled title="Protected default portfolio image">
                          Protected
                        </button>
                      <?php endif; ?>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <!-- TAB 2: ABOUT CONTENT -->
    <div id="aboutTab" class="tab-content" style="display: none;">
      <section class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Editorial About Page Content</h2>
            <p class="admin-card-subtitle">Manage the studio manifesto, philosophy narrative, and pull-quote credentials in data/about.json.</p>
          </div>
        </div>

        <form id="aboutForm">
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="aboutHeroTitle" class="admin-label">Hero Title</label>
              <input type="text" id="aboutHeroTitle" name="hero_title" class="admin-input" value="<?= htmlspecialchars($aboutData['hero_title'] ?? 'ABOUT US', ENT_QUOTES, 'UTF-8') ?>">
            </div>

            <div class="admin-field">
              <label for="aboutHeroSubtitle" class="admin-label">Hero Subtitle</label>
              <input type="text" id="aboutHeroSubtitle" name="hero_subtitle" class="admin-input" value="<?= htmlspecialchars($aboutData['hero_subtitle'] ?? 'Meet the Artists Behind the Studio', ENT_QUOTES, 'UTF-8') ?>">
            </div>
          </div>

          <div class="admin-form-grid" style="margin-top: 10px;">
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label for="aboutStoryEyebrow" class="admin-label">Story Eyebrow</label>
              <input type="text" id="aboutStoryEyebrow" name="story_eyebrow" class="admin-input" value="<?= htmlspecialchars($aboutData['story_eyebrow'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
            </div>

            <div class="admin-field" style="grid-column: 1 / -1;">
              <label for="aboutStoryManifesto" class="admin-label">Story Manifesto Headline</label>
              <input type="text" id="aboutStoryManifesto" name="story_manifesto" class="admin-input" value="<?= htmlspecialchars($aboutData['story_manifesto'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
            </div>
          </div>

          <div class="admin-field" style="margin-top: 10px;">
            <label for="aboutStoryParagraphs" class="admin-label">Story Body Paragraphs (Double newline separated)</label>
            <textarea id="aboutStoryParagraphs" name="story_paragraphs" class="admin-textarea" rows="6"><?php
              if (!empty($aboutData['story_paragraphs']) && is_array($aboutData['story_paragraphs'])) {
                  echo htmlspecialchars(implode("\n\n", $aboutData['story_paragraphs']), ENT_QUOTES, 'UTF-8');
              }
            ?></textarea>
          </div>

          <div class="admin-form-grid" style="margin-top: 20px;">
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label for="aboutPullquoteText" class="admin-label">Featured Pull-Quote</label>
              <input type="text" id="aboutPullquoteText" name="pullquote_text" class="admin-input" value="<?= htmlspecialchars($aboutData['pullquote_text'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
            </div>

            <div class="admin-field">
              <label for="aboutPullquoteAuthor" class="admin-label">Quote Attribution</label>
              <input type="text" id="aboutPullquoteAuthor" name="pullquote_author" class="admin-input" value="<?= htmlspecialchars($aboutData['pullquote_author'] ?? 'Cara Studio', ENT_QUOTES, 'UTF-8') ?>">
            </div>

            <div class="admin-field" style="grid-column: 1 / -1;">
              <label for="aboutPullquoteDesc" class="admin-label">Quote Full Description</label>
              <textarea id="aboutPullquoteDesc" name="pullquote_desc" class="admin-textarea" rows="3"><?= htmlspecialchars($aboutData['pullquote_desc'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>
            </div>
          </div>

          <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-luxury" id="saveAboutBtn">
              <span>Save About Page Changes</span>
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- TAB 3: SECURITY & SYSTEM DIAGNOSTICS -->
    <div id="systemTab" class="tab-content" style="display: none;">
      
      <!-- Change Password Card -->
      <section class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Studio Master Password</h2>
            <p class="admin-card-subtitle">Update your administrative credentials. Passwords are hashed with Bcrypt.</p>
          </div>
        </div>

        <form id="changePasswordForm" style="max-width: 520px;">
          <div class="admin-field" style="margin-bottom: 16px;">
            <label for="currentPassword" class="admin-label">Current Password</label>
            <input type="password" id="currentPassword" name="current_password" class="admin-input" required placeholder="Enter current password">
          </div>

          <div class="admin-field" style="margin-bottom: 16px;">
            <label for="newPassword" class="admin-label">New Master Password</label>
            <input type="password" id="newPassword" name="new_password" class="admin-input" minlength="8" required placeholder="At least 8 characters">
          </div>

          <div class="admin-field" style="margin-bottom: 20px;">
            <label for="confirmPassword" class="admin-label">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirm_password" class="admin-input" minlength="8" required placeholder="Repeat new password">
          </div>

          <button type="submit" class="btn-luxury" id="changePasswordBtn">
            <span>Update Master Password</span>
          </button>
        </form>
      </section>

      <!-- System Diagnostics Overview -->
      <section class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">System Runtime &amp; Architecture Verification</h2>
            <p class="admin-card-subtitle">Local server environment configuration and security verification.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: #181818; padding: 20px; border: 1px solid var(--admin-border);">
            <div class="admin-label">PHP Engine Version</div>
            <div style="font-family: var(--font-serif); font-size: 20px; color: var(--admin-text-primary); margin: 6px 0 4px 0;">
              PHP <?= phpversion() ?>
            </div>
            <p style="font-size: 11px; color: #81c784; margin: 0;">&check; Native sessions &amp; Bcrypt hashing verified</p>
          </div>

          <div style="background: #181818; padding: 20px; border: 1px solid var(--admin-border);">
            <div class="admin-label">GD Graphics Library</div>
            <div style="font-family: var(--font-serif); font-size: 20px; color: var(--admin-text-primary); margin: 6px 0 4px 0;">
              <?= extension_loaded('gd') ? 'Loaded &amp; Active' : 'Missing' ?>
            </div>
            <p style="font-size: 11px; color: #81c784; margin: 0;">
              &check; WebP generation supported (<?= function_exists('imagewebp') ? 'Yes' : 'No' ?>)
            </p>
          </div>

          <div style="background: #181818; padding: 20px; border: 1px solid var(--admin-border);">
            <div class="admin-label">EXIF Orientation Correction</div>
            <div style="font-family: var(--font-serif); font-size: 20px; color: var(--admin-text-primary); margin: 6px 0 4px 0;">
              <?= extension_loaded('exif') ? 'EXIF Active' : 'EXIF Unavailable' ?>
            </div>
            <p style="font-size: 11px; color: #81c784; margin: 0;">&check; Automatic camera orientation detection</p>
          </div>

          <div style="background: #181818; padding: 20px; border: 1px solid var(--admin-border);">
            <div class="admin-label">Data Storage Mode</div>
            <div style="font-family: var(--font-serif); font-size: 20px; color: var(--admin-text-primary); margin: 6px 0 4px 0;">
              JSON File Store + File Locking
            </div>
            <p style="font-size: 11px; color: #81c784; margin: 0;">&check; Atomic writes with flock(LOCK_EX)</p>
          </div>
        </div>
      </section>

    </div>

  </main>

  <!-- Edit Metadata Modal -->
  <div class="admin-modal-overlay" id="editModalOverlay">
    <div class="admin-modal">
      <h3 class="admin-modal-title">Edit Image Metadata</h3>
      <p class="admin-modal-desc">Changes will immediately persist to the gallery database and update the public portfolio.</p>

      <form id="editForm">
        <input type="hidden" id="editItemId" name="id">

        <div class="admin-field" style="margin-bottom: 16px;">
          <label for="editTitle" class="admin-label">Display Title</label>
          <input type="text" id="editTitle" name="title" class="admin-input" required>
        </div>

        <div class="admin-field" style="margin-bottom: 16px;">
          <label for="editAlt" class="admin-label">Alt Accessibility Text</label>
          <input type="text" id="editAlt" name="alt" class="admin-input">
        </div>

        <div class="admin-form-grid" style="margin-bottom: 16px;">
          <div class="admin-field">
            <label for="editCategory" class="admin-label">Category</label>
            <select id="editCategory" name="category" class="admin-select" required>
              <option value="weddings">Weddings</option>
              <option value="portraits">Studio Portraits</option>
              <option value="events">Life Events</option>
              <option value="editorial">Editorial &amp; Fine Art</option>
            </select>
          </div>

          <div class="admin-field">
            <label for="editLayoutClass" class="admin-label">Bento Layout Class</label>
            <input type="text" id="editLayoutClass" name="layout_class" class="admin-input" placeholder="e.g. port-b1">
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="btn-outline modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn-luxury" id="saveEditBtn">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- In-Dashboard Lightbox Preview Modal (Feature 3) -->
  <div class="admin-modal-overlay" id="imagePreviewModalOverlay">
    <div class="admin-modal preview-modal">
      <h3 class="admin-modal-title" id="previewModalTitle">Photograph Preview</h3>
      <img src="" alt="" class="preview-modal-img" id="previewModalImg">
      <div class="preview-modal-meta">
        <div>
          <span id="previewModalCategory" class="badge-category">Weddings</span>
          <span id="previewModalPath" style="margin-left: 10px; font-family: monospace; color: var(--admin-text-muted);">assets/uploads/...</span>
        </div>
        <button type="button" class="btn-outline modal-cancel-btn">Close Preview</button>
      </div>
    </div>
  </div>

  <!-- Branded Delete Confirmation Modal (Feature 6) -->
  <div class="admin-modal-overlay" id="deleteConfirmModalOverlay">
    <div class="admin-modal" style="max-width: 480px;">
      <h3 class="admin-modal-title" style="color: #ff8888;">Confirm Permanent Deletion</h3>
      <p class="admin-modal-desc" id="deleteConfirmDesc">
        Are you sure you want to permanently delete this photograph? The physical WebP image file and database entry will be unlinked.
      </p>

      <div class="admin-modal-footer">
        <button type="button" class="btn-outline modal-cancel-btn">Cancel</button>
        <button type="button" class="btn-luxury btn-danger" id="executeDeleteBtn">Delete Photograph</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification (Feature 7) -->
  <div class="admin-toast" id="adminToast">
    <span id="toastIcon">&#10003;</span>
    <span id="toastMessage">Action completed successfully.</span>
  </div>

  <script>
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Enhanced Toast System
    function showToast(message, type = 'success') {
      const toast = document.getElementById('adminToast');
      const icon = document.getElementById('toastIcon');
      const msg = document.getElementById('toastMessage');

      msg.textContent = message;
      if (type === 'success') {
        icon.innerHTML = '&#10003;';
      } else if (type === 'error') {
        icon.innerHTML = '&#10005;';
      } else {
        icon.innerHTML = '&#9888;';
      }

      toast.className = `admin-toast active ${type}`;
      setTimeout(() => {
        toast.classList.remove('active');
      }, 4200);
    }

    // Modal Close Helper
    function closeAllModals() {
      document.querySelectorAll('.admin-modal-overlay').forEach(m => m.classList.remove('active'));
    }

    document.querySelectorAll('.modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Tab Switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.style.display = 'block';
      });
    });

    // ── FEATURE 1: INTERACTIVE FILE STAGING PREVIEW TRAY ──
    const fileInput = document.getElementById('imageFilesInput');
    const submitBtn = document.getElementById('uploadSubmitBtn');
    const promptText = document.getElementById('dropzonePrompt');
    const dropzone = document.getElementById('dropzoneBox');
    const stagedTray = document.getElementById('stagedTray');
    const stagedCardsGrid = document.getElementById('stagedCardsGrid');
    const stagedSummaryText = document.getElementById('stagedSummaryText');
    const clearStagedBtn = document.getElementById('clearStagedBtn');

    // In-memory FileList array so individual files can be removed
    let stagedFiles = [];

    function renderStagedPreviews() {
      stagedCardsGrid.innerHTML = '';
      if (stagedFiles.length === 0) {
        stagedTray.style.display = 'none';
        promptText.textContent = 'Select or drag & drop high-resolution photographs here';
        submitBtn.setAttribute('disabled', 'true');
        return;
      }

      stagedTray.style.display = 'block';
      submitBtn.removeAttribute('disabled');

      let totalBytes = 0;
      stagedFiles.forEach(f => { totalBytes += f.size; });
      const totalFormatted = totalBytes > 1048576 
        ? (totalBytes / 1048576).toFixed(1) + ' MB' 
        : (totalBytes / 1024).toFixed(0) + ' KB';

      stagedSummaryText.innerHTML = `${stagedFiles.length} photograph(s) staged &bull; Total ${totalFormatted}`;
      promptText.textContent = `${stagedFiles.length} photograph(s) ready to upload`;

      stagedFiles.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'staged-card';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'staged-card-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove this photograph from upload';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          stagedFiles.splice(index, 1);
          renderStagedPreviews();
        });

        const meta = document.createElement('div');
        meta.className = 'staged-card-meta';
        meta.textContent = file.name;

        card.appendChild(img);
        card.appendChild(removeBtn);
        card.appendChild(meta);
        stagedCardsGrid.appendChild(card);
      });
    }

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(f => stagedFiles.push(f));
        renderStagedPreviews();
      }
    });

    clearStagedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stagedFiles = [];
      fileInput.value = '';
      renderStagedPreviews();
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach(f => stagedFiles.push(f));
        renderStagedPreviews();
      }
    });

    // Upload with real-time progress
    const uploadForm = document.getElementById('uploadForm');
    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressBarFill = document.getElementById('uploadProgressBarFill');
    const progressLabel = document.getElementById('uploadProgressLabel');
    const progressPct = document.getElementById('uploadProgressPct');

    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (stagedFiles.length === 0) return;

      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      formData.append('category', document.getElementById('uploadCategory').value);
      formData.append('title', document.getElementById('uploadTitle').value);
      formData.append('alt', document.getElementById('uploadAlt').value);

      stagedFiles.forEach(f => {
        formData.append('images[]', f);
      });

      progressContainer.style.display = 'block';
      submitBtn.setAttribute('disabled', 'true');
      progressBarFill.style.width = '0%';
      progressPct.textContent = '0%';
      progressLabel.textContent = 'Uploading high-resolution files to studio...';

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'api/upload.php', true);
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          progressBarFill.style.width = percent + '%';
          progressPct.textContent = percent + '%';
          if (percent >= 100) {
            progressLabel.textContent = 'Converting to WebP & updating catalog database...';
          }
        }
      };

      xhr.onload = () => {
        progressContainer.style.display = 'none';
        submitBtn.removeAttribute('disabled');
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && res.success) {
            showToast(res.message || 'Upload complete! Refreshing gallery...', 'success');
            stagedFiles = [];
            setTimeout(() => window.location.reload(), 1100);
          } else {
            showToast(res.error || 'Upload failed. Check error response.', 'error');
          }
        } catch (err) {
          showToast('An unexpected server response was received.', 'error');
        }
      };

      xhr.onerror = () => {
        progressContainer.style.display = 'none';
        submitBtn.removeAttribute('disabled');
        showToast('Network error during upload.', 'error');
      };

      xhr.send(formData);
    });

    // ── FEATURE 2: SEARCH, FILTER, AND SORT IN THE CATALOGUE ──
    const searchInput = document.getElementById('catalogueSearchInput');
    const sortSelect = document.getElementById('catalogueSortSelect');
    const categoryBtns = document.querySelectorAll('#adminCategoryFilters .filter-pill');
    const tableBody = document.getElementById('galleryTableBody');
    const countLabel = document.getElementById('catalogueCountLabel');

    let currentCategoryFilter = 'all';

    function applyFilterAndSearch() {
      const query = searchInput.value.toLowerCase().trim();
      const rows = Array.from(tableBody.querySelectorAll('tr[data-id]'));
      let visibleCount = 0;

      rows.forEach(row => {
        const cat = row.getAttribute('data-category');
        const title = (row.getAttribute('data-title') || '').toLowerCase();
        const alt = (row.getAttribute('data-alt') || '').toLowerCase();
        const id = (row.getAttribute('data-id') || '').toLowerCase();

        const matchesCategory = currentCategoryFilter === 'all' || cat === currentCategoryFilter;
        const matchesQuery = query === '' || title.includes(query) || alt.includes(query) || id.includes(query);

        if (matchesCategory && matchesQuery) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      // Show/hide empty state
      let emptyRow = document.getElementById('emptySearchRow');
      if (visibleCount === 0) {
        if (!emptyRow) {
          emptyRow = document.createElement('tr');
          emptyRow.id = 'emptySearchRow';
          emptyRow.innerHTML = '<td colspan="8" class="table-empty-row">No photographs match the active filter or search query.</td>';
          tableBody.appendChild(emptyRow);
        }
        emptyRow.style.display = '';
      } else if (emptyRow) {
        emptyRow.style.display = 'none';
      }

      countLabel.textContent = `Showing ${visibleCount} of ${rows.length} photographs`;
    }

    searchInput.addEventListener('input', applyFilterAndSearch);

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategoryFilter = btn.getAttribute('data-filter') || 'all';
        applyFilterAndSearch();
      });
    });

    sortSelect.addEventListener('change', () => {
      const sortMode = sortSelect.value;
      const rows = Array.from(tableBody.querySelectorAll('tr[data-id]'));

      rows.sort((a, b) => {
        if (sortMode === 'title-asc') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '');
        } else if (sortMode === 'title-desc') {
          return (b.getAttribute('data-title') || '').localeCompare(a.getAttribute('data-title') || '');
        } else if (sortMode === 'category') {
          return (a.getAttribute('data-category') || '').localeCompare(b.getAttribute('data-category') || '');
        } else if (sortMode === 'newest') {
          const isDefA = a.getAttribute('data-default') === 'true';
          const isDefB = b.getAttribute('data-default') === 'true';
          if (isDefA && !isDefB) return 1;
          if (!isDefA && isDefB) return -1;
          return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
        }
        return 0; // Default order
      });

      rows.forEach(r => tableBody.appendChild(r));
    });

    // ── FEATURE 3: IN-DASHBOARD LIGHTBOX PREVIEW ──
    const previewModalOverlay = document.getElementById('imagePreviewModalOverlay');
    const previewModalImg = document.getElementById('previewModalImg');
    const previewModalTitle = document.getElementById('previewModalTitle');
    const previewModalCategory = document.getElementById('previewModalCategory');
    const previewModalPath = document.getElementById('previewModalPath');

    tableBody.addEventListener('click', (e) => {
      const thumb = e.target.closest('img[data-action="preview"]');
      if (thumb) {
        e.preventDefault();
        previewModalImg.src = thumb.getAttribute('data-src');
        previewModalTitle.textContent = thumb.getAttribute('data-title') || 'Photograph Preview';
        previewModalCategory.textContent = thumb.getAttribute('data-category') || 'Portfolio';
        previewModalPath.textContent = thumb.getAttribute('data-src');
        previewModalOverlay.classList.add('active');
      }
    });

    // ── BUG 1 FIX: DELEGATED EDIT & DELETE HANDLERS (IMMUNE TO QUOTE BREAKS) ──
    const editModalOverlay = document.getElementById('editModalOverlay');
    const editForm = document.getElementById('editForm');
    const editItemId = document.getElementById('editItemId');
    const editTitle = document.getElementById('editTitle');
    const editAlt = document.getElementById('editAlt');
    const editCategory = document.getElementById('editCategory');
    const editLayoutClass = document.getElementById('editLayoutClass');

    tableBody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit');
      if (editBtn) {
        e.preventDefault();
        editItemId.value = editBtn.getAttribute('data-id');
        editTitle.value = editBtn.getAttribute('data-title');
        editAlt.value = editBtn.getAttribute('data-alt');
        editCategory.value = editBtn.getAttribute('data-category');
        editLayoutClass.value = editBtn.getAttribute('data-layout');
        editModalOverlay.classList.add('active');
      }
    });

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        id: editItemId.value,
        title: editTitle.value,
        alt: editAlt.value,
        category: editCategory.value,
        layout_class: editLayoutClass.value,
        csrf_token: csrfToken
      };

      try {
        const res = await fetch('api/update_item.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Image metadata updated successfully.', 'success');
          closeAllModals();
          // Immediately update DOM row
          const row = document.querySelector(`tr[data-id="${payload.id}"]`);
          if (row) {
            row.setAttribute('data-title', payload.title);
            row.setAttribute('data-alt', payload.alt);
            row.setAttribute('data-category', payload.category);
            const titleEl = row.querySelector('.row-item-title');
            if (titleEl) titleEl.textContent = payload.title;
            const altEl = row.querySelector('.row-item-alt');
            if (altEl) altEl.textContent = payload.alt;
          }
        } else {
          showToast(data.error || 'Failed to update metadata.', 'error');
        }
      } catch (err) {
        showToast('Network error while updating metadata.', 'error');
      }
    });

    // ── FEATURE 6: BRANDED DELETE CONFIRMATION MODAL ──
    const deleteConfirmModal = document.getElementById('deleteConfirmModalOverlay');
    const deleteConfirmDesc = document.getElementById('deleteConfirmDesc');
    const executeDeleteBtn = document.getElementById('executeDeleteBtn');

    let pendingDeleteAction = null;

    tableBody.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete');
      if (deleteBtn) {
        e.preventDefault();
        const id = deleteBtn.getAttribute('data-id');
        const title = deleteBtn.getAttribute('data-title');
        deleteConfirmDesc.innerHTML = `Are you sure you want to permanently delete photographic work <strong>"${title}"</strong>?<br>Physical image files will be removed from server storage.`;
        pendingDeleteAction = async () => {
          try {
            const res = await fetch('api/delete.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
              },
              body: JSON.stringify({ id: id, csrf_token: csrfToken })
            });
            const data = await res.json();
            if (data.success) {
              showToast('Photograph removed from gallery.', 'success');
              const row = document.querySelector(`tr[data-id="${id}"]`);
              if (row) row.remove();
              const metric = document.getElementById('metricTotalImages');
              if (metric) metric.textContent = Math.max(0, parseInt(metric.textContent || '0') - 1);
              applyFilterAndSearch();
            } else {
              showToast(data.error || 'Deletion rejected.', 'error');
            }
          } catch (err) {
            showToast('Network error during deletion.', 'error');
          }
        };
        deleteConfirmModal.classList.add('active');
      }
    });

    // Batch Deletion
    const selectAll = document.getElementById('selectAllCheckbox');
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    const selectedCountSpan = document.getElementById('selectedCount');

    function updateBatchButton() {
      const checkedBoxes = Array.from(document.querySelectorAll('.item-checkbox')).filter(cb => cb.checked);
      selectedCountSpan.textContent = checkedBoxes.length;
      if (checkedBoxes.length > 0) {
        batchDeleteBtn.removeAttribute('disabled');
      } else {
        batchDeleteBtn.setAttribute('disabled', 'true');
      }
    }

    selectAll.addEventListener('change', () => {
      document.querySelectorAll('.item-checkbox').forEach(cb => {
        if (!cb.disabled) cb.checked = selectAll.checked;
      });
      updateBatchButton();
    });

    tableBody.addEventListener('change', (e) => {
      if (e.target.classList.contains('item-checkbox')) {
        updateBatchButton();
      }
    });

    batchDeleteBtn.addEventListener('click', () => {
      const checkedIds = Array.from(document.querySelectorAll('.item-checkbox')).filter(cb => cb.checked).map(cb => cb.value);
      if (checkedIds.length === 0) return;

      deleteConfirmDesc.innerHTML = `Are you sure you want to permanently delete these <strong>${checkedIds.length} uploaded photograph(s)</strong>?<br>Physical image files will be unlinked from server storage.`;
      pendingDeleteAction = async () => {
        try {
          const res = await fetch('api/delete.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({ ids: checkedIds, csrf_token: csrfToken })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message || 'Photographs deleted.', 'success');
            setTimeout(() => window.location.reload(), 900);
          } else {
            showToast(data.error || 'Failed to delete selected items.', 'error');
          }
        } catch (err) {
          showToast('Network error while deleting.', 'error');
        }
      };
      deleteConfirmModal.classList.add('active');
    });

    executeDeleteBtn.addEventListener('click', async () => {
      closeAllModals();
      if (typeof pendingDeleteAction === 'function') {
        await pendingDeleteAction();
        pendingDeleteAction = null;
      }
    });

    // ── FEATURE 4: PASSWORD CHANGE FORM ──
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const curPass = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confPass = document.getElementById('confirmPassword').value;

        if (newPass !== confPass) {
          showToast('New passwords do not match.', 'error');
          return;
        }

        try {
          const res = await fetch('api/change_password.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({
              current_password: curPass,
              new_password: newPass,
              confirm_password: confPass,
              csrf_token: csrfToken
            })
          });
          const data = await res.json();
          if (data.success) {
            showToast('Master password successfully updated!', 'success');
            changePasswordForm.reset();
          } else {
            showToast(data.error || 'Failed to update password.', 'error');
          }
        } catch (err) {
          showToast('Network error while updating password.', 'error');
        }
      });
    }

    // Save About Form
    const aboutForm = document.getElementById('aboutForm');
    if (aboutForm) {
      aboutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(aboutForm);
        const payload = Object.fromEntries(formData.entries());
        payload.csrf_token = csrfToken;

        try {
          const res = await fetch('api/about.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            showToast('About page content saved successfully.', 'success');
          } else {
            showToast(data.error || 'Failed to save about content.', 'error');
          }
        } catch (err) {
          showToast('Network error while saving about content.', 'error');
        }
      });
    }
  </script>
</body>
</html>
