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

  const canvases = document.querySelectorAll('.avatar-canvas[data-persona]');
  canvases.forEach(canvas => {
    const personaId = canvas.dataset.persona;
    const builder = AVATAR_BUILDERS[personaId];
    if (!builder) return;

    const { renderer, animateFn, pointLight } = builder(canvas);
    _avatarRenderers.push(renderer);

    // Hover: speed up rotation
    const card = canvas.closest('.persona-card');
    if (card) {
      card.addEventListener('mouseenter', () => { canvas._hovered = true; });
      card.addEventListener('mouseleave', () => { canvas._hovered = false; });
    }

    // IntersectionObserver: pause rendering when section off screen
    const section = document.getElementById('persona-section');
    if (section) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            renderer.setAnimationLoop(animateFn);
          } else {
            renderer.setAnimationLoop(null);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(section);
      _avatarObservers.push(obs);
    } else {
      renderer.setAnimationLoop(animateFn);
    }
  });
}

function disposeAvatars() {
  _avatarObservers.forEach(o => o.disconnect());
  _avatarObservers.length = 0;
  _avatarRenderers.forEach(r => {
    r.setAnimationLoop(null);
    r.dispose();
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

  return { renderer, scene, camera, pointLight, accentColor };
}

// ── AVATAR 1: Explorer — Astronaut (accent: electric blue #3b82f6) ────────────

function buildExplorerAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#3b82f6');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.3 });

  // Helmet
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat('#c8d8f0'));
  helmet.position.set(0, 0.45, 0);
  scene.add(helmet);

  // Visor
  const visor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1, metalness: 0.9 })
  );
  visor.position.set(0, 0.45, 0.3);
  visor.rotation.x = Math.PI / 2;
  scene.add(visor);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat('#a0b8d8'));
  body.position.set(0, -0.15, 0);
  scene.add(body);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
  const armMat = mat('#a0b8d8');
  const armL = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.55, -0.1, 0);
  armL.rotation.z = Math.PI / 4;
  scene.add(armL);

  const armR = new THREE.Mesh(armGeo, armMat);
  armR.position.set(0.55, -0.1, 0);
  armR.rotation.z = -Math.PI / 4;
  scene.add(armR);

  // Stars
  const stars = [];
  const starGeo = new THREE.IcosahedronGeometry(0.04, 0);
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3b82f6, emissiveIntensity: 1 });
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

  // Group for rotation
  const group = new THREE.Group();
  [helmet, visor, body, armL, armR].forEach(m => { scene.remove(m); group.add(m); });
  scene.add(group);

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

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 2: Hacker — Cyber Skull Bot (accent: neon green #22c55e) ──────────

function buildHackerAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#22c55e');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.6, metalness: 0.2 });

  const group = new THREE.Group();

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat('#1a1a2e'));
  group.add(head);

  // Eyes
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.5 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
  eyeL.position.set(-0.2, 0.1, 0.42);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
  eyeR.position.set(0.2, 0.1, 0.42);
  group.add(eyeR);

  // Jaw
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.4), mat('#111122'));
  jaw.position.set(0, -0.46, 0.1);
  group.add(jaw);

  // Antenna
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6),
    mat('#334455')
  );
  antenna.position.set(0, 0.65, 0);
  group.add(antenna);

  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  antennaTip.position.set(0, 0.93, 0);
  group.add(antennaTip);

  // Scanlines (4 thin planes)
  const scanlineMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e, transparent: true, opacity: 0.15, side: THREE.DoubleSide
  });
  const scanlines = [];
  for (let i = 0; i < 4; i++) {
    const sl = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.05), scanlineMat.clone());
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

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 3: Builder — Blocky Robot (accent: purple #a855f7) ─────────────────

function buildBuilderAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#a855f7');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.5, metalness: 0.4 });

  const group = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), mat('#2a1a4a'));
  torso.position.set(0, -0.1, 0);
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat('#3a2a5a'));
  head.position.set(0, 0.55, 0);
  group.add(head);

  // Gear (torus on chest)
  const gear = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.06, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 })
  );
  gear.position.set(0, -0.05, 0.22);
  group.add(gear);

  // Arms
  const armMat = mat('#3a2a5a');
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  armL.position.set(-0.45, -0.15, 0);
  group.add(armL);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  armR.position.set(0.45, -0.15, 0);
  group.add(armR);

  // Legs
  const legMat = mat('#2a1a4a');
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
  legL.position.set(-0.17, -0.7, 0);
  group.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
  legR.position.set(0.17, -0.7, 0);
  group.add(legR);

  // Rivets
  const rivetMat = mat('#a855f7');
  const rivetPositions = [
    [-0.32, 0.08, 0.22], [0.32, 0.08, 0.22],
    [-0.32, -0.3, 0.22], [0.32, -0.3, 0.22],
    [-0.18, -0.52, 0.22], [0.18, -0.52, 0.22],
  ];
  rivetPositions.forEach(([x, y, z]) => {
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), rivetMat);
    r.position.set(x, y, z);
    group.add(r);
  });

  // Blink light on head
  const blinkLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 2 })
  );
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

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 4: Defender — Armored Knight (accent: coral #f97316) ───────────────

function buildDefenderAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#f97316');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.3, metalness: 0.7 });

  const group = new THREE.Group();

  // Body (armor)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.4, 0.9, 8),
    mat('#2a1a0a')
  );
  body.position.set(0, -0.2, 0);
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat('#3a2a1a'));
  head.position.set(0, 0.5, 0);
  group.add(head);

  // Visor
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.1, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.5, metalness: 0.8 })
  );
  visor.position.set(0, 0.52, 0.22);
  group.add(visor);

  // Shield
  const shield = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.65, 0.06),
    mat('#8B2200')
  );
  shield.position.set(0.45, 0, 0.3);
  shield.rotation.y = -0.3;
  group.add(shield);

  // Shield glow ring
  const shieldRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.04, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 })
  );
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

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 5: Entrepreneur — Rocket (accent: gold #eab308) ────────────────────

function buildEntrepreneurAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#eab308');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.5 });

  const group = new THREE.Group();

  // Nose cone
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.45, 8),
    mat('#e0e0f0')
  );
  nose.position.set(0, 0.75, 0);
  group.add(nose);

  // Body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.7, 8),
    mat('#c0c8e0')
  );
  body.position.set(0, 0.25, 0);
  group.add(body);

  // Fins (3)
  const finMat = mat('#eab308');
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.15), finMat);
    const angle = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(angle) * 0.22, -0.2, Math.sin(angle) * 0.22);
    fin.rotation.y = angle;
    group.add(fin);
  }

  // Flame
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 2,
    transparent: true, opacity: 0.85
  });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.35, 8), flameMat);
  flame.position.set(0, -0.57, 0);
  flame.rotation.z = Math.PI;
  group.add(flame);

  // Torus rings (2)
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, emissive: 0xeab308, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24), ringMat);
  ring1.position.set(0, 0.1, 0);
  scene.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24), ringMat.clone());
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

  return { renderer, animateFn, pointLight };
}

// ── Avatar builder map ────────────────────────────────────────────────────────

const AVATAR_BUILDERS = {
  explorer:     buildExplorerAvatar,
  hacker:       buildHackerAvatar,
  builder:      buildBuilderAvatar,
  defender:     buildDefenderAvatar,
  entrepreneur: buildEntrepreneurAvatar,
};
