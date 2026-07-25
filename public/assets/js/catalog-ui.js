(function () {
  const services = window.REJIMETAL_PRODUCTS || [];

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

  const escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  };

  const weightFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

  const getWeightProfile = function (service) {
    if (typeof window.REJIMETAL_getWeightProfile === 'function') {
      return window.REJIMETAL_getWeightProfile(service);
    }
    return { kgM2: 32, basis: 'Referencia media para rejilla metálica a medida.' };
  };

  const productVisual = function (service, className) {
    const visualType = service.visualType || service.modelType || 'grating';
    const renderVisual = typeof window.REJIMETAL_renderProductVisual === 'function'
      ? window.REJIMETAL_renderProductVisual(service)
      : '';
    return '<div class="' + (className || 'service-visual') + ' service-visual--' + escapeHtml(visualType) + '">' + renderVisual + '</div>';
  };

  const detailHref = function (service) {
    return './ficha.html?id=' + encodeURIComponent(service.id);
  };

  const familyProducts = function (family) {
    return services.filter(function (service) {
      return family.categoryList.indexOf(service.category) !== -1;
    });
  };

  const familyButton = function (family, active) {
    const count = familyProducts(family).length;
    return [
      '<button type="button" class="family-tab' + (active ? ' is-active' : '') + '" data-family="' + escapeHtml(family.id) + '">',
        '<span>' + escapeHtml(family.label) + '</span>',
        '<strong>' + count + (count === 1 ? ' tipo' : ' tipos') + '</strong>',
        '<small>' + escapeHtml(family.intro) + '</small>',
      '</button>'
    ].join('');
  };

  const tagsMarkup = function (items) {
    return (items || []).map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('');
  };

  const featuredMarkup = function (service, family) {
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

  const miniCard = function (service, activeId) {
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

  const initCatalogExplorer = function () {
    const filters = document.getElementById('catalogFilters');
    const rail = document.getElementById('catalogProductGrid');
    const featured = document.getElementById('productFeatured');
    const countNode = document.getElementById('catalogCount');
    if (!filters || !rail || !featured || !services.length) {
      return;
    }

    let activeFamily = families[0];
    let activeProduct = familyProducts(activeFamily)[0] || services[0];

    const renderFilters = function () {
      filters.innerHTML = families.map(function (family) {
        return familyButton(family, family.id === activeFamily.id);
      }).join('');
    };

    const renderProducts = function () {
      const list = familyProducts(activeFamily);
      if (!list.find(function (item) { return item.id === activeProduct.id; })) {
        activeProduct = list[0] || services[0];
      }
      featured.innerHTML = featuredMarkup(activeProduct, activeFamily);
      rail.innerHTML = list.map(function (service) {
        return miniCard(service, activeProduct.id);
      }).join('');
      if (countNode) {
        countNode.textContent = list.length + (list.length === 1 ? ' tipo' : ' tipos');
      }
    };

    const render = function () {
      renderFilters();
      renderProducts();
    };

    filters.addEventListener('click', function (event) {
      const button = event.target.closest('[data-family]');
      if (!button) return;
      const family = families.find(function (item) {
        return item.id === button.getAttribute('data-family');
      });
      if (!family) return;
      activeFamily = family;
      activeProduct = familyProducts(activeFamily)[0] || activeProduct;
      render();
    });

    rail.addEventListener('click', function (event) {
      const button = event.target.closest('[data-product-id]');
      if (!button) return;
      const product = services.find(function (item) {
        return item.id === button.getAttribute('data-product-id');
      });
      if (!product) return;
      activeProduct = product;
      renderProducts();
    });

    render();
  };

  const initQuoteSelect = function () {
    const quoteProduct = document.getElementById('quoteProduct');
    if (!quoteProduct || !services.length) {
      return;
    }

    quoteProduct.innerHTML = services.map(function (service) {
      return '<option value="' + escapeHtml(service.id) + '">' + escapeHtml(service.name) + '</option>';
    }).join('');

    const quotePreview = document.getElementById('quoteProductPreview');
    const quoteDescription = document.getElementById('quoteProductDescription');
    const quoteWeightReference = document.getElementById('quoteWeightReference');
    const quoteWeightBasis = document.getElementById('quoteWeightBasis');

    const updateQuotePreview = function () {
      const selected = services.find(function (service) {
        return service.id === quoteProduct.value;
      }) || services[0];
      const weightProfile = getWeightProfile(selected);
      if (quotePreview && selected) {
        quotePreview.className = 'quote-product-preview service-visual service-visual--' + escapeHtml(selected.visualType || selected.modelType || 'grating');
        quotePreview.innerHTML = typeof window.REJIMETAL_renderProductVisual === 'function'
          ? window.REJIMETAL_renderProductVisual(selected)
          : '';
      }
      if (quoteDescription && selected) {
        quoteDescription.textContent = selected.summary;
      }
      if (quoteWeightReference && weightProfile) {
        quoteWeightReference.textContent = 'Pendiente';
      }
      if (quoteWeightBasis && weightProfile) {
        quoteWeightBasis.textContent = 'Referencia aplicada al calcular: ' + weightFormatter.format(weightProfile.kgM2) + ' kg/m². ' + weightProfile.basis;
      }
    };

    quoteProduct.addEventListener('change', updateQuotePreview);
    updateQuotePreview();
  };

  const initHeroProductVisual = function () {
    const heroPreview = document.getElementById('heroProductPreview');
    if (!heroPreview || !services.length || typeof window.REJIMETAL_renderProductVisual !== 'function') {
      return;
    }
    const product = services.find(function (service) {
      return service.id === 'rejilla-electrosoldada-cuadradillo-entregirado';
    }) || services[0];
    heroPreview.className = 'hero-product-visual service-visual service-visual--' + escapeHtml(product.visualType || product.modelType || 'grating');
    heroPreview.innerHTML = window.REJIMETAL_renderProductVisual(product);
  };

  document.addEventListener('DOMContentLoaded', function () {
    initCatalogExplorer();
    initQuoteSelect();
    initHeroProductVisual();
  });
})();
