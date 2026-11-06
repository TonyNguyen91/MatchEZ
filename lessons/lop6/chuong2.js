/* ==========================================================
   LỚP 6 · CHƯƠNG II · TÍNH CHIA HẾT TRONG TẬP SỐ TỰ NHIÊN  (Bài 8 → Bài 12)
   ========================================================== */
(function () {
  const M = MathEZ, R = M.rand, pw = M.pw, range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const digitSum = (n) => String(n).split('').reduce((s, c) => s + +c, 0);

  /* ---------- Bộ sinh câu hỏi ---------- */
  const gDivisors = () => {
    const n = M.pick([12, 15, 16, 18, 20, 24, 28, 30, 36]);
    return {
      widget: 'multi', tokens: range(1, n), answer: M.divisors(n),
      prompt: `Chọn <b>tất cả các ước</b> của <b class="big">${n}</b>.`,
      hint: `Thử chia ${n} lần lượt cho 1, 2, 3, … Mỗi khi tìm được một ước d thì ${n} : d cũng là một ước.`,
      explain: `Ư(${n}) = {${M.divisors(n).join('; ')}}.`,
    };
  };
  const gMultiples = () => {
    const k = R(3, 9); const set = new Set();
    while (set.size < 6) set.add(k * R(1, 9));
    while (set.size < 14) { const v = R(5, 80); if (v % k) set.add(v); }
    const tokens = [...set].sort((a, b) => a - b);
    return {
      widget: 'multi', tokens, answer: tokens.filter((v) => v % k === 0),
      prompt: `Chọn <b>tất cả các bội</b> của <b class="big">${k}</b> trong các số dưới đây.`,
      hint: `Bội của ${k} là các số chia hết cho ${k}: ${k}, ${2 * k}, ${3 * k}, …`,
      explain: `Các bội của ${k}: ${tokens.filter((v) => v % k === 0).join('; ')}.`,
    };
  };
  const gSumDiv = () => {
    const m = M.pick([3, 4, 5, 6, 7, 9]); const all = Math.random() < 0.5;
    const nums = [m * R(2, 15), m * R(2, 15), m * R(2, 15)];
    if (!all) { const i = R(0, 2); nums[i] += R(1, m - 1); }
    const sum = nums.reduce((a, b) => a + b);
    return {
      widget: 'choice', shuffle: false, options: ['Có', 'Không'], answer: sum % m === 0 ? 'Có' : 'Không',
      prompt: `Không tính tổng, cho biết <b class="big">${nums.join(' + ')}</b> có chia hết cho <b>${m}</b> không?`,
      hint: `Xét từng số hạng: số nào chia hết cho ${m}, số nào không?`,
      explain: all ? `Cả ba số hạng đều chia hết cho ${m} nên tổng chia hết cho ${m}.` : `Chỉ có một số hạng không chia hết cho ${m}, các số còn lại chia hết → tổng <b>không</b> chia hết cho ${m}.`,
    };
  };
  const gBinsDiv = (m) => () => {
    const set = new Set();
    while (set.size < 3) set.add(m * R(12, 333));
    while (set.size < 6) { const v = R(100, 999); if (v % m) set.add(v); }
    const rule = m === 2 || m === 5 ? 'chữ số tận cùng' : 'tổng các chữ số';
    return {
      widget: 'bins', items: [...set], bins: [`Chia hết cho ${m}`, `Không chia hết cho ${m}`], binOf: (v) => (v % m === 0 ? 0 : 1),
      prompt: `Xếp các số vào đúng nhóm. (Gợi ý: nhìn vào <b>${rule}</b>.)`,
      hint: m === 2 ? 'Tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2.' : m === 5 ? 'Tận cùng là 0 hoặc 5 thì chia hết cho 5.' : `Tổng các chữ số chia hết cho ${m} thì số đó chia hết cho ${m}.`,
      explain: [...set].map((v) => (m === 3 || m === 9 ? `${v} (tổng ${digitSum(v)})` : String(v)) + (v % m === 0 ? ' ✔' : ' ✘')).join(', '),
    };
  };
  const gStarDigit = () => {
    const m = M.pick([3, 9]); const a = R(1, 9), b = R(0, 9);
    const ans = range(0, 9).filter((d) => (a + d + b) % m === 0);
    return {
      widget: 'multi', tokens: range(0, 9), answer: ans, cols: 5,
      prompt: `Chọn <b>tất cả</b> chữ số thích hợp thay cho dấu * để số <b class="big">${a}*${b}</b> chia hết cho <b>${m}</b>.`,
      hint: `Tổng ${a} + * + ${b} phải chia hết cho ${m}.`,
      explain: `${a} + * + ${b} = ${a + b} + * chia hết cho ${m} khi * ∈ {${ans.join('; ')}}.`,
    };
  };
  const gPrimeOrNot = () => {
    const n = M.pick([2, 9, 11, 15, 17, 21, 23, 27, 29, 31, 33, 37, 39, 41, 49, 51, 53, 57, 59, 61, 87, 91, 97, 1]);
    const ans = n === 1 ? 'Không là số nguyên tố, không là hợp số' : M.isPrime(n) ? 'Số nguyên tố' : 'Hợp số';
    const d = M.divisors(n);
    return {
      widget: 'choice', shuffle: false, options: ['Số nguyên tố', 'Hợp số', 'Không là số nguyên tố, không là hợp số'], answer: ans,
      prompt: `Số <b class="big">${n}</b> là:`, hint: 'Đếm các ước của số đó. Thử chia cho 2, 3, 5, 7…',
      explain: n === 1 ? 'Số 1 chỉ có một ước nên không là số nguyên tố, cũng không là hợp số.' : `Ư(${n}) = {${d.join('; ')}} → có ${d.length} ước → <b>${ans.toLowerCase()}</b>.`,
    };
  };
  const tweak = (f) => {
    const g = f.map((x) => x.slice()); const i = R(0, g.length - 1);
    if (Math.random() < 0.5 || g[i][1] === 1) g[i][1] += 1; else g[i][1] -= 1;
    return M.fmtFactor(g);
  };
  const gFactor = () => {
    const n = M.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 54, 60, 72, 84, 90, 100, 120, 150]);
    const f = M.factor(n), right = M.fmtFactor(f);
    const comp = n % 4 === 0 ? `4 · ${n / 4}` : n % 6 === 0 ? `6 · ${n / 6}` : `${n / 5} · 5`;
    let opts = M.uniq([right, tweak(f), tweak(f), comp, tweak(f), tweak(f)]);
    return {
      widget: 'choice', options: opts, answer: right,
      prompt: `Phân tích <b class="big">${n}</b> ra thừa số nguyên tố:`,
      hint: 'Chia liên tiếp cho số nguyên tố nhỏ nhất có thể (2, 3, 5, 7…) cho đến khi thương bằng 1.',
      explain: `${n} = <b>${right}</b>. (Mọi thừa số đều phải là số nguyên tố – 4, 6, 9… không được!)`,
    };
  };
  const gGcd = () => {
    let a, b; do { const g = R(2, 15); const x = R(1, 9), y = R(2, 10); a = g * x; b = g * y; } while (a === b || a > 150 || b > 150 || a === 1);
    const g = M.gcd(a, b);
    return {
      widget: 'input', prompt: 'Tìm ước chung lớn nhất:', before: `ƯCLN(${a}, ${b}) =`, answer: g,
      hint: `Phân tích ${a} và ${b} ra thừa số nguyên tố, lấy các thừa số chung với số mũ nhỏ nhất.`,
      explain: `${a} = ${M.fmtFactor(M.factor(a)) || '1'}; ${b} = ${M.fmtFactor(M.factor(b))} → ƯCLN = <b>${g}</b>.`,
    };
  };
  const gCommonDiv = () => {
    const [a, b] = M.pick([[12, 18], [8, 20], [16, 24], [15, 25], [18, 27], [20, 30], [24, 36], [14, 21], [12, 30]]);
    const ans = M.divisors(M.gcd(a, b));
    return {
      widget: 'multi', tokens: range(1, Math.min(a, b)), answer: ans,
      prompt: `Chọn <b>tất cả ước chung</b> của <b>${a}</b> và <b>${b}</b>.`,
      hint: `Một số là ước chung nếu nó vừa là ước của ${a}, vừa là ước của ${b}.`,
      explain: `ƯC(${a}, ${b}) = {${ans.join('; ')}} – chính là các ước của ƯCLN = ${M.gcd(a, b)}.`,
    };
  };
  const gCoprime = () => {
    const good = M.pick([[8, 9], [14, 15], [7, 10], [16, 25], [9, 20], [21, 22], [11, 12]]);
    const bad = M.shuffle([[6, 9], [10, 15], [12, 18], [14, 21], [8, 12], [15, 25], [9, 21]]).slice(0, 3);
    const fmt = ([x, y]) => `${x} và ${y}`;
    return {
      widget: 'choice', options: [fmt(good), ...bad.map(fmt)], answer: fmt(good),
      prompt: 'Cặp số nào là hai số <b>nguyên tố cùng nhau</b>?', hint: 'Hai số nguyên tố cùng nhau khi ƯCLN của chúng bằng 1.',
      explain: `ƯCLN(${good[0]}, ${good[1]}) = 1. Các cặp còn lại đều có ước chung lớn hơn 1.`,
    };
  };
  const gReduce = () => {
    let a, b; do { const g = R(2, 9); a = g * R(1, 9); b = g * R(2, 12); } while (a >= b || M.gcd(a, b) === 1);
    const g = M.gcd(a, b), ra = a / g, rb = b / g;
    const half = M.gcd(a, b) > 2 && a % 2 === 0 && b % 2 === 0 ? [a / 2, b / 2] : [a, b];
    const opts = M.uniq([M.frac(ra, rb), M.frac(half[0], half[1]), M.frac(rb, ra), M.frac(ra + 1, rb), M.frac(ra, rb + 1)]);
    return {
      widget: 'choice', options: opts, answer: M.frac(ra, rb),
      prompt: `Rút gọn phân số <span class="big">${M.frac(a, b)}</span> về <b>phân số tối giản</b>:`,
      hint: 'Chia cả tử và mẫu cho ƯCLN của chúng.',
      explain: `ƯCLN(${a}, ${b}) = ${g} → ${M.frac(a, b)} = ${M.frac(`${a} : ${g}`, `${b} : ${g}`)} = <b>${M.frac(ra, rb)}</b>.`,
    };
  };
  const gLcm = () => {
    let a, b; do { a = R(4, 30); b = R(4, 30); } while (a === b || M.lcm(a, b) > 300 || a % b === 0 || b % a === 0);
    return {
      widget: 'input', prompt: 'Tìm bội chung nhỏ nhất:', before: `BCNN(${a}, ${b}) =`, answer: M.lcm(a, b),
      hint: 'Phân tích ra thừa số nguyên tố, lấy các thừa số chung và riêng với số mũ lớn nhất.',
      explain: `${a} = ${M.fmtFactor(M.factor(a))}; ${b} = ${M.fmtFactor(M.factor(b))} → BCNN = <b>${M.lcm(a, b)}</b>.`,
    };
  };
  const gLcmSpecial = () => {
    const b = R(3, 15), a = b * R(2, 6);
    return {
      widget: 'input', prompt: `Nhận xét: ${a} chia hết cho ${b}.`, before: `BCNN(${a}, ${b}) =`, answer: a,
      hint: `Nếu a chia hết cho b thì BCNN(a, b) = a.`, explain: `${a} ⋮ ${b} nên BCNN(${a}, ${b}) = <b>${a}</b>.`,
    };
  };

  M.addWorld({
    id: 'chia-het', order: 2, grade: 6, chapter: 'Chương II', title: 'Tính chia hết', icon: '➗',
    desc: 'Ước và bội, dấu hiệu chia hết, số nguyên tố, ƯCLN và BCNN – bằng cách xếp gạch, lọc số và giải bài toán thực tế.',
    lessons: [
      /* ===== Bài 8 ===== */
      {
        title: 'Quan hệ chia hết', icon: '🔗', desc: 'Xếp gạch thành hình chữ nhật để khám phá ước và bội.',
        steps: [
          { kind: 'explore', widget: 'rect', n: 12, cols: 1, title: 'Xếp gạch',
            prompt: 'Có <b>12 viên gạch</b>. Bấm <b>+ / −</b> để đổi số viên mỗi hàng, sao cho xếp được một <b>hình chữ nhật</b> kín (ít nhất 2 hàng, mỗi hàng ít nhất 2 viên).',
            hint: 'Không được dư viên nào: số viên mỗi hàng phải chia hết 12.',
            explain: 'Các cách xếp kín: mỗi hàng 2, 3, 4 hoặc 6 viên. Đó là vì 12 chia hết cho 2, 3, 4, 6 – các số này là <b>ước</b> của 12.' },
          { kind: 'concept', title: 'Ước và bội',
            html: `<div class="rule">Nếu a chia hết cho b (viết <b>a ⋮ b</b>) thì a là <b>bội</b> của b, còn b là <b>ước</b> của a.</div>
              <p>• Ư(a): tập hợp các ước của a. Ví dụ Ư(12) = {1; 2; 3; 4; 6; 12}.</p>
              <p>• B(b): tập hợp các bội của b. Ví dụ B(5) = {0; 5; 10; 15; …}.</p>
              <div class="rule"><b>Tính chất chia hết của một tổng:</b><br>Nếu mọi số hạng đều ⋮ m thì tổng ⋮ m.<br>Nếu chỉ <b>một</b> số hạng không ⋮ m, các số hạng còn lại ⋮ m thì tổng <b>không</b> ⋮ m.</div>` },
          { kind: 'practice', gen: gDivisors },
          { kind: 'practice', gen: gMultiples },
          { kind: 'practice', gen: gSumDiv },
          { kind: 'practice', gen: gDivisors },
          { kind: 'practice', gen: gSumDiv },
          { kind: 'challenge', widget: 'input', before: 'Có', after: 'bội', answer: 9,
            prompt: 'Có bao nhiêu bội của <b>7</b> nằm giữa <b>20</b> và <b>80</b>?',
            hint: 'Bội nhỏ nhất lớn hơn 20 là 21 = 7 · 3. Bội lớn nhất nhỏ hơn 80 là?',
            explain: '21, 28, 35, 42, 49, 56, 63, 70, 77 → <b>9</b> bội (từ 7 · 3 đến 7 · 11).' },
        ],
      },
      /* ===== Bài 9 ===== */
      {
        title: 'Dấu hiệu chia hết', icon: '🔍', desc: 'Nhìn chữ số tận cùng hoặc tổng chữ số là biết ngay!',
        steps: [
          { kind: 'explore', widget: 'bins', items: [34, 57, 120, 9, 88, 101, 76, 45], bins: ['Chia hết cho 2', 'Không chia hết cho 2'], binOf: (v) => (v % 2 === 0 ? 0 : 1),
            prompt: 'Xếp các số vào đúng nhóm. Xếp xong, hãy để ý <b>chữ số tận cùng</b> của các số trong mỗi nhóm!',
            hint: 'Số chẵn chia hết cho 2.', explain: 'Nhóm chia hết cho 2 đều tận cùng là 0, 2, 4, 6, 8 (34, 120, 88, 76). Chỉ cần nhìn chữ số cuối!' },
          { kind: 'concept', title: 'Các dấu hiệu chia hết',
            html: `<div class="rule"><b>Cho 2:</b> chữ số tận cùng là 0, 2, 4, 6, 8<br><b>Cho 5:</b> chữ số tận cùng là 0 hoặc 5<br>→ Cho cả 2 và 5: tận cùng là 0</div>
              <div class="rule"><b>Cho 3:</b> tổng các chữ số chia hết cho 3<br><b>Cho 9:</b> tổng các chữ số chia hết cho 9<br>Ví dụ: 2 457 có tổng 2 + 4 + 5 + 7 = 18 → chia hết cho cả 3 và 9.</div>
              <p>Lưu ý: số chia hết cho 9 thì chắc chắn chia hết cho 3, nhưng ngược lại chưa chắc.</p>` },
          { kind: 'practice', gen: gBinsDiv(5) },
          { kind: 'practice', gen: gBinsDiv(3) },
          { kind: 'practice', gen: gStarDigit },
          { kind: 'practice', gen: gBinsDiv(9) },
          { kind: 'practice', widget: 'choice', options: ['420', '425', '432', '515'], answer: '420',
            prompt: 'Số nào chia hết cho <b>cả 2 và 5</b>?', hint: 'Phải tận cùng là 0.', explain: 'Chỉ <b>420</b> tận cùng là 0.' },
          { kind: 'practice', gen: gStarDigit },
          { kind: 'challenge', widget: 'input', before: 'Số đó là', answer: 180,
            prompt: 'Tìm số <b>nhỏ nhất có ba chữ số</b> chia hết cho cả <b>2, 5 và 9</b>.',
            hint: 'Chia hết cho 2 và 5 → tận cùng 0. Chia hết cho 9 → tổng chữ số chia hết cho 9. Thử 1?0.',
            explain: 'Số có dạng ab0 với a + b ⋮ 9. Nhỏ nhất: a = 1, b = 8 → <b>180</b>.' },
        ],
      },
      /* ===== Bài 10 ===== */
      {
        title: 'Số nguyên tố', icon: '🧱', desc: 'Những số “không xếp được hình chữ nhật” – viên gạch xây nên mọi số.',
        steps: [
          { kind: 'explore', widget: 'rect', n: 13, cols: 1, options: ['Xếp được', 'Không xếp được'], answer: 'Không xếp được', shuffle: false,
            prompt: 'Thử xếp <b>13 viên gạch</b> thành hình chữ nhật kín (ít nhất 2 hàng, mỗi hàng ít nhất 2 viên). Bấm + / − để thử, rồi trả lời: có xếp được không?',
            hint: 'Thử mỗi hàng 2, 3, 4, 5, 6… viên. Lần nào cũng dư?',
            explain: '13 chỉ chia hết cho 1 và 13 nên <b>không</b> xếp được. Những số như vậy gọi là <b>số nguyên tố</b>.' },
          { kind: 'concept', title: 'Số nguyên tố & hợp số',
            html: `<div class="rule"><b>Số nguyên tố</b>: số tự nhiên lớn hơn 1, chỉ có <b>đúng hai ước</b> là 1 và chính nó. Ví dụ: 2, 3, 5, 7, 11, 13…<br><b>Hợp số</b>: số tự nhiên lớn hơn 1, có <b>nhiều hơn hai ước</b>. Ví dụ: 4, 6, 8, 9…</div>
              <p>• Số 0 và số 1 không là số nguyên tố, cũng không là hợp số.</p>
              <p>• 2 là số nguyên tố <b>chẵn duy nhất</b>.</p>` },
          { kind: 'practice', widget: 'multi', tokens: range(1, 30), answer: range(1, 30).filter(M.isPrime), cols: 10,
            prompt: 'Chọn <b>tất cả số nguyên tố</b> từ 1 đến 30.',
            hint: 'Mẹo “sàng Ơ-ra-tô-xten”: bỏ số 1, giữ 2 rồi loại các bội của 2; giữ 3 rồi loại các bội của 3; giữ 5 rồi loại bội của 5.',
            explain: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29 – có 10 số nguyên tố nhỏ hơn 30.' },
          { kind: 'practice', gen: gPrimeOrNot },
          { kind: 'practice', gen: gPrimeOrNot },
          { kind: 'concept', title: 'Phân tích ra thừa số nguyên tố',
            html: `<p>Mọi hợp số đều viết được thành <b>tích các số nguyên tố</b>.</p>
              <div class="rule">Chia liên tiếp cho số nguyên tố nhỏ nhất có thể:<br>60 : 2 = 30 → 30 : 2 = 15 → 15 : 3 = 5 → 5 : 5 = 1<br><b>60 = 2<sup>2</sup> · 3 · 5</b></div>
              <p>Thường viết các thừa số theo thứ tự tăng dần, gộp các thừa số giống nhau thành lũy thừa.</p>` },
          { kind: 'practice', gen: gFactor },
          { kind: 'practice', gen: gFactor },
          { kind: 'challenge', widget: 'input', before: 'Tổng =', answer: 20,
            prompt: 'Tích của hai số nguyên tố bằng <b>91</b>. Tổng của hai số đó là bao nhiêu?',
            hint: 'Thử chia 91 cho 2, 3, 5, 7…', explain: '91 = 7 · 13 (đều là số nguyên tố) → 7 + 13 = <b>20</b>.' },
        ],
      },
      /* ===== Bài 11 ===== */
      {
        title: 'Ước chung & ƯCLN', icon: '🤝', desc: 'Chia đều quà, cắt hình vuông lớn nhất – nhờ ước chung lớn nhất.',
        steps: [
          { kind: 'explore', widget: 'multi', tokens: range(1, 18), answer: [1, 2, 3, 6],
            prompt: 'Chọn các số vừa là <b>ước của 12</b>, vừa là <b>ước của 18</b>.',
            hint: 'Ư(12) = {1; 2; 3; 4; 6; 12}. Trong đó, số nào cũng là ước của 18?',
            explain: '1, 2, 3, 6 là các <b>ước chung</b> của 12 và 18. Số lớn nhất là 6 = <b>ƯCLN(12, 18)</b>.' },
          { kind: 'concept', title: 'Ước chung lớn nhất',
            html: `<div class="rule"><b>ƯC(a, b)</b>: tập hợp các ước chung của a và b.<br><b>ƯCLN(a, b)</b>: số lớn nhất trong tập hợp đó.</div>
              <p><b>Cách tìm ƯCLN:</b></p>
              <p>1) Phân tích mỗi số ra thừa số nguyên tố.<br>2) Chọn các thừa số nguyên tố <b>chung</b>.<br>3) Lấy mỗi thừa số với số mũ <b>nhỏ nhất</b>, rồi nhân lại.</p>
              <div class="rule">12 = 2<sup>2</sup> · 3; &nbsp; 18 = 2 · 3<sup>2</sup> → ƯCLN = 2 · 3 = 6</div>
              <p>• Ước chung = các ước của ƯCLN. • Nếu ƯCLN(a, b) = 1: a và b <b>nguyên tố cùng nhau</b>.<br>• Rút gọn phân số về <b>tối giản</b>: chia tử và mẫu cho ƯCLN.</p>` },
          { kind: 'practice', gen: gCommonDiv },
          { kind: 'practice', gen: gGcd },
          { kind: 'practice', gen: gGcd },
          { kind: 'practice', gen: gCoprime },
          { kind: 'practice', gen: gReduce },
          { kind: 'practice', gen: gReduce },
          { kind: 'challenge', widget: 'input', before: 'Nhiều nhất', after: 'phần quà', answer: 12,
            prompt: '🎁 Cô giáo có <b>24 chiếc bút</b> và <b>36 quyển vở</b>, muốn chia đều thành các phần quà giống hệt nhau (không thừa bút, vở nào). Chia được nhiều nhất bao nhiêu phần quà?',
            hint: 'Số phần quà phải là ước chung của 24 và 36. Nhiều nhất → ƯCLN.',
            explain: 'ƯCLN(24, 36) = 12 → <b>12</b> phần quà, mỗi phần 2 bút và 3 vở.' },
        ],
      },
      /* ===== Bài 12 ===== */
      {
        title: 'Bội chung & BCNN', icon: '🚌', desc: 'Hai chuyến xe khi nào lại xuất phát cùng lúc?',
        steps: [
          { kind: 'explore', widget: 'multi', tokens: range(1, 60), answer: [30, 60], cols: 10,
            prompt: '🚌 Xe A cứ <b>10 phút</b> xuất phát một chuyến, xe B cứ <b>15 phút</b>. Lúc 0 phút cả hai cùng xuất phát. Chọn các phút (đến phút 60) mà <b>cả hai lại cùng xuất phát</b>.',
            hint: 'Xe A chạy ở phút 10, 20, 30… Xe B chạy ở phút 15, 30, 45… Phút nào có trong cả hai danh sách?',
            explain: 'Phút <b>30</b> và <b>60</b> là các <b>bội chung</b> của 10 và 15. Lần gặp đầu tiên là phút 30 = <b>BCNN(10, 15)</b>.' },
          { kind: 'concept', title: 'Bội chung nhỏ nhất',
            html: `<div class="rule"><b>BC(a, b)</b>: tập hợp các bội chung của a và b.<br><b>BCNN(a, b)</b>: số <b>nhỏ nhất khác 0</b> trong tập hợp đó.</div>
              <p><b>Cách tìm BCNN:</b></p>
              <p>1) Phân tích mỗi số ra thừa số nguyên tố.<br>2) Chọn các thừa số nguyên tố <b>chung và riêng</b>.<br>3) Lấy mỗi thừa số với số mũ <b>lớn nhất</b>, rồi nhân lại.</p>
              <div class="rule">10 = 2 · 5; &nbsp; 15 = 3 · 5 → BCNN = 2 · 3 · 5 = 30</div>
              <p>• Bội chung = các bội của BCNN. • Nếu a ⋮ b thì BCNN(a, b) = a.<br>• Quy đồng mẫu các phân số: dùng BCNN của các mẫu làm mẫu chung.</p>` },
          { kind: 'practice', gen: gLcm },
          { kind: 'practice', gen: gLcmSpecial },
          { kind: 'practice', gen: gLcm },
          { kind: 'practice', widget: 'choice', options: ['24', '6', '48', '12'], answer: '24',
            prompt: 'Muốn quy đồng mẫu hai phân số <span class="big">' + M.frac(5, 6) + ' và ' + M.frac(3, 8) + '</span>, mẫu chung nhỏ nhất là:',
            hint: 'Mẫu chung nhỏ nhất = BCNN(6, 8).', explain: 'BCNN(6, 8) = <b>24</b>. Khi đó ' + M.frac(5, 6) + ' = ' + M.frac(20, 24) + ', ' + M.frac(3, 8) + ' = ' + M.frac(9, 24) + '.' },
          { kind: 'practice', gen: gLcm },
          { kind: 'challenge', widget: 'input', before: 'Số học sinh =', answer: 360,
            prompt: '🏫 Học sinh khối 6 khi xếp hàng 12, hàng 15 hay hàng 18 đều vừa đủ. Biết số học sinh trong khoảng <b>300 đến 400</b>. Khối 6 có bao nhiêu học sinh?',
            hint: 'Số học sinh là bội chung của 12, 15, 18. Tìm BCNN trước.',
            explain: 'BCNN(12, 15, 18) = 180. Các bội chung: 180, 360, 540… Trong khoảng 300–400 là <b>360</b>.' },
        ],
      },
      /* ===== Ôn tập ===== */
      {
        title: 'Ôn tập chương II', icon: '🏆', desc: 'Tổng hợp: ước, bội, số nguyên tố, ƯCLN, BCNN.',
        steps: [
          { kind: 'practice', gen: gDivisors },
          { kind: 'practice', gen: gBinsDiv(3) },
          { kind: 'practice', gen: gPrimeOrNot },
          { kind: 'practice', gen: gFactor },
          { kind: 'practice', gen: gGcd },
          { kind: 'practice', gen: gLcm },
          { kind: 'challenge', widget: 'input', before: 'Cạnh lớn nhất =', after: 'cm', answer: 12,
            prompt: '✂️ Một tấm bìa hình chữ nhật <b>60 cm × 96 cm</b> được cắt thành các hình vuông bằng nhau, không thừa mảnh nào. Cạnh hình vuông lớn nhất là bao nhiêu?',
            hint: 'Cạnh hình vuông phải là ước chung của 60 và 96.', explain: 'ƯCLN(60, 96) = <b>12</b> cm.' },
          { kind: 'challenge', widget: 'input', before: 'Sau', after: 'ngày', answer: 24,
            prompt: '📚 An cứ <b>8 ngày</b> đến thư viện một lần, Bình cứ <b>12 ngày</b>. Hôm nay hai bạn cùng đến. Sau ít nhất bao nhiêu ngày hai bạn lại cùng đến thư viện?',
            hint: 'Tìm BCNN(8, 12).', explain: 'BCNN(8, 12) = <b>24</b> ngày.' },
        ],
      },
    ],
  });
})();
