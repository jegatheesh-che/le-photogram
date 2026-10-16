import fs from 'fs';
import path from 'path';

// Complete replacement mapping: missing/old filename -> authentic existing photography file in assets/images/
const imageMapping = {
  // Navigation Avatar used across all 10 pages
  '0DGXFfA98AkvUw7Cbmypov7C6I.png': 'founder-portrait.jpg',

  // Missing Framer hashes -> Authentic real shoot photography
  '5KfOzCUwYK2jacJ8iTfFycycvyk.png': 'portfolio-candid-bride-veil.jpg',
  'dduHwIIbbFXsa4T2Mch7Wlcoy4.png': '347e4fe5a1d081934132ad2aa77f9eaf.jpg',
  'iisCkSgbcBgCUrw6rWjtq5xG4M.png': '29f58f41673f164606871a8a6b657421.jpg',
  '5FVxLPXl7bHRFIxltvQ6Ol5f5HA.png': 'team-noah-bennett.jpg',
  'tyLJqX8gbQET4uhqqYt3We2vw.png': 'ce904e084f0ff9ba7b1fe77b3fabec77.jpg',
  'l32dAuLaWvvsiSYIEFVj8jPVHY.png': '313172c0ba6fe58093501d063cf03a97.jpg',
  'yRtsYoNpV3SObvhjNEneoCV6x3E.png': 'edbf03402b2e6eaedc6a29fb1907825a.jpg',
  'tlDNkFwtqh3IWPtxRxvhTOs74.png': '66a0e78253cb542bb6dc9fcb15cffe63.jpg',
  'KBojH2xpWX2tjI39CDTdXsCFyPs.png': 'fbcca3c7dd64f0e99f29ea48277b32dc.jpg',
  't08lgENNOFurFehR5kdpfYF3Es.png': 'dfceb4531752949acdea3a718fdac20d.jpg',
  'pnZkuV81YuHeZnjz0R8jKTSeY.png': '00338b3b72d997724fcc69f93b901984.jpg',
  'qKEv06WOCxODrJZMRTlLcY9o0.png': 'services-hero-dining.jpg',
  'u7eF8zESaIQx3EYeRHv9ZD2JlqE.png': '18ebdf0184fba0198d8c48f1b7cf3dfb.jpg',
  'BgAs9nFkxUesDj4duwk7cf57IU.png': 'a5e5d783276655369a6e431bd5bacb0c.jpg'
};

const imgDir = path.join('assets', 'images');

// Validate all target files exist
console.log('Validating replacement targets...');
for (const [oldName, newName] of Object.entries(imageMapping)) {
  const p = path.join(imgDir, newName);
  if (!fs.existsSync(p)) {
    console.error(`ERROR: Replacement target does not exist: ${newName}`);
    process.exit(1);
  }
}
console.log('All replacement targets exist on disk!');

// Update all HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let totalReplacements = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let fileReplacements = 0;

  for (const [oldName, newName] of Object.entries(imageMapping)) {
    const pattern = new RegExp(`assets/images/${oldName.replace('.', '\\.')}`, 'g');
    const matches = (content.match(pattern) || []).length;
    if (matches > 0) {
      content = content.replace(pattern, `assets/images/${newName}`);
      fileReplacements += matches;
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}: ${fileReplacements} replacements made.`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\nTotal image reference replacements across all HTML files: ${totalReplacements}`);

// Re-check for any remaining missing images
let remainingMissing = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /assets\/images\/([^"'()\s]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const img = match[1];
    if (!fs.existsSync(path.join(imgDir, img))) {
      console.warn(`WARNING: Remaining missing image in ${file}: ${img}`);
      remainingMissing++;
    }
  }
});

console.log(`\nRemaining missing images across all pages: ${remainingMissing}`);
if (remainingMissing === 0) {
  console.log('SUCCESS! 100% of image references across the entire website point to existing, authentic original photography!');
}
