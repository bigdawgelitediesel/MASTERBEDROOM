import { plan } from './plan.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 150 -> 12' 6"
export function ft(inches) {
  const q = Math.round(inches * 4) / 4;
  const f = Math.floor(q / 12), i = +(q - f * 12).toFixed(2);
  return `${f}' ${i}"`;
}
const sqft = (r) => (r.w * r.d - (r.cut || 0)) / 144;
// a wall's name tags: either its single letter or its list of split pieces
const tagsOf = (w, L) => w.tags || (w.letter ? [{ letter: w.letter, len: w.len, at: L / 2, name: w.name }] : []);

// ---------- tabs ----------
let scene3d = null;
async function show(tab) {
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('on', p.id === 'p-' + tab));
  if (tab === '3d' && !scene3d) {
    try {
      const { createScene } = await import('./scene.js');
      scene3d = createScene($('#stage'), plan);
      $('#stage-msg').remove();
    } catch (e) {
      $('#stage-msg').textContent = 'The 3D view could not load on this device. The floor plan and measurements still work.';
      console.error(e);
    }
  }
  history.replaceState(null, '', '#' + tab);
}
document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));

// ---------- 3D controls ----------
const views = [['overview', 'Overview'], ['top', 'Top down'], ...plan.rooms.filter((r) => !r.quiet).map((r) => [r.id, r.name])];
$('#views').innerHTML = views.map(([id, n]) => `<button data-view="${id}">${esc(n)}</button>`).join('');
$('#views').addEventListener('click', (e) => {
  const v = e.target.dataset.view;
  if (v && scene3d) scene3d.view(v);
});
$('#toggles').addEventListener('click', (e) => {
  const k = e.target.dataset.toggle;
  if (!k || !scene3d) return;
  const v = !scene3d.get(k);
  scene3d.set(k, v);
  e.target.classList.toggle('on', v);
});

