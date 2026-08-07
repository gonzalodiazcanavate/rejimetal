import { PRODUCTS, getWeightProfile } from '../data/products.js';
import { renderProductVisual } from './visuals.js';

const CONTACT_EMAIL = 'correo@rejimetal.com';

const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );

const weightFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

const families = [
  {
    id: 'electrosoldada',
    label: 'Electrosoldadas',
    categoryList: ['Electrosoldada'],
    intro: 'Electrosoldadas / electrofundidas para paso, mantenimiento, drenaje, ventilación y reposición.',
    tags: ['Cuadradillo', 'Varilla lisa', 'Dentadas', 'Offshore']
  },
  {
    id: 'prensada',
    label: 'Prensadas',
    categoryList: ['Prensada'],
    intro: 'Prensadas con flejes iguales o diferentes, encastradas o no encastradas según geometría y uso.',
    tags: ['Flejes iguales', 'Flejes diferentes', 'Dentado', 'Ventilación']
  },
  {
    id: 'peldanos',
    label: 'Peldaños',
    categoryList: ['Peldaños'],
    intro: 'Peldaños y accesos metálicos para escaleras, pasarelas, rellanos y mantenimiento industrial.',
    tags: ['Apoyar', 'Soldar', 'Atornillar', 'Nariz']
  },
  {
    id: 'obra-registros',
    label: 'Obra y registros',
    categoryList: ['Manual', 'Alcorque', 'Canaleta'],
    intro: 'Soluciones para alcorques, imbornales, canales, arquetas, registros, cerramientos y piezas especiales.',
    tags: ['Canales', 'Arquetas', 'Alcorques', 'A medida']
  }
];

const productVisual = (service, className) => {
  const visualType = service.visualType || service.modelType || 'grating';
  return '<div class="' + (className || 'service-visual') + ' service-visual--' + escapeHtml(visualType) + '">' + renderProductVisual(service) + '</div>';
};

const detailHref = (service) => './ficha?id=' + encodeURIComponent(service.id);

const familyProducts = (family) =>
  PRODUCTS.filter((service) => family.categoryList.indexOf(service.category) !== -1);

const familyButton = (family, active) => {
  const count = familyProducts(family).length;
  return [
    '<button type="button" class="family-tab' + (active ? ' is-active' : '') + '" data-family="' + escapeHtml(family.id) + '">',
    '<span>' + escapeHtml(family.label) + '</span>',
    '<strong>' + count + (count === 1 ? ' tipo' : ' tipos') + '</strong>',
    '<small>' + escapeHtml(family.intro) + '</small>',
    '</button>'
  ].join('');
};

const tagsMarkup = (items) =>
  (items || []).map((item) => '<span>' + escapeHtml(item) + '</span>').join('');

const featuredMarkup = (service, family) => {
  const weightProfile = getWeightProfile(service);
  return [
    '<article class="product-featured-card">',
    '<div class="product-featured-visual">',
    productVisual(service, 'product-visual-xl'),
    '</div>',
    '<div class="product-featured-copy">',
    '<div class="product-featured-kicker">',
    '<span>' + escapeHtml(family.label) + '</span>',
    '<small>' + escapeHtml(weightFormatter.format(weightProfile.kgM2)) + ' kg/m² orientativo</small>',
    '</div>',
    '<h3>' + escapeHtml(service.name) + '</h3>',
    '<p>' + escapeHtml(service.summary) + '</p>',
    '<div class="product-featured-facts">',
    '<p><strong>Uso:</strong> ' + escapeHtml(service.use) + '</p>',
    '<p><strong>Se adapta:</strong> ' + escapeHtml(service.adapts) + '</p>',
    '</div>',
    '<div class="product-chip-row">' + tagsMarkup(family.tags) + '</div>',
    '<div class="product-featured-actions">',
    '<a class="btn btn-primary" href="' + detailHref(service) + '">Abrir ficha 3D</a>',
    '<button type="button" class="btn btn-secondary product-email-btn" data-product="' + escapeHtml(service.name) + '">Consultar por correo</button>',
    '</div>',
    '</div>',
    '</article>'
  ].join('');
};

