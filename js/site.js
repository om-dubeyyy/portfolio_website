/* omdubey.com · page logic (from the Clean Sheet sample). A classic script, so it also runs from file:// and in a sandboxed frame.
   Order: helpers · theme · clipboard · nav, rail and sheet · memoji · headline · hero lens · statement ·
   work (filters, views, live mini UIs) · how tiles · ask · about tiles · tables · stack graph · kind words ·
   agent view · one rAF loop · boot. Copy lives in js/content.js; the Markdown version is built by js/agent.js. */
(function () {
'use strict';

/* =====================================================================
   CONTENT: every word the script renders comes from js/content.js
   ===================================================================== */
const C = window.OM_CONTENT;
const EMAIL = C.email, D = C.person, CATS = C.cats, WORK = C.work;

/* =====================================================================
   HELPERS
   ===================================================================== */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = t => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const between = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const wait = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
const DPR = () => Math.min(2, window.devicePixelRatio || 1);
const cssv = n => getComputedStyle(root).getPropertyValue(n).trim();
const vw = () => window.innerWidth;

// cancellable sleeps for the mini UI loops
const STOP = { stop: true };
const token = () => ({ dead: false, pend: new Set() });
const sleep = (ms, tk) => new Promise((res, rej) => {
  if (tk.dead) { rej(STOP); return; }
  const p = { rej };
  p.id = setTimeout(() => { tk.pend.delete(p); tk.dead ? rej(STOP) : res(); }, ms);
  tk.pend.add(p);
});
const kill = tk => { if (!tk) return; tk.dead = true; tk.pend.forEach(p => { clearTimeout(p.id); p.rej(STOP); }); tk.pend.clear(); };

/* =====================================================================
   ONE rAF LOOP (memoji, lens, dot tiles, graph)
   ===================================================================== */
const Loop = (() => {
  const jobs = []; let raf = 0, last = 0;
  function tick(t) {
    raf = 0; const dt = last ? Math.min(48, t - last) : 16; last = t; let more = false;
    for (let i = 0; i < jobs.length; i++) { try { if (jobs[i](t, dt)) more = true; } catch (e) { console.error(e); } }
    if (more) kick(); else last = 0;
  }
  function kick() { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else kick(); });
  return { add(fn) { jobs.push(fn); }, kick };
})();

/* =====================================================================
   THEME
   ===================================================================== */
const themeHooks = [];
const mqDark = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : mqDark.matches);
function onTheme() {
  const b = $('#themeBtn'); if (b) b.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  const m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', isDark() ? '#0A0A0A' : '#FFFFFF');
  themeHooks.forEach(f => { try { f(); } catch (e) { console.error(e); } });
}
function setTheme(t) { root.dataset.theme = t; try { localStorage.setItem('om-theme', t); } catch (e) { /* storage blocked */ } onTheme(); }
if (mqDark.addEventListener) mqDark.addEventListener('change', () => { if (!root.dataset.theme) onTheme(); });

/* =====================================================================
   CLIPBOARD + TOAST
   ===================================================================== */
const toast = document.createElement('div'); toast.className = 'gtoast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
let toastT = 0;
function say(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 1700); }
async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* refused: try the old way */ }
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand && document.execCommand('copy'); ta.remove(); return !!ok;
  } catch (e) { return false; }
}
function selectEmail() {
  const m = $('#mail'); if (!m) return;
  const sel = getSelection(); const r = document.createRange(); r.selectNodeContents(m); sel.removeAllRanges(); sel.addRange(r);
}
function flash(el, text, ms) {
  if (!el) return; if (el.dataset.orig === undefined) el.dataset.orig = el.textContent;
  el.textContent = text; clearTimeout(el._t); el._t = setTimeout(() => { el.textContent = el.dataset.orig; }, ms || 1600);
}
async function copyEmail(labelEl) {
  const ok = await copyText(EMAIL);
  const labelShown = labelEl && labelEl.offsetParent !== null;
  if (ok) { flash(labelEl, 'Copied'); if (!labelShown) say('Email copied: ' + EMAIL); return true; }
  go('#contact'); setTimeout(selectEmail, RM ? 0 : 650); flash(labelEl, 'Selected below'); say('Email selected below');
  return false;
}

/* =====================================================================
   NAV: pill, rail, sheet, scroll spy, anchors
   ===================================================================== */
const SECS = C.sections;
const NAVS = C.nav;
const pill = $('#pill'), hl = $('#pillHl'), rail = $('#rail'), sheet = $('#sheet'), menuBtn = $('#menuBtn');
const pis = $$('.pi[data-sec]', pill);
let navCur = 0, secCur = 0;

rail.innerHTML = SECS.map(([id, name]) => `<a href="#${id}" aria-label="Jump to ${esc(name)}"><i></i><span>${esc(name)}</span></a>`).join('');
const rails = $$('a', rail);
$('#sheetNav').innerHTML = SECS.map(([id, name]) => `<a href="#${id}">${esc(name)}<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a>`).join('');

function placeHL() {
  const a = pis[navCur];
  if (!a || !a.offsetWidth) { hl.style.opacity = '0'; return; }
  hl.style.opacity = '1'; hl.style.width = a.offsetWidth + 'px'; hl.style.transform = `translateX(${a.offsetLeft}px)`;
}
let hlRaf = 0;
function followHL(ms) { const end = performance.now() + ms; cancelAnimationFrame(hlRaf); const f = () => { placeHL(); if (performance.now() < end) hlRaf = requestAnimationFrame(f); }; f(); }

function spy() {
  const line = innerHeight * 0.38;
  let s = 0; SECS.forEach(([id], i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) s = i; });
  let n = 0; NAVS.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) n = i; });
  if (s !== secCur || !rails[secCur].classList.contains('on')) {
    secCur = s;
    rails.forEach((a, i) => { const d = Math.abs(i - s); a.classList.toggle('on', d === 0); a.classList.toggle('d1', d === 1); a.classList.toggle('d2', d === 2); if (d === 0) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  if (n !== navCur) { navCur = n; pis.forEach((a, i) => { a.classList.toggle('on', i === n); if (i === n) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); placeHL(); }
  root.classList.toggle('scrolled', scrollY > 40);
  const hero = $('#top');
  const open = vw() >= 1000 && scrollY > hero.offsetHeight - 160;
  if (open !== pill.classList.contains('open')) { pill.classList.toggle('open', open); followHL(420); }
}
let spyRaf = 0;
addEventListener('scroll', () => { if (!spyRaf) spyRaf = requestAnimationFrame(() => { spyRaf = 0; spy(); Statement.update(); }); }, { passive: true });

function go(hash, smoothScroll) {
  const id = hash.replace('#', '');
  if (id === 'agent') { Agent.open(); return; }
  const el = document.getElementById(id); if (!el) return;
  const y = id === 'top' ? 0 : el.getBoundingClientRect().top + scrollY - (vw() < 760 ? 0 : 8);
  scrollTo({ top: Math.max(0, y), behavior: smoothScroll === false || RM ? 'auto' : 'smooth' });
  try { history.replaceState(null, '', id === 'top' ? location.pathname + location.search : '#' + id); } catch (e) { /* sandbox */ }
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute('href'); if (!h || h.length < 2) return;
  e.preventDefault(); if (sheet.contains(a)) closeSheet(false);
  go(h);
});

function openSheet() {
  sheet.hidden = false; menuBtn.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => { sheet.classList.add('on'); const f = $('#sheetNav a', sheet); if (f) f.focus(); });
}
function closeSheet(refocus) {
  if (sheet.hidden) return; sheet.classList.remove('on'); menuBtn.setAttribute('aria-expanded', 'false');
  setTimeout(() => { sheet.hidden = true; }, RM ? 0 : 260); if (refocus !== false) menuBtn.focus();
}
menuBtn.addEventListener('click', openSheet);
sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });

$('#ctaCopy').addEventListener('click', () => copyEmail($('#ctaLabel')));
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (b) { copyEmail(b.querySelector('span')); return; }
  const l = e.target.closest('[data-copy-link]'); if (l) copyText(EMAIL).then(ok => { if (ok) say('Email copied: ' + EMAIL); });
});
$('#chatFab').addEventListener('click', () => {
  go('#ask');
  const inp = $('#askInput'); setTimeout(() => inp.focus({ preventScroll: true }), RM ? 0 : 700);
});
$('#themeBtn').addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));

/* =====================================================================
   MEMOJI: wave, blink, eyes follow the cursor, brows lift
   ===================================================================== */
