import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // 1. Hero Section Parallax (The First Section)
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const heroVideo = heroSection.querySelector('.hero-video-bg');
    const heroContent = heroSection.querySelector('.hero-content');
    const heroContentInner = heroSection.querySelector('.hero-content-inner');
    const heroOverlay = heroSection.querySelector('.hero-overlay');
    const heroScrollCue = heroSection.querySelector('.hero-scroll-cue');

    // Scroll-driven Parallax Scrubbing
    if (heroVideo) {
      gsap.fromTo(
        heroVideo,
        { yPercent: 0, scale: 1.05 },
        {
          yPercent: 24,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    if (heroContent) {
      gsap.fromTo(
        heroContent,
        { y: 0, opacity: 1, scale: 1 },
        {
          y: -150,
          opacity: 0,
          scale: 0.92,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '65% top',
            scrub: 1,
          },
        }
      );
    }

    if (heroOverlay) {
      gsap.to(heroOverlay, {
        background: 'rgba(0, 0, 0, 0.65)',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    if (heroScrollCue) {
      gsap.to(heroScrollCue, {
        y: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '22% top',
          scrub: 0.8,
        },
      });
    }

    // Subtle Luxury Mouse Hover Depth on Desktop (GPU quickTo for buttery 60-120fps with zero reflow)
    const isDesktop = window.matchMedia('(min-width: 811px)').matches;
    if (isDesktop && heroVideo && heroContentInner) {
      let rect = heroSection.getBoundingClientRect();
      window.addEventListener('resize', () => {
        rect = heroSection.getBoundingClientRect();
      }, { passive: true });

      const xToVideo = gsap.quickTo(heroVideo, 'x', { duration: 0.8, ease: 'power2.out' });
      const yToVideo = gsap.quickTo(heroVideo, 'y', { duration: 0.8, ease: 'power2.out' });
      const xToContent = gsap.quickTo(heroContentInner, 'x', { duration: 0.6, ease: 'power2.out' });
      const yToContent = gsap.quickTo(heroContentInner, 'y', { duration: 0.6, ease: 'power2.out' });

      heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        xToVideo(x * 16);
        yToVideo(y * 12);
        xToContent(-x * 20);
        yToContent(-y * 14);
      }, { passive: true });

      heroSection.addEventListener('mouseleave', () => {
        xToVideo(0);
        yToVideo(0);
        xToContent(0);
        yToContent(0);
      });
    }
  }

  // 2. General Parallax Frames (Cards & Portraits)
  const frames = document.querySelectorAll('.parallax-frame');
  frames.forEach((frame) => {
    const img = frame.querySelector('.parallax-img');
    if (!img) return;

    gsap.fromTo(
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
  });

  // 3. Signature Cinematic Parallax Section: The Essence
  const cinematicSection = document.querySelector('.cinematic-parallax-section');
  if (cinematicSection) {
    const bgMedia = cinematicSection.querySelector('.parallax-bg-media');
    const cardLeft = cinematicSection.querySelector('.card-left');
    const cardRight = cinematicSection.querySelector('.card-right');
    const emblem = cinematicSection.querySelector('.parallax-emblem');
    const centerpiece = cinematicSection.querySelector('.parallax-centerpiece');

    // Plane 0: Background Media Parallax & Subtle Scale
    if (bgMedia) {
      gsap.fromTo(
        bgMedia,
        { yPercent: -22, scale: 1.14 },
        {
          yPercent: 22,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: cinematicSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    // Plane 1: Ambient Emblem Counter-Scroll & Swivel
    if (emblem) {
      gsap.fromTo(
        emblem,
        { y: -60, rotate: -25 },
        {
          y: 75,
          rotate: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: cinematicSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    }

    // Plane 2: Floating Editorial Cards (Desktop Asymmetrical Depth)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 811px)', () => {
      if (cardLeft) {
        gsap.fromTo(
          cardLeft,
          { y: 150, rotate: -5 },
          {
            y: -150,
            rotate: -1,
            ease: 'none',
            scrollTrigger: {
              trigger: cinematicSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      if (cardRight) {
        gsap.fromTo(
          cardRight,
          { y: 200, rotate: 6 },
          {
            y: -130,
            rotate: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: cinematicSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.6,
            },
          }
        );
      }
    });

    // Plane 3: Foreground Centerpiece Elevation & Focus
    if (centerpiece) {
      gsap.fromTo(
        centerpiece,
        { y: 45, opacity: 0.75 },
        {
          y: -35,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: cinematicSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        }
      );
    }
  }

  // 4. "A GLIMPSE INTO OUR WORK" Luxury Parallax Theme Transition
  const worksSection = document.querySelector('.works-section');
  if (worksSection) {
    const ambient = worksSection.querySelector('.works-parallax-ambient');
    const watermark = worksSection.querySelector('.works-watermark-text');
    const header = worksSection.querySelector('.section-header');
    const title = worksSection.querySelector('.section-title');
    const eyebrow = worksSection.querySelector('.section-eyebrow-row');
    const line = worksSection.querySelector('.works-header-line');

    if (!worksSection.classList.contains('works-obsidian-section')) {
      worksSection.style.backgroundColor = '#FAF8F5';
    }

    // Ambient Luxury Glow Parallax
    if (ambient) {
      gsap.fromTo(
        ambient,
        { yPercent: -18, scale: 1.05 },
        {
          yPercent: 18,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: worksSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    // Editorial Watermark Multi-Plane Scrub
    if (watermark) {
      gsap.fromTo(
        watermark,
        { xPercent: 8, yPercent: -15, opacity: 0.015 },
        {
          xPercent: -8,
          yPercent: 25,
          opacity: 0.045,
          ease: 'none',
          scrollTrigger: {
            trigger: worksSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      );
    }

    // Header Entrance Parallax Reveal
    if (header) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
      }

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          '-=0.45'
        );
      }

      if (line) {
        tl.fromTo(
          line,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
          '-=0.75'
        );
      }
    }

    // Staggered Asymmetrical Card Parallax (Desktop)
    const isDesktop = window.matchMedia('(min-width: 811px)').matches;
    if (isDesktop) {
      const col1Cards = worksSection.querySelectorAll('.w-card-1, .w-card-4');
      const col2Cards = worksSection.querySelectorAll('.w-card-2, .w-card-5');
      const centerCard = worksSection.querySelector('.w-card-3');

      col1Cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 35 },
          {
            y: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      col2Cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: -35 },
          {
            y: 35,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      });

      if (centerCard) {
        gsap.fromTo(
          centerCard,
          { scale: 0.98, y: 25 },
          {
            scale: 1.01,
            y: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: centerCard,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3,
            },
          }
        );
      }
    }
  }
}
