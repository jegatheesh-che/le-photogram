/**
 * Kinfolk Sticky Header Scroll Observer & Active Link Sync
 */
export function initKinfolkHeader(headerSelector = '.site-header', scrollThreshold = 40) {
  const header = document.querySelector(headerSelector);
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
