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

const ALL = ['present', 'preterite', 'imperfect', 'future', 'conditional', 'perfect', 'pluperfect', 'subjunctive', 'pastSubjunctive'];

test('the drill registers every tense the conjugator builds, present first', () => {
  assert.deepEqual(D.tenses.all().map((t) => t.id), ALL);
  for (const t of D.tenses.all()) {
    assert.equal(t.persons.length, 6, t.id);
    assert.equal(t.vosotrosIndex, 4, t.id);
    assert.ok(t.name, t.id);
    assert.ok(D.TENSE_GROUPS.includes(t.group), t.id);
  }
});

test('every verb has all six forms of every tense, preterite included', () => {
  for (const verb of D.verbs) {
    for (const t of D.tenses.all()) {
      const forms = verb.forms[t.id];
      assert.ok(Array.isArray(forms) && forms.length === 6 && forms.every((f) => f.trim()), `${verb.inf} ${t.id}`);
    }
  }
});

test('the conjugation table lists every tense the conjugator builds, with Spanish names', () => {
  const ids = D.TABLE_TENSES.map((t) => t.id);
  assert.deepEqual(ids, ['present', 'preterite', 'imperfect', 'future', 'conditional', 'subjunctive', 'pastSubjunctive', 'perfect', 'pluperfect']);
  const table = D.conjugate('hablar');
  for (const t of D.TABLE_TENSES) {
    assert.ok(t.name, t.id);
    assert.equal(table[t.id].length, 6, t.id);
  }
});

/* Each tense has its own verb types. */

test('every tense has its own grouped verb types, and every verb has at least one known type in each', () => {

  for (const t of D.tenses.all()) {
    const ids = t.types.flatMap((g) => g.items.map((i) => i.id));
    assert.ok(ids.length, t.id);
    assert.equal(new Set(ids).size, ids.length, `${t.id}: duplicate type`);
    for (const g of t.types) for (const i of g.items) assert.ok(i.name && /→/.test(i.example), `${t.id} ${i.id}`);
    for (const v of D.verbs) {
      const kinds = v.kinds[t.id];
      assert.ok(kinds && kinds.length, `${v.inf} has no ${t.id} type`);
      for (const k of kinds) assert.ok(ids.includes(k), `${v.inf}: ${t.id} type ${k} is not in its menu`);
    }
  }
});

test('verbs sort into the types their tense teaches', () => {

  const kinds = (inf, id) => D.verbs.find((v) => v.inf === inf).kinds[id];
  const cases = [
    ['preterite', 'tener', 'strong'], ['preterite', 'estar', 'strong'], ['preterite', 'decir', 'j'], ['preterite', 'conducir', 'j'],
    ['preterite', 'ir', 'unique'], ['preterite', 'dar', 'unique'], ['preterite', 'pedir', 'stem'], ['preterite', 'dormir', 'stem'],
    ['preterite', 'leer', 'y'], ['preterite', 'construir', 'y'], ['preterite', 'buscar', 'spelling'], ['preterite', 'llegar', 'spelling'],
    ['preterite', 'hablar', 'regular'], ['preterite', 'pensar', 'regular'],
    ['pastSubjunctive', 'tener', 'strong'], ['pastSubjunctive', 'buscar', 'regular'],
    ['imperfect', 'ir', 'irregular'], ['imperfect', 'hablar', 'ar'], ['imperfect', 'vivir', 'er-ir'],
    ['future', 'poder', 'drop'], ['future', 'tener', 'dr'], ['future', 'hacer', 'short'], ['conditional', 'salir', 'dr'], ['future', 'ser', 'regular'],
    ['perfect', 'hacer', 'irregular'], ['perfect', 'escribir', 'irregular'], ['perfect', 'leer', 'accent'], ['pluperfect', 'tener', 'regular'],
    ['subjunctive', 'ser', 'irregular'], ['subjunctive', 'tener', 'yo'], ['subjunctive', 'conocer', 'yo'], ['subjunctive', 'pensar', 'e→ie'],
    ['subjunctive', 'buscar', 'spelling'], ['subjunctive', 'enviar', 'accent'], ['subjunctive', 'hablar', 'regular'],
  ];
  for (const [id, inf, kind] of cases) assert.ok(kinds(inf, id).includes(kind), `${id} ${inf}: ${kinds(inf, id)}`);
  assert.ok(!kinds('tener', 'subjunctive').includes('e→ie'), 'tenga keeps the yo stem');
  assert.ok(kinds('lavarse', 'preterite').includes('reflexive'));
});
