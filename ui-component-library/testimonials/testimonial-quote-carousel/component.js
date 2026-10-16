/**
 * Architectural Testimonial Quote Carousel
 * Handles smooth fade transitions, counter updates, and touch/keyboard navigation
 */
(function initTestimonialQuoteCarousel() {
  const container = document.getElementById('testimonialQuoteCarousel');
  if (!container) return;

  const quoteEl = container.querySelector('.testimonial-quote');
  const avatarEl = container.querySelector('.testimonial-avatar');
  const nameEl = container.querySelector('.testimonial-name');
  const locationEl = container.querySelector('.testimonial-location');
  const counterEl = container.querySelector('.t-current-index');
  const prevBtn = container.querySelector('.testimonial-prev');
  const nextBtn = container.querySelector('.testimonial-next');

  const testimonials = [
    {
      quote: "“Every photograph feels honest and completely us. We couldn't have asked for a more beautiful way to remember our day. The film brings our grandparents' smiles right back to life every time we press play.”",
      name: "Riya & Arjun",
      location: "Lake Como, Italy",
      avatar: "../../assets/images/img35.webp"
    },
    {
      quote: "“They worked so quietly and unobtrusively that our guests thought they were longtime friends. When we received the master gallery, we cried tears of pure gratitude. Absolute poetry in motion.”",
      name: "Camille & Sébastien",
      location: "Provence, France",
      avatar: "../../assets/images/img24.webp"
    },
    {
      quote: "“The architectural composition and natural light fidelity in every frame are simply unmatched. Le PhotoGRAM preserved the quiet elegance of our palace wedding with cinematic perfection.”",
      name: "Ananya & Devraj",
      location: "Udaipur, India",
      avatar: "../../assets/images/img12.webp"
    },
    {
      quote: "“Beyond the breathtaking imagery, their poise and serene guidance throughout our high-energy celebration made all the difference. Our heirloom album is now our most cherished possession.”",
      name: "Elena & Matteo",
      location: "Amalfi Coast, Italy",
      avatar: "../../assets/images/img18.webp"
    }
  ];

  let currentIndex = 0;
  let isTransitioning = false;

  function pad(num) {
    return num < 10 ? '0' + num : num;
  }

  function updateSlide(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Fade out elements
    quoteEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      currentIndex = (newIndex + testimonials.length) % testimonials.length;
      const data = testimonials[currentIndex];

      quoteEl.textContent = data.quote;
      nameEl.textContent = data.name;
      locationEl.textContent = data.location;
      if (avatarEl) avatarEl.src = data.avatar;
      if (counterEl) counterEl.textContent = pad(currentIndex + 1);

      // Fade back in
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';

      setTimeout(() => {
        isTransitioning = false;
      }, 260);
    }, 250);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlide(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlide(currentIndex + 1));
  }

  // Keyboard navigation when focused inside
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') updateSlide(currentIndex + 1);
  });
})();
