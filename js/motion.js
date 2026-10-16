import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Award-Winning Motion Engine for Le PhotoGRAM
 * Editorial, restrained, cinematic, and performant.
 */
export function initMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  initHeroEntrances();
  initScrollReveals();
  initImageReveals();
  initHowCurtainReveal();
  initHowWeWorkSwitcher();
  initCinematicDollyZoom();
  initBookingDatePicker();
  initTactileInteractions();
  initLifecycleSync();
  initAtelierReveal();
}

/**
 * 1. Hero Section Entrances
 * Refined, non-blocking page openings tailored to each page archetype.
 */
function initHeroEntrances() {
  // A. Home Page Hero Sequence
  const homeHero = document.querySelector('.hero-section');
  if (homeHero) {
    const video = homeHero.querySelector('.hero-video-bg');
    const wordmark = homeHero.querySelector('.hero-wordmark');
    const tagline = homeHero.querySelector('.hero-tagline');
    const scrollCue = homeHero.querySelector('.hero-scroll-cue');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (video) {
      tl.fromTo(
        video,
        { opacity: 0.3 },
        { opacity: 1, duration: 1.6, ease: 'power2.out' },
        0
      );
    }

    if (wordmark) {
      tl.fromTo(
        wordmark,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15 },
        0.15
      );
    }

    if (tagline) {
      tl.fromTo(
        tagline,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95 },
        0.35
      );
    }

    if (scrollCue) {
      tl.fromTo(
        scrollCue,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 0.9, duration: 0.8 },
        0.65
      );
    }
  }

  // B. About Page Hero Sequence
  const aboutHero = document.querySelector('.about-hero-dark');
  if (aboutHero) {
    const title = aboutHero.querySelector('.about-hero-title');
    const sub = aboutHero.querySelector('.about-hero-subtitle');
    const portrait = aboutHero.querySelector('.about-hero-portrait-frame');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (title) {
      tl.fromTo(title, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.05);
    }
    if (sub) {
      tl.fromTo(sub, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.2);
    }
    if (portrait) {
      tl.fromTo(portrait, { y: 35, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, 0.35);
    }
  }

  // C. Portfolio Allure Hero Slideshow
  const allureHero = document.querySelector('.gallery-allure-section');
  if (allureHero) {
    const activeSlide = allureHero.querySelector('.allure-slide.active');
    if (activeSlide) {
      const left = activeSlide.querySelector('.allure-col-left');
      const center = activeSlide.querySelector('.allure-col-center');
      const right = activeSlide.querySelector('.allure-col-right');

      gsap.fromTo(
        [left, center, right].filter(Boolean),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.14, ease: 'power3.out', delay: 0.1 }
      );
    }
  }

  // D. Services Plaque Inset Hero
  const servicesHero = document.querySelector('.services-plaque-hero');
  if (servicesHero) {
    const bg = servicesHero.querySelector('.services-hero-backdrop');
    const plaque = servicesHero.querySelector('.services-floating-plaque');

    if (bg) {
      gsap.fromTo(bg, { scale: 1.08, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' });
    }
    if (plaque) {
      gsap.fromTo(plaque, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, ease: 'power3.out', delay: 0.25 });
    }
  }

  // E. Editorial Page Banners (Testimonials, FAQ)
  const pageHeroBanner = document.querySelector('.page-hero-banner');
  if (pageHeroBanner) {
    const title = pageHeroBanner.querySelector('.hero-banner-title');
    const sub = pageHeroBanner.querySelector('.hero-banner-sub');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (title) {
      tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.1);
    }
    if (sub) {
      tl.fromTo(sub, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 0.25);
    }
  }

  // F. Booking Split Architecture
  const bookingSplit = document.querySelector('.contact-luxury-split');
  if (bookingSplit) {
    const media = bookingSplit.querySelector('.contact-split-media');
    const formCard = bookingSplit.querySelector('.ref-form-card');

    if (media) {
      gsap.fromTo(media, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' });
    }
    if (formCard) {
      gsap.fromTo(formCard, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', delay: 0.15 });
    }
  }

  // G. Contact Floral Atelier Hero
  const contactHero = document.querySelector('.contact-floral-hero');
  if (contactHero) {
    const eyebrow = contactHero.querySelector('.contact-editorial-eyebrow');
    const headlineLines = contactHero.querySelectorAll('.contact-floral-headline span');
    const channels = contactHero.querySelectorAll('.miros-channel-item');
    const ctaBtn = contactHero.querySelector('.contact-pill-btn');
    const archRight = contactHero.querySelector('.contact-floral-right');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (eyebrow) {
      tl.fromTo(eyebrow, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.05);
    }
    if (headlineLines.length) {
      tl.fromTo(
        headlineLines,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, stagger: 0.1 },
        0.15
      );
    }
    if (channels.length) {
      tl.fromTo(
        channels,
        { x: -14, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
        0.45
      );
    }
    if (ctaBtn) {
      tl.fromTo(ctaBtn, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, 0.65);
    }
    if (archRight) {
      tl.fromTo(archRight, { scale: 0.97, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.3);
    }
  }

  // H. Work Detail Hero
  const workHero = document.querySelector('#work-detail-hero-section');
  if (workHero) {
    const title = workHero.querySelector('.work-detail-title');
    const metaRow = workHero.querySelector('.work-meta-row');

    if (title) {
      gsap.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 });
    }
    if (metaRow) {
      gsap.fromTo(metaRow, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.25 });
    }
  }
}

