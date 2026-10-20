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
      gsap.set(heroVideo, { transformOrigin: 'center center' });
      gsap.fromTo(
        heroVideo,
        { scale: 1.08, yPercent: 0 },
        {
          scale: 1.18,
          yPercent: 12,
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

  // 4. "A GLIMPSE INTO OUR WORK" Framer Reference Parallax Architecture
  const worksSection = document.querySelector('.works-section');
  if (worksSection) {
    const ambient = worksSection.querySelector('.works-parallax-ambient, .works-obsidian-ambient');
    const watermark = worksSection.querySelector('.works-watermark-text');
    const glimpseHeader = worksSection.querySelector('.glimpse-header');
    const stage = worksSection.querySelector('.glimpse-stage');
    const colLeft = worksSection.querySelector('.glimpse-col-left');
    const colRight = worksSection.querySelector('.glimpse-col-right');
    const cards = worksSection.querySelectorAll('.glimpse-card');
    const cta = worksSection.querySelector('.glimpse-cta-wrap');

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

    // Watermark Multi-Plane Scrub
    if (watermark) {
      gsap.fromTo(
        watermark,
        { xPercent: 6, yPercent: -15, opacity: 0.015 },
        {
          xPercent: -6,
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

    // Title Entrance & Smooth Vertical Parallax
    if (glimpseHeader) {
      gsap.fromTo(
        glimpseHeader,
        { y: 35, opacity: 0.8 },
        {
          y: -25,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: glimpseHeader,
            start: 'top 92%',
            end: 'bottom 20%',
            scrub: 0.8,
          },
        }
      );
    }

    // Desktop Asymmetrical Column Multi-Speed Parallax
    const mm = gsap.matchMedia();
    mm.add('(min-width: 811px)', () => {
      if (stage && colRight) {
        gsap.fromTo(
          colRight,
          { y: 90 },
          {
            y: -130,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      if (stage && colLeft) {
        gsap.fromTo(
          colLeft,
          { y: 20 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }
    });

    // Inner Image Viewport Parallax (Photo glides within frame on scroll)
    cards.forEach((card) => {
      const img = card.querySelector('.glimpse-card-img');
      if (!img) return;

      gsap.fromTo(
        img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    });

    // CTA Entrance Animation
    if (cta) {
      gsap.fromTo(
        cta,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }
}
