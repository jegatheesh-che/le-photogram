import { initParallax } from './parallax.js';

export async function initWorkDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || 'clara-theo';

  try {
    const worksUrl = new URL('data/works.json', window.location.href);
    const res = await fetch(worksUrl);
    const works = await res.json();
    const work = works.find((w) => w.slug === slug) || works[0];

    // Populate metadata
    const titleEl = document.querySelector('.work-detail-title');
    if (titleEl) titleEl.innerText = work.title;

    const dateEl = document.querySelector('.work-meta-date');
    if (dateEl) dateEl.innerText = work.date || 'Aug 29, 2026';

    const locEl = document.querySelector('.work-meta-location');
    if (locEl) locEl.innerText = work.location || 'Provence, France';

    const srvEl = document.querySelector('.work-meta-service');
    if (srvEl) srvEl.innerText = work.service || 'Photo + Film';

    // Populate gallery images
    const galleryContainer = document.querySelector('.work-gallery-grid');
    if (galleryContainer && work.images && work.images.length > 0) {
      galleryContainer.innerHTML = '';
      work.images.slice(0, 6).forEach((imgSrc, idx) => {
        const item = document.createElement('div');
        item.className = `gallery-item parallax-frame ${idx === 0 || idx === 3 ? 'span-full' : ''}`;
        item.innerHTML = `<img src="${imgSrc}" alt="${work.title} photo ${idx + 1}" class="parallax-img" />`;
        galleryContainer.appendChild(item);
      });
    }

    // Populate film video
    const filmWrapper = document.querySelector('.work-film-wrapper');
    if (filmWrapper) {
      if (work.video) {
        filmWrapper.innerHTML = `
          <video class="work-film-video" autoplay loop muted playsinline poster="">
            <source src="${work.video}" type="video/mp4">
          </video>
        `;
      } else {
        filmWrapper.style.display = 'none';
      }
    }

    // Populate "More stories"
    const moreGrid = document.querySelector('.more-stories-grid');
    if (moreGrid) {
      const otherWorks = works.filter((w) => w.slug !== slug).slice(0, 2);
      moreGrid.innerHTML = '';
      otherWorks.forEach((other) => {
        const card = document.createElement('a');
        card.href = `work.html?slug=${other.slug}`;
        card.className = 'work-card';
        card.innerHTML = `
          <div class="work-card-img-frame parallax-frame">
            <img src="${other.images[0] || ''}" alt="${other.title}" class="parallax-img" />
          </div>
          <div class="work-card-meta">
            <h3 class="work-card-title">${other.title}</h3>
            <span class="work-card-date">${other.date || ''}</span>
          </div>
        `;
        moreGrid.appendChild(card);
      });
    }

    // Re-initialize parallax for dynamic elements
    initParallax();
  } catch (err) {
    console.error('Failed to load work details:', err);
  }
}
