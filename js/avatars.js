/**
 * avatars.js — Three.js 3D persona avatars for CyberSpark home page.
 *
 * Public API:
 *   initAvatars()    — creates all 5 Three.js scenes into .avatar-canvas elements
 *   disposeAvatars() — disposes all renderers (call before re-render on persona change)
 *
 * Depends on: THREE global (Three.js r128 CDN loaded before this file)
 * Only loaded on index.html. On mobile (< 640px) this module does nothing —
 * the CSS hides canvases and shows emoji fallbacks instead.
 */

/* eslint-disable no-undef */

const _avatarRenderers = [];
const _avatarObservers = [];

function initAvatars() {
  if (typeof THREE === 'undefined') return;
  if (window.innerWidth < 640) return;

  // Fix 7: double-init guard — dispose existing before re-initialising
  if (_avatarRenderers.length > 0) disposeAvatars();

  const canvases = document.querySelectorAll('.avatar-canvas[data-persona]');
  canvases.forEach(canvas => {
    const personaId = canvas.dataset.persona;
    const builder = AVATAR_BUILDERS[personaId];
    if (!builder) return;

    // Fix 5: capture the full built object rather than destructuring
    const built = builder(canvas);

    // Fix 2: per-entry AbortController for hover listeners
    const hoverController = new AbortController();

    // Fix 1 + Fix 3: store renderer, animateFn, dispose, and AbortController together
    _avatarRenderers.push({
      renderer:        built.renderer,
      animateFn:       built.animateFn,
      dispose:         built.dispose,
      _abortController: hoverController,
    });

    // Fix 2: wire hover with AbortController signal so listeners are cleaned up
    const card = canvas.closest('.persona-card');
    if (card) {
      card.addEventListener('mouseenter', () => { canvas._hovered = true; },  { signal: hoverController.signal });
      card.addEventListener('mouseleave', () => { canvas._hovered = false; }, { signal: hoverController.signal });
    }

    // Start the animation loop directly; the single observer below may pause/resume it.
    built.renderer.setAnimationLoop(built.animateFn);
  });

  // Fix 3: one shared IntersectionObserver for all renderers
  const section = document.getElementById('persona-section');
  if (section && _avatarRenderers.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        _avatarRenderers.forEach(r => {
          r.renderer.setAnimationLoop(entry.isIntersecting ? r.animateFn : null);
        });
      });
    }, { threshold: 0.1 });
    obs.observe(section);
    _avatarObservers.push(obs);
  }
  // If section not found the loops are already running (set above).
}

function disposeAvatars() {
  _avatarObservers.forEach(o => o.disconnect());
  _avatarObservers.length = 0;
  // Fix 1 + Fix 2: stop loops, abort hover listeners, dispose geometries/materials, dispose renderer
  _avatarRenderers.forEach(entry => {
    entry.renderer.setAnimationLoop(null);
    if (entry._abortController) entry._abortController.abort();
    if (typeof entry.dispose === 'function') entry.dispose();
    entry.renderer.dispose();
  });
  _avatarRenderers.length = 0;
}

// ── Shared scene setup ───────────────────────────────────────────────────────

function _createBaseScene(canvas, accentHex) {
  const W = 160, H = 160;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 0, 3.5);

  const accentColor = new THREE.Color(accentHex);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(accentColor, 1.0);
  dirLight.position.set(-1, 1, 1);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(accentColor, 0.6, 10);
  pointLight.position.set(0, 0, 2);
  scene.add(pointLight);

  return { renderer, scene, camera };
}

// ── AVATAR 1: Explorer — Astronaut (accent: electric blue #3b82f6) ────────────

