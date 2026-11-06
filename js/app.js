/* Bản đồ con đường học + điều hướng (#/, #/lesson/<world>/<idx>, #/review) */
(function () {
  'use strict';
  const M = MathEZ, h = M.h;
  const OFFSETS = [0, -1, -1.5, -1, 0, 1, 1.5, 1];
  const lessonKey = (w, i) => `${w.id}/${i}`;
  const sorted = () => M.worlds.slice().sort((a, b) => a.order - b.order);
  const available = () => sorted().filter((x) => !x.soon);

  function toast(text) {
    const t = h('div', { class: 'toast' }, text);
    document.body.append(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2200);
  }

  function topbar() {
    const S = M.state;
    const mute = h('button', { class: 'icon-btn', type: 'button', title: 'Bật/tắt âm thanh', onclick: () => { S.muted = !S.muted; M.save(); mute.textContent = S.muted ? '🔇' : '🔊'; } }, S.muted ? '🔇' : '🔊');
    return h('header', { class: 'topbar' },
      h('a', { class: 'brand', href: '#/' }, h('span', { class: 'logo' }, 'Σ'), 'Math', h('b', null, 'EZ')),
      h('nav', { class: 'grades' },
        h('button', { class: 'grade active', type: 'button' }, 'Lớp 6'),
        h('button', { class: 'grade', type: 'button', onclick: () => toast('Lộ trình Lớp 2 đang được xây dựng 🚧') }, 'Lớp 2', h('small', null, 'sắp có'))),
      h('div', { class: 'stats' },
        h('span', { class: 'pill', title: 'Chuỗi ngày học liên tiếp' }, '🔥 ' + M.streakNow()),
        h('span', { class: 'pill', title: 'Điểm kinh nghiệm' }, '⭐ ' + S.xp),
        mute));
  }

  function chapterBar(root, w) {
    const S = M.state;
    return h('nav', { class: 'chapters', 'aria-label': 'Chọn chương' }, sorted().map((x) => {
      const done = x.soon ? 0 : x.lessons.filter((_, i) => S.lessons[lessonKey(x, i)]).length;
      const b = h('button', {
        type: 'button', class: 'chap' + (x === w ? ' active' : '') + (x.soon ? ' soon' : ''),
        onclick: () => {
          if (x.soon) return toast(`“${x.title}” đang được soạn 🚧`);
          S.world = x.id; M.save(); renderMap(root);
        },
      }, h('span', { class: 'chap-i' }, x.icon),
      h('span', { class: 'chap-t' }, h('small', null, x.chapter), h('b', null, x.title),
        h('small', null, x.soon ? 'Sắp có' : `${done}/${x.lessons.length} bài` + (done === x.lessons.length ? ' ✔' : ''))));
      return b;
    }));
  }

  function renderMap(root) {
    const S = M.state;
    let w = M.getWorld(S.world);
    if (!w || w.soon) w = available()[0];
    const lessons = w.lessons;
    const doneCount = lessons.filter((_, i) => S.lessons[lessonKey(w, i)]).length;
    const currentIdx = lessons.findIndex((_, i) => !S.lessons[lessonKey(w, i)]);
    const due = M.dueReviews().length, waiting = S.review.length - due;

    root.innerHTML = '';
    const aside = h('aside', { class: 'world-card' },
      h('div', { class: 'world-icon' }, w.icon),
      h('div', { class: 'world-ch' }, `Lớp ${w.grade} · ${w.chapter}`),
      h('h1', null, w.title),
      h('p', null, w.desc),
      h('div', { class: 'world-meta' }, h('span', null, `📘 ${lessons.length} bài học`), h('span', null, '🧩 Bài tập không giới hạn')),
      h('div', { class: 'progress' }, h('i', { style: `width:${(doneCount / lessons.length) * 100}%` })),
      h('div', { class: 'progress-l' }, `Đã xong ${doneCount}/${lessons.length} bài`),
      h('div', { class: 'review-box' + (due ? ' has' : '') },
        h('div', null, h('b', null, '🔁 Ôn tập thông minh'),
          h('p', null, due ? `Có ${due} câu cần ôn hôm nay (từ mọi chương).` : waiting ? `Chưa có câu đến hạn. ${waiting} câu sẽ quay lại trong những ngày tới.` : 'Câu nào làm sai sẽ tự quay lại đây vào ngày hôm sau.')),
        due ? h('a', { class: 'btn primary small', href: '#/review' }, 'Ôn ngay') : null));

    const path = h('section', { class: 'path' },
      h('div', { class: 'level-banner' }, h('small', null, w.chapter.toUpperCase()), h('span', null, w.title)));
    lessons.forEach((l, i) => {
      const rec = S.lessons[lessonKey(w, i)];
      const st = rec ? 'done' : i === currentIdx ? 'current' : 'locked';
      const go = () => {
        if (st === 'locked') return toast('Hoàn thành bài trước để mở khoá bài này 🔒');
        location.hash = `#/lesson/${w.id}/${i}`;
      };
      path.append(h('div', { class: 'node-wrap ' + st, style: `--off:${OFFSETS[i % OFFSETS.length]}` },
        h('button', { class: 'node ' + st, type: 'button', onclick: go, 'aria-label': l.title },
          h('span', null, st === 'done' ? '✓' : st === 'locked' ? '🔒' : l.icon)),
        h('div', { class: 'node-label' }, h('span', null, l.title),
          rec ? h('span', { class: 'node-stars' }, '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : null)));
      if (st === 'current') {
        path.append(h('div', { class: 'start-card' },
          h('div', { class: 'sc-n' }, `Bài ${i + 1}`),
          h('h3', null, l.title), h('p', null, l.desc),
          h('button', { class: 'btn primary block', type: 'button', onclick: go }, i === 0 ? 'Bắt đầu' : 'Học tiếp')));
      }
    });
    if (currentIdx < 0) {
      path.append(h('div', { class: 'start-card done' }, h('h3', null, '🎉 Hoàn thành chương!'), h('p', null, 'Chạm vào bất kỳ bài nào để luyện lại – mỗi lần câu hỏi sẽ khác.')));
    }

    root.append(topbar(), chapterBar(root, w), h('div', { class: 'home' }, aside, path),
      h('footer', { class: 'site-foot' }, 'MathEZ · Học toán bằng cách khám phá · Bám sát SGK Toán 6 Kết nối tri thức'));
  }

  function route() {
    const root = document.getElementById('app');
    const parts = (location.hash.slice(1) || '/').split('/').filter(Boolean);
    M.keyHandler = null;
    window.scrollTo(0, 0);
    if (parts[0] === 'lesson') {
      const w = M.getWorld(parts[1]), idx = +parts[2], l = w && w.lessons[idx];
      if (!l) { location.hash = '#/'; return; }
      const unlocked = idx === 0 || M.state.lessons[`${w.id}/${idx - 1}`];
      if (!unlocked) { location.hash = '#/'; return; }
      M.state.world = w.id; M.save();
      document.title = `${l.title} · MathEZ`;
      let next = null;
      if (idx + 1 < w.lessons.length) next = { label: 'Bài tiếp theo →', href: `#/lesson/${w.id}/${idx + 1}` };
      else {
        const av = available(), nw = av[av.indexOf(w) + 1];
        if (nw) next = { label: `Sang ${nw.chapter} →`, href: `#/lesson/${nw.id}/0` };
      }
      M.play(root, {
        title: l.title,
        steps: l.steps.map((s, k) => ({ step: s, ref: [w.id, idx, k] })),
        onExit: () => { location.hash = '#/'; },
        onFinish: (res) => {
          const key = `${w.id}/${idx}`, prev = M.state.lessons[key];
          M.state.lessons[key] = { done: true, stars: Math.max(res.stars, prev ? prev.stars : 0) };
        },
        next,
      });
    } else if (parts[0] === 'review') {
      const steps = M.dueReviews().slice(0, 10).map((r) => {
        const [wid, li, si] = r.ref, w = M.getWorld(wid);
        const st = w && w.lessons[li] && w.lessons[li].steps[si];
        return st && st.kind !== 'concept' ? { step: st, ref: r.ref } : null;
      }).filter(Boolean);
      if (!steps.length) { location.hash = '#/'; return; }
      document.title = 'Ôn tập · MathEZ';
      M.play(root, { title: 'Ôn tập', review: true, steps: M.shuffle(steps), onExit: () => { location.hash = '#/'; } });
    } else {
      document.title = 'MathEZ – Học Toán lớp 6';
      renderMap(root);
    }
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);
})();
