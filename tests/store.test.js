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
