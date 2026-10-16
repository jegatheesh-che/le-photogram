/**
 * Curtain Reveal Image Controller
 * Automatically reveals when entering viewport; supports manual replay.
 */
(function initCurtainReveal() {
  const container = document.getElementById('curtainRevealDemo');
  if (!container) return;

  const wrap = container.querySelector('.curtain-reveal-wrap');
  const replayBtn = container.querySelector('#curtainReplayBtn');
  if (!wrap) return;

  // Trigger on viewport entrance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        wrap.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.25 });

  observer.observe(wrap);

  // Manual replay button logic
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      wrap.classList.remove('is-revealed');
      setTimeout(() => {
        wrap.classList.add('is-revealed');
      }, 150);
    });
  }
})();
