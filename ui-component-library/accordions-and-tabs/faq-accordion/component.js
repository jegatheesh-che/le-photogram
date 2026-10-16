/**
 * Minimal Luxury FAQ Accordion Controller
 * Implements smooth height expansion, single-open policy, and aria-expanded accessibility.
 */
export function initFAQAccordion(accordionSelector = '.faq-minimal-list') {
  const container = document.querySelector(accordionSelector);
  if (!container) return;

  const items = container.querySelectorAll('.faq-minimal-item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq-minimal-btn');
    const panel = item.querySelector('.faq-minimal-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-minimal-btn');
          const otherPanel = other.querySelector('.faq-minimal-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            setTimeout(() => {
              if (!other.classList.contains('active')) otherPanel.setAttribute('hidden', '');
            }, 380);
          }
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        setTimeout(() => {
          if (!item.classList.contains('active')) panel.setAttribute('hidden', '');
        }, 380);
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}
