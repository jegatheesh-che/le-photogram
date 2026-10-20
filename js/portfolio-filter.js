import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Portfolio Filter Interaction with Staggered Motion and ScrollTrigger Sync
 * Dynamically queries all grid items (including newly synchronized dynamic uploads)
 * and prevents duplicate event listener accumulation.
 */
export function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    // Prevent duplicate event listener registration on re-init
    if (btn.dataset.filterBound === 'true') return;
    btn.dataset.filterBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      const bentoGrid = document.getElementById('portfolioBentoGrid');

      if (bentoGrid) {
        if (filterValue === 'all') {
          bentoGrid.classList.remove('is-filtered');
        } else {
          bentoGrid.classList.add('is-filtered');
        }
      }

      // Always query current items in DOM (including dynamic uploads)
      const currentItems = document.querySelectorAll('.portfolio-grid-item');
      const matching = [];
      const nonMatching = [];

      currentItems.forEach((item) => {
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

      // Animate matching items smoothly into view
      if (matching.length > 0) {
        gsap.fromTo(
          matching,
          { opacity: 0, y: 12, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.02,
            ease: 'power2.out',
            onComplete: () => {
              matching.forEach((item) => {
                item.style.removeProperty('transform');
                item.style.removeProperty('opacity');
              });
              if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
                ScrollTrigger.refresh();
              }
            },
          }
        );
      } else {
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
          ScrollTrigger.refresh();
        }
      }
    });
  });
}
