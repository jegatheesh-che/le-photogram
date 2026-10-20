<?php
/**
 * LE PHOTOGRAM - Secure Image Processing Utility
 * EXIF orientation correction, proportional resizing, and WebP conversion via PHP GD.
 */

require_once __DIR__ . '/config.php';

class ImageProcessor {

    /**
     * Corrects image orientation based on EXIF metadata (JPEG only).
     */
    private static function correctExifOrientation(\GdImage $image, string $filePath): \GdImage {
        if (!function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data($filePath);
        if (!$exif || empty($exif['Orientation'])) {
            return $image;
        }

        $orientation = (int)$exif['Orientation'];
        $rotated = $image;

        switch ($orientation) {
            case 2: // Horizontal flip
                imageflip($rotated, IMG_FLIP_HORIZONTAL);
                break;
            case 3: // 180 rotate
                $rotated = imagerotate($image, 180, 0);
                imagedestroy($image);
                break;
            case 4: // Vertical flip
                imageflip($rotated, IMG_FLIP_VERTICAL);
                break;
            case 5: // Vertical flip + 90 rotate CCW
                imageflip($rotated, IMG_FLIP_VERTICAL);
                $rotated = imagerotate($rotated, 270, 0);
                break;
            case 6: // 90 rotate CW
                $rotated = imagerotate($image, 270, 0);
                imagedestroy($image);
                break;
            case 7: // Horizontal flip + 90 rotate CCW
                imageflip($rotated, IMG_FLIP_HORIZONTAL);
                $rotated = imagerotate($rotated, 270, 0);
                break;
            case 8: // 90 rotate CCW
                $rotated = imagerotate($image, 90, 0);
                imagedestroy($image);
                break;
        }

        return $rotated;
    }

    /**
     * Resizes the image proportionally if it exceeds maximum dimensions.
     */
    private static function resizeProportionally(\GdImage $image, int $maxWidth, int $maxHeight): \GdImage {
        $origWidth = imagesx($image);
        $origHeight = imagesy($image);

        if ($origWidth <= $maxWidth && $origHeight <= $maxHeight) {
            return $image;
        }

        $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight);
        $newWidth = (int)max(1, round($origWidth * $ratio));
        $newHeight = (int)max(1, round($origHeight * $ratio));

        $newImage = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve alpha transparency
        imagealphablending($newImage, false);
        imagesavealpha($newImage, true);
        $transparent = imagecolorallocatealpha($newImage, 0, 0, 0, 127);
        imagefilledrectangle($newImage, 0, 0, $newWidth, $newHeight, $transparent);

        imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
        imagedestroy($image);

        return $newImage;
    }

    /**
     * Processes an uploaded image file:
     * 1. Validates MIME type using finfo.
     * 2. Loads into GD based on type.
     * 3. Corrects EXIF orientation.
     * 4. Resizes proportionally.
     * 5. Saves as WebP to destination.
     *
     * Returns array with metadata or throws Exception.
     */
    public static function processUpload(string $tmpFilePath, string $destDir): array {
        if (!file_exists($tmpFilePath)) {
            throw new InvalidArgumentException('Uploaded temporary file does not exist.');
        }

        // Validate actual MIME type using fileinfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmpFilePath);

        if (!array_key_exists($mime, ALLOWED_MIME_TYPES)) {
            throw new InvalidArgumentException("Unsupported image MIME type: '{$mime}'. Allowed: JPEG, PNG, WebP.");
        }

        // Create GD resource from original format
        $gdImage = null;
        switch ($mime) {
            case 'image/jpeg':
                $gdImage = @imagecreatefromjpeg($tmpFilePath);
                if ($gdImage) {
                    $gdImage = self::correctExifOrientation($gdImage, $tmpFilePath);
                }
                break;
            case 'image/png':
                $gdImage = @imagecreatefrompng($tmpFilePath);
                if ($gdImage) {
                    imagealphablending($gdImage, true);
                    imagesavealpha($gdImage, true);
                }
                break;
            case 'image/webp':
                $gdImage = @imagecreatefromwebp($tmpFilePath);
                break;
        }

        if (!$gdImage) {
            throw new RuntimeException('Failed to process image data with PHP GD library.');
        }

        // Resize proportionally if dimensions exceed thresholds
        $gdImage = self::resizeProportionally($gdImage, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT);

        $finalWidth = imagesx($gdImage);
        $finalHeight = imagesy($gdImage);

        // Ensure destination directory exists
        if (!is_dir($destDir)) {
            if (!@mkdir($destDir, 0755, true) && !is_dir($destDir)) {
                imagedestroy($gdImage);
                throw new RuntimeException('Failed to create upload destination directory.');
            }
        }

        // Generate unique server-side filename
        $uniqueName = 'lp_' . bin2hex(random_bytes(8)) . '_' . time() . '.webp';
        $destPath = rtrim($destDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $uniqueName;

        // Convert to WebP format
        $saved = imagewebp($gdImage, $destPath, WEBP_QUALITY);
        imagedestroy($gdImage);

        if (!$saved || !file_exists($destPath)) {
            throw new RuntimeException('Failed to save WebP image to server storage.');
        }

        return [
            'filename' => $uniqueName,
            'path'     => UPLOAD_URL_PREFIX . $uniqueName,
            'full_path'=> $destPath,
            'width'    => $finalWidth,
            'height'   => $finalHeight,
            'filesize' => filesize($destPath)
        ];
    }
}
