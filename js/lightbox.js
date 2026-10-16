import { gsap } from 'gsap';

/**
 * Universal Click-to-Zoom Lightbox Modal
 * Smooth zoom-in and zoom-out experience for all photography assets.
 */
export function initLightbox() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Ensure Lightbox DOM Element Exists
  let lightbox = document.getElementById('siteLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.id = 'siteLightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button class="gallery-lightbox-close" id="lightboxCloseBtn" aria-label="Close zoomed view">&times;</button>
      <div class="gallery-lightbox-stage">
        <img src="" alt="" class="gallery-lightbox-img" id="lightboxActiveImg">
        <div class="gallery-lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('#lightboxActiveImg');
  const lightboxCaption = lightbox.querySelector('#lightboxCaption');
  const closeBtn = lightbox.querySelector('#lightboxCloseBtn');

  let isOpen = false;

  const openLightbox = (src, altText) => {
    if (!src || isOpen) return;
    isOpen = true;
    lightboxImg.src = src;
    lightboxImg.alt = altText || 'Zoomed photography preview';
    lightboxCaption.textContent = altText || '';

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!prefersReduced) {
      gsap.fromTo(
        lightboxImg,
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.42, ease: 'power3.out' }
      );
    }
  };

  const closeLightbox = () => {
    if (!isOpen) return;
    isOpen = false;

    if (!prefersReduced) {
      gsap.to(lightboxImg, {
        scale: 0.88,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          lightbox.classList.remove('active');
          lightbox.setAttribute('aria-hidden', 'true');
          lightboxImg.src = '';
          document.body.style.overflow = '';
        },
      });
    } else {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
  };

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Clicking on background or image zooms back out
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg || e.target.closest('.gallery-lightbox-stage')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeLightbox();
    }
  });

  // 2. Attach Zoom triggers to all photography images
  const zoomableSelectors = [
    '.portfolio-img-box img',
    '.work-card-img-frame img',
    '.about-hero-portrait-img',
    '.about-pullquote-img',
    '.workwith-visual-col img',
    '.axis-overlap-photo',
    '.floral-portrait-img',
    '.gallery-item img',
    '.curated-card-avatar',
    '.allure-portrait-img',
    '.triptych-center-img',
    '.triptych-stacked-img'
  ];

  const attachZoomListeners = () => {
    const images = document.querySelectorAll(zoomableSelectors.join(', '));
    images.forEach((img) => {
      if (img.dataset.hasZoomListener) return;
      img.dataset.hasZoomListener = 'true';

      // If the image is inside an actionable navigation link (e.g. portfolio card or case study),
      // preserve native link navigation so cards navigate seamlessly to project detail pages!
      const parentLink = img.closest('a[href]');
      const href = parentLink?.getAttribute('href')?.trim();
      const isNavigatingLink = href && href !== '#' && !href.startsWith('javascript:');

      if (isNavigatingLink) {
        return; // Allow native link navigation
      }

      img.style.cursor = 'zoom-in';

      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || 'Fine art photography preview';
        openLightbox(src, alt);
      });
    });

    // Also attach to .portfolio-grid-item cards directly for flawless click & keyboard accessibility
    const portfolioTiles = document.querySelectorAll('.portfolio-grid-item');
    portfolioTiles.forEach((tile) => {
      if (tile.dataset.hasTileZoomListener) return;
      tile.dataset.hasTileZoomListener = 'true';
      const triggerOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const img = tile.querySelector('img');
        if (img) {
          const src = img.getAttribute('src');
          const alt = img.getAttribute('alt') || 'Fine art photography preview';
          openLightbox(src, alt);
        }
      };
      tile.addEventListener('click', triggerOpen);
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerOpen(e);
        }
      });
    });
  };

  attachZoomListeners();

  // Re-attach for dynamically added gallery items (e.g. work-detail)
  const observer = new MutationObserver(() => {
    attachZoomListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
