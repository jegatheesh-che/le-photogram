import { gsap } from 'gsap';

/**
 * Works Section - Luxury Editorial Overlapping Deck (QASIMI Reference Architecture)
 * - 5-story layered depth stack with dynamic relative positioning
 * - Smooth cinematic card cycle every 2 seconds
 * - Elegant exit glide (prevents z-index jumping) & seamless forward motion
 * - Touch swipe, drag, click-to-focus, pause on hover
 */
export function initWorksDeck() {
  const stage = document.querySelector('.works-qasimi-stage');
  if (!stage) return;

  const deckWrapper = stage.querySelector('#worksDeckWrapper');
  const cards = stage.querySelectorAll('.works-deck-card');
  const prevBtn = stage.querySelector('#worksDeckPrev');
  const nextBtn = stage.querySelector('#worksDeckNext');
  const counterEl = stage.querySelector('#worksCounterCurrent');
  const progressFill = stage.querySelector('#worksProgressFill');
  const titleEl = stage.querySelector('#worksActiveTitle');
  const subEl = stage.querySelector('#worksActiveSub');
  const mobileCounter = document.querySelector('#worksMobileCounter');
  const mobileDots = document.querySelectorAll('.works-mobile-dot');

  if (!cards.length) return;

  const total = cards.length;
  let currentIndex = 0;
  let isAnimating = false;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 2000; // Changes every 2s as requested

  // Responsive offsets based on viewport width
  function getLayoutOffsets() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1100;

    if (isMobile) {
      return {
        stepX: 16,
        scaleStep: 0.045,
        exitX: -40,
      };
    } else if (isTablet) {
      return {
        stepX: 140,
        scaleStep: 0.07,
        exitX: -70,
      };
    } else {
      return {
        stepX: 185,
        scaleStep: 0.07,
        exitX: -85,
      };
    }
  }

  function updateDeck(targetIndex, direction = 'next', isInitial = false) {
    if (targetIndex < 0) targetIndex = total - 1;
    if (targetIndex >= total) targetIndex = 0;
    if (targetIndex === currentIndex && !isInitial) return;

    const prevIndex = currentIndex;
    currentIndex = targetIndex;
    isAnimating = true;

    const { stepX, scaleStep, exitX } = getLayoutOffsets();

    cards.forEach((card, i) => {
      // Relative offset from current active card (0 = active front, 1 = peek 1, etc.)
      const rel = (i - currentIndex + total) % total;

      card.setAttribute('data-pos', rel);
      card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');

      let targetX = 0;
      let targetScale = 1;
      let targetOpacity = 1;
      let targetZ = 10;
      let pointerEvents = 'auto';

      if (rel === 0) {
        // Active Front Card
        targetX = 0;
        targetScale = 1;
        targetOpacity = 1;
        targetZ = 10;
        card.classList.add('is-active');
      } else if (rel === 1) {
        // Peek Card 1
        targetX = stepX * 1;
        targetScale = 1 - scaleStep * 1;
        targetOpacity = 0.88;
        targetZ = 8;
        card.classList.remove('is-active');
      } else if (rel === 2) {
        // Peek Card 2
        targetX = stepX * 2;
        targetScale = 1 - scaleStep * 2;
        targetOpacity = 0.65;
        targetZ = 6;
        card.classList.remove('is-active');
      } else if (rel === 3) {
        // Peek Card 3
        targetX = stepX * 2.8;
        targetScale = 1 - scaleStep * 3;
        targetOpacity = 0.38;
        targetZ = 4;
        card.classList.remove('is-active');
      } else {
        // Hidden in queue
        targetX = stepX * 3.4;
        targetScale = 1 - scaleStep * 4;
        targetOpacity = 0;
        targetZ = 2;
        pointerEvents = 'none';
        card.classList.remove('is-active');
      }

      if (isInitial) {
        // Instant setup on first page load
        card.style.zIndex = targetZ;
        card.style.pointerEvents = pointerEvents;
        gsap.set(card, {
          x: targetX,
          scale: targetScale,
          opacity: targetOpacity,
        });
      } else if (direction === 'next' && i === prevIndex) {
        // Exiting front card: smoothly glides left with soft fade while staying on top
        card.style.zIndex = 11;
        card.style.pointerEvents = 'none';
        card.classList.remove('is-active');

        gsap.to(card, {
          x: exitX,
          scale: 0.96,
          opacity: 0,
          duration: 0.58,
          ease: 'power2.inOut',
          onComplete: () => {
            // Once faded, silently position at the back of the queue
            gsap.set(card, {
              x: targetX,
              scale: targetScale,
              opacity: 0,
            });
            card.style.zIndex = targetZ;
          },
        });
      } else if (direction === 'prev' && rel === 0) {
        // Incoming front card when moving backward: comes in from left
        card.style.zIndex = 10;
        card.style.pointerEvents = pointerEvents;
        gsap.fromTo(
          card,
          { x: exitX, scale: 0.96, opacity: 0 },
          {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto',
          }
        );
      } else {
        // Smoothly glide to target slot in stack
        card.style.zIndex = targetZ;
        card.style.pointerEvents = pointerEvents;
        gsap.to(card, {
          x: targetX,
          scale: targetScale,
          opacity: targetOpacity,
          duration: 0.68,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    });

    // Update Counter & Progress Bar if present
    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    if (progressFill) {
      const progressPercent = ((currentIndex + 1) / total) * 100;
      gsap.to(progressFill, {
        width: `${progressPercent}%`,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    // Update Story Metadata if present
    const activeCard = cards[currentIndex];
    const newTitle = activeCard.getAttribute('data-title') || '';
    const newSub = activeCard.getAttribute('data-sub') || '';

    if (titleEl && newTitle) {
      gsap.to(titleEl, {
        opacity: 0,
        y: -4,
        duration: 0.15,
        onComplete: () => {
          titleEl.textContent = newTitle;
          gsap.to(titleEl, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        },
      });
    }

    if (subEl && newSub) {
      gsap.to(subEl, {
        opacity: 0,
        y: -3,
        duration: 0.15,
        onComplete: () => {
          subEl.textContent = newSub;
          gsap.to(subEl, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        },
      });
    }

    if (mobileCounter) {
      mobileCounter.textContent = `0${currentIndex + 1} / 0${total}`;
    }
    if (mobileDots && mobileDots.length) {
      mobileDots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }

    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateDeck(currentIndex + 1, 'next');
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Navigation Arrows (if in DOM)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoplay();
      updateDeck(currentIndex - 1, 'prev');
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoplay();
      updateDeck(currentIndex + 1, 'next');
      startAutoplay();
    });
  }

  // Mobile Dots Click Handlers
  if (mobileDots && mobileDots.length) {
    mobileDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoplay();
        updateDeck(idx, idx > currentIndex ? 'next' : 'prev');
        startAutoplay();
      });
    });
  }

  let isSwiping = false;

  // Card Clicks: If active -> navigate to portfolio; if peeked -> bring to front
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (isSwiping) {
        e.preventDefault();
        return;
      }
      const rel = (idx - currentIndex + total) % total;
      if (rel === 0) {
        // Active card: navigate directly to Portfolio page
        window.location.href = 'portfolio.html';
      } else {
        // Peeked card: cycle to front
        e.preventDefault();
        stopAutoplay();
        updateDeck(idx, idx > currentIndex ? 'next' : 'prev');
        startAutoplay();
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Touch Swipe Gesture Handling
  let touchStartX = 0;
  let touchEndX = 0;

  if (deckWrapper) {
    deckWrapper.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = false;
      },
      { passive: true }
    );

    deckWrapper.addEventListener(
      'touchmove',
      (e) => {
        if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 12) {
          isSwiping = true;
        }
      },
      { passive: true }
    );

    deckWrapper.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          stopAutoplay();
          if (diff < 0) {
            // Swiped left -> Next
            updateDeck(currentIndex + 1, 'next');
          } else {
            // Swiped right -> Prev
            updateDeck(currentIndex - 1, 'prev');
          }
          startAutoplay();
          setTimeout(() => {
            isSwiping = false;
          }, 300);
        } else {
          setTimeout(() => {
            isSwiping = false;
          }, 50);
        }
      },
      { passive: true }
    );

    // Pause on hover
    deckWrapper.addEventListener('mouseenter', stopAutoplay);
    deckWrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }
    const rect = stage.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowRight') {
      stopAutoplay();
      updateDeck(currentIndex + 1, 'next');
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      stopAutoplay();
      updateDeck(currentIndex - 1, 'prev');
      startAutoplay();
    }
  });

  // Handle window resize dynamically
  window.addEventListener('resize', () => {
    updateDeck(currentIndex, 'next', true);
  });

  // Initialize First Slide instantly
  updateDeck(0, 'next', true);
  startAutoplay();
}
