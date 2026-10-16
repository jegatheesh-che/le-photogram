/**
 * Category Filter Tabs Controller
 * Toggles active pill state and filters items matching `data-category`.
 */
export function initCategoryFilter(options = {}) {
  const {
    barSelector = '.portfolio-filter-bar',
    itemSelector = '.portfolio-grid-item',
    activeClass = 'active',
  } = options;

  const bar = document.querySelector(barSelector);
  if (!bar) return;

  const buttons = bar.querySelectorAll('.portfolio-filter-btn');
  const items = document.querySelectorAll(itemSelector);

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      buttons.forEach((b) => {
        b.classList.remove(activeClass);
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add(activeClass);
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      items.forEach((item) => {
        const itemCategory = item.getAttribute('data-category') || '';
        const isMatch = filter === 'all' || itemCategory.split(' ').includes(filter);

        if (isMatch) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
