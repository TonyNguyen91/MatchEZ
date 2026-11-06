/* Trục số tương tác + nhiệt kế */
(function () {
  'use strict';
  const M = MathEZ, h = M.h, NS = 'http://www.w3.org/2000/svg';
  const S = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const T = (attrs, text) => { const t = S('text', attrs); t.textContent = text; return t; };
  const svgPoint = (svg, e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };

  function dragOn(svg, toVal, set, isLocked) {
    let dragging = false;
    svg.addEventListener('pointerdown', (e) => { if (isLocked()) return; dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (_) {} set(toVal(svgPoint(svg, e))); });
    svg.addEventListener('pointermove', (e) => { if (dragging && !isLocked()) set(toVal(svgPoint(svg, e))); });
    const stop = () => { dragging = false; };
    svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
  }

  /* ===== numberline =====
     q.min, q.max          khoảng trục số
     q.labels              'all' | 'sparse' (0 và bội của 5) | 'zero' | [các số]
     q.target              đáp án
     q.from                (tuỳ chọn) điểm xuất phát → vẽ mũi tên bước nhảy
     q.marks               [{v, label}] các điểm cho sẵn
     q.handleLabel         tên điểm người học đặt (A, M, 🐸…)
     q.showValue           hiện giá trị điểm đang đặt (mặc định: chỉ khi labels='all') */
  M.widgets.numberline = {
    render(box, q, ctx) {
      const min = q.min ?? -10, max = q.max ?? 10, lab = q.labels || 'all';
      const W = 640, H = q.from != null ? 175 : 135, pad = 30, ay = H - 52, st = (W - 2 * pad) / (max - min);
      const x = (v) => pad + (v - min) * st;
      const showVal = q.showValue ?? lab === 'all';
      const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'nl', role: 'img', 'aria-label': 'Trục số' });
      svg.innerHTML = '<defs><marker id="nlArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>';
      svg.append(S('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }));
      svg.append(S('line', { x1: 6, y1: ay, x2: W - 10, y2: ay, class: 'ax' }));
      svg.append(S('path', { d: `M${W - 4},${ay} l-13,-7 v14 z`, class: 'axh' }));
      for (let v = min; v <= max; v++) {
        const big = v % 5 === 0;
        svg.append(S('line', { x1: x(v), y1: ay - (big ? 11 : 7), x2: x(v), y2: ay + (big ? 11 : 7), class: 'tk' + (v === 0 ? ' zero' : '') }));
        const show = lab === 'all' || (lab === 'sparse' && v % 5 === 0) || (lab === 'zero' && v === 0) || (Array.isArray(lab) && lab.includes(v));
        if (show) svg.append(T({ x: x(v), y: ay + 34, class: 'lb' + (v < 0 ? ' neg' : v > 0 ? ' pos' : '') }, M.N(v)));
      }
      (q.marks || []).forEach((m) => {
        svg.append(S('circle', { cx: x(m.v), cy: ay, r: 7, class: 'mk' }));
        svg.append(T({ x: x(m.v), y: ay - 18, class: 'mkl' }, m.label));
      });
      const arc = S('path', { class: 'jump', d: '', 'marker-end': 'url(#nlArr)' });
      const arcT = T({ class: 'jumpl', x: 0, y: 0 }, '');
      svg.append(arc, arcT);
      if (q.from != null) {
        svg.append(S('circle', { cx: x(q.from), cy: ay, r: 9, class: 'from' }));
        svg.append(T({ x: x(q.from), y: ay + 34, class: 'lb from-l' }, M.N(q.from)));
      }
      const g = S('g', { class: 'handle', visibility: 'hidden' });
      const hc = S('circle', { r: 12, cy: ay, class: 'hc' });
      const ht = T({ class: 'hl', y: ay - 22 }, '');
      g.append(hc, ht); svg.append(g);

      let val = null, locked = false;
      function set(v) {
        v = Math.max(min, Math.min(max, v));
        if (v === val) return;
        val = v;
        g.setAttribute('visibility', 'visible');
        hc.setAttribute('cx', x(v)); ht.setAttribute('x', x(v));
        const name = q.handleLabel || '';
        ht.textContent = showVal ? (name ? `${name} = ${M.N(v)}` : M.N(v)) : (name || '?');
        if (q.from != null) {
          const x1 = x(q.from), x2 = x(v), mx = (x1 + x2) / 2, ht2 = Math.min(62, 16 + Math.abs(x2 - x1) * 0.22);
          const d = v - q.from;
          arc.setAttribute('d', d === 0 ? '' : `M${x1},${ay - 10} Q${mx},${ay - 10 - ht2 * 2} ${x2},${ay - 12}`);
          arcT.setAttribute('x', mx); arcT.setAttribute('y', ay - 16 - ht2);
          arcT.textContent = d === 0 ? '' : (d > 0 ? `+${d}` : `−${-d}`) + ' bước';
          ht.textContent = q.handleLabel || '';
          ht.setAttribute('y', ay + 8); ht.classList.add('inside');
        }
        M.sfx('tap'); ctx.ready(true);
      }
      dragOn(svg, (p) => Math.round((p.x - pad) / st) + min, set, () => locked);
      box.append(h('div', { class: 'nl-wrap' }, svg), h('p', { class: 'help' }, q.help || 'Chạm hoặc kéo trên trục số để đặt điểm. (Có thể dùng phím ← →)'));
      return {
        check() {
          if (val === q.target) return true;
          let msg = '';
          if (q.from != null) msg = `Bạn đang dừng ở ${M.N(val)}.`;
          else if (!showVal) msg = `Điểm bạn đặt đang ở vị trí ${M.N(val)}.`;
          return { ok: false, msg };
        },
        lock() { locked = true; svg.classList.add('locked'); },
        showAnswer() { set(q.target); },
        onKey(e) { if (locked) return; if (e.key === 'ArrowLeft') set((val ?? 0) - 1); if (e.key === 'ArrowRight') set((val ?? 0) + 1); },
      };
    },
  };

  /* ===== thermo: nhiệt kế kéo được =====
     q.min, q.max, q.start, q.target */
  M.widgets.thermo = {
    render(box, q, ctx) {
      const min = q.min ?? -20, max = q.max ?? 40;
      const W = 170, H = 430, top = 26, bot = 352, cx = 62, st = (bot - top) / (max - min);
      const y = (v) => bot - (v - min) * st;
      const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'thermo', role: 'img', 'aria-label': 'Nhiệt kế' });
      svg.append(S('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }));
      svg.append(S('rect', { x: cx - 15, y: top - 14, width: 30, height: bot - top + 40, rx: 15, class: 'tube' }));
      svg.append(S('circle', { cx, cy: bot + 40, r: 28, class: 'tube' }));
      const merc = S('rect', { x: cx - 8, width: 16, rx: 8, class: 'merc' });
      svg.append(merc, S('circle', { cx, cy: bot + 40, r: 20, class: 'bulb' }));
      for (let v = min; v <= max; v++) {
        const big = v % 5 === 0;
        svg.append(S('line', { x1: cx + 19, y1: y(v), x2: cx + (big ? 33 : 26), y2: y(v), class: 'tk' + (v === 0 ? ' zero' : '') }));
        if (big) svg.append(T({ x: cx + 40, y: y(v) + 5, class: 'tl' + (v < 0 ? ' neg' : v > 0 ? ' pos' : ' zero') }, M.N(v)));
      }
      svg.append(S('line', { x1: cx - 22, y1: y(0), x2: cx + 19, y2: y(0), class: 'zeroline' }));
      const readout = h('div', { class: 'readout' });
      let val = q.start ?? 10, touched = false, locked = false;
      function draw() {
        merc.setAttribute('y', y(val)); merc.setAttribute('height', bot + 30 - y(val));
        readout.innerHTML = `<b class="${val < 0 ? 'neg' : val > 0 ? 'pos' : ''}">${M.N(val)}</b><span>°C</span>`;
        merc.classList.toggle('cold', val < 0);
        svg.querySelector('.bulb').classList.toggle('cold', val < 0);
      }
      function set(v) { v = Math.max(min, Math.min(max, v)); if (v === val && touched) return; val = v; touched = true; draw(); M.sfx('tap'); ctx.ready(true); }
      dragOn(svg, (p) => Math.round(min + (bot - p.y) / st), set, () => locked);
      draw();
      box.append(h('div', { class: 'thermo-wrap' }, svg, h('div', { class: 'thermo-side' }, readout, h('p', { class: 'help' }, 'Kéo lên / xuống trên nhiệt kế. (Phím ↑ ↓)'))));
      return {
        check() { return touched && val === q.target; },
        lock() { locked = true; },
        showAnswer() { set(q.target); },
        onKey(e) { if (locked) return; if (e.key === 'ArrowUp') { e.preventDefault(); set(val + 1); } if (e.key === 'ArrowDown') { e.preventDefault(); set(val - 1); } },
      };
    },
  };
})();
