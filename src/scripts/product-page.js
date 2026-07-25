// Ficha page: resolves the product from URL params, sets up the page, and boots the 3D viewer.
import { PRODUCTS, getWeightProfile } from '../data/products.js';
import { renderProductVisual } from './visuals.js';
import { initViewer } from './product-3d.js';

const params = new URLSearchParams(window.location.search);
const requestedId = params.get('id');
const product = PRODUCTS.find((item) => item.id === requestedId) || PRODUCTS[0];

if (product) {
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };

  const setAttr = (selector, attr, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  };

  const escapeHtml = (value) =>
    String(value || '').replace(/[&<>"']/g, (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
    );

  const numberFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
  const weightProfile = getWeightProfile(product);

  const visual = document.getElementById('fichaVisual');
  if (visual) {
    visual.className = 'product-visual product-visual--' + (product.visualType || product.modelType || 'grating');
    visual.innerHTML = renderProductVisual(product);
  }

  document.title = product.name + ' | Pieza 3D a medida | REJIMETAL';
  setAttr('meta[name="description"]', 'content', 'Ficha 3D de ' + product.name + ' fabricable a medida por REJIMETAL.');
  setText('#fichaProductName', product.name);
  setText('#fichaProductDescription', product.summary);
  setText('#fichaCategory', product.category);
  setText('#fichaNotes', 'La representación ayuda a identificar la pieza. Las dimensiones, carga, apoyo y acabado se revisan caso por caso.');

  const specList = document.getElementById('fichaSpecs');
  if (specList) {
    const specs = (product.specs || []).concat([
      ['Peso de referencia', numberFormatter.format(weightProfile.kgM2) + ' kg/m²'],
      ['Base de cálculo', weightProfile.basis]
    ]);
    specList.innerHTML = specs.map((spec) =>
      '<li><strong>' + escapeHtml(spec[0]) + ':</strong> ' + escapeHtml(spec[1]) + '</li>'
    ).join('');
  }

  const viewerConfig = Object.assign({}, product.config, {
    id: product.id,
    name: product.name,
    sku: product.sku,
    notes: product.summary,
    category: product.category,
    visualType: product.visualType || product.modelType || 'grating'
  });

  initViewer(viewerConfig);
}
