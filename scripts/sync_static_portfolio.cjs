const fs = require('fs');

const gallery = JSON.parse(fs.readFileSync('data/gallery.json', 'utf8'));
let html = fs.readFileSync('portfolio.html', 'utf8');

const CAT_LABELS = {
  'weddings': 'Weddings',
  'portraits': 'Studio Portraits',
  'events': 'Life Events',
  'editorial': 'Editorial & Fine Art',
  'weddings portraits': 'Weddings & Portraits',
  'editorial portraits': 'Editorial & Fine Art',
  'portraits events': 'Studio Portraits',
  'weddings events': 'Weddings & Events',
  'events portraits': 'Life Events',
  'editorial events': 'Editorial & Fine Art',
  'portraits editorial': 'Editorial & Fine Art',
  'events weddings': 'Weddings & Events',
  'weddings editorial': 'Weddings'
};

gallery.forEach(item => {
  const lc = item.layout_class;
  // Match card with class containing lc
  const regex = new RegExp(`(<div class="portfolio-grid-item ${lc}"[\\s\\S]*?aria-label=")[^"]*("[\\s\\S]*?<img src=")[^"]*("[\\s\\S]*?alt=")[^"]*("[\\s\\S]*?<span class="port-overlay-cat">)[^<]*(<\\/span><span class="port-overlay-title">)[^<]*(<\\/span>)`, 'g');
  
  const catLabel = CAT_LABELS[item.category] || 'Weddings';
  
  html = html.replace(new RegExp(`class="portfolio-grid-item ${lc}" data-category="[^"]*"`, 'g'), `class="portfolio-grid-item ${lc}" data-category="${item.category}"`);
  
  html = html.replace(regex, (match, p1, p2, p3, p4, p5, p6) => {
    return `${p1}Open ${item.title}${p2}${item.image_path}${p3}${item.alt || item.title}${p4}${catLabel}${p5}${item.title}${p6}`;
  });
});

fs.writeFileSync('portfolio.html', html);
console.log('Synchronized portfolio.html with gallery.json');
