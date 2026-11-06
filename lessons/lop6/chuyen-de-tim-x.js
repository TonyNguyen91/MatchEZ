/* ==========================================================
   CHUYÊN ĐỀ: TÌM X – kéo thả qua dấu "=" (quy tắc chuyển vế)
   ========================================================== */
(function () {
  const M = MathEZ, R = M.rand, RN = M.randNZ, N = M.N, P = M.P;

  /** Tạo câu hỏi phương trình từ x và chuỗi phép tính (trong → ngoài) */
  const E = M.eq;
  /** Phương trình từ cây biểu thức vế trái + số vế phải */
  const eqT = (lhs, right, x, extra = {}) => Object.assign({
    widget: 'equation', lhs, rhs: E.num(right), answer: x,
    prompt: `Tìm x, biết: <span class="big">${E.text(lhs)} = ${N(right)}</span>`,
    explain: `<div class="sol">${E.solve(lhs, E.num(right)).join('<br>')}</div>`,
  }, extra);
  const eq = (x, ops, extra = {}) => eqT(E.fromOps(ops), E.forward(x, ops), x, extra);
  /** a − x = b */
  const eqSubX = (a, x, extra) => eqT(E.sum([{ s: 1, e: E.num(a) }, { s: -1, e: E.X() }]), a - x, x, extra);
  /** a : x = b */
  const eqDivX = (a, x, extra) => eqT(E.prod([{ op: '·', e: E.num(a) }, { op: ':', e: E.X() }]), a / x, x, extra);
  const gSubX = () => { const x = R(2, 60); return eqSubX(x + R(1, 60), x); };
  const gDivX = () => { const x = R(2, 12); return eqDivX(x * R(2, 12), x); };

  /* ---------- Bộ sinh câu hỏi (số tự nhiên) ---------- */
  const gAdd = () => eq(R(3, 80), [{ op: '+', v: R(2, 60) }]);
  const gSub = () => { const x = R(12, 99); return eq(x, [{ op: '−', v: R(2, x - 1) }]); };
  const gMul = () => eq(R(2, 15), [{ op: '·', v: R(2, 12) }]);
  const gDiv = () => { const a = R(2, 9); return eq(a * R(2, 12), [{ op: ':', v: a }]); };
  const gOne = () => M.pick([gAdd, gSub, gMul, gDiv])();
  const gTwo = () => {
    const t = R(0, 3), a = R(2, 9);
    if (t === 0) return eq(R(2, 20), [{ op: '·', v: a }, { op: '+', v: R(2, 40) }]);
    if (t === 1) { const x = R(3, 20); return eq(x, [{ op: '·', v: a }, { op: '−', v: R(1, a * x - 1) }]); }
    if (t === 2) return eq(a * R(2, 12), [{ op: ':', v: a }, { op: '+', v: R(2, 30) }]);
    const x = a * R(3, 12); return eq(x, [{ op: ':', v: a }, { op: '−', v: R(1, x / a - 1) }]);
  };
  const gBr = () => {
    const t = R(0, 2), b = R(2, 9);
    if (t === 0) { const x = R(6, 30); return eq(x, [{ op: '−', v: R(1, x - 1) }, { op: '·', v: b }]); }
    if (t === 1) return eq(R(1, 30), [{ op: '+', v: R(1, 30) }, { op: '·', v: b }]);
    let x, a; do { x = R(1, 50); a = R(1, 30); } while ((x + a) % b !== 0);
    return eq(x, [{ op: '+', v: a }, { op: ':', v: b }]);
  };
  const gBr3 = () => {
    const b = R(2, 6), x = R(5, 25), a = R(1, x - 1);
    return eq(x, [{ op: '−', v: a }, { op: '·', v: b }, M.pick([{ op: '+', v: R(2, 30) }, { op: '−', v: R(1, b * (x - a) - 1) }])]);
  };
  /* ---------- số nguyên ---------- */
  const gInt1 = () => {
    const x = RN(-20, 20);
    return M.pick([
      () => eq(x, [{ op: '+', v: RN(-25, 25) }]),
      () => eq(x, [{ op: '−', v: RN(-25, 25) }]),
      () => eq(x, [{ op: '·', v: M.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]) }]),
    ])();
  };
  const gInt2 = () => {
    const x = RN(-12, 12), a = M.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5]);
    return M.pick([
      () => eq(x, [{ op: '·', v: a }, { op: M.pick(['+', '−']), v: RN(-20, 20) }]),
      () => eq(x, [{ op: M.pick(['+', '−']), v: RN(-9, 9) }, { op: '·', v: a }]),
    ])();
  };

  /* ---------- câu hỏi khái niệm ---------- */
  const FLIP = { '+': '−', '−': '+', '·': ':', ':': '·' };
  const gFlip = (ops) => () => {
    const op = M.pick(ops), v = R(2, 15);
    const chip = op === '·' ? `${v} ·` : `${op} ${v}`, right = `${FLIP[op]} ${v}`;
    const all = ['+', '−', '·', ':'].map((o) => `${o} ${v}`);
    return {
      widget: 'choice', options: M.uniq([right, ...M.shuffle(all)]), answer: right,
      prompt: `Khi chuyển <span class="eqchip mini">${chip}</span> từ vế trái sang vế phải, nó trở thành:`,
      hint: 'Qua dấu “=”: cộng ↔ trừ, nhân ↔ chia.',
      explain: `${chip} → <b>${right}</b>.`,
    };
  };

  M.addWorld({
    id: 'tim-x', order: 3.5, grade: 6, chapter: 'Chuyên đề', title: 'Tìm x', icon: '⚖️',
    desc: 'Kéo các số qua dấu “=” để tìm x: cộng thành trừ, nhân thành chia. Từ một bước đến nhiều bước, có ngoặc, có số âm – dạng bài luôn có trong đề kiểm tra.',
    lessons: [
      /* ===== 1 ===== */
      {
        title: 'Cộng ⇄ Trừ', icon: '➕', desc: 'Kéo +2 qua dấu “=” và xem nó biến thành gì!',
        steps: [
          Object.assign(eq(5, [{ op: '+', v: 2 }]), { kind: 'explore', title: 'Phép màu ở dấu “=”',
            prompt: 'Tìm x, biết <span class="big">x + 2 = 7</span>.<br>Hãy <b>kéo ô “+ 2”</b> qua dấu “=” sang vế phải. Để ý xem dấu của nó thay đổi thế nào!',
            explain: 'Khi sang vế phải, <b>+ 2</b> biến thành <b>− 2</b>: x = 7 − 2 = 5. Thử lại: 5 + 2 = 7 ✔' }),
          { kind: 'concept', title: 'Vì sao lại đổi dấu?',
            html: `<p>⚖️ Hãy tưởng tượng phương trình là một <b>chiếc cân thăng bằng</b>: vế trái nặng bằng vế phải.</p>
              <div class="rule">x + 2 = 7<br>Bớt 2 ở <b>cả hai</b> đĩa cân, cân vẫn thăng bằng:<br>x + 2 <b>− 2</b> = 7 <b>− 2</b><br>→ x = 7 − 2</div>
              <p>Nhìn gọn lại: số <b>+ 2</b> đã “nhảy” qua dấu “=” và trở thành <b>− 2</b>.</p>
              <div class="rule"><b>Quy tắc chuyển vế:</b> khi chuyển một số hạng từ vế này sang vế kia, phải <b>đổi dấu</b> số hạng đó:<br>+ thành − &nbsp;&nbsp;•&nbsp;&nbsp; − thành +</div>` },
          Object.assign(eq(13, [{ op: '−', v: 4 }]), { kind: 'practice' }),
          { kind: 'practice', gen: gFlip(['+', '−']) },
          { kind: 'practice', gen: gAdd },
          { kind: 'practice', gen: gSub },
          eqSubX(20, 12, { kind: 'explore', title: 'x cũng kéo được!',
            prompt: 'Tìm x, biết <span class="big">20 − x = 8</span>. Lần này x đang bị trừ. Hãy thử <b>kéo chính x</b> sang vế phải!',
            hint: 'Kéo “− x” sang phải thành “+ x”, rồi kéo 8 sang trái.',
            explain: '20 − x = 8 → <b>20 = 8 + x</b> (− x sang phải thành + x) → <b>20 − 8 = x</b> → x = 12. Thử lại: 20 − 12 = 8 ✔' }),
          { kind: 'practice', gen: gSubX },
          { kind: 'practice', gen: gAdd },
          { kind: 'challenge', widget: 'choice', options: ['Nam chuyển +15 sang mà quên đổi dấu', 'Nam tính sai phép cộng', 'Nam làm đúng'], answer: 'Nam chuyển +15 sang mà quên đổi dấu',
            prompt: 'Bạn Nam giải: <span class="big">x + 15 = 40 → x = 40 + 15 = 55</span>. Nam sai ở đâu?',
            hint: 'Thử lại: 55 + 15 có bằng 40 không?', explain: 'Chuyển +15 sang vế phải phải thành <b>−15</b>: x = 40 − 15 = 25. Luôn thử lại để bắt lỗi!' },
        ],
      },
      /* ===== 2 ===== */
      {
        title: 'Nhân ⇄ Chia', icon: '✖️', desc: '3 · x = 12: kéo “3 ·” qua dấu bằng thành “: 3”.',
        steps: [
          Object.assign(eq(4, [{ op: '·', v: 3 }]), { kind: 'explore',
            prompt: 'Tìm x, biết <span class="big">3 · x = 12</span>.<br>Kéo ô <b>“3 ·”</b> sang vế phải. Lần này nó biến thành gì?',
            explain: '<b>3 ·</b> sang vế phải thành <b>: 3</b>: x = 12 : 3 = 4. Thử lại: 3 · 4 = 12 ✔' }),
          { kind: 'concept', title: 'Nhân thành chia, chia thành nhân',
            html: `<p>⚖️ 3 · x = 12 nghĩa là 3 gói x nặng bằng 12. <b>Chia cả hai đĩa cân cho 3</b>, ta được 1 gói x nặng bằng 12 : 3.</p>
              <div class="rule">3 · x = 12 → x = 12 : 3<br>x : 4 = 6 → x = 6 · 4</div>
              <div class="rule"><b>Thừa số</b> chuyển vế → thành <b>số chia</b>.<br><b>Số chia</b> chuyển vế → thành <b>thừa số</b>.<br>(nhân ↔ chia)</div>` },
          Object.assign(eq(24, [{ op: ':', v: 4 }]), { kind: 'practice' }),
          { kind: 'practice', gen: gFlip(['+', '−', '·', ':']) },
          { kind: 'practice', gen: gMul },
          { kind: 'practice', gen: gDiv },
          eqDivX(36, 9, { kind: 'explore', title: 'Khi x là số chia',
            prompt: 'Tìm x, biết <span class="big">36 : x = 4</span>. Thử kéo số 36 trước – rồi thử kéo x!',
            hint: 'Số bị chia (36) chưa chuyển được. Kéo “: x” sang phải thành “· x”.',
            explain: '36 : x = 4 → <b>36 = 4 · x</b> (: x sang phải thành · x) → <b>36 : 4 = x</b> → x = 9.' }),
          { kind: 'practice', gen: gDivX },
          { kind: 'practice', gen: gOne },
          { kind: 'challenge', widget: 'choice', shuffle: false, options: ['Đúng', 'Sai'], answer: 'Sai',
            prompt: 'Bạn Lan giải: <span class="big">5 · x = 45 → x = 45 · 5</span>. Lan làm đúng hay sai?',
            hint: 'Thừa số 5 sang vế phải thì thành phép gì?', explain: 'Sai! “5 ·” sang vế phải thành “: 5”: x = 45 : 5 = <b>9</b>.' },
        ],
      },
      /* ===== 3 ===== */
      {
        title: 'Tìm x hai bước', icon: '🧅', desc: '2 · x + 5 = 17: chuyển phần nào trước?',
        steps: [
          Object.assign(eq(6, [{ op: '·', v: 2 }, { op: '+', v: 5 }]), { kind: 'explore', title: 'Bóc từ ngoài vào trong',
            prompt: 'Tìm x, biết <span class="big">2 · x + 5 = 17</span>.<br>Thử kéo số <b>2</b> sang vế phải xem chuyện gì xảy ra (có thể kéo ngược lại). Rồi tìm cách để x đứng một mình!',
            explain: 'Số 2 đang “dính” với x thành <b>một số hạng 2 · x</b>, nên kéo 2 thì cả cụm 2 · x bị chuyển theo. Cách gọn nhất: chuyển <b>+ 5</b> trước → 2 · x = 17 − 5 = 12, rồi mới chuyển <b>2 ·</b> → x = 12 : 2 = 6.' }),
          { kind: 'concept', title: 'Thứ tự chuyển vế',
            html: `<p>Hãy xem x được “gói” thế nào trong <b>2 · x + 5</b>: lấy x → <b>nhân 2</b> → rồi <b>cộng 5</b>. Phép cộng 5 là lớp giấy gói <b>ngoài cùng</b>.</p>
              <div class="rule">Khi giải, <b>bóc từ ngoài vào trong</b> – ngược với thứ tự tính:<br>1) chuyển <b>+ 5</b> trước: 2 · x = 17 − 5 = 12<br>2) rồi chuyển <b>2 ·</b>: x = 12 : 2 = 6</div>
              <p>Mẹo: phép cộng, trừ <b>bên ngoài</b> thường được chuyển trước; phép nhân, chia dính với x được chuyển sau.</p>` },
          { kind: 'practice', widget: 'choice', shuffle: false, options: ['− 7', '3 ·'], answer: '− 7',
            prompt: 'Với <span class="big">3 · x − 7 = 20</span>, phải chuyển phần nào sang vế phải <b>trước</b>?',
            hint: 'Phần nào là lớp “ngoài cùng”?', explain: '<b>− 7</b> ở ngoài cùng → chuyển trước: 3 · x = 27, rồi x = 9.' },
          { kind: 'practice', gen: gTwo },
          { kind: 'practice', gen: gTwo },
          { kind: 'practice', gen: gTwo },
          Object.assign(eq(12, [{ op: '·', v: 3 }, { op: '+', v: 5 }]), { kind: 'challenge',
            prompt: '🛒 Mẹ mua <b>3 hộp bút</b> giống nhau và 1 cục tẩy giá <b>5 nghìn</b>, hết tất cả <b>41 nghìn</b>. Gọi x là giá một hộp bút (nghìn đồng), ta có: <span class="big">3 · x + 5 = 41</span>. Tìm x.' }),
        ],
      },
      /* ===== 4 ===== */
      {
        title: 'Tìm x có dấu ngoặc', icon: '📦', desc: 'Phần ngoài ngoặc chuyển trước, ngoặc sẽ tự “mở ra”.',
        steps: [
          Object.assign(eq(8, [{ op: '−', v: 3 }, { op: '·', v: 4 }]), { kind: 'explore',
            prompt: 'Tìm x, biết <span class="big">4 · (x − 3) = 20</span>.<br>Lần này “− 3” nằm <b>trong ngoặc</b>. Phần nào kéo được trước?',
            explain: '“4 ·” ở ngoài ngoặc → chuyển trước: x − 3 = 20 : 4 = 5. Ngoặc mở ra, rồi chuyển “− 3”: x = 5 + 3 = 8.' }),
          { kind: 'concept', title: 'Ngoặc như một chiếc hộp',
            html: `<p>📦 Dấu ngoặc giống một chiếc hộp: phải xử lý <b>hết phần bên ngoài hộp</b> thì mới mở được hộp.</p>
              <div class="rule">4 · (x − 3) = 20<br>→ x − 3 = 20 : 4 = 5 &nbsp;<small>(chuyển phần ngoài ngoặc)</small><br>→ x = 5 + 3 = 8 &nbsp;<small>(ngoặc đã mở, chuyển tiếp)</small></div>
              <p>Coi cả ngoặc (x − 3) như <b>một số chưa biết</b> để tìm trước.</p>` },
          { kind: 'practice', gen: gBr },
          { kind: 'practice', gen: gBr },
          { kind: 'practice', widget: 'choice', options: ['x + 2 = 35 : 5', '5 · x = 35 − 2', 'x + 2 = 35 − 5'], answer: 'x + 2 = 35 : 5',
            prompt: 'Với <span class="big">5 · (x + 2) = 35</span>, bước đầu tiên đúng là:', hint: 'Phần nào nằm ngoài ngoặc?', explain: '“5 ·” ngoài ngoặc chuyển trước: x + 2 = 35 : 5 = 7 → x = 5.' },
          { kind: 'practice', gen: gBr3 },
          { kind: 'practice', gen: gBr },
          Object.assign(eq(11, [{ op: '+', v: 6 }, { op: '·', v: 2 }, { op: '−', v: 4 }]), { kind: 'challenge' }),
        ],
      },
      /* ===== 5 ===== */
      {
        title: 'Tìm x với số nguyên', icon: '🌡️', desc: 'Khi kết quả là số âm – chuyển vế vẫn đúng như thường.',
        steps: [
          Object.assign(eq(-4, [{ op: '+', v: 7 }]), { kind: 'explore',
            prompt: 'Tìm x, biết <span class="big">x + 7 = 3</span>. Với số nguyên, x có thể là số âm!',
            explain: 'x = 3 − 7 = <b>−4</b>. Thử lại: (−4) + 7 = 3 ✔' }),
          { kind: 'concept', title: 'Chuyển vế với số nguyên',
            html: `<p>Quy tắc vẫn y như cũ – chỉ cần cẩn thận với dấu của số âm:</p>
              <div class="rule">x − (−3) = −8 → x = −8 + (−3) = −11<br>(−5) · x = 35 → x = 35 : (−5) = −7</div>
              <p>Nhớ quy tắc dấu khi nhân, chia: <b>cùng dấu → dương, khác dấu → âm</b>.</p>` },
          Object.assign(eq(-11, [{ op: '−', v: -3 }]), { kind: 'practice' }),
          Object.assign(eq(-7, [{ op: '·', v: -5 }]), { kind: 'practice' }),
          { kind: 'practice', gen: gInt1 },
          { kind: 'practice', gen: gInt1 },
          { kind: 'practice', gen: gInt2 },
          Object.assign(eq(0, [{ op: '−', v: 4 }, { op: '·', v: 3 }, { op: '+', v: 10 }]), { kind: 'challenge' }),
        ],
      },
      /* ===== 6 ===== */
      {
        title: 'Thử thách Tìm x', icon: '🏆', desc: 'Trộn đủ mọi dạng – sẵn sàng cho bài kiểm tra!',
        steps: [
          { kind: 'practice', gen: gOne },
          { kind: 'practice', gen: gSubX },
          { kind: 'practice', gen: gTwo },
          { kind: 'practice', gen: gDivX },
          { kind: 'practice', gen: gBr },
          { kind: 'practice', gen: gInt1 },
          { kind: 'practice', gen: gBr3 },
          { kind: 'practice', gen: gInt2 },
          Object.assign(eq(25, [{ op: ':', v: 5 }, { op: '+', v: 13 }, { op: '·', v: 2 }]), { kind: 'challenge',
            prompt: 'Tìm x, biết <span class="big">2 · (x : 5 + 13) = 36</span>' }),
        ],
      },
    ],
  });
})();
