/**
 * Luxury Click-to-Zoom Lightbox Modal Logic
 * Attaches zoom interactions to trigger elements and manages fullscreen display.
 */
(function initZoomLightboxModal() {
  const lightbox = document.getElementById('siteLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('#lightboxActiveImg');
  const lightboxCaption = lightbox.querySelector('#lightboxCaption');
  const closeBtn = lightbox.querySelector('#lightboxCloseBtn');

  let isOpen = false;

  function openLightbox(src, altText) {
    if (!src || isOpen) return;
    isOpen = true;
    lightboxImg.src = src;
    lightboxImg.alt = altText || 'Zoomed photography preview';
    if (lightboxCaption) lightboxCaption.textContent = altText || '';

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!isOpen) {
        lightboxImg.src = '';
        document.body.style.overflow = '';
      }
    }, 350);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

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

  // Example trigger setup
  const triggers = document.querySelectorAll('.zoomable-preview-img, [data-lightbox="true"]');
  triggers.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
    });
  });

  // Expose API globally for external programmatic calls
  window.AtelierLightbox = {
    open: openLightbox,
    close: closeLightbox
  };
})();
