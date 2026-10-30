'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const { mulberry32 } = require('./helpers/rng');

const memory = () => D.createStore(() => ({ getItem: () => null, setItem() {}, removeItem() {} }));

function typed(id, answers) {
  return { id, mode: 'pronombres', kind: 'type', skill: 'od', prompt: `${id} ___`, answers };
}

function deckOf(items, store = memory()) {
  return D.createDeck({ items: () => items, store, rng: mulberry32(7), now: () => 1000 });
}

test('check ignores case, outer spaces, doubled spaces and ¿ ¡ . ! ?', () => {
  assert.equal(D.exercise.check('  ¿Se  las DOY? ', ['se las doy']).result, 'correct');
  assert.equal(D.exercise.check('¡Cómpralas!', ['cómpralas']).result, 'correct');
});

test('check accepts any listed answer and reports the first as expected', () => {
  const r = D.exercise.check('voy a comprarlas', ['las voy a comprar', 'voy a comprarlas']);
  assert.equal(r.result, 'correct');
  assert.equal(r.expected, 'voy a comprarlas');
  const w = D.exercise.check('lo voy a comprar', ['las voy a comprar', 'voy a comprarlas']);
  assert.equal(w.result, 'wrong');
  assert.equal(w.expected, 'las voy a comprar');
});

test('an accent-only slip is reported as accent and is not correct', () => {
  const r = D.exercise.check('comprala', ['cómprala']);
  assert.equal(r.result, 'accent');
  assert.equal(r.marks.length, Array.from('cómprala').length);
  assert.ok(r.marks[1]);
});

test('the deck accepts an accent slip unless strict accents are on', () => {
  const item = typed('a1', ['cómprala']);
  const loose = deckOf([item]);
  const r1 = loose.answer(loose.next(), 'comprala');
  assert.equal(r1.ok, true);
  assert.equal(r1.result, 'accent');
  const store = memory();
  store.setSetting('strictAccents', true);
  const strict = deckOf([item], store);
  const r2 = strict.answer(strict.next(), 'comprala');
  assert.equal(r2.ok, false);
  assert.equal(r2.result, 'accent');
});

test('an empty deck returns null instead of throwing', () => {
  assert.equal(deckOf([]).next(), null);
});

test('next() never repeats the item just shown when there is a choice', () => {
  const deck = deckOf([typed('a', ['lo']), typed('b', ['la']), typed('c', ['los'])]);
  let last = null;
  for (let i = 0; i < 60; i += 1) {
    const p = deck.next();
    assert.notEqual(p.item.id, last);
    last = p.item.id;
    deck.answer(p, p.item.answers[0]);
  }
});

test('a missed item comes back as a retry after three others', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => typed(id, ['lo']));
  const deck = deckOf(items);
  const first = deck.next();
  deck.answer(first, 'nada');
  const seen = [];
  for (let i = 0; i < 4; i += 1) {
    const p = deck.next();
    seen.push(p);
    if (!p.retry) deck.answer(p, 'lo');
  }
  const retry = seen.find((p) => p.retry);
  assert.ok(retry, 'no retry served');
  assert.equal(retry.item.id, first.item.id);
  assert.equal(seen.indexOf(retry), 3);
});

test('choice items are answered by index', () => {
  const item = { id: 'q', mode: 'vocab', kind: 'choice', skill: 'es-en', prompt: 'la taquilla', options: ['box office', 'stage', 'seat', 'ticket'], correct: 0 };
  const deck = deckOf([item]);
  const p = deck.next();
  assert.equal(deck.answer(p, 0).ok, true);
  const q = deck.next();
  const res = deck.answer(q, 2);
  assert.equal(res.ok, false);
  assert.equal(res.expected, 'box office');
  assert.equal(res.picked, 2);
});

test('stats: streak, best, count and accuracy follow the answers', () => {
  const deck = deckOf([typed('a', ['lo']), typed('b', ['la'])]);
  assert.equal(deck.accuracy(), null);
  for (const ok of [true, true, false, true]) {
    const p = deck.next();
    deck.answer(p, ok ? p.item.answers[0] : 'x');
  }
  assert.equal(deck.streak(), 1);
  assert.equal(deck.best(), 2);
  assert.equal(deck.count(), 4);
  assert.equal(deck.accuracy(), 75);
});

test('answers are recorded in the store under ex: keys', () => {
  const store = memory();
  const deck = deckOf([typed('a', ['lo'])], store);
  deck.answer(deck.next(), 'mal');
  assert.equal(store.state().items['ex:a'].misses, 1);
});

test('a retry is dropped when its item leaves the deck (filters changed)', () => {
  let items = [typed('a', ['lo']), typed('b', ['la']), typed('c', ['los']), typed('d', ['las'])];
  const deck = D.createDeck({ items: () => items, store: memory(), rng: mulberry32(3), now: () => 1 });
  const first = deck.next();
  deck.answer(first, 'mal');
  items = items.filter((it) => it.id !== first.item.id);
  for (let i = 0; i < 12; i += 1) {
    const p = deck.next();
    assert.notEqual(p.item.id, first.item.id);
    deck.answer(p, p.item.answers[0]);
  }
});

test('an item weight scales how often it comes up', () => {
  const heavy = typed('heavy', ['lo']);
  const light = { ...typed('light', ['la']), weight: 0.05 };
  const others = ['a', 'b', 'c', 'd', 'e'].map((id) => typed(id, ['los']));
  const deck = D.createDeck({ items: () => [heavy, light, ...others], store: memory(), rng: mulberry32(11), now: () => 1 });
  const n = { heavy: 0, light: 0 };
  for (let i = 0; i < 700; i += 1) {
    const p = deck.next();
    if (p.item.id in n) n[p.item.id] += 1;
    deck.answer(p, p.item.answers[0]);
  }
  assert.ok(n.heavy > n.light * 3, JSON.stringify(n));
});
