const CONTACT_EMAIL = 'correo@rejimetal.com';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const numberFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });
const COOKIE_STORAGE_KEY = 'rejimetal_cookie_preferences_v1';
const DEFAULT_COOKIE_PREFERENCES = { external: false };

if (!prefersReducedMotion) {
  let pointerFrame = 0;
  window.addEventListener('pointermove', (event) => {
    if (pointerFrame) {
      return;
    }

    pointerFrame = window.requestAnimationFrame(() => {
      const x = Math.max(0, Math.min(100, (event.clientX / window.innerWidth) * 100));
      const y = Math.max(0, Math.min(100, (event.clientY / window.innerHeight) * 100));
      document.body.style.setProperty('--pointer-x', `${x}%`);
      document.body.style.setProperty('--pointer-y', `${y}%`);
      pointerFrame = 0;
    });
  }, { passive: true });

  const interactiveSurfaces = Array.from(document.querySelectorAll([
    '.hero-panel',
    '.budget-card',
    '.quote-panel',
    '.contact-panel',
    '.solution-grid article',
    '.case-list article',
    '.habit-grid article',
    '.info-panel'
  ].join(',')));

  interactiveSurfaces.forEach((surface) => {
    surface.addEventListener('pointermove', (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty('--card-x', `${Math.max(0, Math.min(100, x))}%`);
      surface.style.setProperty('--card-y', `${Math.max(0, Math.min(100, y))}%`);
    }, { passive: true });

    surface.addEventListener('pointerleave', () => {
      surface.style.removeProperty('--card-x');
      surface.style.removeProperty('--card-y');
    });
  });
}

const budgetEmailBody = [
  'Hola REJIMETAL,',
  '',
  'Necesito presupuesto para una pieza de rejilla metálica a medida.',
  '',
  'Tipo de pieza:',
  'Medidas aproximadas en mm:',
  'Unidades:',
  'Uso previsto:',
  'Interior/exterior:',
  'Acabado deseado:',
  '¿Hay plano, foto, croquis o muestra?:',
  'Comentarios:',
  '',
  'Gracias.'
].join('\n');

const buildMailto = (subject, body) => {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const setEmailHref = (id, subject, body) => {
  const node = document.getElementById(id);
  if (node) {
    node.href = buildMailto(subject, body);
  }
};

setEmailHref('heroBudgetEmail', 'Solicitud de presupuesto - Rejilla metálica a medida', budgetEmailBody);
setEmailHref('budgetEmailBtn', 'Solicitud de presupuesto - Rejilla metálica a medida', budgetEmailBody);
setEmailHref('contactEmailBudget', 'Solicitud de presupuesto - Rejilla metálica a medida', budgetEmailBody);
setEmailHref('serviceEmail', 'Solicitud de presupuesto - Rejilla metálica a medida', budgetEmailBody);

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');

if (menuButton && nav) {
  const setMenuState = (open) => {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  menuButton.addEventListener('click', () => setMenuState(!nav.classList.contains('open')));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (!nav.contains(target) && !menuButton.contains(target)) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });
}

if (siteHeader) {
  const syncHeaderState = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });
}

