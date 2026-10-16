# Conjugation Drill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, text-free Spanish present-tense conjugation drill (about 145 verbs, tricky ones weighted) that can take more tenses later without a rewrite.

**Architecture:** Plain classic `<script>` files (no modules, no bundler) that attach to one `window.Drill` namespace and also load in Node for tests. Pure logic (normalize, tense registry, verb book, store, scheduler, session) is separate from the thin DOM layer in `js/ui/app.js`. Verb forms are stored explicitly in data files and checked in tests against an independent rule engine and hand-typed fixtures.

**Tech Stack:** HTML, CSS custom properties, vanilla JS (ES2020), Node 24 built-in `node:test` for tests, Python's `http.server` for browser verification, Archivo from Google Fonts.

**Spec:** `docs/superpowers/specs/2026-10-15-conjugation-drill-design.md`

## Global Constraints

- The only visible words are Spanish content: infinitives, pronouns, typed forms, the grammar-notation chips, the word `vosotros`, and (on request) the English gloss. No headings, instructions, or marketing copy anywhere.
- Classic `<script>` tags only, no ES modules (Chrome blocks modules on `file://`). The site must work by double-clicking `index.html`.
- Forms are stored explicitly per verb; nothing is generated at runtime. Generation exists only in tests.
- localStorage key is exactly `conjugacion.v1`. Storage failure must never break the app.
- Scheduler weights: unseen 3; seen by box `[8, 4, 2, 1, 0.5]`; correct = box + 1 (max 4); wrong = box 0; new items start at box 2.
- Only `á é í ó ú` count as accents. `ñ` and `ü` are distinct letters. A missing accent is wrong (flagged as an accent-only miss).
- Hallmark Grid theme: Archivo only, display 800 lowercase with `letter-spacing: -0.045em`, light cool paper, one signal red `oklch(55% 0.21 28)`, zero radius, zero shadow, no cards, no italics anywhere, exposed hairline column grid (12 columns desktop, 6 under 700px). Every colour and `font-family` is a named token in `css/tokens.css`; no inline hex or OKLCH elsewhere.
- Animate `transform` and `opacity` only. `prefers-reduced-motion: reduce` removes all motion. The focus ring appears instantly.
- Verified widths: 320, 375, 414, 768, desktop. No horizontal scroll (`overflow-x: clip` on `html` and `body`). Grid tracks use `minmax(0, 1fr)`. No two-line clickable text.
- Touch targets are at least 44px tall. Accent keys flex to at least 36px wide at 320px (7 keys in one row); that is the one deliberate exception.
- The project folder is not a git repository, so this plan has no commit steps. Each task ends with a full `npm test` run instead.

## Review Focus

Inputs the spec implies but no obvious task would test, most likely first. Each has a pinning test in the task that owns the code.

1. **Answers with stray whitespace, capitals, or non-breaking spaces** (` Me  Levanto `, `pienso `) must count as correct. Pinned in Task 1.
2. **Decomposed Unicode** (an `á` typed or pasted as `a` + combining acute, common on macOS) must count as correct, not as a wrong answer that looks identical. Pinned in Task 1.
3. **localStorage that throws or holds garbage** (private windows, blocked storage, corrupt JSON) must leave the app working with defaults. Pinned in Task 3 and Task 5.
4. **Reflexive answers missing the pronoun, or `n` typed for `ñ`** must be wrong, with the plate marking the right letters, and must not crash. Pinned in Task 1.
5. **Enter pressed twice quickly, or held down,** must record one answer and advance once without skipping a prompt. Pinned in Task 12's browser check.

---

## File structure

```
index.html
package.json
css/tokens.css            design tokens (Hallmark Grid)
css/app.css               layout and components
js/core/normalize.js      norm, stripAcute, check
js/core/tenses.js         tense registry
js/core/store.js          localStorage-backed progress + settings
js/core/scheduler.js      pool building and weighted pick
js/core/session.js        glues scheduler, store, normalize; recent results, accuracy
js/data/verb.js           D.TAGS, D.v(), verb book (addVerbs, addForms)
js/tenses/present.js      registers the present tense
js/data/verbs-irregular.js   irregular, -go, -zco
js/data/verbs-stem.js        e→ie, o→ue, e→i
js/data/verbs-spelling.js    spelling, -uir, í/ú
js/data/verbs-reflexive.js   reflexive verbs
js/data/verbs-regular.js     regular -ar, -er, -ir
js/ui/app.js              DOM glue only
tests/helpers/load.js     loads scripts in index.html order into Node
tests/helpers/rng.js      seeded RNG
tests/helpers/rules.js    independent rule-based conjugator (tests only)
tests/fixtures/forms.js   hand-typed forms for irregulars and spot checks
tests/*.test.js
.claude/launch.json       static server for browser checks
.hallmark/log.json        Hallmark project memory
```

Script order (single source of truth, mirrored in `index.html` and checked by a test): normalize, tenses, store, scheduler, session, verb, present, the five data files, then `js/ui/app.js`.

---

### Task 1: Project scaffold and answer checking

**Files:**
- Create: `package.json`, `tests/helpers/load.js`, `tests/helpers/rng.js`, `js/core/normalize.js`
- Test: `tests/normalize.test.js`

**Interfaces:**
- Produces: `window.Drill.normalize = { norm(s): string, stripAcute(s): string, check(answer, expected): { result: 'correct'|'accent'|'wrong', marks: boolean[] } }`. `marks[i]` is true when character `i` of the normalised expected form differs from the answer. `tests/helpers/load.js` exports `load()` returning `globalThis.Drill`, plus `SCRIPT_ORDER`, `UI_SCRIPT`, `ROOT`. `tests/helpers/rng.js` exports `mulberry32(seed): () => number`.

- [ ] **Step 1: Create the scaffold files**

`package.json`:
```json
{
  "name": "conjugacion",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

`tests/helpers/load.js`:
```js
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

// Same order as the <script> tags in index.html (a test enforces this).
const SCRIPT_ORDER = [
  'js/core/normalize.js',
  'js/core/tenses.js',
  'js/core/store.js',
  'js/core/scheduler.js',
  'js/core/session.js',
  'js/data/verb.js',
  'js/tenses/present.js',
  'js/data/verbs-irregular.js',
  'js/data/verbs-stem.js',
  'js/data/verbs-spelling.js',
  'js/data/verbs-reflexive.js',
  'js/data/verbs-regular.js',
];
const UI_SCRIPT = 'js/ui/app.js';

// Loads every script that exists yet, so early tasks can run before later files are written.
function load() {
  for (const rel of SCRIPT_ORDER) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) require(abs);
  }
  return globalThis.Drill;
}

module.exports = load;
module.exports.SCRIPT_ORDER = SCRIPT_ORDER;
module.exports.UI_SCRIPT = UI_SCRIPT;
module.exports.ROOT = ROOT;
```

`tests/helpers/rng.js`:
```js
'use strict';
// Small seeded RNG so scheduler tests are repeatable.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
module.exports = { mulberry32 };
```

- [ ] **Step 2: Write the failing test**

`tests/normalize.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const { norm, stripAcute, check } = D.normalize;

test('norm trims, collapses whitespace, lowercases', () => {
  assert.equal(norm('  Me   LEVANTO '), 'me levanto');
});

test('norm treats non-breaking spaces as spaces', () => {
  assert.equal(norm('me levanto '), 'me levanto');
});

test('norm converts decomposed accents to composed form', () => {
  assert.equal(norm('pensáis'), 'pensáis');
});

test('stripAcute removes only acute accents', () => {
  assert.equal(stripAcute('pensáis'), 'pensais');
  assert.equal(stripAcute('baño'), 'baño');
  assert.equal(stripAcute('güe'), 'güe');
});

test('check: exact match is correct with no marks', () => {
  const r = check('pienso', 'pienso');
  assert.equal(r.result, 'correct');
  assert.deepEqual(r.marks, [false, false, false, false, false, false]);
});

test('check: case and spacing are forgiven (Review Focus 1)', () => {
  assert.equal(check('  PIENSO ', 'pienso').result, 'correct');
  assert.equal(check(' Me  Levanto ', 'me levanto').result, 'correct');
});

test('check: decomposed accent input is correct (Review Focus 2)', () => {
  assert.equal(check('pensáis', 'pensáis').result, 'correct');
});

test('check: missing accent is an accent miss and marks only the accent', () => {
  const r = check('pensais', 'pensáis');
  assert.equal(r.result, 'accent');
  assert.deepEqual(r.marks, [false, false, false, false, true, false, false]);
});

test('check: n for ñ is wrong, not an accent miss (Review Focus 4)', () => {
  const r = check('bano', 'baño');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [false, false, true, false]);
});

test('check: wrong ending marks the differing letters', () => {
  const r = check('piensan', 'pienso');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [false, false, false, false, false, true]);
});

test('check: reflexive verb without the pronoun is wrong (Review Focus 4)', () => {
  const r = check('levanto', 'me levanto');
  assert.equal(r.result, 'wrong');
  assert.equal(r.marks.length, 'me levanto'.length);
});

test('check: empty answer is wrong and marks every letter', () => {
  const r = check('', 'pienso');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [true, true, true, true, true, true]);
});

test('check: marks always match the length of the normalised expected form', () => {
  assert.equal(check('x', 'Me Levanto').marks.length, 10);
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `TypeError: Cannot destructure property 'norm' of 'D.normalize'` (the module does not exist yet).

- [ ] **Step 4: Write the implementation**

`js/core/normalize.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function norm(s) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  // Only the acute accent counts as an accent. ñ (n + tilde) and ü (u + diaeresis) are different letters.
  function stripAcute(s) {
    return s.normalize('NFD').replace(/́/g, '').normalize('NFC');
  }

  function marks(answer, expected) {
    const a = Array.from(answer);
    return Array.from(expected).map((ch, i) => a[i] !== ch);
  }

  function check(answer, expected) {
    const a = norm(answer);
    const e = norm(expected);
    const m = marks(a, e);
    if (a === e) return { result: 'correct', marks: m };
    if (stripAcute(a) === stripAcute(e)) return { result: 'accent', marks: m };
    return { result: 'wrong', marks: m };
  }

  D.normalize = { norm, stripAcute, check };
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures.

---

### Task 2: Tense registry, verb book, present tense

**Files:**
- Create: `js/core/tenses.js`, `js/data/verb.js`, `js/tenses/present.js`
- Test: `tests/tenses.test.js`, `tests/verb.test.js`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces:
  - `Drill.createTenseRegistry(): { register(t), get(id), all() }`. A tense is `{ id: string, mark: string, persons: string[], vosotrosIndex?: number }`. `register` throws on duplicate id, empty id, empty `persons`, or `vosotrosIndex` out of range. `get` returns the tense or `null`. `all()` returns tenses in registration order.
  - `Drill.tenses` (the shared registry, `present` registered by `present.js`).
  - `Drill.TAGS: string[]` (the chip order).
  - `Drill.v(inf, gloss, tags, present): Verb` where `Verb = { inf, gloss, tags, reflexive, forms: { present: string[] } }`. Reflexive is true when `inf` ends in `se`, and the `reflexive` tag is added automatically.
  - `Drill.createVerbBook(tenses): { verbs, addVerbs(list), addForms(tenseId, map) }`; `Drill.verbs`, `Drill.addVerbs`, `Drill.addForms` are the shared instance. `addVerbs` throws on duplicate `inf`, unknown tag, unknown tense, or forms that are not exactly `persons.length` non-empty strings. `addForms(tenseId, { inf: forms[] })` adds forms to existing verbs and throws on unknown verb or bad forms.

- [ ] **Step 1: Write the failing tests**

`tests/tenses.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const PERSONS = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];

test('register and get a tense', () => {
  const r = D.createTenseRegistry();
  r.register({ id: 'present', mark: 'pres', persons: PERSONS, vosotrosIndex: 4 });
  assert.equal(r.get('present').persons.length, 6);
  assert.equal(r.get('nope'), null);
});

test('all() keeps registration order', () => {
  const r = D.createTenseRegistry();
  r.register({ id: 'a', mark: 'a', persons: PERSONS });
  r.register({ id: 'b', mark: 'b', persons: PERSONS });
  assert.deepEqual(r.all().map((t) => t.id), ['a', 'b']);
});

test('register rejects duplicates and bad shapes', () => {
  const r = D.createTenseRegistry();
  r.register({ id: 'a', mark: 'a', persons: PERSONS });
  assert.throws(() => r.register({ id: 'a', mark: 'a', persons: PERSONS }), /duplicate/i);
  assert.throws(() => r.register({ id: '', mark: 'x', persons: PERSONS }), /id/i);
  assert.throws(() => r.register({ id: 'c', mark: 'c', persons: [] }), /persons/i);
  assert.throws(() => r.register({ id: 'd', mark: 'd', persons: PERSONS, vosotrosIndex: 6 }), /vosotrosIndex/);
});

test('the shared registry has the present tense with six persons and vosotros at 4', () => {
  const t = D.tenses.get('present');
  assert.equal(t.persons.length, 6);
  assert.equal(t.vosotrosIndex, 4);
  assert.equal(t.persons[4], 'vosotros');
});
```

`tests/verb.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const SIX = ['a', 'b', 'c', 'd', 'e', 'f'];

function freshBook() {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', persons: ['1', '2', '3', '4', '5', '6'], vosotrosIndex: 4 });
  return { tenses, book: D.createVerbBook(tenses) };
}

test('v() builds a record and detects reflexive verbs', () => {
  const plain = D.v('hablar', 'to speak', ['regular'], SIX);
  assert.equal(plain.reflexive, false);
  assert.deepEqual(plain.tags, ['regular']);
  assert.deepEqual(plain.forms.present, SIX);

  const refl = D.v('lavarse', 'to wash oneself', ['regular'], SIX);
  assert.equal(refl.reflexive, true);
  assert.deepEqual(refl.tags, ['regular', 'reflexive']);
});

test('v() copies its inputs', () => {
  const tags = ['regular'];
  const forms = SIX.slice();
  const verb = D.v('hablar', 'x', tags, forms);
  tags.push('mutated');
  forms[0] = 'mutated';
  assert.deepEqual(verb.tags, ['regular']);
  assert.equal(verb.forms.present[0], 'a');
});

test('TAGS lists the chip order', () => {
  assert.deepEqual(D.TAGS, ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular']);
});

test('addVerbs accepts valid verbs and rejects duplicates', () => {
  const { book } = freshBook();
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  assert.equal(book.verbs.length, 1);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]), /duplicate verb: hablar/);
});

