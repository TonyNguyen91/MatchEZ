/* Dạng tương tác cơ bản: chọn đáp án, nhập số, sắp xếp */
(function () {
  'use strict';
  const M = MathEZ, h = M.h;

  /* ===== choice: chọn 1 đáp án ===== */
  M.widgets.choice = {
    render(box, q, ctx) {
      let sel = null, locked = false;
      const opts = q.shuffle === false ? q.options.slice() : M.shuffle(q.options);
      const compact = opts.every((o) => String(o).replace(/<[^>]+>/g, '').length <= 4);
      const grid = h('div', { class: 'choices' + (compact ? ' compact' : '') });
      const btns = opts.map((o, i) => h('button', {
        class: 'choice', type: 'button', html: `<kbd>${i + 1}</kbd><span>${o}</span>`,
        onclick: () => {
          if (locked) return;
          sel = o; M.sfx('tap');
          btns.forEach((b, j) => { b.classList.toggle('sel', j === i); b.classList.remove('wrong'); });
          ctx.ready(true);
        },
      }));
      grid.append(...btns); box.append(grid);
      const idx = (v) => opts.findIndex((o) => String(o) === String(v));
      return {
        check() {
          const ok = String(sel) === String(q.answer);
          btns[idx(sel)].classList.add(ok ? 'right' : 'wrong');
          return ok;
        },
        lock() { locked = true; grid.classList.add('locked'); },
        showAnswer() { sel = opts[idx(q.answer)]; btns.forEach((b) => b.classList.remove('wrong', 'sel')); btns[idx(q.answer)].classList.add('right'); },
        onKey(e) { const n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) btns[n - 1].click(); },
      };
    },
  };

  /* ===== input: nhập số bằng bàn phím số ===== */
  M.widgets.input = {
    render(box, q, ctx) {
      const np = M.numpad((v) => ctx.ready(v !== null));
      if (q.table) box.append(h('div', { class: 'ptable', html: q.table }));
      box.append(
        h('div', { class: 'eq' }, h('span', { html: q.before || '' }), np.disp, h('span', { html: q.after || '' })),
        np.pad,
      );
      return {
        check() { return np.value() === q.answer; },
        lock() { np.lock(); },
        showAnswer() { np.set(q.answer); },
        onKey: np.key,
      };
    },
  };

  /* ===== sort: sắp xếp các số ===== */
  M.widgets.sort = {
    render(box, q, ctx) {
      const items = M.shuffle(q.items.map((v, i) => ({ v, i })));
      const desc = q.order === 'desc';
      let placed = [], locked = false;
      const row = h('div', { class: 'sort-row' }), pool = h('div', { class: 'sort-pool' });
      const sorted = () => items.slice().sort((a, b) => (desc ? b.v - a.v : a.v - b.v));
      function draw() {
        row.innerHTML = ''; pool.innerHTML = '';
        items.forEach((_, k) => {
          const it = placed[k];
          row.append(it
            ? h('button', { class: 'card ' + (it.v < 0 ? 'neg' : ''), type: 'button', onclick: () => { if (locked) return; placed.splice(k, 1); M.sfx('tap'); draw(); } }, M.N(it.v))
            : h('span', { class: 'slot' }));
          if (k < items.length - 1) row.append(h('span', { class: 'lt' }, desc ? '>' : '<'));
        });
        items.filter((it) => !placed.includes(it)).forEach((it) =>
          pool.append(h('button', { class: 'card ' + (it.v < 0 ? 'neg' : ''), type: 'button', onclick: () => { if (locked) return; placed.push(it); M.sfx('tap'); draw(); } }, M.N(it.v))));
        ctx.ready(placed.length === items.length);
      }
      box.append(h('p', { class: 'help' }, `Chạm vào các số theo thứ tự ${desc ? 'giảm dần' : 'tăng dần'}. Chạm lại số đã xếp để bỏ ra.`), row, pool);
      draw();
      return {
        check() {
          const s = sorted();
          const ok = placed.every((it, k) => it.v === s[k].v);
          return ok || { ok: false, msg: 'Thứ tự chưa đúng. Hãy hình dung các số trên trục số: số nào nằm xa nhất về bên trái?' };
        },
        lock() { locked = true; row.classList.add('locked'); },
        showAnswer() { placed = sorted(); draw(); },
      };
    },
  };
})();
