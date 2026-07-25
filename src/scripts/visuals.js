let visualId = 0;

const point = (x, y) => ({ x, y });
const lerp = (a, b, t) => point(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const translate = (p, dx, dy) => point(p.x + dx, p.y + dy);
const polygonPoints = (points) =>
  points.map((p) => p.x.toFixed(2) + ',' + p.y.toFixed(2)).join(' ');
const line = (a, b, className) =>
  '<line class="' + className + '" x1="' + a.x.toFixed(2) + '" y1="' + a.y.toFixed(2) + '" x2="' + b.x.toFixed(2) + '" y2="' + b.y.toFixed(2) + '" />';
const path = (d, className) => '<path class="' + className + '" d="' + d + '" />';
const polygon = (points, className) =>
  '<polygon class="' + className + '" points="' + polygonPoints(points) + '" />';

const isType = (visualType, token) => String(visualType || '').indexOf(token) !== -1;
const signatureFor = (item, visualType) =>
  [visualType, item && item.id, item && item.name].filter(Boolean).join(' ').toLowerCase();
const has = (signature, token) => String(signature || '').indexOf(token) !== -1;

const shapeFor = (visualType) => {
  if (isType(visualType, 'stair')) return [point(16, 32), point(84, 23), point(91, 49), point(24, 61)];
  if (isType(visualType, 'tree')) return [point(22, 19), point(78, 19), point(90, 57), point(10, 57)];
  if (isType(visualType, 'drain')) return [point(12, 31), point(88, 23), point(95, 46), point(19, 58)];
  if (isType(visualType, 'manual')) return [point(24, 28), point(88, 20), point(79, 55), point(15, 62)];
  return [point(17, 30), point(88, 21), point(80, 56), point(10, 63)];
};

const gridCount = (visualType, signature) => {
  if (isType(visualType, 'offshore')) return { bars: 22, crosses: 34 };
  if (isType(visualType, 'pressed')) return { bars: 13, crosses: isType(visualType, 'equal') ? 18 : 12 };
  if (isType(visualType, 'stair')) return { bars: 13, crosses: 14 };
  if (isType(visualType, 'tree')) return { bars: 14, crosses: 14 };
  if (isType(visualType, 'drain')) return { bars: 18, crosses: 16 };
  if (has(signature, 'manual')) return { bars: 11, crosses: 14 };
  return { bars: 17, crosses: 24 };
};

const renderBearingFlats = (corners, count, className) => {
  const [A, B, C, D] = corners;
  let output = '';
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : 0.04 + (i / (count - 1)) * 0.92;
    output += line(lerp(A, B, t), lerp(D, C, t), className);
  }
  return output;
};

const renderCrossMembers = (corners, count, className) => {
  const [A, B, C, D] = corners;
  let output = '';
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : 0.07 + (i / (count - 1)) * 0.86;
    output += line(lerp(A, D, t), lerp(B, C, t), className);
  }
  return output;
};

const renderElectroweldedGrid = (corners, visualType, signature) => {
  const counts = gridCount(visualType, signature);
  const crossClass = has(signature, 'varilla lisa')
    ? 'visual-rod visual-rod--round'
    : 'visual-rod visual-rod--twisted';
  return [
    renderBearingFlats(corners, counts.bars, 'visual-bearing'),
    renderCrossMembers(corners, counts.crosses, crossClass)
  ].join('');
};

const renderPressedGrid = (corners, visualType, signature) => {
  const counts = gridCount(visualType, signature);
  const crossClass = isType(visualType, 'equal') ? 'visual-separator visual-separator--equal' : 'visual-separator';
  return [
    renderBearingFlats(corners, counts.bars, 'visual-bearing visual-bearing--pressed'),
    renderCrossMembers(corners, counts.crosses, crossClass),
    renderPressedKeys(corners, counts.bars, counts.crosses)
  ].join('');
};

const renderOffshoreLayer = (corners) => {
  const [A, B, C, D] = corners;
  const inset = [lerp(A, C, 0.11), lerp(B, D, 0.09), lerp(C, A, 0.09), lerp(D, B, 0.11)];
  return [
    polygon(inset, 'visual-security-field'),
    renderBearingFlats(inset, 14, 'visual-security-line'),
    renderCrossMembers(inset, 12, 'visual-security-line visual-security-line--cross')
  ].join('');
};

