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
  const store = overrides.store || D.createStore(() => ({ getItem: () => null, setItem() {}, removeItem() {} }));
  const session = D.createSession({ verbs, tenses, store, rng: mulberry32(1), now: () => 1000 });
  return { session, store, tenses };
}

test('next() returns a prompt with the expected form and the person label', () => {
  const { session } = setup();
  const p = session.next();
  assert.ok(p.verb && p.key.startsWith('present|'));
  assert.equal(p.tenseId, 'present');
  assert.equal(p.expected, p.verb.forms.present[p.person]);
  assert.equal(p.personLabel, ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'][p.person]);
});

test('next() follows the ticked types and the vosotros setting', () => {
  const { session } = setup();
  session.toggleType('regular');
  session.setVosotros(false);
  for (let i = 0; i < 100; i += 1) {
    const p = session.next();
    assert.equal(p.verb.inf, 'pensar');
    assert.notEqual(p.person, 4);
  }
});

test('toggleType unticks and reticks a type and persists in the store', () => {
  const { session, store } = setup();
  assert.equal(session.typeOn('o→ue'), true);
  session.toggleType('o→ue');
  assert.deepEqual(store.state().settings.off, ['o→ue']);
  assert.equal(session.typeOn('o→ue'), false);
  session.toggleType('o→ue');
  assert.deepEqual(store.state().settings.off, []);
});

test('next() returns null when every verb is unticked, never a verb the menu excludes', () => {
  const { session } = setup();
  session.toggleType('regular');
  session.toggleType('e→ie');
  assert.equal(session.next(), null);
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

test('a throwing storage does not stop a session (Review Focus 3)', () => {
  const store = D.createStore(() => {
    throw new Error('no storage');
  });
  const { session } = setup({ store });
  const p = session.next();
  assert.doesNotThrow(() => session.answer(p, p.expected));
  assert.doesNotThrow(() => session.toggleType('e→ie'));
});

function bigSetup() {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', persons: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'], vosotrosIndex: 4 });
  tenses.register({ id: 'preterite', mark: 'pret', persons: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'], vosotrosIndex: 4 });
  // The drill registers the present only; give these copies a preterite so mixing has two tenses to draw from.
  const verbs = D.verbs.slice(0, 40).map((v) => ({ ...v, forms: { ...v.forms, preterite: D.tableOf(v).preterite } }));
  const store = D.createStore(() => ({ getItem: () => null, setItem() {}, removeItem() {} }));
  let t = 0;
  const session = D.createSession({ verbs, tenses, store, rng: mulberry32(4), now: () => (t += 1000) });
  return { session, store };
}

test('a missed form comes back after a few other prompts, marked as a retry', () => {
  const { session } = bigSetup();
  const missed = session.next();
  session.answer(missed, 'zzz');
  const between = [];
  let back = null;
  for (let i = 0; i < 10 && !back; i += 1) {
    const p = session.next();
    if (p.key === missed.key) back = p;
    else {
      between.push(p);
      session.answer(p, p.expected);
    }
  }
  assert.ok(back, 'never came back');
  assert.equal(between.length, D.RETRY_AFTER);
  assert.equal(back.retry, true);
  assert.equal(back.missed, 1);
  assert.ok(between.every((p) => p.retry === false && p.missed === 0));
});

test('answering the retry right clears it; missing it again queues it again', () => {
  const { session } = bigSetup();
  const p = session.next();
  session.answer(p, 'zzz');
  assert.equal(session.pendingRetries(), 1);
  session.answer(p, 'zzz');
  assert.equal(session.pendingRetries(), 1);
  session.answer(p, p.expected);
  assert.equal(session.pendingRetries(), 0);
});

test('a verb answered right does not come back while it rests', () => {
  const { session } = bigSetup();
  const first = session.next();
  session.answer(first, first.expected);
  // 40 verbs: every other verb gets a turn before the pool runs out of awake ones.
  for (let i = 0; i < 38; i += 1) {
    const p = session.next();
    assert.notEqual(p.verb.inf, first.verb.inf);
    session.answer(p, p.expected);
  }
});

test('missed is set for a form whose last answer was wrong in an earlier session', () => {
  const { session, store } = setup();
  const keys = ['pensar', 'hablar'].flatMap((inf) => [0, 1, 2, 3, 4, 5].map((n) => `present|${inf}|${n}`));
  for (const k of keys) {
    store.record(k, false, 1);
    store.record(k, false, 2);
  }
  const p = session.next();
  assert.equal(p.missed, 2);
  assert.equal(p.retry, false);
});

test('mix draws from every registered tense', () => {
  const { session, store } = bigSetup();
  session.setTense('mix');
  assert.equal(store.state().settings.tense, 'mix');
  assert.equal(session.mixed(), true);
  const seen = new Set();
  for (let i = 0; i < 80; i += 1) {
    const p = session.next();
    seen.add(p.tenseId);
    assert.equal(p.expected, p.verb.forms[p.tenseId][p.person]);
  }
  assert.deepEqual([...seen].sort(), ['present', 'preterite']);
});

function bookSetup(saved) {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', persons: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'], vosotrosIndex: 4 });
  const verbs = [
    { inf: 'pensar', tags: ['e→ie', 'D1'], forms: { present: ['1', '2', '3', '4', '5', '6'] } },
    { inf: 'poder', tags: ['o→ue', 'D1'], forms: { present: ['1', '2', '3', '4', '5', '6'] } },
    { inf: 'invertir', tags: ['e→ie', 'D2'], forms: { present: ['1', '2', '3', '4', '5', '6'] } },
    { inf: 'valer', tags: ['-go'], forms: { present: ['1', '2', '3', '4', '5', '6'] } },
  ];
  const raw = saved ? JSON.stringify({ settings: saved }) : null;
  const store = D.createStore(() => ({ getItem: () => raw, setItem() {}, removeItem() {} }));
  return { session: D.createSession({ verbs, tenses, store, rng: mulberry32(2) }), store };
}

