import { WORKS } from '../data/works.js';
import { renderWorkVisual } from './visuals.js';

const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );

const mailHref = (work) =>
  'mailto:correo@rejimetal.com?subject=' +
  encodeURIComponent('Consulta - ' + work.sector + ' - ' + work.name) +
  '&body=' +
  encodeURIComponent(
    'Hola, necesito información sobre una solución de rejilla metálica relacionada con ' + work.sector + '.\n\n' +
    'Medidas aproximadas (mm):\n' +
    'Unidades:\n' +
    'Uso previsto:\n' +
    'Interior/exterior:\n' +
    'Acabado deseado:\n' +
    'Tengo foto/plano: sí/no\n'
  );

const preloadImages = () => {
  WORKS.forEach((work) => {
    if (!work.image) return;
    const image = new Image();
    image.decoding = 'async';
    image.src = work.image;
  });
};

let activeIndex = 0;
let timer = null;
let paused = false;

const detailPanel = (work) => {
  const imageUrl = escapeHtml(work.image || '');
  const visual = renderWorkVisual(work);
  return [
    '<article class="work-detail-card work-detail-card--sector">',
    '<div class="work-detail-media" style="background-image: url(&quot;' + imageUrl + '&quot;)">',
    '<button class="work-carousel-arrow work-carousel-arrow--prev" type="button" data-carousel-prev aria-label="Trabajo anterior"><span aria-hidden="true">‹</span></button>',
    '<button type="button" data-open-lightbox data-work-index="' + activeIndex + '" aria-label="Ampliar imagen de ' + escapeHtml(work.sector) + '">',
    '<img src="' + imageUrl + '" alt="' + escapeHtml(work.name) + '" loading="eager" decoding="async" />',
    '</button>',
    '<button class="work-carousel-arrow work-carousel-arrow--next" type="button" data-carousel-next aria-label="Trabajo siguiente"><span aria-hidden="true">›</span></button>',
    '</div>',
    '<div class="work-detail-copy">',
    '<span class="service-tag">' + escapeHtml(work.category) + '</span>',
    '<h2>' + escapeHtml(work.name) + '</h2>',
    '<p>' + escapeHtml(work.summary) + '</p>',
    '<h3>Situación habitual</h3>',
    '<p>' + escapeHtml(work.context) + '</p>',
    '<h3>Cómo lo planteamos</h3>',
    '<p>' + escapeHtml(work.solution) + '</p>',
    '<ul class="spec-list compact-specs">' + (work.specs || []).map((item) =>
      '<li><strong>Dato útil:</strong> ' + escapeHtml(item) + '</li>'
    ).join('') + '</ul>',
    '<a class="btn btn-primary" href="' + mailHref(work) + '">Consultar por correo</a>',
    '</div>',
    '</article>'
  ].join('');
};

const stopAuto = () => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
};

const startAuto = () => {
  stopAuto();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || WORKS.length < 2 || paused) return;
  timer = window.setInterval(() => {
    if (!paused) setActive(activeIndex + 1, { replaceUrl: true });
  }, 4800);
};

const setActive = (index, options) => {
  if (!WORKS.length) return;
  activeIndex = (index + WORKS.length) % WORKS.length;
  const selectedWork = document.getElementById('selectedWork');
  if (selectedWork) {
    selectedWork.innerHTML = detailPanel(WORKS[activeIndex]);
  }
  if (!options || !options.replaceUrl) return;
  const url = new URL(window.location.href);
  url.searchParams.set('id', WORKS[activeIndex].id);
  window.history.replaceState({}, '', url);
};

const openLightbox = (index) => {
  const lightbox = document.getElementById('workLightbox');
  const image = document.getElementById('workLightboxImage');
  const sector = document.getElementById('workLightboxSector');
  const title = document.getElementById('workLightboxTitle');
  const text = document.getElementById('workLightboxText');
  const work = WORKS[index];
  if (!lightbox || !image || !work) return;

  paused = true;
  stopAuto();
  image.src = work.image;
  image.alt = work.name;
  if (sector) sector.textContent = work.sector;
  if (title) title.textContent = work.name;
  if (text) text.textContent = work.summary;
  lightbox.hidden = false;
  lightbox.classList.add('is-open');
  document.documentElement.classList.add('has-lightbox');
  lightbox.querySelector('[data-lightbox-close]')?.focus();
};

const closeLightbox = () => {
  const lightbox = document.getElementById('workLightbox');
  const image = document.getElementById('workLightboxImage');
  if (!lightbox || lightbox.hidden) return;
  lightbox.classList.remove('is-open');
  lightbox.hidden = true;
  document.documentElement.classList.remove('has-lightbox');
  if (image) image.removeAttribute('src');
  paused = false;
  startAuto();
};

const selectedWork = document.getElementById('selectedWork');
if (selectedWork && WORKS.length) {
  preloadImages();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const initialIndex = Math.max(0, WORKS.findIndex((work) => work.id === id));
  setActive(initialIndex, { replaceUrl: false });

  const carousel = document.querySelector('[data-sector-carousel]');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => { paused = true; stopAuto(); });
    carousel.addEventListener('mouseleave', () => { paused = false; startAuto(); });
    carousel.addEventListener('focusin', () => { paused = true; stopAuto(); });
    carousel.addEventListener('focusout', () => { paused = false; startAuto(); });
  }

  document.addEventListener('click', (event) => {
    const prev = event.target.closest('[data-carousel-prev]');
    const next = event.target.closest('[data-carousel-next]');
    const lightboxTrigger = event.target.closest('[data-open-lightbox]');
    const close = event.target.closest('[data-lightbox-close]');
    const lightbox = document.getElementById('workLightbox');

    if (prev) { setActive(activeIndex - 1, { replaceUrl: true }); return; }
    if (next) { setActive(activeIndex + 1, { replaceUrl: true }); return; }
    if (lightboxTrigger) {
      const idx = Number(lightboxTrigger.getAttribute('data-work-index'));
      setActive(idx, { replaceUrl: true });
      openLightbox(idx);
      return;
    }
    if (close || (lightbox && event.target === lightbox)) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });

  window.addEventListener('resize', () => {
    setActive(activeIndex, { replaceUrl: false });
  });

  startAuto();
}