const initHomeWorkCarousel = () => {
  const carousel = document.querySelector('[data-home-work-carousel]');
  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.hero-work-slide'));
  if (!slides.length) {
    return;
  }

  const prevButton = carousel.querySelector('[data-home-work-prev]');
  const nextButton = carousel.querySelector('[data-home-work-next]');
  const dotsWrap = carousel.querySelector('[data-home-work-dots]');
  let activeIndex = 0;
  let timer = null;
  let paused = false;

  if (dotsWrap) {
    dotsWrap.textContent = '';
    slides.forEach((slide, index) => {
      const label = slide.querySelector('figcaption span')?.textContent || `Trabajo ${index + 1}`;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver ${label}`);
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
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    if (prefersReducedMotion || slides.length < 2 || paused) {
      return;
    }
    timer = window.setInterval(() => setActive(activeIndex + 1), 4800);
  };

  const goTo = (index) => {
    setActive(index);
    start();
  };

  prevButton?.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton?.addEventListener('click', () => goTo(activeIndex + 1));

  dotsWrap?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-home-work-dot]');
    if (!button) {
      return;
    }
    goTo(Number(button.dataset.homeWorkDot || 0));
  });

  carousel.addEventListener('mouseenter', () => {
    paused = true;
    stop();
  });
  carousel.addEventListener('mouseleave', () => {
    paused = false;
    start();
  });
  carousel.addEventListener('focusin', () => {
    paused = true;
    stop();
  });
  carousel.addEventListener('focusout', () => {
    paused = false;
    start();
  });

  setActive(0);
  start();
};

initHomeWorkCarousel();

const cookiePageHref = () => {
  const path = window.location.pathname;
  return path.includes('/productos/') || path.includes('/trabajos/')
    ? '../politica-cookies.html'
    : 'politica-cookies.html';
};

const readCookiePreferences = () => {
  try {
    const raw = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    return raw ? { ...DEFAULT_COOKIE_PREFERENCES, ...JSON.parse(raw) } : null;
  } catch (error) {
    return null;
  }
};

const saveCookiePreferences = (preferences) => {
  try {
    window.localStorage.setItem(
      COOKIE_STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_COOKIE_PREFERENCES, ...preferences, savedAt: new Date().toISOString() })
    );
  } catch (error) {
    // If storage is unavailable, keep the decision in the current session only.
    window.REJIMETAL_COOKIE_PREFERENCES = { ...DEFAULT_COOKIE_PREFERENCES, ...preferences };
  }
};

const currentCookiePreferences = () => {
  return readCookiePreferences() || window.REJIMETAL_COOKIE_PREFERENCES || null;
};

const applyCookiePreferences = (preferences) => {
  const prefs = preferences || currentCookiePreferences() || DEFAULT_COOKIE_PREFERENCES;
  const allowExternal = Boolean(prefs.external);

  document.querySelectorAll('iframe[data-cookie-src]').forEach((frame) => {
    const source = frame.getAttribute('data-cookie-src');
    const wrap = frame.closest('[data-map-wrap]');
    if (allowExternal && source && frame.getAttribute('src') !== source) {
      frame.setAttribute('src', source);
    }
    if (!allowExternal) {
      frame.removeAttribute('src');
    }
    frame.hidden = !allowExternal;
    wrap?.classList.toggle('is-map-loaded', allowExternal);
  });

  document.querySelectorAll('[data-cookie-placeholder="maps"]').forEach((placeholder) => {
    placeholder.hidden = allowExternal;
  });
};

const closeCookieDialog = () => {
  document.querySelector('[data-cookie-banner]')?.remove();
  const modal = document.querySelector('[data-cookie-modal]');
  if (modal) {
    modal.hidden = true;
    modal.classList.remove('is-open');
  }
  document.documentElement.classList.remove('has-cookie-modal');
};

const openCookieSettings = () => {
  let modal = document.querySelector('[data-cookie-modal]');
  if (!modal) {
    modal = buildCookieModal();
    document.body.appendChild(modal);
  }
  const prefs = currentCookiePreferences() || DEFAULT_COOKIE_PREFERENCES;
  const externalInput = modal.querySelector('[data-cookie-external]');
  if (externalInput) {
    externalInput.checked = Boolean(prefs.external);
  }
  modal.hidden = false;
  modal.classList.add('is-open');
  document.documentElement.classList.add('has-cookie-modal');
  modal.querySelector('[data-cookie-save]')?.focus();
};

const persistCookieChoice = (preferences) => {
  const prefs = { ...DEFAULT_COOKIE_PREFERENCES, ...preferences };
  saveCookiePreferences(prefs);
  applyCookiePreferences(prefs);
  closeCookieDialog();
};

const buildCookieBanner = () => {
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('data-cookie-banner', '');
  banner.setAttribute('aria-label', 'Aviso de privacidad y cookies');
  banner.innerHTML = `
    <div class="cookie-banner-copy">
      <strong>Privacidad y cookies</strong>
      <p>Usamos almacenamiento técnico necesario para que la web funcione. Si aceptas, también cargaremos contenido externo como Google Maps.</p>
      <a href="${cookiePageHref()}">Política de cookies</a>
    </div>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-link" data-cookie-reject>Rechazar</button>
      <button type="button" class="btn btn-secondary" data-cookie-settings>Configurar</button>
      <button type="button" class="btn btn-primary" data-cookie-accept>Aceptar</button>
    </div>
  `;
  return banner;
};

const buildCookieModal = () => {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-modal';
  overlay.setAttribute('data-cookie-modal', '');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="cookie-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <button type="button" class="cookie-modal-close" data-cookie-close aria-label="Cerrar configuración">×</button>
      <p class="eyebrow">Configuración de privacidad</p>
      <h2 id="cookie-modal-title">Gestionar cookies</h2>
      <p>La web funciona con cookies o tecnologías técnicas necesarias. El mapa de Google solo se carga si autorizas contenido externo.</p>
      <div class="cookie-option">
        <div>
          <strong>Técnicas necesarias</strong>
          <span>Permiten recordar esta elección y mantener funciones básicas de la web.</span>
        </div>
        <input type="checkbox" checked disabled aria-label="Cookies técnicas necesarias siempre activas" />
      </div>
      <label class="cookie-option">
        <div>
          <strong>Contenido externo</strong>
          <span>Permite cargar Google Maps integrado en la página de contacto.</span>
        </div>
        <input type="checkbox" data-cookie-external />
      </label>
      <div class="cookie-modal-actions">
        <button type="button" class="btn btn-link" data-cookie-modal-reject>Rechazar</button>
        <button type="button" class="btn btn-secondary" data-cookie-save>Guardar configuración</button>
        <button type="button" class="btn btn-primary" data-cookie-modal-accept>Aceptar todo</button>
      </div>
      <a class="cookie-policy-link" href="${cookiePageHref()}">Leer política de cookies</a>
    </div>
  `;
  return overlay;
};

const initCookieControls = () => {
  applyCookiePreferences(currentCookiePreferences());

  const footerInner = document.querySelector('.footer-inner');
  if (footerInner && !footerInner.querySelector('[data-cookie-footer]')) {
    const privacyLinks = document.createElement('p');
    privacyLinks.className = 'footer-privacy-links';
    privacyLinks.setAttribute('data-cookie-footer', '');
    privacyLinks.innerHTML = `
      <a href="${cookiePageHref()}">Política de cookies</a>
      <button type="button" data-cookie-open>Configurar cookies</button>
    `;
    footerInner.appendChild(privacyLinks);
  }

  if (!currentCookiePreferences()) {
    document.body.appendChild(buildCookieBanner());
  }

  if (!document.querySelector('[data-cookie-modal]')) {
    document.body.appendChild(buildCookieModal());
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('[data-cookie-accept]') || target.closest('[data-cookie-modal-accept]')) {
      persistCookieChoice({ external: true });
      return;
    }

    if (target.closest('[data-cookie-reject]') || target.closest('[data-cookie-modal-reject]')) {
      persistCookieChoice({ external: false });
      return;
    }

    if (target.closest('[data-cookie-settings]') || target.closest('[data-cookie-open]')) {
      openCookieSettings();
      return;
    }

    if (target.closest('[data-cookie-save]')) {
      const modal = document.querySelector('[data-cookie-modal]');
      const externalInput = modal?.querySelector('[data-cookie-external]');
      persistCookieChoice({ external: Boolean(externalInput?.checked) });
      return;
    }

    if (target.closest('[data-cookie-close]')) {
      closeCookieDialog();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCookieDialog();
    }
  });
};

initCookieControls();

const revealItems = Array.from(document.querySelectorAll('.reveal'));
if (revealItems.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
  }
}

