import { resolve } from 'path';
import { defineConfig } from 'vite';

const rootDir = import.meta.dirname || process.cwd();

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        about: resolve(rootDir, 'about.html'),
        portfolio: resolve(rootDir, 'portfolio.html'),
        services: resolve(rootDir, 'services.html'),
        testimonials: resolve(rootDir, 'testimonials.html'),
        contact: resolve(rootDir, 'contact.html'),
        booking: resolve(rootDir, 'booking.html'),
        faq: resolve(rootDir, 'faq.html'),
        work: resolve(rootDir, 'work.html'),
        works: resolve(rootDir, 'works.html'),
        privacy: resolve(rootDir, 'legal/privacy-policy.html'),
        terms: resolve(rootDir, 'legal/terms-conditions.html'),
        cookies: resolve(rootDir, 'legal/cookie-policy.html')
      }
    }
  }
});
