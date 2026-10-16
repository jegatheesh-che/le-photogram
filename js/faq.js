import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * FAQ Accordion Interaction with ScrollTrigger Sync
 */
export function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item, .faq-minimal-item, .priestess-faq-item, .contact-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn, .faq-minimal-btn, .priestess-faq-btn, .contact-faq-btn');
    const answerPanel = item.querySelector('.faq-answer-panel, .faq-minimal-panel, .priestess-faq-panel, .contact-faq-panel');

    if (!questionBtn || !answerPanel) return;

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      // Close sibling items for quiet, focused luxury reading
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn, .faq-minimal-btn, .priestess-faq-btn, .contact-faq-btn');
          const otherPanel = other.querySelector('.faq-answer-panel, .faq-minimal-panel, .priestess-faq-panel, .contact-faq-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            setTimeout(() => {
              if (!other.classList.contains('active')) {
                otherPanel.setAttribute('hidden', '');
              }
            }, 380);
          }
        }
      });

      if (isExpanded) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerPanel.style.maxHeight = null;
        setTimeout(() => {
          if (!item.classList.contains('active')) {
            answerPanel.setAttribute('hidden', '');
          }
        }, 380);
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerPanel.removeAttribute('hidden');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      }

      // Sync ScrollTrigger after panel expand/collapse animation
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 420);
    });
  });

  // Filter category pills for FAQ
  const faqFilterPills = document.querySelectorAll('.faq-filter-pill, .faq-minimal-pill');
  if (faqFilterPills.length) {
    faqFilterPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        faqFilterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.getAttribute('data-category');
        faqItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      });
    });
  }
}
