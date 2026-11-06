/* Trình chạy bài học: Khám phá → Khái niệm → Luyện tập → Thử thách */
(function () {
  'use strict';
  const M = MathEZ, h = M.h;
  const KIND = { explore: '🔍 Khám phá', concept: '💡 Khái niệm', practice: '✏️ Luyện tập', challenge: '🏆 Thử thách', review: '🔁 Ôn tập' };
  const PRAISE = ['Chính xác!', 'Tuyệt vời!', 'Giỏi lắm!', 'Đúng rồi!', 'Xuất sắc!', 'Quá đỉnh!'];
  const ENC = ['Chưa đúng, thử lại nhé!', 'Gần được rồi, xem gợi ý nhé!', 'Suy nghĩ thêm chút nữa nào!'];

  M.resolveStep = (step) => (step.gen ? Object.assign({}, step, step.gen()) : Object.assign({}, step));

  /** opts: {title, steps:[{step, ref}], review, onExit, onFinish, next:{label, href}} */
  M.play = function (root, opts) {
    const steps = opts.steps;
    let i = 0, wrongTotal = 0, firstTry = 0, questions = 0, cur = null, mode = 'check';
    root.innerHTML = '';
    const bar = h('i');
    const card = h('main', { class: 'pcard' });
    const fb = h('div', { class: 'fb', 'aria-live': 'polite' });
    const alt = h('button', { class: 'btn ghost', type: 'button', onclick: () => reveal() }, 'Xem lời giải');
    const main = h('button', { class: 'btn primary', type: 'button', onclick: () => primary() }, 'Kiểm tra');
    const foot = h('footer', { class: 'pfoot' }, h('div', { class: 'pfoot-in' }, fb, h('div', { class: 'fbtns' }, alt, main)));
    root.append(h('div', { class: 'player' },
      h('header', { class: 'ptop' },
        h('button', { class: 'icon-btn', type: 'button', title: 'Thoát về bản đồ', onclick: () => opts.onExit() }, '✕'),
        h('div', { class: 'pbar' }, bar),
        h('span', { class: 'pcount' }, '')),
      card, foot));
    const pcount = root.querySelector('.pcount');

    function setMode(m) {
      mode = m;
      main.textContent = m === 'check' ? 'Kiểm tra' : 'Tiếp tục';
      main.disabled = m === 'check' && !cur.ready;
    }
    function clearFb() { fb.innerHTML = ''; foot.classList.remove('ok', 'bad'); alt.hidden = true; }

    function show() {
      bar.style.width = (i / steps.length) * 100 + '%';
      pcount.textContent = `${i + 1}/${steps.length}`;
      const { step, ref } = steps[i];
      const q = M.resolveStep(step);
      cur = { q, ref, attempts: 0, done: false, ready: false };
      clearFb();
      card.innerHTML = '';
      card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      const kind = opts.review ? 'review' : q.kind;
      card.append(h('div', { class: 'kind k-' + kind }, KIND[kind] || ''));
      if (q.title) card.append(h('h2', { class: 'q-title' }, q.title));
      if (q.prompt) card.append(h('div', { class: 'prompt', html: q.prompt }));
      if (q.kind === 'concept') {
        card.append(h('div', { class: 'concept', html: q.html || '' }));
        cur.ready = true; setMode('next');
      } else {
        const box = h('div', { class: 'widget' });
        card.append(box);
        const W = M.widgets[q.widget];
        if (!W) throw new Error('Không có widget: ' + q.widget);
        cur.w = W.render(box, q, { ready: (r) => { cur.ready = r; if (mode === 'check' && !cur.done) main.disabled = !r; } });
        questions++;
        setMode('check');
      }
      window.scrollTo(0, 0);
    }

    function check() {
      let r = cur.w.check();
      if (typeof r === 'boolean') r = { ok: r };
      cur.attempts++;
      if (r.ok) {
        cur.done = true; cur.w.lock && cur.w.lock();
        if (cur.attempts === 1) firstTry++;
        if (opts.review && cur.attempts === 1) M.reviewResult(cur.ref.join('|'), true);
        M.sfx('ok');
        foot.classList.add('ok'); foot.classList.remove('bad');
        fb.innerHTML = `<b>✅ ${M.pick(PRAISE)}</b>` + (cur.q.explain ? `<p>${cur.q.explain}</p>` : '');
        alt.hidden = true; setMode('next');
      } else {
        wrongTotal++; M.sfx('bad');
        if (cur.attempts === 1) {
          if (opts.review) M.reviewResult(cur.ref.join('|'), false);
          else if (cur.ref) M.addMistake(cur.ref);
        }
        foot.classList.add('bad'); foot.classList.remove('ok');
        fb.innerHTML = `<b>🤔 ${M.pick(ENC)}</b>` + (r.msg ? `<p>${r.msg}</p>` : '') + (cur.q.hint ? `<p class="hint">💡 ${cur.q.hint}</p>` : '');
        alt.hidden = cur.attempts < 2;
        main.disabled = true; // đổi đáp án mới bấm Kiểm tra lại
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      }
      M.save();
    }

    function reveal() {
      if (!cur || cur.done) return;
      cur.w.showAnswer(); cur.done = true; cur.w.lock && cur.w.lock();
      foot.classList.remove('bad'); foot.classList.add('ok', 'revealed');
      fb.innerHTML = '<b>📖 Lời giải</b>' + (cur.q.explain ? `<p>${cur.q.explain}</p>` : '') + '<p class="hint">Câu này sẽ quay lại trong phần Ôn tập để bạn luyện thêm.</p>';
      alt.hidden = true; setMode('next');
    }

    function next() {
      foot.classList.remove('revealed');
      i++;
      if (i >= steps.length) finish(); else show();
    }
    function primary() { if (main.disabled) return; if (mode === 'check') check(); else next(); }

    function finish() {
      const stars = wrongTotal <= 1 ? 3 : wrongTotal <= 3 ? 2 : 1;
      const xp = firstTry * 10 + (questions - firstTry) * 4 + 20;
      M.state.xp += xp; M.touchStreak();
      opts.onFinish && opts.onFinish({ stars, xp });
      M.save(); M.sfx('win');
      const msg = stars === 3 ? 'Hoàn hảo! Bạn nắm bài rất chắc.' : stars === 2 ? 'Làm tốt lắm! Vài câu sai sẽ được ôn lại sau.' : 'Bạn đã cố gắng đến cùng – đó mới là điều quan trọng! Hãy thử lại bài này nhé.';
      root.innerHTML = '';
      root.append(h('div', { class: 'summary' },
        h('div', { class: 'mascot' }, '🦉'),
        h('h1', null, opts.review ? 'Ôn tập xong!' : 'Hoàn thành bài học!'),
        opts.review ? null : h('div', { class: 'stars' }, [1, 2, 3].map((k) => h('span', { class: 'star' + (k <= stars ? ' on' : ''), style: `animation-delay:${0.15 + k * 0.2}s` }, '★'))),
        h('div', { class: 'sum-stats' },
          h('span', { class: 'pill' }, `+${xp} XP ⭐`),
          h('span', { class: 'pill' }, `🔥 ${M.streakNow()} ngày liên tiếp`),
          h('span', { class: 'pill' }, `🎯 ${firstTry}/${questions} đúng ngay lần đầu`)),
        h('p', { class: 'sum-msg' }, msg),
        h('div', { class: 'sum-btns' },
          h('a', { class: 'btn ghost', href: '#/' }, 'Về bản đồ'),
          opts.next ? h('a', { class: 'btn primary', href: opts.next.href }, opts.next.label) : null)));
      confetti(root);
      M.keyHandler = (e) => { if (e.key === 'Enter') { e.preventDefault(); location.hash = opts.next ? opts.next.href : '#/'; } };
    }

    function confetti(where) {
      const colors = ['#4a6cf7', '#f5b82e', '#1fae6b', '#ef5a5a', '#9b6cf7'];
      const layer = h('div', { class: 'confetti', 'aria-hidden': 'true' });
      for (let k = 0; k < 60; k++) {
        layer.append(h('i', { style: `left:${Math.random() * 100}%;background:${M.pick(colors)};animation-delay:${Math.random() * 0.6}s;animation-duration:${1.8 + Math.random() * 1.4}s;transform:rotate(${Math.random() * 360}deg)` }));
      }
      where.append(layer);
      setTimeout(() => layer.remove(), 3800);
    }

    M.keyHandler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (cur && cur.w && cur.w.onEnter && !cur.done && cur.w.onEnter()) return;
        primary(); return;
      }
      if (cur && cur.w && cur.w.onKey && !cur.done) cur.w.onKey(e);
    };
    // dùng cho kiểm thử tự động
    M.current = { reveal, next, primary, get q() { return cur && cur.q; }, get w() { return cur && cur.w; }, get mode() { return mode; } };
    show();
  };
})();