test('addVerbs rejects unknown tags and wrong form counts', () => {
  const { book } = freshBook();
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['bogus'], SIX)]), /unknown tag/);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], SIX.slice(0, 5))]), /needs 6/);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], ['a', 'b', 'c', 'd', 'e', ' '])]), /non-empty/);
});

test('addForms adds a new tense to existing verbs (future tenses)', () => {
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  book.addForms('preterite', { hablar: ['1', '2', '3', '4', '5', '6'] });
  assert.deepEqual(book.verbs[0].forms.preterite, ['1', '2', '3', '4', '5', '6']);
});

test('addForms rejects unknown verbs, unknown tenses, and bad lengths', () => {
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  assert.throws(() => book.addForms('preterite', { comer: SIX }), /unknown verb/);
  assert.throws(() => book.addForms('imperfect', { hablar: SIX }), /unknown tense/);
  assert.throws(() => book.addForms('preterite', { hablar: ['a'] }), /needs 6/);
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test`
Expected: FAIL with `TypeError: D.createTenseRegistry is not a function` and `D.v is not a function`.

- [ ] **Step 3: Write the implementation**

`js/core/tenses.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function createTenseRegistry() {
    const byId = new Map();
    return {
      register(t) {
        if (!t || typeof t.id !== 'string' || !t.id) throw new Error('tense needs an id');
        if (!Array.isArray(t.persons) || t.persons.length === 0) throw new Error(`${t.id}: tense needs persons`);
        if (t.vosotrosIndex != null && !(Number.isInteger(t.vosotrosIndex) && t.vosotrosIndex >= 0 && t.vosotrosIndex < t.persons.length)) {
          throw new Error(`${t.id}: vosotrosIndex out of range`);
        }
        if (byId.has(t.id)) throw new Error(`duplicate tense: ${t.id}`);
        byId.set(t.id, t);
      },
      get(id) {
        return byId.get(id) || null;
      },
      all() {
        return Array.from(byId.values());
      },
    };
  }

  D.createTenseRegistry = createTenseRegistry;
  D.tenses = createTenseRegistry();
})(typeof window !== 'undefined' ? window : globalThis);
```

`js/data/verb.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Chip order on screen. Tags describe a verb's behaviour and are tense-agnostic.
  const TAGS = ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular'];

  function v(inf, gloss, tags, present) {
    const reflexive = /se$/.test(inf);
    const t = tags.slice();
    if (reflexive && !t.includes('reflexive')) t.push('reflexive');
    return { inf, gloss, tags: t, reflexive, forms: { present: present.slice() } };
  }

  function createVerbBook(tenses) {
    const verbs = [];

    function validateForms(verb, tenseId, forms) {
      const tense = tenses.get(tenseId);
      if (!tense) throw new Error(`${verb.inf}: unknown tense ${tenseId}`);
      const ok = Array.isArray(forms) && forms.length === tense.persons.length && forms.every((f) => typeof f === 'string' && f.trim());
      if (!ok) throw new Error(`${verb.inf}: ${tenseId} needs ${tense.persons.length} non-empty forms`);
    }

    function addVerbs(list) {
      for (const verb of list) {
        if (verbs.some((x) => x.inf === verb.inf)) throw new Error(`duplicate verb: ${verb.inf}`);
        for (const tag of verb.tags) {
          if (!TAGS.includes(tag)) throw new Error(`${verb.inf}: unknown tag ${tag}`);
        }
        for (const [tenseId, forms] of Object.entries(verb.forms)) validateForms(verb, tenseId, forms);
        verbs.push(verb);
      }
    }

    function addForms(tenseId, map) {
      for (const [inf, forms] of Object.entries(map)) {
        const verb = verbs.find((x) => x.inf === inf);
        if (!verb) throw new Error(`addForms: unknown verb ${inf}`);
        validateForms(verb, tenseId, forms);
        verb.forms[tenseId] = forms.slice();
      }
    }

    return { verbs, addVerbs, addForms };
  }

  const book = createVerbBook(D.tenses);
  D.TAGS = TAGS;
  D.v = v;
  D.createVerbBook = createVerbBook;
  D.verbs = book.verbs;
  D.addVerbs = book.addVerbs;
  D.addForms = book.addForms;
})(typeof window !== 'undefined' ? window : globalThis);
```

`js/tenses/present.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  D.tenses.register({
    id: 'present',
    mark: 'pres',
    persons: ['yo', 'tú', 'él / ella / Ud.', 'nosotros', 'vosotros', 'ellos / ellas / Uds.'],
    vosotrosIndex: 4,
  });
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures.

---

### Task 3: Progress store

**Files:**
- Create: `js/core/store.js`
- Test: `tests/store.test.js`

**Interfaces:**
- Produces: `Drill.createStore(getStorage): Store` where `getStorage` is a function returning an object with `getItem`, `setItem`, `removeItem`. `Store = { state(): { items, settings }, record(key, correct, now), setSetting(name, value), clear() }`. `items[key] = { box, seen, misses, last }`. `settings = { chips: string[], vosotros: boolean, tense: string }`. Also `Drill.STORE_KEY === 'conjugacion.v1'` and a lazy `Drill.store` getter backed by `window.localStorage` (created on first access so Node never touches it).

- [ ] **Step 1: Write the failing test**