const yearNode = document.getElementById('current-year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const sectionLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if (sections.length && sectionLinks.length && 'IntersectionObserver' in window) {
  const linkById = new Map(sectionLinks.map((link) => [link.getAttribute('href').replace('#', ''), link]));
  const spyObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries.filter((entry) => entry.isIntersecting);
    if (!visibleEntries.length) {
      return;
    }
    visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    const activeLink = linkById.get(visibleEntries[0].target.id);
    sectionLinks.forEach((link) => link.classList.toggle('is-active', link === activeLink));
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.15, 0.35, 0.6] });
  sections.forEach((section) => spyObserver.observe(section));
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.product-email-btn');
  if (!button) {
    return;
  }

  const product = button.getAttribute('data-product') || 'rejilla metálica a medida';
  const body = [
    'Hola REJIMETAL,',
    '',
    `Necesito presupuesto para una solución a medida relacionada con ${product}.`,
    '',
    'Medidas aproximadas en mm:',
    'Unidades:',
    'Uso previsto:',
    'Interior/exterior:',
    'Acabado deseado:',
    '¿Hay plano, foto, croquis o muestra?:',
    'Comentarios:'
  ].join('\n');
  window.location.href = buildMailto('Solicitud técnica - ' + product, body);
});

const renderProductVisual = (product) => {
  if (typeof window.REJIMETAL_renderProductVisual === 'function') {
    return window.REJIMETAL_renderProductVisual(product);
  }
  return '';
};

