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
  assert.deepEqual(s.state(), { items: {}, settings: { chips: [], vosotros: true, tense: 'present', book: 'all', off: [], mode: 'conjugar', ex: {}, reading: '', scores: {}, strictAccents: false, lesson: 'D3.2', upto: 'D3.2', focus: '' } });
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
  assert.deepEqual(s.state().settings, { chips: ['e→ie'], vosotros: true, tense: 'present', book: 'all', off: [], mode: 'conjugar', ex: {}, reading: '', scores: {}, strictAccents: false, lesson: 'D3.2', upto: 'D3.2', focus: '' });
});

test('clear resets state and removes the stored key', () => {
  const storage = fakeStorage();
  const s = D.createStore(() => storage);
  s.record('k', true, 1);
  s.clear();
  assert.deepEqual(s.state().items, {});
  assert.equal(storage.data.has(D.STORE_KEY), false);
});

test('book setting: D1, D2 and D3 are kept, anything else falls back to all', () => {
  for (const [raw, want] of [['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'], ['all', 'all'], ['D4', 'all'], [7, 'all']]) {
    const s = D.createStore(() => fakeStorage(JSON.stringify({ settings: { book: raw } })));
    assert.equal(s.state().settings.book, want, String(raw));
  }
});

test('off setting: an array of type names, anything else becomes empty', () => {
  for (const [raw, want] of [[['reflexive'], ['reflexive']], [['x', 7], ['x']], ['reflexive', []], [null, []]]) {
    const s = D.createStore(() => fakeStorage(JSON.stringify({ settings: { off: raw } })));
    assert.deepEqual(s.state().settings.off, want, JSON.stringify(raw));
  }
});

test('mode, lesson and exercise filters persist; junk values fall back to defaults', () => {
  const storage = fakeStorage();
  const a = D.createStore(() => storage);
  a.setSetting('mode', 'general');
  a.setSetting('lesson', 'D1.4');
  a.setSetting('upto', 'D2.3');
  a.setSetting('focus', 'D2.1');
  a.setSetting('ex', { 'D3.2': ['deportes', 'od', 7], general: ['mix'] });
  const b = D.createStore(() => storage);
  assert.equal(b.state().settings.mode, 'general');
  assert.equal(b.state().settings.lesson, 'D1.4');
  assert.equal(b.state().settings.upto, 'D2.3');
  assert.equal(b.state().settings.focus, 'D2.1');
  assert.deepEqual(b.state().settings.ex, { 'D3.2': ['deportes', 'od'], general: ['mix'] });
  const junk = D.createStore(() => fakeStorage(JSON.stringify({ settings: { mode: 5, ex: [1, 2], lesson: 'X9', upto: 3, focus: 'nope' } })));
  assert.equal(junk.state().settings.mode, 'conjugar');
  assert.deepEqual(junk.state().settings.ex, {});
  assert.equal(junk.state().settings.lesson, 'D3.2');
  assert.equal(junk.state().settings.focus, '');
});

test('the old Lección 2 tabs move to the D3.2 lesson, keeping their unticked filters', () => {
  const raw = JSON.stringify({ settings: { mode: 'gustar', ex: { vocab: ['deportes'], pronombres: ['od'], gustar: [] } } });
  const s = D.createStore(() => fakeStorage(raw));
  assert.equal(s.state().settings.mode, 'leccion');
  assert.equal(s.state().settings.lesson, 'D3.2');
  assert.deepEqual(s.state().settings.ex, { 'D3.2': ['deportes', 'od'] });
});

test('reading scores persist; impossible ones are dropped', () => {
  const storage = fakeStorage();
  const a = D.createStore(() => storage);
  a.setSetting('reading', 'final');
  a.setSetting('scores', { final: { r: 5, t: 7 }, bad: { r: 9, t: 7 }, junk: 3 });
  const b = D.createStore(() => storage);
  assert.equal(b.state().settings.reading, 'final');
  assert.deepEqual(b.state().settings.scores, { final: { r: 5, t: 7 } });
});

test('strictAccents is kept only as a boolean', () => {
  const load = (v) => D.createStore(() => ({ getItem: () => JSON.stringify({ settings: { strictAccents: v } }), setItem() {}, removeItem() {} })).state().settings.strictAccents;
  assert.equal(load(true), true);
  assert.equal(load('yes'), false);
});
