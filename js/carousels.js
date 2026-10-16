import { gsap } from 'gsap';

export function initCarousels() {
  // 1. Film Slider (Home & Works)
  const filmTrack = document.querySelector('.film-track');
  const filmPrev = document.querySelector('.film-prev-btn');
  const filmNext = document.querySelector('.film-next-btn');

  if (filmTrack && filmTrack.parentElement) {
    let scrollPos = 0;
    const slideWidth = 404; // 380px width + 24px gap
    const container = filmTrack.parentElement;
    let hasDragged = false;

    const getSlideStep = () => {
      const firstSlide = filmTrack.querySelector('.film-slide');
      return firstSlide ? firstSlide.offsetWidth + 24 : 404;
    };

    const getMaxScroll = () => Math.max(0, filmTrack.scrollWidth - container.clientWidth);

    const updateFilm = (smooth = true) => {
      const maxScroll = getMaxScroll();
      scrollPos = Math.max(0, Math.min(maxScroll, scrollPos));
      if (smooth) {
        filmTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        filmTrack.style.transition = 'none';
      }
      filmTrack.style.transform = `translateX(-${scrollPos}px)`;
    };

    if (filmNext) {
      filmNext.addEventListener('click', (e) => {
        e.preventDefault();
        const maxScroll = getMaxScroll();
        const step = getSlideStep();
        scrollPos = Math.min(maxScroll, scrollPos + step);
        updateFilm(true);
      });
    }

    if (filmPrev) {
      filmPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const step = getSlideStep();
        scrollPos = Math.max(0, scrollPos - step);
        updateFilm(true);
      });
    }

    // Desktop Mouse Drag Support with Momentum Snap
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseInitialScroll = 0;

    container.style.cursor = 'grab';

    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, .film-slide-btn')) return;
      isMouseDown = true;
      hasDragged = false;
      mouseStartX = e.pageX;
      mouseInitialScroll = scrollPos;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
      filmTrack.style.transition = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false;
        container.style.cursor = 'grab';
        container.style.removeProperty('user-select');

        // Snap to nearest slide
        const step = getSlideStep();
        if (hasDragged) {
          scrollPos = Math.round(scrollPos / step) * step;
          updateFilm(true);
        }
        setTimeout(() => {
          hasDragged = false;
        }, 80);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const dist = mouseStartX - e.pageX;
      if (Math.abs(dist) > 8) {
        hasDragged = true;
      }
      e.preventDefault();
      const walk = dist * 1.25;
      const maxScroll = getMaxScroll();
      scrollPos = Math.max(0, Math.min(maxScroll, mouseInitialScroll + walk));
      updateFilm(false);
    });

    // Prevent button click ONLY if actually dragged
    filmTrack.querySelectorAll('.film-slide-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    // Touch Swipe Support for Mobile & Tablets
    let isTouchActive = false;
    let touchStartX = 0;
    let touchStartScroll = 0;

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('button, a, .film-slide-btn')) return;
      isTouchActive = true;
      hasDragged = false;
      touchStartX = e.touches[0].pageX;
      touchStartScroll = scrollPos;
      filmTrack.style.transition = 'none';
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isTouchActive || e.touches.length !== 1) return;
      const dist = touchStartX - e.touches[0].pageX;
      if (Math.abs(dist) > 8) {
        hasDragged = true;
      }
      const walk = dist * 1.15;
      const maxScroll = getMaxScroll();
      scrollPos = Math.max(0, Math.min(maxScroll, touchStartScroll + walk));
      updateFilm(false);
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (isTouchActive) {
        isTouchActive = false;
        const step = getSlideStep();
        if (hasDragged) {
          scrollPos = Math.round(scrollPos / step) * step;
          updateFilm(true);
        }
        setTimeout(() => {
          hasDragged = false;
        }, 80);
      }
    }, { passive: true });
  }

  // 2. Editorial Testimonials Carousel
  const testimonials = [
    {
      quote: "“Every photograph feels honest and completely us. We couldn't have asked for a more beautiful way to remember our day. The film brings our grandparents' smiles right back to life every time we press play.”",
      name: "Riya & Arjun",
      location: "Lake Como, Italy",
      img: "assets/images/img50.webp",
    },
    {
      quote: "“From our first conversation, Alex and Noah brought a calm, effortless reassurance. On the day, they felt like old friends who possessed an extraordinary artistic vision. The gallery left us in happy tears.”",
      name: "Clara & Theo",
      location: "Château de Tourreau, Provence",
      img: "assets/images/img80.webp",
    },
    {
      quote: "“Le PhotoGRAM captured our wedding with breathtaking subtlety. No staged awkwardness, no interruptions — just pure, poetic documentary art that our family will treasure for 50 years.”",
      name: "Olivia & Daniel",
      location: "Tuscany, Italy",
      img: "assets/images/img56.webp",
    },
    {
      quote: "“Investing in Le PhotoGRAM was the single best decision we made for our celebration. Our Italian linen album is our home's greatest treasure. Everyone who opens it is captivated by the timeless grain.”",
      name: "Amelia & James",
      location: "The Cotswolds, UK",
      img: "assets/images/img57.webp",
    },
  ];

  const tQuote = document.querySelector('.testimonial-quote');
  const tName = document.querySelector('.testimonial-name');
  const tLocation = document.querySelector('.testimonial-location');
  const tAvatar = document.querySelector('.testimonial-avatar');
  const tCounter = document.querySelector('.t-current-index');
  const tPrev = document.querySelector('.testimonial-prev');
  const tNext = document.querySelector('.testimonial-next');

  if (tQuote && tName && tAvatar) {
    let activeIdx = 0;
    let isTransitioning = false;

    const renderTestimonial = (idx) => {
      if (isTransitioning) return;
      isTransitioning = true;
      const item = testimonials[idx];
      const elementsToFade = [tQuote, tName, tLocation, tAvatar].filter(Boolean);

      // Smooth GSAP Cross-Fade
      gsap.to(elementsToFade, {
        opacity: 0,
        y: -6,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          tQuote.innerText = item.quote;
          tName.innerText = item.name;
          if (tLocation) tLocation.innerText = item.location;
          tAvatar.src = item.img;
          if (tCounter) tCounter.innerText = String(idx + 1).padStart(2, '0');

          gsap.fromTo(
            elementsToFade,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.03,
              ease: 'power2.out',
              onComplete: () => {
                isTransitioning = false;
              },
            }
          );
        },
      });
    };

    if (tNext) {
      tNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (isTransitioning) return;
        activeIdx = (activeIdx + 1) % testimonials.length;
        renderTestimonial(activeIdx);
      });
    }

    if (tPrev) {
      tPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (isTransitioning) return;
        activeIdx = (activeIdx - 1 + testimonials.length) % testimonials.length;
        renderTestimonial(activeIdx);
      });
    }
  }

  // 3. Allure Editorial Slideshow (Gallery Page)
  const allureWrapper = document.getElementById('allureSlider');
  if (allureWrapper) {
    const slides = allureWrapper.querySelectorAll('.allure-slide');
    const prevBtn = document.getElementById('allurePrevBtn');
    const nextBtn = document.getElementById('allureNextBtn');
    const counter = document.getElementById('allureCounter');
    let currentSlide = 0;
    let slideTimer = null;

    const showSlide = (index) => {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      if (counter) {
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      }
    };

    const startTimer = () => {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 6000);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        startTimer();
      });
    }

    allureWrapper.addEventListener('mouseenter', () => {
      if (slideTimer) clearInterval(slideTimer);
    });

    allureWrapper.addEventListener('mouseleave', () => {
      startTimer();
    });

    startTimer();

    // Mobile Swipe Gesture for Allure Slideshow
    let allureTouchStartX = 0;
    allureWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        allureTouchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    allureWrapper.addEventListener('touchend', (e) => {
      if (!allureTouchStartX || e.changedTouches.length !== 1) return;
      const diff = allureTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          currentSlide = (currentSlide + 1) % slides.length;
        } else {
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        }
        showSlide(currentSlide);
        startTimer();
      }
      allureTouchStartX = 0;
    }, { passive: true });
  }
}