const Mj = (() => {
  const svg = $('#memoji'); if (!svg) return { look() {}, hello() {}, brows() {}, tap() {}, active: false, job() { return false; } };
  const head = $('#mjHead'), feat = $('#mjFeat'), brows = $('#mjBrows'), hand = $('#mjHand'), eyeL = $('#mjEyeL'), eyeR = $('#mjEyeR');
  const pupils = $$('.mj-pupil', svg);
  const S = { px: 0, py: 0, tx: 0, ty: 0, turn: 0, tturn: 0, brow: 0, tbrow: 0, blink: -1, nextBlink: 0, wave: -1, wAmp: 14, wN: 3, wDur: 1200, last: 0, back: 0 };
  const M = { active: false };
  let prev = '';
  M.look = (cx, cy) => {
    if (RM) return;
    const r = svg.getBoundingClientRect(); if (!r.width) return;
    const k = r.width / 380, ex = r.left + 114.5 * k, ey = r.top + 128 * k;
    const dx = cx - ex, dy = cy - ey, d = Math.hypot(dx, dy) || 1, f = Math.min(1, d / (200 * k));
    S.tx = dx / d * 5.2 * f; S.ty = dy / d * 4.2 * f;
    S.tturn = clamp(dx / (700 * k), -1, 1) * 3; S.last = performance.now(); S.back = 0;
    Loop.kick();
  };
  M.tap = (cx, cy) => { M.look(cx, cy); S.back = performance.now() + 1600; };
  M.hello = () => { if (!RM) { S.wave = performance.now(); S.wAmp = 14; S.wN = 3; S.wDur = 1200; S.last = performance.now(); Loop.kick(); } };
  M.brows = v => { S.tbrow = v; Loop.kick(); };
  M.job = t => {
    if (!M.active) return false;
    if (!S.nextBlink) S.nextBlink = t + 2200 + Math.random() * 2500;
    if (!S.last) S.last = t;
    if (S.back && t > S.back) { S.tx = 0; S.ty = 0; S.tturn = 0; S.back = 0; }
    // blink every 3-7 s
    if (!RM && S.blink < 0 && t > S.nextBlink) S.blink = t;
    let bl = 1;
    if (S.blink >= 0) { const p = Math.max(0, (t - S.blink) / 170); if (p >= 1) { S.blink = -1; S.nextBlink = t + between(3000, 7000); } else bl = 1 - 0.92 * Math.sin(Math.PI * p); }
    // idle 9 s: a small wave again
    if (!RM && S.wave < 0 && t - S.last > 9000) { S.wave = t; S.wAmp = 10; S.wN = 2; S.wDur = 950; S.last = t; }
    let wa = 0;
    if (S.wave >= 0) { const p = clamp((t - S.wave) / S.wDur, 0, 1); if (p >= 1) S.wave = -1; else wa = S.wAmp * Math.sin(Math.PI * 2 * S.wN * p) * Math.pow(Math.max(0, Math.sin(Math.PI * p)), 0.6); }
    const e = 0.14;
    S.px += (S.tx - S.px) * e; S.py += (S.ty - S.py) * e; S.turn += (S.tturn - S.turn) * 0.08; S.brow += (S.tbrow - S.brow) * 0.2;
    const fx = S.turn * 0.9, fy = S.py * 0.25;
    const key = [S.px, S.py, S.turn, S.brow, bl, wa].map(v => v.toFixed(2)).join();
    if (key !== prev) {
      prev = key;
      head.setAttribute('transform', `translate(114.5 135.5) rotate(-7.4) rotate(${S.turn.toFixed(2)} 0 100)`);
      feat.setAttribute('transform', `translate(${fx.toFixed(2)} ${fy.toFixed(2)})`);
      pupils.forEach(p => p.setAttribute('transform', `translate(${S.px.toFixed(2)} ${S.py.toFixed(2)})`));
      brows.setAttribute('transform', `translate(0 ${(-5 * S.brow).toFixed(2)})`);
      eyeL.setAttribute('transform', `translate(0 0) translate(-35 0) scale(1 ${bl.toFixed(3)}) translate(35 0)`);
      eyeR.setAttribute('transform', `translate(36 0) scale(1 ${bl.toFixed(3)}) translate(-36 0)`);
      hand.setAttribute('transform', `rotate(${wa.toFixed(2)} 301 190)`);
    }
    return true;
  };
  Loop.add(M.job);
  svg.addEventListener('click', () => { if (!RM && S.wave < 0) { S.wave = performance.now(); S.wAmp = 14; S.wN = 3; S.wDur = 1200; Loop.kick(); } });
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { M.active = es[0].isIntersecting; if (M.active) Loop.kick(); }).observe(svg);
  return M;
})();
const cta = $('#ctaCopy');
['pointerenter', 'focus'].forEach(ev => cta.addEventListener(ev, () => Mj.brows(1)));
['pointerleave', 'blur'].forEach(ev => cta.addEventListener(ev, () => Mj.brows(0)));
addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') Mj.look(e.clientX, e.clientY); }, { passive: true });
addEventListener('pointerdown', e => { if (e.pointerType === 'touch') Mj.tap(e.clientX, e.clientY); }, { passive: true });

/* =====================================================================
   HEADLINE: two lines, blur out and in every 3.2 s
   ===================================================================== */