const miniCard = (service, activeId) => {
  const weightProfile = getWeightProfile(service);
  return [
    '<article class="product-mini-card' + (service.id === activeId ? ' is-active' : '') + '">',
    '<button type="button" data-product-id="' + escapeHtml(service.id) + '" aria-label="Seleccionar ' + escapeHtml(service.name) + '">',
    productVisual(service, 'product-mini-visual'),
    '<span>' + escapeHtml(service.category) + '</span>',
    '<strong>' + escapeHtml(service.name) + '</strong>',
    '<small>' + escapeHtml(weightFormatter.format(weightProfile.kgM2)) + ' kg/m² ref.</small>',
    '</button>',
    '<a href="' + detailHref(service) + '">3D</a>',
    '</article>'
  ].join('');
};

const filters = document.getElementById('catalogFilters');
const rail = document.getElementById('catalogProductGrid');
const featured = document.getElementById('productFeatured');
const countNode = document.getElementById('catalogCount');

if (filters && rail && featured && PRODUCTS.length) {
  let activeFamily = families[0];
  let activeProduct = familyProducts(activeFamily)[0] || PRODUCTS[0];

  const renderFilters = () => {
    filters.innerHTML = families.map((family) =>
      familyButton(family, family.id === activeFamily.id)
    ).join('');
  };

  const renderProducts = () => {
    const list = familyProducts(activeFamily);
    if (!list.find((item) => item.id === activeProduct.id)) {
      activeProduct = list[0] || PRODUCTS[0];
    }
    featured.innerHTML = featuredMarkup(activeProduct, activeFamily);
    rail.innerHTML = list.map((service) => miniCard(service, activeProduct.id)).join('');
    if (countNode) {
      countNode.textContent = list.length + (list.length === 1 ? ' tipo' : ' tipos');
    }
  };

  const render = () => {
    renderFilters();
    renderProducts();
  };

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-family]');
    if (!button) return;
    const family = families.find((item) => item.id === button.getAttribute('data-family'));
    if (!family) return;
    activeFamily = family;
    activeProduct = familyProducts(activeFamily)[0] || activeProduct;
    render();
  });

  rail.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-id]');
    if (!button) return;
    const product = PRODUCTS.find((item) => item.id === button.getAttribute('data-product-id'));
    if (!product) return;
    activeProduct = product;
    renderProducts();
  });

  render();
}

const quoteProduct = document.getElementById('quoteProduct');
if (quoteProduct && PRODUCTS.length) {
  quoteProduct.innerHTML = PRODUCTS.map((service) =>
    '<option value="' + escapeHtml(service.id) + '">' + escapeHtml(service.name) + '</option>'
  ).join('');

  const quotePreview = document.getElementById('quoteProductPreview');
  const quoteDescription = document.getElementById('quoteProductDescription');
  const quoteWeightBasis = document.getElementById('quoteWeightBasis');

  const updateQuotePreview = () => {
    const selected = PRODUCTS.find((service) => service.id === quoteProduct.value) || PRODUCTS[0];
    const weightProfile = getWeightProfile(selected);
    if (quotePreview && selected) {
      quotePreview.className = 'service-visual service-visual--' + escapeHtml(selected.visualType || selected.modelType || 'grating');
      quotePreview.innerHTML = renderProductVisual(selected);
    }
    if (quoteDescription && selected) {
      quoteDescription.textContent = selected.summary;
    }
    if (quoteWeightBasis && weightProfile) {
      quoteWeightBasis.textContent = 'Referencia aplicada al calcular: ' + weightFormatter.format(weightProfile.kgM2) + ' kg/m². ' + weightProfile.basis;
    }
  };

  quoteProduct.addEventListener('change', updateQuotePreview);
  updateQuotePreview();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.product-email-btn');
  if (!button) return;
  const product = button.getAttribute('data-product') || 'rejilla metálica a medida';
  const body = [
    'Hola REJIMETAL,',
    '',
    'Necesito presupuesto para una solución a medida relacionada con ' + product + '.',
    '',
    'Medidas aproximadas en mm:',
    'Unidades:',
    'Uso previsto:',
    'Interior/exterior:',
    'Acabado deseado:',
    '¿Hay plano, foto, croquis o muestra?:',
    'Comentarios:'
  ].join('\n');
  window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Solicitud técnica - ' + product) + '&body=' + encodeURIComponent(body);
});
