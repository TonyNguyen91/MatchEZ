/* Mô hình chip: 🟡 = +1, 🔴 = −1. Một cặp 🟡🔴 = 0.
   q.start     [[dấu, số lượng], ...]  ví dụ [[1,5],[-1,3]] = 5 chip vàng, 3 chip đỏ
   q.take      {sign, n}  (phép trừ) cần lấy ra n chip mang dấu sign
   q.zeroPair  true → có nút "Thêm cặp 0"
   q.before    chữ trước ô đáp án;  q.answer  kết quả */
(function () {
  'use strict';
  const M = MathEZ, h = M.h;
  M.widgets.chips = {
    render(box, q, ctx) {
      let id = 0, chips = [], taken = 0, sel = null, locked = false;
      const add = (s, n) => { for (let k = 0; k < n; k++) chips.push({ s, id: id++ }); };
      (q.start || []).forEach(([s, n]) => add(s, n));

      const board = h('div', { class: 'chip-board' });
      const info = h('div', { class: 'chip-info' });
      const tray = q.take ? h('div', { class: 'chip-tray' }) : null;
      const bPair = h('button', { class: 'btn small', type: 'button', onclick: () => pairOne() }, 'Gạch 1 cặp ', h('i', { class: 'ci p' }, '+'), h('i', { class: 'ci m' }, '−'));
      const bZero = q.zeroPair ? h('button', { class: 'btn small', type: 'button', onclick: () => { if (locked) return; add(1, 1); add(-1, 1); M.sfx('tap'); draw(); } }, 'Thêm cặp 0 ', h('i', { class: 'ci p' }, '+'), h('i', { class: 'ci m' }, '−')) : null;

      function remove(list) {
        list.forEach((c) => { const el = board.querySelector(`[data-id="${c.id}"]`); if (el) el.classList.add('pop'); });
        M.sfx('tap');
        setTimeout(() => { chips = chips.filter((c) => !list.includes(c)); draw(); }, 260);
      }
      function pairOne() {
        if (locked) return;
        const p = chips.find((c) => c.s > 0), m = chips.find((c) => c.s < 0);
        if (p && m) { sel = null; remove([p, m]); }
      }
      function tap(c) {
        if (locked) return;
        if (q.take && c.s === q.take.sign) {
          if (taken >= q.take.n) return;
          taken++; chips = chips.filter((x) => x !== c); M.sfx('tap'); draw(); return;
        }
        if (sel && sel.s !== c.s) { const a = sel; sel = null; remove([a, c]); return; }
        sel = sel === c ? null : c; draw();
      }
      function draw() {
        board.innerHTML = '';
        chips.forEach((c) => board.append(h('button', {
          type: 'button', class: 'chip ' + (c.s > 0 ? 'p' : 'm') + (sel === c ? ' sel' : ''), 'data-id': c.id,
          'aria-label': c.s > 0 ? 'chip +1' : 'chip −1', onclick: () => tap(c),
        }, c.s > 0 ? '+' : '−')));
        if (!chips.length) board.append(h('span', { class: 'empty-board' }, 'Bảng trống = 0'));
        const np = chips.filter((c) => c.s > 0).length, nm = chips.length - np;
        info.innerHTML = `<span><i class="ci p">+</i> × ${np}</span><span><i class="ci m">−</i> × ${nm}</span>`;
        if (tray) tray.innerHTML = `Đã lấy ra: <b>${taken} / ${q.take.n}</b> chip <i class="ci ${q.take.sign > 0 ? 'p' : 'm'}">${q.take.sign > 0 ? '+' : '−'}</i>` + (taken === q.take.n ? ' ✔' : '');
        bPair.disabled = !(np && nm);
      }
      const pad = M.numpad((v) => ctx.ready(v !== null));
      box.append(...[
        h('p', { class: 'help' }, q.help || (q.take
          ? 'Chạm vào chip cần lấy ra. Thiếu chip? Bấm “Thêm cặp 0” – thêm 1 cặp (+, −) không làm đổi giá trị.'
          : 'Chạm 1 chip + rồi 1 chip − để gạch cặp (hoặc bấm nút). Cặp (+, −) bằng 0.')),
        board, info,
        h('div', { class: 'chip-actions' }, bPair, bZero),
        tray,
        h('div', { class: 'eq' }, h('span', { html: q.before || 'Kết quả =' }), pad.disp),
        pad.pad,
      ].filter(Boolean));
      draw();
      return {
        check() {
          if (pad.value() === q.answer) return true;
          return { ok: false, msg: q.take && taken < q.take.n ? `Bạn mới lấy ra ${taken}/${q.take.n} chip. Lấy đủ rồi đếm những chip còn lại nhé.` : 'Đếm lại số chip còn trên bảng sau khi gạch hết các cặp (+, −).' };
        },
        lock() { locked = true; pad.lock(); },
        showAnswer() { pad.set(q.answer); },
        onKey: pad.key,
      };
    },
  };
})();