test('TYPE_TAGS are the chip tags without the books', () => {
  assert.deepEqual(D.TYPE_TAGS, D.TAGS.filter((t) => t !== 'D1' && t !== 'D2'));
});

test('setBook limits the pool to that book; counts follow the book', () => {
  const { session } = bookSetup();
  assert.equal(session.poolSize(), 4);
  assert.equal(session.countFor('e→ie'), 2);
  assert.equal(session.bookCount('D1'), 2);
  assert.equal(session.bookCount('all'), 4);
  session.setBook('D1');
  assert.equal(session.settings().book, 'D1');
  assert.equal(session.poolSize(), 2);
  assert.equal(session.countFor('e→ie'), 1);
  assert.equal(session.countFor('-go'), 0);
  for (let i = 0; i < 50; i += 1) assert.ok(['pensar', 'poder'].includes(session.next().verb.inf));
  session.setBook('nonsense');
  assert.equal(session.settings().book, 'D1');
});

test('unticked types AND the book', () => {
  const { session } = bookSetup();
  session.setBook('D1');
  session.toggleType('e→ie');
  assert.equal(session.poolSize(), 1);
  assert.equal(session.next().verb.inf, 'poder');
});

test('saved D1/D2 chips from the old rail move into the book setting', () => {
  const { session } = bookSetup({ chips: ['D2', 'e→ie'] });
  assert.equal(session.settings().book, 'D2');
  assert.deepEqual(session.settings().chips, []);
  assert.ok(!session.settings().off.includes('e→ie') && session.settings().off.includes('o→ue'));
  const both = bookSetup({ chips: ['D1', 'D2'] }).session;
  assert.equal(both.settings().book, 'all');
  assert.deepEqual(both.settings().chips, []);
});

/* Menu semantics: every type starts ticked; unticking a type removes every verb that has it. */

function typesSetup(saved) {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', name: 'presente', persons: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'], vosotrosIndex: 4 });
  const raw = saved ? JSON.stringify({ settings: saved }) : null;
  const store = D.createStore(() => ({ getItem: () => raw, setItem() {}, removeItem() {} }));
  let t = 0;
  const session = D.createSession({ verbs: D.verbs, tenses, store, rng: mulberry32(8), now: () => (t += 1000) });
  return { session, store };
}

test('unticking reflexivo removes every reflexive verb, including stem-changing ones', () => {
  const { session } = typesSetup();
  session.toggleType('reflexive');
  assert.deepEqual(session.settings().off, ['reflexive']);
  for (let i = 0; i < 400; i += 1) {
    const p = session.next();
    assert.ok(!p.verb.reflexive, `${p.verb.inf} came up with reflexivo unticked`);
    session.answer(p, i % 3 ? p.expected : 'zzz');
  }
});

test('a verb missed before a type is unticked does not come back as a retry', () => {
  const { session } = typesSetup();
  let p = session.next();
  while (!p.verb.reflexive) p = session.next();
  session.answer(p, 'zzz');
  session.toggleType('reflexive');
  for (let i = 0; i < 20; i += 1) assert.ok(!session.next().verb.reflexive);
});

test('ticking types back in brings their verbs back; all types ticked means every verb', () => {
  const { session } = typesSetup();
  const all = session.poolSize();
  session.toggleType('reflexive');
  assert.ok(session.poolSize() < all);
  session.toggleType('reflexive');
  assert.equal(session.poolSize(), all);
  assert.deepEqual(session.settings().off, []);
});

test('setAllTypes(false) empties the pool and next() returns null instead of ignoring the menu', () => {
  const { session } = typesSetup();
  session.setAllTypes(false);
  assert.deepEqual([...session.settings().off].sort(), [...D.TYPE_TAGS].sort());
  assert.equal(session.poolSize(), 0);
  assert.equal(session.next(), null);
  session.toggleType('regular');
  assert.ok(session.poolSize() > 0);
  for (let i = 0; i < 50; i += 1) assert.deepEqual(session.next().verb.tags.filter((t) => D.TYPE_TAGS.includes(t)), ['regular']);
  session.setAllTypes(true);
  assert.deepEqual(session.settings().off, []);
});

test('a type and a book that share no verbs give an empty pool, not a silent fallback', () => {
  const { session } = typesSetup();
  session.setBook('D1');
  session.setAllTypes(false);
  session.toggleType('-uir');
  assert.equal(session.countFor('-uir'), 0);
  assert.equal(session.poolSize(), 0);
  assert.equal(session.next(), null);
});

test('chips saved by the old include-list menu become the matching unticked types', () => {
  const { session } = typesSetup({ chips: ['e→ie', 'o→ue', 'regular'] });
  assert.deepEqual([...session.settings().off].sort(), D.TYPE_TAGS.filter((t) => !['e→ie', 'o→ue', 'regular'].includes(t)).sort());
  assert.deepEqual(session.settings().chips, []);
});

test('streak counts consecutive right answers, best keeps the high mark, count totals answers', () => {
  const { session } = setup();
  assert.equal(session.streak(), 0);
  assert.equal(session.best(), 0);
  assert.equal(session.count(), 0);
  const p = session.next();
  session.answer(p, p.expected);
  session.answer(p, p.expected);
  assert.equal(session.streak(), 2);
  session.answer(p, 'nope');
  assert.equal(session.streak(), 0);
  assert.equal(session.best(), 2);
  session.answer(p, p.expected);
  assert.equal(session.streak(), 1);
  assert.equal(session.best(), 2);
  assert.equal(session.count(), 4);
});