/**
 * 2. Scroll-Triggered Editorial Reveals
 * Staggered, calm reveals across all page sections.
 */
function initScrollReveals() {
  // A. Generic Section Headers (Eye-brow + Title + Counter)
  const headers = document.querySelectorAll('.section-header, .about-story-eyebrow, .about-story-manifesto');
  headers.forEach((header) => {
    // Avoid double triggering if works-section already has custom parallax header
    if (header.closest('.works-section')) return;

    gsap.fromTo(
      header,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });

  // B. Architectural Triptych Board (Home Page)
  const triptych = document.querySelector('.about-triptych-board');
  if (triptych) {
    const cols = triptych.querySelectorAll('.triptych-col-left, .triptych-col-center, .triptych-col-right');
    if (cols.length) {
      gsap.fromTo(
        cols,
        { y: 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: triptych,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }
  }

  // C. Portfolio Grid Layout (Staggered Story Reveal)
  const portfolioGrid = document.querySelector('.portfolio-grid-layout');
  if (portfolioGrid) {
    ScrollTrigger.batch('.portfolio-grid-item', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
            overwrite: 'auto',
          }
        );
      },
    });
  }

  // D. Curated Testimonial Cards (Testimonials Page)
  const testimonialCards = document.querySelectorAll('.testimonial-curated-card');
  if (testimonialCards.length) {
    ScrollTrigger.batch('.testimonial-curated-card', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            overwrite: 'auto',
          }
        );
      },
    });
  }

  // E. Services Axis Rows (Services Page)
  const serviceRows = document.querySelectorAll('.services-axis-row');
  serviceRows.forEach((row) => {
    const textBlock = row.querySelector('.axis-text-block');
    const visualBlock = row.querySelector('.axis-visual-block');

    gsap.fromTo(
      [textBlock, visualBlock].filter(Boolean),
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  // F. Dedicated Team Member Blocks (About Page)
  const memberBlocks = document.querySelectorAll('.workwith-member-block');
  memberBlocks.forEach((block) => {
    const textCol = block.querySelector('.workwith-text-col');
    const visualCol = block.querySelector('.workwith-visual-col');

    gsap.fromTo(
      [textCol, visualCol].filter(Boolean),
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  // G. About Pullquote Card (About Page)
  const pullQuoteCard = document.querySelector('.about-pullquote-card');
  if (pullQuoteCard) {
    gsap.fromTo(
      pullQuoteCard,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pullQuoteCard,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  // H. CTA Sections
  const ctaSections = document.querySelectorAll('.cta-section');
  ctaSections.forEach((cta) => {
    const title = cta.querySelector('.cta-title, h2');
    const btn = cta.querySelector('.btn-pill, .btn-pill-dark, a.btn');

    gsap.fromTo(
      [title, btn].filter(Boolean),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cta,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

/**
 * 3. Photography Image Reveals
 * Subtle scale settlement on photography assets.
 */
function initImageReveals() {
  const imagesToReveal = document.querySelectorAll(
    '.about-pullquote-img, .axis-overlap-photo, .curated-card-avatar'
  );

  imagesToReveal.forEach((img) => {
    gsap.fromTo(
      img,
      { opacity: 0.6, scale: 1.04 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 90%',
          once: true,
        },
        onComplete: () => {
          gsap.set(img, { clearProps: 'transform' });
        },
      }
    );
  });
}

/**
 * 3b. Home "Keeping Things Natural" Curtain Reveal (Bottom to Top)
 */
function initHowCurtainReveal() {
  const wrap = document.querySelector('.how-curtain-wrap');
  if (!wrap) return;

  const img = wrap.querySelector('.how-featured-img');
  const overlay = wrap.querySelector('.how-curtain-overlay');
  if (!overlay) return;

  gsap.set(overlay, { yPercent: 0 });
  if (img) gsap.set(img, { scale: 1.15 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 88%',
      once: true,
    },
  });

  tl.to(overlay, {
    yPercent: -100,
    duration: 1.5,
    ease: 'power3.inOut',
  });

  if (img) {
    tl.to(
      img,
      {
        scale: 1.0,
        duration: 1.6,
        ease: 'power2.out',
      },
      0
    );
  }
}

/**
 * 4. Tactile Micro-Interactions
 * Gentle spring and elevation feedback on primary call-to-action buttons.
 */
function initTactileInteractions() {
  const interactivePills = document.querySelectorAll(
    '.btn-pill, .btn-pill-dark, .contact-pill-btn, .ref-back-btn, .axis-explore-link'
  );

  interactivePills.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        y: -2,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        y: 0,
        duration: 0.32,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mousedown', () => {
      gsap.to(btn, {
        y: 1,
        scale: 0.98,
        duration: 0.12,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mouseup', () => {
      gsap.to(btn, {
        y: -2,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });
}

/**
 * 5. Lifecycle & Resize Observer
 * Keep ScrollTrigger calculations accurate across resizes and image decodes.
 */
function initLifecycleSync() {
  let resizeTimer = null;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    },
    { passive: true }
  );

  window.addEventListener(
    'load',
    () => {
      ScrollTrigger.refresh();
    },
    { passive: true }
  );
}

/**
 * 6. Atelier Spread — staggered scroll-reveal for each spread row.
 * Uses IntersectionObserver so it's lightweight with no GSAP overhead.
 * Each row fades + rises in sequence as it enters the viewport.
 */
function initAtelierReveal() {
  const rows = document.querySelectorAll('.atelier-spread-row');
  if (!rows.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  rows.forEach((row, i) => {
    // Stagger the transition delay per row
    row.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(row);
  });
}

/**
 * 7. Live Cinematic Dolly Zoom (Vertigo Effect) on All Photography Assets
 * Creates a continuous parallax dolly zoom (camera push & perspective warp) on scroll,
 * keeping the subject grounded while background perspective dynamically stretches.
 */
function initCinematicDollyZoom() {
  const imageSelectors = [
    '.portfolio-img-box img',
    '.work-card-img-frame img',
    '.about-hero-portrait-frame img',
    '.about-hero-portrait-img',
    '.triptych-center-img',
    '.triptych-stacked-img',
    '.axis-overlap-photo',
    '.atelier-frame img',
    '.testimonial-avatar',
    '.about-pullquote-img',
    '.how-featured-img',
    '.allure-portrait-img',
    '.contact-arch-photo',
    '.floral-portrait-img',
    '.curated-card-avatar',
  ];

  const images = document.querySelectorAll(imageSelectors.join(', '));
  if (!images.length) return;

  images.forEach((img) => {
    // Ensure parent container masks the scaled edges
    const container = img.closest('.portfolio-img-box, .work-card-img-frame, .triptych-center-frame, .triptych-stacked-frame, .atelier-frame, .parallax-frame, .about-pullquote-img-box, .how-curtain-wrap') || img.parentElement;
    if (container) {
      container.style.overflow = 'hidden';
    }

    gsap.set(img, { transformOrigin: 'center center', willChange: 'transform' });

    // Smooth continuous Dolly Zoom tied to live scroll
    gsap.fromTo(
      img,
      { scale: 1.15, yPercent: -4 },
      {
        scale: 1.02,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: container || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
  });
}

/**
 * 8. "Keeping Things Natural" Interactive Photo Switching (Desktop Hover + Mobile Scroll)
 */
function initHowWeWorkSwitcher() {
  const grid = document.querySelector('.how-we-work-grid');
  if (!grid) return;

  const items = grid.querySelectorAll('.how-item');
  const featuredImg = grid.querySelector('#how-featured-img');
  if (!items.length || !featuredImg) return;

  let activeIndex = 0;

  const switchPhoto = (index, userInitiated = true) => {
    if (index === activeIndex && userInitiated) return;
    activeIndex = index;

    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    const targetSrc = items[index].getAttribute('data-img');
    if (!targetSrc || featuredImg.getAttribute('src') === targetSrc) return;

    // Smooth Dolly Zoom pulse transition for featured image
    gsap.to(featuredImg, {
      opacity: 0.25,
      scale: 1.18,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        featuredImg.src = targetSrc;
        gsap.to(featuredImg, {
          opacity: 1,
          scale: 1.05,
          duration: 0.42,
          ease: 'power2.out',
        });
      },
    });
  };

  // Desktop Hover & Tap
  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => switchPhoto(idx, true));
    item.addEventListener('click', () => switchPhoto(idx, true));
  });

  // Mobile Scroll Trigger: Automatically switch image as user scrolls past cards
  if (window.innerWidth <= 768) {
    items.forEach((item, idx) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => switchPhoto(idx, false),
        onEnterBack: () => switchPhoto(idx, false),
      });
    });
  }
}

/**
 * 9. Booking Date Picker Effortless Trigger
 */
function initBookingDatePicker() {
  const dateInput = document.getElementById('b-date');
  if (!dateInput) return;

  // Set minimum date to today
  try {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  } catch (e) {}

  const triggerPicker = () => {
    try {
      if (typeof dateInput.showPicker === 'function') {
        dateInput.showPicker();
      }
    } catch (err) {}
  };

  dateInput.addEventListener('click', triggerPicker);
  dateInput.addEventListener('focus', triggerPicker);

  const wrap = dateInput.closest('.ref-date-picker-wrap, .ref-date-group');
  if (wrap) {
    wrap.addEventListener('click', triggerPicker);
  }
}


