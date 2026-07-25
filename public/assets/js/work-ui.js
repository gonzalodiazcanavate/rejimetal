(function () {
  const works = window.REJIMETAL_WORKS || [];
  let activeIndex = 0;
  let timer = null;
  let paused = false;

  const escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  };

  const mailHref = function (work) {
    return 'mailto:correo@rejimetal.com?subject=' +
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
  };

  const preloadImages = function () {
    works.forEach(function (work) {
      if (!work.image) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = work.image;
    });
  };

  const detailPanel = function (work) {
    const imageUrl = escapeHtml(work.image || '');
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
          '<ul class="spec-list compact-specs">' + (work.specs || []).map(function (item) {
            return '<li><strong>Dato útil:</strong> ' + escapeHtml(item) + '</li>';
          }).join('') + '</ul>',
          '<a class="btn btn-primary" href="' + mailHref(work) + '">Consultar por correo</a>',
        '</div>',
      '</article>'
    ].join('');
  };

  const setActive = function (index, options) {
    if (!works.length) return;
    activeIndex = (index + works.length) % works.length;

    const selectedWork = document.getElementById('selectedWork');
    if (selectedWork) {
      selectedWork.innerHTML = detailPanel(works[activeIndex]);
    }

    if (!options || !options.replaceUrl) return;
    const url = new URL(window.location.href);
    url.searchParams.set('id', works[activeIndex].id);
    window.history.replaceState({}, '', url);
  };

  const openLightbox = function (index) {
    const lightbox = document.getElementById('workLightbox');
    const image = document.getElementById('workLightboxImage');
    const sector = document.getElementById('workLightboxSector');
    const title = document.getElementById('workLightboxTitle');
    const text = document.getElementById('workLightboxText');
    const work = works[index];
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
    const closeButton = lightbox.querySelector('[data-lightbox-close]');
    if (closeButton) closeButton.focus();
  };

  const closeLightbox = function () {
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

  const stopAuto = function () {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const startAuto = function () {
    stopAuto();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || works.length < 2 || paused) return;
    timer = window.setInterval(function () {
      if (!paused) setActive(activeIndex + 1, { replaceUrl: true });
    }, 4800);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const selectedWork = document.getElementById('selectedWork');
    if (!selectedWork || !works.length) return;

    preloadImages();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const initialIndex = Math.max(0, works.findIndex(function (work) { return work.id === id; }));
    setActive(initialIndex, { replaceUrl: false });

    const carousel = document.querySelector('[data-sector-carousel]');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () { paused = true; stopAuto(); });
      carousel.addEventListener('mouseleave', function () { paused = false; startAuto(); });
      carousel.addEventListener('focusin', function () { paused = true; stopAuto(); });
      carousel.addEventListener('focusout', function () { paused = false; startAuto(); });
    }

    document.addEventListener('click', function (event) {
      const prev = event.target.closest('[data-carousel-prev]');
      const next = event.target.closest('[data-carousel-next]');
      const lightboxTrigger = event.target.closest('[data-open-lightbox]');
      const close = event.target.closest('[data-lightbox-close]');
      const lightbox = document.getElementById('workLightbox');

      if (prev) {
        setActive(activeIndex - 1, { replaceUrl: true });
        return;
      }
      if (next) {
        setActive(activeIndex + 1, { replaceUrl: true });
        return;
      }
      if (lightboxTrigger) {
        const index = Number(lightboxTrigger.getAttribute('data-work-index'));
        setActive(index, { replaceUrl: true });
        openLightbox(index);
        return;
      }
      if (close || (lightbox && event.target === lightbox)) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeLightbox();
    });

    window.addEventListener('resize', function () {
      setActive(activeIndex, { replaceUrl: false });
    });

    startAuto();
  });
})();
