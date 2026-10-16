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

test('pick: a verb used in the recent window does not come back until the window has moved on', () => {
  const many = Array.from({ length: 12 }, (_, i) => mk(`v${i}`, ['regular']));
  const pool = S.buildPool({ verbs: many, tense, chips: [], vosotros: true });
  const rng = mulberry32(11);
  let last = null;
  const recent = [];
  for (let i = 0; i < 500; i += 1) {
    const item = S.pick(pool, {}, last, rng, recent);
    assert.ok(!recent.includes(item.verb.inf), `${item.verb.inf} repeated within ${recent.join(',')}`);
    last = { key: item.key, inf: item.verb.inf };
    recent.push(item.verb.inf);
    if (recent.length > S.RECENT_VERBS) recent.shift();
  }
});

test('pick: a pool smaller than the window still avoids the most recent verbs it can', () => {
  const pool = S.buildPool({ verbs: verbs.slice(0, 3), tense, chips: [], vosotros: true });
  const rng = mulberry32(5);
  const recent = [];
  for (let i = 0; i < 300; i += 1) {
    const item = S.pick(pool, {}, null, rng, recent);
    // With three verbs, neither of the last two can come straight back.
    if (recent.length >= 2) assert.ok(!recent.slice(-2).includes(item.verb.inf));
    recent.push(item.verb.inf);
    if (recent.length > S.RECENT_VERBS) recent.shift();
  }
});

test('weightOf: verbs that follow the plain pattern weigh less', () => {
  assert.equal(S.weightOf(undefined, false), S.UNSEEN * S.PLAIN);
  assert.equal(S.weightOf({ box: 0, seen: 1 }, false), 8 * S.PLAIN);
});

test('buildPool: entries carry their tense and whether the verb is tricky in it', () => {
  const t = { id: 'present', persons: ['a', 'b'] };
  const vs = [
    { inf: 'x', tags: ['regular'], forms: { present: ['1', '2'] }, tricky: { present: false } },
    { inf: 'y', tags: ['e→ie'], forms: { present: ['1', '2'] }, tricky: { present: true } },
    { inf: 'z', tags: ['regular'], forms: { present: ['1', '2'] } },
  ];
  const pool = S.buildPool({ verbs: vs, tense: t, chips: [], vosotros: true });
  assert.equal(pool[0].tense, t);
  assert.deepEqual(pool.map((p) => p.tricky), [false, false, true, true, true, true]);
});

test('restingVerbs: a verb rests after a right answer, for longer the better it is known', () => {
  const min = 60 * 1000;
  const items = {
    'present|pensar|0': { box: 3, seen: 1, misses: 0, last: 0 },
    'preterite|pensar|2': { box: 2, seen: 2, misses: 1, last: -10 * min },
    'present|poder|1': { box: 0, seen: 1, misses: 1, last: 0 },
    'present|hablar|1': { box: 1, seen: 3, misses: 1, last: 0 },
  };
  assert.deepEqual([...S.restingVerbs(items, 30 * min)].sort(), ['pensar']);
  assert.deepEqual([...S.restingVerbs(items, min)].sort(), ['hablar', 'pensar']);
  assert.deepEqual([...S.restingVerbs(items, 2 * 60 * min)], []);
});

test('restingVerbs: the latest answer decides, so a miss wakes a resting verb', () => {
  const items = {
    'present|pensar|0': { box: 4, seen: 3, misses: 0, last: 100 },
    'present|pensar|1': { box: 0, seen: 1, misses: 1, last: 200 },
  };
  assert.equal(S.restingVerbs(items, 300).size, 0);
});

test('pick: resting verbs stay out while others are awake, and come back when nothing else is left', () => {
  const pool = S.buildPool({ verbs: verbs.slice(0, 3), tense, chips: [], vosotros: true });
  const items = { 'present|pensar|0': { box: 4, seen: 2, misses: 0, last: 1000 } };
  const rng = mulberry32(9);
  for (let i = 0; i < 300; i += 1) assert.notEqual(S.pick(pool, items, null, rng, [], 2000).verb.inf, 'pensar');
  const onlyPensar = pool.filter((p) => p.verb.inf === 'pensar');
  assert.equal(S.pick(onlyPensar, items, null, rng, [], 2000).verb.inf, 'pensar');
});
