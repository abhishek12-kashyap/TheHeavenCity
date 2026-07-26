/* ============================================================
   HEAVEN CITY — Interactions
============================================================ */
(function () {
  'use strict';

  // ---------- Utilities ----------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rupees = n => {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
    if (n >= 100000)   return '₹' + (n / 100000).toFixed(2) + ' L';
    return '₹' + n.toLocaleString('en-IN');
  };

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    setTimeout(() => {
      $('.loader')?.classList.add('-done');
      document.body.style.overflow = '';
      revealAll();
    }, 1200);
  });
  document.body.style.overflow = 'hidden';

  // ---------- Custom cursor ----------
  const cursor = $('.cursor');
  const cursorDot = $('.cursor-dot');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    (function raf() {
      x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18);
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, textarea, select, .plot-cell, .property, .feature, .am, .legal-card, .gal__item, .faq__q, .loc__card, .testi, .blog-card, .stat-card')) {
        cursor.classList.add('-active');
      }
    });
    document.addEventListener('mouseout', () => cursor.classList.remove('-active'));
  }

  // ---------- Nav scroll state ----------
  const nav = $('.nav');
  const progress = $('.scroll-progress__bar');
  const backTop = $('.floater.-top');
  function onScroll() {
    const y = window.scrollY;
    nav?.classList.toggle('-scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = ((y / h) * 100) + '%';
    if (backTop) backTop.classList.toggle('-show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('.floater.-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- Mobile drawer ----------
  const drawer = $('.drawer');
  $('.nav__hamburger')?.addEventListener('click', () => drawer?.classList.add('-open'));
  $('.drawer__close')?.addEventListener('click', () => drawer?.classList.remove('-open'));
  $$('.drawer__menu a').forEach(a => a.addEventListener('click', () => drawer?.classList.remove('-open')));

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('-in');
        io.unobserve(e.target);
        if (e.target.hasAttribute('data-counter')) animateCounter(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  function revealAll() {
    $$('.reveal, .reveal-stagger, [data-counter], .tr-line').forEach(el => io.observe(el));
  }

  // ---------- Counters ----------
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0');
    const duration = 1800;
    const start = performance.now();
    function step(t) {
      const p = clamp((t - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = target * eased;
      el.textContent = decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Hero canvas: gold particles ----------
  const heroCanvas = $('.hero__canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, particles;
    function resize() {
      W = heroCanvas.width = heroCanvas.offsetWidth * devicePixelRatio;
      H = heroCanvas.height = heroCanvas.offsetHeight * devicePixelRatio;
    }
    function initParticles() {
      const count = Math.min(120, Math.floor((W * H) / 40000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.25 - 0.05,
        a: Math.random() * 0.7 + 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    resize(); initParticles();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    let t = 0;
    function frame() {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);
      // vignette gradient
      const g = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.4, Math.max(W,H)*0.7);
      g.addColorStop(0, 'rgba(212,175,55,0.04)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx + Math.sin(t + p.phase) * 0.15;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        const alpha = p.a * (0.6 + 0.4 * Math.sin(t * 2 + p.phase));
        ctx.fillStyle = `rgba(245, 230, 168, ${alpha})`;
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    frame();
  }

  // ---------- Magnetic buttons ----------
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    el.addEventListener('click', ripple);
  });

  function ripple(e) {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const el = document.createElement('span');
    el.className = 'ripple';
    el.style.width = el.style.height = size + 'px';
    el.style.left = (e.clientX - r.left - size / 2) + 'px';
    el.style.top  = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(el);
    setTimeout(() => el.remove(), 620);
  }

  // ---------- Tilt effect on cards ----------
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -8;
      const ry = (px - 0.5) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // ============================================================
  // MASTER PLAN — zoom / pan / interactive plots
  // ============================================================
  const mpStage = $('.mp__canvas');
  const mpSvg = $('.mp__svg');
  if (mpStage && mpSvg && window.HEAVEN_PLOTS) {
    const plots = window.HEAVEN_PLOTS;
    const sectors = window.HEAVEN_SECTORS;

    // Compute layout. World coordinates in SVG.
    const CELL = 22; // px per plot
    const GAP = 4;
    const SECTOR_PADDING = 24;
    const SECTOR_GAP = 40;

    // Determine sector max cols/rows for uniform layout
    const SEC_COLS = 6;
    // Layout metrics per row
    const sectorWidths = [], sectorHeights = [];
    sectors.forEach((s, i) => {
      const col = i % SEC_COLS;
      const row = Math.floor(i / SEC_COLS);
      const w = s.cols * CELL + (s.cols - 1) * GAP + SECTOR_PADDING * 2;
      const h = s.rows * CELL + (s.rows - 1) * GAP + SECTOR_PADDING * 2 + 24;
      sectorWidths[i] = w; sectorHeights[i] = h;
    });
    // Row max heights
    const rowH = [0, 0];
    for (let i = 0; i < sectors.length; i++) {
      const row = Math.floor(i / SEC_COLS);
      rowH[row] = Math.max(rowH[row] || 0, sectorHeights[i]);
    }
    // Column max widths
    const colW = new Array(SEC_COLS).fill(0);
    for (let i = 0; i < sectors.length; i++) {
      const col = i % SEC_COLS;
      colW[col] = Math.max(colW[col], sectorWidths[i]);
    }
    // Sector origin
    const sectorOrigin = sectors.map((s, i) => {
      const col = i % SEC_COLS;
      const row = Math.floor(i / SEC_COLS);
      let x = 0;
      for (let c = 0; c < col; c++) x += colW[c] + SECTOR_GAP;
      let y = 0;
      for (let r = 0; r < row; r++) y += rowH[r] + SECTOR_GAP;
      return { x, y };
    });

    const totalW = colW.reduce((s, v) => s + v, 0) + SECTOR_GAP * (SEC_COLS - 1);
    const totalH = rowH.reduce((s, v) => s + v, 0) + SECTOR_GAP;
    const MARGIN = 80;
    const viewBox = { x: -MARGIN, y: -MARGIN, w: totalW + MARGIN * 2, h: totalH + MARGIN * 2 };
    mpSvg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

    // Build content
    const svgNS = 'http://www.w3.org/2000/svg';
    const bg = document.createElementNS(svgNS, 'g');
    bg.setAttribute('id', 'mp-bg');
    mpSvg.appendChild(bg);

    // Compass rose
    const compass = document.createElementNS(svgNS, 'g');
    compass.setAttribute('transform', `translate(${totalW + 20}, -40)`);
    compass.innerHTML = `
      <circle r="30" fill="rgba(11,18,32,0.6)" stroke="rgba(212,175,55,0.4)"/>
      <path d="M0,-24 L4,0 L0,4 L-4,0 Z" fill="#D4AF37"/>
      <path d="M0,24 L4,0 L0,-4 L-4,0 Z" fill="rgba(245,230,168,0.4)"/>
      <text y="-32" text-anchor="middle" fill="#D4AF37" font-family="JetBrains Mono, monospace" font-size="8">N</text>
    `;
    mpSvg.appendChild(compass);

    // Highway strip on top
    const highway = document.createElementNS(svgNS, 'g');
    const hwY = -40;
    highway.innerHTML = `
      <rect x="-40" y="${hwY - 8}" width="${totalW + 80}" height="16" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.3)" stroke-width="0.5"/>
      <line x1="-40" y1="${hwY}" x2="${totalW + 40}" y2="${hwY}" stroke="rgba(212,175,55,0.6)" stroke-width="0.6" stroke-dasharray="12,8"/>
      <text x="${totalW/2}" y="${hwY - 14}" text-anchor="middle" fill="#F5E6A8" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="4">YAMUNA EXPRESSWAY — 100 M ARTERIAL ROAD</text>
    `;
    mpSvg.appendChild(highway);

    // Bottom entry gate
    const gate = document.createElementNS(svgNS, 'g');
    const gY = totalH + 20;
    gate.innerHTML = `
      <rect x="${totalW/2 - 40}" y="${gY}" width="80" height="20" fill="none" stroke="rgba(212,175,55,0.5)" stroke-width="0.6"/>
      <text x="${totalW/2}" y="${gY + 13}" text-anchor="middle" fill="#F5E6A8" font-family="JetBrains Mono, monospace" font-size="7" letter-spacing="3">MAIN ENTRY GATE</text>
    `;
    mpSvg.appendChild(gate);

    // Central park (spans a big area)
    const parkG = document.createElementNS(svgNS, 'g');
    // Place central amenity band between rows
    const parkY = rowH[0] + SECTOR_GAP * 0.15;
    const parkH = SECTOR_GAP * 0.7;
    parkG.innerHTML = `
      <rect x="20" y="${parkY}" width="${totalW - 40}" height="${parkH}" rx="6" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.35)" stroke-width="0.5" stroke-dasharray="4,4"/>
      <text x="${totalW/2}" y="${parkY + parkH/2 + 3}" text-anchor="middle" fill="rgba(74,222,128,0.7)" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="4">CENTRAL GREEN BELT · CLUB HOUSE · TEMPLE · COMMERCIAL PLAZA</text>
    `;
    mpSvg.appendChild(parkG);

    // Sectors & plots
    const plotEls = new Map();
    const sectorGroups = new Map();

    sectors.forEach((s, i) => {
      const origin = sectorOrigin[i];
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('transform', `translate(${origin.x}, ${origin.y})`);
      // Sector border
      const border = document.createElementNS(svgNS, 'rect');
      border.setAttribute('x', -6);
      border.setAttribute('y', -6);
      border.setAttribute('width', sectorWidths[i] + 12 - SECTOR_PADDING * 2);
      border.setAttribute('height', sectorHeights[i] + 12 - SECTOR_PADDING * 2 - 24);
      border.setAttribute('fill', 'none');
      border.setAttribute('stroke', 'rgba(212,175,55,0.18)');
      border.setAttribute('stroke-width', '0.5');
      border.setAttribute('stroke-dasharray', '3,3');
      border.setAttribute('rx', '4');
      g.appendChild(border);
      // Sector label
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', 0);
      label.setAttribute('y', -12);
      label.setAttribute('fill', 'rgba(245,230,168,0.65)');
      label.setAttribute('font-family', 'JetBrains Mono, monospace');
      label.setAttribute('font-size', '8');
      label.setAttribute('letter-spacing', '3');
      label.textContent = `SECTOR ${s.code} · ${s.name.toUpperCase()}`;
      g.appendChild(label);

      mpSvg.appendChild(g);
      sectorGroups.set(s.code, g);
    });

    // Render each plot
    plots.forEach(p => {
      const g = sectorGroups.get(p.sector);
      const x = p.c * (CELL + GAP);
      const y = p.r * (CELL + GAP);
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', CELL);
      rect.setAttribute('height', CELL);
      rect.setAttribute('rx', '2');
      rect.setAttribute('data-plot', p.id);
      rect.setAttribute('class', 'mp-plot -' + p.status);
      rect.style.cursor = 'pointer';
      const fill = {
        available: 'rgba(74,222,128,0.55)',
        sold: 'rgba(239,68,68,0.6)',
        reserved: 'rgba(250,204,21,0.65)',
        booked: 'rgba(96,165,250,0.6)',
      }[p.status];
      rect.setAttribute('fill', fill);
      rect.setAttribute('stroke', 'rgba(0,0,0,0.3)');
      rect.setAttribute('stroke-width', '0.4');
      // corner mark
      if (p.isCorner) {
        rect.setAttribute('stroke', '#F5E6A8');
        rect.setAttribute('stroke-width', '1');
      }
      g.appendChild(rect);
      plotEls.set(p.id, rect);

      // Click / hover
      rect.addEventListener('click', (e) => {
        e.stopPropagation();
        showPopup(p, e.clientX, e.clientY);
      });
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('opacity', '0.85');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('opacity', '1');
      });
    });

    // Popup
    const popup = $('.mp__popup');
    function showPopup(p, cx, cy) {
      $('.mp__popup-title').textContent = `Plot ${p.number}`;
      const statusEl = $('.mp__popup-status');
      statusEl.textContent = p.status;
      const statusColor = {
        available: 'background:rgba(74,222,128,0.15);color:#4ADE80;',
        sold: 'background:rgba(239,68,68,0.15);color:#F87171;',
        reserved: 'background:rgba(250,204,21,0.15);color:#FACC15;',
        booked: 'background:rgba(96,165,250,0.15);color:#60A5FA;',
      }[p.status];
      statusEl.setAttribute('style', statusColor);

      $('#pu-sector').textContent = `${p.sector} · ${p.sectorName}`;
      $('#pu-area').innerHTML = `<em>${p.area}</em> <span style="font-size:12px;opacity:.5">sq.yd</span>`;
      $('#pu-price').innerHTML = `<em>${rupees(p.price)}</em>`;
      $('#pu-facing').textContent = p.facing;
      $('#pu-road').textContent = p.roadWidth + ' ft';
      const feats = [];
      if (p.isCorner) feats.push('Corner');
      if (p.isParkFacing) feats.push('Park Facing');
      if (p.isRoadFacing) feats.push('Road Facing');
      $('#pu-feat').textContent = feats.join(' · ') || 'Standard';

      // Position near cursor but within stage
      const stageRect = mpStage.getBoundingClientRect();
      const px = clamp(cx - stageRect.left + 16, 12, stageRect.width - 320);
      const py = clamp(cy - stageRect.top + 16, 12, stageRect.height - 280);
      popup.style.left = px + 'px';
      popup.style.top = py + 'px';
      popup.classList.add('-show');

      const bookBtn = $('#pu-book');
      bookBtn.disabled = p.status !== 'available';
      bookBtn.style.opacity = p.status !== 'available' ? '0.4' : '1';
      bookBtn.style.pointerEvents = p.status !== 'available' ? 'none' : '';
    }
    mpStage.addEventListener('click', () => popup.classList.remove('-show'));
    $('.mp__popup-close')?.addEventListener('click', (e) => { e.stopPropagation(); popup.classList.remove('-show'); });
    popup?.addEventListener('click', (e) => e.stopPropagation());

    // Pan / zoom
    let vb = { ...viewBox };
    let scale = 1;
    const MIN_SCALE = 0.5, MAX_SCALE = 4;

    function applyVB() {
      mpSvg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
      $('.mp__coords').textContent = `ZOOM ${(1/scale * 1).toFixed(2)}× · X ${Math.round(vb.x)} Y ${Math.round(vb.y)}`;
    }
    applyVB();

    function setZoom(newScale, cx, cy) {
      newScale = clamp(newScale, MIN_SCALE, MAX_SCALE);
      const stageRect = mpStage.getBoundingClientRect();
      cx = cx ?? stageRect.width / 2;
      cy = cy ?? stageRect.height / 2;
      // world coords under cursor
      const wx = vb.x + (cx / stageRect.width) * vb.w;
      const wy = vb.y + (cy / stageRect.height) * vb.h;
      const nvw = viewBox.w / newScale;
      const nvh = viewBox.h / newScale;
      vb.x = wx - (cx / stageRect.width) * nvw;
      vb.y = wy - (cy / stageRect.height) * nvh;
      vb.w = nvw; vb.h = nvh;
      scale = newScale;
      applyVB();
    }

    // Wheel zoom
    mpStage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = mpStage.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const delta = -e.deltaY * 0.002;
      setZoom(scale * (1 + delta), cx, cy);
    }, { passive: false });

    // Pan drag
    let dragging = false, startX = 0, startY = 0, startVB = null;
    mpStage.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'rect' && e.target.hasAttribute('data-plot')) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startVB = { ...vb };
      mpStage.setPointerCapture(e.pointerId);
    });
    mpStage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = mpStage.getBoundingClientRect();
      const dx = (e.clientX - startX) / rect.width * vb.w;
      const dy = (e.clientY - startY) / rect.height * vb.h;
      vb.x = startVB.x - dx;
      vb.y = startVB.y - dy;
      applyVB();
    });
    mpStage.addEventListener('pointerup', (e) => { dragging = false; try { mpStage.releasePointerCapture(e.pointerId); } catch (_){} });

    // Buttons
    $('.mp__ctrl.-in')?.addEventListener('click',   () => setZoom(scale * 1.3));
    $('.mp__ctrl.-out')?.addEventListener('click',  () => setZoom(scale / 1.3));
    $('.mp__ctrl.-reset')?.addEventListener('click', () => { vb = { ...viewBox }; scale = 1; applyVB(); });
  }

  // ============================================================
  // PLOT AVAILABILITY DASHBOARD
  // ============================================================
  const avlGrid = $('.avl__grid');
  if (avlGrid && window.HEAVEN_PLOTS) {
    const plots = window.HEAVEN_PLOTS;
    // Only show a subset for perf & clarity: show all 480 but a filtered view
    let activeStatus = 'all';
    let activeFeature = 'all';
    let searchQ = '';

    function render() {
      avlGrid.innerHTML = '';
      let counts = { all: 0, available: 0, sold: 0, reserved: 0, booked: 0 };
      plots.forEach(p => {
        counts.all++;
        counts[p.status]++;
      });
      // Update summary
      $('#sum-available').textContent = counts.available;
      $('#sum-sold').textContent = counts.sold;
      $('#sum-reserved').textContent = counts.reserved;
      $('#sum-booked').textContent = counts.booked;

      plots.forEach(p => {
        const cell = document.createElement('button');
        cell.className = 'plot-cell -' + p.status;
        if (p.isCorner) cell.classList.add('-corner');
        if (p.isParkFacing) cell.classList.add('-park');
        cell.textContent = p.number;
        cell.title = `Plot ${p.number} · ${p.sectorName} · ${rupees(p.price)}`;

        // Dim if filtered out
        const matchStatus = activeStatus === 'all' || p.status === activeStatus;
        const matchFeat = activeFeature === 'all'
          || (activeFeature === 'corner' && p.isCorner)
          || (activeFeature === 'park' && p.isParkFacing)
          || (activeFeature === 'road' && p.isRoadFacing);
        const matchSearch = !searchQ || String(p.number).includes(searchQ) || p.sector.toLowerCase().includes(searchQ.toLowerCase());
        if (!(matchStatus && matchFeat && matchSearch)) cell.classList.add('-dim');
        avlGrid.appendChild(cell);
      });
    }
    render();

    $$('.avl__filter').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-filter-type');
        const val = btn.getAttribute('data-filter-value');
        if (type === 'status') {
          $$('.avl__filter[data-filter-type="status"]').forEach(b => b.classList.remove('-active'));
          btn.classList.add('-active');
          activeStatus = val;
        } else if (type === 'feature') {
          $$('.avl__filter[data-filter-type="feature"]').forEach(b => b.classList.remove('-active'));
          btn.classList.add('-active');
          activeFeature = val;
        }
        render();
      });
    });

    $('.avl__search input')?.addEventListener('input', (e) => {
      searchQ = e.target.value.trim();
      render();
    });
  }

  // ============================================================
  // FAQ
  // ============================================================
  $$('.faq__item').forEach(item => {
    $('.faq__q', item)?.addEventListener('click', () => {
      const open = item.classList.contains('-open');
      $$('.faq__item').forEach(i => i.classList.remove('-open'));
      if (!open) item.classList.add('-open');
    });
  });

  // ============================================================
  // TESTIMONIALS SLIDER
  // ============================================================
  const track = $('.testis__track');
  if (track) {
    const items = $$('.testi', track);
    const dotsEl = $('.testis__dots');
    let idx = 0;
    let perView = window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
    const pages = Math.max(1, Math.ceil(items.length / perView));
    dotsEl.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'testis__dot' + (i === 0 ? ' -active' : '');
      d.addEventListener('click', () => { idx = i; update(); });
      dotsEl.appendChild(d);
    }
    function update() {
      track.style.transform = `translateX(-${idx * 100}%)`;
      $$('.testis__dot').forEach((d, i) => d.classList.toggle('-active', i === idx));
    }
    $('.testis__arrow.-prev')?.addEventListener('click', () => { idx = (idx - 1 + pages) % pages; update(); });
    $('.testis__arrow.-next')?.addEventListener('click', () => { idx = (idx + 1) % pages; update(); });
    // autoplay
    setInterval(() => { idx = (idx + 1) % pages; update(); }, 6000);
  }

  // ============================================================
  // GALLERY LIGHTBOX & FILTERS
  // ============================================================
  const lightbox = $('.lightbox');
  $$('.gal__item').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.getAttribute('data-cat');
      const label = el.querySelector('.gal__label .v')?.textContent || 'Gallery';
      const clone = el.querySelector('svg')?.cloneNode(true);
      const inner = $('.lightbox__inner');
      inner.innerHTML = '';
      if (clone) {
        clone.style.width = '80vw';
        clone.style.maxWidth = '1200px';
        clone.style.height = 'auto';
        inner.appendChild(clone);
      }
      const cap = document.createElement('div');
      cap.style.cssText = 'padding:16px 24px;background:#0B1220;color:#F7F4EE;font-family:Instrument Serif,serif;font-size:20px;';
      cap.textContent = label;
      inner.appendChild(cap);
      lightbox.classList.add('-show');
    });
  });
  $('.lightbox__close')?.addEventListener('click', () => lightbox.classList.remove('-show'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('-show'); });

  $$('.gal__filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      $$('.gal__filter').forEach(b => b.classList.remove('-active'));
      btn.classList.add('-active');
      $$('.gal__item').forEach(item => {
        const ic = item.getAttribute('data-cat');
        item.style.display = (cat === 'all' || ic === cat) ? '' : 'none';
      });
    });
  });

  // ============================================================
  // INVESTMENT CALCULATOR
  // ============================================================
  const areaEl = $('#inv-area');
  const yrsEl = $('#inv-years');
  const rateEl = $('#inv-rate');
  if (areaEl && yrsEl && rateEl) {
    function calc() {
      const area = +areaEl.value;
      const yrs = +yrsEl.value;
      const rate = +rateEl.value / 100;
      const price = area * 32000; // avg per sq.yd
      const future = price * Math.pow(1 + rate, yrs);
      const profit = future - price;
      const roi = ((future / price) - 1) * 100;
      $('#inv-area-v').textContent = area + ' sq.yd';
      $('#inv-years-v').textContent = yrs + ' Years';
      $('#inv-rate-v').textContent = (rate * 100).toFixed(0) + '%';
      $('#r-invest').innerHTML = rupees(price);
      $('#r-future').innerHTML = rupees(future);
      $('#r-profit').innerHTML = rupees(profit);
      $('#r-roi').innerHTML = roi.toFixed(0) + '<small> %</small>';
    }
    [areaEl, yrsEl, rateEl].forEach(el => el.addEventListener('input', calc));
    calc();
  }

  // ============================================================
  // THEME TOGGLE (light/dark accent)
  // ============================================================
  const themeBtn = $('.theme-toggle');
  themeBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('theme-light');
    themeBtn.classList.toggle('-light');
  });

  // ============================================================
  // Contact form (mock)
  // ============================================================
  $('.contact__form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = $('button[type=submit]', e.target);
    btn.textContent = '✓  Received — We\'ll call in 24h';
    btn.style.background = 'var(--avail)';
    btn.style.color = '#0B1220';
    setTimeout(() => e.target.reset(), 2500);
  });
})();
