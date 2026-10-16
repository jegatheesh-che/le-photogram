/**
 * Parallax Image Frame Controller
 * Provides buttery scroll scrubbing (Vanilla or GSAP ScrollTrigger compatible)
 */
(function initParallaxFrame() {
  const frame = document.getElementById('demoParallaxFrame') || document.querySelector('.parallax-frame');
  if (!frame) return;

  const img = frame.querySelector('.parallax-img');
  if (!img) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Check if GSAP and ScrollTrigger are loaded in current environment
  if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.fromTo(
      img,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    );
    return;
  }

  // Pure Vanilla Fallback using IntersectionObserver & requestAnimationFrame
  let ticking = false;

  function updateVanillaParallax() {
    const rect = frame.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Check if within viewport
    if (rect.top <= windowH && rect.bottom >= 0) {
      // Calculate progress 0 (entering bottom) to 1 (leaving top)
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      // Map 0 -> 1 to -10% -> +10% translation
      const yOffset = (clamped - 0.5) * 60; // +/- 30px
      img.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateVanillaParallax);
      ticking = true;
    }
  }, { passive: true });

  updateVanillaParallax();
})();
