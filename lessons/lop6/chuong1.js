/* ==========================================================
   LỚP 6 · CHƯƠNG I · TẬP HỢP CÁC SỐ TỰ NHIÊN  (Bài 1 → Bài 7)
   ========================================================== */
(function () {
  const M = MathEZ, R = M.rand, F = M.F, pw = M.pw;

  /* ---------- Bộ sinh câu hỏi ---------- */
  const SETS = [
    { d: 'B = {x ∈ ℕ | x &lt; 8}', n: 'B', t: (v) => v < 8 },
    { d: 'C = {x ∈ ℕ* | x ≤ 5}', n: 'C', t: (v) => v >= 1 && v <= 5 },
    { d: 'D = {x ∈ ℕ | 4 &lt; x &lt; 10}', n: 'D', t: (v) => v > 4 && v < 10 },
    { d: 'E là tập hợp các số chẵn nhỏ hơn 12', n: 'E', t: (v) => v % 2 === 0 && v < 12 },
    { d: 'G = {x ∈ ℕ | 3 ≤ x ≤ 9}', n: 'G', t: (v) => v >= 3 && v <= 9 },
  ];
  const gMember = () => {
    const s = M.pick(SETS); const v = M.pick([0, 1, 3, 4, 5, 6, 8, 9, 10, 11, 12]); const ok = s.t(v);
    return {
      widget: 'choice', shuffle: false, options: ['∈', '∉'], answer: ok ? '∈' : '∉',
      prompt: `Cho ${s.d}. Chọn kí hiệu đúng: <span class="big">${v} ☐ ${s.n}</span>`,
      hint: 'Kiểm tra xem số đó có thỏa mãn điều kiện của tập hợp không. Nhớ: ℕ có số 0, còn ℕ* thì không.',
      explain: `${v} ${ok ? 'thỏa mãn' : 'không thỏa mãn'} điều kiện nên ${v} ${ok ? '∈' : '∉'} ${s.n}.`,
    };
  };
  const gListSet = () => {
    const a = R(0, 5), b = a + R(3, 6), strictA = Math.random() < 0.5;
    const lo = strictA ? a + 1 : a;
    const ans = []; for (let v = lo; v <= b; v++) ans.push(v);
    return {
      widget: 'multi', tokens: Array.from({ length: 13 }, (_, i) => i), answer: ans,
      prompt: `Chọn tất cả phần tử của <b>A = {x ∈ ℕ | ${a} ${strictA ? '&lt;' : '≤'} x ≤ ${b}}</b>.`,
      hint: '“&lt;” không lấy số ở đầu mút, “≤” thì có lấy.',
      explain: `A = {${ans.join('; ')}}.`,
    };
  };
  const gDigitValue = () => {
    const len = R(4, 6); let s = String(R(1, 9)); for (let i = 1; i < len; i++) s += R(0, 9);
    let pos; do { pos = R(0, len - 1); } while (s[pos] === '0');
    const d = +s[pos], k = len - 1 - pos, val = d * 10 ** k;
    const opts = M.uniq([val, d * 10 ** (k + 1), d * 10 ** Math.max(0, k - 1), d, d * 10 ** (k + 2)].map(F));
    const names = ['đơn vị', 'chục', 'trăm', 'nghìn', 'chục nghìn', 'trăm nghìn'];
    const marked = s.split('').map((c, i) => (i === pos ? `<u>${c}</u>` : c)).join('');
    return {
      widget: 'choice', options: opts, answer: F(val),
      prompt: `Trong số <b class="big">${marked}</b>, chữ số <b>${d}</b> được gạch chân có giá trị là:`,
      hint: 'Đếm từ phải sang: hàng đơn vị, chục, trăm, nghìn, chục nghìn…',
      explain: `Chữ số ${d} ở hàng ${names[k]} nên có giá trị ${d} · ${F(10 ** k)} = <b>${F(val)}</b>.`,
    };
  };
  const gRomanToNum = () => {
    const n = R(1, 30);
    return {
      widget: 'choice', options: M.uniq([n, n + 2, n > 2 ? n - 2 : n + 4, n + 10 <= 39 ? n + 10 : n - 10, n + 1]),
      answer: String(n), prompt: `Số La Mã <b class="big">${M.roman(n)}</b> có giá trị là:`,
      hint: 'I = 1, V = 5, X = 10. Chữ số nhỏ đứng TRƯỚC chữ số lớn thì trừ đi (IV = 4, IX = 9).',
      explain: `${M.roman(n)} = <b>${n}</b>.`,
    };
  };
  const gNumToRoman = () => {
    const n = M.pick([4, 9, 14, 19, 24, 29, 6, 11, 16, 23, 27, 12, 18]);
    const wrong = M.roman(n).replace('IV', 'IIII').replace('IX', 'VIIII');
    return {
      widget: 'choice', options: M.uniq([M.roman(n), wrong !== M.roman(n) ? wrong : M.roman(n + 2), M.roman(n + 1), M.roman(n - 1), M.roman(n + 5)]),
      answer: M.roman(n), prompt: `Số <b class="big">${n}</b> viết bằng số La Mã là:`,
      hint: 'Không viết một kí tự quá 3 lần liền nhau: 4 là IV chứ không phải IIII.',
      explain: `${n} = <b>${M.roman(n)}</b>.`,
    };
  };
  const gCompareBig = () => {
    const a = R(10000, 999999); let b = a;
    const s = String(a).split('');
    const r = Math.random();
    if (r < 0.15) b = a;
    else if (r < 0.6) { const i = R(1, s.length - 1); const t = s.slice(); t[i] = String((+t[i] + R(1, 9)) % 10); b = +t.join(''); }
    else b = a + M.pick([-1, 1]) * R(1, 999);
    if (b < 1000) b = a + 7;
    return {
      widget: 'choice', shuffle: false, options: ['&lt;', '=', '&gt;'], answer: a < b ? '&lt;' : a > b ? '&gt;' : '=',
      prompt: `Chọn dấu thích hợp: <span class="big">${F(a)} ☐ ${F(b)}</span>`,
      hint: 'Số nào nhiều chữ số hơn thì lớn hơn. Cùng số chữ số: so sánh từng hàng, từ trái sang phải.',
      explain: a === b ? 'Hai số bằng nhau.' : `${F(Math.min(a, b))} &lt; ${F(Math.max(a, b))}.`,
    };
  };
  const gPrevNext = () => {
    const n = M.pick([1000, 2400, 10000, 3990, 5009, 99999, 70100, 100000]);
    const after = Math.random() < 0.5;
    return {
      widget: 'input', before: `Số liền ${after ? 'sau' : 'trước'} của ${F(n)} là`, answer: after ? n + 1 : n - 1,
      prompt: 'Điền số thích hợp.', hint: after ? 'Số liền sau = số đó + 1.' : 'Số liền trước = số đó − 1.',
      explain: `Số liền ${after ? 'sau' : 'trước'} của ${F(n)} là <b>${F(after ? n + 1 : n - 1)}</b>.`,
    };
  };
  const gSortNat = () => {
    const base = R(1, 9) * 1000; const set = new Set();
    while (set.size < 5) set.add(base + R(0, 999));
    const items = [...set];
    return { widget: 'sort', items, prompt: 'Sắp xếp theo thứ tự <b>tăng dần</b>.', explain: items.slice().sort((x, y) => x - y).join(' &lt; ') };
  };
  const gQuickSum = () => {
    const a = R(11, 89), b = 100 - a, c = R(11, 99);
    return {
      widget: 'input', prompt: 'Tính nhanh:', before: `${a} + ${c} + ${b} =`, answer: a + b + c,
      hint: 'Tìm hai số cộng lại tròn trăm rồi cộng trước.',
      explain: `(${a} + ${b}) + ${c} = 100 + ${c} = <b>${100 + c}</b>.`,
    };
  };
  const gAddBig = () => { const a = R(100, 9999), b = R(100, 9999); return { widget: 'input', prompt: 'Tính:', before: `${F(a)} + ${F(b)} =`, answer: a + b, hint: 'Đặt tính thẳng hàng, cộng từ phải sang trái, nhớ sang hàng bên trái.', explain: `= <b>${F(a + b)}</b>` }; };
  const gSubBig = () => { let a = R(1000, 9999), b = R(100, 9999); if (b > a) [a, b] = [b, a]; return { widget: 'input', prompt: 'Tính:', before: `${F(a)} − ${F(b)} =`, answer: a - b, hint: 'Đặt tính thẳng hàng, trừ từ phải sang trái; không đủ trừ thì mượn 1 ở hàng bên trái.', explain: `= <b>${F(a - b)}</b>` }; };
  const gFindX = () => {
    const t = R(0, 2); let a, b, x, eq, how;
    if (t === 0) { x = R(10, 200); b = R(10, 200); a = x + b; eq = `x + ${b} = ${a}`; how = `x = ${a} − ${b}`; }
    else if (t === 1) { x = R(10, 150); b = R(10, 200); a = x + b; eq = `${a} − x = ${b}`; how = `x = ${a} − ${b}`; }
    else { x = R(50, 300); b = R(10, x - 1); a = x - b; eq = `x − ${b} = ${a}`; how = `x = ${a} + ${b}`; }
    return {
      widget: 'input', prompt: `Tìm số tự nhiên x, biết: <b class="big">${eq}</b>`, before: 'x =', answer: x,
      hint: t === 0 ? 'Số hạng chưa biết = tổng − số hạng đã biết.' : t === 1 ? 'Số trừ = số bị trừ − hiệu.' : 'Số bị trừ = hiệu + số trừ.',
      explain: `${how} = <b>${x}</b>.`,
    };
  };
  const gQuickMul = () => {
    const [p, q] = M.pick([[25, 4], [5, 2], [125, 8], [50, 2], [20, 5]]); const k = R(11, 99);
    return {
      widget: 'input', prompt: 'Tính nhanh:', before: `${p} · ${k} · ${q} =`, answer: p * q * k,
      hint: `Đổi chỗ để nhân ${p} · ${q} trước – được số tròn.`,
      explain: `(${p} · ${q}) · ${k} = ${p * q} · ${k} = <b>${F(p * q * k)}</b>.`,
    };
  };
  const gDistrib = () => {
    const a = R(12, 99), b = R(11, 89), c = 100 - b;
    return {
      widget: 'input', prompt: 'Tính nhanh:', before: `${a} · ${b} + ${a} · ${c} =`, answer: a * 100,
      hint: 'Dùng tính chất phân phối: a · b + a · c = a · (b + c).',
      explain: `${a} · (${b} + ${c}) = ${a} · 100 = <b>${F(a * 100)}</b>.`,
    };
  };
  const gMul = () => { const a = R(12, 250), b = R(3, 45); return { widget: 'input', prompt: 'Tính:', before: `${a} · ${b} =`, answer: a * b, hint: 'Có thể tách: ví dụ 37 · 12 = 37 · 10 + 37 · 2.', explain: `= <b>${F(a * b)}</b>` }; };
  const gRem = () => {
    const b = R(3, 12), q = R(4, 30), r = R(1, b - 1), a = b * q + r;
    return {
      widget: 'input', prompt: `Chia <b>${a}</b> cho <b>${b}</b>.`, before: 'Số dư =', answer: r,
      hint: `Tìm số lớn nhất nhân với ${b} mà không vượt quá ${a}.`,
      explain: `${a} = ${b} · ${q} + <b>${r}</b> (số dư ${r} &lt; ${b}).`,
    };
  };
  const gPowVal = () => {
    const [a, n] = M.pick([[2, 3], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [10, 4], [2, 10], [9, 2], [1, 7], [8, 2]]);
    return {
      widget: 'input', prompt: 'Tính giá trị lũy thừa:', before: `${pw(a, n)} =`, answer: a ** n,
      hint: `${pw(a, n)} = ${Array(n).fill(a).join(' · ')}`,
      explain: `${Array(n).fill(a).join(' · ')} = <b>${F(a ** n)}</b>.`,
    };
  };
  const gPowWrite = () => {
    const a = R(2, 9), n = R(3, 6);
    return {
      widget: 'choice', options: M.uniq([pw(a, n), pw(n, a), `${a} · ${n}`, pw(a, n - 1)]), answer: pw(a, n),
      prompt: `Viết gọn tích <b class="big">${Array(n).fill(a).join(' · ')}</b> bằng lũy thừa:`,
      hint: 'Cơ số là thừa số được lặp lại, số mũ là số lần lặp.',
      explain: `Có ${n} thừa số ${a} → <b>${pw(a, n)}</b>.`,
    };
  };
  const gPowMul = () => {
    const a = R(2, 9), m = R(2, 7), n = R(2, 6);
    return {
      widget: 'choice', options: M.uniq([pw(a, m + n), pw(a, m * n), pw(a * a, m + n), pw(a, m + n + 1)]), answer: pw(a, m + n),
      prompt: `Viết kết quả dưới dạng một lũy thừa: <span class="big">${pw(a, m)} · ${pw(a, n)}</span>`,
      hint: 'Nhân hai lũy thừa cùng cơ số: giữ nguyên cơ số, CỘNG các số mũ.',
      explain: `${pw(a, m)} · ${pw(a, n)} = ${pw(a, `${m}+${n}`)} = <b>${pw(a, m + n)}</b>.`,
    };
  };
  const gPowDiv = () => {
    const a = R(2, 9), n = R(2, 5), m = n + R(1, 6);
    return {
      widget: 'choice', options: M.uniq([pw(a, m - n), pw(a, m + n), pw(1, m - n), pw(a, m)]), answer: pw(a, m - n),
      prompt: `Viết kết quả dưới dạng một lũy thừa: <span class="big">${pw(a, m)} : ${pw(a, n)}</span>`,
      hint: 'Chia hai lũy thừa cùng cơ số: giữ nguyên cơ số, TRỪ các số mũ.',
      explain: `${pw(a, m)} : ${pw(a, n)} = ${pw(a, `${m}−${n}`)} = <b>${pw(a, m - n)}</b>.`,
    };
  };
  const gOps1 = () => {
    const a = R(2, 30), b = R(2, 12), c = R(2, 12);
    return { widget: 'input', prompt: 'Tính:', before: `${a} + ${b} · ${c} =`, answer: a + b * c, hint: 'Nhân trước, cộng sau.', explain: `${a} + ${b * c} = <b>${a + b * c}</b>` };
  };
  const gOps2 = () => {
    const a = R(2, 20), b = R(2, 20), c = R(2, 9), d = R(1, 20);
    return { widget: 'input', prompt: 'Tính:', before: `(${a} + ${b}) · ${c} − ${d} =`, answer: (a + b) * c - d, hint: 'Trong ngoặc trước, rồi nhân, cuối cùng trừ.', explain: `${a + b} · ${c} − ${d} = ${(a + b) * c} − ${d} = <b>${(a + b) * c - d}</b>` };
  };
  const gOps3 = () => {
    const b = R(2, 5), a = R(3, 9), sq = b * b, c = R(1, a * sq - 1);
    return { widget: 'input', prompt: 'Tính:', before: `${a} · ${pw(b, 2)} − ${c} =`, answer: a * sq - c, hint: 'Lũy thừa trước, rồi nhân, rồi trừ.', explain: `${a} · ${sq} − ${c} = ${a * sq} − ${c} = <b>${a * sq - c}</b>` };
  };
  const gOps4 = () => {
    const b = R(2, 9), q = R(2, 12), a = b * q, c = R(2, 9);
    return { widget: 'input', prompt: 'Tính:', before: `${a} : ${b} · ${c} =`, answer: q * c, hint: 'Nhân và chia cùng cấp → làm lần lượt từ trái sang phải.', explain: `${a} : ${b} = ${q}; ${q} · ${c} = <b>${q * c}</b>` };
  };

  const table = (rows) => '<table>' + rows.map((r, i) => `<tr${i === rows.length - 1 ? ' class="q"' : ''}>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + '</table>';

  M.addWorld({
    id: 'tap-hop-so-tu-nhien', order: 1, grade: 6, chapter: 'Chương I', title: 'Tập hợp các số tự nhiên', icon: '🔢',
    desc: 'Tập hợp, cách ghi số (cả số La Mã), thứ tự, bốn phép tính, lũy thừa và thứ tự thực hiện phép tính.',
    lessons: [
      /* ===== Bài 1 ===== */
      {
        title: 'Tập hợp', icon: '🧺', desc: 'Tập hợp là gì? Phần tử nào thuộc, phần tử nào không thuộc?',
        steps: [
          { kind: 'explore', widget: 'bins', title: 'Ai được vào giỏ?', items: [3, 7, 0, 5, 6, 12], bins: ['∈ A (thuộc A)', '∉ A (không thuộc A)'], binOf: (v) => (v < 6 ? 0 : 1),
            prompt: 'Cho <b>A</b> là tập hợp các số tự nhiên <b>nhỏ hơn 6</b>. Xếp mỗi số vào đúng nhóm.',
            hint: 'Số tự nhiên bắt đầu từ 0. “Nhỏ hơn 6” thì không lấy số 6.',
            explain: 'A = {0; 1; 2; 3; 4; 5}. Vậy 0, 3, 5 ∈ A; còn 6, 7, 12 ∉ A.' },
          { kind: 'concept', title: 'Tập hợp và phần tử',
            html: `<p>Một <b>tập hợp</b> là một nhóm đối tượng; mỗi đối tượng là một <b>phần tử</b>. Tên tập hợp viết bằng chữ in hoa, các phần tử viết trong dấu { }, ngăn cách bởi dấu “;”.</p>
              <div class="rule"><b>x ∈ A</b>: x thuộc A &nbsp;•&nbsp; <b>y ∉ A</b>: y không thuộc A</div>
              <p><b>Hai cách viết</b> một tập hợp:</p>
              <p>• Liệt kê các phần tử: A = {0; 1; 2; 3; 4; 5}</p>
              <p>• Chỉ ra tính chất đặc trưng: A = {x ∈ ℕ | x &lt; 6}</p>
              <div class="rule">ℕ = {0; 1; 2; 3; …} là tập hợp các số tự nhiên.<br>ℕ* = {1; 2; 3; …} là tập hợp các số tự nhiên <b>khác 0</b>.</div>` },
          { kind: 'practice', gen: gMember },
          { kind: 'practice', widget: 'multi', tokens: [0, 1, 2, 3, 4, 5, 6, 7], answer: [1, 2, 3, 4],
            prompt: 'Chọn tất cả phần tử của <b>B = {x ∈ ℕ* | x ≤ 4}</b>.', hint: 'ℕ* không có số 0. “≤ 4” thì có lấy số 4.', explain: 'B = {1; 2; 3; 4}.' },
          { kind: 'practice', widget: 'choice', options: ['{2; 3; 4; 5}', '{2; 3; 4; 5; 6}', '{3; 4; 5}', '{3; 4; 5; 6}'], answer: '{2; 3; 4; 5}',
            prompt: 'Viết tập hợp <b>M = {x ∈ ℕ | 2 ≤ x &lt; 6}</b> bằng cách liệt kê:', hint: 'Có lấy số 2 (vì ≤), không lấy số 6 (vì &lt;).', explain: 'M = {2; 3; 4; 5}.' },
          { kind: 'practice', gen: gListSet },
          { kind: 'practice', gen: gMember },
          { kind: 'practice', widget: 'choice', options: ['0 ∈ ℕ', '0 ∈ ℕ*', '5 ∈ ℕ*', '2,5 ∉ ℕ'], answer: '0 ∈ ℕ*',
            prompt: 'Khẳng định nào <b>sai</b>?', hint: 'ℕ* là các số tự nhiên khác 0.', explain: 'Số 0 không thuộc ℕ*, nên “0 ∈ ℕ*” là <b>sai</b>.' },
          { kind: 'challenge', widget: 'input', before: 'Số phần tử =', answer: 11,
            prompt: 'Tập hợp <b>C</b> gồm các số tự nhiên <b>chẵn</b> từ 10 đến 30 (kể cả 10 và 30). C có bao nhiêu phần tử?',
            hint: 'Liệt kê 10; 12; 14; … hoặc tính (30 − 10) : 2 + 1.', explain: '(30 − 10) : 2 + 1 = <b>11</b> phần tử.' },
        ],
      },
      /* ===== Bài 2 ===== */
      {
        title: 'Cách ghi số tự nhiên', icon: '✍️', desc: 'Giá trị của chữ số phụ thuộc vị trí – và cách người La Mã viết số.',
        steps: [
          { kind: 'explore', widget: 'choice', options: ['5', '50', '500', '5 000'], answer: '50',
            prompt: 'Trong số <b class="big">3 052</b>, chữ số <b>5</b> có giá trị là bao nhiêu?',
            hint: 'Chữ số 5 đứng ở hàng nào: đơn vị, chục, trăm hay nghìn?',
            explain: 'Chữ số 5 ở hàng chục nên có giá trị 5 · 10 = <b>50</b>. Cùng một chữ số, đứng ở vị trí khác thì giá trị khác!' },
          { kind: 'concept', title: 'Hệ thập phân',
            html: `<p>Ta dùng <b>10 chữ số</b> 0, 1, 2, …, 9 để viết mọi số tự nhiên. Cứ <b>10 đơn vị</b> ở một hàng thì bằng <b>1 đơn vị</b> ở hàng liền trước.</p>
              <div class="rule">3 052 = 3 · 1 000 + 0 · 100 + 5 · 10 + 2<br><span style="font-size:.9em">(nghìn – trăm – chục – đơn vị)</span></div>
              <p><b>Số La Mã</b> dùng các kí tự: <b>I = 1, V = 5, X = 10</b> (và L = 50, C = 100…).</p>
              <div class="rule">Kí tự nhỏ đứng <b>sau</b> → cộng: VI = 6, XII = 12<br>Kí tự nhỏ đứng <b>trước</b> → trừ: IV = 4, IX = 9<br>Không viết một kí tự quá 3 lần liên tiếp: XXX = 30.</div>` },
          { kind: 'practice', gen: gDigitValue },
          { kind: 'practice', gen: gRomanToNum },
          { kind: 'practice', gen: gNumToRoman },
          { kind: 'practice', gen: gDigitValue },
          { kind: 'practice', widget: 'input', before: 'Số đó là', answer: 5037,
            prompt: 'Viết số gồm <b>5 nghìn, 3 chục và 7 đơn vị</b>.', hint: 'Hàng trăm không có gì → viết chữ số 0.', explain: '5 nghìn, 0 trăm, 3 chục, 7 đơn vị → <b>5 037</b>.' },
          { kind: 'practice', widget: 'input', before: 'Số đó là', answer: 9876,
            prompt: 'Số <b>lớn nhất</b> có bốn chữ số <b>khác nhau</b> là bao nhiêu?', hint: 'Đặt các chữ số lớn nhất ở hàng cao nhất.', explain: '<b>9 876</b>.' },
          { kind: 'challenge', widget: 'input', before: 'Số nhỏ nhất =', answer: 3057,
            prompt: 'Dùng cả bốn chữ số <b>0, 3, 5, 7</b> (mỗi chữ số đúng một lần), hãy viết số <b>nhỏ nhất</b> có bốn chữ số.',
            hint: 'Chữ số đầu tiên không thể là 0!', explain: 'Hàng nghìn chọn số nhỏ nhất khác 0 là 3, sau đó 0, 5, 7 → <b>3 057</b>.' },
        ],
      },
      /* ===== Bài 3 ===== */
      {
        title: 'Thứ tự trong tập ℕ', icon: '📊', desc: 'So sánh số tự nhiên, số liền trước, số liền sau.',
        steps: [
          { kind: 'explore', widget: 'numberline', min: 0, max: 12, labels: 'all', target: 7,
            prompt: 'Trên tia số, hãy đặt điểm biểu diễn <b>số liền sau của 6</b>.', hint: 'Số liền sau nằm ngay bên phải, lớn hơn 1 đơn vị.',
            explain: 'Số liền sau của 6 là <b>7</b>. Trên tia số, số nằm bên phải thì lớn hơn.' },
          { kind: 'concept', title: 'So sánh số tự nhiên',
            html: `${M.miniLine(0, 10, { dots: [{ v: 3 }, { v: 7 }] })}
              <div class="rule">Trên tia số, điểm a nằm bên <b>trái</b> điểm b thì <b>a &lt; b</b>.</div>
              <p>• Mỗi số tự nhiên có đúng một <b>số liền sau</b> (lớn hơn 1 đơn vị).</p>
              <p>• Mọi số tự nhiên khác 0 có một <b>số liền trước</b>. Số 0 là số tự nhiên nhỏ nhất.</p>
              <p>• a ≤ b nghĩa là a &lt; b hoặc a = b. Nếu a &lt; b và b &lt; c thì a &lt; c.</p>
              <p>• So sánh hai số: số nào <b>nhiều chữ số hơn</b> thì lớn hơn; cùng số chữ số thì so từng hàng từ trái sang phải.</p>` },
          { kind: 'practice', gen: gCompareBig },
          { kind: 'practice', gen: gPrevNext },
          { kind: 'practice', gen: gCompareBig },
          { kind: 'practice', gen: gSortNat },
          { kind: 'practice', widget: 'multi', tokens: [10, 11, 12, 13, 14, 15, 16, 17, 18], answer: [13, 14, 15, 16],
            prompt: 'Chọn tất cả số tự nhiên x thỏa mãn <b class="big">12 &lt; x ≤ 16</b>.', hint: 'Không lấy 12, có lấy 16.', explain: 'x ∈ {13; 14; 15; 16}.' },
          { kind: 'practice', widget: 'choice', shuffle: false, options: ['4', '5', '6', 'Vô số'], answer: '6',
            prompt: 'Có bao nhiêu số tự nhiên <b>không vượt quá 5</b>?', hint: '“Không vượt quá 5” nghĩa là ≤ 5. Đừng quên số 0!', explain: '0; 1; 2; 3; 4; 5 → <b>6</b> số.' },
          { kind: 'challenge', widget: 'input', before: 'Có', after: 'số', answer: 900,
            prompt: 'Có bao nhiêu số tự nhiên có <b>ba chữ số</b>?', hint: 'Từ số nhỏ nhất có ba chữ số đến số lớn nhất có ba chữ số.', explain: 'Từ 100 đến 999: 999 − 100 + 1 = <b>900</b> số.' },
        ],
      },
      /* ===== Bài 4 ===== */
      {
        title: 'Phép cộng và phép trừ', icon: '➕', desc: 'Tính nhanh nhờ giao hoán, kết hợp; tìm số chưa biết.',
        steps: [
          { kind: 'explore', widget: 'choice', options: ['27 + 73', '27 + 46', '46 + 73'], answer: '27 + 73',
            prompt: 'Cần tính nhẩm <b class="big">27 + 46 + 73</b>. Nên cộng cặp nào trước cho nhanh?',
            hint: 'Cặp nào cộng lại được số tròn trăm?',
            explain: '27 + 73 = 100, rồi 100 + 46 = <b>146</b>. Đổi chỗ và nhóm số khéo léo giúp tính nhẩm rất nhanh!' },
          { kind: 'concept', title: 'Tính chất phép cộng & phép trừ',
            html: `<div class="rule"><b>Giao hoán:</b> a + b = b + a<br><b>Kết hợp:</b> (a + b) + c = a + (b + c)<br><b>Cộng với 0:</b> a + 0 = a</div>
              <p>Phép trừ a − b = c (với a ≥ b): a là số bị trừ, b là số trừ, c là hiệu.</p>
              <div class="rule"><b>Tìm x:</b><br>x + b = a → x = a − b<br>a − x = b → x = a − b<br>x − b = a → x = a + b</div>` },
          { kind: 'practice', gen: gQuickSum },
          { kind: 'practice', gen: gAddBig },
          { kind: 'practice', gen: gSubBig },
          { kind: 'practice', gen: gFindX },
          { kind: 'practice', gen: gQuickSum },
          { kind: 'practice', gen: gFindX },
          { kind: 'challenge', widget: 'input', before: '1 + 2 + … + 20 =', answer: 210,
            prompt: 'Tính tổng <b class="big">1 + 2 + 3 + … + 20</b>.',
            hint: 'Ghép cặp: 1 + 20, 2 + 19, 3 + 18, … Có bao nhiêu cặp, mỗi cặp bằng bao nhiêu?',
            explain: '10 cặp, mỗi cặp bằng 21 → 10 · 21 = <b>210</b>. Đây là mẹo nổi tiếng của nhà toán học Gauss khi còn nhỏ!' },
        ],
      },
      /* ===== Bài 5 ===== */
      {
        title: 'Phép nhân và phép chia', icon: '✖️', desc: 'Tính chất phân phối, phép chia hết và chia có dư.',
        steps: [
          { kind: 'explore', widget: 'rect', n: 23, cols: 5, fixed: true,
            options: ['23 = 5 · 4 + 3', '23 = 5 · 3 + 8', '23 = 5 · 5 − 2', '23 = 4 · 5 + 2'], answer: '23 = 5 · 4 + 3',
            prompt: 'Có <b>23 viên gạch</b>, xếp mỗi hàng <b>5 viên</b>. Quan sát hình rồi chọn cách viết đúng của <b>phép chia có dư</b> 23 : 5.',
            hint: 'Số hàng đầy là thương, số viên còn lẻ ra là số dư. Số dư phải nhỏ hơn 5.',
            explain: 'Được 4 hàng đầy, dư 3 viên: <b>23 = 5 · 4 + 3</b>. (Cách 5 · 3 + 8 tuy đúng phép tính nhưng dư 8 &gt; 5 là chưa chia hết.)' },
          { kind: 'concept', title: 'Phép nhân & phép chia',
            html: `<div class="rule"><b>Giao hoán:</b> a · b = b · a &nbsp; <b>Kết hợp:</b> (a · b) · c = a · (b · c)<br><b>Phân phối:</b> a · (b + c) = a · b + a · c</div>
              <p><b>Chia hết:</b> a = b · q (b ≠ 0). Ví dụ 20 = 5 · 4.</p>
              <div class="rule"><b>Chia có dư:</b> a = b · q + r, với <b>0 &lt; r &lt; b</b><br>a: số bị chia, b: số chia, q: thương, r: số dư</div>` },
          { kind: 'practice', gen: gQuickMul },
          { kind: 'practice', gen: gDistrib },
          { kind: 'practice', gen: gMul },
          { kind: 'practice', gen: gRem },
          { kind: 'practice', gen: gQuickMul },
          { kind: 'practice', gen: gRem },
          { kind: 'challenge', widget: 'input', before: 'Cần ít nhất', after: 'thuyền', answer: 7,
            prompt: '🚣 Một lớp có <b>40 học sinh</b> đi thuyền, mỗi thuyền chở <b>tối đa 6 người</b>. Cần ít nhất bao nhiêu thuyền?',
            hint: '40 : 6 được bao nhiêu, dư bao nhiêu? Những bạn còn dư cũng cần thuyền!',
            explain: '40 = 6 · 6 + 4. 6 thuyền chở 36 bạn, còn 4 bạn cần thêm 1 thuyền → <b>7</b> thuyền.' },
        ],
      },
      /* ===== Bài 6 ===== */
      {
        title: 'Lũy thừa', icon: '⚡', desc: 'Gấp đôi tờ giấy 5 lần được bao nhiêu lớp? Viết gọn phép nhân lặp.',
        steps: [
          { kind: 'explore', widget: 'input', before: `Gấp 5 lần → ${pw(2, 5)} =`, after: 'lớp', answer: 32,
            table: table([['Gấp 1 lần', '2 lớp', pw(2, 1)], ['Gấp 2 lần', '4 lớp', pw(2, 2)], ['Gấp 3 lần', '8 lớp', pw(2, 3)], ['Gấp 4 lần', '16 lớp', pw(2, 4)], ['Gấp 5 lần', '? lớp', pw(2, 5)]]),
            prompt: '📄 Mỗi lần gấp đôi tờ giấy, số lớp giấy lại nhân đôi. Gấp 5 lần thì được bao nhiêu lớp?',
            hint: 'Lấy số lớp của lần trước nhân 2.', explain: '16 · 2 = <b>32</b> lớp. Ta viết gọn 2 · 2 · 2 · 2 · 2 = 2<sup>5</sup>.' },
          { kind: 'concept', title: 'Lũy thừa với số mũ tự nhiên',
            html: `<div class="rule"><b class="big">a<sup>n</sup> = a · a · … · a</b> (n thừa số a)<br>a là <b>cơ số</b>, n là <b>số mũ</b>.</div>
              <p>a<sup>2</sup> đọc là “a bình phương”, a<sup>3</sup> là “a lập phương”. Quy ước: a<sup>1</sup> = a; a<sup>0</sup> = 1 (a ≠ 0).</p>
              <div class="rule"><b>Nhân</b> hai lũy thừa cùng cơ số: a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup><br><b>Chia</b> hai lũy thừa cùng cơ số: a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup> (a ≠ 0, m ≥ n)</div>` },
          { kind: 'practice', gen: gPowVal },
          { kind: 'practice', gen: gPowWrite },
          { kind: 'practice', gen: gPowMul },
          { kind: 'practice', gen: gPowDiv },
          { kind: 'practice', gen: gPowVal },
          { kind: 'practice', widget: 'choice', shuffle: false, options: ['5', '6', '7', '10'], answer: '6',
            prompt: 'Số <b class="big">10<sup>6</sup></b> khi viết ra có bao nhiêu chữ số 0?', hint: '10<sup>2</sup> = 100, 10<sup>3</sup> = 1 000…', explain: '10<sup>n</sup> là số 1 với n chữ số 0 → <b>6</b> chữ số 0 (1 000 000).' },
          { kind: 'challenge', widget: 'input', before: 'Số mũ =', answer: 12,
            prompt: 'Biết 8 = 2<sup>3</sup>. Viết <b class="big">8 · 8 · 8 · 8</b> dưới dạng lũy thừa của 2. Số mũ là bao nhiêu?',
            hint: '8 · 8 · 8 · 8 = 2<sup>3</sup> · 2<sup>3</sup> · 2<sup>3</sup> · 2<sup>3</sup>.', explain: '3 + 3 + 3 + 3 = 12 → 8<sup>4</sup> = <b>2<sup>12</sup></b>.' },
        ],
      },
      /* ===== Bài 7 ===== */
      {
        title: 'Thứ tự thực hiện phép tính', icon: '🧮', desc: '2 + 3 · 4 bằng 20 hay 14? Quy tắc ai cũng phải theo.',
        steps: [
          { kind: 'explore', widget: 'choice', options: ['An', 'Bình', 'Cả hai đều đúng', 'Cả hai đều sai'], answer: 'Bình',
            prompt: 'Hai bạn cùng tính <b class="big">2 + 3 · 4</b>. An được <b>20</b>, Bình được <b>14</b>. Ai đúng?',
            hint: 'Phép nhân và phép cộng – phép nào được làm trước?',
            explain: 'Nhân trước, cộng sau: 3 · 4 = 12, rồi 2 + 12 = <b>14</b>. An đã cộng trước nên sai.' },
          { kind: 'concept', title: 'Thứ tự thực hiện',
            html: `<div class="rule"><b>Không có dấu ngoặc:</b><br>Lũy thừa → Nhân và chia → Cộng và trừ<br>(các phép cùng cấp: làm từ <b>trái sang phải</b>)</div>
              <div class="rule"><b>Có dấu ngoặc:</b> ( ) → [ ] → { }</div>
              <p>Ví dụ: 50 − 2 · 3<sup>2</sup> = 50 − 2 · 9 = 50 − 18 = 32.</p>` },
          { kind: 'practice', widget: 'choice', options: [`Tính ${pw(3, 2)}`, 'Tính 2 · 3', 'Tính 50 − 2'], answer: `Tính ${pw(3, 2)}`,
            prompt: `Khi tính <b class="big">50 − 2 · ${pw(3, 2)}</b>, bước đầu tiên là:`, hint: 'Lũy thừa đứng đầu thứ tự ưu tiên.', explain: `${pw(3, 2)} = 9 → 2 · 9 = 18 → 50 − 18 = 32.` },
          { kind: 'practice', gen: gOps1 },
          { kind: 'practice', gen: gOps2 },
          { kind: 'practice', gen: gOps3 },
          { kind: 'practice', gen: gOps4 },
          { kind: 'practice', gen: gOps1 },
          { kind: 'challenge', widget: 'input', before: `80 − [130 − (12 − 4)<sup>2</sup>] =`, answer: 14,
            prompt: 'Tính giá trị biểu thức:', hint: 'Ngoặc tròn trước: 12 − 4 = 8, rồi 8<sup>2</sup>, rồi ngoặc vuông.',
            explain: '(12 − 4)<sup>2</sup> = 64; 130 − 64 = 66; 80 − 66 = <b>14</b>.' },
        ],
      },
      /* ===== Ôn tập ===== */
      {
        title: 'Ôn tập chương I', icon: '🏆', desc: 'Tổng hợp mọi kỹ năng của chương.',
        steps: [
          { kind: 'practice', gen: gMember },
          { kind: 'practice', gen: gRomanToNum },
          { kind: 'practice', gen: gCompareBig },
          { kind: 'practice', gen: gFindX },
          { kind: 'practice', gen: gRem },
          { kind: 'practice', gen: gPowMul },
          { kind: 'practice', gen: gOps3 },
          { kind: 'challenge', widget: 'input', before: 'Tiền thừa =', after: 'đồng', answer: 5000,
            prompt: '🛒 Mẹ mua <b>3 kg táo</b> giá 45 000 đồng/kg và <b>2 kg cam</b> giá 30 000 đồng/kg. Mẹ đưa 200 000 đồng. Người bán trả lại bao nhiêu?',
            hint: '200 000 − (3 · 45 000 + 2 · 30 000)', explain: '3 · 45 000 + 2 · 30 000 = 135 000 + 60 000 = 195 000; 200 000 − 195 000 = <b>5 000</b> đồng.' },
          { kind: 'challenge', widget: 'input', before: 'x =', answer: 3,
            prompt: `Tìm số tự nhiên x, biết: <b class="big">${pw(2, 'x')} = 8</b>`, hint: '2 nhân với chính nó mấy lần thì được 8?', explain: `8 = 2 · 2 · 2 = ${pw(2, 3)} → x = <b>3</b>.` },
        ],
      },
    ],
  });
})();
