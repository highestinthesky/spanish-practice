'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const base = { vosotros: true, ex: {} };
const ids = () => D.lessons.list().map((l) => l.id);

test('every Descubre lesson up to D3.3 is registered, in book order', () => {
  const want = [...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `D1.${n}`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `D2.${n}`), 'D3.1', 'D3.2', 'D3.3'];
  for (const id of want) assert.ok(ids().includes(id), `${id} is missing`);
  const order = ids().map(D.lessons.order);
  assert.deepEqual(order, order.slice().sort((a, b) => a - b));
});

test('item ids are unique across every lesson and the mixed review', () => {
  const seen = new Set();
  for (const id of ids()) {
    for (const it of D.lessons.all(id)) {
      assert.ok(!seen.has(it.id), `duplicate id ${it.id}`);
      seen.add(it.id);
    }
  }
  for (const it of D.lessons.mixed()) {
    assert.ok(!seen.has(it.id), `duplicate id ${it.id}`);
    seen.add(it.id);
  }
});

test('every item is well formed: something to show, a skill, valid options or answers, one gap at most', () => {
  for (const id of ids()) {
    for (const it of [...D.lessons.all(id), ...D.lessons.mixed().filter((m) => m.lesson === id)]) {
      assert.ok(it.prompt || it.big, `${it.id} has nothing to show`);
      assert.ok(it.skill, `${it.id} has no skill`);
      if (it.options) {
        assert.ok(it.options.length === 4 || it.options.length === 2, `${it.id} has ${it.options.length} options`);
        assert.equal(new Set(it.options).size, it.options.length, `${it.id} repeats an option`);
        assert.ok(Number.isInteger(it.correct) && it.correct >= 0 && it.correct < it.options.length, it.id);
      } else {
        assert.ok(Array.isArray(it.answers) && it.answers.length > 0, `${it.id} has no answers`);
        for (const a of it.answers) assert.ok(a && a.trim(), `${it.id} has a blank answer`);
      }
      if (it.prompt && it.prompt.includes('___')) assert.equal(it.prompt.split('___').length, 2, `${it.id}: ${it.prompt}`);
      assert.ok(it.weight > 0, `${it.id} has no weight`);
    }
  }
});

test('every lesson has vocabulary and grammar, and every filter has items', () => {
  for (const id of ids()) {
    const items = D.lessons.all(id);
    assert.ok(items.some((it) => it.cat === 'vocab'), `${id} has no vocabulary`);
    assert.ok(items.some((it) => it.cat === 'gram'), `${id} has no grammar`);
    for (const group of D.lessons.filters(id)) {
      for (const f of group.items) assert.ok(D.lessons.count(id, f.id, base) > 0, `${id}/${f.id} is empty`);
    }
  }
});

test('every grammar skill has enough practice', () => {
  for (const id of ids()) {
    const per = {};
    for (const it of D.lessons.all(id)) per[it.skill] = (per[it.skill] || 0) + 1;
    for (const [skill, n] of Object.entries(per)) assert.ok(n >= 8, `${id}/${skill} has only ${n}`);
  }
});

test('in a lesson deck every skill weighs about the same, however many items it has', () => {
  const sums = {};
  for (const it of D.lessons.all('D3.2')) sums[it.skill] = (sums[it.skill] || 0) + it.weight;
  for (const [skill, w] of Object.entries(sums)) assert.ok(w <= D.lessons.SKILL_SIZE + 1e-9, `${skill}: ${w}`);
  assert.ok(sums.forma > 20 && sums.forma <= 24);
});

test('vosotros off removes every vosotros item in every lesson', () => {
  for (const id of ids()) {
    const off = D.lessons.items(id, { ...base, vosotros: false });
    assert.equal(off.filter((it) => it.vos).length, 0, id);
  }
});

test('general: only lessons up to the chosen one, each lesson weighing the same', () => {
  const st = { ...base, upto: 'D1.3', focus: '' };
  const items = D.lessons.general(st);
  const lessons = new Set(items.map((it) => it.lesson));
  assert.deepEqual([...lessons].sort(), ['D1.1', 'D1.2', 'D1.3']);
  const sums = {};
  for (const it of items) if (it.cat !== 'mix') sums[it.lesson] = (sums[it.lesson] || 0) + it.weight;
  for (const w of Object.values(sums)) assert.ok(Math.abs(w - 1) < 1e-9, JSON.stringify(sums));
});

test('general: a focus lesson is half of everything that comes up', () => {
  const items = D.lessons.general({ ...base, upto: 'D3.3', focus: 'D3.3' });
  const total = items.reduce((s, it) => s + it.weight, 0);
  const focus = items.filter((it) => it.lesson === 'D3.3' && it.cat !== 'mix').reduce((s, it) => s + it.weight, 0);
  assert.ok(Math.abs(focus / total - 0.5) < 1e-9, String(focus / total));
});

test('general: unticking vocabulario, gramática or repaso mixto removes those items', () => {
  const st = { ...base, upto: 'D3.3', focus: '' };
  for (const cat of ['vocab', 'gram', 'mix']) {
    const items = D.lessons.general({ ...st, ex: { general: [cat] } });
    assert.ok(items.length > 0);
    assert.ok(items.every((it) => it.cat !== cat), cat);
  }
  assert.equal(D.lessons.general({ ...st, ex: { general: ['vocab', 'gram', 'mix'] } }).length, 0);
});

test('mixed review items only unlock with their lesson', () => {
  const early = D.lessons.general({ ...base, upto: 'D1.4', focus: '' }).filter((it) => it.cat === 'mix');
  for (const it of early) assert.ok(D.lessons.order(it.lesson) <= D.lessons.order('D1.4'), it.id);
  assert.ok(D.lessons.mixed().length >= 80, `only ${D.lessons.mixed().length} mixed items`);
});

test('generated verb forms come from the conjugator', () => {
  const it = D.lessons.all('D1.9').find((x) => x.id === 'D1.9:pret-irr:preterite:tener:0');
  assert.ok(it, 'no yo + tener in the preterite');
  assert.equal(it.prompt, 'Ayer yo ___ (tener).');
  assert.deepEqual(it.answers, ['tuve']);
});

test('readings: markers parse and every reference question points at a marker in its passage', () => {
  for (const r of D.lessons.readings()) {
    const parts = D.lessons.parseReading(r.text);
    const refs = new Set(parts.filter((p) => p.type === 'ref').map((p) => p.id));
    assert.ok(parts.some((p) => p.type === 'gloss'), `${r.id} has no glossed words`);
    assert.ok(!parts.some((p) => p.type === 'text' && /\[\[|\]\]|\{\{|\}\}/.test(p.text)), `${r.id} has a broken marker`);
    assert.ok(r.questions.length >= 6, r.id);
    for (const q of r.questions) {
      if (q.ref) assert.ok(refs.has(q.ref), `${r.id}: ${q.ref} not in the text`);
      assert.equal(new Set(q.options).size, q.options.length, `${r.id}: ${q.q}`);
      assert.ok(q.correct >= 0 && q.correct < q.options.length);
    }
  }
  const ids = D.lessons.readings().map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, 'two readings share an id');
});