function buildExplorerAvatar(canvas) {
  const { renderer, scene, camera } = _createBaseScene(canvas, '#3b82f6');

  // Fix 1: track all disposables
  const _disposables = [];
  const mat = color => {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.3 });
    _disposables.push(m);
    return m;
  };

  // Fix 4: create group first; add meshes directly to group, never to scene
  const group = new THREE.Group();

  // Helmet
  const helmetGeo = new THREE.SphereGeometry(0.5, 16, 16);
  _disposables.push(helmetGeo);
  const helmet = new THREE.Mesh(helmetGeo, mat('#c8d8f0'));
  helmet.position.set(0, 0.45, 0);
  group.add(helmet);

  // Visor
  const visorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16);
  _disposables.push(visorGeo);
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1, metalness: 0.9 });
  _disposables.push(visorMat);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.45, 0.3);
  visor.rotation.x = Math.PI / 2;
  group.add(visor);

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.35, 16, 16);
  _disposables.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, mat('#a0b8d8'));
  body.position.set(0, -0.15, 0);
  group.add(body);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
  _disposables.push(armGeo);
  const armMat = mat('#a0b8d8');
  const armL = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.55, -0.1, 0);
  armL.rotation.z = Math.PI / 4;
  group.add(armL);

  const armR = new THREE.Mesh(armGeo, armMat);
  armR.position.set(0.55, -0.1, 0);
  armR.rotation.z = -Math.PI / 4;
  group.add(armR);

  scene.add(group);

  // Stars (orbit around scene, not part of group)
  const stars = [];
  const starGeo = new THREE.IcosahedronGeometry(0.04, 0);
  _disposables.push(starGeo);
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3b82f6, emissiveIntensity: 1 });
  _disposables.push(starMat);
  for (let i = 0; i < 10; i++) {
    const star = new THREE.Mesh(starGeo, starMat);
    const angle = (i / 10) * Math.PI * 2;
    star.position.set(Math.cos(angle) * 1.0, (Math.random() - 0.5) * 1.2, Math.sin(angle) * 0.3);
    star._baseAngle = angle;
    star._radius = 0.9 + Math.random() * 0.2;
    star._yOffset = (Math.random() - 0.5) * 1.2;
    scene.add(star);
    stars.push(star);
  }

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.position.y = Math.sin(t * 1.5) * 0.08;
    group.rotation.y += canvas._hovered ? 0.04 : 0.008;

    stars.forEach(star => {
      star._baseAngle += 0.008;
      star.position.x = Math.cos(star._baseAngle) * star._radius;
      star.position.z = Math.sin(star._baseAngle) * 0.3;
      star.position.y = star._yOffset + Math.sin(t * 2 + star._baseAngle) * 0.1;
    });

    renderer.render(scene, camera);
  }

  return {
    renderer,
    animateFn,
    dispose: () => { _disposables.forEach(d => d.dispose()); },
  };
}

// ── AVATAR 2: Hacker — Cyber Skull Bot (accent: neon green #22c55e) ──────────

function buildHackerAvatar(canvas) {
  const { renderer, scene, camera } = _createBaseScene(canvas, '#22c55e');

  // Fix 1: track all disposables
  const _disposables = [];
  const mat = color => {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.6, metalness: 0.2 });
    _disposables.push(m);
    return m;
  };

  const group = new THREE.Group();

  // Head
  const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  _disposables.push(headGeo);
  const head = new THREE.Mesh(headGeo, mat('#1a1a2e'));
  group.add(head);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.12, 8, 8);
  _disposables.push(eyeGeo);
  // Shared material — all three emissive parts (eyes + antenna tip) glow together
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.5 });
  _disposables.push(eyeMat);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.2, 0.1, 0.42);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.2, 0.1, 0.42);
  group.add(eyeR);

  // Jaw
  const jawGeo = new THREE.BoxGeometry(0.6, 0.15, 0.4);
  _disposables.push(jawGeo);
  const jaw = new THREE.Mesh(jawGeo, mat('#111122'));
  jaw.position.set(0, -0.46, 0.1);
  group.add(jaw);

  // Antenna
  const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6);
  _disposables.push(antennaGeo);
  const antenna = new THREE.Mesh(antennaGeo, mat('#334455'));
  antenna.position.set(0, 0.65, 0);
  group.add(antenna);

  const antennaTipGeo = new THREE.SphereGeometry(0.07, 8, 8);
  _disposables.push(antennaTipGeo);
  const antennaTip = new THREE.Mesh(antennaTipGeo, eyeMat);
  antennaTip.position.set(0, 0.93, 0);
  group.add(antennaTip);

  // Scanlines (4 thin planes)
  const scanlinePlaneGeo = new THREE.PlaneGeometry(0.8, 0.05);
  _disposables.push(scanlinePlaneGeo);
  const scanlineMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
  });
  _disposables.push(scanlineMat);
  const scanlines = [];
  for (let i = 0; i < 4; i++) {
    const clonedMat = scanlineMat.clone();
    _disposables.push(clonedMat);
    const sl = new THREE.Mesh(scanlinePlaneGeo, clonedMat);
    sl.position.set(0, 0.25 - i * 0.18, 0.42);
    group.add(sl);
    scanlines.push(sl);
  }

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 1.2) * 0.12;
    group.rotation.y += canvas._hovered ? 0.04 : 0.006;

    // Eye pulse
    const pulse = 0.8 + Math.sin(t * 3) * 0.4;
    eyeL.material.emissiveIntensity = pulse;
    eyeR.material.emissiveIntensity = pulse;
    antennaTip.material.emissiveIntensity = pulse;

    // Scanline flicker
    scanlines.forEach((sl, i) => {
      sl.material.opacity = 0.05 + Math.abs(Math.sin(t * 4 + i * 1.2)) * 0.25;
    });

    renderer.render(scene, camera);
  }

  return {
    renderer,
    animateFn,
    dispose: () => { _disposables.forEach(d => d.dispose()); },
  };
}

