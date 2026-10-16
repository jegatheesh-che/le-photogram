import fs from 'fs';
import path from 'path';

const whatsappHtml = `
  <!-- Floating Round WhatsApp Button -->
  <a href="https://wa.me/12125550192?text=Hello%20Le%20PhotoGRAM%2C%20I%20would%20like%20to%20inquire%20about%20wedding%20photography%20and%20films." class="whatsapp-float-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat with Atelier on WhatsApp">
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 6.94C8.87 6.94 8.55 7.01 8.28 7.31C8.01 7.6 7.23 8.33 7.23 9.82C7.23 11.31 8.32 12.74 8.47 12.94C8.62 13.14 10.6 16.2 13.63 17.51C14.35 17.82 14.92 18.01 15.35 18.15C16.08 18.38 16.74 18.35 17.27 18.27C17.85 18.18 19.07 17.53 19.32 16.82C19.58 16.11 19.58 15.5 19.5 15.38C19.42 15.26 19.23 15.19 18.94 15.05C18.66 14.9 17.28 14.22 17.03 14.12C16.77 14.03 16.58 13.98 16.39 14.27C16.2 14.56 15.65 15.19 15.49 15.38C15.32 15.58 15.15 15.6 14.87 15.46C14.59 15.31 13.68 15.01 12.61 14.06C11.78 13.32 11.22 12.41 11.05 12.12C10.89 11.83 11.03 11.68 11.18 11.53C11.31 11.4 11.47 11.19 11.61 11.02C11.76 10.85 11.81 10.73 11.9 10.53C12 10.34 11.95 10.17 11.88 10.02C11.81 9.88 11.23 8.44 10.99 7.85C10.75 7.28 10.52 7.36 10.34 7.35C10.17 7.34 9.98 7.34 9.79 7.34C9.59 7.34 9.26 7.41 9.06 7.63"/>
    </svg>
    <span class="whatsapp-float-tooltip">Inquire on WhatsApp</span>
  </a>
`;

const htmlFiles = [
  'index.html',
  'about.html',
  'portfolio.html',
  'services.html',
  'testimonials.html',
  'faq.html',
  'booking.html',
  'contact.html',
  'work.html',
  'legal/terms-conditions.html',
  'legal/privacy-policy.html',
  'legal/cookie-policy.html'
];

htmlFiles.forEach(relPath => {
  const fullPath = path.resolve('d:/website-development-agency/le photogram paid', relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes('class="whatsapp-float-btn"')) {
    console.log(`Already has WhatsApp button: ${relPath}`);
    return;
  }
  if (content.includes('</body>')) {
    content = content.replace('</body>', `${whatsappHtml}\n</body>`);
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Injected WhatsApp button into: ${relPath}`);
  }
});
