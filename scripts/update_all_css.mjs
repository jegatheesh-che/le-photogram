import fs from 'fs';

const path = 'css/pages.css';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove .about-hero-seal definitions
content = content.replace(/\.about-hero-seal[\s\S]*?\.about-hero-seal-text\s*\{[\s\S]*?\}\s*/, '');
content = content.replace(/\.about-hero-seal\s*\{\s*display:\s*none;\s*\}\s*/, '');

// 2. Replace .about-team-section and related team styles
const teamMarker = '/* 3. Team Section (Deep Ink Black Canvas) */';
const teamEndMarker = '@media (max-width: 640px) {';

const tStart = content.indexOf(teamMarker);
const tEnd = content.indexOf(teamEndMarker);

if (tStart !== -1 && tEnd !== -1) {
  const newTeamAndServicesStyles = `/* 3. Team Section: Architectural Offset Editorial Cards (Reference Layout) */
.about-team-section {
  background-color: var(--theme-pure-white);
  color: var(--theme-ink-black);
  padding-top: 110px;
  padding-bottom: 130px;
  border-top: 1px solid var(--color-border);
}

.about-team-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 70px auto;
}

.about-team-eyebrow {
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--theme-crimson-blaze);
  margin-bottom: 16px;
}

.about-team-heading {
  font-family: var(--font-serif);
  font-size: clamp(38px, 4.4vw, 60px);
  line-height: 1.05;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0 0 16px 0;
}

.about-team-sub {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.65;
  color: var(--theme-ink-muted);
  margin: 0;
}

.about-offset-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(28px, 3.5vw, 48px);
  max-width: 1160px;
  margin: 0 auto;
}

.offset-team-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.team-card-frame {
  position: relative;
  width: 100%;
  padding-top: 40px;
}

.team-backdrop-card {
  background-color: #EAEAEA;
  position: relative;
  width: 82%;
  padding: 0 0 28px 24px;
  box-sizing: border-box;
}

.team-corner-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 13px;
  height: 13px;
  background-color: var(--theme-ink-black);
  z-index: 4;
}

.team-offset-photo-wrap {
  position: relative;
  width: 108%;
  margin-left: 14%;
  margin-top: -40px;
  aspect-ratio: 1 / 1;
  background-color: #141414;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  z-index: 3;
}

.team-offset-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: contrast(1.05);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.offset-team-card:hover .team-offset-photo {
  transform: scale(1.04);
}

.team-backdrop-meta {
  padding-top: 24px;
  padding-right: 16px;
}

.team-card-name {
  font-family: var(--font-sans);
  font-size: clamp(17px, 1.5vw, 20px);
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.team-card-role {
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: #666666;
  margin: 0;
}

.team-bio-wrap {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-script-greeting {
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 34px;
  line-height: 1;
  color: var(--theme-ink-black);
  margin: 0;
}

.team-personal-bio {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.68;
  color: #555555;
  margin: 0;
}

/* ==========================================================================
   Services Section: 3-Column Architectural Editorial Spread (Reference Design)
   ========================================================================== */
.services-editorial-section {
  background-color: var(--theme-pure-white);
  padding: 100px 0 120px;
  border-top: 1px solid var(--color-border);
  position: relative;
}

.services-spread-container {
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 var(--section-padding-x);
  display: grid;
  grid-template-columns: 1.15fr 1.35fr 1fr;
  gap: clamp(24px, 3vw, 44px);
  align-items: stretch;
}

/* Column 1: Left Authority & Prioritized Services List */
.services-col-intro {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16px;
}

.services-eyebrow-small {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-crimson-blaze);
  margin-bottom: 24px;
}

.services-main-headline {
  font-family: var(--font-serif);
  font-size: clamp(40px, 4.4vw, 58px);
  line-height: 1.02;
  font-weight: 400;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0 0 44px 0;
}

.services-priorities-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--color-border);
}

.service-priority-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.service-priority-item:hover,
.service-priority-item.active {
  background-color: rgba(253, 240, 213, 0.25);
  padding-left: 12px;
}

.service-priority-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.service-priority-title {
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0;
  transition: color 0.2s ease;
}

.service-priority-item:hover .service-priority-title,
.service-priority-item.active .service-priority-title {
  color: var(--theme-crimson-blaze);
}

.service-priority-num {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  color: var(--theme-crimson-blaze);
  letter-spacing: 0.1em;
}

.service-priority-desc {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--theme-ink-muted);
  margin: 0;
}

.service-priority-link {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  transition: color 0.2s, gap 0.2s;
}

.service-priority-link:hover {
  color: var(--theme-crimson-blaze);
  gap: 10px;
}

/* Column 2: Center Featured Hero Service */
.services-col-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--theme-porcelain-light);
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
}

.services-hero-counter {
  position: absolute;
  top: 28px;
  left: 28px;
  z-index: 5;
  font-family: var(--font-serif);
  font-size: 44px;
  line-height: 1;
  color: var(--theme-ink-black);
  font-weight: 400;
}

.services-hero-counter span {
  font-size: 22px;
  color: var(--theme-crimson-blaze);
  font-family: var(--font-sans);
  font-weight: 600;
}

.services-hero-img-wrap {
  position: relative;
  width: 100%;
  flex-grow: 1;
  min-height: 540px;
  overflow: hidden;
}

.services-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.services-col-hero:hover .services-hero-img {
  transform: scale(1.03);
}

.services-hero-nav-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  z-index: 6;
}

.services-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 20px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.services-nav-btn.btn-prev {
  background-color: #141414;
  color: #FFFFFF;
}

.services-nav-btn.btn-prev:hover {
  background-color: #262626;
}

.services-nav-btn.btn-next {
  background-color: #F7E5D8;
  color: #141414;
}

.services-nav-btn.btn-next:hover {
  background-color: var(--theme-crimson-blaze);
  color: #FFFFFF;
}

/* Column 3: Right Details & Secondary Visual */
.services-col-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid var(--color-border);
  padding-left: clamp(20px, 2.5vw, 36px);
}

.services-detail-top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.services-detail-tag {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--theme-crimson-blaze);
}

.services-detail-title {
  font-family: var(--font-serif);
  font-size: clamp(26px, 2.8vw, 34px);
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0;
}

.services-rotated-badge {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-ink-faint);
  margin-top: 24px;
}

.services-detail-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background-color: #F5F5F5;
  overflow: hidden;
  margin-top: 24px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.08);
}

.services-detail-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.services-detail-cta {
  margin-top: 24px;
}

/* ==========================================================================
   Gallery Page: Portraits Editorial Masonry Mosaic
   ========================================================================== */
.gallery-page-hero {
  padding-top: 140px;
  padding-bottom: 50px;
  text-align: center;
  background-color: var(--theme-pure-white);
}

.gallery-hero-eyebrow {
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-crimson-blaze);
  margin-bottom: 16px;
}

.gallery-hero-title {
  font-family: var(--font-accent);
  font-size: clamp(52px, 8vw, 98px);
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: var(--theme-ink-black);
  margin: 0 0 20px 0;
}

.gallery-hero-text {
  font-family: var(--font-sans);
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--theme-ink-muted);
  max-width: 680px;
  margin: 0 auto 28px auto;
}

.gallery-hero-cta {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  text-decoration: underline;
  text-underline-offset: 6px;
  transition: color 0.2s ease;
}

.gallery-hero-cta:hover {
  color: var(--theme-crimson-blaze);
}

.gallery-mosaic-section {
  padding: 30px 0 100px;
  background-color: var(--theme-pure-white);
}

.gallery-mosaic-grid {
  column-count: 4;
  column-gap: 14px;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 var(--section-padding-x);
}

.gallery-mosaic-item {
  break-inside: avoid;
  margin-bottom: 14px;
  overflow: hidden;
  position: relative;
  background-color: var(--theme-porcelain-light);
  cursor: pointer;
}

.gallery-mosaic-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
}

.gallery-mosaic-item:hover .gallery-mosaic-img {
  transform: scale(1.035);
  filter: brightness(1.03);
}

/* Lightbox Modal */
.gallery-lightbox {
  position: fixed;
  inset: 0;
  background-color: rgba(14, 15, 17, 0.94);
  backdrop-filter: blur(16px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  padding: 40px;
}

.gallery-lightbox.active {
  opacity: 1;
  pointer-events: auto;
}

.gallery-lightbox-img {
  max-width: 90vw;
  max-height: 88vh;
  object-fit: contain;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
}

.gallery-lightbox-close {
  position: absolute;
  top: 24px;
  right: 32px;
  color: #FFFFFF;
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.gallery-lightbox-close:hover {
  color: var(--theme-crimson-blaze);
}

/* ==========================================================================
   Minimal Luxury Testimonials Page
   ========================================================================== */
.testimonials-luxury-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: clamp(32px, 4vw, 56px);
  max-width: 1200px;
  margin: 60px auto 100px;
}

.luxury-testimonial-card {
  background-color: var(--theme-pure-white);
  border: 1px solid var(--color-border);
  padding: 48px 40px 42px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.luxury-testimonial-card:hover {
  border-color: var(--theme-crimson-blaze);
  box-shadow: 0 20px 45px rgba(20, 20, 20, 0.05);
}

.luxury-quote-text {
  font-family: var(--font-accent);
  font-size: clamp(20px, 2vw, 24px);
  line-height: 1.55;
  font-style: italic;
  font-weight: 400;
  color: var(--theme-ink-black);
  margin: 0;
}

.luxury-author-row {
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.luxury-author-names {
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--theme-ink-black);
  margin: 0 0 4px 0;
}

.luxury-author-venue {
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-crimson-blaze);
  margin: 0;
}

.luxury-author-date {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--theme-ink-faint);
  text-transform: uppercase;
}

/* Responsive Rules for Services, Gallery & Team */
@media (max-width: 1024px) {
  .services-spread-container {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .services-col-detail {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid var(--color-border);
    padding-top: 40px;
  }
  .gallery-mosaic-grid {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .gallery-mosaic-grid {
    column-count: 2;
    column-gap: 10px;
  }
  .about-offset-team-grid {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
    gap: 48px;
  }
}
`;

  content = content.slice(0, tStart) + newTeamAndServicesStyles + '\n' + content.slice(tEnd);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated css/pages.css with team, services, gallery, and testimonials styles!');
} else {
  console.error('Markers not found!');
  process.exit(1);
}
