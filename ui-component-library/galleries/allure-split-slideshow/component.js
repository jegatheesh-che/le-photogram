/**
 * Allure Editorial Split Slideshow Controller
 * Features auto-rotation timer, arrow navigation, touch swipe support, and pause on hover.
 */
export function initAllureSlideshow(options = {}) {
  const {
    wrapperId = 'allureSlider',
    prevBtnId = 'allurePrevBtn',
    nextBtnId = 'allureNextBtn',
    counterId = 'allureCounter',
    interval = 6000,
  } = options;

  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const slides = wrapper.querySelectorAll('.allure-slide');
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const counter = document.getElementById(counterId);

  if (!slides.length) return;

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

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  const startTimer = () => {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, interval);
  };

  const stopTimer = () => {
    if (slideTimer) clearInterval(slideTimer);
  };

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    nextSlide();
    startTimer();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    prevSlide();
    startTimer();
  });

  wrapper.addEventListener('mouseenter', stopTimer);
  wrapper.addEventListener('mouseleave', startTimer);

  // Mobile Touch Swipe
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (!touchStartX || e.changedTouches.length !== 1) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
      startTimer();
    }
    touchStartX = 0;
  }, { passive: true });

  startTimer();

  return {
    next: nextSlide,
    prev: prevSlide,
    goTo: showSlide,
    destroy: stopTimer,
  };
}
