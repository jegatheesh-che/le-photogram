import { gsap } from 'gsap';

/**
 * Booking Page Luxury Split Slideshow
 * Order: [75, 31, 39, 43, 65]
 * Buttery smooth GSAP cinematic crossfade, 2-second interval, touch swipe, keyboard nav
 */
export function initBookingSlideshow() {
  const container = document.getElementById('bookingSlideshow');
  if (!container || container.dataset.slideshowInit === 'true') return;
  container.dataset.slideshowInit = 'true';

  const slides = container.querySelectorAll('.booking-slide');
  const dots = container.querySelectorAll('.booking-indicator-dot');
  const prevBtn = container.querySelector('.booking-slide-arrow.prev-slide');
  const nextBtn = container.querySelector('.booking-slide-arrow.next-slide');
  const currentNumEl = container.querySelector('.booking-counter-current');

  if (!slides.length) return;

  const total = slides.length;
  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 2000; // Changes every 2s

  // Initialize initial slides state
  slides.forEach((slide, i) => {
    if (i === 0) {
      gsap.set(slide, { opacity: 1, scale: 1, zIndex: 2 });
      slide.classList.add('active');
      slide.setAttribute('aria-hidden', 'false');
    } else {
      gsap.set(slide, { opacity: 0, scale: 1.04, zIndex: 0 });
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
    }
  });

  function updateSlides(targetIndex) {
    if (targetIndex < 0) targetIndex = total - 1;
    if (targetIndex >= total) targetIndex = 0;
    if (targetIndex === currentIndex) return;

    const prevIndex = currentIndex;
    const prevSlide = slides[prevIndex];
    const nextSlide = slides[targetIndex];
    currentIndex = targetIndex;

    // Keep prevSlide under the incoming slide so it never flashes black
    slides.forEach((slide, idx) => {
      if (idx !== currentIndex && idx !== prevIndex) {
        gsap.set(slide, { zIndex: 0, opacity: 0 });
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    if (prevSlide) {
      gsap.set(prevSlide, { zIndex: 1, opacity: 1 });
      prevSlide.classList.remove('active');
      prevSlide.setAttribute('aria-hidden', 'true');
    }

    // Set next slide on top and animate in smoothly
    gsap.set(nextSlide, { zIndex: 2 });
    nextSlide.classList.add('active');
    nextSlide.setAttribute('aria-hidden', 'false');

    // Buttery smooth crossfade with subtle cinematic scale ease
    gsap.fromTo(
      nextSlide,
      { opacity: 0, scale: 1.04 },
      {
        opacity: 1,
        scale: 1.0,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          if (prevSlide && prevIndex !== currentIndex) {
            gsap.set(prevSlide, { opacity: 0, zIndex: 0 });
          }
        }
      }
    );

    // Update Dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    // Update Counter with gentle micro-fade
    if (currentNumEl) {
      gsap.to(currentNumEl, {
        opacity: 0,
        y: -3,
        duration: 0.15,
        onComplete: () => {
          currentNumEl.textContent = String(currentIndex + 1).padStart(2, '0');
          gsap.to(currentNumEl, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        }
      });
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateSlides(currentIndex + 1);
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Previous & Next Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoplay();
      updateSlides(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoplay();
      updateSlides(currentIndex + 1);
      startAutoplay();
    });
  }

  // Dot Indicator clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        stopAutoplay();
        updateSlides(targetIndex);
        startAutoplay();
      }
    });
  });

  // Touch Swipe for Mobile / Tablet
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      stopAutoplay();
      if (diff < 0) {
        updateSlides(currentIndex + 1);
      } else {
        updateSlides(currentIndex - 1);
      }
      startAutoplay();
    }
  }, { passive: true });

  // Pause on hover
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.key === 'ArrowLeft') {
      stopAutoplay();
      updateSlides(currentIndex - 1);
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      stopAutoplay();
      updateSlides(currentIndex + 1);
      startAutoplay();
    }
  });

  startAutoplay();
}

// Auto-run if loaded via script tag
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingSlideshow);
  } else {
    initBookingSlideshow();
  }
}
