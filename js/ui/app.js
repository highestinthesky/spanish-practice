(function () {
  'use strict';
  const D = window.Drill;
  const $ = (id) => document.getElementById(id);

  const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
  const CORRECT_DELAY_MS = 320;

  const session = D.createSession({ verbs: D.verbs, tenses: D.tenses, store: D.store });

  const el = {
    stage: $('stage'), verb: $('verb'), gloss: $('gloss'), person: $('person'),
    form: $('form'), input: $('input'), submit: $('submit'), keys: $('keys'),
    plate: $('plate'), own: $('own'), right: $('right'),
    chips: $('chips'), vos: $('vos'), tenses: $('tenses'),
    bars: $('bars'), acc: $('acc'), live: $('live'),
  };

  let prompt = null;
  let mode = 'asking';
  let timer = 0;
  let wrongShownAt = 0;

  // Long infinitives and long answers (nos divertimos) shrink so they never overflow.
  const verbScale = (n) => (n <= 7 ? 1 : n <= 9 ? 0.84 : n <= 11 ? 0.7 : 0.58);
  const answerScale = (n) => (n <= 8 ? 1 : n <= 11 ? 0.8 : n <= 15 ? 0.6 : 0.48);

  // After a mouse click on a control, typing should go to the answer. Keyboard and touch users keep their place.
  const isMouse = (e) => e.pointerType === 'mouse';

  function announce(text) {
    el.live.textContent = '';
    el.live.textContent = text;
  }

  function setMode(next) {
    mode = next;
    el.stage.dataset.mode = next;
  }

  /* ---------- controls ---------- */

  function buildChips() {
    const on = new Set(session.settings().chips);
    for (const tag of D.TAGS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = tag;
      b.setAttribute('aria-pressed', String(on.has(tag)));
      b.addEventListener('click', (e) => {
        session.toggleChip(tag);
        b.setAttribute('aria-pressed', String(session.settings().chips.includes(tag)));
        nextPrompt(isMouse(e));
      });
      el.chips.appendChild(b);
    }
  }

  function buildVosotros() {
    const sync = () => el.vos.setAttribute('aria-pressed', String(session.settings().vosotros));
    sync();
    el.vos.addEventListener('click', (e) => {
      session.setVosotros(!session.settings().vosotros);
      sync();
      nextPrompt(isMouse(e));
    });
  }

  function buildTenses() {
    const all = D.tenses.all();
    if (all.length < 2) return;
    el.tenses.hidden = false;
    const sync = () => {
      for (const b of el.tenses.children) b.setAttribute('aria-pressed', String(b.dataset.id === session.tense().id));
    };
    for (const t of all) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.dataset.id = t.id;
      b.textContent = t.mark;
      b.addEventListener('click', (e) => {
        session.setTense(t.id);
        sync();
        nextPrompt(isMouse(e));
      });
      el.tenses.appendChild(b);
    }
    sync();
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

  /* ---------- flow ---------- */

  function nextPrompt(focusInput = true) {
    clearTimeout(timer);
    prompt = session.next();
    if (!prompt) return;
    setMode('asking');
    el.submit.dataset.mark = 'arrow';
    el.input.readOnly = false;
    el.input.value = '';
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

  buildVosotros();
  buildChips();
  buildTenses();
  buildKeys();
  buildBars();
  renderMeter();
  nextPrompt(true);
})();
