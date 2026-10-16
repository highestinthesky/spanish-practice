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

test('a throwing storage does not stop a session (Review Focus 3)', () => {
  const store = D.createStore(() => {
    throw new Error('no storage');
  });
  const { session } = setup({ store });
  const p = session.next();
  assert.doesNotThrow(() => session.answer(p, p.expected));
  assert.doesNotThrow(() => session.toggleChip('e→ie'));
});
