(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const KIND_NAMES = { mc: 'comprensión', tf: 'cierto o falso', vocab: 'vocabulario', ref: 'pronombre' };
  const CORRECT_DELAY_MS = 950;
  const RING_R = 42;

  function node(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  // The lectura view: a passage with tap-to-gloss words, and its questions one at a time beside it.
  function createReading({ host, motion, store, announce, onAnswer, onScores }) {
    const G = root.gsap || null;
    let reading = null;
    let index = 0;
    let picked = null;
    let results = [];
    let timer = 0;
    let right = 0;
    let total = 0;
    let streak = 0;
    let best = 0;
    let parts = {};

    const scores = () => store.state().settings.scores || {};

    function closeGlosses(except) {
      for (const b of host.querySelectorAll('.gl[aria-expanded="true"]')) {
        if (b !== except) b.setAttribute('aria-expanded', 'false');
      }
    }

    function passage(r) {
      const article = node('article', 'passage');
      article.lang = 'es';
      let p = node('p');
      for (const part of D.L2.parseReading(r.text)) {
        if (part.type === 'break') {
          article.appendChild(p);
          p = node('p');
        } else if (part.type === 'text') {
          p.appendChild(document.createTextNode(part.text));
        } else if (part.type === 'gloss') {
          const b = node('button', 'gl');
          b.type = 'button';
          b.setAttribute('aria-expanded', 'false');
          b.append(node('span', 'gl-word', part.text));
          const tip = node('span', 'gl-tip', part.gloss);
          tip.lang = 'en';
          b.appendChild(tip);
          b.addEventListener('click', () => {
            const open = b.getAttribute('aria-expanded') !== 'true';
            closeGlosses(b);
            b.setAttribute('aria-expanded', String(open));
            if (open && motion.on()) G.fromTo(tip, { y: 6, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.22, ease: 'power3.out', clearProps: 'transform,opacity' });
          });
          p.appendChild(b);
        } else {
          const m = node('mark', 'ref', part.text);
          m.dataset.ref = part.id;
          p.appendChild(m);
        }
      }
      article.appendChild(p);
      return article;
    }

    function dots() {
      const list = node('ol', 'dots');
      list.setAttribute('aria-hidden', 'true');
      reading.questions.forEach((_, i) => {
        const d = node('li', 'dot');
        if (results[i] === true) d.dataset.state = 'right';
        else if (results[i] === false) d.dataset.state = 'wrong';
        else if (i === index) d.dataset.state = 'now';
        list.appendChild(d);
      });
      return list;
    }

    function mount(id) {
      clearTimeout(timer);
      reading = D.L2.readings.find((r) => r.id === id) || D.L2.readings[0];
      index = 0;
      results = [];
      const head = node('header', 'read-head');
      head.append(node('span', 'read-tag', reading.tag), node('h1', 'read-title', reading.title));
      const grid = node('div', 'read-grid');
      const quiz = node('aside', 'quiz');
      quiz.setAttribute('aria-label', 'preguntas');
      grid.append(passage(reading), quiz);
      host.replaceChildren(head, grid);
      parts = { head, grid, quiz, article: grid.firstChild };
      if (motion.on()) {
        motion.rise([head, ...parts.article.children], 0.05, 0.07);
        motion.rise(quiz, 0.2);
      }
      question();
    }

    function highlight(ref) {
      for (const m of parts.article.querySelectorAll('.ref')) m.classList.toggle('lit', m.dataset.ref === ref);
    }

    function question() {
      picked = null;
      const q = reading.questions[index];
      highlight(q.ref || null);
      const card = node('div', 'qcard');
      const top = node('div', 'quiz-top');
      top.append(dots(), node('span', 'quiz-n', `${index + 1} / ${reading.questions.length}`));
      card.append(node('p', 'qkind', KIND_NAMES[q.kind]), node('h2', 'qtext', q.q));
      const choices = node('div', q.kind === 'tf' ? 'choices choices-tf' : 'choices');
      choices.setAttribute('role', 'group');
      choices.setAttribute('aria-label', q.q);
      q.options.forEach((opt, i) => {
        const b = node('button', 'choice');
        b.type = 'button';
        b.append(node('span', 'choice-key', String(i + 1)), node('span', 'choice-text', opt));
        b.addEventListener('click', () => choose(i));
        choices.appendChild(b);
      });
      const fix = node('div', 'fix qfix');
      fix.hidden = true;
      const text = node('div', 'fix-text');
      text.append(node('span', 'right'), node('span', 'why'));
      const next = node('button', 'next');
      next.type = 'button';
      next.setAttribute('aria-label', 'siguiente');
      next.addEventListener('click', advance);
      fix.append(text, next);
      card.append(choices, fix);
      parts.quiz.replaceChildren(top, card);
      parts.card = card;
      if (motion.on()) {
        motion.rise(card.querySelector('.qtext'), 0.02);
        motion.choicesIn(Array.from(choices.children), 0.1);
        const lit = parts.article.querySelector('.ref.lit');
        if (lit) G.fromTo(lit, { scale: 1 }, { keyframes: { scale: [1, 1.12, 1] }, duration: 0.5, delay: 0.3, ease: 'power2.out', clearProps: 'transform' });
      }
    }

    function choose(i) {
      if (picked !== null || !reading) return;
      picked = i;
      const q = reading.questions[index];
      const ok = i === q.correct;
      results[index] = ok;
      store.record(`read:${reading.id}:${index}`, ok, Date.now());
      total += 1;
      if (ok) right += 1;
      streak = ok ? streak + 1 : 0;
      if (streak > best) best = streak;
      const buttons = Array.from(parts.card.querySelectorAll('.choice'));
      buttons.forEach((b, j) => {
        b.disabled = true;
        if (j === q.correct) b.dataset.state = 'right';
        else if (j === i) b.dataset.state = 'wrong';
      });
      motion.choicesSettle(buttons, buttons[q.correct], buttons[i]);
      const dot = parts.quiz.querySelectorAll('.dot')[index];
      dot.dataset.state = ok ? 'right' : 'wrong';
      motion.pop(dot, 1.6);
      onAnswer(ok, buttons[i]);
      if (ok) {
        announce('correcto');
        timer = setTimeout(advance, CORRECT_DELAY_MS);
        return;
      }
      const fix = parts.card.querySelector('.qfix');
      fix.querySelector('.right').textContent = q.options[q.correct];
      fix.querySelector('.why').textContent = q.why || '';
      fix.hidden = false;
      announce(`incorrecto: ${q.options[q.correct]}`);
      if (motion.on()) G.fromTo(fix, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' });
      fix.querySelector('.next').focus({ preventScroll: true });
    }

    function advance() {
      clearTimeout(timer);
      if (!reading || picked === null) return;
      if (motion.on()) motion.ghost(parts.card.querySelector('.qtext'), parts.quiz);
      index += 1;
      if (index >= reading.questions.length) finish();
      else question();
    }

    function finish() {
      highlight(null);
      const n = results.filter(Boolean).length;
      const of = reading.questions.length;
      const saved = { ...scores(), [reading.id]: { r: n, t: of } };
      store.setSetting('scores', saved);
      onScores();

      const box = node('div', 'qcard score');
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ring.setAttribute('viewBox', '0 0 100 100');
      ring.setAttribute('class', 'ring');
      ring.setAttribute('aria-hidden', 'true');
      const c = 2 * Math.PI * RING_R;
      ring.innerHTML = `<circle class="ring-track" cx="50" cy="50" r="${RING_R}"/><circle class="ring-fill" cx="50" cy="50" r="${RING_R}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - n / of)}"/>`;
      const num = node('p', 'score-n');
      num.append(node('span', 'score-big', String(n)), node('span', 'score-of', `/ ${of}`));
      const wrap = node('div', 'score-ring');
      wrap.append(ring, num);
      box.appendChild(wrap);

      const misses = reading.questions.map((q, i) => ({ q, i })).filter(({ i }) => results[i] === false);
      if (misses.length) {
        const list = node('ul', 'misses');
        for (const { q } of misses) {
          const li = node('li');
          li.append(node('span', 'miss-q', q.q), node('span', 'miss-a', q.options[q.correct]));
          list.appendChild(li);
        }
        box.appendChild(list);
      }

      const actions = node('div', 'score-actions');
      const again = node('button', 'btn btn-ghost', 'otra vez');
      again.type = 'button';
      again.addEventListener('click', () => mount(reading.id));
      const i = D.L2.readings.indexOf(reading);
      const nextR = D.L2.readings[(i + 1) % D.L2.readings.length];
      const next = node('button', 'btn', 'siguiente lectura');
      next.type = 'button';
      next.addEventListener('click', () => onPick(nextR.id));
      actions.append(again, next);
      box.appendChild(actions);
      parts.quiz.replaceChildren(box);
      announce(`${n} de ${of}`);
      next.focus({ preventScroll: true });

      if (motion.on()) {
        const fill = ring.querySelector('.ring-fill');
        G.fromTo(fill, { attr: { 'stroke-dashoffset': c } }, { attr: { 'stroke-dashoffset': c * (1 - n / of) }, duration: 1.1, ease: 'power3.out', delay: 0.15 });
        const counter = { v: 0 };
        const big = num.querySelector('.score-big');
        G.to(counter, { v: n, duration: 1.1, delay: 0.15, ease: 'power3.out', onUpdate: () => { big.textContent = String(Math.round(counter.v)); } });
        G.fromTo(wrap, { scale: 0.6, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
        motion.rise(Array.from(box.children).slice(1), 0.4, 0.08);
        if (n === of) {
          const layer = parts.quiz;
          setTimeout(() => {
            motion.burst(layer, wrap, 34);
            motion.stamp(layer, '¡perfecto!');
          }, 700);
        }
      }
    }

    let onPick = (id) => mount(id);

    // Digits pick an option; Enter moves on after a miss.
    function key(e) {
      if (!reading || host.hidden) return false;
      if (/^[1-4]$/.test(e.key) && picked === null && parts.card) {
        const q = reading.questions[index];
        const n = Number(e.key) - 1;
        if (q && n < q.options.length) {
          choose(n);
          return true;
        }
      }
      if (e.key === 'Escape') closeGlosses(null);
      return false;
    }

    host.addEventListener('click', (e) => {
      if (!e.target.closest('.gl')) closeGlosses(null);
    });

    return {
      mount,
      key,
      setPicker(fn) {
        onPick = fn;
      },
      current: () => (reading ? reading.id : null),
      scores,
      streak: () => streak,
      best: () => best,
      count: () => total,
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.createReading = createReading;
})(typeof window !== 'undefined' ? window : globalThis);
