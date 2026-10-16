/**
 * Cinematic Film Slider Track Controller
 * Implements smooth drag, touch swipe, snap-to-slide physics, and next/prev arrow handling.
 */
export function initFilmSliderTrack(containerSelector = '.film-track-container', options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const track = container.querySelector('.film-track');
  if (!track) return;

  const prevBtn = document.querySelector(options.prevBtnSelector || '.film-prev-btn');
  const nextBtn = document.querySelector(options.nextBtnSelector || '.film-next-btn');

  let scrollPos = 0;
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseInitialScroll = 0;
  let hasDragged = false;

  const getSlideStep = () => {
    const firstSlide = track.querySelector('.film-slide');
    return firstSlide ? firstSlide.offsetWidth + 24 : 404;
  };

  const getMaxScroll = () => Math.max(0, track.scrollWidth - container.clientWidth);

  const updateTrack = (smooth = true) => {
    const maxScroll = getMaxScroll();
    scrollPos = Math.max(0, Math.min(maxScroll, scrollPos));
    track.style.transition = smooth ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    track.style.transform = `translateX(-${scrollPos}px)`;
  };

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollPos = Math.min(getMaxScroll(), scrollPos + getSlideStep());
    updateTrack(true);
  });

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollPos = Math.max(0, scrollPos - getSlideStep());
    updateTrack(true);
  });

  // Desktop Mouse Drag
  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, a, .film-slide-btn')) return;
    isMouseDown = true;
    hasDragged = false;
    mouseStartX = e.pageX;
    mouseInitialScroll = scrollPos;
    track.style.transition = 'none';
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDown) {
      isMouseDown = false;
      const step = getSlideStep();
      if (hasDragged) {
        scrollPos = Math.round(scrollPos / step) * step;
        updateTrack(true);
      }
      setTimeout(() => { hasDragged = false; }, 80);
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const dist = mouseStartX - e.pageX;
    if (Math.abs(dist) > 8) hasDragged = true;
    e.preventDefault();
    scrollPos = Math.max(0, Math.min(getMaxScroll(), mouseInitialScroll + dist * 1.2));
    updateTrack(false);
  });

  // Mobile Touch Swipe
  let touchStartX = 0;
  let touchStartScroll = 0;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1 || e.target.closest('button, a')) return;
    hasDragged = false;
    touchStartX = e.touches[0].pageX;
    touchStartScroll = scrollPos;
    track.style.transition = 'none';
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const dist = touchStartX - e.touches[0].pageX;
    if (Math.abs(dist) > 8) hasDragged = true;
    scrollPos = Math.max(0, Math.min(getMaxScroll(), touchStartScroll + dist * 1.15));
    updateTrack(false);
  }, { passive: true });

  container.addEventListener('touchend', () => {
    const step = getSlideStep();
    if (hasDragged) {
      scrollPos = Math.round(scrollPos / step) * step;
      updateTrack(true);
    }
  }, { passive: true });
}
