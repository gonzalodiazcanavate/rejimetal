// Homepage-specific island: hero carousel, hero product visual, quote calculator.
import { PRODUCTS, getWeightProfile } from '../data/products.js';
import { renderProductVisual } from './visuals.js';

const CONTACT_EMAIL = 'correo@rejimetal.com';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const numberFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

// --- Hero work carousel ---
const carousel = document.querySelector('[data-home-work-carousel]');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.hero-work-slide'));
  if (slides.length) {
    const prevButton = carousel.querySelector('[data-home-work-prev]');
    const nextButton = carousel.querySelector('[data-home-work-next]');
    const dotsWrap = carousel.querySelector('[data-home-work-dots]');
    let activeIndex = 0;
    let timer = null;
    let paused = false;

    if (dotsWrap) {
      dotsWrap.textContent = '';
      slides.forEach((slide, index) => {
        const label = slide.querySelector('figcaption span')?.textContent || ('Trabajo ' + (index + 1));
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Ver ' + label);
        dot.dataset.homeWorkDot = String(index);
        dotsWrap.appendChild(dot);
      });
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('button')) : [];

    const setActive = (nextIndex) => {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, index) => {
        const active = index === activeIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    };

    const stop = () => {
      if (timer) { window.clearInterval(timer); timer = null; }
    };

    const start = () => {
      stop();
      if (prefersReducedMotion || slides.length < 2 || paused) return;
      timer = window.setInterval(() => setActive(activeIndex + 1), 4800);
    };

    const goTo = (index) => { setActive(index); start(); };

    prevButton?.addEventListener('click', () => goTo(activeIndex - 1));
    nextButton?.addEventListener('click', () => goTo(activeIndex + 1));

    dotsWrap?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-home-work-dot]');
      if (!button) return;
      goTo(Number(button.dataset.homeWorkDot || 0));
    });

    carousel.addEventListener('mouseenter', () => { paused = true; stop(); });
    carousel.addEventListener('mouseleave', () => { paused = false; start(); });
    carousel.addEventListener('focusin', () => { paused = true; stop(); });
    carousel.addEventListener('focusout', () => { paused = false; start(); });

    setActive(0);
    start();
  }
}

// --- Hero product visual ---
const heroPreview = document.getElementById('heroProductPreview');
if (heroPreview && PRODUCTS.length) {
  const product = PRODUCTS.find((item) => item.id === 'rejilla-electrosoldada-cuadradillo-entregirado') || PRODUCTS[0];
  heroPreview.className = 'hero-product-visual service-visual service-visual--' + (product.visualType || product.modelType || 'grating');
  heroPreview.innerHTML = renderProductVisual(product);
}

// --- Quote calculator ---
const quoteProduct = document.getElementById('quoteProduct');
const quotePreview = document.getElementById('quoteProductPreview');
const quoteDescription = document.getElementById('quoteProductDescription');
const quoteWeightReference = document.getElementById('quoteWeightReference');
const quoteWeightBasis = document.getElementById('quoteWeightBasis');
const calcForm = document.getElementById('quick-calc-form');
const calcResult = document.getElementById('calcResult');
const quoteEmail = document.getElementById('quoteEmail');

if (quoteProduct && PRODUCTS.length) {
  quoteProduct.innerHTML = PRODUCTS.map((product) =>
    '<option value="' + product.id + '">' + product.name + '</option>'
  ).join('');

  const getSelectedProduct = () =>
    PRODUCTS.find((p) => p.id === quoteProduct.value) || PRODUCTS[0];

  const updatePreview = () => {
    const selected = getSelectedProduct();
    if (!selected) return;
    if (quotePreview) {
      quotePreview.className = 'service-visual service-visual--' + (selected.visualType || selected.modelType || 'grating');
      quotePreview.innerHTML = renderProductVisual(selected);
    }
    if (quoteDescription) {
      quoteDescription.textContent = selected.summary || 'Referencia visual para identificar el tipo de pieza antes de pedir presupuesto.';
    }
    const weightProfile = getWeightProfile(selected);
    if (quoteWeightBasis && weightProfile) {
      quoteWeightBasis.textContent = 'Referencia aplicada al calcular: ' + numberFormatter.format(weightProfile.kgM2) + ' kg/m². ' + weightProfile.basis;
    }
  };

  quoteProduct.addEventListener('change', updatePreview);
  updatePreview();
}