// ---------- 2D floor plan ----------
function drawPlan() {
  const t = plan.wallThickness;
  const xs = [], ys = [];
  for (const w of plan.walls) { xs.push(w.a[0], w.b[0]); ys.push(w.a[1], w.b[1]); }
  const M = 46 + t;
  const minX = Math.min(...plan.rooms.map((r) => r.x)), maxX = Math.max(...plan.rooms.map((r) => r.x + r.w));
  const minY = Math.min(...plan.rooms.map((r) => r.y)), maxY = Math.max(...plan.rooms.map((r) => r.y + r.d));
  let s = `<svg viewBox="${minX - M} ${minY - M} ${maxX - minX + M * 2} ${maxY - minY + M * 2}" xmlns="http://www.w3.org/2000/svg">`;

  for (const r of plan.rooms) {
    s += `<rect class="room ${r.floor || 'wood'}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.d}"/>`;
  }

  for (const f of plan.fixtures || []) {
    s += `<g transform="translate(${f.x} ${f.y}) rotate(${f.rot || 0})">` +
      `<rect class="fx" x="${-f.w / 2}" y="${-f.d / 2}" width="${f.w}" height="${f.d}" rx="2"/>` +
      `<line class="fxback" x1="${-f.w / 2}" y1="${-f.d / 2}" x2="${f.w / 2}" y2="${-f.d / 2}"/></g>` +
      `<text class="fxl" x="${f.x}" y="${f.y + 2}">${esc(f.name || f.type)}</text>`;
  }

  const corners = new Map();
  for (const w of plan.walls) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1], L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const P = (d, off = 0) => [w.a[0] + ux * d + nx * off, w.a[1] + uy * d + ny * off];
    const seg = (d0, d1) => {
      if (d1 - d0 < 0.01) return;
      const [x1, y1] = P(d0), [x2, y2] = P(d1);
      s += `<line class="wall" stroke-width="${t}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    };
    let cur = 0;
    for (const o of [...(w.openings || [])].sort((a, b) => a.at - b.at)) {
      seg(cur, o.at);
      const [x1, y1] = P(o.at), [x2, y2] = P(o.at + o.w);
      if (o.type === 'window') {
        s += `<line class="win" stroke-width="${t}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` +
          `<line class="winc" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      } else if (o.type === 'door') {
        const sw = o.swing === -1 ? -1 : 1;
        const [ex, ey] = P(o.at, o.w * sw);
        s += `<path class="swing" d="M${x1} ${y1} L${ex} ${ey} A${o.w} ${o.w} 0 0 ${sw === 1 ? 0 : 1} ${x2} ${y2}"/>`;
      }
      if (o.label) {
        const [tx, ty] = P(o.at + o.w / 2, (o.swing === -1 ? 1 : -1) * (t / 2 + 8));
        s += `<text class="olabel" x="${tx}" y="${ty + 2}">${esc(o.label)}</text>`;
      }
      cur = o.at + o.w;
    }
    seg(cur, L);
    for (const p of [w.a, w.b]) corners.set(p.join(','), p);
  }
  for (const p of corners.values()) {
    s += `<rect class="corner" x="${p[0] - t / 2}" y="${p[1] - t / 2}" width="${t}" height="${t}"/>`;
  }

  for (const r of plan.rooms) {
    if (r.quiet) continue;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.d * (r.labelY || 0.5);
    s += `<text class="rname" x="${cx}" y="${cy - 2}">${esc((r.label || r.name).toUpperCase())}</text>`;
    if (r.w < 90) {
      s += `<text class="rdim" x="${cx}" y="${cy + 8}">${ft(r.w)} x ${ft(r.d)}</text><text class="rdim" x="${cx}" y="${cy + 16}">${sqft(r).toFixed(0)} sq ft</text>`;
    } else {
      s += `<text class="rdim" x="${cx}" y="${cy + 8}">${ft(r.w)} x ${ft(r.d)}  ·  ${sqft(r).toFixed(0)} sq ft</text>`;
    }
  }

  // wall letters, just inside each wall
  const pcx = (minX + maxX) / 2, pcy = (minY + maxY) / 2;
  for (const w of plan.walls) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1], L = Math.hypot(dx, dy);
    for (const tg of tagsOf(w, L)) {
    const mx = w.a[0] + dx * tg.at / L, my = w.a[1] + dy * tg.at / L;
    let nx = -dy / L, ny = dx / L;
    const home = plan.rooms.find((r) => r.id === w.room);
    const hx = home ? home.x + home.w / 2 : pcx, hy = home ? home.y + home.d / 2 : pcy;
    if (nx * (hx - mx) + ny * (hy - my) < 0) { nx = -nx; ny = -ny; }
    const lx = mx + nx * 17, ly = my + ny * 17;
    if (tg.letter.length > 2) {
      const pw = tg.letter.length * 6.2 + 12;
      s += `<rect class="wtag" x="${lx - pw / 2}" y="${ly - 7.5}" width="${pw}" height="15" rx="7.5"/><text class="wtagt" x="${lx}" y="${ly + 3.2}">${esc(tg.letter)}</text>`;
    } else {
      s += `<circle class="wtag" cx="${lx}" cy="${ly}" r="${tg.letter.length > 1 ? 9.5 : 8}"/><text class="wtagt" x="${lx}" y="${ly + 3.6}">${esc(tg.letter)}</text>`;
    }
    if (tg.len) s += `<text class="wlen" x="${lx}" y="${ly + (Math.abs(ny) > 0.5 ? ny : 1) * 15 + 2.2}">${ft(tg.len)}</text>`;
    }
  }

  // overall dimensions
  const dy = minY - 24, dx = minX - 24;
  s += `<line class="dim" x1="${minX}" y1="${dy}" x2="${maxX}" y2="${dy}"/>` +
    `<line class="dim" x1="${minX}" y1="${dy - 5}" x2="${minX}" y2="${dy + 5}"/><line class="dim" x1="${maxX}" y1="${dy - 5}" x2="${maxX}" y2="${dy + 5}"/>` +
    `<text class="dimt" x="${(minX + maxX) / 2}" y="${dy - 6}">${ft(maxX - minX)}</text>` +
    `<line class="dim" x1="${dx}" y1="${minY}" x2="${dx}" y2="${maxY}"/>` +
    `<line class="dim" x1="${dx - 5}" y1="${minY}" x2="${dx + 5}" y2="${minY}"/><line class="dim" x1="${dx - 5}" y1="${maxY}" x2="${dx + 5}" y2="${maxY}"/>` +
    `<text class="dimt" transform="translate(${dx - 6} ${(minY + maxY) / 2}) rotate(-90)">${ft(maxY - minY)}</text>`;

  $('#plan').innerHTML = s + '</svg>';
}

// ---------- measurements ----------
function drawTables() {
  const listed = plan.rooms.filter((r) => !r.hide);
  const total = listed.reduce((a, r) => a + sqft(r), 0);
  let h = `<h2>Rooms</h2><div class="scroll"><table><tr><th>Room</th><th>Width</th><th>Depth</th><th>Area</th><th>Floor</th></tr>`;
  for (const r of listed) {
    h += `<tr><td>${esc(r.name)}</td><td>${ft(r.w)}</td><td>${ft(r.d)}</td><td>${sqft(r).toFixed(1)} sq ft</td><td>${esc(r.floor || '')}</td></tr>`;
  }
  h += `<tr class="total"><td>Total</td><td></td><td></td><td>${total.toFixed(1)} sq ft</td><td></td></tr></table></div>`;
  h += `<p class="meta">Ceiling height ${ft(plan.ceiling)}. Wall thickness ${plan.wallThickness}".</p>`;

  const lettered = plan.walls.flatMap((w) => tagsOf(w, 0).map((tg) => ({ letter: tg.letter, len: tg.len, name: tg.name || w.name })));
  if (lettered.length) {
    h += `<h2>Walls</h2><div class="scroll"><table><tr><th>Wall</th><th>Where</th><th>Length</th><th>Inches</th><th>Height</th></tr>`;
    for (const w of lettered) {
      h += `<tr><td><b>${esc(w.letter)}</b></td><td>${esc(w.name || '')}</td><td>${w.len ? ft(w.len) : ''}</td><td>${w.len ? w.len + '"' : ''}</td><td>${ft(plan.ceiling)}</td></tr>`;
    }
    h += `</table></div>`;
  }

  h += `<h2>Doors and windows</h2><div class="scroll"><table><tr><th>Wall</th><th>Type</th><th>Width</th><th>Height</th><th>Sill</th><th>From wall start</th></tr>`;
  for (const w of plan.walls) for (const o of w.openings || []) {
    h += `<tr><td>${esc(w.letter ? 'Wall ' + w.letter : w.tags ? 'Wall ' + w.tags[0].letter.replace(/\d+$/, '') : w.name || '')}</td><td>${esc(o.name || o.type)}</td><td>${ft(o.w)}</td><td>${ft(o.h)}</td><td>${o.type === 'window' ? ft(o.sill || 0) : ''}</td><td>${ft(o.at)}</td></tr>`;
  }
  h += `</table></div>`;

  h += `<h2>Fixtures and furniture</h2><div class="scroll"><table><tr><th>Item</th><th>Width</th><th>Depth</th><th>Height</th><th>Notes</th></tr>`;
  for (const f of plan.fixtures || []) h += `<tr><td>${esc(f.name || f.type)}</td><td>${f.w}"</td><td>${f.d}"</td><td>${f.h ? f.h + '"' : ''}</td><td class="wrap">${esc(f.note || '')}</td></tr>`;
  h += `</table></div>`;
  $('#tables').innerHTML = h;
}

// ---------- boot ----------
document.title = plan.name;
$('#title').textContent = plan.name;
if (plan.note) { $('#banner').textContent = plan.note; $('#banner').hidden = false; }
drawPlan();
drawTables();
const start = location.hash.slice(1);
show(['3d', 'plan', 'measure'].includes(start) ? start : '3d');
