/**
 * Cinematic Dolly Zoom (Vertigo Effect) Controller
 * Continuously scales and warps perspective on scroll.
 */
(function initDollyZoom() {
  const container = document.getElementById('dollyZoomDemo') || document.querySelector('.dolly-zoom-container');
  if (!container) return;

  const frame = container.querySelector('.dolly-zoom-frame') || container;
  const img = container.querySelector('.dolly-zoom-img');
  if (!img) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    img.style.transform = 'scale(1) translate3d(0, 0, 0)';
    return;
  }

  // If GSAP and ScrollTrigger are available, use them
  if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.fromTo(
      img,
      { scale: 1.15, yPercent: -4 },
      {
        scale: 1.02,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
    return;
  }

  // Pure Vanilla Fallback
  let ticking = false;

  function updateDollyZoom() {
    const rect = frame.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top <= windowH && rect.bottom >= 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));

      // Lerp scale: 1.15 -> 1.02
      const currentScale = 1.15 - (clamped * 0.13);
      // Lerp yPercent: -4% -> +4%
      const currentY = -4 + (clamped * 8);

      img.style.transform = `scale(${currentScale.toFixed(4)}) translate3d(0, ${currentY.toFixed(2)}%, 0)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateDollyZoom);
      ticking = true;
    }
  }, { passive: true });

  updateDollyZoom();
})();
