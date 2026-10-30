'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const base = { vosotros: true, ex: {} };
const EXERCISE_MODES = ['vocab', 'pronombres', 'gustar', 'mezcla'];

test('the modes are conjugar, vocab, pronombres, gustar, lectura, mezcla', () => {
  assert.deepEqual(D.MODES.map((m) => m.id), ['conjugar', 'vocab', 'pronombres', 'gustar', 'lectura', 'mezcla']);
});

test('every exercise mode has items, and ids are unique across the whole lesson', () => {
  const seen = new Set();
  for (const mode of ['vocab', 'pronombres', 'gustar']) {
    const items = D.L2.items(mode, base);
    assert.ok(items.length >= 30, `${mode} has ${items.length}`);
    for (const it of items) {
      assert.ok(!seen.has(it.id), `duplicate id ${it.id}`);
      seen.add(it.id);
    }
  }
  assert.equal(D.L2.items('mezcla', base).length, seen.size);
});

test('choice items: unique options, the answer exactly once, a valid index', () => {
  for (const mode of EXERCISE_MODES) {
    for (const it of D.L2.items(mode, base).filter((x) => x.options)) {
      assert.ok(it.options.length === 4 || it.options.length === 2, `${it.id} has ${it.options.length} options`);
      assert.equal(new Set(it.options).size, it.options.length, `${it.id} repeats an option`);
      assert.ok(Number.isInteger(it.correct) && it.correct >= 0 && it.correct < it.options.length, it.id);
    }
  }
});

test('typed items have non-empty answers and every item has a prompt and a skill', () => {
  for (const mode of EXERCISE_MODES) {
    for (const it of D.L2.items(mode, base)) {
      assert.ok(it.prompt || it.big, `${it.id} has nothing to show`);
      assert.ok(it.skill, `${it.id} has no skill`);
      if (!it.options) {
        assert.ok(Array.isArray(it.answers) && it.answers.length > 0, `${it.id} has no answers`);
        for (const a of it.answers) assert.ok(a.trim(), `${it.id} has a blank answer`);
      }
    }
  }
});

test('a gap prompt has exactly one gap', () => {
  for (const mode of EXERCISE_MODES) {
    for (const it of D.L2.items(mode, base).filter((x) => x.prompt && x.prompt.includes('___'))) {
      assert.equal(it.prompt.split('___').length, 2, it.id);
    }
  }
});

test('gustar forms agree in number: plural things take a plural verb, infinitives and singulars do not', () => {
  const forms = D.L2.items('gustar', base).filter((it) => it.skill === 'forma');
  assert.ok(forms.length > 100);
  for (const it of forms) {
    const verb = it.answers[0].split(' ')[1];
    if (it.number === 'pl') assert.match(verb, /n$/, it.id);
    else assert.doesNotMatch(verb, /n$/, it.id);
  }
  const one = forms.find((it) => it.id === 'g:encantar:marta:conciertos');
  assert.ok(one, 'missing a Marta + encantar + conciertos item');
  assert.equal(one.prompt, 'A Marta ___ (encantar) los conciertos.');
  assert.deepEqual(one.answers, ['le encantan']);
});

test('vosotros off removes every os item; on keeps some', () => {
  const on = D.L2.items('mezcla', base).filter((it) => it.vos);
  assert.ok(on.length > 0);
  const off = D.L2.items('mezcla', { ...base, vosotros: false });
  assert.equal(off.filter((it) => it.vos).length, 0);
});

test('unticking a filter removes its items; unticking everything gives an empty list', () => {
  const all = D.L2.items('pronombres', base);
  const noOd = D.L2.items('pronombres', { ...base, ex: { pronombres: ['od'] } });
  assert.ok(noOd.length < all.length);
  assert.ok(noOd.every((it) => it.skill !== 'od'));
  const ids = D.L2.filters('pronombres').flatMap((g) => g.items.map((x) => x.id));
  assert.equal(D.L2.items('pronombres', { ...base, ex: { pronombres: ids } }).length, 0);
  const noSports = D.L2.items('vocab', { ...base, ex: { vocab: ['deportes'] } });
  assert.ok(noSports.every((it) => it.group !== 'deportes'));
});

test('every filter option has at least one item', () => {
  for (const mode of ['vocab', 'pronombres', 'gustar']) {
    for (const group of D.L2.filters(mode)) {
      for (const f of group.items) assert.ok(D.L2.count(mode, f.id, base) > 0, `${mode}/${f.id}`);
    }
  }
});

test('en → es accepts the bare noun and every Spanish word that shares the meaning', () => {
  const it = D.L2.items('vocab', base).find((x) => x.skill === 'en-es' && x.big === 'box office');
  assert.ok(it);
  assert.ok(it.answers.includes('la taquilla'));
  assert.ok(it.answers.includes('taquilla'));
  const score = D.L2.items('vocab', base).find((x) => x.skill === 'en-es' && /^to score/.test(x.big));
  assert.ok(score.answers.includes('anotar') && score.answers.includes('marcar'));
});

test('readings: markers parse, and every reference question points at a marker in its passage', () => {
  assert.ok(D.L2.readings.length >= 10);
  for (const r of D.L2.readings) {
    const parts = D.L2.parseReading(r.text);
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
});

test('option order is shuffled but stable between calls', () => {
  const a = D.L2.items('pronombres', base).filter((x) => x.options);
  const b = D.L2.items('pronombres', base).filter((x) => x.options);
  assert.deepEqual(a.map((x) => x.options), b.map((x) => x.options));
  assert.ok(a.some((x) => x.correct !== 0), 'every answer sits first');
});

test('every skill has a full set of practice items', () => {
  const by = (mode) => {
    const n = {};
    for (const it of D.L2.items(mode, base)) n[it.skill] = (n[it.skill] || 0) + 1;
    return n;
  };
  const p = by('pronombres');
  for (const skill of ['od', 'oi', 'doble', 'prep', 'pos']) assert.ok(p[skill] >= 38, `pronombres/${skill}: ${p[skill]}`);
  const g = by('gustar');
  assert.ok(g.a >= 50, `gustar/a: ${g.a}`);
  assert.ok(g.traduccion >= 55, `gustar/traduccion: ${g.traduccion}`);
  assert.ok(g.forma >= 350, `gustar/forma: ${g.forma}`);
  assert.ok(by('vocab').contexto >= 125, 'vocab/contexto');
});

test('every vocab group has context sentences for most of its words', () => {
  for (const group of D.L2.VOCAB_GROUPS) {
    const words = D.L2.vocab.filter((w) => w.group === group.id).length;
    const sentences = D.L2.context.filter((c) => c.group === group.id).length;
    assert.ok(sentences >= 2 * words - 3, `${group.id}: ${sentences} sentences for ${words} words`);
  }
});

test('vosotros off removes the os rewrites too', () => {
  const off = D.L2.items('pronombres', { ...base, vosotros: false });
  // os as a whole word (\b would split niños at the ñ).
  const os = (p) => /(^|[\s¿¡])os(?=[\s,.?!]|$)/i.test(p);
  assert.ok(!off.some((it) => os(it.prompt)), off.filter((it) => os(it.prompt)).map((it) => it.id).join(', '));
});