let lastQuoteMessage = '';

if (calcForm && calcResult && quoteEmail && PRODUCTS.length) {
  const getSelectedProduct = () =>
    PRODUCTS.find((p) => p.id === (quoteProduct?.value || '')) || PRODUCTS[0];

  const updateWeightCard = (value, detail) => {
    if (quoteWeightReference) quoteWeightReference.textContent = value;
    if (quoteWeightBasis) quoteWeightBasis.textContent = detail;
  };

  const calculate = () => {
    const selected = getSelectedProduct();
    const weightProfile = getWeightProfile(selected);
    const weightKgM2 = Number(weightProfile.kgM2 || 0);
    const lengthMm = Number(document.getElementById('quoteLength')?.value || 0);
    const widthMm = Number(document.getElementById('quoteWidth')?.value || 0);
    const units = Number(document.getElementById('quoteUnits')?.value || 0);

    if (lengthMm <= 0 || widthMm <= 0 || units <= 0 || weightKgM2 <= 0) {
      calcResult.textContent = 'Introduce largo, ancho en mm y unidades para preparar la consulta.';
      updateWeightCard('Pendiente', 'Referencia aplicada al calcular: ' + numberFormatter.format(weightKgM2) + ' kg/m². ' + (weightProfile.basis || ''));
      lastQuoteMessage = '';
      return;
    }

    const totalArea = (lengthMm / 1000) * (widthMm / 1000) * units;
    const estimatedKg = totalArea * weightKgM2;
    updateWeightCard(
      numberFormatter.format(estimatedKg) + ' kg',
      'Referencia aplicada: ' + numberFormatter.format(weightKgM2) + ' kg/m². ' + (weightProfile.basis || '')
    );
    calcResult.textContent = 'Medidas: ' + numberFormatter.format(lengthMm) + ' x ' + numberFormatter.format(widthMm) + ' mm. Superficie aproximada: ' + numberFormatter.format(totalArea) + ' m². Referencia aplicada: ' + numberFormatter.format(weightKgM2) + ' kg/m².';

    lastQuoteMessage = [
      'Hola REJIMETAL,',
      '',
      'Necesito presupuesto para una pieza de rejilla metálica a medida.',
      '',
      'Tipo de pieza: ' + selected.name,
      'Medidas aproximadas en mm: ' + numberFormatter.format(lengthMm) + ' x ' + numberFormatter.format(widthMm) + ' mm',
      'Unidades: ' + units,
      'Superficie aproximada: ' + numberFormatter.format(totalArea) + ' m²',
      'Peso orientativo calculado: ' + numberFormatter.format(estimatedKg) + ' kg',
      'Peso de referencia aplicado: ' + numberFormatter.format(weightKgM2) + ' kg/m²',
      'Base de cálculo: ' + (weightProfile.basis || ''),
      'Nota: ' + (weightProfile.note || 'El peso final se ajusta al confirmar malla, pletina, marco, recortes y acabado.'),
      '',
      'Uso previsto:',
      'Interior/exterior:',
      'Acabado deseado:',
      '¿Hay plano, foto, croquis o muestra?:',
      'Comentarios:'
    ].join('\n');
  };

  calcForm.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });

  ['quoteProduct', 'quoteLength', 'quoteWidth', 'quoteUnits'].forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', calculate);
      field.addEventListener('change', calculate);
    }
  });

  quoteEmail.addEventListener('click', () => {
    if (!lastQuoteMessage) calculate();
    if (lastQuoteMessage) {
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Solicitud de presupuesto - Cálculo de rejilla a medida') + '&body=' + encodeURIComponent(lastQuoteMessage);
    }
  });
}
