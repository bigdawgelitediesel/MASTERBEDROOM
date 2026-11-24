import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  wall: 0xece8e0, wallCap: 0xcfc9bd, glass: 0x9fd0e6, slab: 0x22262d,
  wood: 0x6b4a2f, linen: 0xe9e4da, blanket: 0x51606e, white: 0xf5f5f2,
  cabinet: 0x3b4650, stone: 0xdedbd4, chrome: 0xb8c0c6, mirror: 0xbfd3dc,
};

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function floorTexture(kind) {
  const c = document.createElement('canvas');
  c.width = c.height = 512; // 512 px = 48 in
  const g = c.getContext('2d');
  if (kind === 'tile') {
    g.fillStyle = '#d8d5ce'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = '#b3aea4'; g.lineWidth = 4;
    for (let i = 0; i <= 512; i += 128) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }
  } else if (kind === 'carpet') {
    g.fillStyle = '#b5ada1'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else {
    const rows = 8, rh = 512 / rows; // 6 in planks
    for (let r = 0; r < rows; r++) {
      let x = -((r * 173) % 256);
      while (x < 512) {
        const len = 256;
        const l = 44 + ((r * 7 + Math.round(x / 64) * 13) % 12);
        g.fillStyle = `hsl(28, 36%, ${l}%)`;
        g.fillRect(x, r * rh, len, rh);
        g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2;
        g.strokeRect(x, r * rh, len, rh);
        x += len;
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function labelSprite(text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.font = '600 54px system-ui, Segoe UI, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = g.measureText(text).width + 56;
  g.fillStyle = 'rgba(15,17,21,.82)';
  g.beginPath(); g.roundRect((512 - w) / 2, 20, w, 88, 44); g.fill();
  g.fillStyle = '#f1e3c8';
  g.fillText(text, 256, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(64, 16, 1);
  s.renderOrder = 10;
  return s;
}

// ---- fixtures: built at the origin, width on X, depth on Z, back at -Z ----
const builders = {
  bed(f) {
    const g = new THREE.Group(), { w, d } = f;
    g.add(box(w, 12, d, mat(COLORS.wood)));
    g.add(box(w + 2, 46, 3, mat(COLORS.wood), 0, 0, -d / 2 + 1.5));
    g.add(box(w - 2, 10, d - 5, mat(COLORS.linen), 0, 12, 1.5));
    g.add(box(w - 1.5, 10.6, d * 0.58, mat(COLORS.blanket), 0, 12, d / 2 - d * 0.29 - 0.5));
    const pw = (w - 12) / 2;
    for (const s of [-1, 1]) g.add(box(pw, 5, 16, mat(COLORS.white), s * (pw / 2 + 2), 22, -d / 2 + 14));
    return g;
  },
  nightstand(f) {
    const g = new THREE.Group();
    g.add(box(f.w, f.h || 24, f.d, mat(COLORS.wood)));
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 9, 20), mat(0xf3e6c4, { emissive: 0x6b5a2a }));
    lamp.position.y = (f.h || 24) + 12;
    g.add(lamp, box(1, 8, 1, mat(COLORS.chrome), 0, f.h || 24, 0));
    return g;
  },
  dresser(f) {
    const g = new THREE.Group(), h = f.h || 34;
    g.add(box(f.w, h, f.d, mat(COLORS.wood)));
    for (let i = 0; i < 3; i++) g.add(box(f.w - 4, h / 3 - 3, 0.6, mat(0x7a5638), 0, 2 + i * (h / 3), f.d / 2 + 0.2));
    return g;
  },
  vanity(f) {
    const g = new THREE.Group(), { w, d } = f, h = f.h || 34.5;
    g.add(box(w, h - 1.5, d, mat(COLORS.cabinet)));
    g.add(box(w + 1, 1.5, d + 1, mat(COLORS.stone, { roughness: 0.3 }), 0, h - 1.5, 0.5));
    const n = f.sinks || 1;
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + (w / n) * (i + 0.5);
      g.add(box(18, 0.4, 13, mat(0xffffff, { roughness: 0.2 }), x, h, 1));
      g.add(box(1.2, 6, 1.2, mat(COLORS.chrome, { metalness: 0.8, roughness: 0.3 }), x, h, -d / 2 + 3));
    }
    g.add(box(f.mirrorW || w - 6, f.mirrorH || 36, 0.8, mat(COLORS.mirror, { metalness: 0.9, roughness: 0.08 }), 0, h + 6, -d / 2 + 0.4));
    return g;
  },
  // Standard two-piece toilet: tank 18 wide, 29 to the tank top, bowl 14 1/2 wide, rim at 16, 28 front to back.
  toilet(f) {
    const g = new THREE.Group(), { w, d } = f, H = f.h || 29, rim = f.rim || 16, bw = 14.5;
    const white = mat(COLORS.white, { roughness: 0.25 });
    g.add(box(w, H - rim + 2, 8, white, 0, rim - 2, -d / 2 + 4));
    g.add(box(10, rim - 2, 9, white, 0, 0, -d / 2 + 4.5));
    const bl = d - 8;
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(bw / 2, 4.5, rim, 28), white);
    bowl.scale.z = bl / bw;
    bowl.position.set(0, rim / 2, -d / 2 + 8 + bl / 2);
    bowl.castShadow = true;
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(bw / 2 + 0.3, bw / 2 + 0.3, 1, 28), mat(0xe6e6e1, { roughness: 0.4 }));
    seat.scale.z = bl / bw;
    seat.position.set(0, rim + 0.5, -d / 2 + 8 + bl / 2);
    g.add(bowl, seat);
    return g;
  },
  tub(f) {
    const g = new THREE.Group(), { w, d } = f, h = f.h || 21;
    g.add(box(w, h, d, mat(COLORS.white, { roughness: 0.2 })));
    g.add(box(w - 7, 0.5, d - 7, mat(0xa9d3e2, { roughness: 0.1 }), 0, h - 0.3, 0));
    return g;
  },
  shower(f) {
    const g = new THREE.Group(), { w, d } = f, h = f.h || 78;
    const glass = mat(COLORS.glass, { transparent: true, opacity: 0.28, roughness: 0.05 });
    g.add(box(w, 3, d, mat(COLORS.stone)));
    g.add(box(w, h, 0.5, glass, 0, 3, d / 2));
    if (!f.alcove) g.add(box(0.5, h, d, glass, w / 2, 3, 0));
    g.add(box(1, 8, 1, mat(COLORS.chrome, { metalness: 0.8 }), 0, h - 4, -d / 2 + 2));
    return g;
  },
  closet(f) {
    const g = new THREE.Group(), { w, d } = f;
    g.add(box(w, 1, d - 8, mat(COLORS.white), 0, 68, -4));
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, w, 12), mat(COLORS.chrome, { metalness: 0.8, roughness: 0.3 }));
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, 64, -d / 2 + 12);
    g.add(rod);
    const shades = [0x51606e, 0x8a5a44, 0xd9d2c4, 0x2f3a44, 0x7c8a6a];
    for (let x = -w / 2 + 6, i = 0; x < w / 2 - 4; x += 5, i++) {
      if (i % 7 === 5) continue;
      g.add(box(3, 30 + (i % 3) * 5, 18, mat(shades[i % shades.length]), x, 64 - 31 - (i % 3) * 5, -d / 2 + 12));
    }
    return g;
  },
  // wall-mounted TV: mount = height of its bottom edge off the floor
  tv(f) {
    const g = new THREE.Group();
    g.add(box(f.w, f.h || 33, 1.5, mat(0x0c0d10, { roughness: 0.25 }), 0, f.mount || 42, -f.d / 2 + 0.75));
    return g;
  },
  box(f) {
    const g = new THREE.Group();
    g.add(box(f.w, f.h || 30, f.d, mat(f.color || 0x8a8f96)));
    return g;
  },
};

