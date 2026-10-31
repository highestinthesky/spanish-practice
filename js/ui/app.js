(function () {
  'use strict';
  const D = window.Drill;
  const G = window.gsap || null;
  const $ = (id) => document.getElementById(id);

  const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
  const CORRECT_DELAY_MS = 320;
  const CORRECT_DELAY_ANIMATED_MS = 620;
  const CHOICE_DELAY_MS = 700;
  // An accent slip that still counts stays up long enough to read the reminder.
  const NUDGE_DELAY_MS = 1800;
  const MILESTONE = 5;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 860px)');
  const motion = D.createMotion({ G, enabled: () => !reduceMotion.matches });
  const animate = motion.on;

  const store = D.store;
  const settings = () => store.state().settings;
  const session = D.createSession({ verbs: D.verbs, tenses: D.tenses, store });
  const decks = {};
  const lessonId = () => (D.lessons.get(settings().lesson) ? settings().lesson : D.lessons.list()[0].id);
  // One deck per lesson (its stats are that lesson's), and one for the general mode.
  function deckFor(mode) {
    const key = mode === 'general' ? 'general' : `L:${lessonId()}`;
    if (!decks[key]) {
      const id = lessonId();
      const items = mode === 'general' ? () => D.lessons.general(settings()) : () => D.lessons.items(id, settings());
      decks[key] = D.createDeck({ items, store });
    }
    return decks[key];
  }

  const el = {
    app: $('app'), side: $('side'), main: $('main'), menu: $('menu'), close: $('close'), scrim: $('scrim'),
    book: $('book'), types: $('types'), exGroups: $('ex-groups'), vos: $('vos'), strict: $('strict'), pool: $('pool'),
    modes: $('modes'), ink: $('modes-ink'), ambient: $('ambient'),
    streakBox: $('streak-box'), streak: $('streak'), best: $('best'), acc: $('acc'), count: $('count'),
    stage: $('stage'), card: $('card'), person: $('person'), hint: $('hint'), flag: $('flag'), verb: $('verb'),
    prompt: $('prompt'), gloss: $('gloss'), choices: $('choices'),
    form: $('form'), field: $('field'), input: $('input'), echo: $('echo'), submit: $('submit'),
    nudge: $('nudge'), fix: $('fix'), right: $('right'), why: $('why'), next: $('next'), keys: $('keys'), empty: $('empty'),
    burst: $('burst'), conj: $('conj'), read: $('read'), live: $('live'),
  };

  const MODE_IDS = D.MODES.map((m) => m.id);
  const isExercise = (m) => m === 'leccion' || m === 'general';

  let appMode = MODE_IDS.includes(settings().mode) ? settings().mode : 'conjugar';
  let prompt = null;
  let mode = 'asking';
  let timer = 0;
  let wrongShownAt = 0;
  let settingsDirty = false;

  const reading = D.createReading({
    host: el.read,
    motion,
    store,
    announce,
    onAnswer(ok, from) {
      renderStats(ok);
      celebrate(ok, from);
    },
    onScores: () => syncRail(),
  });
  reading.setPicker((id) => {
    store.setSetting('reading', id);
    syncRail();
    reading.mount(id);
  });
  const readings = () => D.lessons.readings();
  const firstReading = () => (readings().some((r) => r.id === settings().reading) ? settings().reading : readings()[0].id);

  const engine = () => (appMode === 'conjugar' ? session : appMode === 'lectura' ? reading : deckFor(appMode));

  // Long words and answers shrink so they never overflow. English meanings can be a whole phrase.
  const verbScale = (n) => (n <= 7 ? 1 : n <= 9 ? 0.86 : n <= 11 ? 0.72 : n <= 16 ? 0.56 : n <= 24 ? 0.42 : 0.32);
  const answerScale = (n) => (n <= 10 ? 1 : n <= 14 ? 0.8 : n <= 22 ? 0.64 : 0.5);

  // Row labels of the conjugation table.
  const SHORT = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  const COMMAND = [null, 'tú', 'Ud.', 'nosotros', 'vosotros', 'Uds.'];
  const BOOK_NAMES = { all: 'todos', D1: 'Descubre 1', D2: 'Descubre 2', D3: 'Descubre 3' };
  const BOOK_TITLES = { D1: 'Descubre 1', D2: 'Descubre 2', D3: 'Descubre 3' };
  const lessonLabel = (l) => `${l.id.slice(1)} · ${l.title}`;
  const HINTS = { rewrite: 'reescribe', en: 'traduce' };

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

  // Letters grouped into words, so a phrase wraps between words and never inside one.
  function letters(target, text, marks) {
    const chars = [];
    let i = 0;
    const parts = [];
    text.split(' ').forEach((word, w) => {
      // A real element, not a text node: flex containers drop whitespace-only text.
      if (w) {
        parts.push(node('span', 'sp', ' '));
        i += 1;
      }
      const box = node('span', 'w');
      for (const ch of Array.from(word)) {
        const c = node('span', marks && marks[i] ? 'ch miss' : 'ch', ch);
        box.appendChild(c);
        chars.push(c);
        i += 1;
      }
      parts.push(box);
    });
    target.replaceChildren(...parts);
    return chars;
  }

  // A sentence as word pieces, so it can fly in and out word by word. ___ becomes the gap, kept on one
  // line with the letters touching it (ver___, ___:).
  function sentence(target, text) {
    const parts = text.split(/(\s+)/).filter(Boolean).map((w) => {
      if (/^\s+$/.test(w)) return document.createTextNode(' ');
      if (!w.includes('___')) return node('span', 'ch', w);
      const word = node('span', 'ch');
      const [before, after] = w.split('___');
      const gap = node('span', 'gap');
      gap.setAttribute('aria-label', 'espacio');
      if (before) word.appendChild(document.createTextNode(before));
      word.appendChild(gap);
      if (after) word.appendChild(document.createTextNode(after));
      return word;
    });
    target.replaceChildren(...parts);
    return Array.from(target.children);
  }

  function celebrate(ok, from) {
    const streak = engine().streak();
    if (!ok) return;
    const milestone = streak > 0 && streak % MILESTONE === 0;
    motion.burst(el.burst, from, milestone ? 30 : 10);
    motion.ripple(el.burst, from);
    motion.gust(milestone);
    if (milestone) motion.stamp(el.burst, `×${streak}`);
  }

  /* ---------- side rail ---------- */

  // One row of the rail: a real input, a drawn box, the name, an optional example, and a live count.
  function option({ type, name, value, label, example }) {
    const row = node('label', 'opt');
    const input = node('input', 'opt-input');
    input.type = type;
    if (name) input.name = name;
    input.value = value;
    const box = node('span', type === 'radio' ? 'opt-box opt-radio' : 'opt-box');
    box.setAttribute('aria-hidden', 'true');
    row.append(input, box, node('span', 'opt-name', label));
    if (example) row.appendChild(node('span', 'opt-ex', example));
    row.appendChild(node('span', 'opt-count'));
    return row;
  }

  function buildRail() {
    const seg = node('div', 'seg');
    for (const book of D.BOOKS) {
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
    // Grading only: the current question stays.
    el.strict.addEventListener('change', () => store.setSetting('strictAccents', el.strict.checked));
  }

  function exOff(key) {
    return (settings().ex || {})[key] || [];
  }

  function toggleEx(key, id) {
    const ex = { ...(settings().ex || {}) };
    const set = new Set(ex[key] || []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    ex[key] = Array.from(set);
    store.setSetting('ex', ex);
  }

  // A labelled drop-down of lessons, grouped by book. extra puts a first option before them.
  function lessonPicker(name, value, lessons, onPick, extra) {
    const row = node('label', 'pick');
    row.appendChild(node('span', 'group-h', name));
    const wrap = node('span', 'pick-box');
    const select = node('select', 'pick-select');
    select.dataset.name = name;
    if (extra) {
      const o = node('option', null, extra.label);
      o.value = extra.value;
      select.appendChild(o);
    }
    for (const book of ['D1', 'D2', 'D3']) {
      const inBook = lessons.filter((l) => l.book === book);
      if (!inBook.length) continue;
      const group = node('optgroup');
      group.label = BOOK_TITLES[book];
      for (const l of inBook) {
        const o = node('option', null, lessonLabel(l));
        o.value = l.id;
        group.appendChild(o);
      }
      select.appendChild(group);
    }
    select.value = value;
    select.addEventListener('change', () => {
      onPick(select.value);
      // The rail was rebuilt: keep the keyboard on the same drop-down.
      const again = el.exGroups.querySelector(`select[data-name="${name}"]`);
      if (again && again !== select) again.focus({ preventScroll: true });
    });
    wrap.appendChild(select);
    row.appendChild(wrap);
    return row;
  }

  function filterSet(title, key, items) {
    const set = node('fieldset', 'group');
    set.appendChild(node('legend', 'group-h', title));
    for (const f of items) {
      const row = option({ type: 'checkbox', value: f.id, label: f.name, example: f.example });
      const input = row.querySelector('input');
      input.dataset.key = key;
      input.addEventListener('change', () => changed(() => toggleEx(key, f.id)));
      set.appendChild(row);
    }
    return set;
  }

  // The settings of the active mode: the lesson and its filters, the general range and focus, or the passages.
  function buildModeRail() {
    const parts = [];
    const all = D.lessons.list();
    if (appMode === 'leccion') {
      parts.push(lessonPicker('lección', lessonId(), all, (id) => {
        store.setSetting('lesson', id);
        buildModeRail();
        changed(() => {});
      }));
      for (const group of D.lessons.filters(lessonId())) parts.push(filterSet(group.name, lessonId(), group.items));
    }
    if (appMode === 'general') {
      const st = settings();
      const upto = D.lessons.get(st.upto) ? st.upto : all[all.length - 1].id;
      parts.push(lessonPicker('hasta', upto, all, (id) => {
        store.setSetting('upto', id);
        if (st.focus && D.lessons.order(st.focus) > D.lessons.order(id)) store.setSetting('focus', '');
        buildModeRail();
        changed(() => {});
      }));
      const reach = all.filter((l) => D.lessons.order(l.id) <= D.lessons.order(upto));
      parts.push(lessonPicker('foco', st.focus || '', reach, (id) => {
        store.setSetting('focus', id);
        changed(() => {});
      }, { value: '', label: 'ninguno · todo igual' }));
      parts.push(filterSet('ejercicio', 'general', D.lessons.GENERAL_FILTERS));
    }
    if (appMode === 'lectura') {
      for (const l of all) {
        const list = readings().filter((r) => r.lesson === l.id);
        if (!list.length) continue;
        const set = node('fieldset', 'group');
        set.appendChild(node('legend', 'group-h', `lectura · ${l.id.slice(1)}`));
        for (const r of list) {
          const row = option({ type: 'radio', name: 'reading', value: r.id, label: r.title, example: r.tag });
          row.querySelector('input').addEventListener('change', () => {
            store.setSetting('reading', r.id);
            syncRail();
            reading.mount(r.id);
            if (drawerOpen()) closeRail();
          });
          set.appendChild(row);
        }
        parts.push(set);
      }
    }
    el.exGroups.replaceChildren(...parts);
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
    if (appMode === 'lectura') return;
    renderStats();
    if (mode !== 'correct') nextPrompt(false);
  }

  function poolText(n, one, many) {
    el.pool.replaceChildren(node('span', 'pool-n', String(n)), node('span', null, n === 1 ? one : many));
    el.pool.toggleAttribute('data-empty', n === 0);
    el.empty.textContent = `0 ${many}`;
  }

  // Inputs and counts always mirror the stored settings.
  function syncRail() {
    const st = settings();
    el.vos.checked = st.vosotros;
    el.strict.checked = st.strictAccents;
    if (appMode === 'conjugar') {
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
      poolText(session.poolSize(), 'verbo', 'verbos');
      return;
    }
    if (appMode === 'lectura') {
      const sc = reading.scores();
      const current = firstReading();
      for (const input of el.exGroups.querySelectorAll('input')) {
        input.checked = input.value === current;
        const s = sc[input.value];
        input.closest('.opt').querySelector('.opt-count').textContent = s ? `${s.r}/${s.t}` : '–';
      }
      poolText(readings().length, 'lectura', 'lecturas');
      return;
    }
    const general = appMode === 'general';
    const pool = general ? D.lessons.general(st) : D.lessons.items(lessonId(), st);
    for (const input of el.exGroups.querySelectorAll('input[type="checkbox"]')) {
      const key = input.dataset.key;
      input.checked = !exOff(key).includes(input.value);
      const n = general
        ? D.lessons.general({ ...st, ex: { ...st.ex, general: D.lessons.GENERAL_FILTERS.map((f) => f.id).filter((id) => id !== input.value) } }).length
        : D.lessons.count(key, input.value, st);
      input.disabled = n === 0;
      input.closest('.opt').querySelector('.opt-count').textContent = String(n);
    }
    poolText(pool.length, 'ejercicio', 'ejercicios');
    if (pool.length) el.pool.appendChild(node('span', 'pool-fresh'));
    renderFresh();
  }

  // What is left for today: exercises answered right in the last day wait until tomorrow.
  function renderFresh() {
    const out = el.pool.querySelector('.pool-fresh');
    if (out && isExercise(appMode)) out.textContent = `${deckFor(appMode).fresh()} para hoy`;
  }

  /* ---------- drawer (narrow screens) ---------- */

  const drawerOpen = () => el.app.dataset.drawer === 'open';

  function syncInert() {
    el.side.inert = narrow.matches && !drawerOpen();
    el.main.inert = narrow.matches && drawerOpen();
  }

  function openRail() {
    if (!narrow.matches) {
      const first = el.side.querySelector('.group:not([hidden]) .opt-input:not(:disabled)');
      if (first && first.offsetParent) first.focus();
      return;
    }
    el.app.dataset.drawer = 'open';
    el.menu.setAttribute('aria-expanded', 'true');
    syncInert();
    const first = el.side.querySelector('.opt-input:checked');
    if (first && first.offsetParent) first.focus({ preventScroll: true });
  }

  function closeRail() {
    if (!drawerOpen()) return;
    el.app.dataset.drawer = 'closed';
    el.menu.setAttribute('aria-expanded', 'false');
    syncInert();
    if (settingsDirty) refresh();
    focusAnswer() || el.menu.focus({ preventScroll: true });
  }

  /* ---------- tabs ---------- */

  function buildTabs() {
    for (const m of D.MODES) {
      const b = node('button', 'mode', m.name);
      b.type = 'button';
      b.id = `tab-${m.id}`;
      b.dataset.mode = m.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', m.id === 'lectura' ? 'read' : 'stage');
      b.addEventListener('click', () => switchMode(m.id, true));
      b.addEventListener('keydown', (e) => {
        const i = MODE_IDS.indexOf(m.id);
        let to = null;
        if (e.key === 'ArrowRight') to = MODE_IDS[(i + 1) % MODE_IDS.length];
        if (e.key === 'ArrowLeft') to = MODE_IDS[(i - 1 + MODE_IDS.length) % MODE_IDS.length];
        if (e.key === 'Home') to = MODE_IDS[0];
        if (e.key === 'End') to = MODE_IDS[MODE_IDS.length - 1];
        if (!to) return;
        e.preventDefault();
        switchMode(to, false);
        $(`tab-${to}`).focus();
      });
      el.modes.appendChild(b);
    }
  }

  function syncTabs(instant) {
    for (const b of el.modes.querySelectorAll('.mode')) {
      const on = b.dataset.mode === appMode;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) {
        motion.ink(el.ink, b, instant);
        // Keep the chosen tab in view when the strip scrolls on a phone.
        const strip = el.modes;
        if (b.offsetLeft < strip.scrollLeft || b.offsetLeft + b.offsetWidth > strip.scrollLeft + strip.clientWidth) {
          strip.scrollTo({ left: b.offsetLeft - 16, behavior: instant || !animate() ? 'auto' : 'smooth' });
        }
      }
    }
  }

  function switchMode(next, focusContent) {
    if (next === appMode) {
      if (focusContent) focusAnswer();
      return;
    }
    clearTimeout(timer);
    appMode = next;
    store.setSetting('mode', next);
    applyMode(false, focusContent);
  }

  function applyMode(first, focusContent) {
    el.app.dataset.mode = appMode;
    const lectura = appMode === 'lectura';
    el.stage.hidden = lectura;
    el.read.hidden = !lectura;
    el.stage.setAttribute('aria-labelledby', `tab-${appMode}`);
    el.read.setAttribute('aria-labelledby', 'tab-lectura');
    syncTabs(first);
    buildModeRail();
    syncRail();
    renderStats();
    if (lectura) {
      prompt = null;
      hideTable();
      reading.mount(firstReading());
      return;
    }
    prompt = null;
    nextPrompt(Boolean(focusContent));
    if (!first) motion.swap(el.card);
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

  function focusAnswer() {
    if (appMode === 'lectura') return false;
    // The group, not an option: a focused option would stand out, and it is the answer one time in four.
    if (mode === 'asking' && el.stage.dataset.kind === 'choice') {
      if (!el.choices.firstChild) return false;
      el.choices.focus({ preventScroll: true });
      return true;
    }
    if (mode === 'asking') {
      el.input.focus({ preventScroll: true });
      return true;
    }
    if (mode === 'empty') {
      el.empty.focus({ preventScroll: true });
      return true;
    }
    return false;
  }

  function renderStats(ok) {
    const e = engine();
    const streak = e.streak();
    const best = e.best();
    const acc = e.accuracy();
    el.streak.textContent = String(streak);
    el.best.hidden = best <= streak;
    el.best.textContent = String(best);
    el.acc.textContent = acc === null ? '' : String(acc);
    el.count.textContent = String(e.count());
    if (ok === undefined) return;
    renderFresh();
    if (ok) motion.pop(el.streakBox, streak % MILESTONE === 0 ? 1.32 : 1.16);
    else motion.shake(el.streakBox, 5);
  }

  /* ---------- conjugation table (shown on a miss) ---------- */

  const form = (text, irregular) => node('span', irregular ? 'form irr' : 'form', text);

  function tenseCard(title, forms, irr, current) {
    const card = node('section', 'tcard');
    if (current >= 0) card.dataset.current = '';
    card.appendChild(node('h2', 'label', title));
    const list = node('dl', 'rows');
    const vos = settings().vosotros;
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
    const vos = settings().vosotros;
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
      motion.rise(head, 0.25);
      G.fromTo(grid.children, { opacity: 0, y: 24, rotation: (i) => (i % 2 ? 2 : -2) }, { opacity: 1, y: 0, rotation: 0, duration: 0.4, delay: 0.3, stagger: 0.04, ease: 'power3.out', clearProps: 'transform,opacity' });
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
    if (prompt) {
      motion.ghost(el.verb, el.card);
      motion.ghost(el.prompt, el.card);
    }
    prompt = null;
    setMode('empty');
    el.fix.hidden = true;
    el.nudge.hidden = true;
    el.empty.hidden = false;
    el.choices.replaceChildren();
    hideTable();
  }

  // Old words leave in one of several ways while the new ones arrive.
  function leave() {
    if (!prompt || !animate()) return;
    motion.ghost(el.verb, el.card);
    motion.ghost(el.prompt, el.card);
    if (mode === 'correct') motion.ghost(el.echo, el.card);
    if (mode === 'wrong') motion.ghost(el.right, el.card);
  }

  function resetCard() {
    setMode('asking');
    el.empty.hidden = true;
    el.fix.hidden = true;
    el.nudge.hidden = true;
    el.why.textContent = '';
    el.echo.replaceChildren();
    el.submit.dataset.mark = 'arrow';
    el.input.readOnly = false;
    el.input.value = '';
    el.choices.replaceChildren();
    hideTable();
  }

  function flag(p) {
    // A form missed before comes back flagged: "repaso" when it is the in-session retry, "fallado" from an earlier session.
    const misses = p.missed || (p.retry ? 1 : 0);
    el.flag.hidden = !(p.retry || p.missed);
    el.flag.textContent = el.flag.hidden ? '' : `${p.retry ? 'repaso' : 'fallado'} ×${misses}`;
  }

  function nextPrompt(focusInput = true) {
    clearTimeout(timer);
    leave();
    if (appMode === 'conjugar') nextDrill();
    else nextExercise();
    if (focusInput && prompt) focusAnswer();
  }

  function nextDrill() {
    const p = session.next();
    if (!p) {
      showEmpty();
      return;
    }
    prompt = p;
    resetCard();
    el.stage.dataset.kind = 'drill';
    el.stage.dataset.show = 'big';
    flag(p);
    el.hint.hidden = true;
    el.prompt.replaceChildren();

    const chars = letters(el.verb, p.verb.inf);
    el.verb.lang = 'es';
    el.verb.setAttribute('aria-label', p.verb.inf);
    el.verb.style.setProperty('--verb-scale', String(verbScale(p.verb.inf.length)));
    el.gloss.textContent = p.verb.gloss;
    el.person.textContent = p.personLabel;

    motion.enter(chars, 0.1);
    intro();
  }

  function intro() {
    if (!animate()) return;
    G.fromTo([el.person, el.hint, el.flag], { opacity: 0, y: 8, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)', clearProps: 'transform,opacity' });
    G.fromTo(el.gloss, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.25, clearProps: 'opacity' });
  }

  function nextExercise() {
    const deck = deckFor(appMode);
    const p = deck.next();
    if (!p) {
      showEmpty();
      return;
    }
    prompt = p;
    resetCard();
    const it = p.item;
    el.stage.dataset.kind = it.options ? 'choice' : 'type';
    el.stage.dataset.show = it.big ? 'big' : 'sentence';
    flag(p);

    const skill = D.lessons.skillName(it);
    el.person.textContent = appMode === 'general' ? `${it.cat === 'mix' ? 'repaso' : it.lesson.slice(1)} · ${skill}` : skill;
    const hint = HINTS[it.form];
    el.hint.hidden = !hint;
    el.hint.textContent = hint || '';

    let chars = [];
    if (it.big) {
      chars = letters(el.verb, it.big);
      el.verb.lang = it.lang || 'es';
      el.verb.setAttribute('aria-label', it.big);
      // A phrase wraps between words, so it is sized by its longest word or half its length, whichever is more.
      const words = it.big.split(' ');
      const span = words.length > 1 ? Math.max(...words.map((x) => x.length), Math.ceil(it.big.length / 2)) : it.big.length;
      el.verb.style.setProperty('--verb-scale', String(verbScale(span)));
      el.prompt.replaceChildren();
      el.gloss.textContent = it.group ? D.lessons.groupName(it) : '';
    } else {
      el.verb.replaceChildren();
      el.verb.removeAttribute('aria-label');
      chars = sentence(el.prompt, it.prompt);
      el.prompt.lang = it.lang || 'es';
      el.prompt.setAttribute('aria-label', it.prompt.replace('___', '…'));
      el.gloss.textContent = '';
    }

    if (it.options) {
      const buttons = it.options.map((opt, i) => {
        const b = node('button', 'choice');
        b.type = 'button';
        b.lang = it.skill === 'es-en' || it.skill === 'significado' ? 'en' : 'es';
        b.append(node('span', 'choice-key', String(i + 1)), node('span', 'choice-text', opt));
        b.addEventListener('click', () => onChoice(i));
        return b;
      });
      el.choices.replaceChildren(...buttons);
      el.choices.setAttribute('aria-label', it.big || it.prompt);
      motion.choicesIn(buttons, 0.18);
    }

    motion.enter(chars, 0.08);
    intro();
  }

  /* ---------- answers ---------- */

  function fillGap(text, tone) {
    const gap = el.prompt.querySelector('.gap');
    if (!gap) return [];
    gap.dataset.tone = tone;
    const chars = letters(gap, text);
    if (animate()) G.fromTo(chars, { y: -18, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.025, clearProps: 'transform,opacity' });
    return chars;
  }

  function scheduleNext(ms) {
    timer = setTimeout(() => nextPrompt(true), animate() ? ms : CORRECT_DELAY_MS);
  }

  function showCorrect(res) {
    setMode('correct');
    el.submit.dataset.mark = 'tick';
    el.input.readOnly = true;
    const slip = res.result === 'accent';
    announce(slip ? `correcto. ojo con el acento: ${res.expected}` : 'correcto');
    // An accent slip shows the right spelling with the missed letters marked.
    const norm = appMode === 'conjugar' ? D.normalize.norm : D.exercise.norm;
    const chars = letters(el.echo, norm(slip || appMode === 'conjugar' ? res.expected : el.input.value), slip ? res.marks : null);
    if (slip) showNudge(res.expected);
    if (appMode !== 'conjugar') fillGap(res.expected, 'good');
    if (animate()) {
      motion.balloons(chars, el.card);
      G.to(el.verb.querySelectorAll('.ch'), { keyframes: { y: [0, -8, 0] }, duration: 0.36, ease: 'power1.inOut', stagger: 0.025, clearProps: 'transform' });
      motion.pop(el.submit, 1.12);
    }
    celebrate(true, el.submit);
    if (slip) timer = setTimeout(() => nextPrompt(true), NUDGE_DELAY_MS);
    else scheduleNext(CORRECT_DELAY_ANIMATED_MS);
  }

  function showNudge(expected) {
    el.nudge.replaceChildren(node('span', 'nudge-k', 'ojo con el acento'), node('span', 'nudge-w', expected));
    el.nudge.hidden = false;
    if (animate()) G.fromTo(el.nudge, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', clearProps: 'transform,opacity' });
  }

  function showWrong(res, why) {
    setMode('wrong');
    el.input.readOnly = true;
    el.fix.hidden = false;
    const chars = letters(el.right, D.exercise.norm(res.expected), res.marks);
    el.right.style.setProperty('--right-scale', String(answerScale(chars.length)));
    const note = res.result === 'accent' ? ['acento', why].filter(Boolean).join(' · ') : why || '';
    el.why.textContent = note;
    if (appMode === 'conjugar') renderTable(prompt);
    else fillGap(res.expected, 'bad');
    wrongShownAt = Date.now();
    announce(`incorrecto: ${res.expected}${note ? `. ${note}` : ''}`);
    if (!animate()) return;
    motion.shake(el.card);
    G.fromTo(el.fix, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' });
    motion.correction(chars);
  }

  function onChoice(i) {
    if (!prompt || mode !== 'asking' || appMode === 'conjugar') return;
    const it = prompt.item;
    const res = deckFor(appMode).answer(prompt, i);
    renderStats(res.ok);
    const buttons = Array.from(el.choices.children);
    buttons.forEach((b, j) => {
      b.disabled = true;
      if (j === it.correct) b.dataset.state = 'right';
      else if (j === i) b.dataset.state = 'wrong';
    });
    motion.choicesSettle(buttons, buttons[it.correct], buttons[i]);
    fillGap(res.expected, res.ok ? 'good' : 'bad');
    if (res.ok) {
      setMode('correct');
      announce('correcto');
      celebrate(true, buttons[i]);
      scheduleNext(CHOICE_DELAY_MS + 250);
      return;
    }
    setMode('wrong');
    el.fix.hidden = false;
    const chars = letters(el.right, res.expected);
    el.right.style.setProperty('--right-scale', String(answerScale(chars.length)));
    el.why.textContent = it.why || '';
    wrongShownAt = Date.now();
    announce(`incorrecto: ${res.expected}${it.why ? `. ${it.why}` : ''}`);
    el.next.focus({ preventScroll: true });
    if (!animate()) return;
    G.fromTo(el.fix, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', delay: 0.15, clearProps: 'transform,opacity' });
    motion.correction(chars);
  }

  function onSubmit(repeat = false) {
    if (!prompt) return;
    if (D.advanceGuard.shouldIgnoreEnter({ mode, repeat, shownAt: wrongShownAt, now: Date.now() })) return;
    if (mode !== 'asking') {
      nextPrompt(true);
      return;
    }
    if (el.stage.dataset.kind === 'choice') return;
    const typed = el.input.value;
    if (!typed.trim()) {
      motion.shake(el.field, 4);
      return;
    }
    const res = appMode === 'conjugar' ? session.answer(prompt, typed) : deckFor(appMode).answer(prompt, typed);
    renderStats(res.ok);
    if (res.ok) showCorrect(res);
    else showWrong(res, prompt.item ? prompt.item.why : '');
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
    if (e.key === 'Escape' && drawerOpen()) {
      closeRail();
      return;
    }
    if (drawerOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (appMode === 'lectura') {
      if (reading.key(e)) e.preventDefault();
      return;
    }
    if (e.target === el.input) return;
    // Choices: 1–4 pick an option; Enter moves on after a miss.
    if (el.stage.dataset.kind === 'choice' && mode === 'asking' && /^[1-4]$/.test(e.key)) {
      const n = Number(e.key) - 1;
      if (prompt && prompt.item && n < prompt.item.options.length) {
        e.preventDefault();
        onChoice(n);
      }
    }
  });
  narrow.addEventListener('change', () => {
    if (!narrow.matches && drawerOpen()) {
      el.app.dataset.drawer = 'closed';
      el.menu.setAttribute('aria-expanded', 'false');
      if (settingsDirty) refresh();
    }
    syncInert();
  });
  window.addEventListener('resize', () => syncTabs(true));
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) motion.stopAmbient();
    else motion.ambient(el.ambient);
  });

  buildTabs();
  buildRail();
  buildKeys();
  syncInert();
  applyMode(true, true);
  motion.ambient(el.ambient);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => syncTabs(true));
  if (appMode !== 'lectura' && !prompt) openRail();
})();
