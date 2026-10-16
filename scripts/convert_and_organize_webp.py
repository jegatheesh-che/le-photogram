import os
import shutil
import re
import json
from PIL import Image

def run_conversion():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    img_dir = os.path.join(base_dir, 'assets', 'images')
    backup_dir = os.path.join(base_dir, 'assets', 'images_original_backup')
    
    os.makedirs(backup_dir, exist_ok=True)
    
    # 1. Identify all files in assets/images
    all_files = [f for f in os.listdir(img_dir) if os.path.isfile(os.path.join(img_dir, f))]
    image_files = [f for f in all_files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    print(f"Total image files found in assets/images: {len(image_files)}")
    
    # Backup original files first
    for f in image_files:
        src = os.path.join(img_dir, f)
        dst = os.path.join(backup_dir, f)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
    print(f"Backed up {len(image_files)} original files to assets/images_original_backup/")
    
    # 2. Find currently used images across HTML, CSS, JS
    used_images_ordered = []
    
    # Specifically list key pages in order to give logical numbering
    scan_order = [
        'portfolio.html', 'index.html', 'about.html', 'services.html', 
        'testimonials.html', 'booking.html', 'contact.html', 'faq.html',
        'work.html', 'works.html'
    ]
    
    for page in scan_order:
        p = os.path.join(base_dir, page)
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                matches = re.findall(r'assets/images/([a-zA-Z0-9_\-\.]+\.(?:jpg|jpeg|png))', c, re.IGNORECASE)
                for m in matches:
                    if m in image_files and m not in used_images_ordered:
                        used_images_ordered.append(m)
                        
    # Also scan css and js
    for root, dirs, files in os.walk(base_dir):
        if any(x in root for x in ['node_modules', '.git', 'dist', 'scripts', 'images_original_backup']):
            continue
        for f in files:
            if f.endswith(('.html', '.css', '.js')):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    c = fp.read()
                    matches = re.findall(r'assets/images/([a-zA-Z0-9_\-\.]+\.(?:jpg|jpeg|png))', c, re.IGNORECASE)
                    for m in matches:
                        if m in image_files and m not in used_images_ordered:
                            used_images_ordered.append(m)
                            
    print(f"Identified {len(used_images_ordered)} actively used images across codebase.")
    
    # 3. Create deterministic mapping:
    # Actively used images get img1.webp, img2.webp, ...
    # Unused reserve images get imgX.webp, imgY.webp, ...
    mapping = {}
    counter = 1
    
    for f in used_images_ordered:
        mapping[f] = f"img{counter}.webp"
        counter += 1
        
    for f in image_files:
        if f not in mapping:
            mapping[f] = f"img{counter}.webp"
            counter += 1
            
    print(f"Generated clean mapping for all {len(mapping)} images (img1.webp to img{len(mapping)}.webp).")
    
    # Save mapping to json for transparency
    map_path = os.path.join(base_dir, 'scripts', 'image_mapping.json')
    with open(map_path, 'w', encoding='utf-8') as fp:
        json.dump(mapping, fp, indent=2)
    print(f"Saved mapping reference to {map_path}")
    
    # 4. Convert and compress all images to WebP
    total_orig_bytes = 0
    total_webp_bytes = 0
    
    converted_files = []
    
    for orig_name, new_name in mapping.items():
        src_path = os.path.join(backup_dir, orig_name)
        dst_path = os.path.join(img_dir, new_name)
        
        orig_size = os.path.getsize(src_path)
        total_orig_bytes += orig_size
        
        with Image.open(src_path) as im:
            # Preserve transparency if present
            if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                im_conv = im.convert('RGBA')
            else:
                im_conv = im.convert('RGB')
            
            # Save as high-quality WebP with method 6 (maximum compression efficiency)
            im_conv.save(dst_path, 'WEBP', quality=84, method=6)
            
        webp_size = os.path.getsize(dst_path)
        total_webp_bytes += webp_size
        converted_files.append((orig_name, new_name, orig_size, webp_size))
        
    reduction_pct = ((total_orig_bytes - total_webp_bytes) / total_orig_bytes) * 100
    print(f"\nCompression Complete!")
    print(f"Total Original Size: {total_orig_bytes / (1024*1024):.2f} MB")
    print(f"Total WebP Size:     {total_webp_bytes / (1024*1024):.2f} MB")
    print(f"Bandwidth Saved:     {reduction_pct:.1f}% reduction!")
    
    # 5. Remove original JPG/PNG files from assets/images so directory is 100% clean
    for f in image_files:
        p = os.path.join(img_dir, f)
        if os.path.exists(p) and not f.endswith('.webp'):
            os.remove(p)
    print(f"Cleaned up old uncompressed files from assets/images. Directory now contains only clean .webp files.")
    
    # 6. Update references across all HTML, CSS, JS files
    target_extensions = ('.html', '.css', '.js')
    total_file_updates = 0
    total_ref_updates = 0
    
    for root, dirs, files in os.walk(base_dir):
        if any(x in root for x in ['node_modules', '.git', 'dist', 'scripts', 'images_original_backup']):
            continue
        for f in files:
            if f.endswith(target_extensions):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                updated_content = content
                file_replacements = 0
                
                for orig_name, new_name in mapping.items():
                    # Match assets/images/orig_name
                    # Also match ../assets/images/orig_name
                    # Also match orig_name if preceded by assets/images/
                    pattern = rf'(assets/images/){re.escape(orig_name)}'
                    matches = len(re.findall(pattern, updated_content))
                    if matches > 0:
                        updated_content = re.sub(pattern, rf'\g<1>{new_name}', updated_content)
                        file_replacements += matches
                
                # Also handle any lingering old hashes that might have been in legal or js/carousels
                old_leftovers = {
                    '0DGXFfA98AkvUw7Cbmypov7C6I.png': mapping.get('founder-portrait.jpg', 'img1.webp'),
                    'BgAs9nFkxUesDj4duwk7cf57IU.png': mapping.get('a5e5d783276655369a6e431bd5bacb0c.jpg', 'img10.webp'),
                    'dduHwIIbbFXsa4T2Mch7Wlcoy4.png': mapping.get('347e4fe5a1d081934132ad2aa77f9eaf.jpg', 'img7.webp'),
                    't08lgENNOFurFehR5kdpfYF3Es.png': mapping.get('dfceb4531752949acdea3a718fdac20d.jpg', 'img9.webp'),
                    'qTQsxEszJdqPTnpUiBxU19v6dbQ.png': mapping.get('edbf03402b2e6eaedc6a29fb1907825a.jpg', 'img8.webp'),
                }
                for old_h, target_webp in old_leftovers.items():
                    pattern = rf'(assets/images/){re.escape(old_h)}'
                    matches = len(re.findall(pattern, updated_content))
                    if matches > 0:
                        updated_content = re.sub(pattern, rf'\g<1>{target_webp}', updated_content)
                        file_replacements += matches
                
                if file_replacements > 0:
                    with open(p, 'w', encoding='utf-8') as fp:
                        fp.write(updated_content)
                    total_file_updates += 1
                    total_ref_updates += file_replacements
                    print(f"  Updated {os.path.relpath(p, base_dir)}: {file_replacements} references updated.")
                    
    print(f"\nSuccessfully updated {total_ref_updates} image references across {total_file_updates} files.")
    
    # 7. Final Verification
    missing_count = 0
    for root, dirs, files in os.walk(base_dir):
        if any(x in root for x in ['node_modules', '.git', 'dist', 'scripts', 'images_original_backup']):
            continue
        for f in files:
            if f.endswith(target_extensions):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    c = fp.read()
                matches = re.findall(r'assets/images/([a-zA-Z0-9_\-\.]+\.webp)', c)
                for m in matches:
                    full_p = os.path.join(img_dir, m)
                    if not os.path.exists(full_p):
                        print(f"ERROR: Missing WebP reference {m} in {p}")
                        missing_count += 1
                        
    if missing_count == 0:
        print(f"VERIFIED: 100% of WebP image references across all HTML, CSS, and JS files exist on disk!")
    else:
        print(f"WARNING: {missing_count} missing references detected.")

if __name__ == '__main__':
    run_conversion()
