/* ==========================================================
   equation – Tìm x bằng cách KÉO các phần tử qua lại dấu "="
   Mỗi vế là một cây biểu thức:
     {t:'num', v} | {t:'x'}
     {t:'sum',  terms:[{s:+1|-1, e}]}     tổng đại số
     {t:'prod', fs:[{op:'·'|':', e}]}      tích: các thừa số '·' là TỬ, các thừa số ':' là MẪU
   Luật (app tự áp dụng):
     • Kéo sang vế kia: số hạng ĐỔI DẤU; thừa số ở tử → xuống mẫu vế kia (chia); ở mẫu → lên tử (nhân)
     • Kéo trong cùng vế: ĐỔI CHỖ số hạng / thừa số (giao hoán) – dấu đi theo số
     • Phép tính toàn số được tô sáng, bé điền kết quả vào ô "= ?" bên cạnh để rút gọn
   ========================================================== */
(function () {
  'use strict';
  const M = MathEZ, h = M.h, N = M.N, P = M.P;

  /* ---------- Mô hình ---------- */
  const num = (v) => ({ t: 'num', v });
  const X = () => ({ t: 'x' });
  const sum = (terms) => ({ t: 'sum', terms });
  const prod = (fs) => ({ t: 'prod', fs });
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hasX = (n) => n.t === 'x' || (n.t === 'sum' && n.terms.some((t) => hasX(t.e))) || (n.t === 'prod' && n.fs.some((f) => hasX(f.e)));

  function norm(n) {
    if (n.t === 'sum') {
      let terms = [];
      n.terms.forEach((t) => { const e = norm(t.e); if (e.t === 'sum' && t.s === 1) terms.push(...e.terms); else terms.push({ s: t.s, e }); });
      if (terms.length > 1) terms = terms.filter((t) => !(t.e.t === 'num' && t.e.v === 0));
      if (!terms.length) return num(0);
      if (terms.length === 1) {
        const t = terms[0];
        if (t.s === 1) return t.e;
        if (t.e.t === 'num') return num(-t.e.v);
        if (t.e.t === 'prod' && t.e.fs[0].e.t === 'num') { const p = clone(t.e); p.fs[0].e = num(-p.fs[0].e.v); return p; }
      }
      return sum(terms);
    }
    if (n.t === 'prod') {
      const fs = [];
      n.fs.forEach((f) => {
        const e = norm(f.e);
        if (e.t === 'prod') e.fs.forEach((g) => fs.push({ op: f.op === '·' ? g.op : g.op === '·' ? ':' : '·', e: g.e }));
        else fs.push({ op: f.op, e });
      });
      const nums = fs.filter((f) => f.op === '·'), dens = fs.filter((f) => f.op === ':');
      if (!nums.length) nums.push({ op: '·', e: num(1) });
      const all = [...nums, ...dens];
      return all.length === 1 ? all[0].e : prod(all);
    }
    return n;
  }

  function fromOps(ops) {
    let c = X();
    for (const o of ops) {
      const e = num(o.v);
      if (o.op === '+' || o.op === '−') { const t = { s: o.op === '+' ? 1 : -1, e }; c = c.t === 'sum' ? sum([...c.terms, t]) : sum([{ s: 1, e: c }, t]); }
      else if (o.op === '·') c = prod([{ op: '·', e }, { op: '·', e: c }]);
      else c = prod([{ op: '·', e: c }, { op: ':', e }]);
    }
    return c;
  }
  const forward = (x, ops) => ops.reduce((v, o) => (o.op === '+' ? v + o.v : o.op === '−' ? v - o.v : o.op === '·' ? v * o.v : v / o.v), x);

  const getAt = (root, path) => path.reduce((n, seg) => (seg[0] === 't' ? n.terms[+seg.slice(1)].e : n.fs[+seg.slice(1)].e), root);
  function setAt(root, path, nn) {
    if (!path.length) return nn;
    const parent = getAt(root, path.slice(0, -1)), seg = path[path.length - 1], i = +seg.slice(1);
    if (seg[0] === 't') parent.terms[i].e = nn; else parent.fs[i].e = nn;
    return root;
  }

  /* ---------- Hiển thị ----------
     o = {chips, side, cands, active, bufs, inline}
     chips:  vẽ các ô kéo được;  inline: viết phép chia bằng dấu ":" thay vì phân số */
  function atom(n, path, o, paren) {
    const text = n.t === 'x' ? 'x' : paren ? P(n.v) : N(n.v);
    if (!o.chips) return text;
    return `<span class="eqchip${n.t === 'x' ? ' xc' : ''}" data-s="${o.side}" data-p="${path.join('/')}">${text}</span>`;
  }
  // phần rút gọn được: chỉ gạch chân vàng, ô điền kết quả nằm ở bàn phím bên dưới
  const hl = (key, o, html) => (o.chips ? `<span class="hl${o.active === key ? ' on' : ''}" data-c="${key}">${html}</span>` : html);

  function R(n, path, o, top) {
    if (n.t === 'num' || n.t === 'x') return atom(n, path, o, false);
    const key = o.side + ':' + path.join('/');
    const c = o.cands && o.cands.get(key);
    const units = top && o.chips;
    if (n.t === 'sum') {
      const parts = n.terms.map((t, j) => {
        const e = t.e, p = [...path, 't' + j];
        const body = e.t === 'sum' ? '(' + R(e, p, o) + ')' : e.t === 'prod' ? R(e, p, o) : atom(e, p, o, !(j === 0 && t.s === 1));
        const sg = j === 0 ? (t.s < 0 ? '−' : '') : t.s < 0 ? '−' : '+';
        if (units) return `<span class="unit" data-u="t${j}">${sg ? `<span class="sg">${sg}</span>` : ''}${body}</span>`;
        return (j === 0 ? sg : ` ${sg} `) + body;
      });
      let out = '';
      for (let j = 0; j < parts.length; j++) {
        if (c && j === c.i) { out += hl(key, o, parts[j] + parts[j + 1]); j++; continue; }
        out += parts[j];
      }
      return units ? out : `<span class="nw">${out}</span>`;
    }
    // prod (phân số nếu có mẫu)
    const nums = [], dens = [];
    n.fs.forEach((f, i) => (f.op === '·' ? nums : dens).push({ f, i }));
    const asFrac = dens.length && !o.inline;
    const sep = o.chips ? '<span class="op">·</span>' : ' · ';
    const fac = (it, groupSize) => {
      const e = it.f.e, p = [...path, 'f' + it.i];
      const needParen = (e.t === 'sum' || e.t === 'prod') && !(asFrac && groupSize === 1);
      const body = needParen ? '(' + R(e, p, o) + ')' : e.t === 'sum' || e.t === 'prod' ? R(e, p, o) : atom(e, p, o, true);
      return units ? `<span class="unit" data-u="f${it.i}" data-g="${it.f.op === '·' ? 'n' : 'd'}">${body}</span>` : body;
    };
    const join = (arr) => {
      let s = '';
      for (let k = 0; k < arr.length; k++) {
        if (c && c.kind === 'pair' && arr[k].i === c.i && arr[k + 1]) {
          s += (k ? sep : '') + hl(key, o, fac(arr[k], arr.length) + sep + fac(arr[k + 1], arr.length)); k++; continue;
        }
        s += (k ? sep : '') + fac(arr[k], arr.length);
      }
      return s;
    };
    let html;
    if (asFrac) html = `<span class="fr"><span class="fn">${join(nums)}</span><span class="fd">${join(dens)}</span></span>`;
    else html = join(nums) + dens.map((d) => ' : ' + fac(d, 2)).join('');
    if (c && c.kind === 'all') html = hl(key, o, html);
    return units ? html : `<span class="nw">${html}</span>`;
  }
  const T = (n) => R(n, [], { chips: false });                 // dạng phân số (lời giải)
  const Tin = (n) => R(n, [], { chips: false, inline: true }).replace(/<[^>]+>/g, ''); // một dòng (thông báo)
  const line = (st) => `<span class="nw">${T(st.sides[0])} = ${T(st.sides[1])}</span>`;

  /* ---------- Rút gọn ---------- */
  function cands(n, path, side, list) {
    const key = side + ':' + path.join('/');
    if (n.t === 'sum') {
      for (let i = 0; i < n.terms.length - 1; i++) {
        const a = n.terms[i], b = n.terms[i + 1];
        if (a.e.t === 'num' && b.e.t === 'num') { list.push({ side, path, key, kind: 'sum', i, value: a.s * a.e.v + b.s * b.e.v }); break; }
      }
      n.terms.forEach((t, j) => cands(t.e, [...path, 't' + j], side, list));
    } else if (n.t === 'prod') {
      const nums = [], dens = [];
      n.fs.forEach((f, i) => (f.op === '·' ? nums : dens).push({ f, i }));
      if (n.fs.every((f) => f.e.t === 'num')) {
        const a = nums.reduce((p, o) => p * o.f.e.v, 1), b = dens.reduce((p, o) => p * o.f.e.v, 1);
        if (b !== 0 && a % b === 0) list.push({ side, path, key, kind: 'all', value: a / b + 0 });
      } else {
        for (let k = 0; k < nums.length - 1; k++) {
          if (nums[k].f.e.t === 'num' && nums[k + 1].f.e.t === 'num') { list.push({ side, path, key, kind: 'pair', i: nums[k].i, j: nums[k + 1].i, value: nums[k].f.e.v * nums[k + 1].f.e.v }); break; }
        }
      }
      n.fs.forEach((f, j) => cands(f.e, [...path, 'f' + j], side, list));
    }
    return list;
  }
  const allCands = (st) => { const l = []; cands(st.sides[0], [], 0, l); cands(st.sides[1], [], 1, l); return l; };
  function applyCand(st, c) {
    const ns = clone(st); let root = ns.sides[c.side];
    const node = getAt(root, c.path);
    if (c.kind === 'sum') node.terms.splice(c.i, 2, c.i === 0 ? { s: 1, e: num(c.value) } : { s: c.value < 0 ? -1 : 1, e: num(Math.abs(c.value)) });
    else if (c.kind === 'pair') { node.fs[c.i].e = num(c.value); node.fs.splice(c.j, 1); }
    else root = setAt(root, c.path, num(c.value));
    ns.sides[c.side] = norm(root);
    return ns;
  }
  function candText(st, c) {
    const node = getAt(st.sides[c.side], c.path);
    if (c.kind === 'sum') return Tin(sum(node.terms.slice(c.i, c.i + 2)));
    if (c.kind === 'pair') return `${P(node.fs[c.i].e.v)} · ${P(node.fs[c.j].e.v)}`;
    return Tin(node);
  }

  /* ---------- Chuyển vế & đổi chỗ ---------- */
  const piece = (e) => (e.t === 'sum' || e.t === 'prod' ? '(' + Tin(e) + ')' : e.t === 'num' ? P(e.v) : 'x');
  const signed = (s, e) => (s < 0 ? '− ' : '+ ') + (e.t === 'prod' ? Tin(e) : piece(e));
  function addTerm(O, s, e) {
    if (O.t === 'num' && O.v === 0) return norm(sum([{ s, e }]));
    if (O.t === 'sum') return norm(sum([...O.terms, { s, e }]));
    return norm(sum([{ s: 1, e: O }, { s, e }]));
  }
  const applyOp = (O, op, e) => norm(O.t === 'prod' ? prod([...O.fs, { op, e }]) : prod([{ op: '·', e: O }, { op, e }]));

  function doMove(st, s, path) {
    const S = st.sides[s], O = st.sides[1 - s];
    let newS, newO, from, to, kind, note = '';
    if (S.t === 'x' || S.t === 'num') {
      if (S.t === 'num' && S.v === 0) return { ok: false, msg: 'Số 0 đứng một mình thì không cần chuyển.' };
      newS = num(0); newO = addTerm(O, -1, S); from = signed(1, S); to = signed(-1, S); kind = 'term';
    } else if (S.t === 'sum') {
      const i = +path[0].slice(1), t = S.terms[i];
      newS = norm(sum(S.terms.filter((_, k) => k !== i)));
      newO = addTerm(O, -t.s, t.e); from = signed(t.s, t.e); to = signed(-t.s, t.e); kind = 'term';
      if (t.e.t !== 'num' && t.e.t !== 'x') note = `<br><small>“${Tin(t.e)}” là <b>một số hạng</b> nên được chuyển cả cụm.</small>`;
    } else {
      const i = +path[0].slice(1), f = S.fs[i];
      if (path.length > 1) return { ok: false, msg: '✋ Phần <b>trong ngoặc</b> chưa chuyển riêng được. Hãy chuyển các thừa số <b>ngoài ngoặc</b> trước để ngoặc “mở ra”.' };
      const nNum = S.fs.filter((g) => g.op === '·').length, nDen = S.fs.length - nNum;
      if (f.op === '·' && nNum === 1 && nDen > 0) return { ok: false, msg: `✋ <b>${piece(f.e)}</b> đang là <b>số bị chia</b> (tử số) nên chưa chuyển được. Hãy chuyển <b>số chia</b> (mẫu số) trước.` };
      if (f.e.t === 'num' && f.e.v === 0) return { ok: false, msg: '✋ Không thể chia cho 0.' };
      const inv = f.op === '·' ? ':' : '·';
      newS = norm(prod(S.fs.filter((_, k) => k !== i))); newO = applyOp(O, inv, f.e);
      from = `${f.op} ${piece(f.e)}`; to = `${inv} ${piece(f.e)}`; kind = inv === ':' ? 'mul' : 'div';
      if (O.t === 'sum' && inv === ':') note = '<br><small>Cả vế kia được chia cho số đó, nên cả vế nằm trên gạch phân số.</small>';
    }
    const ns = { sides: [] }; ns.sides[s] = newS; ns.sides[1 - s] = newO;
    const rule = kind === 'term' ? (from[0] === '+' ? 'cộng ⟶ <b>trừ</b>' : 'trừ ⟶ <b>cộng</b>') : kind === 'mul' ? 'nhân ⟶ <b>chia</b>' : 'chia ⟶ <b>nhân</b>';
    return { ok: true, st: ns, from, to, msg: `<span class="eqchip mini">${from}</span> qua dấu = thành <span class="eqchip mini to">${to}</span> &nbsp;(${rule})${note}` };
  }

  function reorder(st, s, seg, pos) {
    const S = clone(st.sides[s]), i = +seg.slice(1);
    if (S.t === 'sum' && seg[0] === 't') { const [t] = S.terms.splice(i, 1); S.terms.splice(pos, 0, t); }
    else if (S.t === 'prod' && seg[0] === 'f') {
      const g = S.fs[i].op, grp = S.fs.filter((f) => f.op === g), other = S.fs.filter((f) => f.op !== g);
      const k = grp.indexOf(S.fs[i]); const [it] = grp.splice(k, 1); grp.splice(pos, 0, it);
      S.fs = g === '·' ? [...grp, ...other] : [...other, ...grp];
    } else return null;
    const ns = clone(st); ns.sides[s] = S;
    return JSON.stringify(ns) === JSON.stringify(st) ? null : ns;
  }

  const isDone = (st) => { const [a, b] = st.sides; return (a.t === 'x' && b.t === 'num') || (b.t === 'x' && a.t === 'num'); };

  function solverStep(st) {
    const cl = allCands(st);
    if (cl.length) return applyCand(st, cl[0]);
    const xs = hasX(st.sides[0]) ? 0 : 1, S = st.sides[xs];
    let p;
    if (S.t === 'x' || S.t === 'num') return null;
    if (S.t === 'sum') {
      const xi = S.terms.findIndex((t) => hasX(t.e));
      if (S.terms[xi].s < 0 && S.terms.length > 1) p = ['t' + xi];
      else { let j = -1; S.terms.forEach((t, k) => { if (!hasX(t.e)) j = k; }); p = ['t' + (j >= 0 ? j : xi)]; }
    } else {
      const xi = S.fs.findIndex((f) => hasX(f.e));
      if (S.fs[xi].op === ':') p = ['f' + xi];
      else {
        const nNum = S.fs.filter((g) => g.op === '·').length, nDen = S.fs.length - nNum;
        let j = -1; S.fs.forEach((f, k) => { if (!hasX(f.e) && !(f.op === '·' && nNum === 1 && nDen > 0)) j = k; });
        if (j < 0) return null; p = ['f' + j];
      }
    }
    const r = doMove(st, xs, p);
    return r.ok ? r.st : null;
  }
  function solveLines(st) {
    const lines = [line(st)]; let g = 0;
    while (!isDone(st) && g++ < 40) { const n = solverStep(st); if (!n) break; st = n; lines.push(line(st)); }
    return { lines, st };
  }

  M.eq = {
    num, X, sum, prod, fromOps, forward, text: (n) => T(norm(clone(n))),
    solve: (lhs, rhs) => solveLines({ sides: [norm(clone(lhs)), norm(clone(rhs))] }).lines,
    value: (lhs, rhs) => { const r = solveLines({ sides: [norm(clone(lhs)), norm(clone(rhs))] }).st; return isDone(r) ? (r.sides[0].t === 'num' ? r.sides[0].v : r.sides[1].v) : null; },
  };

  /* ---------- Widget ---------- */
  M.widgets.equation = {
    render(box, q, ctx) {
      let st = { sides: [norm(clone(q.lhs || fromOps(q.ops))), norm(clone(q.rhs || num(q.right)))] };
      let locked = false, active = null, cm = new Map();
      const bufs = {};
      const hist = [line(st)];

      const histBox = h('div', { class: 'eq-hist' });
      const sideEls = [h('div', { class: 'side' }), h('div', { class: 'side' })];
      const pans = [0, 1].map((s) => h('div', { class: 'pan', 'data-side': s }, h('small', null, s ? 'Vế phải' : 'Vế trái'), sideEls[s]));
      const balance = h('div', { class: 'balance' }, pans[0], h('div', { class: 'eqsign' }, '='), pans[1]);
      const status = h('div', { class: 'eq-status', 'aria-live': 'polite' });
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '±', '⌫', '✓'];
      const pad = h('div', { class: 'minipad' }, keys.map((k) => h('button', { type: 'button', class: 'mk' + (k === '✓' ? ' ok' : k === '±' || k === '⌫' ? ' fn' : ''), onclick: () => press(k) }, k === '±' ? '+/−' : k)));
      const padExpr = h('span', { class: 'pexpr' }), padAns = h('span', { class: 'ans-box empty' }, '?');
      const padHint = h('div', { class: 'help' });
      const padWrap = h('div', { class: 'minipad-wrap' }, padHint, h('div', { class: 'eq pad-eq' }, padExpr, h('span', null, '='), padAns), pad);
      box.append(
        h('p', { class: 'help' }, q.help || 'Kéo bất kỳ số nào – kể cả x – sang vế bên kia (qua dấu “=” thì đổi phép tính), hoặc kéo trong cùng một vế để đổi chỗ.'),
        histBox, balance, status, padWrap);

      const say = (html, cls) => { status.innerHTML = html; status.className = 'eq-status ' + (cls || ''); };
      const shake = (el) => { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };
      function fit(el) {
        el.style.fontSize = '';
        let fs = parseFloat(getComputedStyle(el).fontSize), g = 0;
        while (el.scrollWidth > el.clientWidth + 1 && fs > 12 && g++ < 30) { fs -= 1.5; el.style.fontSize = fs + 'px'; }
      }

      function draw() {
        const list = allCands(st);
        cm = new Map(list.map((c) => [c.key, c]));
        if (!active || !cm.has(active)) active = list.length ? list[0].key : null;
        [0, 1].forEach((s) => { sideEls[s].innerHTML = R(st.sides[s], [], { chips: !locked, side: s, cands: cm, active, bufs }, true); });
        box.querySelectorAll('.side .eqchip[data-p]').forEach(bindChip);
        box.querySelectorAll('.side .hl').forEach((el) => el.addEventListener('click', (e) => {
          if (locked || e.target.closest('.eqchip')) return;
          active = el.dataset.c; draw();
        }));
        padWrap.hidden = locked || !active;
        if (active) {
          padExpr.textContent = candText(st, cm.get(active));
          showBuf();
          padHint.textContent = list.length > 1
            ? 'Phần gạch chân vàng có thể rút gọn (không bắt buộc ngay). Chạm vào phần gạch chân khác để chọn.'
            : 'Phần gạch chân vàng có thể rút gọn – tính rồi điền kết quả (không bắt buộc ngay):';
        }
        histBox.innerHTML = '<div class="hist-t">📝 Lời giải của bạn</div>' + hist.map((l, i) => `<div class="hl-line${i === hist.length - 1 ? ' cur' : ''}">${l}</div>`).join('');
        requestAnimationFrame(() => { sideEls.forEach(fit); histBox.scrollTop = histBox.scrollHeight; });
        const done = isDone(st);
        if (done) say(`🎉 Đã tìm được <b>x = ${N(st.sides[0].t === 'num' ? st.sides[0].v : st.sides[1].v)}</b>. Bấm <b>Kiểm tra</b>!`, 'ok');
        ctx.ready(done);
      }

      function press(k) {
        if (locked || !active) return;
        if (k === '✓') return submit();
        let b = bufs[active] || '';
        if (k === '±') b = b.startsWith('-') ? b.slice(1) : '-' + b;
        else if (k === '⌫') b = b.slice(0, -1);
        else if (b.replace('-', '').length < 7) { if (b === '0') b = ''; if (b === '-0') b = '-'; b += k; }
        bufs[active] = b; M.sfx('tap');
        showBuf();
      }
      function showBuf() {
        const b = bufs[active] || '';
        padAns.textContent = b ? b.replace('-', '−') : '?';
        padAns.classList.toggle('empty', !b);
      }
      function submit() {
        const c = cm.get(active); const v = parseInt(bufs[active], 10);
        if (!c || isNaN(v)) return;
        if (v === c.value) {
          const txt = candText(st, c);
          st = applyCand(st, c); delete bufs[active]; active = null;
          hist.push(line(st)); M.sfx('ok');
          say(`✔ Đúng: ${txt} = <b>${N(v)}</b>`, 'info');
          draw();
        } else {
          M.sfx('bad'); shake(padAns);
          say(`Chưa đúng: <b>${candText(st, c)}</b> không bằng ${N(v)}. Tính lại nhé!`, 'bad');
        }
      }

      function bindChip(c) {
        const s = +c.dataset.s, path = c.dataset.p ? c.dataset.p.split('/') : [];
        const root = st.sides[s];
        let unitEl = c, seg = null;
        if (root.t === 'sum') { unitEl = c.closest('.unit') || c; seg = path[0]; }
        else if (root.t === 'prod' && path.length === 1) { unitEl = c.closest('.unit') || c; seg = path[0]; }
        let sx = 0, sy = 0, dragging = false, moved = false;
        // dấu đi theo số: badge = dấu/phép tính của phần đang kéo, lật ngay khi qua dấu "="
        let badge = null, made = false, orig = '', canMove = false, flippedNow = false;
        const FL = { '+': '−', '−': '+', '·': ':', ':': '·' };
        function prepBadge() {
          canMove = doMove(st, s, path).ok;
          badge = null; made = false;
          if (!canMove) return;
          if (root.t === 'prod' && seg) { badge = h('span', { class: 'sg tmp' }, unitEl.dataset.g === 'd' ? ':' : '·'); made = true; }
          else {
            badge = unitEl === c ? null : unitEl.querySelector(':scope > .sg');
            if (!badge) { badge = h('span', { class: 'sg tmp' }, '+'); made = true; }
          }
          if (made) { if (unitEl === c) c.prepend(badge); else unitEl.prepend(badge); }
          orig = badge.textContent; flippedNow = false;
        }
        function setFlip(on) {
          if (!badge || !canMove || on === flippedNow) return;
          flippedNow = on;
          badge.textContent = on ? FL[orig] : orig;
          unitEl.classList.toggle('flipped', on);
          if (on) M.sfx('tap');
        }
        function clearBadge() {
          if (!badge) return;
          if (made) badge.remove(); else badge.textContent = orig;
          unitEl.classList.remove('flipped'); badge = null; made = false;
        }
        c.addEventListener('pointerdown', (e) => {
          if (locked) return;
          e.preventDefault();
          dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
          try { c.setPointerCapture(e.pointerId); } catch (_) {}
          unitEl.classList.add('dragging');
          prepBadge();
        });
        c.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - sx, dy = e.clientY - sy;
          if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
          unitEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
          const ov = over(pans[1 - s], e);
          pans[1 - s].classList.toggle('over', ov);
          pans[s].classList.toggle('reorder', !!seg && moved && over(pans[s], e));
          setFlip(ov && moved);
        });
        const snap = () => {
          clearBadge();
          unitEl.style.transition = 'transform .25s'; unitEl.style.transform = '';
          setTimeout(() => { unitEl.style.transition = ''; }, 260);
        };
        c.addEventListener('pointerup', (e) => {
          if (!dragging) return;
          dragging = false; unitEl.classList.remove('dragging'); pans.forEach((p) => p.classList.remove('over', 'reorder'));
          const from = unitEl.getBoundingClientRect();
          if (!moved) { clearBadge(); move(s, path, from, false); return; }
          if (over(pans[1 - s], e)) { move(s, path, from, true); return; }
          if (seg && over(pans[s], e)) { reorderDrop(s, seg, unitEl, e.clientX) || snap(); return; }
          snap();
        });
        c.addEventListener('pointercancel', () => { dragging = false; clearBadge(); unitEl.style.transform = ''; unitEl.classList.remove('dragging'); });
      }
      const over = (pan, e) => { const r = pan.getBoundingClientRect(); return e.clientX >= r.left - 12 && e.clientX <= r.right + 12 && e.clientY >= r.top - 30 && e.clientY <= r.bottom + 30; };

      function reorderDrop(s, seg, unitEl, x) {
        const sibs = [...sideEls[s].querySelectorAll('.unit')].filter((el) => el !== unitEl && (!unitEl.dataset.g || el.dataset.g === unitEl.dataset.g));
        const pos = sibs.filter((el) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 < x; }).length;
        const ns = reorder(st, s, seg, pos);
        if (!ns) return false;
        st = ns; hist.push(line(st)); Object.keys(bufs).forEach((k) => delete bufs[k]); active = null;
        M.sfx('tap'); draw();
        say(`↔ Đã đổi chỗ trong cùng một vế – giá trị không đổi (tính chất <b>giao hoán</b>). Dấu luôn đi theo số của nó.`, 'info');
        return true;
      }

      function move(s, path, fromRect, alreadyFlipped) {
        if (locked) return;
        const r = doMove(st, s, path);
        if (!r.ok) { draw(); say(r.msg, 'bad'); M.sfx('bad'); shake(pans[s]); return; }
        st = r.st; hist.push(line(st));
        Object.keys(bufs).forEach((k) => delete bufs[k]); active = null;
        draw(); say(r.msg, 'info'); M.sfx('ok');
        fly(fromRect, alreadyFlipped ? r.to : r.from, r.to, sideEls[1 - s], pans[1 - s], alreadyFlipped);
      }
      function fly(from, t1, t2, toEl, pan, green) {
        if (!from) return;
        const g = h('div', { class: 'eqchip ghost' + (green ? ' flipped' : '') }, t1);
        g.style.left = from.left + 'px'; g.style.top = from.top + 'px';
        document.body.append(g);
        const to = toEl.getBoundingClientRect();
        const tx = to.left + to.width / 2 - 30 - from.left, ty = to.top + to.height / 2 - 22 - from.top;
        requestAnimationFrame(() => requestAnimationFrame(() => { g.style.transform = `translate(${tx}px, ${ty}px)`; }));
        setTimeout(() => { g.textContent = t2; g.classList.add('flipped'); }, 280);
        setTimeout(() => { g.remove(); pan.classList.remove('pop'); void pan.offsetWidth; pan.classList.add('pop'); }, 600);
      }

      draw();
      say('Mẹo: chuyển các số về phía <b>không có x</b>, để x đứng một mình.', 'info');
      return {
        check() { return isDone(st) ? true : { ok: false, msg: 'Chưa tìm xong x.' }; },
        lock() { locked = true; balance.classList.add('locked'); draw(); },
        showAnswer() {
          let g = 0;
          while (!isDone(st) && g++ < 40) { const n = solverStep(st); if (!n) break; st = n; hist.push(line(st)); }
          draw();
        },
        onKey(e) {
          if (/^[0-9]$/.test(e.key)) press(e.key);
          else if (e.key === '-' || e.key === '+') press('±');
          else if (e.key === 'Backspace') press('⌫');
        },
        onEnter() { if (active && bufs[active]) { submit(); return true; } return false; },
      };
    },
  };
})();