const H1 = (() => {
  const el = $('#h1v');
  const P = C.headline;
  let i = 0, timer = 0, visible = true, started = false;
  const layer = pair => '<span class="lay">' + pair.map(l => '<span class="ln">' + Array.from(l).map((c, j) => `<span class="ch" style="transition-delay:${j * 16}ms">${c === ' ' ? ' ' : esc(c)}</span>`).join('') + '</span>').join('') + '</span>';
  // the outgoing phrase blurs out while the next one blurs in over it, so the line is never empty
  function next() {
    if (!visible || document.hidden) return;
    const old = $('.lay', el); i = (i + 1) % P.length;
    el.insertAdjacentHTML('beforeend', layer(P[i]));
    const nw = el.lastElementChild; nw.classList.add('out', 'over'); void nw.offsetWidth;
    if (old) old.classList.add('out');
    setTimeout(() => nw.classList.remove('out'), 200);
    setTimeout(() => { if (old) old.remove(); nw.classList.remove('over'); }, 1000);
  }
  function intro() {
    el.innerHTML = layer(P[0]);
    if (RM) return;
    const l = $('.lay', el); l.classList.add('out'); void l.offsetWidth;
    setTimeout(() => l.classList.remove('out'), 120);
    started = true; timer = setInterval(next, 3200);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(el);
  return { intro, get i() { return i; }, get started() { return started; } };
})();

/* =====================================================================
   HERO LENS: a faint dot grid that swells into a diamond near the cursor
   ===================================================================== */
const Lens = (() => {
  const hero = $('#top'), cv = $('#lens'); const ctx = cv.getContext('2d');
  const PITCH = 22, R0 = 0.8, RAD = 180;
  let W = 0, H = 0, dpr = 1, base = null, rgb = '10,10,10', on = false, dirty = true;
  const S = { x: -999, y: -999, tx: -999, ty: -999, a: 0, ta: 0 };
  const fade = y => { const t = y / H; return t < 0.5 ? 1 : Math.max(0, 1 - (t - 0.5) / 0.5); };
  function build() {
    rgb = cssv('--dotrgb') || '10,10,10';
    base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
    const b = base.getContext('2d'); b.scale(dpr, dpr);
    const a0 = vw() < 760 ? 0.07 : 0.11;
    for (let y = PITCH / 2; y < H; y += PITCH) {
      const a = a0 * fade(y); if (a < 0.004) continue; b.fillStyle = `rgba(${rgb},${a.toFixed(3)})`; b.beginPath();
      for (let x = PITCH / 2; x < W; x += PITCH) { b.moveTo(x + R0, y); b.arc(x, y, R0, 0, 6.2832); }
      b.fill();
    }
    dirty = true;
  }
  function resize() {
    W = hero.clientWidth; H = hero.clientHeight; dpr = DPR(); if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); build(); draw();
  }
  function draw() {
    if (!base) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(base, 0, 0);
    if (S.a < 0.01) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gx0 = Math.max(0, Math.floor((S.x - RAD) / PITCH)), gx1 = Math.ceil((S.x + RAD) / PITCH);
    const gy0 = Math.max(0, Math.floor((S.y - RAD) / PITCH)), gy1 = Math.ceil((S.y + RAD) / PITCH);
    for (let gy = gy0; gy <= gy1; gy++) {
      const y = gy * PITCH + PITCH / 2; if (y > H) break; const fy = fade(y); if (fy < 0.02) continue;
      for (let gx = gx0; gx <= gx1; gx++) {
        const x = gx * PITCH + PITCH / 2; if (x > W) break;
        const d = Math.abs(x - S.x) + Math.abs(y - S.y); if (d >= RAD) continue;
        const s = smooth(1 - d / RAD) * S.a; if (s < 0.02) continue;
        const r = R0 + 2.1 * s, al = (0.11 + 0.5 * s) * fy;
        ctx.fillStyle = `rgba(${rgb},${al.toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      }
    }
  }
  const L = {
    point(cx, cy) { if (RM || !FINE || !on) return; const r = hero.getBoundingClientRect(); S.tx = cx - r.left; S.ty = cy - r.top; if (S.x < -900) { S.x = S.tx; S.y = S.ty; } S.ta = (S.ty > 0 && S.ty < H) ? 1 : 0; dirty = true; Loop.kick(); },
    leave() { S.ta = 0; dirty = true; Loop.kick(); },
    job() {
      if (!on || !dirty) return false;
      S.x += (S.tx - S.x) * 0.16; S.y += (S.ty - S.y) * 0.16; S.a += (S.ta - S.a) * 0.09;
      draw();
      const moving = Math.abs(S.tx - S.x) > 0.3 || Math.abs(S.ty - S.y) > 0.3 || Math.abs(S.ta - S.a) > 0.005;
      if (!moving) dirty = false; return moving;
    },
    resize, rebuild() { if (W) { build(); draw(); } }
  };
  Loop.add(L.job);
  themeHooks.push(L.rebuild);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { on = es[0].isIntersecting; }).observe(hero);
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') L.point(e.clientX, e.clientY); }, { passive: true });
  addEventListener('mouseout', e => { if (!e.relatedTarget) L.leave(); });
  return L;
})();

/* =====================================================================
   STATEMENT: words sharpen out of a blur as it scrolls through
   ===================================================================== */
const Statement = (() => {
  const st = $('#statement'); const words = st.textContent.trim().split(/\s+/);
  st.innerHTML = words.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  const ws = $$('.w', st); let last = -1;
  function update() {
    if (true) { /* look: no scroll reveal */ if (last !== 1) { ws.forEach(w => { w.style.filter = 'none'; w.style.opacity = '1'; }); last = 1; } return; }
    const r = st.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -50 || r.top > vh + 50) return;
    const span = vh * 0.62, tail = r.height * 0.35;
    const p = clamp((vh * 0.9 - r.top) / (span + tail), 0, 1);
    if (Math.abs(p - last) < 0.002) return; last = p;
    const n = ws.length;
    ws.forEach((w, i) => {
      const s = smooth(clamp((p - (i / n) * 0.72) / 0.28, 0, 1));
      w.style.filter = s > 0.995 ? 'none' : `blur(${((1 - s) * 7).toFixed(2)}px)`;
      w.style.opacity = lerp(0.14, 1, s).toFixed(3);
    });
  }
  return { update };
})();

/* =====================================================================
   WORK: showcase, more rows, grid, filters, live mini UIs
   ===================================================================== */
const SPIN = '<svg viewBox="0 0 16 16" aria-hidden="true">' + Array.from({ length: 8 }, (_, i) => {
  const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a), f = v => v.toFixed(2);
  const O = 8, x1 = f(O + c * 3.4), y1 = f(O + s * 3.4), x2 = f(O + c * 6.6), y2 = f(O + s * 6.6), op = f(lerp(0.22, 1, i / 7));
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" opacity="${op}"/>`;
}).join('') + '</svg>';
const DISC = '<span class="disc" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="11.5" r="2"/><circle cx="26.5" cy="14.5" r="1.6"/><circle cx="14.5" cy="16" r="1.9"/><circle cx="23" cy="21" r="2.1"/><circle cx="16.5" cy="25" r="1.7"/><circle cx="27" cy="27" r="1.6"/><circle cx="19.5" cy="30.5" r="1.9"/></svg></span>';
const icon = (id, cls) => `<svg class="${cls || 'uic'}" aria-hidden="true"><use href="#${id}"/></svg>`;
const bandStyle = w => `--b1:${w.band[0]};--b2:${w.band[1]};--b3:${w.band[2]}`;

function caseHTML(w) {
  const pillHTML = w.url
    ? `<a class="pill-dark" href="${w.url}" target="_blank" rel="noopener" aria-label="Read the ${esc(w.name)} case study on Notion (opens in a new tab)">${DISC}<span>Read the case study</span></a>`
    : `<span class="pill-dark" aria-disabled="true">${DISC}<span>Case study soon</span></span>`;
  return `<article class="case ruled" id="case-${w.id}" data-id="${w.id}" aria-labelledby="ct-${w.id}">
  <div class="wrap">
    <h3 class="case-title" id="ct-${w.id}">${esc(w.title)}</h3>
    <p class="tags">${w.tags.map(t => `<span>${esc(t)}</span>`).join('')}</p>
    <div class="case-pair">
      <figure class="media" style="${bandStyle(w)}">
        <div class="band" aria-hidden="true"></div>
        <div class="media-in">
          <div class="app" role="img" aria-label="${esc(w.alt)}"><div class="screen" aria-hidden="true"></div></div>
          <div class="prompt-row" aria-hidden="true"><div class="prompt"><span class="pt"></span><span class="caret"></span></div><span class="spin">${SPIN}</span></div>
        </div>
        <figcaption class="media-cap"><b>${esc(w.cap.name)}</b><span>${esc(w.cap.cat)}</span><span>${esc(w.cap.year)}</span></figcaption>
      </figure>
      <div class="case-card">
        <blockquote class="qbox">${esc(w.quote)}</blockquote>
        <div class="case-meta"><p class="role">${esc(w.meta)}</p><p class="line">${esc(w.line)}</p>${pillHTML}</div>
      </div>
    </div>
    ${(w.smalls || []).length ? `<ul class="smalls" style="--n:${w.smalls.length}">${w.smalls.map(s => `<li class="small">${icon(s[0], 'ic')}<h4>${esc(s[1])}</h4><p>${esc(s[2])}</p></li>`).join('')}</ul>` : ''}
  </div>
</article>`;
}
function mrowHTML(w) {
  return `<li class="mrow" data-id="${w.id}"><a href="${w.url}" target="_blank" rel="noopener"><b>${esc(w.name)}</b><span>${esc(w.line)}</span><em>${esc(w.year)}</em>${icon('i-arrow', 'ic')}</a></li>`;
}
function gcardHTML(w) {
  const inner = `<div class="gmedia" style="${bandStyle(w)}"><div class="band" aria-hidden="true"></div><div class="app" role="img" aria-label="${esc(w.alt)}"><div class="screen" aria-hidden="true"></div></div></div>
    <div class="gmeta"><h3>${esc(w.name)}</h3><span>${esc(w.gyear)}</span></div><p class="tags">${w.tags.map(t => `<span>${esc(t)}</span>`).join('')}</p>${w.url ? '' : '<p class="soon">Case study soon</p>'}`;
  return w.url ? `<a class="gcard" data-id="${w.id}" href="${w.url}" target="_blank" rel="noopener">${inner}</a>` : `<div class="gcard" data-id="${w.id}">${inner}</div>`;
}

/* prompt controller for one media card */
function promptCtl(row) {
  if (!row) return { set() {}, clear() {}, busy() {}, type() { return Promise.resolve(); } };
  const field = $('.prompt', row), txt = $('.pt', row), spin = $('.spin', row);
  return {
    set(t) { txt.textContent = t; },
    clear() { txt.textContent = ''; field.classList.remove('typing'); },
    busy(b) { spin.classList.toggle('busy', !!b); },
    async type(t, tk, ms) { field.classList.add('typing'); txt.textContent = ''; for (const ch of Array.from(t)) { txt.textContent += ch; await sleep(ms || 42, tk); } field.classList.remove('typing'); }
  };
}
const NOPROMPT = promptCtl(null);

/* ---------- the mini UIs, each 520×340 ---------- */
const MINI = {
  lucidity(sc) {
    const d = i => `style="animation-delay:${i * 140}ms"`;
    sc.innerHTML = `<div class="ui ui-luc"><div class="top"><i></i><i></i><i></i><span class="sk pulse" ${d(0)}></span></div>
      <div class="body"><aside><span class="sk pulse w80" ${d(1)}></span><span class="sk pulse w60" ${d(2)}></span><span class="sk pulse w70" ${d(3)}></span><span class="sk pulse w50" ${d(4)}></span><span class="sk pulse w60" ${d(5)}></span></aside>
      <main><span class="sk pulse w40" style="height:12px"></span><div class="cards"><span class="sk pulse" ${d(2)}></span><span class="sk pulse" ${d(3)}></span><span class="sk pulse" ${d(4)}></span></div>
      <span class="sk pulse w90" ${d(5)}></span><span class="sk pulse w80" ${d(6)}></span><span class="sk pulse w85" ${d(7)}></span><span class="sk pulse w60" ${d(8)}></span></main></div>
      <p class="note">Case studies on the way.</p></div>`;
    return {
      prompt: 'Writing these up…', hold: 400,
      reset() {},
      async run(tk, P) { await P.type('Writing these up…', tk, 55); P.busy(true); await sleep(6400, tk); P.busy(false); },
      final(P) { P.set('Writing these up…'); P.busy(!RM); }
    };
  },

  whatsapp(sc) {
    sc.innerHTML = `<div class="ui ui-chat">
      <aside class="list"><p class="hd u-mono">Inbox</p>
        <div class="ci on"><span class="av">C</span><span class="ls"><b>Customer</b><span class="sk w70"></span></span></div>
        <div class="ci"><span class="av"></span><span class="ls"><span class="sk w60"></span><span class="sk w80"></span></span></div>
        <div class="ci"><span class="av"></span><span class="ls"><span class="sk w50"></span><span class="sk w70"></span></span></div>
        <div class="ci"><span class="av"></span><span class="ls"><span class="sk w60"></span><span class="sk w55"></span></span></div>
        <div class="ci"><span class="av"></span><span class="ls"><span class="sk w70"></span><span class="sk w40"></span></span></div></aside>
      <section class="thread"><header class="th"><span class="av">S</span><div><b>Store support</b><span class="u-mono">automated · hands off to a person</span></div></header>
        <div class="msgs"><div class="stack"></div></div></section></div>`;
    const stack = $('.stack', sc);
    const EX = [
      ["Where's my order?", `It's out for delivery today.<div class="track"><i></i>Packed<em></em><i></i>Shipped<em></em><i class="o"></i>Out for delivery</div><div class="row"><span class="ichip out">Today, 10:42</span></div>`],
      ['Can I return this?', `Yes. Pick a reason and I'll book a pickup.<div class="row"><span class="ichip out">Wrong size</span><span class="ichip out">Changed my mind</span></div>`],
      ['Change my address', `Done. Your new address is confirmed. ${icon('i-check')}`]
    ];
    const add = (cls, html) => { const b = document.createElement('div'); b.className = cls + ' pop'; b.innerHTML = html; stack.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); return b; };
    const handoff = () => add('ichip out handoff', `${icon('i-person')}Connect agent`);
    return {
      prompt: "Where's my order?", hold: 2200,
      reset() { stack.innerHTML = ''; },
      async run(tk, P) {
        for (const [q, a] of EX) {
          await P.type(q, tk); P.busy(true); await sleep(260, tk);
          add('bub me', esc(q)); P.clear(); await sleep(240, tk);
          const ty = add('typing', '<i></i><i></i><i></i>'); await sleep(820, tk); ty.remove();
          add('bub bot', a); P.busy(false); await sleep(1000, tk);
        }
        handoff();
      },
      final(P) { stack.innerHTML = ''; EX.forEach(([q, a]) => { add('bub me in', esc(q)); add('bub bot in', a); }); handoff().classList.add('in'); $$('.pop', sc).forEach(e => e.classList.add('in')); P.set("Where's my order?"); }
    };
  },

  inventory(sc) {
    const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2].map(w => `<i style="width:${w}px"></i>`).join('');
    sc.innerHTML = `<div class="ui ui-inv">
      <aside class="rail2"><span class="logo">S</span>
        <span class="nv on">${icon('i-box')}Products</span><span class="nv">${icon('i-report')}Orders</span><span class="nv">${icon('i-home')}Warehouses</span><span class="nv">${icon('i-sync')}Logistics</span></aside>
      <div class="main">
        <div class="topr"><div class="scan"><span class="bars">${bars}</span><span class="u-mono">Scan UPC</span><i class="laser"></i></div><span class="u-mono" style="margin-left:auto">Live inventory</span></div>
        <div style="display:flex;gap:6px"><span class="ichip out stp" data-c="0">${icon('i-check')}Shopify sync</span><span class="ichip out stp" data-c="1">${icon('i-check')}AWB generated</span><span class="ichip out stp" data-c="2">${icon('i-check')}GRN received</span></div>
        <div class="tbl">
          <div class="tr u-mono"><span>Product</span><span>Variant</span><span>Status</span></div>
          <div class="tr" data-r="0"><span>Oversized tee</span><span>Black · M</span><span class="st">In stock</span></div>
          <div class="tr" data-r="1"><span>Hoodie</span><span>Grey · L</span><span class="st">Packed</span></div>
          <div class="tr" data-r="2"><span>Cargo pants</span><span>Olive · S</span><span class="st">Shipped</span></div>
          <div class="tr" data-r="3"><span>Cap</span><span>Black</span><span class="st">In stock</span></div>
        </div>
        <div class="restock"><span class="tag">AI</span><span>Restock suggestion: <span class="sk rs-sk"></span><b class="rs-sku">Tee · Black · M</b></span><span class="go">Reorder</span></div>
      </div></div>`;
    const laser = $('.laser', sc), row = $('.tr[data-r="0"]', sc), st = $('.st', row), chips = $$('.ichip.stp', sc), restock = $('.restock', sc);
    return {
      prompt: 'Scan UPC…', hold: 2400,
      reset() { laser.classList.remove('go'); row.classList.remove('hit'); st.textContent = 'In stock'; chips.forEach(c => c.classList.remove('in')); restock.classList.remove('in'); },
      async run(tk, P) {
        await P.type('Scan UPC…', tk, 60); P.busy(true);
        laser.classList.remove('go'); void laser.offsetWidth; laser.classList.add('go'); await sleep(1800, tk); laser.classList.remove('go');
        row.classList.add('hit'); st.textContent = 'Scanned'; P.busy(false); await sleep(520, tk);
        for (const c of chips) { c.classList.add('in'); await sleep(430, tk); }
        await sleep(300, tk); restock.classList.add('in');
      },
      final(P) { row.classList.add('hit'); st.textContent = 'Scanned'; chips.forEach(c => c.classList.add('in')); restock.classList.add('in'); P.set('Scan UPC…'); }
    };
  },

  demo(sc) {
    sc.innerHTML = `<div class="ui ui-demo">
      <div class="hd"><b>Demo requests</b><div class="rules"><span class="ichip rule">Grade</span><span class="ichip rule">Language</span><span class="ichip rule">Time slot</span></div></div>
      <div class="board">
        <div class="lane in"><span class="lh">Incoming</span><div class="lb" data-l="in"></div></div>
        <div class="lane" data-l="4"><span class="lh">4 pm</span><div class="lb"><div class="dc done"><b>Demo</b><div class="row"><span class="ichip">Grade 3</span><span class="ichip">English</span></div></div></div></div>
        <div class="lane" data-l="5"><span class="lh">5 pm</span><div class="lb"><div class="dc ghost"></div></div></div>
        <div class="lane" data-l="6"><span class="lh">6 pm</span><div class="lb"><div class="dc done"><b>Demo</b><div class="row"><span class="ichip">Grade 8</span><span class="ichip">Hindi</span></div></div><div class="dc done"><b>Demo</b><div class="row"><span class="ichip">Grade 5</span><span class="ichip">English</span></div></div></div></div>
      </div>
      <div class="toast pop">${icon('i-check')}Report sent</div></div>`;
    const inLane = $('[data-l="in"]', sc), lane5 = $('[data-l="5"]', sc), body5 = $('.lb', lane5), rules = $$('.rule', sc), toast2 = $('.toast', sc);
    const CARD = '<b>Demo request</b><div class="row"><span class="ichip">Grade 6</span><span class="ichip">Hindi</span><span class="ichip">5 pm</span></div>';
    let card = null;
    const mk = () => { const c = document.createElement('div'); c.className = 'dc pop'; c.innerHTML = CARD; return c; };
    return {
      prompt: 'Assign a demo for Grade 6, Hindi, 5 pm', hold: 2000,
      reset() { if (card) card.remove(); card = null; body5.classList.remove('filled'); rules.forEach(r => r.classList.remove('lit')); lane5.classList.remove('glow'); toast2.classList.remove('in'); },
      async run(tk, P) {
        await P.type('Assign a demo for Grade 6, Hindi, 5 pm', tk, 34); P.busy(true);
        card = mk(); inLane.appendChild(card); requestAnimationFrame(() => card.classList.add('in')); await sleep(520, tk);
        for (const r of rules) { r.classList.add('lit'); await sleep(360, tk); }
        lane5.classList.add('glow');
        const k = parseFloat(getComputedStyle(sc).getPropertyValue('--k')) || 1;
        const a = card.getBoundingClientRect(); body5.insertBefore(card, body5.firstChild); const b = card.getBoundingClientRect();
        body5.classList.add('filled'); const b2 = card.getBoundingClientRect();
        card.style.transition = 'none'; card.style.transform = `translate(${((a.left - b2.left) / k).toFixed(1)}px,${((a.top - b2.top) / k).toFixed(1)}px)`;
        void card.offsetWidth; card.style.transition = ''; card.style.transform = '';
        await sleep(650, tk); P.busy(false); toast2.classList.add('in'); await sleep(1500, tk);
        rules.forEach(r => r.classList.remove('lit')); lane5.classList.remove('glow');
      },
      final(P) { card = mk(); card.classList.add('in'); body5.insertBefore(card, body5.firstChild); body5.classList.add('filled'); rules.forEach(r => r.classList.add('lit')); toast2.classList.add('in'); P.set('Assign a demo for Grade 6, Hindi, 5 pm'); }
    };
  },

  events(sc) {
    sc.innerHTML = `<div class="ui ui-ev">
      <div class="form"><b>Create event</b>
        <div class="f"><label>Title</label><span data-f="0"></span></div>
        <div class="f"><label>Date</label><span data-f="1"></span></div>
        <div class="f"><label>Seats</label><span data-f="2"></span></div>
        <div class="pub"><span class="btnp">Publish</span><span class="u-mono st"></span></div></div>
      <div class="stats"><span class="u-mono">Registrations</span><b class="count">–</b><span class="csub pop">in 2 months</span><div class="meter"><i></i></div></div></div>`;
    const F = $$('.f span', sc), btn = $('.btnp', sc), st = $('.pub .st', sc), count = $('.count', sc), csub = $('.csub', sc), bar = $('.meter i', sc);
    const VALS = ['Weekend coding workshop', 'Saturday · 11 am', 'Open to all'];
    return {
      prompt: 'Create a weekend coding workshop', hold: 2600,
      reset() { F.forEach(f => { f.textContent = ''; f.classList.remove('focus'); }); st.textContent = ''; count.textContent = '–'; count.classList.add('idle'); csub.classList.remove('in'); bar.style.transition = 'none'; bar.style.width = '0'; },
      async run(tk, P) {
        await P.type('Create a weekend coding workshop', tk, 36); P.busy(true);
        for (let i = 0; i < 3; i++) { F[i].classList.add('focus'); for (const ch of Array.from(VALS[i])) { F[i].textContent += ch; await sleep(24, tk); } await sleep(160, tk); F[i].classList.remove('focus'); }
        btn.classList.add('press'); await sleep(160, tk); btn.classList.remove('press'); st.textContent = 'Published'; P.busy(false); await sleep(420, tk);
        bar.style.transition = 'width 1.6s cubic-bezier(.2,.7,.2,1)'; bar.style.width = '100%';
        count.classList.remove('idle'); for (let n = 1; n <= 5; n++) { count.textContent = n + 'k+'; await sleep(300, tk); }
        csub.classList.add('in');
      },
      final(P) { F.forEach((f, i) => { f.textContent = VALS[i]; }); st.textContent = 'Published'; count.classList.remove('idle'); count.textContent = '5k+'; csub.classList.add('in'); bar.style.width = '100%'; P.set('Create a weekend coding workshop'); }
    };
  },

  nps(sc) {
    sc.innerHTML = `<div class="ui ui-nps"><p class="q">How likely are you to recommend us?</p>
      <div class="scale">${Array.from({ length: 11 }, (_, i) => `<span${i === 9 ? ' class="on"' : ''}>${i}</span>`).join('')}</div>
      <div class="ends u-mono"><span>Not likely</span><span>Very likely</span></div>
      <div class="why"><span class="u-mono">Tell us why</span><span class="sk w90"></span><span class="sk w60"></span></div>
      <div class="bins"><span class="ichip">Promoters</span><span class="ichip out">Passives</span><span class="ichip out">Detractors</span></div></div>`;
    return { prompt: '', reset() {}, async run() {}, final() {} };
  },

  sales(sc) {
    const card = () => '<div class="card"><i></i><span><span class="sk w80"></span><span class="sk w50"></span></span></div>';
    const col = (t, n) => `<div class="col"><span class="u-mono">${t}</span>${Array.from({ length: n }, card).join('')}</div>`;
    sc.innerHTML = `<div class="ui ui-sales"><div class="hd"><b>Sales pipeline</b><span class="ichip out">${icon('i-plus')}Collect payment</span></div>
      <div class="cols">${col('Lead', 3)}${col('Demo done', 2)}${col('Paid', 2)}${col('Onboarded', 1)}</div></div>`;
    return { prompt: '', reset() {}, async run() {}, final() {} };
  },

  lufthansa(sc) {
    sc.innerHTML = `<div class="ui ui-lh">
      <div class="ph"><span class="t">My trip</span><div class="bp"><div><span>FROM</span><span>TO</span></div><span class="sk w60"></span><div><span>GATE</span><span>SEAT</span></div></div>
        <span class="li"><i></i>Boarding</span><span class="li"><i></i>Baggage</span><span class="li"><i></i>Transfer help</span><div class="tabs"><i></i><i></i><i></i><i></i></div></div>
      <span class="arrow" aria-hidden="true"></span>
      <div class="ph"><span class="t">Transfer help</span><span class="sk w80"></span><span class="sk w60"></span>
        <span class="li"><i></i>Find my gate</span><span class="li"><i></i>Time to connect</span><span class="li"><i></i>Ask the crew</span><div class="bp" style="height:54px"><span class="sk w70"></span><span class="sk w40"></span></div><div class="tabs"><i></i><i></i><i></i><i></i></div></div></div>`;
    return { prompt: '', reset() {}, async run() {}, final() {} };
  }
};

/* ---------- screens for projects added later ----------
   A project picks its screen with `ui` in js/content.js, or by its id when a screen above has that name.
   ui: 'shot' shows a real screenshot (shot: 'assets/work/<file>.jpg', 520×340 or larger at that ratio).
   Anything else without a screen gets 'placeholder': loading skeletons and a note (note: '…'). */
MINI.shot = (sc, w) => {
  sc.innerHTML = `<div class="ui ui-shot"><img src="${esc(w.shot)}" alt="" decoding="async"></div>`;
  const pr = w.prompt || '';
  return {
    prompt: pr, hold: 2600,
    reset() {},
    async run(tk, P) { if (pr) await P.type(pr, tk, 45); await sleep(2600, tk); },
    final(P) { P.set(pr); }
  };
};
MINI.placeholder = (sc, w) => {
  const d = i => `style="animation-delay:${i * 140}ms"`;
  const note = (w && w.note) || 'Screens on the way.';
  const pr = (w && w.prompt) || 'Writing this up…';
  sc.innerHTML = `<div class="ui ui-luc"><div class="top"><i></i><i></i><i></i><span class="sk pulse" ${d(0)}></span></div>
    <div class="body"><aside><span class="sk pulse w80" ${d(1)}></span><span class="sk pulse w60" ${d(2)}></span><span class="sk pulse w70" ${d(3)}></span><span class="sk pulse w50" ${d(4)}></span></aside>
    <main><span class="sk pulse w40" style="height:12px"></span><div class="cards"><span class="sk pulse" ${d(2)}></span><span class="sk pulse" ${d(3)}></span><span class="sk pulse" ${d(4)}></span></div>
    <span class="sk pulse w90" ${d(5)}></span><span class="sk pulse w80" ${d(6)}></span><span class="sk pulse w60" ${d(7)}></span></main></div>
    <p class="note">${esc(note)}</p></div>`;
  return {
    prompt: pr, hold: 400,
    reset() {},
    async run(tk, P) { await P.type(pr, tk, 55); P.busy(true); await sleep(6400, tk); P.busy(false); },
    final(P) { P.set(pr); P.busy(!RM); }
  };
};
const mini = w => MINI[w.ui || w.id] || MINI.placeholder;
// screens kept in their own files (js/mini-*.js) register on window.OM_MINI as (sc, w, h) factories
const MH = { $, $$, esc, sleep, wait, icon, RM, STOP, clamp, lerp };
if (window.OM_MINI) Object.keys(window.OM_MINI).forEach(k => { const f = window.OM_MINI[k]; MINI[k] = (sc, w) => f(sc, w, MH); });

/* ---------- build the work section ---------- */
const Work = (() => {
  const showcase = $('#showcase'), moreList = $('#moreList'), grid = $('#grid'), chips = $('#chips');
  // look: the top two stay as showcase cards; everything else is a grid under them
  const TOP = WORK.filter(w => w.show).slice(0, 2), REST = WORK.filter(w => !TOP.includes(w));
  showcase.innerHTML = TOP.map(caseHTML).join('');
  moreList.innerHTML = REST.map(gcardHTML).join('');
  grid.innerHTML = WORK.map(gcardHTML).join('');
  const count = k => (k === 'all' ? WORK.length : WORK.filter(w => w.cats.includes(k)).length);
  chips.innerHTML = CATS.map(c => `<button type="button" data-cat="${c.k}" aria-pressed="${c.k === 'all'}">${icon(c.icon, 'ic')}${esc(c.label)}<small>${count(c.k)}</small></button>`).join('');

  // scale every 520×340 screen to its frame
  const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => { const w = e.contentRect.width; if (w) e.target.style.setProperty('--k', (w / 520).toFixed(4)); })) : null;
  $$('#work .app').forEach(a => { if (ro) ro.observe(a); else a.style.setProperty('--k', (a.clientWidth / 520).toFixed(4)); });

  // grid thumbnails: still final states
  WORK.forEach(w => { const sc = $(`.gcard[data-id="${w.id}"] .screen`, grid); if (sc) mini(w)(sc, w).final(NOPROMPT); });
  REST.forEach(w => { const sc = $(`.gcard[data-id="${w.id}"] .screen`, moreList); if (sc) mini(w)(sc, w).final(NOPROMPT); });

  // showcase: live loops while visible
  const runners = [];
  TOP.forEach(w => {
    const art = $('#case-' + w.id), sc = $('.screen', art), media = $('.media', art), P = promptCtl($('.prompt-row', art));
    const ctl = mini(w)(sc, w);
    const R = { w, art, media, ctl, P, tk: null, vis: false,
      start() {
        if (RM || R.tk || document.hidden) return;
        const my = R.tk = token(); media.classList.add('live');
        (async () => {
          try { while (!my.dead) { ctl.reset(); P.clear(); P.busy(false); await sleep(450, my); await ctl.run(my, P); await sleep(ctl.hold || 1800, my); } }
          catch (e) { if (e !== STOP) console.error(e); }
        })();
      },
      stop() { if (!R.tk) return; kill(R.tk); R.tk = null; media.classList.remove('live'); P.busy(false); }
    };
    if (RM) ctl.final(P);
    runners.push(R);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      const R = runners.find(r => r.media === e.target); if (!R) return;
      R.vis = e.isIntersecting; if (R.vis) R.start(); else R.stop();
    }), { threshold: 0.2 });
    runners.forEach(r => io.observe(r.media));
  }
  document.addEventListener('visibilitychange', () => runners.forEach(r => { if (document.hidden) r.stop(); else if (r.vis) r.start(); }));

  // filters + views
  let cat = 'all', view = 'showcase', busy = 0;
  const showing = $('#showing'), moreWrap = $('#moreWrap'), gridWrap = $('#gridWrap');
  function apply(animate) {
    const match = w => cat === 'all' || w.cats.includes(cat);
    const n = WORK.filter(match).length;
    const swap = () => {
      WORK.forEach(w => {
        const c = $('#case-' + w.id); if (c) c.hidden = !match(w);
        const m = $(`.gcard[data-id="${w.id}"]`, moreList); if (m) m.hidden = !match(w);
        const g = $(`.gcard[data-id="${w.id}"]`, grid); if (g) g.hidden = !match(w);
      });
      const anyMore = REST.some(w => match(w));
      $('#more h3').hidden = !anyMore; moreList.hidden = !anyMore;
      showcase.hidden = view !== 'showcase'; moreWrap.hidden = view !== 'showcase'; gridWrap.hidden = view !== 'grid';
      showing.textContent = `Showing ${n} of ${WORK.length}`;
    };
    const parts = [showcase, moreWrap, gridWrap];
    if (!animate || RM) { swap(); return; }
    const my = ++busy;
    parts.forEach(p => p.classList.add('fading'));
    setTimeout(() => { if (my !== busy) return; swap(); requestAnimationFrame(() => parts.forEach(p => p.classList.remove('fading'))); spy(); }, 170);
  }
  chips.addEventListener('click', e => {
    const b = e.target.closest('button[data-cat]'); if (!b || b.dataset.cat === cat) return;
    cat = b.dataset.cat; $$('button', chips).forEach(x => x.setAttribute('aria-pressed', String(x === b))); apply(true);
  });
  $('#views').addEventListener('click', e => {
    const b = e.target.closest('button[data-view]'); if (!b || b.dataset.view === view) return;
    view = b.dataset.view; $$('#views button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); apply(true);
  });
  apply(false);
  return { runners, state: () => ({ cat, view, showing: showing.textContent }) };
})();

