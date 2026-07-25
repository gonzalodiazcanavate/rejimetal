(function () {
  const products = window.REJIMETAL_PRODUCTS || [];
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const product = products.find(function (item) {
    return item.id === requestedId;
  }) || products[0];

  if (!product) {
    return;
  }

  const setText = function (selector, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  };

  const setAttr = function (selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute(attr, value);
    }
  };

  const escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  };
  const numberFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
  const weightProfile = typeof window.REJIMETAL_getWeightProfile === 'function'
    ? window.REJIMETAL_getWeightProfile(product)
    : { kgM2: 32, basis: 'Referencia media para rejilla metálica a medida.' };

  const visual = document.getElementById('fichaVisual');
  if (visual) {
    visual.className = 'product-visual product-visual--' + (product.visualType || product.modelType || 'grating');
    visual.innerHTML = typeof window.REJIMETAL_renderProductVisual === 'function'
      ? window.REJIMETAL_renderProductVisual(product)
      : '';
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
    specList.innerHTML = specs.map(function (spec) {
      return '<li><strong>' + escapeHtml(spec[0]) + ':</strong> ' + escapeHtml(spec[1]) + '</li>';
    }).join('');
  }

  window.PRODUCT_3D_CONFIG = Object.assign({}, product.config, {
    id: product.id,
    name: product.name,
    sku: product.sku,
    notes: product.summary,
    category: product.category,
    visualType: product.visualType || product.modelType || 'grating'
  });
})();