const initQuoteProductSelector = () => {
  const quoteProduct = document.getElementById('quoteProduct');
  if (!quoteProduct) {
    return;
  }

  const products = window.REJIMETAL_PRODUCTS || [];
  if (!products.length) {
    quoteProduct.innerHTML = '<option value="">No se pudieron cargar los tipos de rejilla</option>';
    quoteProduct.disabled = true;
    return;
  }

  const quotePreview = document.getElementById('quoteProductPreview');
  const quoteDescription = document.getElementById('quoteProductDescription');

  quoteProduct.textContent = '';
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name;
    quoteProduct.appendChild(option);
  });

  const updatePreview = () => {
    const selected = products.find((product) => product.id === quoteProduct.value) || products[0];
    if (!selected) {
      return;
    }
    if (quotePreview) {
      quotePreview.className = `quote-product-preview service-visual service-visual--${selected.visualType || selected.modelType || 'grating'}`;
      quotePreview.innerHTML = renderProductVisual(selected);
    }
    if (quoteDescription) {
      quoteDescription.textContent = selected.summary || 'Referencia visual para identificar el tipo de pieza antes de pedir presupuesto.';
    }
  };

  quoteProduct.addEventListener('change', updatePreview);
  updatePreview();
};

const initHeroProductVisual = () => {
  const heroPreview = document.getElementById('heroProductPreview');
  const products = window.REJIMETAL_PRODUCTS || [];
  if (!heroPreview || !products.length) {
    return;
  }
  const product = products.find((item) => item.id === 'rejilla-electrosoldada-cuadradillo-entregirado') || products[0];
  heroPreview.className = `hero-product-visual service-visual service-visual--${product.visualType || product.modelType || 'grating'}`;
  heroPreview.innerHTML = renderProductVisual(product);
};

initQuoteProductSelector();
initHeroProductVisual();

const calcForm = document.getElementById('quick-calc-form');
const calcResult = document.getElementById('calcResult');
const quoteEmail = document.getElementById('quoteEmail');
const quoteWeightReference = document.getElementById('quoteWeightReference');
const quoteWeightBasis = document.getElementById('quoteWeightBasis');
let lastQuoteMessage = '';

