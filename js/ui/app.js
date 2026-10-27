(function () {
  'use strict';
  const D = window.Drill;
  const G = window.gsap || null;
  const $ = (id) => document.getElementById(id);

  const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
  const CORRECT_DELAY_MS = 320;
  const CORRECT_DELAY_ANIMATED_MS = 560;
  const MILESTONE = 5;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 860px)');
  // Without GSAP (offline, blocked CDN) or with reduced motion, every state change is instant.
  const animate = () => Boolean(G) && !reduceMotion.matches;

  const session = D.createSession({ verbs: D.verbs, tenses: D.tenses, store: D.store });

  const el = {
    app: $('app'), side: $('side'), main: $('main'), menu: $('menu'), close: $('close'), scrim: $('scrim'),
    book: $('book'), types: $('types'), vos: $('vos'), pool: $('pool'),
    streakBox: $('streak-box'), streak: $('streak'), best: $('best'), acc: $('acc'), count: $('count'),
    stage: $('stage'), card: $('card'), person: $('person'), flag: $('flag'), verb: $('verb'), gloss: $('gloss'),
    form: $('form'), field: $('field'), input: $('input'), echo: $('echo'), submit: $('submit'),
    fix: $('fix'), right: $('right'), next: $('next'), keys: $('keys'), empty: $('empty'),
    burst: $('burst'), conj: $('conj'), live: $('live'),
  };

  let prompt = null;
  let mode = 'asking';
  let timer = 0;
  let wrongShownAt = 0;
  let settingsDirty = false;

  // Long infinitives and long answers (nos divertimos) shrink so they never overflow.
  const verbScale = (n) => (n <= 7 ? 1 : n <= 9 ? 0.86 : n <= 11 ? 0.72 : 0.6);
  const answerScale = (n) => (n <= 10 ? 1 : n <= 14 ? 0.8 : 0.64);

  // Row labels of the conjugation table.
  const SHORT = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  const COMMAND = [null, 'tú', 'Ud.', 'nosotros', 'vosotros', 'Uds.'];
  const BOOK_NAMES = { all: 'todos', D1: 'Descubre 1', D2: 'Descubre 2' };

  function announce(text) {
    el.live.textContent = '';
    el.live.textContent = text;
  }

  function setMode(next) {
    mode = next;
    el.stage.dataset.mode = next;
  }

  function node(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function letters(target, text, marks) {
    target.replaceChildren(...Array.from(text).map((ch, i) => node('span', marks && marks[i] ? 'ch miss' : 'ch', ch)));
    return Array.from(target.children);
  }

  /* ---------- motion ---------- */

  function enterLetters(chars, delay = 0) {
    G.fromTo(
      chars,
      { y: '0.55em', rotationX: -85, opacity: 0 },
      { y: 0, rotationX: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.032, delay, clearProps: 'transform,opacity' }
    );
  }

  // Letters drift apart from the middle and slide away.
  function scatterLetters(chars, done) {
    const mid = (chars.length - 1) / 2;
    G.to(chars, {
      x: (i) => (i - mid) * 16 + G.utils.random(-8, 8),
      y: () => G.utils.random(-80, -36),
      rotation: () => G.utils.random(-40, 40),
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      stagger: { each: 0.014, from: 'center' },
      onComplete: done,
    });
  }

  // A detached copy of the old text flies out while the new text is already usable.
  function ghost(source) {
    if (!source.textContent.trim() || !source.getClientRects().length) return;
    const host = el.card.getBoundingClientRect();
    const r = source.getBoundingClientRect();
    const g = source.cloneNode(true);
    g.removeAttribute('id');
    g.setAttribute('aria-hidden', 'true');
    g.classList.add('ghost');
    Object.assign(g.style, {
      left: `${r.left - host.left}px`,
      top: `${r.top - host.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      color: getComputedStyle(source).color,
    });
    el.card.appendChild(g);
    scatterLetters(Array.from(g.querySelectorAll('.ch')), () => g.remove());
  }

  function burst(n) {
    const stage = el.stage.getBoundingClientRect();
    const from = el.submit.getBoundingClientRect();
    const cx = from.left + from.width / 2 - stage.left;
    const cy = from.top + from.height / 2 - stage.top;
    for (let i = 0; i < n; i += 1) {
      const s = node('span', `spark spark-${i % 3}`);
      s.style.left = `${cx}px`;
      s.style.top = `${cy}px`;
      el.burst.appendChild(s);
      const a = Math.random() * Math.PI * 2;
      const d = 36 + Math.random() * (n > 12 ? 170 : 90);
      G.fromTo(
        s,
        { x: -4, y: -4, scale: 1, rotation: 0, opacity: 1 },
        {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d - 24,
          rotation: G.utils.random(-200, 200),
          scale: 0.3,
          opacity: 0,
          duration: 0.55 + Math.random() * 0.35,
          ease: 'power3.out',
          onComplete: () => s.remove(),
        }
      );
    }
  }

  function pop(target, scale = 1.18) {
    G.fromTo(target, { scale: 1 }, { scale, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', clearProps: 'transform' });
  }

  function shake(target, dist = 12) {
    const k = [0, -dist, dist * 0.8, -dist * 0.55, dist * 0.3, 0];
    G.fromTo(target, { x: 0 }, { keyframes: { x: k }, duration: 0.42, ease: 'none', clearProps: 'transform' });
  }

  /* ---------- side rail ---------- */

  // One row of the rail: a real input, a drawn box, the name, an optional example, and a live count.
  function option({ type, name, value, label, example }) {
    const row = node('label', 'opt');
    const input = node('input', 'opt-input');
    input.type = type;
    if (name) input.name = name;
    input.value = value;
    const box = node('span', 'opt-box');
    box.setAttribute('aria-hidden', 'true');
    row.append(input, box, node('span', 'opt-name', label));
    if (example) row.appendChild(node('span', 'opt-ex', example));
    row.appendChild(node('span', 'opt-count'));
    return row;
  }

  function buildRail() {
    const seg = node('div', 'seg');
    for (const book of ['all', 'D1', 'D2']) {
      const row = node('label', 'seg-opt');
      const input = node('input', 'opt-input');
      input.type = 'radio';
      input.name = 'book';
      input.value = book;
      input.addEventListener('change', () => changed(() => session.setBook(book)));
      row.append(input, node('span', null, BOOK_NAMES[book]), node('span', 'seg-n'));
      seg.appendChild(row);
    }
    el.book.appendChild(seg);

    const top = node('div', 'types-top');
    const all = node('label', 'all');
    const allInput = node('input', 'opt-input');
    allInput.type = 'checkbox';
    allInput.value = '';
    allInput.addEventListener('change', () => changed(() => session.setAllTypes(allInput.checked)));
    all.append(allInput, node('span', null, 'todos'), node('span', 'all-n'));
    top.appendChild(all);
    el.types.appendChild(top);

    for (const group of D.TYPE_GROUPS) {
      const box = node('div', 'type-group');
      box.appendChild(node('p', 'type-group-name', group.name));
      for (const tag of group.tags) {
        const info = D.TYPE_INFO[tag];
        const row = option({ type: 'checkbox', value: tag, label: info.name, example: info.example });
        row.querySelector('input').addEventListener('change', () => changed(() => session.toggleType(tag)));
        box.appendChild(row);
      }
      el.types.appendChild(box);
    }

    el.vos.addEventListener('change', () => changed(() => session.setVosotros(el.vos.checked)));
    syncRail();
  }

  // On a wide screen a change takes effect at once; inside the drawer it waits until the drawer closes.
  function changed(apply) {
    apply();
    syncRail();
    if (drawerOpen()) settingsDirty = true;
    else refresh();
  }

  function refresh() {
    settingsDirty = false;
    if (mode !== 'correct') nextPrompt(false);
  }

  // Inputs and counts always mirror the stored settings.
  function syncRail() {
    const st = session.settings();
    for (const input of el.book.querySelectorAll('input')) {
      input.checked = input.value === st.book;
      input.closest('.seg-opt').querySelector('.seg-n').textContent = String(session.bookCount(input.value));
    }
    for (const input of el.types.querySelectorAll('input')) {
      if (!input.value) {
        input.checked = st.off.length === 0;
        input.closest('.all').querySelector('.all-n').textContent = String(session.bookCount(st.book));
        continue;
      }
      const n = session.countFor(input.value);
      input.checked = session.typeOn(input.value);
      input.disabled = n === 0;
      input.closest('.opt').querySelector('.opt-count').textContent = String(n);
    }
    el.vos.checked = st.vosotros;
    const n = session.poolSize();
    const words = n === 1 ? 'verbo' : 'verbos';
    el.pool.replaceChildren(node('span', 'pool-n', String(n)), node('span', null, words));
    el.pool.toggleAttribute('data-empty', n === 0);
    el.empty.textContent = `0 ${words}`;
  }

  /* ---------- drawer (narrow screens) ---------- */

  const drawerOpen = () => el.app.dataset.drawer === 'open';

  function syncInert() {
    el.side.inert = narrow.matches && !drawerOpen();
    el.main.inert = narrow.matches && drawerOpen();
  }

  function openRail() {
    if (!narrow.matches) {
      const first = el.types.querySelector('.opt-input:not(:disabled)');
      if (first) first.focus();
      return;
    }
    el.app.dataset.drawer = 'open';
    el.menu.setAttribute('aria-expanded', 'true');
    syncInert();
    const first = el.book.querySelector('.opt-input:checked');
    if (first) first.focus({ preventScroll: true });
  }

  function closeRail() {
    if (!drawerOpen()) return;
    el.app.dataset.drawer = 'closed';
    el.menu.setAttribute('aria-expanded', 'false');
    syncInert();
    if (settingsDirty) refresh();
    if (mode === 'asking') el.input.focus({ preventScroll: true });
    else if (mode === 'empty') el.empty.focus({ preventScroll: true });
    else el.menu.focus({ preventScroll: true });
  }

  /* ---------- answer area ---------- */

  function insertAtCaret(ch) {
    if (el.input.readOnly) return;
    const start = el.input.selectionStart == null ? el.input.value.length : el.input.selectionStart;
    const end = el.input.selectionEnd == null ? start : el.input.selectionEnd;
    el.input.setRangeText(ch, start, end, 'end');
    el.input.focus({ preventScroll: true });
  }

  function buildKeys() {
    for (const ch of ACCENT_KEYS) {
      const b = node('button', 'key', ch);
      b.type = 'button';
      b.setAttribute('aria-label', ch);
      // Keep the input focused so the mobile keyboard stays open.
      b.addEventListener('pointerdown', (e) => e.preventDefault());
      b.addEventListener('click', () => insertAtCaret(ch));
      el.keys.appendChild(b);
    }
  }

  function renderStats(ok) {
    const streak = session.streak();
    const best = session.best();
    const acc = session.accuracy();
    el.streak.textContent = String(streak);
    el.best.hidden = best <= streak;
    el.best.textContent = String(best);
    el.acc.textContent = acc === null ? '' : String(acc);
    el.count.textContent = String(session.count());
    if (ok === undefined || !animate()) return;
    if (ok) pop(el.streakBox, streak % MILESTONE === 0 ? 1.32 : 1.16);
    else shake(el.streakBox, 5);
  }

  /* ---------- conjugation table (shown on a miss) ---------- */

  const form = (text, irregular) => node('span', irregular ? 'form irr' : 'form', text);

  function tenseCard(title, forms, irr, current) {
    const card = node('section', 'tcard');
    if (current >= 0) card.dataset.current = '';
    card.appendChild(node('h2', 'label', title));
    const list = node('dl', 'rows');
    const vos = session.settings().vosotros;
    forms.forEach((f, i) => {
      if (!vos && i === 4) return;
      const row = node('div', i === current ? 'row cur' : 'row');
      row.appendChild(node('dt', 'label', SHORT[i]));
      const dd = node('dd');
      dd.appendChild(form(f, irr[i]));
      row.appendChild(dd);
      list.appendChild(row);
    });
    card.appendChild(list);
    return card;
  }

  function commandCard(table, irr) {
    const card = node('section', 'tcard tcard-wide');
    card.appendChild(node('h2', 'label', 'imperativo'));
    const list = node('dl', 'rows');
    const vos = session.settings().vosotros;
    for (let i = 1; i < 6; i += 1) {
      if (!vos && i === 4) continue;
      const row = node('div', 'row');
      row.appendChild(node('dt', 'label', COMMAND[i]));
      const dd = node('dd', 'pair');
      dd.appendChild(form(table.imperative.affirmative[i], irr.imperative.affirmative[i]));
      dd.appendChild(form(table.imperative.negative[i], irr.imperative.negative[i]));
      row.appendChild(dd);
      list.appendChild(row);
    }
    card.appendChild(list);
    return card;
  }

  function renderTable(p) {
    const table = D.tableOf(p.verb);
    const irr = D.irregularMap(p.verb);

    const head = node('div', 'conj-head');
    const title = node('p', 'conj-title');
    title.appendChild(node('span', 'conj-inf', p.verb.inf));
    title.appendChild(node('span', 'label', p.verb.gloss));
    if (p.verb.lessons) title.appendChild(node('span', 'label', p.verb.lessons.join(' · ')));
    head.appendChild(title);

    const extra = node('p', 'conj-extra');
    extra.appendChild(node('span', 'label', 'participio'));
    extra.appendChild(form(table.participle, irr.participle));
    extra.appendChild(node('span', 'label', 'gerundio'));
    extra.appendChild(form(table.gerund, irr.gerund));
    const key = node('span', 'legend');
    key.appendChild(form('', true));
    key.appendChild(node('span', 'label', 'irregular'));
    extra.appendChild(key);
    head.appendChild(extra);

    const grid = node('div', 'conj-grid');
    for (const t of D.TABLE_TENSES) {
      grid.appendChild(tenseCard(t.name, table[t.id], irr[t.id], t.id === p.tenseId ? p.person : -1));
    }
    grid.appendChild(commandCard(table, irr));

    el.conj.replaceChildren(head, grid);
    el.conj.setAttribute('aria-label', `conjugación de ${p.verb.inf}`);
    el.conj.hidden = false;
    if (animate()) {
      G.fromTo(head, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.25, ease: 'power3.out', clearProps: 'transform,opacity' });
      G.fromTo(grid.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3, stagger: 0.04, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  }

  function hideTable() {
    if (el.conj.hidden) return;
    el.conj.hidden = true;
    el.conj.replaceChildren();
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }

  /* ---------- flow ---------- */

  function showEmpty() {
    if (prompt && animate()) ghost(el.verb);
    prompt = null;
    setMode('empty');
    el.fix.hidden = true;
    el.empty.hidden = false;
    hideTable();
  }

  function nextPrompt(focusInput = true) {
    clearTimeout(timer);
    if (prompt && animate()) {
      ghost(el.verb);
      if (mode === 'correct') ghost(el.echo);
      if (mode === 'wrong') ghost(el.right);
    }
    const p = session.next();
    if (!p) {
      showEmpty();
      return;
    }
    prompt = p;
    setMode('asking');
    el.empty.hidden = true;
    el.fix.hidden = true;
    el.echo.replaceChildren();
    el.submit.dataset.mark = 'arrow';
    el.input.readOnly = false;
    el.input.value = '';
    hideTable();

    // A form missed before comes back flagged: "repaso" when it is the in-session retry, "fallado" from an earlier session.
    const misses = prompt.missed || (prompt.retry ? 1 : 0);
    el.flag.hidden = !(prompt.retry || prompt.missed);
    el.flag.textContent = el.flag.hidden ? '' : `${prompt.retry ? 'repaso' : 'fallado'} ×${misses}`;

    const chars = letters(el.verb, prompt.verb.inf);
    el.verb.setAttribute('aria-label', prompt.verb.inf);
    el.verb.style.setProperty('--verb-scale', String(verbScale(prompt.verb.inf.length)));
    el.gloss.textContent = prompt.verb.gloss;
    el.person.textContent = prompt.personLabel;

    if (animate()) {
      enterLetters(chars, 0.1);
      G.fromTo([el.person, el.flag], { opacity: 0, y: 8, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)', clearProps: 'transform,opacity' });
      G.fromTo(el.gloss, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.25, clearProps: 'opacity' });
    }
    if (focusInput) el.input.focus({ preventScroll: true });
  }

  function showCorrect(res) {
    setMode('correct');
    el.submit.dataset.mark = 'tick';
    el.input.readOnly = true;
    announce('correcto');
    const chars = letters(el.echo, D.normalize.norm(res.expected));
    if (animate()) {
      G.to(chars, { keyframes: { y: [0, -14, 0], scale: [1, 1.22, 1] }, duration: 0.42, ease: 'power1.inOut', stagger: 0.035 });
      G.to(el.verb.children, { keyframes: { y: [0, -8, 0] }, duration: 0.36, ease: 'power1.inOut', stagger: 0.025, clearProps: 'transform' });
      pop(el.submit, 1.12);
      burst(session.streak() % MILESTONE === 0 ? 28 : 10);
    }
    timer = setTimeout(() => nextPrompt(true), animate() ? CORRECT_DELAY_ANIMATED_MS : CORRECT_DELAY_MS);
  }

  function showWrong(res) {
    setMode('wrong');
    el.input.readOnly = true;
    el.fix.hidden = false;
    const chars = letters(el.right, D.normalize.norm(res.expected), res.marks);
    el.right.style.setProperty('--right-scale', String(answerScale(chars.length)));
    renderTable(prompt);
    wrongShownAt = Date.now();
    announce(`incorrecto: ${res.expected}`);
    if (!animate()) return;
    shake(el.card);
    G.fromTo(el.fix, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' });
    // The missed letters pulse only once the whole word has landed, so the two never fight over a letter.
    const tl = G.timeline({ delay: 0.08 });
    tl.fromTo(
      chars,
      { opacity: 0, y: -22, rotation: -10 },
      { opacity: 1, y: 0, rotation: 0, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.035, clearProps: 'transform,opacity' }
    );
    const misses = chars.filter((c) => c.classList.contains('miss'));
    if (misses.length) {
      tl.to(misses, { keyframes: { scale: [1, 1.3, 1] }, duration: 0.32, ease: 'power2.out', stagger: 0.05, clearProps: 'transform' });
    }
  }

  function onSubmit(repeat = false) {
    if (!prompt) return;
    if (D.advanceGuard.shouldIgnoreEnter({ mode, repeat, shownAt: wrongShownAt, now: Date.now() })) return;
    if (mode !== 'asking') {
      nextPrompt(true);
      return;
    }
    const typed = el.input.value;
    if (!typed.trim()) {
      if (animate()) shake(el.field, 4);
      return;
    }
    const res = session.answer(prompt, typed);
    renderStats(res.ok);
    if (res.ok) showCorrect(res);
    else showWrong(res);
  }

  /* ---------- events ---------- */

  el.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      onSubmit(e.repeat);
    }
  });
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmit();
  });
  el.next.addEventListener('click', () => {
    if (!D.advanceGuard.shouldIgnoreEnter({ mode, repeat: false, shownAt: wrongShownAt, now: Date.now() })) nextPrompt(true);
  });
  el.empty.addEventListener('click', openRail);

  el.menu.addEventListener('click', openRail);
  el.close.addEventListener('click', closeRail);
  el.scrim.addEventListener('click', closeRail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOpen()) closeRail();
  });
  narrow.addEventListener('change', () => {
    if (!narrow.matches && drawerOpen()) {
      el.app.dataset.drawer = 'closed';
      el.menu.setAttribute('aria-expanded', 'false');
      if (settingsDirty) refresh();
    }
    syncInert();
  });

  buildRail();
  buildKeys();
  syncInert();
  renderStats();
  nextPrompt(true);
  if (!prompt) openRail();
})();
