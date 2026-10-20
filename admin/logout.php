<?php
/**
 * LE PHOTOGRAM - Secure Admin Logout Handler
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

logout_admin();

header('Location: login.php?logged_out=1');
exit;
