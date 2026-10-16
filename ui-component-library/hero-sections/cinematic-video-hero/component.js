/**
 * Cinematic Video Hero Parallax & Mouse Hover Depth
 * Uses GSAP ScrollTrigger if available, or gracefully degrades to CSS.
 */
export function initVideoHero(heroSelector = '.hero-section', gsapInstance = window.gsap || null) {
  const heroSection = document.querySelector(heroSelector);
  if (!heroSection || !gsapInstance) return;

  const heroVideo = heroSection.querySelector('.hero-video-bg');
  const heroContent = heroSection.querySelector('.hero-content');
  const heroContentInner = heroSection.querySelector('.hero-content-inner');

  // Mouse hover 3D parallax on desktop
  const isDesktop = window.matchMedia('(min-width: 811px)').matches;
  if (isDesktop && heroVideo && heroContentInner) {
    let rect = heroSection.getBoundingClientRect();
    window.addEventListener('resize', () => {
      rect = heroSection.getBoundingClientRect();
    }, { passive: true });

    const xToVideo = gsapInstance.quickTo(heroVideo, 'x', { duration: 0.8, ease: 'power2.out' });
    const yToVideo = gsapInstance.quickTo(heroVideo, 'y', { duration: 0.8, ease: 'power2.out' });
    const xToContent = gsapInstance.quickTo(heroContentInner, 'x', { duration: 0.6, ease: 'power2.out' });
    const yToContent = gsapInstance.quickTo(heroContentInner, 'y', { duration: 0.6, ease: 'power2.out' });

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
