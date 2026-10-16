/**
 * Mobile Bottom-Sheet Navigation Modal Logic
 * Supports toggle button, close button, backdrop click, Escape key, and optional GSAP staggered entrance.
 */
export function initMobileBottomSheet(options = {}) {
  const {
    drawerId = 'mobileNavDrawer',
    toggleBtnId = 'mobileMenuBtn',
    closeBtnId = 'mobileSheetCloseBtn',
    gsapInstance = window.gsap || null,
  } = options;

  const drawer = document.getElementById(drawerId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!drawer) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openDrawer = () => {
    drawer.classList.add('active');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Staggered menu entrance
    if (gsapInstance && !prefersReduced) {
      const menuItems = drawer.querySelectorAll('.mobile-sheet-menu .mobile-menu-item, .mobile-menu-signout');
      if (menuItems.length) {
        gsapInstance.fromTo(
          menuItems,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.035,
            ease: 'power3.out',
            delay: 0.08,
            overwrite: 'auto',
          }
        );
      }
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn?.addEventListener('click', () => {
    drawer.classList.contains('active') ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);

  // Close when clicking outside on dark backdrop
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  return { open: openDrawer, close: closeDrawer };
}
