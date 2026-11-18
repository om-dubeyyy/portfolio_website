/* omdubey.com · toon2 · hero lab
   Picks the hero (toon portrait or banner), runs its motion, and wires the switcher.
   #h-<name> in the address preselects one: cel, paint, manga, eyes, dock, wired, figma, glass. */
(() => {
  const root = document.documentElement, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOONS = ['lowpoly-b'], BANNERS = [], ALL = TOONS.concat(BANNERS);
  const W = window.OM_CONTENT || {};

  // a brand logo from the page's sprite, sized to its own viewBox
  const logo = id => {
    const s = document.getElementById('lg-' + id); if (!s) return '';
    const v = (s.getAttribute('viewBox') || '0 0 24 24').split(/\s+/).map(Number);
    return `<svg class="lg" viewBox="0 0 ${v[2]} ${v[3]}" aria-hidden="true"><use href="#lg-${id}"/></svg>`;
  };

  /* ---------- pick + switch ---------- */
  let cur = '';
  function set(h, scroll) {
    if (!ALL.includes(h)) h = 'lowpoly-b';
    cur = h; root.dataset.hero = h; root.classList.toggle('hb-on', BANNERS.includes(h));
    $$('#hbSwitch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.h === h)));
    if (scroll) scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    dispatchEvent(new Event('resize'));
  }
  set('lowpoly-b');

  /* ---------- toon portraits: tilt toward the cursor, eyes follow it (cel), hi on click ---------- */
  const stage = $('#toonStage'), fig = $('#toonFig');
  if (stage && fig) {
    setTimeout(() => { stage.classList.add('hello'); setTimeout(() => stage.classList.remove('hello'), 2600); }, 900);
    fig.addEventListener('click', () => {
      stage.classList.add('hi'); fig.style.setProperty('--ty', '-14px');
      setTimeout(() => fig.style.setProperty('--ty', '0px'), 240); setTimeout(() => stage.classList.remove('hi'), 1800);
    });
  }
  const svg = $('.eyes'), irises = svg ? $$('.iris', svg) : [];
  const look = (mx, my) => {
    if (!svg) return;
    const r = svg.getBoundingClientRect(); if (!r.width) return;
    const k = r.width / 896;
    irises.forEach(g => {
      const ex = +g.dataset.x, ey = +g.dataset.y;
      if (mx == null) { g.setAttribute('transform', `translate(${ex} ${ey})`); return; }
      const sx = r.left + ex * k, sy = r.top + ey * k, dx = mx - sx, dy = my - sy, d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 260);
      g.setAttribute('transform', `translate(${(ex + (dx / d) * 15 * reach).toFixed(1)} ${(ey + (dy / d) * 4.5 * reach).toFixed(1)})`);
    });
  };
  look();

  /* ---------- A · eye band: a skyline made of pipeline bars, a forecast line, glitch fragments ---------- */
  const ebIn = $('#ebIn');
  if (ebIn) {
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    let bars = '', x = 0;
    const cols = ['#5C6B7A', '#7D8A96', '#46525E', '#9AA6B1', '#36404A', '#6F7F8E'];
    while (x < 1000) {
      const w = 6 + rnd() * 16, h = 18 + Math.pow(rnd(), 1.4) * 70 + (Math.abs(x - 520) < 160 ? 14 : 0);
      bars += `<rect x="${x.toFixed(1)}" y="${(100 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${cols[Math.floor(rnd() * cols.length)]}"/>`;
      if (h > 50 && rnd() > 0.5) bars += `<rect x="${(x + 2).toFixed(1)}" y="${(100 - h + 4).toFixed(1)}" width="${(w - 4).toFixed(1)}" height="${(h - 8).toFixed(1)}" fill="url(#ebWin)" opacity=".55"/>`;
      x += w + 1 + rnd() * 3;
    }
    let pts = [], y = 70;
    for (let i = 0; i <= 20; i++) { y = Math.max(8, y - rnd() * 8 + 2.5); pts.push(`${i * 50},${y.toFixed(1)}`); }
    ebIn.innerHTML = `<svg viewBox="0 0 1000 100" preserveAspectRatio="none"><defs><pattern id="ebWin" width="4" height="5" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#E9F1F7"/></pattern></defs>
      <path d="M0 72 L120 40 L210 62 L330 30 L430 58 L560 26 L690 60 L820 34 L1000 64 L1000 100 L0 100Z" fill="#8FA3B5" opacity=".55"/>${bars}
      <polyline points="${pts.join(' ')}" fill="none" stroke="#E5402F" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;
    const frags = $('#ebFrags'); let f = '';
    const fc = ['#F2C230', '#E5402F', '#1E1E1E', '#FFFFFF', '#3E7FD6', '#B9C2C9', '#FF7A59'];
    for (let i = 0; i < 46; i++) {
      const side = rnd() < 0.5 ? -1 : 1, edge = side < 0 ? 12 - rnd() * 10 : 90 + rnd() * 9;
      const top = 20.5 + rnd() * 11.5;
      f += `<i style="--x:${(rnd() < 0.7 ? edge : 12 + rnd() * 78).toFixed(1)}%;--y:${top.toFixed(1)}%;--w:${(4 + rnd() * 28).toFixed(0)}px;--h:${(3 + rnd() * 9).toFixed(0)}px;--c:${fc[Math.floor(rnd() * fc.length)]};--t:${(1.6 + rnd() * 3).toFixed(1)}s;--dl:${(-rnd() * 3).toFixed(1)}s;--j:${(side * (4 + rnd() * 18)).toFixed(0)}px"></i>`;
    }
    frags.innerHTML = f;
  }

  /* ---------- B · desk mode: calendar, app tiles, dock ---------- */
  const cal = $('#dkCal');
  if (cal) {
    let h = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<span>${d}</span>`).join('');
    for (let d = 1; d <= 30; d++) h += `<span class="${d === 15 ? 't' : ''}">${d}</span>`; // 1 Nov 2026 is a Sunday
    cal.innerHTML = h;
    $$('.dk-ic[data-logo]').forEach(e => { e.innerHTML = logo(e.dataset.logo); });
    const apps = [['hubspot', 'HubSpot', 62, 14, 64, -6], ['claude', 'Claude', 64, 42, 58, 5], ['n8n', 'n8n', 38, 54, 52, -4], ['notion', 'Notion', 30, 16, 56, 6], ['apollo', 'Apollo', 37, 33, 48, -8], ['gong', 'Gong', 58, 64, 46, 7], ['googlesheets', 'Sheets', 25, 50, 44, -5]];
    $('#dkApps').innerHTML = apps.map(([id, name, l, t, sz, r], i) => `<span class="dk-app" data-d="${10 + i * 6}" style="left:${l}%;top:${t}%;--s:${sz}px;--r:${r}deg">${logo(id)}<em>${name}</em></span>`).join('');
    $('#dkDock').innerHTML = ['hubspot', 'claude', 'n8n', 'notion', 'apollo', 'gong', 'googlesheets', 'appsscript', 'lookerstudio', 'figma', 'linkedin'].map(id => `<span>${logo(id)}</span>`).join('');
  }

  /* ---------- E · glass cards orbiting ---------- */
  const ring = $('#glRing');
  let cards = [];
  if (ring) {
    const front = document.createElement('div'); front.className = 'gl-front'; ring.parentElement.appendChild(front);
    const work = (W.work || []).slice(0, 9);
    cards = work.map((w, i) => {
      const el = document.createElement('div'); el.className = 'gl-card';
      const b = w.band || ['#ccc', '#888', '#333'];
      el.innerHTML = `<span class="th" style="background:linear-gradient(135deg,${b[0]},${b[2]})"></span><div><b>${w.name}</b><small>${(w.cats || []).join(' · ') || 'project'}</small></div>`;
      el.style.setProperty('--y', [14, 32, 50][i % 3] + '%');
      ring.appendChild(el);
      return { el, a: (i / work.length) * Math.PI * 2 + (i % 3) * 0.5, front: false };
    });
    let spin = 0.0018, target = 0.0018;
    ring.parentElement.addEventListener('pointermove', e => { const r = ring.getBoundingClientRect(); target = ((e.clientX - r.left) / r.width - 0.5) * 0.012; });
    ring.parentElement.addEventListener('pointerleave', () => { target = 0.0018; });
    const tick = () => {
      if (cur === 'glass') {
        spin += (target - spin) * 0.05;
        const R = Math.min(520, innerWidth * 0.36);
        cards.forEach(c => {
          if (!RM) c.a += spin;
          const x = Math.sin(c.a) * R, z = Math.cos(c.a) * R * 0.6, isFront = z > 0;
          if (isFront !== c.front) { (isFront ? front : ring).appendChild(c.el); c.front = isFront; }
          c.el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-Math.sin(c.a) * 28).toFixed(1)}deg)`;
          c.el.style.opacity = (0.45 + 0.55 * (z / (R * 0.6) + 1) / 2).toFixed(2);
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- pointer: parallax for floating pieces, eyes, toon tilt, Figma cursor ---------- */
  const fgc = $('#fgCursor'), hb = $('#hb');
  let lx = null, ly = null;
  addEventListener('pointermove', e => {
    const mx = lx = e.clientX, my = ly = e.clientY, nx = mx / innerWidth - 0.5, ny = my / innerHeight - 0.5;
    look(mx, my);
    if (fig && !RM) { fig.style.setProperty('--ry', (nx * 14).toFixed(1) + 'deg'); fig.style.setProperty('--rx', (-ny * 6).toFixed(1) + 'deg'); }
    if (RM) return;
    $$('.hbv:not([style*="none"]) .fl, .dk-app').forEach(el => { const d = +el.dataset.d || 16; el.style.setProperty('--px', (-nx * d).toFixed(1) + 'px'); el.style.setProperty('--py', (-ny * d).toFixed(1) + 'px'); });
    if (ebIn) ebIn.style.setProperty('--bx', (-nx * 60).toFixed(0) + 'px');
    if (fgc && hb) { const r = hb.getBoundingClientRect(); fgc.style.setProperty('--cx', (mx - r.left + 10) + 'px'); fgc.style.setProperty('--cy', (my - r.top + 12) + 'px'); }
  }, { passive: true });
  addEventListener('scroll', () => look(lx, ly), { passive: true });
})();