if (calcForm && calcResult && quoteEmail) {
  const getSelectedQuoteProduct = () => {
    const select = document.getElementById('quoteProduct');
    const value = (select || {}).value || '';
    const products = window.REJIMETAL_PRODUCTS || [];
    return products.find((item) => item.id === value) || products[0] || { name: 'Rejilla metálica a medida' };
  };
  const getSelectedWeightProfile = (product) => {
    if (typeof window.REJIMETAL_getWeightProfile === 'function') {
      return window.REJIMETAL_getWeightProfile(product);
    }
    return { kgM2: 32, basis: 'Referencia media para rejilla metálica a medida.', note: '' };
  };
  const updateQuoteWeightCard = (value, detail) => {
    if (quoteWeightReference) {
      quoteWeightReference.textContent = value;
    }
    if (quoteWeightBasis) {
      quoteWeightBasis.textContent = detail;
    }
  };

  const calculateQuote = () => {
    const selectedProduct = getSelectedQuoteProduct();
    const product = selectedProduct.name;
    const weightProfile = getSelectedWeightProfile(selectedProduct);
    const weightKgM2 = Number(weightProfile.kgM2 || 0);
    const lengthMm = Number((document.getElementById('quoteLength') || {}).value || 0);
    const widthMm = Number((document.getElementById('quoteWidth') || {}).value || 0);
    const units = Number((document.getElementById('quoteUnits') || {}).value || 0);

    if (lengthMm <= 0 || widthMm <= 0 || units <= 0 || weightKgM2 <= 0) {
      calcResult.textContent = 'Introduce largo, ancho en mm y unidades para preparar la consulta.';
      updateQuoteWeightCard(
        'Pendiente',
        `Referencia aplicada al calcular: ${numberFormatter.format(weightKgM2)} kg/m². ${weightProfile.basis || 'Referencia media para rejilla metálica a medida.'}`
      );
      lastQuoteMessage = '';
      return;
    }

    const totalArea = (lengthMm / 1000) * (widthMm / 1000) * units;
    const estimatedKg = totalArea * weightKgM2;
    updateQuoteWeightCard(
      `${numberFormatter.format(estimatedKg)} kg`,
      `Referencia aplicada: ${numberFormatter.format(weightKgM2)} kg/m². ${weightProfile.basis || 'Referencia media para rejilla metálica a medida.'}`
    );
    calcResult.textContent = `Medidas: ${numberFormatter.format(lengthMm)} x ${numberFormatter.format(widthMm)} mm. Superficie aproximada: ${numberFormatter.format(totalArea)} m². Referencia aplicada: ${numberFormatter.format(weightKgM2)} kg/m².`;

    lastQuoteMessage = [
      'Hola REJIMETAL,',
      '',
      'Necesito presupuesto para una pieza de rejilla metálica a medida.',
      '',
      `Tipo de pieza: ${product}`,
      `Medidas aproximadas en mm: ${numberFormatter.format(lengthMm)} x ${numberFormatter.format(widthMm)} mm`,
      `Unidades: ${units}`,
      `Superficie aproximada: ${numberFormatter.format(totalArea)} m²`,
      `Peso orientativo calculado: ${numberFormatter.format(estimatedKg)} kg`,
      `Peso de referencia aplicado: ${numberFormatter.format(weightKgM2)} kg/m²`,
      `Base de cálculo: ${weightProfile.basis || 'Referencia media para rejilla metálica a medida.'}`,
      `Nota: ${weightProfile.note || 'El peso final se ajusta al confirmar malla, pletina, marco, recortes y acabado.'}`,
      '',
      'Uso previsto:',
      'Interior/exterior:',
      'Acabado deseado:',
      '¿Hay plano, foto, croquis o muestra?:',
      'Comentarios:'
    ].join('\n');
  };

  calcForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateQuote();
  });

  ['quoteProduct', 'quoteLength', 'quoteWidth', 'quoteUnits'].forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', calculateQuote);
      field.addEventListener('change', calculateQuote);
    }
  });

  quoteEmail.addEventListener('click', () => {
    if (!lastQuoteMessage) {
      calculateQuote();
    }
    if (lastQuoteMessage) {
      window.location.href = buildMailto('Solicitud de presupuesto - Cálculo de rejilla a medida', lastQuoteMessage);
    }
  });
}

const copyAddressBtn = document.getElementById('copyAddressBtn');
const companyAddress = document.getElementById('companyAddress');
if (copyAddressBtn && companyAddress) {
  copyAddressBtn.addEventListener('click', async () => {
    const text = companyAddress.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyAddressBtn.textContent = 'Dirección copiada';
      window.setTimeout(() => { copyAddressBtn.textContent = 'Copiar dirección'; }, 1800);
    } catch (error) {
      copyAddressBtn.textContent = 'No se pudo copiar';
      window.setTimeout(() => { copyAddressBtn.textContent = 'Copiar dirección'; }, 1800);
    }
  });
}

const form = document.getElementById('contact-form');
const feedback = document.querySelector('.form-feedback');

if (form && feedback) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const company = (data.get('company') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const pieceType = (data.get('pieceType') || '').toString().trim();
    const measures = (data.get('measures') || '').toString().trim();
    const units = (data.get('units') || '').toString().trim();
    const environment = (data.get('environment') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Completa nombre, email y mensaje para preparar la solicitud.';
      return;
    }

    const subject = 'Solicitud de presupuesto - Rejilla metálica a medida';
    const body = [
      `Nombre: ${name}`,
      `Empresa: ${company || '-'}`,
      `Teléfono: ${phone || '-'}`,
      `Email: ${email}`,
      `Tipo de pieza: ${pieceType || '-'}`,
      `Medidas aproximadas en mm: ${measures || '-'}`,
      `Unidades: ${units || '-'}`,
      `Uso/entorno: ${environment || '-'}`,
      '',
      'Mensaje:',
      message,
      '',
      'Nota: puedo enviar foto, plano, croquis o muestra por email si hace falta.'
    ].join('\n');

    feedback.textContent = 'Abriendo tu cliente de correo con la solicitud preparada...';
    window.location.href = buildMailto(subject, body);
  });
}
