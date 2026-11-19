"use strict";
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger) && !reduce;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const safeUrl = u => /^https:\/\//.test(u || '') ? u : '#';
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const fmtDate = d => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : ''; };

  /* ---------- Vice City clock + launch counter ---------- */
  const tick = () => {
    try { $('#clock').textContent = 'Vice City · ' + new Intl.DateTimeFormat('es-ES', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' ET'; } catch (e) {}
  };
  tick(); setInterval(tick, 30000);
  const LAUNCH = Date.UTC(2026, 10, 19, 5, 0, 0); // 19 nov 2026, medianoche ET
  const diff = Date.now() - LAUNCH;
  const days = Math.floor(Math.abs(diff) / 864e5);
  if (diff >= 0) { $('#launchLabel').textContent = 'Días en Leonida'; $('#launchN').textContent = days === 0 ? 'HOY' : days; $('#launchSub').textContent = days === 0 ? 'Sale hoy, 19 de noviembre' : 'Desde el 19 de noviembre de 2026'; }
  else { $('#launchLabel').textContent = 'Faltan'; $('#launchN').textContent = days + 1; $('#launchSub').textContent = 'días para el 19 de noviembre'; }
  $('#sDays').textContent = diff >= 0 ? days + 1 : 0;

  /* ---------- SIGNATURE: Leonida sunset (canvas 2D) ---------- */
  const cv = $('#sky'), cx = cv.getContext('2d');
  const S = { p: 0, tp: 0, mx: .5, tmx: .5 };
  const lerpC = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = a => `rgb(${a[0]},${a[1]},${a[2]})`;
  const DAY = { top: [58, 20, 92], mid: [255, 63, 142], low: [255, 162, 63], sea: [25, 160, 170] };
  const NIGHT = { top: [12, 5, 26], mid: [70, 18, 90], low: [190, 40, 120], sea: [16, 30, 60] };
  const palms = [{ x: .08, h: .62, lean: -.18, s: 1.1 }, { x: .18, h: .48, lean: .1, s: .85 }, { x: .86, h: .66, lean: .2, s: 1.15 }, { x: .95, h: .5, lean: -.08, s: .8 }, { x: .73, h: .38, lean: .05, s: .6 }];
  let W = 0, H = 0, DPR = 1;
  const size = () => { DPR = Math.min(devicePixelRatio || 1, 1.75); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); };
  size(); addEventListener('resize', size);
  addEventListener('pointermove', e => { S.tmx = e.clientX / innerWidth; }, { passive: true });
  const palm = (bx, by, h, lean, sc, t) => {
    const sway = Math.sin(t * .9 + bx * .01) * 6 * sc + (S.mx - .5) * 22 * sc;
    const tx = bx + lean * h + sway, ty = by - h;
    cx.strokeStyle = cx.fillStyle = '#12061f';
    cx.lineWidth = 9 * sc; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(bx, by); cx.quadraticCurveTo(bx + lean * h * .2, by - h * .55, tx, ty); cx.stroke();
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI + (i / 8) * Math.PI + Math.sin(t * 1.3 + i) * .05 + (S.mx - .5) * .15;
      const len = (70 + (i % 3) * 18) * sc;
      const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * .55 + len * .35;
      cx.lineWidth = 5 * sc; cx.beginPath(); cx.moveTo(tx, ty);
      cx.quadraticCurveTo(tx + Math.cos(a) * len * .6, ty + Math.sin(a) * len * .6 - 18 * sc, ex, ey); cx.stroke();
      for (let k = 1; k < 7; k++) { const u = k / 7; const px = tx + (ex - tx) * u, py = ty + (ey - ty) * u - Math.sin(u * Math.PI) * 14 * sc;
        cx.lineWidth = 2 * sc; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px + Math.cos(a + 1.2) * 16 * sc, py + 14 * sc); cx.stroke(); }
    }
  };
  let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(cv);
  const t0 = performance.now();
  const frame = now => {
    requestAnimationFrame(frame); if (!vis || !W) return;
    S.p += (S.tp - S.p) * .08; S.mx += (S.tmx - S.mx) * .05;
    const t = reduce ? 3 : (now - t0) / 1000, p = Math.min(1, S.p * 1.3);
    const horizon = H * .68;
    const top = lerpC(DAY.top, NIGHT.top, p), mid = lerpC(DAY.mid, NIGHT.mid, p), low = lerpC(DAY.low, NIGHT.low, p), sea = lerpC(DAY.sea, NIGHT.sea, p);
    const g = cx.createLinearGradient(0, 0, 0, horizon); g.addColorStop(0, rgb(top)); g.addColorStop(.62, rgb(mid)); g.addColorStop(1, rgb(low));
    cx.fillStyle = g; cx.fillRect(0, 0, W, horizon);
    // stars at night
    if (p > .2) { cx.fillStyle = `rgba(255,241,224,${(p - .2) * .9})`; for (let i = 0; i < 80; i++) { const sx = (Math.sin(i * 91.7) * .5 + .5) * W, sy = (Math.sin(i * 47.3) * .5 + .5) * horizon * .6; cx.fillRect(sx, sy, 1.5, 1.5); } }
    // sun (sets with scroll)
    const r = Math.min(W, H) * .2, sx = W * .5 + (S.mx - .5) * 30, sy = horizon - r * .35 + p * r * 1.6;
    cx.save(); cx.beginPath(); cx.rect(0, 0, W, horizon); cx.clip();
    const sg = cx.createLinearGradient(0, sy - r, 0, sy + r); sg.addColorStop(0, '#ffe08a'); sg.addColorStop(1, '#ff3f8e');
    cx.fillStyle = sg; cx.shadowColor = 'rgba(255,162,63,.8)'; cx.shadowBlur = 60;
    cx.beginPath(); cx.arc(sx, sy, r, 0, Math.PI * 2); cx.fill(); cx.shadowBlur = 0;
    cx.fillStyle = rgb(low); for (let i = 0; i < 7; i++) { const yy = sy + r * .1 + i * r * .14; cx.fillRect(sx - r, yy, r * 2, 2 + i * 1.6); }
    cx.restore();
    // sea
    const sg2 = cx.createLinearGradient(0, horizon, 0, H); sg2.addColorStop(0, rgb(sea)); sg2.addColorStop(1, '#150a24');
    cx.fillStyle = sg2; cx.fillRect(0, horizon, W, H - horizon);
    for (let i = 0; i < 26; i++) { const yy = horizon + 4 + i * i * 1.2; if (yy > H) break; const w = r * (1.6 - i * .045) + Math.sin(t * 2 + i) * 18;
      cx.fillStyle = `rgba(255,${190 - p * 80},${120 + p * 60},${.55 - i * .018})`; cx.fillRect(sx - w / 2 + Math.sin(t + i) * 10, yy, w, 2); }
    // neon skyline at night
    if (p > .05) { const a = Math.min(1, p * 1.4); cx.fillStyle = '#12061f'; let x = W * .26;
      for (let i = 0; i < 18; i++) { const bw = 18 + (i * 37 % 26), bh = 20 + (i * 53 % 70); cx.fillRect(x, horizon - bh, bw, bh);
        cx.fillStyle = `rgba(${i % 2 ? '25,211,197' : '255,63,142'},${a})`; for (let k = 0; k < bh / 9; k++) if ((i + k) % 3) cx.fillRect(x + 4, horizon - bh + 4 + k * 9, bw - 8, 2); cx.fillStyle = '#12061f'; x += bw + 4; if (x > W * .74) break; } }
    const k = Math.min(1, (W / H) * 1.1); palms.forEach(pl => palm(W * pl.x, H + 10, H * pl.h * (.55 + .45 * k), pl.lean, pl.s * Math.min(1.2, W / 1200 + .4), t));
  };
  requestAnimationFrame(frame);

  /* ---------- data from the artifact's database ---------- */
  let NEWS = [], VIDS = [], filter = 'Todo';
  const renderFeed = () => {
    const feed = $('#feed');
    const tags = ['Todo', ...new Set(NEWS.map(n => n.tag).filter(Boolean))];
    $('#filters').innerHTML = tags.map(t => `<button class="chip" type="button" aria-pressed="${t === filter}" data-t="${esc(t)}">${esc(t)}</button>`).join('');
    $$('#filters .chip').forEach(b => b.addEventListener('click', () => { filter = b.dataset.t; renderFeed(); }));
    const list = NEWS.filter(n => filter === 'Todo' || n.tag === filter);
    if (!list.length) { feed.innerHTML = `<div class="state"><b>Sin noticias en este tema</b><span>Prueba con otro filtro.</span></div>`; return; }
    const [lead, ...rest] = list;
    const side = rest.slice(0, 5), more = rest.slice(5);
    const metaH = n => `<div class="meta"><span class="pill">${esc(n.tag)}</span><span class="src">${esc(fmtDate(n.date))} · ${esc(n.source)}</span></div>`;
    feed.innerHTML = `
      <a class="lead" href="${esc(safeUrl(lead.url))}" target="_blank" rel="noopener noreferrer" data-cursor="Leer">
        <span class="stamp">${lead.date === new Date().toISOString().slice(0, 10) ? 'HOY' : 'PORTADA'}</span>
        ${metaH(lead)}<h3>${esc(lead.title)}</h3><p>${esc(lead.summary)}</p></a>
      <div class="list">${side.map(n => `<a class="item" href="${esc(safeUrl(n.url))}" target="_blank" rel="noopener noreferrer">${metaH(n)}<span class="arrow" aria-hidden="true">↗</span><h3>${esc(n.title)}</h3></a>`).join('')}</div>
      ${more.length ? `<div class="more">${more.map(n => `<a class="card" href="${esc(safeUrl(n.url))}" target="_blank" rel="noopener noreferrer">${metaH(n)}<h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p></a>`).join('')}</div>` : ''}`;
    bindCursor(feed);
    if (motion) gsap.from(feed.children, { y: 40, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out' });
  };
  const renderTicker = () => {
    const heads = NEWS.slice(0, 8).map(n => `<span>${esc(n.title)}</span>`).join('');
    $('#tick').innerHTML = heads ? heads + heads : '<span>Sin titulares todavía</span>';
  };
  const grads = ['linear-gradient(160deg,#3a145e,#ff3f8e 60%,#ffa23f)', 'linear-gradient(160deg,#0f2e4a,#19d3c5 55%,#ffa23f)', 'linear-gradient(160deg,#2a0f45,#a03fff 50%,#ff3f8e)', 'linear-gradient(160deg,#1b0f2c,#ff7a3c 55%,#ffe08a)'];
  const renderVids = () => {
    $('#tapes').innerHTML = VIDS.map((v, i) => `
      <a class="tape" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.youtubeId)}" target="_blank" rel="noopener noreferrer" data-cursor="Play">
        <div class="screen" style="--g:${grads[i % grads.length]}"><span class="sunset"></span><span class="rec mono">${esc(v.kind || 'Vídeo')}</span><span class="play" aria-hidden="true"></span><span class="t">${esc(v.title)}</span></div>
        <div class="row"><span class="src">${esc(v.channel || 'Rockstar Games')} · YouTube</span><span class="src">${esc(fmtDate(v.date))}</span></div>
      </a>`).join('') || '<div class="state"><b>Sin vídeos todavía</b></div>';
    bindCursor($('#tapes'));
  };
  const renderMeta = m => {
    if (!m) return;
    if (m.updatedAt) { const d = new Date(m.updatedAt); const s = isNaN(d) ? '' : d.toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      $('#updated').textContent = 'Actualizado ' + s; $('#footUpdated').textContent = 'Última actualización: ' + s; }
    if (m.metascore) $('#sMeta').textContent = m.metascore;
  };

  (async () => {
    const timer = setTimeout(() => { if (!NEWS.length) $('#state').innerHTML = '<b>La señal tarda en llegar</b><span>Las noticias están tardando en cargar. Recarga la página en un momento.</span>'; }, 10000);
    try {
      const [r, rs] = await Promise.all([fetch('data.json?v=' + Date.now(), { cache: 'no-store' }), fetch('sources.json', { cache: 'no-store' })]);
      if (!r.ok || !rs.ok) throw new Error('load');
      const d = await r.json(), src = await rs.json();
      const domains = (src.newsDomains || []).map(x => String(x).toLowerCase());
      const hostOk = u => { try { const x = new URL(u); const h = x.hostname.toLowerCase(); return x.protocol === 'https:' && !x.username && !x.password && domains.some(dm => h === dm || h.endsWith('.' + dm)); } catch (e) { return false; } };
      const str = (v, n) => typeof v === 'string' && v.trim() && v.length <= n;
      d.news = (Array.isArray(d.news) ? d.news : []).filter(n => n && str(n.title, 160) && str(n.summary, 600) && str(n.source, 60) && /^\d{4}-\d{2}-\d{2}$/.test(n.date || '') && hostOk(n.url)).slice(0, 150);
      d.videos = (Array.isArray(d.videos) ? d.videos : []).filter(v => v && /^[A-Za-z0-9_-]{11}$/.test(v.youtubeId || '') && v.channel === src.videoChannel && str(v.title, 160)).slice(0, 24);
      d.metascore = Number.isInteger(d.metascore) && d.metascore >= 0 && d.metascore <= 100 ? d.metascore : null;
      clearTimeout(timer);
      NEWS = (d.news || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.addedAt || '').localeCompare(a.addedAt || ''));
      VIDS = (d.videos || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      $('#sNews').textContent = NEWS.length; $('#sVids').textContent = VIDS.length;
      if (NEWS.length) { renderFeed(); renderTicker(); } else $('#feed').innerHTML = '<div class="state"><b>Aún no hay noticias</b><span>La actualización diaria añadirá aquí las primeras.</span></div>';
      renderVids(); renderMeta(d);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    } catch (e) {
      clearTimeout(timer);
      $('#state').innerHTML = '<b>No se pudieron cargar las noticias</b><span>Recarga la página más tarde.</span>';
    }
  })();

  /* ---------- cursor ---------- */
  const cur = $('#cursor'); let px = innerWidth / 2, py = innerHeight / 2, ccx = px, ccy = py;
  function bindCursor(root) { if (!fine) return; root.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('pointerenter', () => { cur.dataset.label = el.dataset.cursor; cur.classList.add('is-big'); }); el.addEventListener('pointerleave', () => cur.classList.remove('is-big')); }); }
  if (fine && !reduce) {
    addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; cur.style.opacity = 1; }, { passive: true });
    (function loop() { ccx += (px - ccx) * .18; ccy += (py - ccy) * .18; cur.style.transform = `translate(${ccx}px,${ccy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  }

  /* ---------- motion (GSAP + Lenis) ---------- */
  if (!motion) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const el = a.getAttribute('href').length > 1 && $(a.getAttribute('href')); if (!el) return; e.preventDefault(); lenis.scrollTo(el, { offset: -60, duration: 1.4 }); }));
  }
  gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
    .from('#h1 .mask > span', { yPercent: 110, rotate: 3, stagger: .1 })
    .from('.hero .kicker .mono', { y: 14, opacity: 0, stagger: .06, duration: 1 }, .2)
    .from('.launch', { x: 40, opacity: 0 }, .35);
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => S.tp = s.progress });
  gsap.to('.hero .wrap', { yPercent: -16, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // ticker with scroll velocity
  const row = $('#tick'); let x = 0, v = 0;
  ScrollTrigger.create({ onUpdate: s => v = s.getVelocity() / 260 });
  gsap.ticker.add(() => { v *= .92; x -= 1.1 + Math.abs(v); const w = row.scrollWidth / 2; if (w > 0 && x <= -w) x += w; row.style.transform = `translate3d(${x}px,0,0) skewX(${gsap.utils.clamp(-10, 10, -v)}deg)`; });

  $$('.head h2').forEach(h => {
    h.innerHTML = h.innerHTML.split('<br>').map(l => `<span class="mask"><span>${l}</span></span>`).join('<br>');
    gsap.from(h.querySelectorAll('.mask > span'), { yPercent: 110, stagger: .1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // timeline: horizontal pin on desktop with drawn road line
  const road = $('#camino'), lane = $('#lane'), line = $('#roadline');
  gsap.matchMedia().add('(min-width: 900px)', () => {
    road.classList.add('is-pinned');
    const dist = () => Math.max(0, lane.scrollWidth - document.documentElement.clientWidth + 64);
    gsap.set(line, { scaleX: 0 });
    gsap.to(lane, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: road, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: s => gsap.set(line, { scaleX: s.progress }) } });
    return () => { road.classList.remove('is-pinned'); gsap.set(line, { scaleX: 1 }); };
  });

  // counters
  $$('.stat b').forEach(el => { const to = parseInt(el.textContent, 10); if (!to) return; const o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v) }); });
  gsap.from('.tape', { y: 50, opacity: 0, stagger: .08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#tapes', start: 'top 85%' } });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