// ── AVATAR 3: Builder — Blocky Robot (accent: purple #a855f7) ─────────────────

function buildBuilderAvatar(canvas) {
  const { renderer, scene, camera } = _createBaseScene(canvas, '#a855f7');

  // Fix 1: track all disposables
  const _disposables = [];
  const mat = color => {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.5, metalness: 0.4 });
    _disposables.push(m);
    return m;
  };

  const group = new THREE.Group();

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.6, 0.8, 0.4);
  _disposables.push(torsoGeo);
  const torso = new THREE.Mesh(torsoGeo, mat('#2a1a4a'));
  torso.position.set(0, -0.1, 0);
  group.add(torso);

  // Head
  const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  _disposables.push(headGeo);
  const head = new THREE.Mesh(headGeo, mat('#3a2a5a'));
  head.position.set(0, 0.55, 0);
  group.add(head);

  // Gear (torus on chest)
  const gearGeo = new THREE.TorusGeometry(0.2, 0.06, 8, 16);
  _disposables.push(gearGeo);
  const gearMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 });
  _disposables.push(gearMat);
  const gear = new THREE.Mesh(gearGeo, gearMat);
  gear.position.set(0, -0.05, 0.22);
  group.add(gear);

  // Arms
  const armBoxGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  _disposables.push(armBoxGeo);
  const armMat = mat('#3a2a5a');
  const armL = new THREE.Mesh(armBoxGeo, armMat);
  armL.position.set(-0.45, -0.15, 0);
  group.add(armL);
  const armR = new THREE.Mesh(armBoxGeo, armMat);
  armR.position.set(0.45, -0.15, 0);
  group.add(armR);

  // Legs
  const legBoxGeo = new THREE.BoxGeometry(0.18, 0.4, 0.18);
  _disposables.push(legBoxGeo);
  const legMat = mat('#2a1a4a');
  const legL = new THREE.Mesh(legBoxGeo, legMat);
  legL.position.set(-0.17, -0.7, 0);
  group.add(legL);
  const legR = new THREE.Mesh(legBoxGeo, legMat);
  legR.position.set(0.17, -0.7, 0);
  group.add(legR);

  // Fix 6: shared rivet geometry
  const rivetGeo = new THREE.SphereGeometry(0.05, 6, 6);
  _disposables.push(rivetGeo);
  const rivetMat = mat('#a855f7');
  const rivetPositions = [
    [-0.32, 0.08, 0.22], [0.32, 0.08, 0.22],
    [-0.32, -0.3, 0.22], [0.32, -0.3, 0.22],
    [-0.18, -0.52, 0.22], [0.18, -0.52, 0.22],
  ];
  rivetPositions.forEach(([x, y, z]) => {
    const r = new THREE.Mesh(rivetGeo, rivetMat);
    r.position.set(x, y, z);
    group.add(r);
  });

  // Blink light on head
  const blinkGeo = new THREE.SphereGeometry(0.07, 8, 8);
  _disposables.push(blinkGeo);
  const blinkMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 2 });
  _disposables.push(blinkMat);
  const blinkLight = new THREE.Mesh(blinkGeo, blinkMat);
  blinkLight.position.set(0, 0.78, 0.26);
  group.add(blinkLight);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    gear.rotation.z += 0.03;
    group.rotation.y += canvas._hovered ? 0.04 : 0.007;

    // Arm swing
    armL.rotation.x = Math.sin(t * 1.5) * 0.2;
    armR.rotation.x = -Math.sin(t * 1.5) * 0.2;

    // Blink
    const blink = t % 3 < 0.15 ? 0 : 2;
    blinkLight.material.emissiveIntensity = blink;

    renderer.render(scene, camera);
  }

  return {
    renderer,
    animateFn,
    dispose: () => { _disposables.forEach(d => d.dispose()); },
  };
}

// ── AVATAR 4: Defender — Armored Knight (accent: coral #f97316) ───────────────

