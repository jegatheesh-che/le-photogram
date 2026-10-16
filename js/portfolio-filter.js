import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Portfolio Filter Interaction with Staggered Motion and ScrollTrigger Sync
 */
export function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const items = document.querySelectorAll('.portfolio-grid-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const matching = [];
      const nonMatching = [];
      // Bento-preserving filter: gracefully highlight matching items while keeping interlocking structure
      items.forEach((item) => {
        const itemCategories = item.getAttribute('data-category') || '';
        const match = filterValue === 'all' || itemCategories.split(' ').includes(filterValue);
        if (match) {
          item.classList.remove('filtered-out');
          matching.push(item);
        } else {
          item.classList.add('filtered-out');
          nonMatching.push(item);
        }
      });

      // Animate matching items subtly into focus
      gsap.fromTo(
        matching,
        { scale: 0.98 },
        {
          scale: 1,
          duration: 0.35,
          stagger: 0.02,
          ease: 'power2.out',
          onComplete: () => {
            matching.forEach((item) => {
              item.style.removeProperty('transform');
            });
            ScrollTrigger.refresh();
          },
        }
      );
    });
  });
}
