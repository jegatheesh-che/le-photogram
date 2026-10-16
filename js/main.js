import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav } from './nav.js';
import { initParallax } from './parallax.js';
import { initMotion } from './motion.js';
import { initLightbox } from './lightbox.js';
import { initCounters } from './counters.js';
import { initCarousels } from './carousels.js';
import { initFAQ } from './faq.js';
import { initPortfolioFilter } from './portfolio-filter.js';
import { initForms } from './forms.js';
import { initWorkDetail } from './work-detail.js';
import { initBookingSlideshow } from './booking-slideshow.js';
import { initWorksDeck } from './works-deck.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Lenis smooth scroll
  if (!prefersReduced) {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Provide 500ms smoothing with 33ms target for buttery frame recovery
    gsap.ticker.lagSmoothing(500, 33);
  }

  // Initialize features
  initNav();
  initParallax();
  initMotion();
  initLightbox();
  initCounters();
  initCarousels();
  initFAQ();
  initPortfolioFilter();
  initForms();
  initBookingSlideshow();
  initWorksDeck();

  if (document.querySelector('#work-detail-hero-section') || document.querySelector('.work-detail-grid')) {
    initWorkDetail();
  }
});
