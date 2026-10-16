/**
 * Atelier Team Spread Scroll Reveal
 * Lightweight IntersectionObserver that triggers `.is-visible` on each row.
 */
export function initAtelierTeamSpread(selector = '.atelier-spread-row') {
  const rows = document.querySelectorAll(selector);
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
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  rows.forEach((row, i) => {
    row.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(row);
  });

  return () => observer.disconnect();
}