const renderGrid = (corners, visualType, signature) => {
  if (isType(visualType, 'pressed')) return renderPressedGrid(corners, visualType, signature);
  return renderElectroweldedGrid(corners, visualType, signature) +
    (isType(visualType, 'offshore') ? renderOffshoreLayer(corners) : '');
};

function renderSerratedEdge(corners) {
  const D = corners[3]; const C = corners[2];
  let output = '';
  for (let i = 0; i < 14; i += 1) {
    const t1 = 0.05 + i * 0.067;
    const t2 = t1 + 0.033;
    const p1 = lerp(D, C, t1);
    const p2 = lerp(D, C, t2);
    output += path('M ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2) + ' l 1.6 -4.6 L ' + p2.x.toFixed(2) + ' ' + p2.y.toFixed(2), 'visual-tooth');
  }
  return output;
}

function renderWaveEdge(corners) {
  const D = corners[3]; const C = corners[2];
  let d = '';
  for (let i = 0; i < 10; i += 1) {
    const t1 = 0.05 + i * 0.09;
    const t2 = t1 + 0.045;
    const t3 = t1 + 0.09;
    const p1 = lerp(D, C, t1);
    const p2 = lerp(D, C, t2);
    const p3 = lerp(D, C, t3);
    d += 'M ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2) + ' Q ' + p2.x.toFixed(2) + ' ' + (p2.y - 5).toFixed(2) + ' ' + p3.x.toFixed(2) + ' ' + p3.y.toFixed(2) + ' ';
  }
  return path(d, 'visual-wave');
}

function renderTwistMarks(corners) {
  const [A, B, C, D] = corners;
  let output = '';
  for (let i = 0; i < 8; i += 1) {
    const t = 0.08 + i * 0.12;
    output += line(lerp(lerp(A, D, 0.42), lerp(B, C, 0.42), t), lerp(lerp(A, D, 0.54), lerp(B, C, 0.54), t + 0.035), 'visual-twist');
  }
  return output;
}

function renderPressedKeys(corners, bars, crosses) {
  const [A, B, C, D] = corners;
  let output = '';
  for (let i = 2; i < bars - 2; i += 3) {
    const xT = i / (bars - 1);
    for (let j = 2; j < crosses - 2; j += 4) {
      const yT = j / (crosses - 1);
      const p = lerp(lerp(A, D, yT), lerp(B, C, yT), xT);
      output += '<circle class="visual-key" cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="1.4" />';
    }
  }
  return output;
}

function renderProfileLip(corners) {
  const D = corners[3]; const C = corners[2];
  return polygon([D, C, translate(C, 2.4, 5.5), translate(D, 2.4, 5.5)], 'visual-lip');
}

function renderCutout(corners) {
  const [A, B, C, D] = corners;
  const p = lerp(lerp(A, D, 0.35), lerp(B, C, 0.35), 0.68);
  return path('M ' + (p.x - 7).toFixed(2) + ' ' + (p.y - 2).toFixed(2) + ' h 16 l 3 13 h -17 z', 'visual-cutout');
}

function renderTreeHole() {
  return [
    '<polygon class="visual-hole" points="39,35 61,35 67,57 33,57" />',
    '<path class="visual-hole-edge" d="M39 35 L61 35 L67 57 L33 57 Z" />',
    '<path class="visual-tree-split" d="M50 19 L50 35 M50 57 L50 63 M22 38 L39 38 M61 38 L78 38" />'
  ].join('');
}

function renderDrainBase(corners) {
  const D = corners[3]; const C = corners[2];
  return [
    polygon([translate(D, 2, 4), translate(C, 2, 4), translate(C, -3, 15), translate(D, -5, 15)], 'visual-channel'),
    polygon([point(24, 67), point(78, 61), point(84, 67), point(31, 75)], 'visual-water'),
    line(translate(D, 1, 8), translate(C, 0, 8), 'visual-channel-line')
  ].join('');
}

function renderStairDetails(corners, visualType) {
  const [A, B, C, D] = corners;
  const bolt = isType(visualType, 'bolt');
  const weld = isType(visualType, 'weld');
  return [
    renderProfileLip(corners),
    polygon([translate(A, -2, 4), translate(D, 0, 2), translate(D, 6, 15), translate(A, 3, 12)], 'visual-side'),
    polygon([translate(B, 2, 4), translate(C, 2, 2), translate(C, 8, 14), translate(B, 5, 11)], 'visual-side'),
    bolt ? '<circle class="visual-bolt" cx="' + (D.x + 3).toFixed(2) + '" cy="' + (D.y + 8).toFixed(2) + '" r="1.9" /><circle class="visual-bolt" cx="' + (C.x + 5).toFixed(2) + '" cy="' + (C.y + 7).toFixed(2) + '" r="1.9" />' : '',
    weld ? '<path class="visual-weld-mark" d="M18 68 l8 -5 M23 70 l8 -5 M76 58 l8 -5" />' : ''
  ].join('');
}

export function renderProductVisual(item, options) {
  const opts = options || {};
  const visualType = (item && (item.visualType || item.modelType)) || opts.visualType || 'grating';
  const signature = signatureFor(item, visualType);
  const corners = shapeFor(visualType);
  const id = 'rejimetal-visual-' + (visualId += 1);
  const clipId = id + '-clip';
  const title = item && item.name ? item.name : 'Rejilla metalica';
  let detail = '';

  if (isType(visualType, 'drain')) detail += renderDrainBase(corners);
  if (isType(visualType, 'stair')) detail += renderStairDetails(corners, visualType);
  else if (isType(visualType, 'profile')) { /* lip handled inside stair for now */ }

  if (has(signature, 'ondulado') || isType(visualType, 'wave')) detail += renderWaveEdge(corners);
  else if (isType(visualType, 'dentado') || isType(visualType, 'serrated') || isType(visualType, 'saw') || isType(visualType, 'safety')) detail += renderSerratedEdge(corners);

  if (isType(visualType, 'twisted') || has(signature, 'cuadradillo') || isType(visualType, 'offshore')) detail += renderTwistMarks(corners);
  if (isType(visualType, 'tree')) detail += renderTreeHole();
  if (opts.cutout || isType(visualType, 'cut') || isType(visualType, 'manual')) detail += renderCutout(corners);

  return [
    '<svg class="visual-svg" viewBox="0 0 100 100" role="img" aria-label="' + title.replace(/"/g, '&quot;') + '" xmlns="http://www.w3.org/2000/svg">',
    '<defs>',
    '<linearGradient id="' + id + '-steel" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#ffffff" />',
    '<stop offset="0.36" stop-color="#eaf0f5" />',
    '<stop offset="1" stop-color="#9ba7b1" />',
    '</linearGradient>',
    '<filter id="' + id + '-shadow" x="-20%" y="-30%" width="150%" height="170%">',
    '<feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#1f2b36" flood-opacity="0.18" />',
    '</filter>',
    '<clipPath id="' + clipId + '"><polygon points="' + polygonPoints(corners) + '" /></clipPath>',
    '</defs>',
    '<rect class="visual-bg" x="0" y="0" width="100" height="100" />',
    '<ellipse class="visual-soft-shadow" cx="52" cy="69" rx="38" ry="8" />',
    '<g filter="url(#' + id + '-shadow)">',
    '<polygon class="visual-plate" fill="url(#' + id + '-steel)" points="' + polygonPoints(corners) + '" />',
    '<g clip-path="url(#' + clipId + ')">',
    renderGrid(corners, visualType, signature),
    '</g>',
    '<polygon class="visual-frame" points="' + polygonPoints(corners) + '" />',
    detail,
    '</g>',
    '</svg>'
  ].join('');
}

export function renderWorkVisual(work, options) {
  const opts = options || {};
  const visualType = (work && work.visualType) || 'frame';
  const productLike = {
    name: work && work.name ? work.name : 'Trabajo de rejilla metalica',
    visualType: {
      frame: 'electrowelded-profile',
      cut: 'manual-cut',
      stair: 'stair-bolt',
      drain: 'drain',
      replace: 'electrowelded-serrated-profile',
      platform: 'offshore',
      industrial: 'pressed-equal'
    }[visualType] || visualType
  };
  return renderProductVisual(productLike, Object.assign({}, opts, { cutout: visualType === 'cut' }));
}
