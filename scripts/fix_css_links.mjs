import fs from 'fs';

const rootFiles = [
  'index.html',
  'about.html',
  'portfolio.html',
  'services.html',
  'testimonials.html',
  'faq.html',
  'booking.html',
  'contact.html',
  'work.html'
];

const legalFiles = [
  'legal/privacy-policy.html',
  'legal/terms-conditions.html',
  'legal/cookie-policy.html'
];

rootFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*pages\.css"[^>]*>/g, `  <link rel="stylesheet" href="css/base.css">\n  <link rel="stylesheet" href="css/components.css">\n  <link rel="stylesheet" href="css/pages.css">`);
  html = html.replace(/<script[^>]*src="[^"]*bundle\.js"[^>]*><\/script>/g, `<script type="module" src="js/main.js"></script>`);
  fs.writeFileSync(f, html, 'utf8');
  console.log(`Fixed CSS/JS in ${f}`);
});

legalFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*pages\.css"[^>]*>/g, `  <link rel="stylesheet" href="../css/base.css">\n  <link rel="stylesheet" href="../css/components.css">\n  <link rel="stylesheet" href="../css/pages.css">`);
  html = html.replace(/<script[^>]*src="[^"]*bundle\.js"[^>]*><\/script>/g, `<script type="module" src="../js/main.js"></script>`);
  fs.writeFileSync(f, html, 'utf8');
  console.log(`Fixed CSS/JS in ${f}`);
});
