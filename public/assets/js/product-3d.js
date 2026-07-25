(function () {
  const CONTACT_EMAIL = 'correo@rejimetal.com';

  const defaultConfig = {
    name: 'Modelo',
    sku: 'SKU-000',
    width: 2.0,
    depth: 1.0,
    barHeight: 0.03,
    barThickness: 0.03,
    crossThickness: 0.018,
    bars: 16,
    crosses: 28,
    frameThickness: 0.04,
    notes: 'Vista técnica orientativa',
    defaultMaterial: 'steel'
  };

  const config = Object.assign({}, defaultConfig, window.PRODUCT_3D_CONFIG || {});

  const canvas = document.getElementById('viewerCanvas');
  const materialButtons = Array.from(document.querySelectorAll('[data-material]'));
  const wireframeBtn = document.getElementById('toggleWireframe');
  const rotateBtn = document.getElementById('toggleRotate');

  let autoRotate = true;
  let wireframe = false;

  if (!canvas || typeof window.THREE === 'undefined') {
    const hint = document.querySelector('.viewer-hint');
    if (hint) {
      hint.textContent = 'No se pudo cargar el motor 3D en este navegador.';
    }
    document.body.classList.add('viewer-error');
    return;
  }

  const THREE = window.THREE;
  const setHint = function (message) {
    const hint = document.querySelector('.viewer-hint');
    if (hint) {
      hint.textContent = message;
    }
  };

  const fichaHeader = document.querySelector('.ficha-header');
  if (fichaHeader) {
    const onHeaderScroll = function () {
      fichaHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (error) {
    setHint('Tu dispositivo no soporta WebGL para este visor 3D.');
    document.body.classList.add('viewer-error');
    return;
  }
  document.body.classList.add('viewer-ready');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(2.0, 1.15, 2.15);
  camera.lookAt(0, 0, 0);

  let controls = null;
  if (typeof THREE.OrbitControls === 'function') {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minDistance = 1.1;
    controls.maxDistance = 8;
  } else {
    setHint('Visor 3D cargado sin controles orbitales. Pulsa actualizar (Ctrl+F5).');
  }

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8e7f7, 0.86);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(2.6, 4.2, 2.4);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x7fb6ff, 0.44);
  rimLight.position.set(-2.8, 2.2, -1.2);
  scene.add(rimLight);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 40),
    new THREE.MeshStandardMaterial({
      color: 0xe4eef8,
      metalness: 0.05,
      roughness: 0.98,
      transparent: true,
      opacity: 0.86
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.15;
  ground.receiveShadow = true;
  scene.add(ground);

  const materialPresets = {
    steel: {
      color: 0xa6b3c4,
      metalness: 0.88,
      roughness: 0.34,
      emissive: 0x0a1524,
      emissiveIntensity: 0.05
    },
    galvanized: {
      color: 0xb8c3cd,
      metalness: 0.78,
      roughness: 0.48,
      emissive: 0x101820,
      emissiveIntensity: 0.04
    },
    inox: {
      color: 0xd9e2eb,
      metalness: 0.94,
      roughness: 0.2,
      emissive: 0x101a26,
      emissiveIntensity: 0.05
    },
    prfv: {
      color: 0x4f8d58,
      metalness: 0.12,
      roughness: 0.78,
      emissive: 0x1a2e1e,
      emissiveIntensity: 0.08
    }
  };

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const makeMaterial = function (presetKey) {
    const key = presetKey || 'steel';
    const preset = materialPresets[key] || materialPresets.steel;
    return new THREE.MeshStandardMaterial({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      emissive: preset.emissive,
      emissiveIntensity: preset.emissiveIntensity,
      wireframe: wireframe
    });
  };

  const makeAuxMaterial = function (key) {
    const palette = {
      dark: { color: 0x122033, metalness: 0.2, roughness: 0.72, opacity: 0.96 },
      water: { color: 0x4b9eea, metalness: 0.02, roughness: 0.28, opacity: 0.34 },
      edge: { color: 0x72808c, metalness: 0.78, roughness: 0.38, opacity: 1 }
    };
    const preset = palette[key] || palette.edge;
    return new THREE.MeshStandardMaterial({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      transparent: preset.opacity < 1,
      opacity: preset.opacity,
      wireframe: wireframe
    });
  };

  let activeMaterialKey = config.defaultMaterial || 'steel';
  let activeMaterial = makeMaterial(activeMaterialKey);

  const clearGroup = function (group) {
    while (group.children.length > 0) {
      const child = group.children.pop();
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(function (mat) { mat.dispose(); });
        } else {
          child.material.dispose();
        }
      }
    }
  };

  const addBox = function (group, width, height, depth, x, y, z, rotationZ, materialOverride) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, materialOverride || activeMaterial);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (rotationZ) {
      mesh.rotation.z = rotationZ;
    }
    group.add(mesh);
    return mesh;
  };

  const addCylinderX = function (group, radius, length, x, y, z, materialOverride) {
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 18);
    const mesh = new THREE.Mesh(geometry, materialOverride || activeMaterial);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.rotation.z = Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const addFrame = function (group, width, depth, height, frameThickness) {
    addBox(group, frameThickness, height, depth, -width / 2 + frameThickness / 2, height / 2, 0);
    addBox(group, frameThickness, height, depth, width / 2 - frameThickness / 2, height / 2, 0);
    addBox(group, width, height, frameThickness, 0, height / 2, -depth / 2 + frameThickness / 2);
    addBox(group, width, height, frameThickness, 0, height / 2, depth / 2 - frameThickness / 2);
  };

  const modelSignature = function (options) {
    return [
      options.visualType,
      options.modelType,
      options.id,
      options.name
    ].filter(Boolean).join(' ').toLowerCase();
  };

  const modelHas = function (options, token) {
    return modelSignature(options).indexOf(token) !== -1;
  };

  const addDentado = function (group, x, barHeight, barDepth, barThickness, frameThickness) {
    const teeth = 7;
    for (let k = 0; k < teeth; k += 1) {
      const t = teeth === 1 ? 0.5 : k / (teeth - 1);
      const z = -barDepth / 2 + frameThickness + t * (barDepth - frameThickness * 2);
      const tooth = addBox(group, barThickness * 0.92, barHeight * 0.34, barThickness * 1.2, x, barHeight * 1.12, z);
      tooth.rotation.z = Math.PI * 0.08;
    }
  };

  const buildFlatGrating = function (group, options) {
    const signature = modelSignature(options);
    const width = options.width;
    const depth = options.depth;
    const barHeight = options.barHeight;
    const barThickness = options.barThickness;
    const crossThickness = options.crossThickness;
    const frameThickness = options.frameThickness;

    const pressed = options.pressed || signature.indexOf('pressed') !== -1 || signature.indexOf('prensada') !== -1;
    const equalPressed = signature.indexOf('equal') !== -1 || signature.indexOf('iguales') !== -1;
    const roundCross = options.roundCross || signature.indexOf('varilla lisa') !== -1 || signature.indexOf('rod') !== -1;
    const twistedSquare = options.twistedSquare || signature.indexOf('twisted') !== -1 || signature.indexOf('cuadradillo') !== -1 || signature.indexOf('entregirado') !== -1;
    const serrated = options.dentado || signature.indexOf('dentado') !== -1 || signature.indexOf('saw') !== -1 || signature.indexOf('serrated') !== -1 || signature.indexOf('safety') !== -1;
    const offshore = options.offshore || signature.indexOf('offshore') !== -1;
    const profileProtection = options.profileProtection || signature.indexOf('profile') !== -1 || signature.indexOf('perfil') !== -1;

    const innerWidth = Math.max(width - frameThickness * 2.8, 0.1);
    const innerDepth = Math.max(depth - frameThickness * 2.8, 0.1);
    const barDepth = innerDepth;
    const crossWidth = innerWidth;
    const bars = Math.max(2, options.bars);
    const crosses = Math.max(2, options.crosses);
    const darkMaterial = makeAuxMaterial('dark');

    for (let i = 0; i < bars; i += 1) {
      const t = bars === 1 ? 0.5 : i / (bars - 1);
      const x = -innerWidth / 2 + t * innerWidth;
      addBox(group, barThickness, barHeight, barDepth, x, barHeight / 2, 0);
      if (serrated && i % 2 === 0) {
        addDentado(group, x, barHeight, barDepth, barThickness, frameThickness);
      }
    }

    for (let i = 0; i < crosses; i += 1) {
      const t = crosses === 1 ? 0.5 : i / (crosses - 1);
      const z = -innerDepth / 2 + t * innerDepth;
      if (pressed) {
        const crossHeight = equalPressed ? barHeight : barHeight * 0.72;
        addBox(group, crossWidth, crossHeight, crossThickness, 0, crossHeight / 2, z);
      } else if (roundCross) {
        addCylinderX(group, crossThickness * 0.58, crossWidth, 0, barHeight + crossThickness * 0.18, z);
      } else {
        const rod = addBox(group, crossWidth, crossThickness, crossThickness, 0, barHeight + crossThickness * 0.3, z);
        if (twistedSquare) {
          rod.rotation.x = Math.PI / 4;
        }
      }
    }

    addFrame(group, width, depth, barHeight * 1.08, frameThickness);

    if (profileProtection) {
      addBox(group, width, barHeight * 1.65, frameThickness * 1.05, 0, barHeight * 1.05, -depth / 2 + frameThickness * 0.45);
    }

    if (pressed) {
      const stepBars = Math.max(3, Math.floor(bars / 4));
      const stepCrosses = Math.max(4, Math.floor(crosses / 4));
      for (let i = 1; i < bars - 1; i += stepBars) {
        const x = -innerWidth / 2 + (i / (bars - 1)) * innerWidth;
        for (let j = 1; j < crosses - 1; j += stepCrosses) {
          const z = -innerDepth / 2 + (j / (crosses - 1)) * innerDepth;
          addBox(group, barThickness * 1.35, barHeight * 0.16, crossThickness * 1.35, x, barHeight * 1.04, z, 0, darkMaterial);
        }
      }
    }

    if (offshore) {
      const extraBars = 8;
      const extraCrosses = 10;
      for (let i = 0; i < extraBars; i += 1) {
        const t = i / (extraBars - 1);
        const x = -innerWidth / 2 + t * innerWidth;
        addBox(group, barThickness * 0.45, barHeight * 0.32, innerDepth, x, barHeight * 1.24, 0);
      }
      for (let i = 0; i < extraCrosses; i += 1) {
        const t = i / (extraCrosses - 1);
        const z = -innerDepth / 2 + t * innerDepth;
        addBox(group, crossWidth, barHeight * 0.28, crossThickness * 0.45, 0, barHeight * 1.3, z);
      }
    }
  };

  const buildStair = function (group, options) {
    buildFlatGrating(group, options);
    const signature = modelSignature(options);
    const width = options.width;
    const depth = options.depth;
    const h = options.barHeight;
    const darkMaterial = makeAuxMaterial('dark');
    addBox(group, width, h * 1.75, options.frameThickness * 2.1, 0, h * 1.28, -depth / 2 - options.frameThickness);
    addBox(group, options.frameThickness * 1.35, h * 3.6, depth * 0.9, -width / 2 - options.frameThickness, h * 1.55, 0);
    addBox(group, options.frameThickness * 1.35, h * 3.6, depth * 0.9, width / 2 + options.frameThickness, h * 1.55, 0);
    addBox(group, width * 0.94, h * 0.28, options.frameThickness * 1.3, 0, h * 2.12, -depth / 2 - options.frameThickness * 1.7, 0, darkMaterial);

    if (signature.indexOf('bolt') !== -1 || signature.indexOf('atornillar') !== -1) {
      addCylinderX(group, h * 0.55, options.frameThickness * 1.6, -width / 2 - options.frameThickness * 1.05, h * 1.7, -depth * 0.22, darkMaterial);
      addCylinderX(group, h * 0.55, options.frameThickness * 1.6, -width / 2 - options.frameThickness * 1.05, h * 1.7, depth * 0.22, darkMaterial);
      addCylinderX(group, h * 0.55, options.frameThickness * 1.6, width / 2 + options.frameThickness * 1.05, h * 1.7, -depth * 0.22, darkMaterial);
      addCylinderX(group, h * 0.55, options.frameThickness * 1.6, width / 2 + options.frameThickness * 1.05, h * 1.7, depth * 0.22, darkMaterial);
    }
  };

  const buildDrain = function (group, options) {
    buildFlatGrating(group, options);
    const width = options.width;
    const depth = options.depth;
    const h = options.barHeight;
    const channelDepth = options.channelDepth || 0.18;
    const waterMaterial = makeAuxMaterial('water');
    addBox(group, width, h * 0.8, options.frameThickness, 0, -channelDepth, -depth / 2);
    addBox(group, width, h * 0.8, options.frameThickness, 0, -channelDepth, depth / 2);
    addBox(group, options.frameThickness, channelDepth, depth, -width / 2, -channelDepth / 2, 0);
    addBox(group, options.frameThickness, channelDepth, depth, width / 2, -channelDepth / 2, 0);
    addBox(group, width * 0.86, h * 0.12, depth * 0.82, 0, -channelDepth * 0.42, 0, 0, waterMaterial);
  };

  const buildTreeGuard = function (group, options) {
    buildFlatGrating(group, options);
    const hole = options.centerHole || 0.42;
    const h = options.barHeight * 1.35;
    const darkMaterial = makeAuxMaterial('dark');
    addBox(group, hole * 1.05, h * 0.8, hole * 1.05, 0, h * 0.78, 0, 0, darkMaterial);
    addBox(group, hole, h, options.frameThickness, 0, h / 2, -hole / 2);
    addBox(group, hole, h, options.frameThickness, 0, h / 2, hole / 2);
    addBox(group, options.frameThickness, h, hole, -hole / 2, h / 2, 0);
    addBox(group, options.frameThickness, h, hole, hole / 2, h / 2, 0);
  };

  const buildShelving = function (group, options) {
    buildFlatGrating(group, options);
    const width = options.width;
    const depth = options.depth;
    const h = options.barHeight;
    addBox(group, width + 0.12, h * 1.8, options.frameThickness, 0, h * 1.35, -depth / 2 - 0.04);
    addBox(group, width + 0.12, h * 1.8, options.frameThickness, 0, h * 1.35, depth / 2 + 0.04);
    addBox(group, options.frameThickness, h * 6, options.frameThickness, -width / 2, h * 3, -depth / 2);
    addBox(group, options.frameThickness, h * 6, options.frameThickness, width / 2, h * 3, -depth / 2);
    addBox(group, options.frameThickness, h * 6, options.frameThickness, -width / 2, h * 3, depth / 2);
    addBox(group, options.frameThickness, h * 6, options.frameThickness, width / 2, h * 3, depth / 2);
  };

  const buildFence = function (group, options) {
    const width = options.width;
    const height = options.depth;
    const thick = options.barThickness;
    const depth = options.frameThickness;
    for (let i = 0; i < options.bars; i += 1) {
      const t = options.bars === 1 ? 0.5 : i / (options.bars - 1);
      addBox(group, thick, height, depth, -width / 2 + t * width, height / 2, 0);
    }
    for (let i = 0; i < options.crosses; i += 1) {
      const t = options.crosses === 1 ? 0.5 : i / (options.crosses - 1);
      addBox(group, width, thick * 0.8, depth, 0, t * height, 0);
    }
    addBox(group, options.frameThickness, height + 0.2, depth * 1.8, -width / 2 - 0.08, height / 2, 0);
    addBox(group, options.frameThickness, height + 0.2, depth * 1.8, width / 2 + 0.08, height / 2, 0);
    addBox(group, width + 0.2, options.frameThickness, depth * 1.8, 0, height + 0.06, 0);
  };

  const buildLamas = function (group, options) {
    const width = options.width;
    const height = options.depth;
    const depth = options.frameThickness;
    const slats = options.slats || 12;
    addBox(group, options.frameThickness, height, depth * 1.8, -width / 2, height / 2, 0);
    addBox(group, options.frameThickness, height, depth * 1.8, width / 2, height / 2, 0);
    addBox(group, width, options.frameThickness, depth * 1.8, 0, 0, 0);
    addBox(group, width, options.frameThickness, depth * 1.8, 0, height, 0);
    for (let i = 0; i < slats; i += 1) {
      const t = slats === 1 ? 0.5 : i / (slats - 1);
      const y = 0.08 + t * (height - 0.16);
      const slat = addBox(group, width * 0.95, options.barHeight * 1.15, depth * 2.4, 0, y, 0);
      slat.rotation.x = Math.PI * 0.18;
    }
  };

  const buildFixture = function (group, options) {
    addBox(group, 0.58, 0.035, 0.28, 0, 0.02, 0);
    addBox(group, 0.18, 0.09, 0.2, -0.15, 0.085, 0);
    addBox(group, 0.18, 0.09, 0.2, 0.15, 0.085, 0);
    addBox(group, 0.46, 0.024, 0.06, 0, 0.14, -0.1);
    addBox(group, 0.46, 0.024, 0.06, 0, 0.14, 0.1);
  };

  const buildGrating = function () {
    clearGroup(modelGroup);
    modelGroup.position.set(0, 0, 0);
    modelGroup.rotation.set(0, 0, 0);

    const modelType = config.modelType || 'grating';
    if (modelType === 'stair') {
      buildStair(modelGroup, config);
    } else if (modelType === 'drain') {
      buildDrain(modelGroup, config);
    } else if (modelType === 'tree') {
      buildTreeGuard(modelGroup, config);
    } else if (modelType === 'shelving') {
      buildShelving(modelGroup, config);
    } else if (modelType === 'fence') {
      buildFence(modelGroup, config);
    } else if (modelType === 'lamas') {
      buildLamas(modelGroup, config);
    } else if (modelType === 'fixture') {
      buildFixture(modelGroup, config);
    } else {
      buildFlatGrating(modelGroup, config);
    }

    const box = new THREE.Box3().setFromObject(modelGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    modelGroup.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(maxDim * 1.0, maxDim * 0.68, maxDim * 1.05);
    camera.lookAt(0, 0, 0);

    const floorRadius = Math.max(maxDim * 2.4, 3.4);
    ground.scale.set(floorRadius / 3.6, floorRadius / 3.6, 1);

    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  };

  buildGrating();

  materialButtons.forEach(function (button) {
    const mat = button.getAttribute('data-material');
    if (mat === activeMaterialKey) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', function () {
      materialButtons.forEach(function (b) { b.classList.remove('is-active'); });
      button.classList.add('is-active');

      activeMaterialKey = button.getAttribute('data-material') || 'steel';
      activeMaterial = makeMaterial(activeMaterialKey);
      buildGrating();
    });
  });

  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', function () {
      wireframe = !wireframe;
      wireframeBtn.classList.toggle('is-active', wireframe);
      activeMaterial = makeMaterial(activeMaterialKey);
      buildGrating();
    });
  }

  if (rotateBtn) {
    rotateBtn.addEventListener('click', function () {
      autoRotate = !autoRotate;
      rotateBtn.classList.toggle('is-active', autoRotate);
    });
  }

  const onResize = function () {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.update();
    }
  };

  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();

  const render = function () {
    const delta = clock.getDelta();

    if (autoRotate) {
      modelGroup.rotation.y += delta * 0.38;
    }

    if (controls) {
      controls.update();
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  };

  render();

  const setText = function (id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };

  setText('fichaProductName', config.name);
  setText('fichaSku', config.sku);
  setText('fichaNotes', config.notes);

  const mailBtn = document.getElementById('btnMailProduct');
  if (mailBtn) {
    mailBtn.addEventListener('click', function () {
      const subject = encodeURIComponent('Solicitud técnica - ' + config.name);
      const body = encodeURIComponent([
        'Hola REJIMETAL,',
        '',
        'Necesito presupuesto para una solución a medida relacionada con ' + config.name + '.',
        '',
        'Medidas aproximadas en mm:',
        'Unidades:',
        'Uso previsto:',
        'Interior/exterior:',
        'Acabado deseado:',
        '¿Hay plano, foto, croquis o muestra?:',
        'Comentarios:'
      ].join('\n'));
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
    });
  }

  const printBtn = document.getElementById('btnPrintProduct');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }
})();
