/* ==========================================================
   LỚP 6 · CHƯƠNG III · SỐ NGUYÊN
   Mỗi bài: Khám phá → Khái niệm → Luyện tập → Thử thách
   Bước có `gen()` sẽ sinh câu hỏi ngẫu nhiên mỗi lần học.
   ========================================================== */
(function () {
  const M = MathEZ, N = M.N, P = M.P, R = M.rand, RN = M.randNZ;

  /* ---------- Bộ sinh câu hỏi dùng lại được ---------- */
  const CITIES = ['Sa Pa', 'Mẫu Sơn', 'Bắc Kinh', 'Mát-xcơ-va', 'Seoul', 'Tokyo', 'Hà Nội', 'Đà Lạt'];

  const gThermo = () => {
    const t = RN(-15, 25);
    return {
      widget: 'thermo', min: -20, max: 30, start: t > 0 ? -10 : 15, target: t,
      prompt: `Nhiệt độ ở ${M.pick(CITIES)} lúc này là <b>${N(t)} °C</b>. Kéo nhiệt kế đến đúng mức.`,
      hint: t < 0 ? 'Số âm nằm phía dưới vạch 0.' : 'Số dương nằm phía trên vạch 0.',
      explain: `${N(t)} °C đọc là “${t < 0 ? 'âm ' + -t : t} độ C”${t < 0 ? ', tức là ' + -t + ' độ dưới 0' : ''}.`,
    };
  };

  const gPlace = () => {
    const t = RN(-9, 9);
    return {
      widget: 'numberline', min: -10, max: 10, labels: 'sparse', showValue: false, target: t, handleLabel: 'A',
      prompt: `Đặt điểm <b>A</b> biểu diễn số <b class="big">${N(t)}</b>. Chỉ có vài số được ghi sẵn – hãy đếm vạch!`,
      hint: `Bắt đầu từ vạch 0, đi sang ${t < 0 ? 'TRÁI' : 'PHẢI'} ${Math.abs(t)} vạch.`,
      explain: `${N(t)} nằm ${t < 0 ? 'bên trái' : 'bên phải'} số 0, cách 0 đúng ${Math.abs(t)} đơn vị.`,
    };
  };

  const gOpp = () => {
    const n = RN(-60, 60);
    return {
      widget: 'input', before: `Số đối của ${N(n)} là`, answer: -n,
      prompt: 'Hai số đối nhau nằm cách đều số 0, ở hai phía khác nhau.',
      hint: 'Chỉ cần đổi dấu của số đó.',
      explain: `${N(n)} và ${N(-n)} là hai số đối nhau.`,
    };
  };

  const gCompare = () => {
    let a = R(-25, 25), b = R(-25, 25);
    if (Math.random() < 0.5) { a = -Math.abs(a) || -3; b = -Math.abs(b) || -7; } // hay gặp: hai số âm
    if (a === b && Math.random() < 0.7) b = a - R(1, 6);
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return {
      widget: 'choice', shuffle: false, options: ['&lt;', '=', '&gt;'], answer: a < b ? '&lt;' : a > b ? '&gt;' : '=',
      prompt: `Chọn dấu thích hợp: <span class="big">${N(a)} ☐ ${N(b)}</span>`,
      hint: 'Trên trục số, số nằm bên trái thì nhỏ hơn. Với hai số âm: số nào xa 0 hơn thì nhỏ hơn.',
      explain: a === b ? 'Hai số bằng nhau.' : `${N(lo)} nằm bên trái ${N(hi)} trên trục số nên ${N(lo)} &lt; ${N(hi)}.`,
    };
  };

  const gSort = () => {
    const set = new Set();
    while (set.size < 5) set.add(R(-20, 20));
    const items = [...set];
    return { widget: 'sort', items, prompt: 'Sắp xếp các số sau theo thứ tự <b>tăng dần</b>.', explain: 'Thứ tự đúng: ' + items.slice().sort((x, y) => x - y).map(N).join(' &lt; ') };
  };

  const addHint = (a, b) => (a * b > 0
    ? 'Hai số cùng dấu: cộng hai phần số, rồi giữ nguyên dấu chung.'
    : 'Hai số khác dấu: lấy phần số lớn trừ phần số nhỏ, đặt dấu của số có phần số lớn hơn.');

  const gAdd = () => {
    const a = RN(-40, 40), b = RN(-40, 40);
    return { widget: 'input', prompt: 'Tính:', before: `${N(a)} + ${P(b)} =`, answer: a + b, hint: addHint(a, b), explain: `${N(a)} + ${P(b)} = <b>${N(a + b)}</b>` };
  };

  const gAddChips = () => {
    const a = RN(-6, 6), b = RN(-6, 6);
    const start = [[Math.sign(a), Math.abs(a)], [Math.sign(b), Math.abs(b)]];
    const r = a + b;
    return {
      widget: 'chips', start, answer: r, before: `${N(a)} + ${P(b)} =`,
      prompt: `Dùng chip để tính <b>${N(a)} + ${P(b)}</b>.`,
      explain: `Gạch hết các cặp (+, −), còn lại ${r === 0 ? 'bảng trống' : Math.abs(r) + ' chip ' + (r > 0 ? '+' : '−')} → kết quả <b>${N(r)}</b>.`,
    };
  };

  const gSub = () => {
    const a = RN(-30, 30), b = RN(-30, 30);
    return {
      widget: 'input', prompt: 'Tính:', before: `${N(a)} − ${P(b)} =`, answer: a - b,
      hint: `Đổi phép trừ thành phép cộng với số đối: ${N(a)} − ${P(b)} = ${N(a)} + ${P(-b)}`,
      explain: `${N(a)} − ${P(b)} = ${N(a)} + ${P(-b)} = <b>${N(a - b)}</b>`,
    };
  };

  const gSubRewrite = () => {
    let a, b;
    do { a = RN(-15, 15); b = RN(-15, 15); } while (Math.abs(a) === Math.abs(b));
    const right = `${N(a)} + ${P(-b)}`;
    return {
      widget: 'choice', answer: right,
      options: [right, `${N(a)} + ${P(b)}`, `${N(-a)} + ${P(b)}`, `${N(-a)} + ${P(-b)}`],
      prompt: `Phép tính <b class="big">${N(a)} − ${P(b)}</b> bằng với phép tính nào?`,
      hint: 'Trừ đi một số = cộng với số đối của số đó. Số bị trừ giữ nguyên!',
      explain: `Giữ nguyên ${N(a)}, đổi “− ${P(b)}” thành “+ ${P(-b)}”. Kết quả: ${N(a - b)}.`,
    };
  };

  const gMul = () => {
    const a = RN(-12, 12), b = RN(-12, 12);
    return {
      widget: 'input', prompt: 'Tính:', before: `${P(a)} · ${P(b)} =`, answer: a * b,
      hint: 'Nhân hai phần số trước, rồi xét dấu: cùng dấu → dương, khác dấu → âm.',
      explain: `${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}; hai số ${a * b > 0 ? 'cùng dấu → dương' : 'khác dấu → âm'}. Vậy <b>${N(a * b)}</b>.`,
    };
  };

  const gMulSign = () => {
    const a = RN(-99, 99), b = RN(-99, 99);
    return {
      widget: 'choice', shuffle: false, options: ['Dương', 'Âm', 'Bằng 0'], answer: a * b > 0 ? 'Dương' : 'Âm',
      prompt: `Không cần tính, cho biết tích <b class="big">${P(a)} · ${P(b)}</b> là số gì?`,
      hint: 'Cùng dấu → dương. Khác dấu → âm.',
      explain: `${P(a)} và ${P(b)} ${a * b > 0 ? 'cùng dấu nên tích dương' : 'khác dấu nên tích âm'}.`,
    };
  };

  const gBracket = () => {
    const a = RN(2, 30), b = RN(2, 30), c = RN(2, 30);
    const s = (x) => (x < 0 ? `− ${-x}` : `+ ${x}`); // dấu khi đứng giữa biểu thức
    const inner = `${N(a)} ${s(b)} ${s(c)}`;
    const right = `${N(-a)} ${s(-b)} ${s(-c)}`;
    return {
      widget: 'choice', answer: right,
      options: M.uniq([right, `${N(-a)} ${s(b)} ${s(c)}`, `${N(a)} ${s(-b)} ${s(-c)}`, `${N(-a)} ${s(-b)} ${s(c)}`]),
      prompt: `Bỏ dấu ngoặc: <span class="big">−(${inner})</span> = ?`,
      hint: 'Dấu “−” đứng trước ngoặc: đổi dấu <b>tất cả</b> các số hạng trong ngoặc.',
      explain: `−(${inner}) = <b>${right}</b>`,
    };
  };
  const gBracketCalc = () => {
    const A = R(101, 999), b = R(11, 99), c = R(11, 99);
    return {
      widget: 'input', prompt: 'Tính nhanh (bỏ ngoặc trước!):', before: `(${A} + ${b}) − (${A} + ${c}) =`, answer: b - c,
      hint: `Bỏ ngoặc: ${A} + ${b} − ${A} − ${c}, rồi nhóm ${A} − ${A} = 0.`,
      explain: `= ${A} + ${b} − ${A} − ${c} = ${b} − ${c} = <b>${N(b - c)}</b>`,
    };
  };
  const gDivInt = () => {
    const b = RN(-12, 12), q = RN(-12, 12), a = b * q;
    return {
      widget: 'input', prompt: 'Tính:', before: `${P(a)} : ${P(b)} =`, answer: q,
      hint: 'Chia hai phần số, rồi xét dấu giống phép nhân: cùng dấu → dương, khác dấu → âm.',
      explain: `${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q)}; ${a * b > 0 ? 'cùng dấu → dương' : 'khác dấu → âm'} → <b>${N(q)}</b>`,
    };
  };
  const gIntDivisors = () => {
    const n = M.pick([6, 8, 9, 10, 12]) * M.pick([1, -1]);
    const pos = M.divisors(Math.abs(n)); const ans = [...pos, ...pos.map((d) => -d)];
    const tokens = []; for (let v = -12; v <= 12; v++) if (v !== 0) tokens.push(v);
    return {
      widget: 'multi', tokens, answer: ans, cols: 8,
      prompt: `Chọn <b>tất cả các ước</b> của <b class="big">${N(n)}</b>.`,
      hint: 'Ước của số nguyên gồm cả ước dương và ước âm: nếu d là ước thì −d cũng là ước.',
      explain: `Ư(${N(n)}) = {${pos.map((d) => '±' + d).join('; ')}}.`,
    };
  };

  const pattern = (rows, last) => '<table>' + rows.map(([l, r]) => `<tr><td>${l}</td><td>=</td><td>${r}</td></tr>`).join('') + `<tr class="q"><td>${last}</td><td>=</td><td>?</td></tr></table>`;

  /* ---------- Chương ---------- */
  M.addWorld({
    id: 'so-nguyen', order: 3, grade: 6, chapter: 'Chương III', title: 'Số nguyên', icon: '🌡️',
    desc: 'Khám phá thế giới “dưới số 0”: nhiệt độ âm, tầng hầm, độ sâu đáy biển – rồi học cách so sánh, cộng, trừ, nhân các số nguyên.',
    lessons: [
      /* ===== BÀI 1 ===== */
      {
        title: 'Số âm quanh ta', icon: '🌡️', desc: 'Nhiệt độ dưới 0, tầng hầm, độ sâu đáy biển… được viết bằng số nào?',
        steps: [
          { kind: 'explore', widget: 'thermo', title: 'Lạnh hơn cả 0 độ!', min: -10, max: 30, start: 15, target: -3,
            prompt: 'Sáng nay trên đỉnh Fansipan, nhiệt độ là <b>3 độ dưới 0</b>. Hãy kéo cột nhiệt kế đến đúng mức nhiệt đó.',
            hint: 'Vạch 0 là ranh giới. “Dưới 0” nghĩa là kéo xuống phía dưới vạch 0.',
            explain: '3 độ dưới 0 được viết là <b>−3 °C</b>, đọc là “âm ba độ C”. Dấu “−” cho biết ta đang ở <i>dưới</i> mốc 0.' },
          { kind: 'concept', title: 'Số nguyên âm',
            html: `<p>Các số <b class="neg">−1, −2, −3, …</b> gọi là <b>số nguyên âm</b> (đọc: âm một, âm hai, …).</p>
              <p>Các số <b class="pos">1, 2, 3, …</b> là <b>số nguyên dương</b> (cũng có thể viết +1, +2, +3, …).</p>
              <div class="rule">Tập hợp các số nguyên:<br><b>ℤ = {…; −3; −2; −1; 0; 1; 2; 3; …}</b><br>Số <b>0</b> không phải số âm, cũng không phải số dương.</div>
              <div class="examples"><span>🌡️ Nhiệt độ dưới 0</span><span>🏢 Tầng hầm B1 = tầng −1</span><span>🌊 Độ sâu dưới mực nước biển</span><span>💸 Số tiền nợ</span></div>` },
          { kind: 'practice', widget: 'choice', options: ['−2', '2', '0', '−1'], answer: '−2',
            prompt: '🏢 Trong thang máy, <b>tầng hầm thứ 2</b> được ghi bằng số nào?',
            hint: 'Mặt đất là tầng 0. Tầng hầm nằm dưới mặt đất.', explain: 'Tầng hầm thứ 2 nằm dưới mặt đất 2 tầng → <b>−2</b>.' },
          { kind: 'practice', widget: 'choice', options: ['30 m', '−30 m', '0 m', '−3 m'], answer: '−30 m',
            prompt: '🌊 Đáy một vịnh biển sâu <b>30 m dưới mực nước biển</b>. Độ cao của đáy vịnh được viết là:',
            hint: 'Mực nước biển là mốc 0.', explain: 'Thấp hơn mốc 0 thì dùng số âm: <b>−30 m</b>.' },
          { kind: 'practice', gen: gThermo },
          { kind: 'practice', widget: 'choice', options: ['−7', '0', '2,5', '15'], answer: '2,5',
            prompt: 'Số nào <b>không phải</b> là số nguyên?',
            hint: 'Số nguyên là các số …, −2, −1, 0, 1, 2, … (không có phần thập phân).', explain: '2,5 nằm giữa 2 và 3, không phải số nguyên.' },
          { kind: 'practice', widget: 'choice', shuffle: false, options: ['Đúng', 'Sai'], answer: 'Sai',
            prompt: 'Bạn An nói: “<i>Số 0 là số nguyên dương nhỏ nhất.</i>” Bạn An nói đúng hay sai?',
            hint: 'Xem lại: số 0 có phải số dương không?', explain: 'Số 0 không âm cũng không dương. Số nguyên dương nhỏ nhất là <b>1</b>.' },
          { kind: 'challenge', widget: 'thermo', min: -10, max: 20, start: 5, target: -3,
            prompt: 'Buổi trưa ở Mẫu Sơn là <b>5 °C</b>. Đến đêm, nhiệt độ <b>giảm 8 °C</b>. Kéo nhiệt kế đến nhiệt độ ban đêm.',
            hint: 'Từ 5 đi xuống 5 độ thì tới 0, còn phải xuống thêm 3 độ nữa.',
            explain: 'Nhiệt độ ban đêm là <b>−3 °C</b>. Ở các bài sau ta sẽ học cách tính: 5 − 8 = −3.' },
        ],
      },

      /* ===== BÀI 2 ===== */
      {
        title: 'Trục số', icon: '📏', desc: 'Đặt số nguyên lên trục số và làm quen với “số đối”.',
        steps: [
          { kind: 'explore', widget: 'numberline', min: -6, max: 6, labels: [0, 1, 2, 3, 4, 5, 6], showValue: false, target: -4, handleLabel: 'A',
            prompt: 'Trên trục số, các số dương nằm <b>bên phải</b> số 0. Vậy số âm nằm ở đâu? Hãy đặt điểm <b>A = −4</b>.',
            hint: 'Số âm nằm ở phía còn lại của số 0. −4 cách 0 bốn vạch.',
            explain: 'Số âm nằm <b>bên trái</b> số 0. Điểm −4 cách 0 bốn đơn vị về bên trái – đối xứng với điểm 4 qua số 0.' },
          { kind: 'concept', title: 'Trục số & số đối',
            html: `${M.miniLine(-5, 5, { dots: [{ v: -3, c: 'neg' }, { v: 3, c: 'pos' }] })}
              <p>Trên trục số nằm ngang: số <b class="pos">dương</b> ở bên <b>phải</b> 0, số <b class="neg">âm</b> ở bên <b>trái</b> 0.</p>
              <div class="rule">Hai số nằm <b>cách đều số 0</b> và ở <b>hai phía</b> của 0 gọi là hai <b>số đối nhau</b>.<br>Ví dụ: 3 và −3 là hai số đối nhau. Số đối của 0 là 0.</div>` },
          { kind: 'practice', gen: gPlace },
          { kind: 'practice', widget: 'numberline', min: -8, max: 8, labels: 'zero', showValue: false, target: -5, marks: [{ v: 5, label: '5' }], handleLabel: 'B',
            prompt: 'Đặt điểm <b>B</b> biểu diễn <b>số đối của 5</b>.',
            hint: 'Số đối của 5 cách 0 năm vạch, nhưng ở phía bên kia.', explain: 'Số đối của 5 là <b>−5</b>.' },
          { kind: 'practice', gen: gOpp },
          { kind: 'practice', gen: gPlace },
          { kind: 'practice', widget: 'choice', options: ['Chỉ có 3', 'Chỉ có −3', 'Cả 3 và −3', 'Số 0'], answer: 'Cả 3 và −3',
            prompt: 'Những số nào nằm cách số 0 đúng <b>3 đơn vị</b> trên trục số?',
            hint: 'Có thể đi sang trái hoặc sang phải từ số 0.', explain: 'Đi sang phải 3 bước được 3, sang trái 3 bước được −3. Đó là hai số đối nhau.' },
          { kind: 'challenge', widget: 'numberline', min: -8, max: 4, labels: 'zero', showValue: false, target: -2, handleLabel: 'M',
            marks: [{ v: -6, label: '−6' }, { v: 2, label: '2' }],
            prompt: 'Điểm <b>M</b> nằm <b>chính giữa</b> hai điểm −6 và 2. Hãy đặt điểm M.',
            hint: 'Từ −6 đến 2 có bao nhiêu bước? Đi một nửa số bước đó, xuất phát từ −6.',
            explain: 'Từ −6 đến 2 có 8 bước. Đi 4 bước từ −6 → <b>−2</b>.' },
        ],
      },

      /* ===== BÀI 3 ===== */
      {
        title: 'So sánh số nguyên', icon: '⚖️', desc: '−8 và −3, số nào lớn hơn? Trục số sẽ trả lời.',
        steps: [
          { kind: 'explore', widget: 'choice', options: ['Hà Nội', 'Bắc Kinh', 'Mát-xcơ-va'], answer: 'Mát-xcơ-va',
            prompt: 'Cùng một ngày mùa đông: Hà Nội <b>12 °C</b>, Bắc Kinh <b>−5 °C</b>, Mát-xcơ-va <b>−11 °C</b>. Nơi nào <b>lạnh nhất</b>?',
            hint: 'Hình dung nhiệt kế: mức nào nằm thấp nhất?',
            explain: 'Trên nhiệt kế, −11 nằm dưới −5, và −5 nằm dưới 12. Vậy <b>−11 &lt; −5 &lt; 12</b>: Mát-xcơ-va lạnh nhất.' },
          { kind: 'concept', title: 'Số nào lớn hơn?',
            html: `${M.miniLine(-8, 3, { dots: [{ v: -8, c: 'neg' }, { v: -3, c: 'neg' }] })}
              <div class="rule">Trên trục số nằm ngang, số bên <b>trái</b> luôn <b>nhỏ hơn</b> số bên <b>phải</b>.</div>
              <p>• Mọi số âm &lt; 0 &lt; mọi số dương.</p>
              <p>• Với hai số âm: số nào <b>xa 0 hơn</b> thì <b>nhỏ hơn</b>. Ví dụ <b>−8 &lt; −3</b> (−8 °C lạnh hơn −3 °C).</p>` },
          { kind: 'practice', gen: gCompare },
          { kind: 'practice', gen: gCompare },
          { kind: 'practice', widget: 'sort', items: [3, -7, 0, -2, 5, -10], prompt: 'Sắp xếp các số sau theo thứ tự <b>tăng dần</b>.', explain: '−10 &lt; −7 &lt; −2 &lt; 0 &lt; 3 &lt; 5' },
          { kind: 'practice', gen: gCompare },
          { kind: 'practice', gen: gSort },
          { kind: 'practice', widget: 'choice', options: ['−1', '0', '−100', 'Không có số nào'], answer: '−1',
            prompt: '<b>Số nguyên âm lớn nhất</b> là số nào?',
            hint: 'Số âm nào nằm gần số 0 nhất?', explain: '−1 nằm sát bên trái số 0 nên lớn nhất trong các số âm. (0 không phải số âm.)' },
          { kind: 'challenge', widget: 'choice', shuffle: false, options: ['3', '4', '5', '6'], answer: '4',
            prompt: 'Có bao nhiêu số nguyên <b>x</b> thỏa mãn <b class="big">−3 &lt; x &lt; 2</b>?',
            hint: 'Liệt kê các số nằm giữa −3 và 2 trên trục số. Có lấy −3 và 2 không?',
            explain: 'Đó là −2; −1; 0; 1 → <b>4 số</b>. Không lấy −3 và 2 vì dấu “&lt;” không có dấu bằng.' },
        ],
      },

      /* ===== BÀI 4 ===== */
      {
        title: 'Cộng số nguyên', icon: '➕', desc: 'Nhảy trên trục số và gạch cặp chip để cộng số nguyên.',
        steps: [
          { kind: 'explore', widget: 'numberline', min: -6, max: 6, labels: 'all', from: 3, target: -2, handleLabel: '🐸',
            prompt: 'Chú ếch 🐸 đang đứng ở số <b>3</b>. Nó nhảy sang <b>trái 5 bước</b>. Chạm vào chỗ ếch dừng lại.',
            help: 'Chạm hoặc kéo trên trục số – mũi tên cho biết ếch nhảy bao nhiêu bước.',
            hint: 'Đi sang trái 3 bước là tới 0, còn 2 bước nữa.',
            explain: 'Nhảy sang trái 5 bước nghĩa là <b>cộng với −5</b>: 3 + (−5) = <b>−2</b>.' },
          { kind: 'concept', title: 'Cộng = di chuyển trên trục số',
            html: `${M.miniLine(-3, 4, { dots: [{ v: 3, c: 'pos' }, { v: -2, c: 'neg' }], arcs: [{ from: 3, to: -2 }] })}
              <p>Cộng một số <b class="pos">dương</b> → đi sang <b>phải</b>. Cộng một số <b class="neg">âm</b> → đi sang <b>trái</b>.</p>
              <div class="rule"><b>Mô hình chip:</b> <i class="ci p">+</i> = +1 &nbsp; <i class="ci m">−</i> = −1<br>Một cặp <i class="ci p">+</i><i class="ci m">−</i> có giá trị <b>0</b> → gạch bỏ được mà không làm đổi kết quả!</div>` },
          { kind: 'practice', widget: 'chips', start: [[1, 5], [-1, 3]], answer: 2, before: '5 + (−3) =',
            prompt: 'Bảng có 5 chip <i class="ci p">+</i> (là +5) và 3 chip <i class="ci m">−</i> (là −3). Gạch hết các cặp rồi nhập kết quả của <b>5 + (−3)</b>.',
            explain: 'Gạch 3 cặp, còn lại 2 chip + → <b>5 + (−3) = 2</b>.' },
          { kind: 'practice', widget: 'chips', start: [[-1, 4], [-1, 2]], answer: -6, before: '(−4) + (−2) =',
            prompt: 'Tính <b>(−4) + (−2)</b>. Lần này không có cặp nào để gạch – vậy trên bảng có tổng cộng bao nhiêu?',
            hint: 'Tất cả đều là chip −. Đếm chúng!',
            explain: '6 chip − → <b>−6</b>. Cộng hai số âm: cộng phần số (4 + 2 = 6) rồi đặt dấu −.' },
          { kind: 'practice', gen: gAddChips },
          { kind: 'concept', title: 'Quy tắc cộng',
            html: `<div class="rule"><b>Cùng dấu:</b> cộng hai phần số, giữ nguyên dấu chung.<br>(−7) + (−5) = −(7 + 5) = <b>−12</b></div>
              <div class="rule"><b>Khác dấu:</b> lấy phần số lớn trừ phần số nhỏ, đặt dấu của số có phần số lớn hơn.<br>(−9) + 4 = −(9 − 4) = <b>−5</b> &nbsp;•&nbsp; 9 + (−4) = <b>5</b></div>
              <p>“Phần số” là số tự nhiên còn lại khi bỏ dấu: phần số của −9 là 9.</p>` },
          { kind: 'practice', gen: gAdd },
          { kind: 'practice', gen: gAdd },
          { kind: 'practice', gen: gAdd },
          { kind: 'challenge', widget: 'input', before: 'Độ cao mới =', after: 'm', answer: -55,
            prompt: '🚢 Một tàu ngầm đang ở độ cao <b>−45 m</b> so với mực nước biển. Tàu nổi lên <b>20 m</b>, rồi lặn xuống <b>30 m</b>. Độ cao mới của tàu là bao nhiêu?',
            hint: 'Nổi lên là cộng số dương, lặn xuống là cộng số âm: (−45) + 20 + (−30).',
            explain: '(−45) + 20 = −25; rồi (−25) + (−30) = −55. Tàu ở độ cao <b>−55 m</b>.' },
        ],
      },

      /* ===== BÀI 5 ===== */
      {
        title: 'Trừ số nguyên', icon: '➖', desc: 'Vì sao 5 − (−1) lại bằng 6? Khám phá bằng quy luật và chip.',
        steps: [
          { kind: 'explore', widget: 'input', before: '5 − (−1) =', answer: 6,
            table: pattern([['5 − 3', '2'], ['5 − 2', '3'], ['5 − 1', '4'], ['5 − 0', '5']], '5 − (−1)'),
            prompt: 'Quan sát bảng: số trừ <b>giảm 1</b> thì kết quả thay đổi thế nào? Đoán dòng cuối!',
            hint: 'Kết quả đang tăng: 2, 3, 4, 5, …',
            explain: 'Kết quả tăng đều nên <b>5 − (−1) = 6</b>. Trừ đi −1 giống hệt cộng thêm 1!' },
          { kind: 'concept', title: 'Trừ = cộng với số đối',
            html: `<div class="rule">Muốn trừ a cho b, ta cộng a với <b>số đối</b> của b:<br><b class="big">a − b = a + (−b)</b></div>
              <p>• 5 − (−1) = 5 + 1 = <b>6</b></p><p>• 2 − 7 = 2 + (−7) = <b>−5</b></p><p>• (−3) − 4 = (−3) + (−4) = <b>−7</b></p>` },
          { kind: 'practice', widget: 'chips', start: [[1, 2]], take: { sign: 1, n: 5 }, zeroPair: true, answer: -3, before: '2 − 5 =',
            prompt: 'Tính <b>2 − 5</b>. Bảng có 2 chip <i class="ci p">+</i>, ta cần <b>lấy ra 5 chip +</b> nhưng không đủ… Hãy thêm cặp 0 cho đến khi đủ!',
            hint: 'Cần thêm 3 cặp 0. Sau khi lấy ra 5 chip +, còn lại những chip nào?',
            explain: 'Thêm 3 cặp (+, −), lấy ra 5 chip +, còn lại 3 chip − → <b>2 − 5 = −3</b>.' },
          { kind: 'practice', widget: 'chips', start: [[-1, 3]], take: { sign: -1, n: 5 }, zeroPair: true, answer: 2, before: '(−3) − (−5) =',
            prompt: 'Tính <b>(−3) − (−5)</b>: cần lấy ra 5 chip <i class="ci m">−</i> từ bảng.',
            hint: 'Có 3 chip −, cần thêm 2 cặp 0 để đủ 5 chip −.',
            explain: 'Sau khi lấy 5 chip −, còn lại 2 chip + → <b>2</b>. Đúng bằng (−3) + 5!' },
          { kind: 'practice', gen: gSubRewrite },
          { kind: 'practice', gen: gSub },
          { kind: 'practice', gen: gSub },
          { kind: 'practice', gen: gSubRewrite },
          { kind: 'challenge', widget: 'input', before: 'Chênh lệch =', after: '°C', answer: 15,
            prompt: '🏔️ Ban ngày ở một vùng núi nhiệt độ là <b>8 °C</b>, ban đêm là <b>−7 °C</b>. Nhiệt độ ban ngày cao hơn ban đêm bao nhiêu độ?',
            hint: 'Lấy nhiệt độ ban ngày trừ nhiệt độ ban đêm.',
            explain: '8 − (−7) = 8 + 7 = <b>15 °C</b>.' },
        ],
      },

      /* ===== Quy tắc dấu ngoặc ===== */
      {
        title: 'Quy tắc dấu ngoặc', icon: '🔓', desc: 'Bỏ ngoặc đúng cách để tính nhanh như chớp.',
        steps: [
          { kind: 'explore', widget: 'choice', shuffle: false, options: ['Bằng nhau', 'Khác nhau'], answer: 'Bằng nhau',
            prompt: 'Tính thử hai biểu thức: <span class="big">7 − (2 + 3)</span> và <span class="big">7 − 2 − 3</span>. Kết quả bằng nhau hay khác nhau?',
            hint: '7 − 5 = ? và 5 − 3 = ?',
            explain: 'Cả hai đều bằng 2. Bỏ ngoặc có dấu “−” đằng trước: <b>+3 trong ngoặc trở thành −3</b> bên ngoài.' },
          { kind: 'explore', widget: 'choice', shuffle: false, options: ['10 − 4 − 1', '10 − 4 + 1', '10 + 4 − 1'], answer: '10 − 4 + 1',
            prompt: 'Biết <span class="big">10 − (4 − 1) = 10 − 3 = 7</span>. Khi bỏ ngoặc, cách viết nào cũng cho kết quả 7?',
            hint: 'Tính thử từng cách viết.',
            explain: '10 − 4 + 1 = 7. Số −1 trong ngoặc trở thành <b>+1</b> khi bỏ ngoặc có dấu “−” đằng trước.' },
          { kind: 'concept', title: 'Quy tắc dấu ngoặc',
            html: `<div class="rule">Bỏ ngoặc có dấu <b>“+”</b> đằng trước: <b>giữ nguyên</b> dấu các số hạng trong ngoặc.<br>a + (b − c) = a + b − c</div>
              <div class="rule">Bỏ ngoặc có dấu <b>“−”</b> đằng trước: <b>đổi dấu tất cả</b> các số hạng trong ngoặc (+ thành −, − thành +).<br>a − (b − c + d) = a − b + c − d</div>
              <p>Mẹo: bỏ ngoặc xong, nhóm các số đối nhau (tổng bằng 0) để tính nhanh.</p>` },
          { kind: 'practice', gen: gBracket },
          { kind: 'practice', gen: gBracketCalc },
          { kind: 'practice', gen: gBracket },
          { kind: 'practice', gen: gBracketCalc },
          { kind: 'challenge', widget: 'input', before: '(2 023 − 57) − (2 023 + 43) =', answer: -100,
            prompt: 'Tính nhanh:', hint: 'Bỏ ngoặc rồi ghép 2 023 − 2 023.',
            explain: '= 2 023 − 57 − 2 023 − 43 = −57 − 43 = <b>−100</b>' },
        ],
      },

      /* ===== BÀI 6 ===== */
      {
        title: 'Nhân số nguyên', icon: '✖️', desc: 'Vì sao âm nhân âm lại ra dương? Tự phát hiện qua quy luật.',
        steps: [
          { kind: 'explore', widget: 'input', before: '3 · (−1) =', answer: -3,
            table: pattern([['3 · 2', '6'], ['3 · 1', '3'], ['3 · 0', '0']], '3 · (−1)'),
            prompt: 'Thừa số thứ hai giảm 1 thì tích thay đổi thế nào? Đoán dòng cuối!',
            hint: 'Tích đang giảm 3 mỗi dòng: 6, 3, 0, …',
            explain: 'Tích giảm 3 mỗi dòng: 6, 3, 0, <b>−3</b>. Dương nhân âm ra âm.' },
          { kind: 'explore', widget: 'input', before: '(−3) · (−1) =', answer: 3,
            table: pattern([['(−3) · 2', '−6'], ['(−3) · 1', '−3'], ['(−3) · 0', '0']], '(−3) · (−1)'),
            prompt: 'Giờ đến lượt (−3). Lần này tích thay đổi thế nào?',
            hint: 'Tích đang tăng 3 mỗi dòng: −6, −3, 0, …',
            explain: 'Tích tăng 3 mỗi dòng: −6, −3, 0, <b>3</b>. Âm nhân âm ra <b>dương</b>!' },
          { kind: 'concept', title: 'Quy tắc dấu',
            html: `<table class="signs"><tr><th>·</th><th class="pos">+</th><th class="neg">−</th></tr><tr><th class="pos">+</th><td class="pos">+</td><td class="neg">−</td></tr><tr><th class="neg">−</th><td class="neg">−</td><td class="pos">+</td></tr></table>
              <div class="rule"><b>Cùng dấu</b> → tích <b class="pos">dương</b>. <b>Khác dấu</b> → tích <b class="neg">âm</b>. Nhân với 0 → 0.</div>
              <p>Cách làm: nhân hai phần số, rồi đặt dấu theo quy tắc. Ví dụ (−4) · 6 = −24; (−4) · (−6) = 24.</p>` },
          { kind: 'practice', gen: gMulSign },
          { kind: 'practice', gen: gMul },
          { kind: 'practice', gen: gMulSign },
          { kind: 'practice', gen: gMul },
          { kind: 'practice', widget: 'choice', options: ['Dương', 'Âm', 'Bằng 0', 'Không biết được'], answer: 'Âm',
            prompt: 'Tích của <b>5 số nguyên âm</b> là số gì?',
            hint: 'Ghép từng cặp 2 số âm – mỗi cặp cho tích dương. Còn thừa số nào không?',
            explain: '5 số âm = 2 cặp + 1 số âm thừa ra → tích <b>âm</b>. (Số thừa số âm lẻ → âm, chẵn → dương.)' },
          { kind: 'challenge', widget: 'input', before: 'Điểm của Minh =', answer: 29,
            prompt: '📝 Một bài kiểm tra: mỗi câu đúng được <b>+5</b> điểm, mỗi câu sai bị <b>−2</b> điểm. Bạn Minh làm đúng 7 câu, sai 3 câu. Minh được bao nhiêu điểm?',
            hint: 'Tính 7 · 5 + 3 · (−2).',
            explain: '7 · 5 + 3 · (−2) = 35 + (−6) = <b>29</b> điểm.' },
        ],
      },

      /* ===== Phép chia hết, ước và bội của số nguyên ===== */
      {
        title: 'Chia hết – Ước và bội', icon: '➗', desc: 'Chia số nguyên, và vì sao −3 cũng là ước của 6.',
        steps: [
          { kind: 'explore', widget: 'input', before: '(−12) : 3 =', answer: -4,
            table: '<table><tr><td>4 · 3</td><td>=</td><td>12</td><td>→ 12 : 3 = 4</td></tr><tr class="q"><td>? · 3</td><td>=</td><td>−12</td><td>→ (−12) : 3 = ?</td></tr></table>',
            prompt: 'Phép chia là phép “ngược” của phép nhân. Số nào nhân với 3 thì được −12?',
            hint: 'Âm nhân dương ra âm. Vậy ? phải mang dấu gì?',
            explain: '(−4) · 3 = −12 nên <b>(−12) : 3 = −4</b>.' },
          { kind: 'concept', title: 'Phép chia hết & ước, bội',
            html: `<div class="rule">Chia hai số nguyên: chia hai phần số, đặt dấu như phép nhân<br><b>cùng dấu → dương, khác dấu → âm</b>. Ví dụ (−20) : (−5) = 4; 20 : (−5) = −4.</div>
              <div class="rule">Nếu a = b · q (b ≠ 0) thì a <b>chia hết</b> cho b: a là <b>bội</b> của b, b là <b>ước</b> của a.</div>
              <p>Ví dụ 6 = 2 · 3 = (−2) · (−3) nên ước của 6 gồm cả số âm:<br><b>Ư(6) = {1; −1; 2; −2; 3; −3; 6; −6}</b></p>` },
          { kind: 'practice', gen: gDivInt },
          { kind: 'practice', gen: gDivInt },
          { kind: 'practice', gen: gIntDivisors },
          { kind: 'practice', widget: 'multi', tokens: [-15, -10, -9, -6, -4, 0, 3, 5, 8, 12, 14, 21], answer: [-15, -9, -6, 0, 3, 12, 21],
            prompt: 'Chọn <b>tất cả các bội</b> của <b class="big">−3</b>.', hint: 'Bội của −3 là các số chia hết cho 3 (kể cả số âm và số 0).',
            explain: '−15, −9, −6, 0, 3, 12, 21 đều chia hết cho 3 (và cho −3).' },
          { kind: 'practice', gen: gDivInt },
          { kind: 'challenge', widget: 'input', before: 'x =', answer: -7,
            prompt: 'Tìm số nguyên x, biết <b class="big">(−5) · x = 35</b>.', hint: 'x = 35 : (−5).',
            explain: 'x = 35 : (−5) = <b>−7</b>. Thử lại: (−5) · (−7) = 35 ✔' },
        ],
      },

      /* ===== BÀI 7 ===== */
      {
        title: 'Thử thách tổng hợp', icon: '🏆', desc: 'Vượt qua thử thách cuối chương với tất cả kỹ năng đã học.',
        steps: [
          { kind: 'practice', gen: gCompare },
          { kind: 'practice', gen: gPlace },
          { kind: 'practice', gen: gAdd },
          { kind: 'practice', gen: gSub },
          { kind: 'practice', gen: gMul },
          { kind: 'practice', gen: gBracketCalc },
          { kind: 'practice', gen: gDivInt },
          { kind: 'practice', gen: gSort },
          { kind: 'challenge', widget: 'input', before: 'x =', answer: -4,
            prompt: 'Tìm số nguyên x, biết: <b class="big">x + 7 = 3</b>',
            hint: 'x = 3 − 7.', explain: 'x = 3 − 7 = 3 + (−7) = <b>−4</b>. Thử lại: (−4) + 7 = 3 ✔' },
          { kind: 'challenge', widget: 'input', before: 'Số tuổi =', answer: 75,
            prompt: '🏛️ Nhà bác học Ác-si-mét sinh năm <b>287 trước Công nguyên</b> và mất năm <b>212 trước Công nguyên</b>. Ông thọ bao nhiêu tuổi?',
            hint: 'Năm trước Công nguyên viết bằng số âm: sinh năm −287, mất năm −212. Tuổi = năm mất − năm sinh.',
            explain: '(−212) − (−287) = (−212) + 287 = <b>75</b> tuổi.' },
        ],
      },
    ],
  });
})();
