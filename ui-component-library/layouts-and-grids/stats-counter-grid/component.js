/**
 * Animated Count-up Numbers Observer
 * Animates numerical values when scrolled into viewport using requestAnimationFrame.
 */
export function initStatsCounters(gridSelector = '.stats-grid', duration = 2000) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  const statItems = grid.querySelectorAll('.stat-item');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateValue = (el, target, dur) => {
    if (prefersReduced) {
      el.innerText = target.toString();
      return;
    }

    const start = performance.now();
    el.innerText = '0';

    const step = (now) => {
      const progress = Math.min((now - start) / dur, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.innerText = Math.round(target * ease).toString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = target.toString();
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statItems.forEach((item) => {
            const valEl = item.querySelector('.stat-val');
            if (valEl) {
              const target = parseFloat(valEl.getAttribute('data-target') || valEl.innerText);
              if (!isNaN(target)) {
                animateValue(valEl, target, duration);
              }
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(grid);

  return () => observer.disconnect();
}