export function createScene(container, plan) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14171c);
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 20000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;

  // bounds
  const xs = [], ys = [];
  for (const w of plan.walls) { xs.push(w.a[0], w.b[0]); ys.push(w.a[1], w.b[1]); }
  for (const r of plan.rooms) { xs.push(r.x, r.x + r.w); ys.push(r.y, r.y + r.d); }
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2, cz = (minY + maxY) / 2;
  const R = Math.max(maxX - minX, maxY - minY);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a4238, 1.15));
  const sun = new THREE.DirectionalLight(0xfff2dd, 1.6);
  sun.position.set(cx - R * 0.5, R * 1.2, cz + R * 0.6);
  sun.target.position.set(cx, 0, cz);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -R, right: R, top: R, bottom: -R, near: 1, far: R * 4 });
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  const slab = new THREE.Mesh(new THREE.PlaneGeometry(R * 6, R * 6), mat(0x1a1d22));
  slab.rotation.x = -Math.PI / 2; slab.position.set(cx, -0.5, cz); slab.receiveShadow = true;
  scene.add(slab);

  const textures = {};
  const state = { cut: true, furniture: true, labels: true };
  let root = null;

  function buildWall(wall, H) {
    const t = plan.wallThickness;
    const dx = wall.b[0] - wall.a[0], dz = wall.b[1] - wall.a[1];
    const L = Math.hypot(dx, dz);
    const g = new THREE.Group();
    g.position.set(wall.a[0], 0, wall.a[1]);
    g.rotation.y = -Math.atan2(dz, dx);
    const wm = mat(COLORS.wall);
    const piece = (x0, x1, y0, y1) => {
      y1 = Math.min(y1, H);
      if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return;
      g.add(box(x1 - x0, y1 - y0, t, wm, (x0 + x1) / 2, y0, 0));
    };
    let cur = 0;
    const ops = [...(wall.openings || [])].sort((a, b) => a.at - b.at);
    for (const o of ops) {
      const sill = o.type === 'window' ? (o.sill || 0) : 0;
      piece(cur, o.at, 0, plan.ceiling);
      piece(o.at, o.at + o.w, 0, sill);
      piece(o.at, o.at + o.w, sill + o.h, plan.ceiling);
      if (o.type === 'window' && sill < H) {
        const top = Math.min(sill + o.h, H);
        const glass = box(o.w, top - sill, 0.6, mat(COLORS.glass, { transparent: true, opacity: 0.35, roughness: 0.05 }), o.at + o.w / 2, sill, 0);
        glass.castShadow = false;
        g.add(glass);
        g.add(box(o.w + 2, 1.2, t + 2, mat(COLORS.white), o.at + o.w / 2, sill - 1.2, 0));
      }
      cur = o.at + o.w;
    }
    piece(cur, L, 0, plan.ceiling);
    return g;
  }

  function rebuild() {
    if (root) scene.remove(root);
    root = new THREE.Group();
    const H = state.cut ? 42 : plan.ceiling;

    plan.rooms.forEach((r, ri) => {
      const kind = r.floor || 'wood';
      const base = textures[kind] || (textures[kind] = floorTexture(kind));
      const tex = base.clone(); tex.needsUpdate = true;
      tex.repeat.set(r.w / 48, r.d / 48);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), new THREE.MeshStandardMaterial({ map: tex, roughness: kind === 'tile' ? 0.35 : 0.7 }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(r.x + r.w / 2, 0.05 + ri * 0.03, r.y + r.d / 2);
      m.receiveShadow = true;
      root.add(m);
      if (state.labels && !r.quiet) {
        const s = labelSprite(r.name);
        s.position.set(r.x + r.w / 2, 14, r.y + r.d / 2);
        root.add(s);
      }
    });

    const corners = new Map();
    for (const w of plan.walls) {
      root.add(buildWall(w, H));
      if (state.labels) {
        const wl = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]);
        for (const tg of w.tags || (w.letter ? [{ letter: w.letter, at: wl / 2 }] : [])) {
          const k = tg.at / wl;
          const s = labelSprite(tg.letter.length > 2 ? tg.letter[0] + tg.letter.slice(1).toLowerCase() + ' wall' : 'Wall ' + tg.letter);
          s.position.set(w.a[0] + (w.b[0] - w.a[0]) * k, H + 12, w.a[1] + (w.b[1] - w.a[1]) * k);
          root.add(s);
        }
      }
      for (const p of [w.a, w.b]) corners.set(p.join(','), p);
    }
    const t = plan.wallThickness;
    for (const p of corners.values()) root.add(box(t, H, t, mat(COLORS.wall), p[0], 0, p[1]));

    if (state.furniture) {
      for (const f of plan.fixtures || []) {
        const g = (builders[f.type] || builders.box)(f);
        g.rotation.y = -THREE.MathUtils.degToRad(f.rot || 0);
        g.position.set(f.x, 0.1, f.y);
        root.add(g);
      }
    }
    scene.add(root);
  }

  function view(name) {
    const room = plan.rooms.find((r) => r.id === name && !r.quiet);
    if (room) {
      const tx = room.x + room.w / 2, tz = room.y + room.d / 2, s = Math.max(room.w, room.d);
      controls.target.set(tx, 30, tz);
      camera.position.set(tx - s * 0.55, s * 1.05, tz + s * 0.95);
    } else if (name === 'top') {
      controls.target.set(cx, 0, cz);
      camera.position.set(cx, R * 1.55, cz + 0.5);
    } else {
      controls.target.set(cx, 20, cz);
      camera.position.set(cx - R * 0.5, R * 1.1, cz + R * 1.2);
    }
    controls.update();
  }

  let lastW = 0, lastH = 0;
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h || (w === lastW && h === lastH)) return;
    lastW = w; lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);

  rebuild(); view('overview'); resize();
  renderer.setAnimationLoop(() => {
    if (!container.clientWidth) return;
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    view,
    set(key, value) { state[key] = value; rebuild(); },
    get: (key) => state[key],
  };
}