function buildDefenderAvatar(canvas) {
  const { renderer, scene, camera } = _createBaseScene(canvas, '#f97316');

  // Fix 1: track all disposables
  const _disposables = [];
  const mat = color => {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.3, metalness: 0.7 });
    _disposables.push(m);
    return m;
  };

  const group = new THREE.Group();

  // Body (armor)
  const bodyGeo = new THREE.CylinderGeometry(0.25, 0.4, 0.9, 8);
  _disposables.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, mat('#2a1a0a'));
  body.position.set(0, -0.2, 0);
  group.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.3, 12, 12);
  _disposables.push(headGeo);
  const head = new THREE.Mesh(headGeo, mat('#3a2a1a'));
  head.position.set(0, 0.5, 0);
  group.add(head);

  // Visor
  const visorGeo = new THREE.BoxGeometry(0.35, 0.1, 0.15);
  _disposables.push(visorGeo);
  const visorMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.5, metalness: 0.8 });
  _disposables.push(visorMat);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.52, 0.22);
  group.add(visor);

  // Shield
  const shieldGeo = new THREE.BoxGeometry(0.5, 0.65, 0.06);
  _disposables.push(shieldGeo);
  const shield = new THREE.Mesh(shieldGeo, mat('#8B2200'));
  shield.position.set(0.45, 0, 0.3);
  shield.rotation.y = -0.3;
  group.add(shield);

  // Shield glow ring
  const shieldRingGeo = new THREE.TorusGeometry(0.38, 0.04, 8, 24);
  _disposables.push(shieldRingGeo);
  const shieldRingMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 });
  _disposables.push(shieldRingMat);
  const shieldRing = new THREE.Mesh(shieldRingGeo, shieldRingMat);
  shieldRing.position.copy(shield.position);
  shieldRing.rotation.copy(shield.rotation);
  group.add(shieldRing);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 0.8) * 0.05;
    group.rotation.y += canvas._hovered ? 0.04 : 0.007;

    // Shield pulse
    const pulse = 0.5 + Math.sin(t * 2) * 0.5;
    shieldRing.material.emissiveIntensity = pulse * 2;
    shieldRing.scale.setScalar(1 + pulse * 0.1);
    shieldRing.material.opacity = 0.4 + pulse * 0.5;

    renderer.render(scene, camera);
  }

  return {
    renderer,
    animateFn,
    dispose: () => { _disposables.forEach(d => d.dispose()); },
  };
}

// ── AVATAR 5: Entrepreneur — Rocket (accent: gold #eab308) ────────────────────

function buildEntrepreneurAvatar(canvas) {
  const { renderer, scene, camera } = _createBaseScene(canvas, '#eab308');

  // Fix 1: track all disposables
  const _disposables = [];
  const mat = color => {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.5 });
    _disposables.push(m);
    return m;
  };

  const group = new THREE.Group();

  // Nose cone
  const noseGeo = new THREE.ConeGeometry(0.18, 0.45, 8);
  _disposables.push(noseGeo);
  const nose = new THREE.Mesh(noseGeo, mat('#e0e0f0'));
  nose.position.set(0, 0.75, 0);
  group.add(nose);

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 8);
  _disposables.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, mat('#c0c8e0'));
  body.position.set(0, 0.25, 0);
  group.add(body);

  // Fins (3) — shared geometry, shared material
  const finGeo = new THREE.BoxGeometry(0.1, 0.25, 0.15);
  _disposables.push(finGeo);
  const finMat = mat('#eab308');
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(angle) * 0.22, -0.2, Math.sin(angle) * 0.22);
    fin.rotation.y = angle;
    group.add(fin);
  }

  // Flame
  const flameGeo = new THREE.ConeGeometry(0.15, 0.35, 8);
  _disposables.push(flameGeo);
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 2,
    transparent: true, opacity: 0.85,
  });
  _disposables.push(flameMat);
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0, -0.57, 0);
  flame.rotation.z = Math.PI;
  group.add(flame);

  // Torus rings (2) — added to scene directly so they don't rotate with rocket
  const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 24);
  _disposables.push(ringGeo);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, emissive: 0xeab308, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7,
  });
  _disposables.push(ringMat);
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.position.set(0, 0.1, 0);
  scene.add(ring1);

  const ring2Mat = ringMat.clone();
  _disposables.push(ring2Mat);
  const ring2 = new THREE.Mesh(ringGeo, ring2Mat);
  ring2.position.set(0, -0.2, 0);
  ring2.rotation.x = Math.PI / 3;
  scene.add(ring2);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 1.0) * 0.08;
    group.rotation.y += canvas._hovered ? 0.04 : 0.008;
    group.position.y = Math.sin(t * 1.8) * 0.06;

    // Flame flicker
    const flicker = 0.85 + Math.random() * 0.3;
    flame.scale.setScalar(flicker);
    flame.material.emissiveIntensity = 1.5 + Math.random() * 1.5;

    // Ring orbit
    ring1.rotation.y = t * 0.8;
    ring2.rotation.y = -t * 0.6;
    ring2.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.2;

    renderer.render(scene, camera);
  }

  return {
    renderer,
    animateFn,
    dispose: () => { _disposables.forEach(d => d.dispose()); },
  };
}

// ── Avatar builder map ────────────────────────────────────────────────────────

const AVATAR_BUILDERS = {
  explorer:     buildExplorerAvatar,
  hacker:       buildHackerAvatar,
  builder:      buildBuilderAvatar,
  defender:     buildDefenderAvatar,
  entrepreneur: buildEntrepreneurAvatar,
};
