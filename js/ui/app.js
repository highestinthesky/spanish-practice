(function () {
  'use strict';
  const D = window.Drill;
  const $ = (id) => document.getElementById(id);

  const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
  const CORRECT_DELAY_MS = 320;

  const session = D.createSession({ verbs: D.verbs, tenses: D.tenses, store: D.store });

  const el = {
    stage: $('stage'), tense: $('tense'), flag: $('flag'), verb: $('verb'), gloss: $('gloss'), person: $('person'),
    form: $('form'), input: $('input'), submit: $('submit'), keys: $('keys'),
    plate: $('plate'), own: $('own'), right: $('right'), conj: $('conj'),
    menuToggle: $('menu-toggle'), menuWord: $('menu-word'), summary: $('summary'), menu: $('menu'),
    book: $('book'), types: $('types'), vos: $('vos'), menuDone: $('menu-done'),
    bars: $('bars'), acc: $('acc'), live: $('live'),
  };

  let prompt = null;
  let mode = 'asking';
  let timer = 0;
  let wrongShownAt = 0;

  // Long infinitives and long answers (nos divertimos) shrink so they never overflow.
  const verbScale = (n) => (n <= 7 ? 1 : n <= 9 ? 0.84 : n <= 11 ? 0.7 : 0.58);
  const answerScale = (n) => (n <= 8 ? 1 : n <= 11 ? 0.8 : n <= 15 ? 0.6 : 0.48);

  // Row labels of the conjugation table.
  const SHORT = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  const COMMAND = [null, 'tú', 'Ud.', 'nosotros', 'vosotros', 'Uds.'];

  function announce(text) {
    el.live.textContent = '';
    el.live.textContent = text;
  }

  function setMode(next) {
    mode = next;
    el.stage.dataset.mode = next;
  }

  /* ---------- operating menu ---------- */

  const BOOK_NAMES = { all: 'todos', D1: 'Descubre 1', D2: 'Descubre 2' };
  let menuDirty = false;

  // One row of the menu: a real input, a drawn box, the name, an optional example, and a live count.
  function option({ type, name, value, label, example }) {
    const row = node('label', `opt opt-${type}`);
    const input = node('input', 'opt-input');
    input.type = type;
    if (name) input.name = name;
    input.value = value;
    row.appendChild(input);
    row.appendChild(node('span', 'opt-box'));
    row.lastChild.setAttribute('aria-hidden', 'true');
    row.appendChild(node('span', 'opt-name', label));
    if (example) row.appendChild(node('span', 'opt-ex', example));
    row.appendChild(node('span', 'opt-count'));
    return row;
  }

  function buildMenu() {
    for (const book of ['all', 'D1', 'D2']) {
      const row = option({ type: 'radio', name: 'book', value: book, label: BOOK_NAMES[book] });
      row.querySelector('input').addEventListener('change', () => changed(() => session.setBook(book)));
      el.book.appendChild(row);
    }

    const all = option({ type: 'checkbox', value: '', label: 'todos los tipos' });
    all.classList.add('opt-all');
    all.querySelector('input').addEventListener('change', () => changed(() => session.clearChips()));
    el.types.appendChild(all);

    for (const group of D.TYPE_GROUPS) {
      const box = node('div', 'type-group');
      box.appendChild(node('p', 'label type-group-name', group.name));
      const opts = node('div', 'type-opts');
      for (const tag of group.tags) {
        const info = D.TYPE_INFO[tag];
        const row = option({ type: 'checkbox', value: tag, label: info.name, example: info.example });
        row.querySelector('input').addEventListener('change', () => changed(() => session.toggleChip(tag)));
        opts.appendChild(row);
      }
      box.appendChild(opts);
      el.types.appendChild(box);
    }

    el.vos.addEventListener('change', () => changed(() => session.setVosotros(el.vos.checked)));
    el.menuToggle.addEventListener('click', () => (el.menu.hidden ? openMenu() : closeMenu(el.menuToggle)));
    el.menuDone.addEventListener('click', () => closeMenu(el.input));
    el.menuToggle.parentElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu(el.menuToggle);
    });
    syncMenu();
  }

  function changed(apply) {
    apply();
    menuDirty = true;
    syncMenu();
  }

  // Inputs, counts and the summary always mirror the stored settings.
  function syncMenu() {
    const st = session.settings();
    const chips = new Set(st.chips);
    for (const input of el.book.querySelectorAll('input')) {
      input.checked = input.value === st.book;
      input.closest('.opt').querySelector('.opt-count').textContent = String(session.bookCount(input.value));
    }
    for (const input of el.types.querySelectorAll('input')) {
      const row = input.closest('.opt');
      if (!input.value) {
        input.checked = chips.size === 0;
        row.querySelector('.opt-count').textContent = String(session.bookCount(st.book));
        continue;
      }
      const n = session.countFor(input.value);
      input.checked = chips.has(input.value);
      input.disabled = n === 0 && !input.checked;
      row.querySelector('.opt-count').textContent = String(n);
    }
    el.vos.checked = st.vosotros;
    renderSummary();
  }

  function renderSummary() {
    const st = session.settings();
    const parts = [session.tense() ? session.tense().name : ''];
    const names = st.chips.map((t) => (D.TYPE_INFO[t] ? D.TYPE_INFO[t].name : t));
    parts.push(names.length ? (names.length > 3 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ')) : 'todos los tipos');
    if (st.book !== 'all') parts.push(BOOK_NAMES[st.book]);
    const n = session.poolSize();
    parts.push(`${n} ${n === 1 ? 'verbo' : 'verbos'}`);
    if (!st.vosotros) parts.push('sin vosotros');
    el.summary.replaceChildren(...parts.filter(Boolean).map((p, i) => node('span', i === 0 ? 'sum sum-lead' : 'sum', p)));
  }

  function openMenu() {
    el.menu.hidden = false;
    el.menuToggle.setAttribute('aria-expanded', 'true');
    el.menuWord.textContent = 'cerrar';
    menuDirty = false;
    syncMenu();
  }

  // A changed setup gets a fresh prompt when the menu closes, not on every tick.
  function closeMenu(focusTo) {
    if (el.menu.hidden) return;
    el.menu.hidden = true;
    el.menuToggle.setAttribute('aria-expanded', 'false');
    el.menuWord.textContent = 'menú';
    if (menuDirty && mode !== 'correct') nextPrompt(false);
    menuDirty = false;
    focusTo.focus({ preventScroll: true });
  }

  function insertAtCaret(ch) {
    if (el.input.readOnly) return;
    const start = el.input.selectionStart == null ? el.input.value.length : el.input.selectionStart;
    const end = el.input.selectionEnd == null ? start : el.input.selectionEnd;
    el.input.setRangeText(ch, start, end, 'end');
    el.input.focus({ preventScroll: true });
  }

  function buildKeys() {
    for (const ch of ACCENT_KEYS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'key';
      b.textContent = ch;
      b.setAttribute('aria-label', ch);
      // Keep the input focused so the mobile keyboard stays open.
      b.addEventListener('pointerdown', (e) => e.preventDefault());
      b.addEventListener('click', () => insertAtCaret(ch));
      el.keys.appendChild(b);
    }
  }

  function buildBars() {
    for (let i = 0; i < 10; i += 1) {
      const s = document.createElement('span');
      s.className = 'bar';
      s.dataset.state = 'empty';
      el.bars.appendChild(s);
    }
  }

  function renderMeter() {
    const recent = session.recent();
    Array.from(el.bars.children).forEach((b, i) => {
      b.dataset.state = recent[i] || 'empty';
    });
    const acc = session.accuracy();
    el.acc.hidden = acc === null;
    el.acc.textContent = acc === null ? '' : String(acc);
  }

  /* ---------- conjugation table (shown on a miss) ---------- */

  function node(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

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
    head.appendChild(extra);
    const key = node('p', 'legend');
    key.appendChild(form('', true));
    key.appendChild(node('span', 'label', 'irregular'));
    head.appendChild(key);

    const grid = node('div', 'conj-grid');
    for (const t of D.TABLE_TENSES) {
      grid.appendChild(tenseCard(t.name, table[t.id], irr[t.id], t.id === p.tenseId ? p.person : -1));
    }
    grid.appendChild(commandCard(table, irr));

    el.conj.replaceChildren(head, grid);
    el.conj.setAttribute('aria-label', `conjugación de ${p.verb.inf}`);
    el.conj.hidden = false;
  }

  function hideTable() {
    if (el.conj.hidden) return;
    el.conj.hidden = true;
    el.conj.replaceChildren();
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }

  /* ---------- flow ---------- */

  function nextPrompt(focusInput = true) {
    clearTimeout(timer);
    prompt = session.next();
    if (!prompt) return;
    setMode('asking');
    el.submit.dataset.mark = 'arrow';
    el.input.readOnly = false;
    el.input.value = '';
    hideTable();
    el.tense.textContent = D.tenses.all().length > 1 ? prompt.tense.name || prompt.tense.mark : '';
    // A form missed before comes back flagged: "repaso" when it is the in-session retry, "fallado" from an earlier session.
    const misses = prompt.missed || (prompt.retry ? 1 : 0);
    el.flag.hidden = !(prompt.retry || prompt.missed);
    el.flag.textContent = el.flag.hidden ? '' : `${prompt.retry ? 'repaso' : 'fallado'} ×${misses}`;
    el.verb.textContent = prompt.verb.inf;
    el.verb.style.setProperty('--verb-scale', String(verbScale(prompt.verb.inf.length)));
    el.gloss.textContent = prompt.verb.gloss;
    el.gloss.hidden = true;
    el.verb.setAttribute('aria-expanded', 'false');
    el.person.textContent = prompt.personLabel;
    if (focusInput) el.input.focus({ preventScroll: true });
  }

  function showCorrect() {
    setMode('correct');
    el.submit.dataset.mark = 'tick';
    el.input.readOnly = true;
    announce('correcto');
    timer = setTimeout(() => nextPrompt(true), CORRECT_DELAY_MS);
  }

  function showWrong(res, typed) {
    setMode('wrong');
    el.input.readOnly = true;
    el.own.textContent = typed.trim();
    const chars = Array.from(D.normalize.norm(res.expected));
    el.right.replaceChildren(
      ...chars.map((ch, i) => {
        const s = document.createElement('span');
        if (res.marks[i]) s.className = 'miss';
        s.textContent = ch;
        return s;
      })
    );
    el.right.style.setProperty('--right-scale', String(answerScale(chars.length)));
    renderTable(prompt);
    wrongShownAt = Date.now();
    announce(`incorrecto: ${res.expected}`);
  }

  function onSubmit(repeat = false) {
    if (!prompt) return;
    if (D.advanceGuard.shouldIgnoreEnter({ mode, repeat, shownAt: wrongShownAt, now: Date.now() })) return;
    if (mode !== 'asking') {
      nextPrompt(true);
      return;
    }
    const typed = el.input.value;
    if (!typed.trim()) return;
    const res = session.answer(prompt, typed);
    renderMeter();
    if (res.ok) showCorrect();
    else showWrong(res, typed);
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
  el.plate.addEventListener('click', () => {
    if (!D.advanceGuard.shouldIgnoreEnter({ mode, repeat: false, shownAt: wrongShownAt, now: Date.now() })) nextPrompt(true);
  });
  el.verb.addEventListener('click', () => {
    const open = el.gloss.hidden;
    el.gloss.hidden = !open;
    el.verb.setAttribute('aria-expanded', String(open));
    if (mode === 'asking') el.input.focus({ preventScroll: true });
  });

  buildMenu();
  buildKeys();
  buildBars();
  renderMeter();
  nextPrompt(true);
})();