/* =====================================================================
   DOT FIELDS: How tiles (shapes) and About tiles (diamond lens)
   ===================================================================== */
function makeField(cv, o) {
  const ctx = cv.getContext('2d');
  const F = { cv, ctx, W: 0, H: 0, dpr: 1, pitch: o.pitch || 13, r0: o.r0 || 1, a0: o.a0 || 0.12, shape: o.shape || null, area: o.area,
    pts: null, wts: null, del: null, p: o.shape ? 0 : 1, tp: o.shape ? 0 : 1, h: 0, th: 0, lx: 0, ly: 0, tlx: 0, tly: 0, la: 0, tla: 0, dirty: true, rgb: '10,10,10', lensR: o.lensR || 140 };
  F.resize = () => {
    const r = cv.getBoundingClientRect(); if (!r.width || !r.height) return;
    F.W = r.width; F.H = r.height; F.dpr = DPR(); cv.width = Math.round(F.W * F.dpr); cv.height = Math.round(F.H * F.dpr);
    F.rgb = cssv('--dotrgb') || '10,10,10';
    const cols = Math.floor(F.W / F.pitch), rows = Math.floor(F.H / F.pitch);
    const ox = (F.W - (cols - 1) * F.pitch) / 2, oy = (F.H - (rows - 1) * F.pitch) / 2;
    const n = cols * rows; F.pts = new Float32Array(n * 2); F.wts = new Float32Array(n); F.del = new Float32Array(n);
    for (let j = 0, k = 0; j < rows; j++) for (let i = 0; i < cols; i++, k++) { F.pts[k * 2] = ox + i * F.pitch; F.pts[k * 2 + 1] = oy + j * F.pitch; }
    if (F.shape) {
      const m = document.createElement('canvas'); m.width = Math.ceil(F.W); m.height = Math.ceil(F.H);
      const g = m.getContext('2d'); const A = F.area(F.W, F.H); drawShape(g, F.shape, A.cx, A.cy, A.s);
      const data = g.getImageData(0, 0, m.width, m.height).data; let maxD = 1;
      for (let k = 0; k < n; k++) {
        const x = Math.round(F.pts[k * 2]), y = Math.round(F.pts[k * 2 + 1]);
        F.wts[k] = data[(y * m.width + x) * 4 + 3] / 255;
        const d = Math.hypot(x - A.cx, y - A.cy); F.del[k] = d; if (F.wts[k] > 0.05) maxD = Math.max(maxD, d);
      }
      for (let k = 0; k < n; k++) F.del[k] = Math.min(1, F.del[k] / maxD);
    }
    F.dirty = true; F.draw();
  };
  F.draw = () => {
    if (!F.pts) return; const c = ctx; c.setTransform(F.dpr, 0, 0, F.dpr, 0, 0); c.clearRect(0, 0, F.W, F.H);
    const n = F.wts.length, rgb = F.rgb, LR = F.lensR;
    // base dots in one path
    c.fillStyle = `rgba(${rgb},${F.a0})`; c.beginPath();
    for (let k = 0; k < n; k++) { const x = F.pts[k * 2], y = F.pts[k * 2 + 1]; c.moveTo(x + F.r0, y); c.arc(x, y, F.r0, 0, 6.2832); }
    c.fill();
    for (let k = 0; k < n; k++) {
      const x = F.pts[k * 2], y = F.pts[k * 2 + 1];
      let s = 0;
      if (F.shape && F.wts[k] > 0.02) s = F.wts[k] * smooth(clamp((F.p * 1.55 - F.del[k] * 0.55) / 1, 0, 1));
      let l = 0;
      if (F.la > 0.01) { const d = Math.abs(x - F.lx) + Math.abs(y - F.ly); if (d < LR) l = smooth(1 - d / LR) * F.la; }
      if (s < 0.02 && l < 0.02) continue;
      const r = F.r0 + (2.6 + 0.5 * F.h) * s + 1.9 * l;
      const a = Math.min(0.9, F.a0 + 0.72 * s + 0.42 * l);
      c.fillStyle = `rgba(${rgb},${a.toFixed(3)})`; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
    }
  };
  F.job = (t, dt) => {
    if (!F.dirty) return false;
    if (F.shape && F.tp > F.p) F.p = Math.min(F.tp, F.p + dt / 1400);
    F.h += (F.th - F.h) * 0.12; F.la += (F.tla - F.la) * 0.12; F.lx += (F.tlx - F.lx) * 0.2; F.ly += (F.tly - F.ly) * 0.2;
    F.draw();
    const moving = (F.shape && F.p < F.tp) || Math.abs(F.th - F.h) > 0.005 || Math.abs(F.tla - F.la) > 0.005 || Math.abs(F.tlx - F.lx) > 0.3 || Math.abs(F.tly - F.ly) > 0.3;
    if (!moving) F.dirty = false; return moving;
  };
  F.reveal = () => { if (RM) { F.p = 1; F.tp = 1; F.draw(); return; } F.tp = 1; F.dirty = true; Loop.kick(); };
  const host = o.host || cv.parentElement;
  const pt = e => { const r = cv.getBoundingClientRect(); F.tlx = e.clientX - r.left; F.tly = e.clientY - r.top; };
  if (!RM) {
    host.addEventListener('pointerenter', e => { pt(e); if (F.la < 0.02) { F.lx = F.tlx; F.ly = F.tly; } F.th = 1; F.tla = 1; F.dirty = true; Loop.kick(); });
    host.addEventListener('pointermove', e => { pt(e); F.dirty = true; Loop.kick(); });
    host.addEventListener('pointerleave', () => { F.th = 0; F.tla = 0; F.dirty = true; Loop.kick(); });
    host.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { pt(e); F.lx = F.tlx; F.ly = F.tly; F.tla = 1; F.th = 1; F.dirty = true; Loop.kick(); clearTimeout(F._t); F._t = setTimeout(() => { F.tla = 0; F.th = 0; F.dirty = true; Loop.kick(); }, 1100); } });
  }
  Loop.add(F.job);
  themeHooks.push(() => { F.rgb = cssv('--dotrgb') || F.rgb; F.draw(); });
  return F;
}
function drawShape(g, kind, cx, cy, s) {
  g.fillStyle = '#000'; g.strokeStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round';
  if (kind === 'q') {
    g.font = `700 ${Math.round(s)}px "TikTok Sans", ui-sans-serif, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', cx, cy + s * 0.04);
  } else if (kind === 'grid') {
    const cell = s / 3, q = cell * 0.7, r = cell * 0.14;
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
      const x = cx - s / 2 + i * cell + (cell - q) / 2, y = cy - s / 2 + j * cell + (cell - q) / 2;
      g.beginPath(); if (g.roundRect) g.roundRect(x, y, q, q, r); else g.rect(x, y, q, q); g.fill();
    }
  } else if (kind === 'ring') {
    g.lineWidth = s * 0.17; g.beginPath(); g.arc(cx, cy, s * 0.4, 0, Math.PI * 2); g.stroke();
  } else if (kind === 'arrow') {
    g.lineWidth = s * 0.17; g.beginPath(); g.moveTo(cx - s * 0.62, cy); g.lineTo(cx + s * 0.32, cy); g.stroke();
    g.beginPath(); g.moveTo(cx + s * 0.62, cy); g.lineTo(cx + s * 0.08, cy - s * 0.4); g.lineTo(cx + s * 0.08, cy + s * 0.4); g.closePath(); g.fill();
  }
}

const How = (() => {
  const AREA = {
    q: (W, H) => ({ cx: W * 0.5, cy: (H - 150) * 0.5 + 8, s: Math.min(W * 0.78, (H - 150) * 0.82) }),
    grid: (W, H) => ({ cx: W * 0.5, cy: (H - 128) * 0.5 + 10, s: Math.min(W * 0.5, (H - 128) * 0.74) }),
    ring: (W, H) => ({ cx: W * 0.5, cy: (H - 128) * 0.5 + 10, s: Math.min(W * 0.55, (H - 128) * 0.8) }),
    arrow: (W, H) => (W > 560 ? { cx: W * 0.74, cy: H * 0.44, s: Math.min(W * 0.28, H * 0.5) } : { cx: W * 0.5, cy: (H - 128) * 0.5 + 10, s: Math.min(W * 0.5, (H - 128) * 0.7) })
  };
  const tiles = $$('.how-tile').map(t => {
    const F = makeField($('canvas', t), { shape: t.dataset.shape, area: AREA[t.dataset.shape], pitch: 13, r0: 1, a0: 0.13, lensR: 120, host: t });
    return { t, F };
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const x = tiles.find(o => o.t === e.target); if (x) { x.F.reveal(); io.unobserve(e.target); } } }), { threshold: 0.35 });
    tiles.forEach(o => io.observe(o.t));
  } else tiles.forEach(o => o.F.reveal());
  return { resize() { tiles.forEach(o => o.F.resize()); }, tiles };
})();

const AboutTiles = (() => {
  const fields = $$('#about .tile').map(t => makeField($('canvas', t), { pitch: 12, r0: 0.9, a0: 0.12, lensR: 150, host: t }));
  if (C.media && C.media.aboutPhoto) {
    const ph = $('#photoTile'); const img = new Image(); img.alt = 'Om Dubey'; img.src = C.media.aboutPhoto; img.decoding = 'async';
    img.className = 'ph-photo'; ph.prepend(img); const mj = $('#photoMj'); if (mj) mj.hidden = true; ph.classList.add('has-photo');
  }
  return { resize() { fields.forEach(f => f.resize()); } };
})();

/* =====================================================================
   ASK: pre-written answers, matched by keywords, streamed word by word
   ===================================================================== */
const Ask = (() => {
  const QA = C.ask.qa;
  const FALLBACK = C.ask.fallback;
  const form = $('#askForm'), input = $('#askInput'), send = $('#askSend'), plus = $('#askPlus'), chipsEl = $('#askChips');
  const card = $('#answer'), body = $('#ansBody'), aq = $('#ansQ'), tag = $('#ansTag');
  const FEAT = (C.ask.featured || []).map(q => QA.findIndex(x => x.q === q)).filter(i => i > -1);
  const chipIdx = FEAT.length ? FEAT : QA.slice(0, C.ask.chips || 6).map((x, i) => i);
  chipsEl.innerHTML = chipIdx.map(i => `<button type="button" data-i="${i}">${esc(QA[i].q)}</button>`).join('');
  // every question, grouped, behind one disclosure
  if (C.ask.groups) {
    const all = document.createElement('details'); all.className = 'ask-all';
    all.innerHTML = `<summary>Browse all ${QA.length} questions</summary>` + C.ask.groups.map(g => {
      const items = QA.map((x, i) => [x, i]).filter(([x]) => x.g === g);
      return items.length ? `<div class="aa-g"><p>${esc(g)}</p>${items.map(([x, i]) => `<button type="button" data-i="${i}">${esc(x.q)}</button>`).join('')}</div>` : '';
    }).join('');
    form.appendChild(all);
    all.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i; all.open = false; input.value = QA[i].q; answer(i, QA[i].q); });
  }
  plus.addEventListener('click', () => {
    const open = chipsEl.hidden; chipsEl.hidden = !open;
    plus.setAttribute('aria-expanded', String(open)); plus.setAttribute('aria-label', open ? 'Hide suggested questions' : 'Show suggested questions');
  });
  function match(text) {
    const t = ' ' + text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.&\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    const norm = k => k.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.&\s*]/g, ' ').replace(/\s+/g, ' ').trim();
    let best = -1, bs = 0;
    QA.forEach((x, i) => {
      let s = 0;
      x.k.forEach(k0 => {
        const strong = k0.charAt(0) === '+'; const wt = strong ? 2 : 1; const k = norm(strong ? k0.slice(1) : k0);
        if (k.endsWith('*')) { if (t.includes(' ' + k.slice(0, -1))) s += wt; }
        else if (t.includes(' ' + k + ' ')) s += k.includes(' ') ? 2 : wt;
      });
      if (s > bs) { bs = s; best = i; }
    });
    return bs >= 2 ? best : -1; // one strong keyword or two weak ones, else it's a 404
  }
  const MAILRE = new RegExp('^(' + EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(.*)$');
  let run = 0;
  async function answer(i, asked) {
    const my = ++run; const text = i >= 0 ? QA[i].a : FALLBACK;
    card.hidden = false; aq.textContent = i >= 0 ? QA[i].q : asked;
    card.classList.toggle('is404', i < 0);
    tag.textContent = i < 0 ? '404 · not in my notes' : (asked === QA[i].q ? 'Pre-written answer · not live AI' : 'Closest pre-written answer · not live AI');
    body.textContent = ''; send.classList.add('busy'); send.disabled = true;
    if (!RM) { const r = card.getBoundingClientRect(); if (r.bottom > innerHeight) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    const words = text.split(' ');
    for (let w = 0; w < words.length; w++) {
      if (my !== run) return;
      const word = words[w]; const m = word.match(MAILRE);
      if (w) body.appendChild(document.createTextNode(' '));
      if (m) { const s = document.createElement('span'); s.className = 'sel'; s.textContent = m[1]; body.appendChild(s); if (m[2]) body.appendChild(document.createTextNode(m[2])); }
      else body.appendChild(document.createTextNode(word));
      if (!RM) await wait(40);
    }
    send.classList.remove('busy'); send.disabled = false;
  }
  chipsEl.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i; input.value = QA[i].q; answer(i, QA[i].q); });
  form.addEventListener('submit', e => { e.preventDefault(); const q = input.value.trim(); if (!q) { input.focus(); return; } answer(match(q), q); });
  return { match, QA };
})();

/* =====================================================================
   TABLES, TESTIMONIALS
   ===================================================================== */

function tableHTML(rows, idp, heads, expandable) {
  const head = `<div class="thead" aria-hidden="true">${heads.map(h => `<span>${h}</span>`).join('')}<span></span></div>`;
  return head + rows.map((r, i) => {
    const pts = r.pts || r.alt; const id = `${idp}-${i}`;
    const cells = `<span class="r">${esc(r.role)}</span><span class="c" data-city="${esc(r.city)}">${esc(r.co)}</span><span class="ci">${esc(r.city)}</span><span class="y">${esc(r.years)}</span>`;
    if (expandable && pts) return `<div class="trow"><button class="trow-b" type="button" aria-expanded="false" aria-controls="${id}">${cells}<svg class="ic ch" aria-hidden="true"><use href="#i-plus"/></svg></button><div class="trow-m" id="${id}" role="region" aria-label="${esc(r.role)}, ${esc(r.co)}"><ul>${pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></div>`;
    return `<div class="trow"><div class="trow-b">${cells}<span></span></div></div>`;
  }).join('');
}
$('#expTbl').innerHTML = tableHTML(D.exp, 'exp', ['Role', 'Company', 'City', 'Years'], true);
$('#eduTbl').innerHTML = tableHTML(D.edu, 'edu', ['Degree', 'School', 'City', 'Year'], false);
document.addEventListener('click', e => {
  const b = e.target.closest('button.trow-b'); if (!b) return;
  const m = document.getElementById(b.getAttribute('aria-controls')); if (!m) return;
  const open = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(open));
  const h = m.scrollHeight;
  if (RM) { m.style.height = open ? 'auto' : '0px'; return; }
  if (open) { m.style.height = '0px'; void m.offsetHeight; m.style.height = h + 'px'; }
  else { m.style.height = m.getBoundingClientRect().height + 'px'; void m.offsetHeight; m.style.height = '0px'; }
  const done = ev => { if (ev.propertyName !== 'height') return; m.removeEventListener('transitionend', done); if (b.getAttribute('aria-expanded') === 'true') m.style.height = 'auto'; };
  m.addEventListener('transitionend', done);
});

/* =====================================================================
   LOGOS: monochrome brand marks from the logo sprite the build makes from assets/logos
   ===================================================================== */
// a <use> already maps the symbol's own viewBox, so the outer <svg> only needs its proportions (origin 0 0)
const ratioBox = vb => { const p = String(vb || '').trim().split(/[\s,]+/).map(Number); return p.length === 4 && p[2] > 0 && p[3] > 0 ? `0 0 ${p[2]} ${p[3]}` : null; };
const logoVB = id => { const s = document.getElementById('lg-' + id); return s ? ratioBox(s.getAttribute('viewBox')) : null; };
function logo(id, name, cls) {
  const vb = logoVB(id);
  if (!vb) return `<span class="lg-mono ${cls || ''}" aria-hidden="true">${esc(String(name).replace(/[^A-Za-z0-9]/g, '').slice(0, 2))}</span>`;
  return `<svg class="lg ${cls || ''}" viewBox="${vb}" aria-hidden="true" focusable="false"><use href="#lg-${id}"/></svg>`;
}
const TOOL_NAMES = {};
(D.stack || []).forEach(g => g.tools.forEach(([id, n]) => { TOOL_NAMES[id] = n; }));

// hero strip: the tools I work in, drifting slowly (still for reduced motion)
(() => {
  const row = $('#heroTools'); if (!row) return;
  const ids = (D.heroTools || []).filter(id => logoVB(id));
  if (!ids.length) { row.closest('.hero-tools').hidden = true; return; }
  const one = ids.map(id => `<li title="${esc(TOOL_NAMES[id] || id)}">${logo(id, TOOL_NAMES[id] || id)}<span class="sr-only">${esc(TOOL_NAMES[id] || id)}</span></li>`).join('');
  const copy = ids.map(id => `<li aria-hidden="true">${logo(id, TOOL_NAMES[id] || id)}</li>`).join('');
  row.innerHTML = one + (RM ? '' : copy);
  if (RM) row.classList.add('still');
})();

// companies: each <svg class="lg-co"> takes its symbol's viewBox, or falls back to the name
$$('svg.lg-co').forEach(svg => {
  const u = svg.querySelector('use'); const s = u && document.getElementById(u.getAttribute('href').slice(1));
  if (s) svg.setAttribute('viewBox', ratioBox(s.getAttribute('viewBox')));
  else svg.outerHTML = `<span class="co-name">${esc(svg.getAttribute('aria-label') || '')}</span>`;
});

// stack: tools grouped, each with its logo
$('#tools').innerHTML = (D.stack || []).map(g => `<div class="sg"><p class="sg-h">${esc(g.group)}</p><ul class="sg-list">${g.tools.map(([id, n]) => `<li>${logo(id, n)}<span>${esc(n)}</span></li>`).join('')}</ul></div>`).join('');

/* =====================================================================
   BOOKSHELF: covers on a rack; each book opens Om's notes on Notion
   ===================================================================== */
const Shelf = (() => {
  // look: one row of spines. Each spine opens Om's notes on Notion; hover shows the cover.
  const rack = $('#rack'); if (!rack) return { layout() {} };
  const books = (D.books || []).filter(b => !b.hide);
  const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
  const spine = b => {
    const h = hash(b.id), H = 180 + (h % 46), W = 36 + (h >> 5) % 14, c = b.spine || '#8a8a8a', fg = lum(c) > 0.62 ? '#1A1712' : '#FFFFFF';
    return `<a class="spine" href="${esc(b.url)}" target="_blank" rel="noopener" style="--h:${H}px;--w:${W}px;--c:${c};--fg:${fg}" aria-label="${esc(b.title)} by ${esc(b.author)}: my notes on Notion (opens in a new tab)">` +
      `<span class="sp-t">${esc(b.title)}</span><span class="sp-a">${esc(b.author.split(' & ')[0].split(' ').slice(-1)[0])}</span>` +
      (b.status === 'Reading' ? '<span class="tag">Reading</span>' : '') +
      `<span class="sp-tip" aria-hidden="true">${b.nocover ? '' : `<img src="assets/books/${esc(b.id)}.jpg" alt="" loading="lazy">`}<b>${esc(b.title)}</b><small>${esc(b.author)} · my notes ↗</small></span></a>`;
  };
  rack.innerHTML = `<div class="spines"><div class="sp-row">${books.map(spine).join('')}</div></div>`;
  return { layout() {} };
})();

$('#quotes').innerHTML = D.words.map(q => {
  const ini = q.name.split(' ').map(s => s[0]).join('');
  const nm = q.url ? `<a href="${q.url}" target="_blank" rel="noopener"><b>${esc(q.name)}</b></a>` : `<b>${esc(q.name)}</b>`;
  return `<figure class="quote"><span class="chip">${esc(q.label)}</span><blockquote>“${esc(q.quote)}”</blockquote><figcaption class="who"><span class="ini" aria-hidden="true">${esc(ini)}</span><div>${nm}<span>${esc(q.title)}</span></div></figcaption></figure>`;
}).join('');

/* =====================================================================
   STACK: skills graph, four areas joined through the centre and shared skills
   ===================================================================== */
const Graph = (() => {
  const wrap = $('#graphWrap'), cv = $('#graph'); const ctx = cv.getContext('2d');
  const HUBS = Object.keys(D.skills);
  // the centre (Founder's Office) sits in the middle; the four areas around it; skills around their area
  const ANCH_W = { c: [0.5, 0.5], h: [[0.22, 0.24], [0.78, 0.24], [0.78, 0.77], [0.22, 0.77]] };
  const ANCH_S = { c: [0.5, 0.5], h: [[0.3, 0.1], [0.72, 0.33], [0.28, 0.67], [0.7, 0.9]] };
  let ANCH = ANCH_W;
  const N = [], L = [], hubIdx = [];
  N.push({ label: D.skillHub || D.name, hub: true, centre: true, g: -1, x: 0, y: 0, vx: 0, vy: 0, ph: 0 });
  HUBS.forEach((h, g) => {
    const hi = N.length; hubIdx.push(hi); N.push({ label: h, hub: true, g, x: 0, y: 0, vx: 0, vy: 0, ph: g * 1.7 });
    L.push([0, hi, 2]);
    D.skills[h].forEach((s, k) => { const ni = N.length; N.push({ label: s, hub: false, g, x: 0, y: 0, vx: 0, vy: 0, ph: (ni * 2.399) % TAU, k }); L.push([hi, ni, 0]); });
  });
  for (let g = 0; g < HUBS.length; g++) L.push([hubIdx[g], hubIdx[(g + 1) % HUBS.length], 1]);
  // a skill that belongs to two areas gets a second, longer link: this is what ties the areas together
  (D.skillLinks || []).forEach(([s, h]) => {
    const si = N.findIndex(n => !n.hub && n.label === s), g = HUBS.indexOf(h);
    if (si > 0 && g > -1 && N[si].g !== g) L.push([hubIdx[g], si, 3]);
  });
  const adj = N.map(() => new Set()); L.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });

  let W = 0, H = 0, dpr = 1, small = false, vis = false, hover = -1, drag = -1, settled = false, rgb = '10,10,10', ink = '#0A0A0A', muted = '#737373', page = '#FFFFFF';
  let placed = false, litSet = null;
  const ORDER = N.map((n, i) => i).sort((a, b) => (N[a].centre ? 2 : N[a].hub ? 1 : 0) - (N[b].centre ? 2 : N[b].hub ? 1 : 0)); // skills, then areas, then the centre on top
  const REST = () => (small ? 70 : 100), HREST = () => (small ? 230 : 380);
  const anchorOf = n => (n.centre ? ANCH.c : ANCH.h[n.g]);
  function place() {
    N.forEach(n => {
      const a = anchorOf(n); const hx = a[0] * W, hy = a[1] * H;
      if (n.hub) { n.x = hx; n.y = hy; }
      else { const cnt = D.skills[HUBS[n.g]].length; const ang = (n.k / cnt) * Math.PI * 2 + n.g; const rr = REST() * 0.9; n.x = hx + Math.cos(ang) * rr; n.y = hy + Math.sin(ang) * rr; }
      n.vx = n.vy = 0;
    });
    placed = true;
  }
  function resize() {
    const r = wrap.getBoundingClientRect(); if (!r.width) return;
    const oW = W, oH = H, wasSmall = small; W = r.width; H = r.height; dpr = DPR(); small = W < 640; ANCH = small ? ANCH_S : ANCH_W; if (placed && wasSmall !== small) placed = false;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    colors();
    if (!placed) place(); else if (oW) N.forEach(n => { n.x *= W / oW; n.y *= H / oH; });
    if (small && !RM) for (let i = 0; i < 200; i++) step(1, 0);
    if (RM) { for (let i = 0; i < 480; i++) step(1, 0); }
    settled = false; draw();
  }
  function colors() { rgb = cssv('--dotrgb') || '10,10,10'; ink = cssv('--ink') || '#0A0A0A'; muted = cssv('--muted') || '#737373'; page = cssv('--page') || '#FFFFFF'; }
  // area and centre names sit on a small page-coloured backing so skill labels never cover them
  function plate(c, text, x, y, size) { const w = c.measureText(text).width + 12, h = size + 6; c.save(); c.globalAlpha *= 0.9; c.fillStyle = page; c.beginPath(); if (c.roundRect) c.roundRect(x - w / 2, y - 3, w, h, 6); else c.rect(x - w / 2, y - 3, w, h); c.fill(); c.restore(); }
  function step(f, t) {
    const n = N.length, REP = small ? 1700 : 4200;
    for (let i = 0; i < n; i++) {
      const a = N[i];
      for (let j = i + 1; j < n; j++) {
        const b = N[j]; let dx = a.x - b.x, dy = a.y - b.y; let d2 = dx * dx + dy * dy; if (d2 > 90000) continue; if (d2 < 1) { dx = 0.5; dy = 0.3; d2 = 0.34; }
        const d = Math.sqrt(d2), fr = REP / d2 * f; const fx = dx / d * fr, fy = dy / d * fr; a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      }
    }
    L.forEach(([i, j, t2]) => {
      const a = N[i], b = N[j]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      let k, rest;
      if (t2 === 0) { k = 0.022; rest = REST(); }
      else if (t2 === 1) { k = 0.0035; rest = HREST(); }
      else if (t2 === 2) { const ac = ANCH.c, ah = anchorOf(b); k = 0.004; rest = Math.hypot((ah[0] - ac[0]) * W, (ah[1] - ac[1]) * H); }
      else { if (small) return; k = 0.003; rest = REST() * 2.9; } // on phones the shared links are drawn, not pulled
      const fr = (d - rest) * k * f; const fx = dx / d * fr, fy = dy / d * fr;
      a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
    });
    N.forEach((a, i) => {
      if (a.hub) { const an = anchorOf(a), s = a.centre ? 0.03 : 0.012; a.vx += (an[0] * W - a.x) * s * f; a.vy += (an[1] * H - a.y) * s * f; }
      a.vx += (W / 2 - a.x) * 0.0012 * f; a.vy += (H / 2 - a.y) * 0.0012 * f;
      if (!RM && t && !a.centre) { a.vx += Math.sin(t * 0.00055 + a.ph) * 0.028; a.vy += Math.cos(t * 0.00047 + a.ph * 1.3) * 0.028; }
      if (i === drag) { a.vx = a.vy = 0; return; }
      a.vx *= 0.84; a.vy *= 0.84; a.x += a.vx; a.y += a.vy;
      const px = small ? 26 : 40; a.x = clamp(a.x, px, W - px); a.y = clamp(a.y, 22, H - 30);
    });
  }
  // what lights up on hover: an area shows its skills and the skills it shares; a skill shows its areas; the centre shows all
  function computeLit() {
    if (hover < 0 || N[hover].centre) { litSet = null; return; }
    const s = new Set([hover, 0]); const h = N[hover];
    if (h.hub) { N.forEach((m, i) => { if (!m.hub && m.g === h.g) s.add(i); }); L.forEach(([a, b, t2]) => { if (t2 === 3 && a === hover) s.add(b); }); }
    else adj[hover].forEach(i => s.add(i));
    litSet = s;
  }
  const lit = i => !litSet || litSet.has(i);
  function draw() {
    const c = ctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    L.forEach(([i, j, t2]) => {
      const a = N[i], b = N[j]; const on = !litSet ? 1 : (lit(i) && lit(j) ? 2 : 0);
      let al, lw = 1, dash = null;
      if (t2 === 0) al = on === 2 ? 0.55 : on ? 0.18 : 0.05;
      else if (t2 === 1) { al = on ? 0.12 : 0.04; dash = [3, 5]; }
      else if (t2 === 2) { al = on === 2 ? 0.6 : on ? 0.32 : 0.06; lw = 1.5; }
      else { al = on === 2 ? 0.5 : on ? 0.16 : 0.04; dash = [1.5, 4]; }
      c.strokeStyle = `rgba(${rgb},${al})`; c.lineWidth = on === 2 ? lw + 0.2 : lw;
      if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); if (dash) c.setLineDash([]);
    });
    const fs = small ? 11 : 12, hs = small ? 13 : 14.5, cs = small ? 13.5 : 16;
    ORDER.forEach(i => {
      const n = N[i];
      c.globalAlpha = lit(i) ? 1 : 0.18;
      if (n.centre) {
        c.fillStyle = `rgba(${rgb},.06)`; c.beginPath(); c.arc(n.x, n.y, small ? 22 : 30, 0, 6.2832); c.fill();
        c.fillStyle = ink; c.beginPath(); c.arc(n.x, n.y, small ? 7.5 : 10, 0, 6.2832); c.fill();
        c.strokeStyle = `rgba(${rgb},.25)`; c.lineWidth = 1; c.beginPath(); c.arc(n.x, n.y, small ? 13 : 17, 0, 6.2832); c.stroke();
        c.font = `600 ${cs}px "TikTok Sans", ui-sans-serif, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'top'; plate(c, n.label, n.x, n.y + (small ? 17 : 22), cs); c.fillStyle = ink; c.fillText(n.label, n.x, n.y + (small ? 17 : 22));
      } else if (n.hub) {
        c.fillStyle = ink; c.beginPath(); c.arc(n.x, n.y, small ? 5.5 : 7, 0, 6.2832); c.fill();
        c.strokeStyle = `rgba(${rgb},.18)`; c.lineWidth = 1; c.beginPath(); c.arc(n.x, n.y, small ? 10 : 13, 0, 6.2832); c.stroke();
        c.font = `500 ${hs}px "TikTok Sans", ui-sans-serif, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'top'; plate(c, n.label, n.x, n.y + (small ? 13 : 17), hs); c.fillStyle = ink; c.fillText(n.label, n.x, n.y + (small ? 13 : 17));
      } else {
        const big = i === hover; c.fillStyle = big ? ink : `rgba(${rgb},.72)`; c.beginPath(); c.arc(n.x, n.y, big ? 4.6 : 3.3, 0, 6.2832); c.fill();
        c.font = `400 ${fs}px "TikTok Sans", ui-sans-serif, system-ui, sans-serif`; c.textBaseline = 'middle';
        let leftSide = n.x < N[hubIdx[n.g]].x; const tw = c.measureText(n.label).width;
        if (leftSide && n.x - 8 - tw < 4) leftSide = false; else if (!leftSide && n.x + 8 + tw > W - 4) leftSide = true;
        c.textAlign = leftSide ? 'right' : 'left'; c.fillStyle = big ? ink : muted; c.fillText(n.label, n.x + (leftSide ? -8 : 8), n.y);
      }
    });
    c.globalAlpha = 1;
  }
  function nearest(x, y) { let bi = -1, bd = 1e9; N.forEach((n, i) => { const d = Math.hypot(n.x - x, n.y - y) - (n.centre ? 12 : n.hub ? 6 : 0); if (d < bd) { bd = d; bi = i; } }); return bd < (small ? 20 : 16) ? bi : -1; }
  const xy = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const setHover = h => { if (h === hover) return false; hover = h; computeLit(); return true; };
  cv.addEventListener('pointermove', e => {
    const [x, y] = xy(e);
    if (drag >= 0) { N[drag].x = clamp(x, 10, W - 10); N[drag].y = clamp(y, 10, H - 10); settled = false; Loop.kick(); return; }
    if (e.pointerType !== 'mouse') return; const h = nearest(x, y); if (setHover(h)) { cv.style.cursor = h >= 0 ? 'grab' : 'default'; if (RM || !vis) draw(); else Loop.kick(); }
  });
  cv.addEventListener('pointerleave', () => { if (drag < 0 && setHover(-1)) { draw(); Loop.kick(); } });
  cv.addEventListener('pointerdown', e => {
    const [x, y] = xy(e); const i = nearest(x, y); if (i < 0) return;
    drag = i; setHover(i); cv.classList.add('drag'); try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ok */ } settled = false; Loop.kick();
  });
  const up = e => { if (drag < 0) return; drag = -1; cv.classList.remove('drag'); if (e.pointerType !== 'mouse') setHover(-1); try { cv.releasePointerCapture(e.pointerId); } catch (er) { /* ok */ } Loop.kick(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  let quiet = 0;
  function job(t) {
    if (!vis || !W) return false;
    if (RM) { if (drag >= 0 || !settled) { for (let i = 0; i < 3; i++) step(1, 0); draw(); let e = 0; N.forEach(n => { e += Math.abs(n.vx) + Math.abs(n.vy); }); if (drag < 0 && e < 0.4) { quiet++; if (quiet > 20) settled = true; } else quiet = 0; } return !settled; }
    step(1, t); draw(); return true;
  }
  Loop.add(job);
  themeHooks.push(() => { colors(); draw(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) { settled = false; Loop.kick(); } }).observe(wrap);
  return { resize, nodes: N, links: L, drawNow: draw };
})();

/* =====================================================================
   AGENT VIEW: the whole page as a plain Markdown resume
   ===================================================================== */
const Agent = (() => {
  const site = $('#site'), av = $('#agentView'), md = $('#agentMd'), btn = $('#agentBtn');
  const chrome = [$('#topbar'), $('#rail'), $('#chatFab'), $('#scrim')];
  let on = false, y = 0;
  md.textContent = window.OM_MD(C);
  function open(instant) {
    if (on) return; on = true; y = scrollY; closeSheet(false);
    btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Back to the site');
    try { history.replaceState(null, '', '#agent'); } catch (e) { /* sandbox */ }
    const show = () => {
      site.hidden = true; chrome.forEach(c => { if (c) c.style.visibility = 'hidden'; });
      av.hidden = false; scrollTo(0, 0); root.classList.remove('agent-boot');
      requestAnimationFrame(() => { av.classList.add('on'); md.focus({ preventScroll: true }); });
    };
    if (instant || RM) show(); else { site.style.opacity = '0'; setTimeout(show, 200); }
  }
  function close() {
    if (!on) return; on = false;
    btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Agent view: the page as a plain Markdown resume');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* sandbox */ }
    av.classList.remove('on');
    const back = () => {
      av.hidden = true; site.hidden = false; chrome.forEach(c => { if (c) c.style.visibility = ''; });
      requestAnimationFrame(() => { site.style.opacity = '1'; scrollTo(0, y); resizeAll(); spy(); });
    };
    if (RM) back(); else setTimeout(back, 200);
  }
  btn.addEventListener('click', () => (on ? close() : open()));
  $('#agentBack').addEventListener('click', close);
  $('#agentCopy').addEventListener('click', async e => {
    const lbl = e.currentTarget; const ok = await copyText(md.textContent);
    if (ok) { flash(lbl, 'Copied'); say('Markdown copied'); }
    else { const s = getSelection(), r = document.createRange(); r.selectNodeContents(md); s.removeAllRanges(); s.addRange(r); flash(lbl, 'Selected: press Ctrl or ⌘ + C', 2400); }
  });
  addEventListener('hashchange', () => { if (location.hash === '#agent') open(); else if (on) close(); });
  return { open, close, get on() { return on; } };
})();

if (location.hash === '#agent') Agent.open(true);

addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!sheet.hidden) { closeSheet(); return; }
  if (Agent.on) Agent.close();
});

/* =====================================================================
   BOOT
   ===================================================================== */
function resizeAll() { Lens.resize(); How.resize(); AboutTiles.resize(); Shelf.layout(); Graph.resize(); placeHL(); Statement.update(); }
let rz = 0;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { resizeAll(); spy(); }, 120); });

try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* sandbox */ }
const fontsReady = document.fonts && document.fonts.load
  ? Promise.all([
      document.fonts.load('600 48px "TikTok Sans"'), document.fonts.load('400 16px "TikTok Sans"'), document.fonts.load('700 200px "TikTok Sans"', '?'),
      document.fonts.load('400 12px "IBM Plex Mono"'), document.fonts.load('400 24px "Reenie Beanie"'), document.fonts.load('500 40px "Noto Sans Devanagari"', 'हिन्दी')
    ]).catch(() => null)
  : Promise.resolve();
Promise.race([fontsReady, wait(2600)]).then(() => {
  resizeAll(); spy();
  const h = location.hash;
  if (h && h !== '#agent' && h.length > 1 && document.getElementById(h.slice(1))) { go(h, false); requestAnimationFrame(() => go(h, false)); }
  requestAnimationFrame(() => {
    root.classList.add('ready');
    H1.intro();
    setTimeout(() => Mj.hello(), RM ? 0 : 520);
    Loop.kick();
  });
});
onTheme();

// small hooks for QA scripts
window.__om = {
  state: () => ({ nav: NAVS[navCur], sec: SECS[secCur][0], open: pill.classList.contains('open'), work: Work.state(), agent: Agent.on, theme: isDark() ? 'dark' : 'light', h1: H1.i }),
  match: q => Ask.match(q),
  graph: () => Graph.nodes.slice(0, 3).map(n => [n.label, Math.round(n.x), Math.round(n.y)]),
  hubs: () => { const r = $('#graph').getBoundingClientRect(); return Graph.nodes.filter(n => n.hub).map(n => ({ label: n.label, x: Math.round(r.left + n.x), y: Math.round(r.top + n.y) })); }
};
})();
