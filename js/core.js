/* MathEZ – lõi: lưu tiến độ, tiện ích, âm thanh, bàn phím số */
(function () {
  'use strict';
  const M = (window.MathEZ = { worlds: [], widgets: {} });

  /* ---------- Thế giới / bài học ---------- */
  M.addWorld = (w) => M.worlds.push(w);
  M.getWorld = (id) => M.worlds.find((w) => w.id === id);

  /* ---------- Lưu tiến độ (localStorage) ---------- */
  const KEY = 'mathez.v1';
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S.lessons = S.lessons || {};
  S.xp = S.xp || 0;
  S.streak = S.streak || { count: 0, last: null };
  S.review = S.review || [];
  M.state = S;
  M.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } };

  M.dayStr = (offset = 0) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  M.touchStreak = () => {
    const t = M.dayStr();
    if (S.streak.last === t) return;
    S.streak.count = S.streak.last === M.dayStr(-1) ? S.streak.count + 1 : 1;
    S.streak.last = t;
  };
  M.streakNow = () => (S.streak.last === M.dayStr() || S.streak.last === M.dayStr(-1) ? S.streak.count : 0);

  /* ---------- Ôn tập ngắt quãng (spaced repetition) ---------- */
  const BOX_DAYS = [1, 3, 7, 14];
  M.addMistake = (ref) => {
    const k = ref.join('|');
    let it = S.review.find((r) => r.k === k);
    if (!it) { it = { k, ref }; S.review.push(it); }
    it.box = 0; it.due = M.dayStr(1);
  };
  M.reviewResult = (k, ok) => {
    const i = S.review.findIndex((r) => r.k === k);
    if (i < 0) return;
    const it = S.review[i];
    if (ok) {
      it.box++;
      if (it.box >= BOX_DAYS.length) { S.review.splice(i, 1); return; }
      it.due = M.dayStr(BOX_DAYS[it.box]);
    } else { it.box = 0; it.due = M.dayStr(1); }
  };
  M.dueReviews = () => S.review.filter((r) => r.due <= M.dayStr());

  /* ---------- Tiện ích ---------- */
  M.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  M.randNZ = (a, b) => { let x; do { x = M.rand(a, b); } while (x === 0); return x; };
  M.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  M.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /** Số có dấu trừ thật: −5 */
  M.N = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));
  /** Số trong ngoặc khi âm: (−5) */
  M.P = (n) => (n < 0 ? '(−' + Math.abs(n) + ')' : String(n));

  /** Viết số có dấu cách hàng nghìn: 12 345 */
  M.F = (n) => (n < 0 ? '−' : '') + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  /** Lũy thừa dạng HTML: 2<sup>3</sup> */
  M.pw = (a, n) => `${a}<sup>${n}</sup>`;
  /** Phân số dạng HTML */
  M.frac = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  M.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  M.lcm = (a, b) => (a / M.gcd(a, b)) * b;
  M.divisors = (n) => { const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r; };
  M.isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  /** Phân tích ra thừa số nguyên tố: [[p, mũ], ...] */
  M.factor = (n) => { const r = []; for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) r.push([p, e]); } if (n > 1) r.push([n, 1]); return r; };
  M.fmtFactor = (f) => f.map(([p, e]) => (e === 1 ? String(p) : M.pw(p, e))).join(' · ');
  M.roman = (n) => { const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; } return s; };
  /** Tạo danh sách phương án không trùng, bắt đầu bằng đáp án đúng */
  M.uniq = (arr, k = 4) => { const out = []; for (const x of arr) if (x != null && !out.includes(String(x))) out.push(String(x)); return out.slice(0, k); };

  M.h = function (tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) for (const [k, v] of Object.entries(props)) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
    return e;
  };

  /* Trục số nhỏ dùng để minh hoạ trong thẻ khái niệm */
  M.miniLine = function (min, max, opts = {}) {
    const W = 560, H = 78, p = 24, st = (W - 2 * p) / (max - min), x = (v) => p + (v - min) * st, ay = 46;
    let s = `<svg class="mini" viewBox="0 0 ${W} ${H}" role="img"><defs><marker id="mArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>`;
    s += `<line x1="${p - 12}" y1="${ay}" x2="${W - p + 12}" y2="${ay}" class="ax"/>`;
    for (let v = min; v <= max; v++) {
      s += `<line x1="${x(v)}" y1="${ay - 6}" x2="${x(v)}" y2="${ay + 6}" class="tk${v === 0 ? ' zero' : ''}"/>`;
      s += `<text x="${x(v)}" y="${ay + 26}" class="lb${v < 0 ? ' neg' : v > 0 ? ' pos' : ''}">${M.N(v)}</text>`;
    }
    (opts.arcs || []).forEach((a) => {
      const x1 = x(a.from), x2 = x(a.to), mx = (x1 + x2) / 2;
      s += `<path d="M${x1},${ay - 8} Q${mx},${ay - 58} ${x2},${ay - 8}" class="arc" marker-end="url(#mArr)"/>`;
    });
    (opts.dots || []).forEach((d) => {
      s += `<circle cx="${x(d.v)}" cy="${ay}" r="7" class="dot ${d.c || ''}"/>`;
    });
    return s + '</svg>';
  };

  /* ---------- Âm thanh ---------- */
  let actx = null;
  M.sfx = function (type) {
    if (S.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, 0.08], [880, 0.14]], bad: [[220, 0.18]], win: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.3]], tap: [[520, 0.03]] }[type];
      let t = actx.currentTime;
      for (const [f, d] of seq) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type === 'bad' ? 'triangle' : 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(type === 'tap' ? 0.05 : 0.14, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + d);
        o.connect(g).connect(actx.destination);
        o.start(t); o.stop(t + d + 0.02);
        t += d * 0.9;
      }
    } catch (e) { /* trình duyệt không hỗ trợ */ }
  };

  /* ---------- Chặn phóng to bằng 2 ngón tay (iPad/iPhone bỏ qua user-scalable=no) ---------- */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) =>
    document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });

  /* ---------- Bàn phím ---------- */
  M.keyHandler = null;
  document.addEventListener('keydown', (e) => { if (M.keyHandler) M.keyHandler(e); });

  /* ---------- Bàn phím số trên màn hình (có nút đổi dấu) ---------- */
  M.numpad = function (onChange) {
    const h = M.h;
    let v = '', locked = false;
    const disp = h('span', { class: 'ans-box empty' }, '?');
    const api = {};
    const upd = () => {
      const empty = v === '' || v === '-';
      disp.textContent = v === '' ? '?' : v === '-' ? '−' : v.replace('-', '−');
      disp.classList.toggle('empty', empty);
      onChange && onChange(api.value());
    };
    const press = (k) => {
      if (locked) return;
      if (k === '±') v = v.startsWith('-') ? v.slice(1) : '-' + v;
      else if (k === '⌫') v = v.slice(0, -1);
      else {
        if (v.replace('-', '').length >= 7) return;
        if (v === '0') v = ''; if (v === '-0') v = '-';
        v += k;
      }
      M.sfx('tap'); upd();
    };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '±', '0', '⌫'];
    const pad = h('div', { class: 'numpad' }, keys.map((k) =>
      h('button', { class: 'key' + (k === '±' || k === '⌫' ? ' fn' : ''), type: 'button', 'aria-label': k === '±' ? 'đổi dấu' : k === '⌫' ? 'xoá' : k, onclick: () => press(k) }, k === '±' ? '+/−' : k)));
    api.disp = disp; api.pad = pad;
    api.value = () => { const n = parseInt(v, 10); return isNaN(n) ? null : n; };
    api.set = (n) => { v = String(n); disp.textContent = M.N(n); disp.classList.remove('empty'); };
    api.clear = () => { v = ''; upd(); };
    api.lock = () => { locked = true; pad.classList.add('locked'); };
    api.key = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === '-' || e.key === '−' || e.key === '+') press('±');
      else if (e.key === 'Backspace') press('⌫');
    };
    return api;
  };
})();