`tests/store.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

function fakeStorage(initial) {
  const data = new Map(initial ? [[D.STORE_KEY, initial]] : []);
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    data,
  };
}

test('fresh store has defaults', () => {
  const s = D.createStore(() => fakeStorage());
  assert.deepEqual(s.state(), { items: {}, settings: { chips: [], vosotros: true, tense: 'present' } });
});

test('the storage key is conjugacion.v1', () => {
  assert.equal(D.STORE_KEY, 'conjugacion.v1');
});

test('record: a new item starts at box 2; correct moves up, wrong resets to 0', () => {
  const s = D.createStore(() => fakeStorage());
  s.record('k', true, 100);
  assert.deepEqual(s.state().items.k, { box: 3, seen: 1, misses: 0, last: 100 });
  s.record('k', true, 101);
  s.record('k', true, 102);
  assert.equal(s.state().items.k.box, 4);
  s.record('k', false, 103);
  assert.deepEqual(s.state().items.k, { box: 0, seen: 4, misses: 1, last: 103 });
});

test('record persists to storage and a new store reads it back', () => {
  const storage = fakeStorage();
  const a = D.createStore(() => storage);
  a.record('k', false, 5);
  a.setSetting('vosotros', false);
  const b = D.createStore(() => storage);
  assert.equal(b.state().items.k.misses, 1);
  assert.equal(b.state().settings.vosotros, false);
});

test('storage that throws on every call does not break anything (Review Focus 3)', () => {
  const boom = () => {
    throw new Error('blocked');
  };
  const s = D.createStore(() => ({ getItem: boom, setItem: boom, removeItem: boom }));
  assert.doesNotThrow(() => s.record('k', true, 1));
  assert.doesNotThrow(() => s.setSetting('chips', ['e→ie']));
  assert.doesNotThrow(() => s.clear());
  assert.deepEqual(s.state().settings.chips, []);
});

test('getStorage that throws (no localStorage at all) falls back to defaults (Review Focus 3)', () => {
  const s = D.createStore(() => {
    throw new Error('no storage');
  });
  assert.doesNotThrow(() => s.record('k', true, 1));
  assert.equal(s.state().items.k.seen, 1);
});

test('corrupt JSON falls back to defaults (Review Focus 3)', () => {
  const s = D.createStore(() => fakeStorage('{not json'));
  assert.deepEqual(s.state().items, {});
});

test('valid JSON of the wrong shape falls back to defaults', () => {
  for (const raw of ['null', '[]', '"x"', '42']) {
    const s = D.createStore(() => fakeStorage(raw));
    assert.deepEqual(s.state().items, {}, raw);
    assert.equal(s.state().settings.vosotros, true, raw);
  }
});

test('sanitize drops bad items and bad settings but keeps good ones', () => {
  const raw = JSON.stringify({
    items: {
      good: { box: 3, seen: 2, misses: 1, last: 9 },
      badBox: { box: 9, seen: 1, misses: 0, last: 0 },
      badSeen: { box: 1, seen: -1, misses: 0, last: 0 },
      notObj: 'x',
    },
    settings: { chips: ['e→ie', 7], vosotros: 'yes', tense: '' },
  });
  const s = D.createStore(() => fakeStorage(raw));
  assert.deepEqual(Object.keys(s.state().items), ['good']);
  assert.deepEqual(s.state().settings, { chips: ['e→ie'], vosotros: true, tense: 'present' });
});

test('clear resets state and removes the stored key', () => {
  const storage = fakeStorage();
  const s = D.createStore(() => storage);
  s.record('k', true, 1);
  s.clear();
  assert.deepEqual(s.state().items, {});
  assert.equal(storage.data.has(D.STORE_KEY), false);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `TypeError: D.createStore is not a function`.

- [ ] **Step 3: Write the implementation**

`js/core/store.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const KEY = 'conjugacion.v1';
  const NEUTRAL_BOX = 2;

  function defaults() {
    return { items: {}, settings: { chips: [], vosotros: true, tense: 'present' } };
  }

  function isCount(n) {
    return Number.isInteger(n) && n >= 0;
  }

  function sanitize(raw) {
    const out = defaults();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    if (raw.items && typeof raw.items === 'object') {
      for (const [key, e] of Object.entries(raw.items)) {
        if (!e || typeof e !== 'object') continue;
        if (!Number.isInteger(e.box) || e.box < 0 || e.box > 4) continue;
        if (!isCount(e.seen) || !isCount(e.misses)) continue;
        out.items[key] = { box: e.box, seen: e.seen, misses: e.misses, last: Number.isFinite(e.last) ? e.last : 0 };
      }
    }
    const s = raw.settings;
    if (s && typeof s === 'object') {
      if (Array.isArray(s.chips)) out.settings.chips = s.chips.filter((c) => typeof c === 'string');
      if (typeof s.vosotros === 'boolean') out.settings.vosotros = s.vosotros;
      if (typeof s.tense === 'string' && s.tense) out.settings.tense = s.tense;
    }
    return out;
  }

  // getStorage is a function so that merely touching window.localStorage (which can throw) happens inside try.
  function createStore(getStorage) {
    let state = defaults();
    try {
      const raw = getStorage().getItem(KEY);
      if (raw) state = sanitize(JSON.parse(raw));
    } catch (e) {
      state = defaults();
    }

    function persist() {
      try {
        getStorage().setItem(KEY, JSON.stringify(state));
      } catch (e) {
        /* progress stays in memory for this session */
      }
    }

    return {
      state: () => state,
      record(key, correct, now) {
        const e = state.items[key] || { box: NEUTRAL_BOX, seen: 0, misses: 0, last: 0 };
        e.seen += 1;
        if (correct) {
          e.box = Math.min(e.box + 1, 4);
        } else {
          e.box = 0;
          e.misses += 1;
        }
        e.last = now;
        state.items[key] = e;
        persist();
      },
      setSetting(name, value) {
        state.settings[name] = value;
        persist();
      },
      clear() {
        state = defaults();
        try {
          getStorage().removeItem(KEY);
        } catch (e) {
          /* nothing stored, or storage blocked */
        }
      },
    };
  }

  D.STORE_KEY = KEY;
  D.createStore = createStore;

  // Created on first use so Node (tests) never touches localStorage.
  let shared = null;
  Object.defineProperty(D, 'store', {
    configurable: true,
    get() {
      return shared || (shared = createStore(() => root.localStorage));
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures.

---

### Task 4: Scheduler

**Files:**
- Create: `js/core/scheduler.js`
- Test: `tests/scheduler.test.js`

**Interfaces:**
- Consumes: a tense object `{ id, persons, vosotrosIndex }` and verb records `{ inf, tags, forms }` as defined in Task 2; `items` as in Task 3.
- Produces: `Drill.scheduler = { WEIGHTS, UNSEEN, itemKey(tenseId, inf, person), buildPool({ verbs, tense, chips, vosotros }), weightOf(entry), pick(pool, items, last, rng) }`. A pool entry is `{ key, verb, person }`. `last` is `null` or `{ key, inf }`. `pick` returns a pool entry or `null` for an empty pool.

- [ ] **Step 1: Write the failing test**

`tests/scheduler.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const { mulberry32 } = require('./helpers/rng');

const S = D.scheduler;
const tense = { id: 'present', persons: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'], vosotrosIndex: 4 };
const mk = (inf, tags, withPresent = true) => ({ inf, tags, forms: withPresent ? { present: ['a', 'b', 'c', 'd', 'e', 'f'] } : {} });
const verbs = [mk('pensar', ['e→ie']), mk('poder', ['o→ue']), mk('hablar', ['regular']), mk('futuro', ['regular'], false)];

test('itemKey joins tense, verb, person', () => {
  assert.equal(S.itemKey('present', 'pensar', 3), 'present|pensar|3');
});

test('buildPool: no chips means every verb that has the tense, all six persons', () => {
  const pool = S.buildPool({ verbs, tense, chips: [], vosotros: true });
  assert.equal(pool.length, 3 * 6);
  assert.ok(!pool.some((p) => p.verb.inf === 'futuro'));
});

test('buildPool: chips combine with OR', () => {
  const pool = S.buildPool({ verbs, tense, chips: ['e→ie', 'o→ue'], vosotros: true });
  assert.deepEqual([...new Set(pool.map((p) => p.verb.inf))].sort(), ['pensar', 'poder']);
});

test('buildPool: vosotros off drops person 4 only', () => {
  const pool = S.buildPool({ verbs, tense, chips: [], vosotros: false });
  assert.equal(pool.length, 3 * 5);
  assert.ok(!pool.some((p) => p.person === 4));
});

test('buildPool: a tense without vosotrosIndex keeps every person when vosotros is off', () => {
  const t = { id: 'x', persons: ['a', 'b'], vosotrosIndex: undefined };
  const vs = [{ inf: 'v', tags: [], forms: { x: ['1', '2'] } }];
  assert.equal(S.buildPool({ verbs: vs, tense: t, chips: [], vosotros: false }).length, 2);
});

test('weightOf: unseen is 3, seen follows the box table', () => {
  assert.equal(S.weightOf(undefined), 3);
  assert.equal(S.weightOf({ box: 0, seen: 0 }), 3);
  assert.deepEqual([0, 1, 2, 3, 4].map((box) => S.weightOf({ box, seen: 1 })), [8, 4, 2, 1, 0.5]);
});

test('pick: empty pool returns null', () => {
  assert.equal(S.pick([], {}, null, Math.random), null);
});

test('pick: a pool of one is returned even when it equals last', () => {
  const pool = S.buildPool({ verbs: [verbs[0]], tense, chips: [], vosotros: false }).slice(0, 1);
  const last = { key: pool[0].key, inf: pool[0].verb.inf };
  assert.equal(S.pick(pool, {}, last, Math.random), pool[0]);
});

test('pick: never repeats the same key, and avoids the same verb back to back', () => {
  const pool = S.buildPool({ verbs: verbs.slice(0, 3), tense, chips: [], vosotros: true });
  const rng = mulberry32(7);
  let last = null;
  for (let i = 0; i < 500; i += 1) {
    const item = S.pick(pool, {}, last, rng);
    if (last) {
      assert.notEqual(item.key, last.key);
      assert.notEqual(item.verb.inf, last.inf);
    }
    last = { key: item.key, inf: item.verb.inf };
  }
});

test('pick: with one verb in the pool it still avoids repeating the same key', () => {
  const pool = S.buildPool({ verbs: [verbs[0]], tense, chips: [], vosotros: true });
  const rng = mulberry32(3);
  let last = null;
  for (let i = 0; i < 200; i += 1) {
    const item = S.pick(pool, {}, last, rng);
    if (last) assert.notEqual(item.key, last.key);
    last = { key: item.key, inf: item.verb.inf };
  }
});

test('pick: missed items come up far more often than mastered ones', () => {
  const pool = S.buildPool({ verbs: [verbs[0]], tense, chips: [], vosotros: true }).slice(0, 3);
  const items = {
    [pool[0].key]: { box: 0, seen: 5 },
    [pool[1].key]: { box: 4, seen: 5 },
  };
  const rng = mulberry32(11);
  const counts = new Map(pool.map((p) => [p.key, 0]));
  for (let i = 0; i < 3000; i += 1) {
    const item = S.pick(pool, items, null, rng);
    counts.set(item.key, counts.get(item.key) + 1);
  }
  const missed = counts.get(pool[0].key);
  const mastered = counts.get(pool[1].key);
  const unseen = counts.get(pool[2].key);
  assert.ok(missed > mastered * 8, `missed ${missed} vs mastered ${mastered}`);
  assert.ok(unseen > mastered, `unseen ${unseen} vs mastered ${mastered}`);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `TypeError: Cannot read properties of undefined (reading 'itemKey')`.

- [ ] **Step 3: Write the implementation**

`js/core/scheduler.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const WEIGHTS = [8, 4, 2, 1, 0.5];
  const UNSEEN = 3;

  function itemKey(tenseId, inf, person) {
    return `${tenseId}|${inf}|${person}`;
  }

  function buildPool({ verbs, tense, chips, vosotros }) {
    const wanted = chips && chips.length ? new Set(chips) : null;
    const pool = [];
    for (const verb of verbs) {
      if (!verb.forms[tense.id]) continue;
      if (wanted && !verb.tags.some((t) => wanted.has(t))) continue;
      for (let person = 0; person < tense.persons.length; person += 1) {
        if (!vosotros && person === tense.vosotrosIndex) continue;
        pool.push({ key: itemKey(tense.id, verb.inf, person), verb, person });
      }
    }
    return pool;
  }

  function weightOf(entry) {
    if (!entry || !entry.seen) return UNSEEN;
    return WEIGHTS[entry.box];
  }

  // Never the same item twice running; prefer a different verb from the last one when the pool allows it.
  function pick(pool, items, last, rng) {
    if (!pool.length) return null;
    let candidates = pool;
    if (last) {
      const otherKey = pool.filter((p) => p.key !== last.key);
      if (otherKey.length) {
        candidates = otherKey;
        const otherVerb = otherKey.filter((p) => p.verb.inf !== last.inf);
        if (otherVerb.length) candidates = otherVerb;
      }
    }
    const weights = candidates.map((p) => weightOf(items[p.key]));
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < candidates.length; i += 1) {
      r -= weights[i];
      if (r < 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }

  D.scheduler = { WEIGHTS, UNSEEN, itemKey, buildPool, weightOf, pick };
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures.

---

### Task 5: Session

**Files:**
- Create: `js/core/session.js`
- Test: `tests/session.test.js`

**Interfaces:**
- Consumes: `Drill.scheduler` (Task 4), `Drill.normalize.check` (Task 1), a store (Task 3), a tense registry (Task 2), verb records (Task 2).
- Produces: `Drill.createSession({ verbs, tenses, store, rng?, now? })` returning `{ settings(), tense(), toggleChip(tag), setVosotros(on), setTense(id), next(), answer(prompt, text), recent(), accuracy() }`.
  - `next()` returns `null` or `{ key, verb, person, tenseId, personLabel, expected }`.
  - `answer(prompt, text)` returns `{ ok: boolean, result: 'correct'|'accent'|'wrong', marks: boolean[], expected: string }` and records the result in the store.
  - `recent()` returns up to the last 10 results (`'ok'|'no'`, oldest first). `accuracy()` returns `null` before the first answer, else an integer percent for the page session.

- [ ] **Step 1: Write the failing test**

`tests/session.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const { mulberry32 } = require('./helpers/rng');

function setup(overrides = {}) {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', persons: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'], vosotrosIndex: 4 });
  const verbs = [
    D.v('pensar', 'to think', ['e→ie'], ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']),
    D.v('hablar', 'to speak', ['regular'], ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']),
  ];
  const boom = () => {
    throw new Error('blocked');
  };
  const store = overrides.store || D.createStore(() => ({ getItem: () => null, setItem() {}, removeItem() {} }));
  const session = D.createSession({ verbs, tenses, store, rng: mulberry32(1), now: () => 1000 });
  return { session, store, tenses, boom };
}

test('next() returns a prompt with the expected form and the person label', () => {
  const { session } = setup();
  const p = session.next();
  assert.ok(p.verb && p.key.startsWith('present|'));
  assert.equal(p.tenseId, 'present');
  assert.equal(p.expected, p.verb.forms.present[p.person]);
  assert.equal(p.personLabel, ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'][p.person]);
});

test('next() follows the chips and the vosotros setting', () => {
  const { session } = setup();
  session.toggleChip('e→ie');
  session.setVosotros(false);
  for (let i = 0; i < 100; i += 1) {
    const p = session.next();
    assert.equal(p.verb.inf, 'pensar');
    assert.notEqual(p.person, 4);
  }
});

test('toggleChip toggles and persists in the store', () => {
  const { session, store } = setup();
  session.toggleChip('o→ue');
  assert.deepEqual(store.state().settings.chips, ['o→ue']);
  session.toggleChip('o→ue');
  assert.deepEqual(store.state().settings.chips, []);
});

test('next() with a filter that matches nothing falls back to all verbs', () => {
  const { session } = setup();
  session.toggleChip('-uir');
  assert.ok(session.next());
});

test('next() returns null when there are no verbs at all', () => {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'p', persons: ['a'], vosotrosIndex: undefined });
  const store = D.createStore(() => ({ getItem: () => null, setItem() {}, removeItem() {} }));
  const session = D.createSession({ verbs: [], tenses, store });
  assert.equal(session.next(), null);
});

test('setTense ignores unknown tenses; an unknown saved tense falls back to the first registered', () => {
  const { session, store } = setup();
  session.setTense('imperfect');
  assert.equal(store.state().settings.tense, 'present');
  store.setSetting('tense', 'gone');
  assert.equal(session.tense().id, 'present');
  assert.ok(session.next());
});

test('answer: correct answer is ok, recorded, and counts toward accuracy', () => {
  const { session, store } = setup();
  const p = session.next();
  const r = session.answer(p, p.expected);
  assert.equal(r.ok, true);
  assert.equal(r.result, 'correct');
  assert.equal(store.state().items[p.key].seen, 1);
  assert.equal(store.state().items[p.key].last, 1000);
  assert.equal(session.accuracy(), 100);
  assert.deepEqual(session.recent(), ['ok']);
});

test('answer: wrong and accent-only answers are not ok and carry marks', () => {
  const { session } = setup();
  const p = { key: 'present|pensar|4', verb: { inf: 'pensar' }, person: 4, tenseId: 'present', personLabel: 'vosotros', expected: 'pensáis' };
  const accent = session.answer(p, 'pensais');
  assert.equal(accent.ok, false);
  assert.equal(accent.result, 'accent');
  assert.equal(accent.marks[4], true);
  const wrong = session.answer(p, 'xxxxxxx');
  assert.equal(wrong.result, 'wrong');
  assert.equal(session.accuracy(), 0);
  assert.deepEqual(session.recent(), ['no', 'no']);
});

test('accuracy is null before any answer and rounds to an integer', () => {
  const { session } = setup();
  assert.equal(session.accuracy(), null);
  const p = session.next();
  session.answer(p, p.expected);
  session.answer(p, p.expected);
  session.answer(p, 'nope');
  assert.equal(session.accuracy(), 67);
});

test('recent keeps only the last ten, oldest first', () => {
  const { session } = setup();
  const p = session.next();
  for (let i = 0; i < 12; i += 1) session.answer(p, i < 2 ? 'nope' : p.expected);
  const r = session.recent();
  assert.equal(r.length, 10);
  assert.ok(r.every((x) => x === 'ok'));
});

test('a throwing store.getStorage does not stop a session (Review Focus 3)', () => {
  const store = D.createStore(() => {
    throw new Error('no storage');
  });
  const { session } = setup({ store });
  const p = session.next();
  assert.doesNotThrow(() => session.answer(p, p.expected));
  assert.doesNotThrow(() => session.toggleChip('e→ie'));
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `TypeError: D.createSession is not a function`.

- [ ] **Step 3: Write the implementation**

`js/core/session.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function createSession({ verbs, tenses, store, rng = Math.random, now = Date.now }) {
    let last = null;
    let recent = [];
    let right = 0;
    let total = 0;

    const settings = () => store.state().settings;
    const tense = () => tenses.get(settings().tense) || tenses.all()[0] || null;

    function poolFor(chips) {
      const t = tense();
      if (!t) return [];
      return D.scheduler.buildPool({ verbs, tense: t, chips, vosotros: settings().vosotros });
    }

    return {
      settings,
      tense,
      toggleChip(tag) {
        const set = new Set(settings().chips);
        if (set.has(tag)) set.delete(tag);
        else set.add(tag);
        store.setSetting('chips', Array.from(set));
      },
      setVosotros(on) {
        store.setSetting('vosotros', Boolean(on));
      },
      setTense(id) {
        if (tenses.get(id)) store.setSetting('tense', id);
      },
      next() {
        const t = tense();
        if (!t) return null;
        let pool = poolFor(settings().chips);
        if (!pool.length) pool = poolFor([]);
        const item = D.scheduler.pick(pool, store.state().items, last, rng);
        if (!item) return null;
        last = { key: item.key, inf: item.verb.inf };
        return {
          key: item.key,
          verb: item.verb,
          person: item.person,
          tenseId: t.id,
          personLabel: t.persons[item.person],
          expected: item.verb.forms[t.id][item.person],
        };
      },
      answer(prompt, text) {
        const r = D.normalize.check(text, prompt.expected);
        const ok = r.result === 'correct';
        store.record(prompt.key, ok, now());
        recent.push(ok ? 'ok' : 'no');
        if (recent.length > 10) recent.shift();
        total += 1;
        if (ok) right += 1;
        return { ok, result: r.result, marks: r.marks, expected: prompt.expected };
      },
      recent: () => recent.slice(),
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.createSession = createSession;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures.

---

### Task 6: Independent rule engine, fixtures, and the irregular / -go / -zco verbs

**Files:**
- Create: `tests/helpers/rules.js`, `tests/fixtures/forms.js`, `js/data/verbs-irregular.js`
- Test: `tests/rules.test.js`, `tests/verbs.test.js`

**Interfaces:**
- Consumes: `Drill.v`, `Drill.addVerbs` (Task 2).
- Produces: `tests/helpers/rules.js` exports `conjugate(inf, tags): string[]` (six present forms; reflexive verbs get their pronoun). `tests/fixtures/forms.js` exports `{ inf: string[6] }`. `tests/verbs.test.js` checks all verbs in `Drill.verbs`; later data tasks only add data files and re-run it.

- [ ] **Step 1: Write the rule engine and its own tests**

`tests/helpers/rules.js`:
```js
'use strict';
// Independent present-tense conjugator, used ONLY by tests to double-check the stored forms.
// It never touches the data files.
const ENDINGS = {
  ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
  er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
  ir: ['o', 'es', 'e', 'imos', 'ís', 'en'],
};
const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
const SHAPED = [0, 1, 2, 5]; // the "boot": yo, tú, él, ellos

function replaceLast(str, from, to) {
  const i = str.lastIndexOf(from);
  if (i < 0) throw new Error(`no "${from}" in "${str}"`);
  return str.slice(0, i) + to + str.slice(i + from.length);
}

function conjugate(inf, tags) {
  const base = inf.endsWith('se') ? inf.slice(0, -2) : inf;
  const type = base.slice(-2);
  const ending = ENDINGS[type];
  if (!ending) throw new Error(`cannot conjugate ${inf}`);
  const stem = base.slice(0, -2);
  const stems = [stem, stem, stem, stem, stem, stem];

  for (const p of SHAPED) {
    if (tags.includes('e→ie')) stems[p] = replaceLast(stem, 'e', 'ie');
    if (tags.includes('o→ue')) stems[p] = replaceLast(stem, 'o', 'ue');
    if (tags.includes('e→i')) stems[p] = replaceLast(stem, 'e', 'i');
    if (tags.includes('-uir')) stems[p] = `${stem}y`;
    if (tags.includes('í/ú')) stems[p] = stem.replace(/i$/, 'í').replace(/u$/, 'ú');
  }

  const forms = stems.map((s, i) => s + ending[i]);

  if (tags.includes('-go')) {
    // decir is the only e→i verb here whose yo form keeps the changed vowel (digo); tener and venir do not (tengo, vengo).
    const src = tags.includes('e→i') ? stems[0] : stem;
    let yo;
    if (/c$/.test(src)) yo = `${src.slice(0, -1)}g`; // hacer → hag, decir → dig
    else if (/[aeiou]$/.test(src)) yo = `${src}ig`; // traer → traig, caer → caig
    else yo = `${src}g`; // poner → pong, salir → salg
    forms[0] = `${yo}o`;
  }
  if (tags.includes('-zco')) {
    forms[0] = `${stem.replace(/c$/, 'zc')}o`; // conocer → conozco
  }
  if (tags.includes('spelling')) {
    const src = stems[0];
    let yo = src;
    if (/gu$/.test(src)) yo = src.slice(0, -1); // seguir → sig
    else if (/g$/.test(src)) yo = `${src.slice(0, -1)}j`; // escoger → escoj
    forms[0] = `${yo}o`;
  }

  return tags.includes('reflexive') ? forms.map((f, i) => `${PRONOUNS[i]} ${f}`) : forms;
}

module.exports = { conjugate };
```

`tests/rules.test.js` (checks the engine against forms typed by hand here):
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { conjugate } = require('./helpers/rules');

test('regular endings', () => {
  assert.deepEqual(conjugate('hablar', ['regular']), ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']);
  assert.deepEqual(conjugate('comer', ['regular']), ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']);
  assert.deepEqual(conjugate('vivir', ['regular']), ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']);
});

test('stem changes leave nosotros and vosotros alone', () => {
  assert.deepEqual(conjugate('pensar', ['e→ie']), ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']);
  assert.deepEqual(conjugate('poder', ['o→ue']), ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden']);
  assert.deepEqual(conjugate('pedir', ['e→i']), ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden']);
});

test('-go, -zco, spelling, -uir, í/ú', () => {
  assert.deepEqual(conjugate('hacer', ['-go']), ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen']);
  assert.deepEqual(conjugate('tener', ['-go', 'e→ie']), ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']);
  assert.deepEqual(conjugate('traer', ['-go']), ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen']);
  assert.deepEqual(conjugate('conocer', ['-zco']), ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen']);
  assert.deepEqual(conjugate('escoger', ['spelling']), ['escojo', 'escoges', 'escoge', 'escogemos', 'escogéis', 'escogen']);
  assert.deepEqual(conjugate('seguir', ['e→i', 'spelling']), ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen']);
  assert.deepEqual(conjugate('construir', ['-uir']), ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen']);
  assert.deepEqual(conjugate('enviar', ['í/ú']), ['envío', 'envías', 'envía', 'enviamos', 'enviáis', 'envían']);
});

test('reflexive verbs get their pronoun on every form', () => {
  assert.deepEqual(conjugate('acostarse', ['o→ue', 'reflexive']), ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan']);
});
```

- [ ] **Step 2: Run, verify the rule tests pass**

Run: `npm test`
Expected: PASS, 0 failures (rule engine verified against hand-typed forms).

- [ ] **Step 3: Write the hand-typed fixtures**

`tests/fixtures/forms.js`:
```js
'use strict';
// Forms typed by hand, separate from both the data files and the rule engine.
module.exports = {
  // Fully irregular, or irregular enough that the rule engine does not cover them.
  ser: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
  estar: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
  ir: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
  dar: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
  ver: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
  saber: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
  oír: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'],
  jugar: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
  oler: ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen'],
  reír: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'],
  sonreír: ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen'],
  reunirse: ['me reúno', 'te reúnes', 'se reúne', 'nos reunimos', 'os reunís', 'se reúnen'],
  irse: ['me voy', 'te vas', 'se va', 'nos vamos', 'os vais', 'se van'],
  // Spot checks of rule-covered verbs (data must match both the rules and these).
  decir: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
  tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
  seguir: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
  corregir: ['corrijo', 'corriges', 'corrige', 'corregimos', 'corregís', 'corrigen'],
  distinguir: ['distingo', 'distingues', 'distingue', 'distinguimos', 'distinguís', 'distinguen'],
  conducir: ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen'],
  traer: ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen'],
  construir: ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen'],
  continuar: ['continúo', 'continúas', 'continúa', 'continuamos', 'continuáis', 'continúan'],
  acostarse: ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan'],
  pedir: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
};
```

- [ ] **Step 4: Write the failing data tests**

`tests/verbs.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const { conjugate } = require('./helpers/rules');
const FIXTURES = require('./fixtures/forms');

const RULE_TAGS = ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling'];
const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
// Verbs the rule engine does not cover; they are checked against hand-typed fixtures only.
const FIXTURE_ONLY = ['ser', 'estar', 'ir', 'dar', 'ver', 'saber', 'oír', 'jugar', 'oler', 'reír', 'sonreír', 'reunirse', 'irse'];

const byInf = (inf) => D.verbs.find((v) => v.inf === inf);

test('there are verbs', () => {
  assert.ok(D.verbs.length > 0);
});

test('every verb has six trimmed lower-case present forms and a gloss', () => {
  for (const verb of D.verbs) {
    assert.equal(verb.forms.present.length, 6, verb.inf);
    for (const f of verb.forms.present) {
      assert.equal(f, f.trim().toLowerCase(), `${verb.inf}: "${f}"`);
      assert.ok(f.length > 0, verb.inf);
    }
    assert.ok(verb.gloss && verb.gloss.length > 1, `${verb.inf} needs a gloss`);
    assert.ok(verb.tags.some((t) => t !== 'reflexive'), `${verb.inf} needs a tag besides reflexive`);
  }
});

test('infinitives are unique', () => {
  const infs = D.verbs.map((v) => v.inf);
  assert.equal(new Set(infs).size, infs.length);
});

test('reflexive verbs carry the right pronoun on every form, others never start with one', () => {
  for (const verb of D.verbs) {
    verb.forms.present.forEach((f, i) => {
      if (verb.reflexive) assert.ok(f.startsWith(`${PRONOUNS[i]} `), `${verb.inf} form ${i}: ${f}`);
      else assert.ok(!f.includes(' '), `${verb.inf} form ${i}: ${f}`);
    });
  }
});

test('hand-typed fixtures match the data for every fixture verb that exists', () => {
  for (const [inf, forms] of Object.entries(FIXTURES)) {
    const verb = byInf(inf);
    if (verb) assert.deepEqual(verb.forms.present, forms, inf);
  }
});

test('every FIXTURE_ONLY verb that exists has a fixture', () => {
  for (const inf of FIXTURE_ONLY) {
    if (byInf(inf)) assert.ok(FIXTURES[inf], `${inf} needs a fixture`);
  }
});

test('every other verb matches the independent rule engine', () => {
  for (const verb of D.verbs) {
    if (FIXTURE_ONLY.includes(verb.inf)) continue;
    const ruleTags = verb.tags.filter((t) => RULE_TAGS.includes(t));
    assert.ok(ruleTags.length > 0 || verb.tags.includes('regular'), `${verb.inf} has no rule tag and is not regular`);
    assert.deepEqual(verb.forms.present, conjugate(verb.inf, verb.tags), verb.inf);
  }
});

test('regular verbs carry no rule tags', () => {
  for (const verb of D.verbs.filter((v) => v.tags.includes('regular'))) {
    assert.deepEqual(verb.tags.filter((t) => RULE_TAGS.includes(t) || t === 'irregular'), [], verb.inf);
  }
});
```

- [ ] **Step 5: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `there are verbs` (assertion `D.verbs.length > 0`, there is no data yet).

- [ ] **Step 6: Write the irregular / -go / -zco data**

`js/data/verbs-irregular.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // Fully irregular
    v('ser', 'to be (identity, traits)', ['irregular'], ['soy', 'eres', 'es', 'somos', 'sois', 'son']),
    v('estar', 'to be (state, place)', ['irregular'], ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están']),
    v('ir', 'to go', ['irregular'], ['voy', 'vas', 'va', 'vamos', 'vais', 'van']),
    v('dar', 'to give', ['irregular'], ['doy', 'das', 'da', 'damos', 'dais', 'dan']),
    v('ver', 'to see', ['irregular'], ['veo', 'ves', 've', 'vemos', 'veis', 'ven']),
    v('saber', 'to know (facts, how to)', ['irregular'], ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben']),
    v('oír', 'to hear', ['irregular'], ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen']),
    v('decir', 'to say, to tell', ['irregular', 'e→i', '-go'], ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen']),

    // -go in yo
    v('hacer', 'to do, to make', ['-go'], ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen']),
    v('poner', 'to put, to place', ['-go'], ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen']),
    v('salir', 'to leave, to go out', ['-go'], ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen']),
    v('tener', 'to have', ['-go', 'e→ie'], ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']),
    v('venir', 'to come', ['-go', 'e→ie'], ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen']),
    v('traer', 'to bring', ['-go'], ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen']),
    v('caer', 'to fall', ['-go'], ['caigo', 'caes', 'cae', 'caemos', 'caéis', 'caen']),
    v('valer', 'to be worth', ['-go'], ['valgo', 'vales', 'vale', 'valemos', 'valéis', 'valen']),
    v('suponer', 'to suppose', ['-go'], ['supongo', 'supones', 'supone', 'suponemos', 'suponéis', 'suponen']),
    v('mantener', 'to maintain, to keep', ['-go', 'e→ie'], ['mantengo', 'mantienes', 'mantiene', 'mantenemos', 'mantenéis', 'mantienen']),
    v('obtener', 'to obtain', ['-go', 'e→ie'], ['obtengo', 'obtienes', 'obtiene', 'obtenemos', 'obtenéis', 'obtienen']),

    // -zco in yo
    v('conocer', 'to know (people, places)', ['-zco'], ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen']),
    v('parecer', 'to seem', ['-zco'], ['parezco', 'pareces', 'parece', 'parecemos', 'parecéis', 'parecen']),
    v('ofrecer', 'to offer', ['-zco'], ['ofrezco', 'ofreces', 'ofrece', 'ofrecemos', 'ofrecéis', 'ofrecen']),
    v('merecer', 'to deserve', ['-zco'], ['merezco', 'mereces', 'merece', 'merecemos', 'merecéis', 'merecen']),
    v('obedecer', 'to obey', ['-zco'], ['obedezco', 'obedeces', 'obedece', 'obedecemos', 'obedecéis', 'obedecen']),
    v('conducir', 'to drive', ['-zco'], ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen']),
    v('traducir', 'to translate', ['-zco'], ['traduzco', 'traduces', 'traduce', 'traducimos', 'traducís', 'traducen']),
    v('producir', 'to produce', ['-zco'], ['produzco', 'produces', 'produce', 'producimos', 'producís', 'producen']),
    v('reconocer', 'to recognize', ['-zco'], ['reconozco', 'reconoces', 'reconoce', 'reconocemos', 'reconocéis', 'reconocen']),
    v('aparecer', 'to appear', ['-zco'], ['aparezco', 'apareces', 'aparece', 'aparecemos', 'aparecéis', 'aparecen']),
    v('agradecer', 'to thank, to be grateful', ['-zco'], ['agradezco', 'agradeces', 'agradece', 'agradecemos', 'agradecéis', 'agradecen']),
    v('crecer', 'to grow', ['-zco'], ['crezco', 'creces', 'crece', 'crecemos', 'crecéis', 'crecen']),
    v('nacer', 'to be born', ['-zco'], ['nazco', 'naces', 'nace', 'nacemos', 'nacéis', 'nacen']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures (32 verbs checked).

---

### Task 7: Stem-changing verbs (e→ie, o→ue, e→i)

**Files:**
- Create: `js/data/verbs-stem.js`
- Test: `tests/verbs.test.js` (existing, unchanged)

**Interfaces:**
- Consumes: `Drill.v`, `Drill.addVerbs`. Produces 47 verbs. `reír` and `sonreír` carry `['irregular', 'e→i', 'í/ú']` and are checked by fixtures only; `jugar` and `oler` carry `['o→ue']` and are fixture-only.

- [ ] **Step 1: Run the existing tests as the baseline**

Run: `npm test`
Expected: PASS, 68 tests. (The data tests already iterate every verb, so adding data is what exercises them.)

- [ ] **Step 2: Write the data file**

`js/data/verbs-stem.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // e → ie
    v('querer', 'to want, to love', ['e→ie'], ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren']),
    v('pensar', 'to think', ['e→ie'], ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']),
    v('empezar', 'to begin', ['e→ie'], ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan']),
    v('comenzar', 'to begin', ['e→ie'], ['comienzo', 'comienzas', 'comienza', 'comenzamos', 'comenzáis', 'comienzan']),
    v('cerrar', 'to close', ['e→ie'], ['cierro', 'cierras', 'cierra', 'cerramos', 'cerráis', 'cierran']),
    v('entender', 'to understand', ['e→ie'], ['entiendo', 'entiendes', 'entiende', 'entendemos', 'entendéis', 'entienden']),
    v('perder', 'to lose', ['e→ie'], ['pierdo', 'pierdes', 'pierde', 'perdemos', 'perdéis', 'pierden']),
    v('preferir', 'to prefer', ['e→ie'], ['prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren']),
    v('sentir', 'to feel, to regret', ['e→ie'], ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten']),
    v('mentir', 'to lie', ['e→ie'], ['miento', 'mientes', 'miente', 'mentimos', 'mentís', 'mienten']),
    v('sugerir', 'to suggest', ['e→ie'], ['sugiero', 'sugieres', 'sugiere', 'sugerimos', 'sugerís', 'sugieren']),
    v('recomendar', 'to recommend', ['e→ie'], ['recomiendo', 'recomiendas', 'recomienda', 'recomendamos', 'recomendáis', 'recomiendan']),
    v('despertar', 'to wake (someone) up', ['e→ie'], ['despierto', 'despiertas', 'despierta', 'despertamos', 'despertáis', 'despiertan']),
    v('encender', 'to turn on, to light', ['e→ie'], ['enciendo', 'enciendes', 'enciende', 'encendemos', 'encendéis', 'encienden']),
    v('defender', 'to defend', ['e→ie'], ['defiendo', 'defiendes', 'defiende', 'defendemos', 'defendéis', 'defienden']),
    v('negar', 'to deny', ['e→ie'], ['niego', 'niegas', 'niega', 'negamos', 'negáis', 'niegan']),
    v('convertir', 'to convert, to turn into', ['e→ie'], ['convierto', 'conviertes', 'convierte', 'convertimos', 'convertís', 'convierten']),

    // o → ue (jugar is u → ue)
    v('poder', 'to be able to, can', ['o→ue'], ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden']),
    v('dormir', 'to sleep', ['o→ue'], ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']),
    v('volver', 'to return', ['o→ue'], ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven']),
    v('encontrar', 'to find', ['o→ue'], ['encuentro', 'encuentras', 'encuentra', 'encontramos', 'encontráis', 'encuentran']),
    v('almorzar', 'to have lunch', ['o→ue'], ['almuerzo', 'almuerzas', 'almuerza', 'almorzamos', 'almorzáis', 'almuerzan']),
    v('costar', 'to cost', ['o→ue'], ['cuesto', 'cuestas', 'cuesta', 'costamos', 'costáis', 'cuestan']),
    v('mostrar', 'to show', ['o→ue'], ['muestro', 'muestras', 'muestra', 'mostramos', 'mostráis', 'muestran']),
    v('recordar', 'to remember', ['o→ue'], ['recuerdo', 'recuerdas', 'recuerda', 'recordamos', 'recordáis', 'recuerdan']),
    v('contar', 'to count, to tell', ['o→ue'], ['cuento', 'cuentas', 'cuenta', 'contamos', 'contáis', 'cuentan']),
    v('devolver', 'to return (something)', ['o→ue'], ['devuelvo', 'devuelves', 'devuelve', 'devolvemos', 'devolvéis', 'devuelven']),
    v('resolver', 'to resolve, to solve', ['o→ue'], ['resuelvo', 'resuelves', 'resuelve', 'resolvemos', 'resolvéis', 'resuelven']),
    v('mover', 'to move', ['o→ue'], ['muevo', 'mueves', 'mueve', 'movemos', 'movéis', 'mueven']),
    v('probar', 'to try, to taste', ['o→ue'], ['pruebo', 'pruebas', 'prueba', 'probamos', 'probáis', 'prueban']),
    v('morir', 'to die', ['o→ue'], ['muero', 'mueres', 'muere', 'morimos', 'morís', 'mueren']),
    v('doler', 'to hurt, to ache', ['o→ue'], ['duelo', 'dueles', 'duele', 'dolemos', 'doléis', 'duelen']),
    v('oler', 'to smell', ['o→ue'], ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen']),
    v('jugar', 'to play (a game, sport)', ['o→ue'], ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan']),

    // e → i
    v('pedir', 'to ask for, to order', ['e→i'], ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden']),
    v('servir', 'to serve', ['e→i'], ['sirvo', 'sirves', 'sirve', 'servimos', 'servís', 'sirven']),
    v('repetir', 'to repeat', ['e→i'], ['repito', 'repites', 'repite', 'repetimos', 'repetís', 'repiten']),
    v('seguir', 'to follow, to continue', ['e→i', 'spelling'], ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen']),
    v('conseguir', 'to get, to achieve', ['e→i', 'spelling'], ['consigo', 'consigues', 'consigue', 'conseguimos', 'conseguís', 'consiguen']),
    v('vestir', 'to dress', ['e→i'], ['visto', 'vistes', 'viste', 'vestimos', 'vestís', 'visten']),
    v('competir', 'to compete', ['e→i'], ['compito', 'compites', 'compite', 'competimos', 'competís', 'compiten']),
    v('corregir', 'to correct', ['e→i', 'spelling'], ['corrijo', 'corriges', 'corrige', 'corregimos', 'corregís', 'corrigen']),
    v('elegir', 'to choose, to elect', ['e→i', 'spelling'], ['elijo', 'eliges', 'elige', 'elegimos', 'elegís', 'eligen']),
    v('despedir', 'to fire, to see off', ['e→i'], ['despido', 'despides', 'despide', 'despedimos', 'despedís', 'despiden']),
    v('reír', 'to laugh', ['irregular', 'e→i', 'í/ú'], ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen']),
    v('sonreír', 'to smile', ['irregular', 'e→i', 'í/ú'], ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen']),
    v('medir', 'to measure', ['e→i'], ['mido', 'mides', 'mide', 'medimos', 'medís', 'miden']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 3: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures (79 verbs now checked). If a verb fails, the message names the verb and the diff against the rule engine; fix the typo in the data file, not in the test.

---

### Task 8: Spelling, -uir, accent-shift, reflexive, and regular verbs, plus coverage

**Files:**
- Create: `js/data/verbs-spelling.js`, `js/data/verbs-reflexive.js`, `js/data/verbs-regular.js`
- Modify: `tests/verbs.test.js` (append a coverage test)

**Interfaces:**
- Consumes: `Drill.v`, `Drill.addVerbs`. Produces 18 + 18 + 30 verbs, for a total of 145.

- [ ] **Step 1: Add the failing coverage test**

Append to `tests/verbs.test.js`:
```js
test('coverage: at least 140 verbs, at least 70% tricky, every chip has at least 5 verbs', () => {
  assert.ok(D.verbs.length >= 140, `only ${D.verbs.length} verbs`);
  const tricky = D.verbs.filter((v) => !v.tags.includes('regular')).length;
  assert.ok(tricky / D.verbs.length >= 0.7, `tricky share ${tricky}/${D.verbs.length}`);
  for (const tag of D.TAGS) {
    const n = D.verbs.filter((v) => v.tags.includes(tag)).length;
    assert.ok(n >= 5, `${tag} has only ${n} verbs`);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL on the coverage test with `only 79 verbs`.

- [ ] **Step 3: Write the spelling / -uir / accent data**

`js/data/verbs-spelling.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // Spelling change in yo (g → j, gu → g)
    v('escoger', 'to choose', ['spelling'], ['escojo', 'escoges', 'escoge', 'escogemos', 'escogéis', 'escogen']),
    v('recoger', 'to pick up, to gather', ['spelling'], ['recojo', 'recoges', 'recoge', 'recogemos', 'recogéis', 'recogen']),
    v('proteger', 'to protect', ['spelling'], ['protejo', 'proteges', 'protege', 'protegemos', 'protegéis', 'protegen']),
    v('dirigir', 'to direct', ['spelling'], ['dirijo', 'diriges', 'dirige', 'dirigimos', 'dirigís', 'dirigen']),
    v('exigir', 'to demand', ['spelling'], ['exijo', 'exiges', 'exige', 'exigimos', 'exigís', 'exigen']),
    v('distinguir', 'to distinguish', ['spelling'], ['distingo', 'distingues', 'distingue', 'distinguimos', 'distinguís', 'distinguen']),

    // -uir adds y
    v('construir', 'to build', ['-uir'], ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen']),
    v('destruir', 'to destroy', ['-uir'], ['destruyo', 'destruyes', 'destruye', 'destruimos', 'destruís', 'destruyen']),
    v('incluir', 'to include', ['-uir'], ['incluyo', 'incluyes', 'incluye', 'incluimos', 'incluís', 'incluyen']),
    v('contribuir', 'to contribute', ['-uir'], ['contribuyo', 'contribuyes', 'contribuye', 'contribuimos', 'contribuís', 'contribuyen']),
    v('sustituir', 'to substitute', ['-uir'], ['sustituyo', 'sustituyes', 'sustituye', 'sustituimos', 'sustituís', 'sustituyen']),
    v('distribuir', 'to distribute', ['-uir'], ['distribuyo', 'distribuyes', 'distribuye', 'distribuimos', 'distribuís', 'distribuyen']),

    // Accent shift (í / ú)
    v('enviar', 'to send', ['í/ú'], ['envío', 'envías', 'envía', 'enviamos', 'enviáis', 'envían']),
    v('esquiar', 'to ski', ['í/ú'], ['esquío', 'esquías', 'esquía', 'esquiamos', 'esquiáis', 'esquían']),
    v('continuar', 'to continue', ['í/ú'], ['continúo', 'continúas', 'continúa', 'continuamos', 'continuáis', 'continúan']),
    v('actuar', 'to act', ['í/ú'], ['actúo', 'actúas', 'actúa', 'actuamos', 'actuáis', 'actúan']),
    v('graduar', 'to grade, to graduate', ['í/ú'], ['gradúo', 'gradúas', 'gradúa', 'graduamos', 'graduáis', 'gradúan']),
    v('confiar', 'to trust', ['í/ú'], ['confío', 'confías', 'confía', 'confiamos', 'confiáis', 'confían']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Write the reflexive data**

`js/data/verbs-reflexive.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  // The "reflexive" tag is added automatically for infinitives ending in -se.
  D.addVerbs([
    v('levantarse', 'to get up', ['regular'], ['me levanto', 'te levantas', 'se levanta', 'nos levantamos', 'os levantáis', 'se levantan']),
    v('acostarse', 'to go to bed', ['o→ue'], ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan']),
    v('despertarse', 'to wake up', ['e→ie'], ['me despierto', 'te despiertas', 'se despierta', 'nos despertamos', 'os despertáis', 'se despiertan']),
    v('vestirse', 'to get dressed', ['e→i'], ['me visto', 'te vistes', 'se viste', 'nos vestimos', 'os vestís', 'se visten']),
    v('sentirse', 'to feel', ['e→ie'], ['me siento', 'te sientes', 'se siente', 'nos sentimos', 'os sentís', 'se sienten']),
    v('divertirse', 'to have fun', ['e→ie'], ['me divierto', 'te diviertes', 'se divierte', 'nos divertimos', 'os divertís', 'se divierten']),
    v('ducharse', 'to take a shower', ['regular'], ['me ducho', 'te duchas', 'se ducha', 'nos duchamos', 'os ducháis', 'se duchan']),
    v('lavarse', 'to wash oneself', ['regular'], ['me lavo', 'te lavas', 'se lava', 'nos lavamos', 'os laváis', 'se lavan']),
    v('ponerse', 'to put on, to become', ['-go'], ['me pongo', 'te pones', 'se pone', 'nos ponemos', 'os ponéis', 'se ponen']),
    v('quitarse', 'to take off', ['regular'], ['me quito', 'te quitas', 'se quita', 'nos quitamos', 'os quitáis', 'se quitan']),
    v('peinarse', 'to comb one\'s hair', ['regular'], ['me peino', 'te peinas', 'se peina', 'nos peinamos', 'os peináis', 'se peinan']),
    v('cepillarse', 'to brush', ['regular'], ['me cepillo', 'te cepillas', 'se cepilla', 'nos cepillamos', 'os cepilláis', 'se cepillan']),
    v('bañarse', 'to take a bath', ['regular'], ['me baño', 'te bañas', 'se baña', 'nos bañamos', 'os bañáis', 'se bañan']),
    v('llamarse', 'to be called', ['regular'], ['me llamo', 'te llamas', 'se llama', 'nos llamamos', 'os llamáis', 'se llaman']),
    v('irse', 'to go away, to leave', ['irregular'], ['me voy', 'te vas', 'se va', 'nos vamos', 'os vais', 'se van']),
    v('sentarse', 'to sit down', ['e→ie'], ['me siento', 'te sientas', 'se sienta', 'nos sentamos', 'os sentáis', 'se sientan']),
    v('dormirse', 'to fall asleep', ['o→ue'], ['me duermo', 'te duermes', 'se duerme', 'nos dormimos', 'os dormís', 'se duermen']),
    v('reunirse', 'to meet, to get together', ['í/ú'], ['me reúno', 'te reúnes', 'se reúne', 'nos reunimos', 'os reunís', 'se reúnen']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 5: Write the regular data**

`js/data/verbs-regular.js`:
```js
(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // -ar
    v('hablar', 'to speak', ['regular'], ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']),
    v('bailar', 'to dance', ['regular'], ['bailo', 'bailas', 'baila', 'bailamos', 'bailáis', 'bailan']),
    v('trabajar', 'to work', ['regular'], ['trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajáis', 'trabajan']),
    v('estudiar', 'to study', ['regular'], ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian']),
    v('comprar', 'to buy', ['regular'], ['compro', 'compras', 'compra', 'compramos', 'compráis', 'compran']),
    v('necesitar', 'to need', ['regular'], ['necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitáis', 'necesitan']),
    v('escuchar', 'to listen', ['regular'], ['escucho', 'escuchas', 'escucha', 'escuchamos', 'escucháis', 'escuchan']),
    v('nadar', 'to swim', ['regular'], ['nado', 'nadas', 'nada', 'nadamos', 'nadáis', 'nadan']),
    v('practicar', 'to practice', ['regular'], ['practico', 'practicas', 'practica', 'practicamos', 'practicáis', 'practican']),
    v('llegar', 'to arrive', ['regular'], ['llego', 'llegas', 'llega', 'llegamos', 'llegáis', 'llegan']),
    v('buscar', 'to look for', ['regular'], ['busco', 'buscas', 'busca', 'buscamos', 'buscáis', 'buscan']),
    v('cocinar', 'to cook', ['regular'], ['cocino', 'cocinas', 'cocina', 'cocinamos', 'cocináis', 'cocinan']),
    v('limpiar', 'to clean', ['regular'], ['limpio', 'limpias', 'limpia', 'limpiamos', 'limpiáis', 'limpian']),
    v('viajar', 'to travel', ['regular'], ['viajo', 'viajas', 'viaja', 'viajamos', 'viajáis', 'viajan']),

    // -er
    v('comer', 'to eat', ['regular'], ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']),
    v('beber', 'to drink', ['regular'], ['bebo', 'bebes', 'bebe', 'bebemos', 'bebéis', 'beben']),
    v('correr', 'to run', ['regular'], ['corro', 'corres', 'corre', 'corremos', 'corréis', 'corren']),
    v('aprender', 'to learn', ['regular'], ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden']),
    v('leer', 'to read', ['regular'], ['leo', 'lees', 'lee', 'leemos', 'leéis', 'leen']),
    v('creer', 'to believe', ['regular'], ['creo', 'crees', 'cree', 'creemos', 'creéis', 'creen']),
    v('vender', 'to sell', ['regular'], ['vendo', 'vendes', 'vende', 'vendemos', 'vendéis', 'venden']),
    v('deber', 'should, ought to', ['regular'], ['debo', 'debes', 'debe', 'debemos', 'debéis', 'deben']),

    // -ir
    v('vivir', 'to live', ['regular'], ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']),
    v('escribir', 'to write', ['regular'], ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben']),
    v('abrir', 'to open', ['regular'], ['abro', 'abres', 'abre', 'abrimos', 'abrís', 'abren']),
    v('recibir', 'to receive', ['regular'], ['recibo', 'recibes', 'recibe', 'recibimos', 'recibís', 'reciben']),
    v('compartir', 'to share', ['regular'], ['comparto', 'compartes', 'comparte', 'compartimos', 'compartís', 'comparten']),
    v('asistir', 'to attend', ['regular'], ['asisto', 'asistes', 'asiste', 'asistimos', 'asistís', 'asisten']),
    v('subir', 'to go up, to climb', ['regular'], ['subo', 'subes', 'sube', 'subimos', 'subís', 'suben']),
    v('decidir', 'to decide', ['regular'], ['decido', 'decides', 'decide', 'decidimos', 'decidís', 'deciden']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 0 failures. Verb count printed by the coverage test passes at 145 (32 + 47 + 18 + 18 + 30). If any verb fails against the rule engine, fix the data typo.

---

### Task 9: Page shell, tokens, and styles

**Files:**
- Create: `index.html`, `css/tokens.css`, `css/app.css`, `.claude/launch.json`
- Test: `tests/page.test.js`, `tests/contrast.test.js`

**Interfaces:**
- Produces element ids used by `js/ui/app.js` (Task 10): `chips`, `vos`, `tenses`, `stage` (with `data-mode`), `verb`, `gloss`, `person`, `form`, `input`, `submit` (with `data-mark`), `keys`, `plate`, `own`, `right`, `bars`, `acc`, `live`. Produces CSS custom properties `--verb-scale` and `--right-scale` set from JS.

- [ ] **Step 1: Write the failing page tests**

`tests/page.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const load = require('./helpers/load');

const html = fs.readFileSync(path.join(load.ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(load.ROOT, 'css/app.css'), 'utf8');
const tokens = fs.readFileSync(path.join(load.ROOT, 'css/tokens.css'), 'utf8');

test('index.html loads scripts in the same order as the test loader, then the UI', () => {
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(srcs, [...load.SCRIPT_ORDER, load.UI_SCRIPT]);
});

test('every script in the order list exists', () => {
  for (const rel of load.SCRIPT_ORDER) assert.ok(fs.existsSync(path.join(load.ROOT, rel)), rel);
});

test('no ES modules (they fail on file://)', () => {
  assert.ok(!/type="module"/.test(html));
  for (const rel of [...load.SCRIPT_ORDER]) {
    const src = fs.readFileSync(path.join(load.ROOT, rel), 'utf8');
    assert.ok(!/^\s*(import|export)\s/m.test(src), `${rel} uses import/export`);
  }
});

test('all ids the UI needs exist in the page', () => {
  for (const id of ['chips', 'vos', 'tenses', 'stage', 'verb', 'gloss', 'person', 'form', 'input', 'submit', 'keys', 'plate', 'own', 'right', 'bars', 'acc', 'live']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
});

test('the page has no visible prose: only the vosotros chip text is hard-coded', () => {
  const body = html.slice(html.indexOf('<body>'), html.indexOf('<script'));
  const text = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(text, 'vosotros');
});

test('app.css uses no raw colours and no italics', () => {
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(css), 'hex colour in app.css');
  assert.ok(!/oklch\(|rgb\(|hsl\(/i.test(css), 'raw colour function in app.css');
  assert.ok(!/font-style:\s*italic/i.test(css + tokens));
  assert.ok(!/font-family:\s*["']/i.test(css), 'font-family must be a token');
});

test('app.css only transitions transform and opacity-class properties and honours reduced motion', () => {
  assert.ok(/prefers-reduced-motion:\s*reduce/.test(css));
  assert.ok(!/transition:[^;]*\b(width|height|top|left|margin|padding)\b/.test(css));
});
```

`tests/contrast.test.js`:
```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers/load');

const tokens = fs.readFileSync(path.join(ROOT, 'css/tokens.css'), 'utf8');

function token(name) {
  const m = tokens.match(new RegExp(`--${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)\\)`));
  assert.ok(m, `token --${name} must be an oklch() value`);
  return { L: Number(m[1]) / 100, C: Number(m[2]), h: Number(m[3]) };
}

function luminance({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (x) => Math.min(1, Math.max(0, x));
  const r = clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function ratio(fg, bg) {
  const a = luminance(token(fg));
  const b = luminance(token(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('ink on paper is at least 7:1', () => assert.ok(ratio('color-ink', 'color-paper') >= 7));
test('muted label text on paper is at least 4.5:1', () => assert.ok(ratio('color-muted', 'color-paper') >= 4.5));
test('text on the accent plate is at least 4.5:1', () => assert.ok(ratio('color-accent-ink', 'color-accent') >= 4.5));
test('accent against paper is at least 3:1 for UI boundaries', () => assert.ok(ratio('color-accent', 'color-paper') >= 3));
test('paper text on ink (correct state) is at least 7:1', () => assert.ok(ratio('color-paper', 'color-ink') >= 7));
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test`
Expected: FAIL with `ENOENT: no such file or directory, open '.../index.html'`.

- [ ] **Step 3: Write the tokens**

`css/tokens.css`:
```css
/* Hallmark · Grid theme tokens. Every colour, font, space, ease and duration used by app.css lives here. */
:root {
  /* paper band: light · display: grotesk-heavy · accent hue: signal red (warm) */
  --color-paper: oklch(99% 0.003 255);
  --color-paper-2: oklch(97.2% 0.003 255);
  --color-paper-3: oklch(94.5% 0.004 255);
  --color-rule: oklch(88% 0.006 255);
  --color-neutral: oklch(60% 0.010 255);
  --color-muted: oklch(42% 0.012 255);
  --color-ink: oklch(16% 0.010 255);
  --color-accent: oklch(55% 0.21 28);
  --color-accent-ink: oklch(99% 0.003 255);
  --color-focus: var(--color-accent);
  --color-on-accent-rule: color-mix(in oklab, var(--color-accent-ink) 16%, transparent);

  --font-display: "Archivo", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-body: var(--font-display);
  --display-weight: 800;
  --tracking-display: -0.045em;

  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 72px;

  --text-label: 12px;
  --text-body: 16px;
  --text-input: 28px;
  --text-person: clamp(20px, 3.2vw, 32px);
  --text-display: clamp(52px, 18vw, 136px);

  --radius-card: 0;
  --rule-hair: 1px;
  --rule-ink: 2px;

  --shell-max: 1280px;
  --gutter: 16px;
  --grid-cols: 12;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.64, 0, 0.78, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 120ms;
  --dur-base: 180ms;
  --dur-slow: 240ms;
}

@media (max-width: 700px) {
  :root {
    --grid-cols: 6;
  }
}
```

- [ ] **Step 4: Write the page**

`index.html`:
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="color-scheme" content="light">
  <title>conjugar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <div class="rails" aria-hidden="true"></div>
  <main class="shell">
    <header class="top">
      <button class="chip chip-vos" id="vos" type="button" aria-pressed="true">vosotros</button>
      <div class="chips" id="chips" role="group" aria-label="filtros"></div>
      <div class="chips" id="tenses" role="group" aria-label="tiempo" hidden></div>
    </header>

    <section class="stage" id="stage" data-mode="asking">
      <button class="verb" id="verb" type="button" aria-expanded="false" aria-controls="gloss"></button>
      <p class="label gloss" id="gloss" hidden></p>
      <p class="person" id="person"></p>

      <form class="answer" id="form" autocomplete="off" novalidate>
        <div class="answer-row">
          <input class="answer-input" id="input" type="text" inputmode="text" enterkeyhint="go"
                 autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false"
                 lang="es" aria-label="forma conjugada">
          <button class="submit" id="submit" type="submit" aria-label="comprobar" data-mark="arrow"></button>
        </div>
      </form>

      <div class="keys" id="keys"></div>

      <button class="plate" id="plate" type="button" aria-label="siguiente" tabindex="-1">
        <span class="plate-inner">
          <span class="label own" id="own"></span>
          <span class="right" id="right"></span>
          <span class="plate-go" aria-hidden="true"></span>
        </span>
      </button>
    </section>

    <footer class="meter">
      <div class="bars" id="bars" aria-hidden="true"></div>
      <output class="acc" id="acc" hidden></output>
    </footer>
  </main>
  <p class="sr" id="live" role="status" aria-live="polite"></p>

  <script src="js/core/normalize.js"></script>
  <script src="js/core/tenses.js"></script>
  <script src="js/core/store.js"></script>
  <script src="js/core/scheduler.js"></script>
  <script src="js/core/session.js"></script>
  <script src="js/data/verb.js"></script>
  <script src="js/tenses/present.js"></script>
  <script src="js/data/verbs-irregular.js"></script>
  <script src="js/data/verbs-stem.js"></script>
  <script src="js/data/verbs-spelling.js"></script>
  <script src="js/data/verbs-reflexive.js"></script>
  <script src="js/data/verbs-regular.js"></script>
  <script src="js/ui/app.js"></script>
</body>
</html>
```

- [ ] **Step 5: Write the styles**

`css/app.css`:
```css
/* Hallmark · genre: editorial · macrostructure: Marquee Hero · theme: Grid (signal red) · enrichment: none · nav: none · footer: none
 * tone: austere · brief: single-screen present-tense conjugation drill, no visible prose */

*, *::before, *::after { box-sizing: border-box; }

html, body { margin: 0; overflow-x: clip; }
html { color-scheme: light; -webkit-text-size-adjust: 100%; }

body {
  min-height: 100dvh;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.5;
}

button, input { font: inherit; color: inherit; border-radius: var(--radius-card); }
button { cursor: pointer; touch-action: manipulation; }

::selection { background: var(--color-accent); color: var(--color-accent-ink); }

:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }

.sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* The exposed column grid is the ground. */
.rails {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  max-width: var(--shell-max); margin-inline: auto;
  background-image: repeating-linear-gradient(
    to right,
    var(--color-rule) 0, var(--color-rule) 1px,
    transparent 1px, transparent calc(100% / var(--grid-cols))
  );
}

.shell {
  position: relative; z-index: 1;
  display: grid; grid-template-rows: auto 1fr auto;
  min-height: 100dvh; max-width: var(--shell-max); margin-inline: auto;
}

/* Top rail: vosotros toggle, filter chips */
.top {
  display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-xs);
  padding: var(--space-md) var(--gutter);
  border-bottom: var(--rule-ink) solid var(--color-ink);
}
.chips { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
.chips[hidden] { display: none; }

.chip {
  min-height: 44px; padding: 0 var(--space-sm);
  border: var(--rule-hair) solid var(--color-ink);
  background: transparent;
  font-size: var(--text-label); font-weight: 600; letter-spacing: 0.02em; line-height: 1;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.chip:hover { background: var(--color-paper-3); }
.chip:active { transform: translateY(1px); }
.chip[aria-pressed="true"] { background: var(--color-ink); color: var(--color-paper); }
.chip[aria-pressed="true"]:hover { background: var(--color-ink); }
.chip-vos { margin-inline-end: var(--space-sm); }

/* Stage: the verb is the hero */
.stage {
  position: relative;
  display: grid; grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr));
  align-content: center; row-gap: var(--space-sm);
  padding-block: var(--space-2xl);
}
.stage > * { grid-column: 1 / -1; min-width: 0; padding-inline: var(--gutter); }

.label {
  margin: 0;
  font-size: var(--text-label); font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
  color: var(--color-muted);
}

.verb {
  justify-self: start; padding-block: 0; border: 0; background: none; text-align: left;
  font-family: var(--font-display); font-weight: var(--display-weight); font-style: normal;
  font-size: calc(var(--text-display) * var(--verb-scale, 1));
  letter-spacing: var(--tracking-display); line-height: 0.9; text-transform: lowercase;
  overflow-wrap: anywhere;
}
.verb::after {
  content: ""; display: inline-block; width: 0.16em; height: 0.16em; margin-left: 0.05em;
  background: var(--color-accent);
}

.person {
  margin: 0;
  font-size: var(--text-person); font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase;
}

/* Answer row */
.answer { grid-column: 1 / span 8; margin: 0; }
.answer-row {
  display: flex;
  border: var(--rule-ink) solid var(--color-ink); background: var(--color-paper);
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.answer-row:focus-within { outline: 3px solid var(--color-focus); outline-offset: 2px; }
.answer-input {
  flex: 1; min-width: 0; height: 64px; padding: 0 var(--space-md);
  border: 0; background: transparent; outline: none;
  font-size: var(--text-input); font-weight: 600;
}
.submit {
  flex: none; display: grid; place-items: center; width: 64px;
  border: 0; border-left: var(--rule-ink) solid var(--color-ink);
  background: var(--color-ink); color: var(--color-paper);
}
.submit::before {
  content: ""; width: 14px; height: 14px;
  border-top: 3px solid currentColor; border-right: 3px solid currentColor;
  transform: translateX(-3px) rotate(45deg);
}
.submit:hover { background: var(--color-accent); }
.submit:active { transform: translateY(1px); }
.submit[data-mark="tick"]::before {
  width: 12px; height: 22px; border-top: 0;
  border-bottom: 3px solid currentColor;
  transform: translateY(-3px) rotate(45deg);
}

.stage[data-mode="correct"] .answer-row { background: var(--color-ink); color: var(--color-paper); }
.stage[data-mode="correct"] .submit { background: var(--color-paper); color: var(--color-ink); border-left-color: var(--color-paper); }

/* Accent keys */
.keys { grid-column: 1 / span 8; display: flex; gap: var(--space-2xs); }
.key {
  flex: 1 1 0; min-width: 0; min-height: 48px; padding: 0;
  border: var(--rule-hair) solid var(--color-ink); background: transparent;
  font-size: 20px; font-weight: 600;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.key:hover { background: var(--color-paper-3); }
.key:active { background: var(--color-ink); color: var(--color-paper); }

/* Wrong answer: the one poster moment. Full-bleed plate over the stage. */
.plate {
  position: absolute; inset-block: 0; inset-inline: calc(50% - 50vw); z-index: 2;
  display: grid; align-content: center; padding: 0; border: 0; text-align: left;
  background: var(--color-accent); color: var(--color-accent-ink);
  overflow: clip;
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-out), visibility 0s linear var(--dur-fast);
}
.stage[data-mode="wrong"] .plate {
  opacity: 1; visibility: visible; pointer-events: auto; transition-delay: 0s;
}
.plate::before {
  content: ""; position: absolute; inset: 0; max-width: var(--shell-max); margin-inline: auto; pointer-events: none;
  background-image: repeating-linear-gradient(
    to right,
    var(--color-on-accent-rule) 0, var(--color-on-accent-rule) 1px,
    transparent 1px, transparent calc(100% / var(--grid-cols))
  );
}
.plate::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(
    to top right,
    transparent calc(50% - 1.5px),
    var(--color-on-accent-rule) calc(50% - 1.5px), var(--color-on-accent-rule) calc(50% + 1.5px),
    transparent calc(50% + 1.5px)
  );
}
.plate:focus-visible { outline-color: var(--color-accent-ink); outline-offset: -6px; }
.plate-inner {
  position: relative; z-index: 1; display: grid; gap: var(--space-sm);
  width: 100%; max-width: var(--shell-max); margin-inline: auto;
  padding: var(--space-xl) var(--gutter);
}
.plate .label { color: var(--color-accent-ink); }
.own { min-height: 1em; text-decoration: line-through; text-decoration-thickness: 2px; }
.right {
  font-family: var(--font-display); font-weight: var(--display-weight); font-style: normal;
  font-size: calc(var(--text-display) * var(--right-scale, 1));
  letter-spacing: var(--tracking-display); line-height: 0.95;
  overflow-wrap: anywhere; white-space: pre-wrap;
}
.right .miss { box-shadow: inset 0 -0.09em 0 var(--color-accent-ink); }
.plate-go {
  justify-self: end; width: 40px; height: 40px; display: grid; place-items: center;
}
.plate-go::before {
  content: ""; width: 16px; height: 16px;
  border-top: 4px solid currentColor; border-right: 4px solid currentColor;
  transform: translateX(-4px) rotate(45deg);
}

/* Meter: last ten results as a ruled figure, accuracy as digits */
.meter {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md) var(--gutter);
  border-top: var(--rule-hair) solid var(--color-ink);
}
.bars { flex: 1; max-width: 360px; display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: var(--space-2xs); }
.bar { height: 14px; border: var(--rule-hair) solid var(--color-ink); }
.bar[data-state="ok"] { background: var(--color-ink); }
.bar[data-state="no"] { background: var(--color-accent); border-color: var(--color-accent); }
.acc {
  min-width: 3ch; text-align: right; line-height: 1;
  font-size: 28px; font-weight: 800; letter-spacing: var(--tracking-display); font-variant-numeric: tabular-nums;
}
.acc::after { content: "%"; font-size: 14px; letter-spacing: 0; margin-left: 2px; }
.acc[hidden] { display: none; }

@media (max-width: 700px) {
  .answer, .keys { grid-column: 1 / -1; }
  .stage { padding-block: var(--space-xl); }
}

@media (max-height: 560px) {
  .stage { padding-block: var(--space-md); row-gap: var(--space-xs); }
  .answer-input { height: 52px; }
  .submit { width: 52px; }
  .top { padding-block: var(--space-xs); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation: none !important; }
}
```

- [ ] **Step 6: Add the static server config**

`.claude/launch.json`:
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "drill",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "4173"],
      "port": 4173
    }
  ]
}
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: PASS, 0 failures. `every script in the order list exists` checks `SCRIPT_ORDER` only (not the UI file, which Task 10 adds), and the first page test passes because the HTML lists exactly `[...SCRIPT_ORDER, UI_SCRIPT]`.

---

### Task 10: UI behaviour

**Files:**
- Create: `js/ui/app.js`

**Interfaces:**
- Consumes: `Drill.createSession`, `Drill.store`, `Drill.verbs`, `Drill.tenses`, `Drill.TAGS`, `Drill.normalize.norm`; the element ids from Task 9.
- Produces: the running app. States via `#stage[data-mode]`: `asking`, `correct`, `wrong`. `#submit[data-mark]`: `arrow` or `tick`.

- [ ] **Step 1: Write the UI**

`js/ui/app.js`:
```js
(function () {
  'use strict';
  const D = window.Drill;
  const $ = (id) => document.getElementById(id);

  const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
  const CORRECT_DELAY_MS = 600;

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

  // Long infinitives and long answers (nos divertimos) shrink so they never overflow.
  const verbScale = (n) => (n <= 7 ? 1 : n <= 9 ? 0.84 : n <= 11 ? 0.7 : 0.58);
  const answerScale = (n) => (n <= 8 ? 1 : n <= 11 ? 0.8 : n <= 15 ? 0.6 : 0.48);

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
      b.addEventListener('click', () => {
        session.toggleChip(tag);
        b.setAttribute('aria-pressed', String(session.settings().chips.includes(tag)));
        nextPrompt(false);
      });
      el.chips.appendChild(b);
    }
  }

  function buildVosotros() {
    const sync = () => el.vos.setAttribute('aria-pressed', String(session.settings().vosotros));
    sync();
    el.vos.addEventListener('click', () => {
      session.setVosotros(!session.settings().vosotros);
      sync();
      nextPrompt(false);
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
      b.addEventListener('click', () => {
        session.setTense(t.id);
        sync();
        nextPrompt(false);
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
    announce(`incorrecto: ${res.expected}`);
  }

  function onSubmit() {
    if (!prompt) return;
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
      onSubmit();
    }
  });
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmit();
  });
  el.plate.addEventListener('click', () => nextPrompt(true));
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
```

- [ ] **Step 2: Run the automated tests**

Run: `npm test`
Expected: PASS, 0 failures (the UI file adds no Node tests; it is exercised in Task 11).

---

### Task 11: Browser verification and fixes

**Files:**
- Modify: whichever of `css/app.css` or `js/ui/app.js` the checks show needs fixing.

**Interfaces:** none new.

- [ ] **Step 1: Start the server and open the page**

Use `preview_start` with name `drill`, then navigate to `http://localhost:4173/`. Take a screenshot at desktop width.
Expected: giant lowercase verb with a red square after it, the pronoun in caps under it, an input with a dark arrow button, seven accent keys, the chip row at the top (`vosotros` first), the ten-cell meter at the bottom with no digits. No console errors (`read_console_messages` with `onlyErrors: true` returns nothing).

- [ ] **Step 2: Exercise correct, wrong, accent-only, and gloss**

Run through `javascript_tool` (the prompt is random, so each check reads the current prompt and looks up its expected form):
```js
const input = document.getElementById('input');
const stage = document.getElementById('stage');
const press = () => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
const expectedNow = () => {
  const verb = Drill.verbs.find((v) => v.inf === document.getElementById('verb').textContent);
  const label = document.getElementById('person').textContent.toLowerCase();
  const i = Drill.tenses.get('present').persons.findIndex((p) => p.toLowerCase() === label);
  return verb.forms.present[i];
};
input.value = expectedNow();
press();
// stage.dataset.mode should be 'correct' now; after ~700ms it should be 'asking' with an empty input
```
Then: type `zzz`, `press()`, assert `stage.dataset.mode === 'wrong'`, the plate is visible (`getComputedStyle(document.getElementById('plate')).visibility === 'visible'`), and `#right` text equals `expectedNow()` taken before the press; `press()` again and assert the mode is `asking`.
Then: wait for a prompt whose expected form contains an accent (loop `press()`/answer until one appears, or select the `í/ú` chip), answer without the accent, and assert the mode is `wrong` and exactly the accent letter's span has class `miss`.
Then: click `#verb`, assert `#gloss` is no longer hidden and shows English; click again, assert hidden.
Expected: every assertion holds. Screenshot the wrong plate at 375 and at desktop width.

- [ ] **Step 3: Pin Review Focus 5 (Enter pressed twice quickly)**

Run through `javascript_tool`, starting from an `asking` prompt:
```js
const before = JSON.stringify(Drill.store.state().items);
input.value = Drill.verbs.find((v) => v.inf === document.getElementById('verb').textContent).forms.present[0];
press(); press();            // two Enters in the same tick
const items = Drill.store.state().items;
const seen = Object.values(items).reduce((n, e) => n + e.seen, 0);
```
Expected: total `seen` increased by exactly 1 compared with before, and `stage.dataset.mode === 'asking'` after the second press (the second Enter advanced; it did not re-record). Also hold Enter by dispatching 10 keydowns in a loop and assert `seen` increases by at most 5 (every second press records) and no exception is logged.

- [ ] **Step 4: Filters, vosotros, persistence**

Click the `e→ie` chip; over 30 `nextPrompt` cycles (answer correctly each time) assert every verb shown has tag `e→ie`. Click `vosotros` off; assert no prompt shows the label `VOSOTROS` over 60 cycles. Reload the page; assert the chip and vosotros states are restored (they come from `conjugacion.v1`) and the progress digits reset (session-only).
Expected: all hold.

- [ ] **Step 5: Responsive pass at 320, 375, 414, 768, desktop**

For each width, call `resize_window` (`preset: 'mobile'` for 375; custom `width`/`height` for 320×568, 414×896, 768×1024, 1280×800), reload, take a screenshot, and run:
```js
({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth, verbW: document.getElementById('verb').scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth })
```
Also load the longest infinitive (`despertarse`) and the longest answer (`nos divertimos`) by calling `Drill` internals is not possible, so force them by temporarily setting `#verb` text and `--verb-scale` through the same formula, and confirm nothing overflows or wraps a clickable label onto two lines (check `getBoundingClientRect().height` of each `.chip` equals 44).
Expected: `overflow` is false at every width; chip heights are 44; at 320×568 the stage, input, keys, and meter all fit on one screen without page scroll (`document.documentElement.scrollHeight <= innerHeight`). If the chip rows push the stage off-screen at 568px tall, reduce `.top` padding in the `max-height` media query and re-check. Reset the viewport with `resize_window({ preset: 'desktop' })` at the end.

- [ ] **Step 6: Fix anything found and re-run**

Apply fixes in `css/app.css` or `js/ui/app.js`, reload, repeat the failed check, then run `npm test`.
Expected: PASS, 0 failures.

---

### Task 12: Hallmark gates, impeccable-lite passes, final verification

**Files:**
- Modify: `css/app.css` (stamp line only), as needed for fixes
- Create: `.hallmark/log.json`

**Interfaces:** none new.

- [ ] **Step 1: Run Hallmark's slop test**

Load `~/.claude/skills/hallmark/references/slop-test.md` and `anti-patterns.md`, run the 58 gates against `index.html`, `css/tokens.css`, and `css/app.css` using the Grid theme and editorial genre overrides, and fix any failing gate. State the pre-emit critique scores (Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety, each 1 to 5; revise anything under 3).
Expected: 58 of 58 pass, or each failure fixed and re-checked.

- [ ] **Step 2: Stamp the critique and write project memory**

Add a second line to the stamp comment at the top of `css/app.css`: ` * pre-emit critique: P<n> H<n> E<n> S<n> R<n> V<n>` with the scores from Step 1.
Create `.hallmark/log.json`:
```json
[
  {
    "date": "2026-10-15",
    "macrostructure": "Marquee Hero",
    "theme": "Grid",
    "enrichment": "none",
    "brief": "Single-screen present-tense Spanish conjugation drill, no visible prose"
  }
]
```

- [ ] **Step 3: impeccable-lite `harden`**

Load the `impeccable-lite` skill and apply `harden` to the running page. Check, in the browser, each of: storage blocked (run `Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } })` before the scripts load, by evaluating in a fresh page via a snippet that overrides it, then confirm the drill still runs); a 30-character answer typed into the input (no layout break); pasting an answer with a trailing newline; rapid chip toggling while an answer is on the plate; vosotros toggled off while a vosotros prompt is showing; every chip selected at once (pool is the union, still non-empty); and the single-verb pool case (select only `-uir` and `spelling` with vosotros off).
Expected: no exceptions in the console, no stuck state, the stage is always in one of `asking`, `correct`, `wrong`. Fix whatever breaks and add a Node test if the bug was in `js/core`.

- [ ] **Step 4: impeccable-lite `adapt`**

On a touch viewport (`resize_window({ preset: 'mobile' })`): confirm accent keys do not blur the input (after `pointerdown` on a key, `document.activeElement` is still `#input`), keys insert at the caret in the middle of a word, `enterkeyhint="go"` is present, the 7 keys fit one row at 320px (each at least 36px wide, 48px tall), and chip targets are 44px tall. Confirm landscape phone height (667×375) still shows the input and keys (the `max-height: 560px` rules).
Expected: all hold; fix CSS if not.

- [ ] **Step 5: impeccable-lite `clarify`**

The page has no visible copy by design, so check the hidden copy only: `aria-label` values and the live-region messages are Spanish and unambiguous, the `title` is `conjugar`, and the tab order is vosotros, chips, verb, input, submit, keys. Walk the whole drill using the keyboard alone (Tab, Enter, Space) and confirm every control is reachable and has a visible focus ring.
Expected: all hold. `onboard` and `optimize` are skipped on purpose: the brief forbids first-run text, and the app is a few small static files with no network dependency besides the font.

- [ ] **Step 6: Final verification**

Run: `npm test`
Expected: PASS, all tests, 0 failures.
Then in the browser, run a 20-question session at 375 and at desktop width, and report to the user: the number of tests passing, the verb count (145) and tricky share, the widths checked, the Hallmark gate result, and which impeccable-lite commands ran. Also tell the user how to open it (`open index.html`), that fonts need a connection on first load but fall back offline, that there is no git repo (offer `git init`), and give them the verb list location (`js/data/verbs-*.js`) so they can delete or add verbs from their real book.
