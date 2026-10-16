import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCounters() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statItems = document.querySelectorAll('.stat-item');
  if (statItems.length === 0) return;

  statItems.forEach((item) => {
    const valEl = item.querySelector('.stat-val');
    if (!valEl) return;

    const targetVal = parseFloat(valEl.getAttribute('data-target') || valEl.innerText);
    if (isNaN(targetVal)) return;

    if (prefersReduced) {
      valEl.innerText = targetVal.toString();
      return;
    }

    valEl.innerText = '0';
    const counterObj = { val: 0 };

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          val: targetVal,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            valEl.innerText = Math.round(counterObj.val).toString();
          },
        });
      },
    });
  });
}
