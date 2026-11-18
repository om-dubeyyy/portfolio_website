/* omdubey.com · live mini screens for the Lucidity work cards (registered on window.OM_MINI).
   Each entry is (sc, w, h) => ({ prompt, hold, reset(), async run(tk, P), final(P) }); js/site.js wires them to the cards.
   sc: the 520×340 .screen · w: the project in js/content.js · h: { $, $$, esc, sleep, wait, icon, RM, STOP, clamp, lerp }.
   Classes: each screen's root is .ui-lp/.ui-br/.ui-dp/.ui-cq/.ui-rd/.ui-ae; everything inside it starts with lu-,
   apart from the shared site pieces (pop/in, sk, w##, ichip, out, u-mono, uic, bub, typing). Styles: css/mini-lucidity.css.
   Every loop ends by easing back to its start state, so the next pass starts without a jump.
   All data on these screens is illustrative and masked: no customer, company or people names, no deal values. */
(function () {
'use strict';
const M = window.OM_MINI = window.OM_MINI || {};

/* ---------- shared ---------- */
const PIN = '<svg class="uic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 3.6h4.8l-.7 5 3.4 3.4v1.6H6.9V12l3.4-3.4Z"/><path d="M12 13.6v6.9"/></svg>';
const ARROW = '<svg class="uic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12h14"/><path d="M13.5 7l5 5-5 5"/></svg>';
const show = el => { el.classList.add('in'); return el; };
const hideAll = ui => ui.querySelectorAll('.pop.in').forEach(e => e.classList.remove('in'));
const showAll = ui => ui.querySelectorAll('.pop').forEach(e => e.classList.add('in'));
const each = (els, c, on) => els.forEach(e => e.classList.toggle(c, on !== false));
const prompt = (w, d) => (w && w.prompt) || d;
// eased 0→1 (cubic out) in ~40 ms steps; fn(t) draws each step
async function tween(ms, tk, h, fn) {
  const n = Math.max(4, Math.round(ms / 40));
  for (let i = 1; i <= n; i++) { fn(1 - Math.pow(1 - i / n, 3)); await h.sleep(ms / n, tk); }
}
// close a loop: the screen eases back to its start state while the prompt clears
async function ease(ui, back, tk, h, P) { ui.classList.add('lu-wipe'); back(); P.clear(); P.busy(false); await h.sleep(520, tk); }

/* ---------- 1 · GTM knowledge base: a question becomes SQL, then a short answer; agents read the same data over MCP ---------- */
M.kb = (sc, w, h) => {
  const { $, $$, icon, esc, sleep } = h;
  const PR = prompt(w, 'Which deals moved this week?');
  const SQL = 'SELECT deal, stage FROM deals\nWHERE stage_changed > now() - 7d';
  const ROWS = [['Deal A', 'Discovery', 'Demo'], ['Deal B', 'Demo', 'POC'], ['Deal C', 'POC', 'Negotiation']];
  sc.innerHTML = `<div class="ui ui-lp">
    <aside class="lu-rail"><p class="lu-brand"><span class="lu-logo">K</span><b>GTM wiki</b></p>
      <span class="lu-nav lu-on">${icon('i-chat')}Ask</span>
      <p class="u-mono lu-wiki">Wiki</p>
      <span class="lu-nav">${icon('i-work')}Accounts</span><span class="lu-nav lu-deals">${icon('i-revenue')}Deals<i></i></span>
      <span class="lu-nav">${icon('i-person')}Customers</span><span class="lu-nav">${icon('i-report')}Playbooks</span>
      <p class="u-mono lu-foot">~50 users<br>3k+ events</p></aside>
    <section class="lu-main"><header class="lu-head"><b>Ask the wiki</b><span class="u-mono">HubSpot + Gong · synced daily</span></header>
      <div class="lu-thread">
        <div class="bub me pop lu-ask">${esc(PR)}</div>
        <div class="pop lu-sql"><span class="lu-tag">SQL</span><code></code></div>
        <div class="bub bot pop lu-ans"><p>3 deals moved stage this week.</p>
          <div class="lu-dt">${ROWS.map(r => `<div class="pop lu-row"><b>${r[0]}</b><span class="lu-mask" title="Account masked"></span><span class="lu-stage"><em>${r[1]}</em>${ARROW}<em class="lu-to">${r[2]}</em></span></div>`).join('')}</div></div>
        <span class="ichip out pop lu-mcp">${icon('i-ai')}Also on MCP: Claude reads the same data</span>
      </div></section></div>`;
  const ui = $('.ui-lp', sc), th = $('.lu-thread', ui), ask = $('.lu-ask', ui), sql = $('.lu-sql', ui), code = $('code', sql);
  const ans = $('.lu-ans', ui), rows = $$('.lu-row', ui), mcp = $('.lu-mcp', ui), deals = $('.lu-deals', ui);
  const back = () => { hideAll(ui); sql.classList.remove('lu-typ'); deals.classList.remove('lu-hit', 'lu-ping'); $$('.typing', ui).forEach(e => e.remove()); };
  const dots = () => { const d = document.createElement('div'); d.className = 'typing pop'; d.innerHTML = '<i></i><i></i><i></i>'; th.insertBefore(d, ans); void d.offsetWidth; return show(d); };
  return {
    prompt: PR, hold: 120,
    reset() { back(); code.textContent = ''; ui.classList.remove('lu-wipe', 'lu-still'); },
    async run(tk, P) {
      await P.type(PR, tk, 36); P.busy(true); await sleep(150, tk);
      show(ask); P.clear(); await sleep(380, tk);
      show(sql); sql.classList.add('lu-typ'); deals.classList.add('lu-hit', 'lu-ping');
      for (const ch of SQL) { code.textContent += ch; await sleep(ch === '\n' ? 100 : 12, tk); }
      sql.classList.remove('lu-typ'); await sleep(200, tk);
      const d = dots(); await sleep(620, tk); d.remove(); deals.classList.remove('lu-ping');
      show(ans); await sleep(200, tk);
      for (const r of rows) { show(r); await sleep(140, tk); }
      P.busy(false); await sleep(300, tk);
      show(mcp); await sleep(2150, tk);
      await ease(ui, back, tk, h, P);
    },
    final(P) { ui.classList.add('lu-still'); showAll(ui); code.textContent = SQL; deals.classList.add('lu-hit'); P.set(PR); }
  };
};

/* ---------- 2 · Account briefs: liveness, cloud provider, why now, ranked roles and an org chart, then publish ---------- */
M.briefs = (sc, w, h) => {
  const { $, $$, icon, sleep } = h;
  const PR = prompt(w, 'Map this account for outreach');
  const STEPS = [
    ['Liveness check', 'Company is active'],
    ['Cloud provider: Azure', '<span class="lu-cf">CONFIRMED</span>3 sources'],
    ['Why now', 'New exec, migration'],
    ['Decision makers', 'Ranked by role']
  ];
  // role, masked-name width, org-chart node it maps to
  const DM = [['Buyer', 'w70', 3], ['Champion', 'w55', 6], ['Authority', 'w80', 0], ['Working level', 'w60', 7]];
  const NODES = [[108, 4], [40, 34], [108, 34], [176, 34], [10, 64], [70, 64], [146, 64], [206, 64]];
  const LET = { 0: 'A', 3: 'B', 6: 'C', 7: 'W' };
  const CHART = `<svg class="lu-chart" viewBox="0 0 252 84" aria-hidden="true">
      <path class="lu-line" pathLength="1" d="M126 20V27M58 27H194M58 27V34M126 27V34M194 27V34"/>
      <path class="lu-line" pathLength="1" d="M58 50V57M28 57H88M28 57V64M88 57V64"/>
      <path class="lu-line" pathLength="1" d="M194 50V57M164 57H224M164 57V64M224 57V64"/>
      ${NODES.map(([x, y], i) => `<g class="lu-node" style="transition-delay:${i * 45}ms"><rect x="${x}" y="${y}" width="36" height="16" rx="4.5"/>${LET[i] ? `<text x="${x + 18}" y="${y + 11}">${LET[i]}</text>` : ''}</g>`).join('')}
    </svg>`;
  sc.innerHTML = `<div class="ui ui-br">
    <div class="lu-head"><b>Account brief</b><span class="ichip out">Prospect</span><span class="u-mono">Account: (masked)</span><span class="u-mono pop lu-stat"><i></i><span></span></span></div>
    <div class="lu-body">
      <div class="lu-steps"><p class="u-mono lu-label">Research run</p>
        ${STEPS.map(s => `<div class="lu-step"><span class="lu-dot">${icon('i-check')}</span><div><b>${s[0]}</b><p class="pop lu-detail">${s[1]}</p></div></div>`).join('')}</div>
      <div class="lu-right">
        <div class="lu-dms"><p class="u-mono lu-label">Decision makers</p>
          ${DM.map((d, i) => `<div class="pop lu-dm"><span class="u-mono lu-rank">${i + 1}</span><i class="lu-av"></i><span class="sk ${d[1]}" title="Name masked"></span><span class="ichip out">${d[0]}</span></div>`).join('')}</div>
        <div class="lu-org"><p class="u-mono lu-label">Org chart</p>${CHART}</div>
      </div>
    </div>
    <div class="lu-foot"><span class="u-mono">Brief</span>${ARROW}${['Google Doc', 'HubSpot', 'GTM wiki'].map(t => `<span class="ichip out lu-pub">${icon('i-check')}${t}</span>`).join('')}<span class="u-mono lu-count">100+ briefs</span></div>
  </div>`;
  const ui = $('.ui-br', sc), st = $('.lu-stat', ui), stt = $('.lu-stat span', ui), steps = $$('.lu-step', ui), dets = $$('.lu-detail', ui);
  const dms = $$('.lu-dm', ui), org = $('.lu-org', ui), nodes = $$('.lu-node', ui), pubs = $$('.lu-pub', ui);
  const back = () => { hideAll(ui); each(steps, 'lu-run', false); each(steps, 'lu-ok', false); org.classList.remove('lu-draw'); each(nodes, 'lu-on', false); each(pubs, 'lu-on', false); ui.classList.remove('lu-busy'); };
  const tick = i => { steps[i].classList.remove('lu-run'); steps[i].classList.add('lu-ok'); show(dets[i]); };
  return {
    prompt: PR, hold: 120,
    reset() { back(); ui.classList.remove('lu-wipe', 'lu-still'); },
    async run(tk, P) {
      await P.type(PR, tk, 34); P.busy(true);
      stt.textContent = 'Researching'; show(st); ui.classList.add('lu-busy');
      for (let i = 0; i < 3; i++) { steps[i].classList.add('lu-run'); await sleep(i === 1 ? 500 : 360, tk); tick(i); await sleep(150, tk); }
      steps[3].classList.add('lu-run'); org.classList.add('lu-draw'); await sleep(480, tk);
      for (let i = 0; i < DM.length; i++) { show(dms[i]); nodes[DM[i][2]].classList.add('lu-on'); await sleep(200, tk); }
      tick(3); await sleep(260, tk);
      for (const c of pubs) { c.classList.add('lu-on'); await sleep(220, tk); }
      stt.textContent = 'Published'; ui.classList.remove('lu-busy'); P.busy(false);
      await sleep(1900, tk);
      await ease(ui, back, tk, h, P);
    },
    final(P) {
      ui.classList.add('lu-still'); showAll(ui); each(steps, 'lu-ok'); org.classList.add('lu-draw');
      DM.forEach(d => nodes[d[2]].classList.add('lu-on')); each(pubs, 'lu-on'); stt.textContent = 'Published'; P.set(PR);
    }
  };
};

/* ---------- 4 · CRM data quality: missing deal fields fill in, accuracy and Gong adherence pass their targets ---------- */
M.crm = (sc, w, h) => {
  const { $, $$, icon, sleep } = h;
  const PR = prompt(w, 'Run the daily adherence check');
  const F = ['Next step', 'Buying role', 'Close date', 'Cloud spend', 'Meeting booked'];
  const DEALS = ['Deal A', 'Deal B', 'Deal C', 'Deal D'];
  const MISS = [[0, 1], [1, 0], [1, 3], [2, 2], [2, 4], [3, 1]]; // [row, field]: missing at the start, fixed in this order
  const miss = (r, c) => MISS.some(m => m[0] === r && m[1] === c);
  const METERS = [['Accuracy', 86, 0, 80], ['Gong adherence', 89, 0, 85]]; // label, approximate value (shown as ~), decimals, target
  sc.innerHTML = `<div class="ui ui-cq">
    <div class="lu-head"><b>Daily adherence check</b><span class="ichip out">50+ properties</span><span class="u-mono lu-stat">HubSpot · deals</span></div>
    <div class="lu-table"><div class="lu-tr lu-th"><span>Deal</span>${F.map(f => `<span>${f}</span>`).join('')}</div>
      ${DEALS.map((d, r) => `<div class="lu-tr"><b>${d}</b>${F.map((f, c) => `<span class="lu-cell${miss(r, c) ? ' lu-miss' : ''}" data-rc="${r}${c}"><span class="lu-mark">${icon('i-check')}<em>missing</em></span></span>`).join('')}</div>`).join('')}</div>
    <div class="lu-meters">${METERS.map(m => `<div class="lu-meter"><span>${m[0]}</span><span class="lu-bar"><i class="lu-fill"></i><i class="lu-tick" style="left:${m[3]}%"></i></span><b class="lu-val">–</b><span class="u-mono lu-target">${icon('i-check')}target ${m[3]}%</span></div>`).join('')}</div>
    <div class="lu-foot"><span class="u-mono">Fixes run by n8n + HubSpot workflows</span><span class="ichip pop lu-kra">${icon('i-check')}KRAs: above target</span></div>
  </div>`;
  const ui = $('.ui-cq', sc), trs = $$('.lu-tr:not(.lu-th)', ui), meters = $$('.lu-meter', ui), kra = $('.lu-kra', ui);
  const fills = meters.map(m => $('.lu-fill', m)), vals = meters.map(m => $('.lu-val', m));
  const cell = (r, c) => $(`[data-rc="${r}${c}"]`, ui);
  const draw = t => METERS.forEach((m, i) => { const v = m[1] * t; fills[i].style.width = v + '%'; vals[i].textContent = (t >= 1 ? '~' : '') + v.toFixed(m[2]) + '%'; });
  const back = () => { hideAll(ui); $$('.lu-fix', ui).forEach(c => c.classList.remove('lu-fix')); each(trs, 'lu-scan', false); each(meters, 'lu-pass', false); };
  return {
    prompt: PR, hold: 120,
    reset() { back(); fills.forEach(f => { f.style.width = '0'; }); vals.forEach(v => { v.textContent = '–'; }); ui.classList.remove('lu-wipe', 'lu-still'); },
    async run(tk, P) {
      await P.type(PR, tk, 34); P.busy(true); await sleep(140, tk);
      for (const r of trs) { r.classList.add('lu-scan'); await sleep(150, tk); r.classList.remove('lu-scan'); }
      await sleep(120, tk);
      for (const [r, c] of MISS) { cell(r, c).classList.add('lu-fix'); await sleep(220, tk); }
      await sleep(160, tk);
      await tween(1100, tk, h, draw);
      each(meters, 'lu-pass'); await sleep(240, tk);
      show(kra); P.busy(false);
      await sleep(2050, tk);
      await ease(ui, back, tk, h, P);
    },
    final(P) { ui.classList.add('lu-still'); showAll(ui); MISS.forEach(([r, c]) => cell(r, c).classList.add('lu-fix')); draw(1); each(meters, 'lu-pass'); P.set(PR); }
  };
};

/* ---------- 5 · Engagement radar: thousands of posts screened, filters narrow them to a few worth a comment ---------- */
M.radar = (sc, w, h) => {
  const { $, $$, icon, sleep } = h;
  const PR = prompt(w, 'Find posts worth a comment today');
  const FIL = ['≤ 30 h old', '10+ reactions', 'no vendors', 'Azure first'];
  const WHY = ['too old', 'low activity', 'vendor post', 'lower priority'];
  const CUT = [2, 0, -1, 1, 1, -1, 0, 3]; // per card: the filter that drops it, -1 = kept
  const SK = [['w70', 'w40', 'w90', 'w60'], ['w55', 'w30', 'w85', 'w70'], ['w60', 'w40', 'w90', 'w80'], ['w70', 'w50', 'w80', 'w55'],
    ['w50', 'w40', 'w90', 'w60'], ['w70', 'w30', 'w85', 'w70'], ['w60', 'w50', 'w80', 'w60'], ['w55', 'w40', 'w90', 'w50']];
  const N = 11000, NF = '~11k'; // counts up, then settles on the rounded figure
  const fmt = v => (v < 1000 ? String(Math.round(v)) : (Math.floor(v / 100) / 10).toFixed(1) + 'k');
  sc.innerHTML = `<div class="ui ui-rd">
    <div class="lu-head"><span class="lu-radar"><i></i></span><div class="lu-title"><b>Engagement radar</b><span class="u-mono">LinkedIn · daily</span></div>
      <div class="lu-count"><span class="u-mono">Posts screened</span><b class="lu-num">0</b></div></div>
    <div class="lu-filters"><span class="u-mono">${icon('i-funnel')}Filters</span>${FIL.map(f => `<span class="ichip out lu-fil">${f}</span>`).join('')}</div>
    <div class="lu-feed">${CUT.map((k, i) => `<div class="pop lu-post"><div class="lu-body"><div class="lu-who"><i class="lu-av"></i><span><span class="sk ${SK[i][0]}"></span><span class="sk ${SK[i][1]}"></span></span></div>
      <span class="sk ${SK[i][2]}"></span><span class="sk ${SK[i][3]}"></span><span class="lu-rx"><i></i><i></i><i></i></span></div>
      ${k >= 0 ? `<em class="lu-why">${WHY[k]}</em>` : `<span class="lu-worth">${icon('i-chat')}Worth a comment</span>`}</div>`).join('')}</div>
    <div class="lu-foot">${icon('i-funnel')}<span><b>~200</b> surfaced in six weeks</span></div>
  </div>`;
  const ui = $('.ui-rd', sc), num = $('.lu-num', ui), fils = $$('.lu-fil', ui), posts = $$('.lu-post', ui);
  const back = () => { hideAll(ui); each(fils, 'lu-on', false); each(posts, 'lu-cut', false); each(posts, 'lu-keep', false); };
  return {
    prompt: PR, hold: 120,
    reset() { back(); num.textContent = '0'; ui.classList.remove('lu-wipe', 'lu-still'); },
    async run(tk, P) {
      await P.type(PR, tk, 32); P.busy(true);
      let k = 0;
      await tween(1400, tk, h, t => { num.textContent = fmt(N * t); while (k < posts.length && t >= k / posts.length * 0.85) show(posts[k++]); });
      num.textContent = NF; await sleep(200, tk);
      for (let f = 0; f < FIL.length; f++) {
        fils[f].classList.add('lu-on'); await sleep(220, tk);
        posts.forEach((c, i) => { if (CUT[i] === f) c.classList.add('lu-cut'); });
        await sleep(280, tk);
      }
      posts.forEach((c, i) => { if (CUT[i] < 0) c.classList.add('lu-keep'); });
      P.busy(false);
      await sleep(2100, tk);
      await ease(ui, back, tk, h, P);
    },
    final(P) {
      ui.classList.add('lu-still'); showAll(ui); num.textContent = NF; each(fils, 'lu-on');
      posts.forEach((c, i) => c.classList.add(CUT[i] < 0 ? 'lu-keep' : 'lu-cut')); P.set(PR);
    }
  };
};

/* ---------- 6 · AEO baseline: 10 buyer questions × 4 answer engines, each answer scored ---------- */
M.aeo = (sc, w, h) => {
  const { $, $$, icon, sleep } = h;
  const PR = prompt(w, 'Ask 4 AI engines 10 buyer questions');
  const EN = ['Claude', 'OpenAI', 'Gemini', 'Perplexity'];
  const Q = ['Best tool to cut Azure disk cost?', 'How to shrink oversized disks?', 'Auto-scale block storage safely?', 'Cut disk spend without downtime?',
    'Alternatives to manual resizing?', 'FinOps tools for storage waste?', 'Reduce idle disk cost on AWS?', 'Is storage autoscaling worth it?',
    'Best block-storage optimisers?', 'How do teams right-size disks?'];
  // an illustrative pattern only (r recommended · n named · a absent), mixed on purpose; it is not the real result
  const PAT = ['rnan', 'naar', 'anra', 'nrna', 'aann', 'rnaa', 'narn', 'annr', 'nraa', 'anan'];
  sc.innerHTML = `<div class="ui ui-ae">
    <div class="lu-head"><b>AEO baseline</b><span class="ichip out lu-run">${icon('i-check')}Run 1</span><span class="ichip out lu-run">${icon('i-check')}Run 2</span><span class="ichip out lu-sub">${icon('i-chat')}Brand subreddit</span></div>
    <div class="lu-grid"><div class="lu-gr lu-gh"><span class="u-mono">Buyer question</span>${EN.map(e => `<span class="lu-eng">${e}</span>`).join('')}</div>
      ${Q.map((q, i) => `<div class="lu-gr"><span class="lu-q"><em>${String(i + 1).padStart(2, '0')}</em>${q}</span>${PAT[i].split('').map(s => `<span class="lu-cell"><i class="lu-s lu-${s}"></i></span>`).join('')}</div>`).join('')}</div>
    <div class="lu-foot"><span class="lu-key"><i class="lu-s lu-r"></i>Recommended</span><span class="lu-key"><i class="lu-s lu-n"></i>Named</span><span class="lu-key"><i class="lu-s lu-a"></i>Absent</span><span class="u-mono lu-cap">Illustrative scoring</span></div>
  </div>`;
  const ui = $('.ui-ae', sc), runs = $$('.lu-run', ui), engs = $$('.lu-eng', ui), grs = $$('.lu-gr:not(.lu-gh)', ui), cells = $$('.lu-cell', ui);
  const col = c => grs.map(g => g.children[c + 1]);
  const back = () => { each(cells, 'lu-sc', false); each(cells, 'lu-qk', false); each(engs, 'lu-on', false); each(runs, 'lu-on', false); each(runs, 'lu-done', false); each(grs, 'lu-re', false); };
  return {
    prompt: PR, hold: 120,
    reset() { back(); ui.classList.remove('lu-wipe', 'lu-still'); },
    async run(tk, P) {
      await P.type(PR, tk, 28); P.busy(true); runs[0].classList.add('lu-on'); await sleep(180, tk);
      for (let c = 0; c < EN.length; c++) {
        const cs = col(c);
        engs[c].classList.add('lu-on'); each(cs, 'lu-qk'); await sleep(150, tk);
        for (const x of cs) { x.classList.add('lu-sc'); await sleep(34, tk); }
        await sleep(130, tk); engs[c].classList.remove('lu-on'); each(cs, 'lu-qk', false);
      }
      runs[0].classList.remove('lu-on'); runs[0].classList.add('lu-done'); runs[1].classList.add('lu-on'); await sleep(240, tk);
      for (const g of grs) { g.classList.add('lu-re'); await sleep(60, tk); g.classList.remove('lu-re'); }
      await sleep(200, tk); runs[1].classList.remove('lu-on'); runs[1].classList.add('lu-done'); P.busy(false);
      await sleep(2050, tk);
      await ease(ui, back, tk, h, P);
    },
    final(P) { ui.classList.add('lu-still'); each(cells, 'lu-sc'); each(runs, 'lu-done'); P.set(PR); }
  };
};
})();
