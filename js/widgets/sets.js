/* Dạng tương tác: multi (chọn tất cả), bins (phân loại), rect (xếp gạch hình chữ nhật) */
(function () {
  'use strict';
  const M = MathEZ, h = M.h;
  const label = (v) => (typeof v === 'number' ? M.N(v) : String(v));

  /* ===== multi: chọn TẤT CẢ đáp án đúng =====
     q.tokens [..], q.answer [..], q.cols (số cột, tuỳ chọn) */
  M.widgets.multi = {
    render(box, q, ctx) {
      const sel = new Set(); let locked = false;
      const ans = new Set(q.answer.map(String));
      const grid = h('div', { class: 'tokens', style: q.cols ? `grid-template-columns:repeat(${q.cols},1fr)` : '' });
      const btns = q.tokens.map((t) => {
        const b = h('button', { type: 'button', class: 'tok' + (typeof t === 'number' && t < 0 ? ' neg' : ''), html: label(t) });
        b.addEventListener('click', () => {
          if (locked) return;
          const k = String(t);
          if (sel.has(k)) sel.delete(k); else sel.add(k);
          b.classList.toggle('sel', sel.has(k));
          btns.forEach((x) => x.classList.remove('wrong'));
          M.sfx('tap'); ctx.ready(sel.size > 0);
        });
        b.dataset.k = String(t);
        return b;
      });
      grid.append(...btns);
      box.append(h('p', { class: 'help' }, q.help || 'Chạm để chọn tất cả các số thỏa mãn. Chạm lại để bỏ chọn.'), grid);
      return {
        check() {
          let right = 0, wrong = 0;
          btns.forEach((b) => {
            if (!sel.has(b.dataset.k)) return;
            if (ans.has(b.dataset.k)) right++; else { wrong++; b.classList.add('wrong'); }
          });
          if (!wrong && right === ans.size) return true;
          const parts = [];
          if (wrong) parts.push(`có ${wrong} số chọn nhầm (tô đỏ)`);
          if (right < ans.size) parts.push(`còn thiếu ${ans.size - right} số`);
          return { ok: false, msg: 'Bạn ' + parts.join(' và ') + '.' };
        },
        lock() { locked = true; grid.classList.add('locked'); },
        showAnswer() { sel.clear(); ans.forEach((k) => sel.add(k)); btns.forEach((b) => { b.classList.remove('wrong', 'sel'); if (ans.has(b.dataset.k)) b.classList.add('right'); }); },
      };
    },
  };

  /* ===== bins: xếp các số vào đúng nhóm =====
     q.items [..], q.bins ['Nhóm 1','Nhóm 2'], q.binOf(v) → chỉ số nhóm */
  M.widgets.bins = {
    render(box, q, ctx) {
      const items = M.shuffle(q.items.map((v, i) => ({ v, i, bin: -1 })));
      let selItem = null, locked = false;
      const pool = h('div', { class: 'bin-pool' });
      const binEls = q.bins.map((name, bi) => {
        const body = h('div', { class: 'bin-body' });
        const el = h('div', { class: 'bin', role: 'button', tabindex: '0' }, h('div', { class: 'bin-head', html: name }), body);
        el.addEventListener('click', (e) => {
          if (locked || e.target.closest('.card')) return;
          if (selItem) { selItem.bin = bi; selItem = null; M.sfx('tap'); draw(); }
        });
        el._body = body;
        return el;
      });
      const mk = (it) => {
        const b = h('button', { type: 'button', class: 'card' + (selItem === it ? ' sel' : '') + (it.wrong ? ' wrong' : '') + (it.right ? ' right' : ''), html: label(it.v) });
        b.addEventListener('click', () => {
          if (locked) return;
          items.forEach((x) => { x.wrong = false; });
          if (it.bin >= 0) { it.bin = -1; selItem = null; }
          else selItem = selItem === it ? null : it;
          M.sfx('tap'); draw();
        });
        return b;
      };
      function draw() {
        pool.innerHTML = ''; binEls.forEach((b) => { b._body.innerHTML = ''; b.classList.toggle('target', !!selItem); });
        items.forEach((it) => (it.bin < 0 ? pool : binEls[it.bin]._body).append(mk(it)));
        if (!pool.children.length) pool.append(h('span', { class: 'empty-board' }, 'Đã xếp hết ✔'));
        ctx.ready(items.every((it) => it.bin >= 0));
      }
      box.append(h('p', { class: 'help' }, 'Chạm vào một số, rồi chạm vào nhóm đúng của nó. Chạm số đã xếp để lấy ra.'),
        pool, h('div', { class: 'bins', style: `grid-template-columns:repeat(${q.bins.length},1fr)` }, binEls));
      draw();
      return {
        check() {
          let wrong = 0;
          items.forEach((it) => { it.wrong = q.binOf(it.v) !== it.bin; if (it.wrong) wrong++; });
          draw();
          return wrong ? { ok: false, msg: `Có ${wrong} số xếp chưa đúng nhóm (tô đỏ).` } : true;
        },
        lock() { locked = true; box.classList.add('locked'); },
        showAnswer() { items.forEach((it) => { it.bin = q.binOf(it.v); it.wrong = false; it.right = true; }); selItem = null; draw(); },
      };
    },
  };

  /* ===== rect: xếp n viên gạch thành các hàng =====
     q.n, q.cols (số viên mỗi hàng ban đầu), q.fixed (khóa nút đổi)
     q.options + q.answer → chế độ quan sát rồi chọn đáp án
     không có options → phải xếp thành hình chữ nhật ≥ 2 hàng, mỗi hàng ≥ 2 viên */
  M.widgets.rect = {
    render(box, q, ctx) {
      const n = q.n; let cols = q.cols || 1, locked = false, chosen = null;
      const grid = h('div', { class: 'tiles' });
      const info = h('div', { class: 'rect-info' });
      const lbl = h('b', null, '');
      const dec = h('button', { type: 'button', class: 'key fn', 'aria-label': 'bớt', onclick: () => setCols(cols - 1) }, '−');
      const inc = h('button', { type: 'button', class: 'key fn', 'aria-label': 'thêm', onclick: () => setCols(cols + 1) }, '+');
      const ctrl = h('div', { class: 'rect-ctrl' }, dec, h('span', null, 'Mỗi hàng: ', lbl, ' viên'), inc);
      function setCols(c) {
        if (locked || q.fixed) return;
        c = Math.max(1, Math.min(n, c)); if (c === cols) return;
        cols = c; M.sfx('tap'); draw();
        if (!q.options) ctx.ready(true);
      }
      function draw() {
        lbl.textContent = cols;
        grid.style.gridTemplateColumns = `repeat(${cols}, var(--tile))`;
        grid.innerHTML = '';
        const full = Math.floor(n / cols), r = n % cols;
        for (let k = 0; k < n; k++) grid.append(h('i', { class: k >= full * cols ? 'rem' : '' }));
        info.innerHTML = r === 0
          ? `<b>${full}</b> hàng × <b>${cols}</b> viên = ${n} → <span class="okc">vừa khít ✔</span>`
          : `<b>${full}</b> hàng đầy, <span class="remc">dư ${r} viên</span>`;
        dec.disabled = q.fixed || cols <= 1; inc.disabled = q.fixed || cols >= n;
      }
      box.append(h('div', { class: 'rect-wrap' }, grid), info);
      if (!q.fixed) box.append(ctrl);
      let opts = [];
      if (q.options) {
        const list = q.shuffle === false ? q.options : M.shuffle(q.options);
        const wrap = h('div', { class: 'choices' });
        opts = list.map((o) => {
          const b = h('button', { type: 'button', class: 'choice', html: `<span>${o}</span>` });
          b.addEventListener('click', () => { if (locked) return; chosen = o; opts.forEach((x) => x.classList.toggle('sel', x === b)); opts.forEach((x) => x.classList.remove('wrong')); M.sfx('tap'); ctx.ready(true); });
          b._v = o; return b;
        });
        wrap.append(...opts); box.append(wrap);
      }
      draw();
      return {
        check() {
          if (q.options) {
            const ok = String(chosen) === String(q.answer);
            opts.find((b) => b._v === chosen).classList.add(ok ? 'right' : 'wrong');
            return ok;
          }
          if (n % cols !== 0) return { ok: false, msg: `Còn dư ${n % cols} viên – chưa phải hình chữ nhật.` };
          if (cols < 2 || n / cols < 2) return { ok: false, msg: 'Cần ít nhất 2 hàng, và mỗi hàng ít nhất 2 viên.' };
          return true;
        },
        lock() { locked = true; box.classList.add('locked'); },
        showAnswer() {
          if (q.options) { chosen = q.answer; opts.forEach((b) => { b.classList.remove('wrong', 'sel'); if (b._v === q.answer) b.classList.add('right'); }); return; }
          for (let c = 2; c < n; c++) if (n % c === 0) { cols = c; break; }
          draw();
        },
      };
    },
  };
})();
