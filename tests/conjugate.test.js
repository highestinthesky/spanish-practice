'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const FIXTURES = require('./fixtures/tenses');

const byInf = (inf) => D.verbs.find((v) => v.inf === inf);

test('every tense fixture matches the conjugator for that verb', () => {
  for (const [inf, want] of Object.entries(FIXTURES)) {
    const verb = byInf(inf);
    assert.ok(verb, `${inf} is not in the verb list`);
    const table = D.tableOf(verb);
    for (const [key, forms] of Object.entries(want)) {
      const got = key === 'affirmative' || key === 'negative' ? table.imperative[key] : table[key];
      assert.deepEqual(got, forms, `${inf} ${key}`);
    }
  }
});

test('the drilled forms of each tense come from the same table', () => {
  const verb = byInf('tener');
  for (const t of D.tenses.all()) assert.deepEqual(verb.forms[t.id], D.tableOf(verb)[t.id], t.id);
});

test('every form is lower-case and trimmed, reflexive forms carry their pronoun', () => {
  const PRON = ['me', 'te', 'se', 'nos', 'os', 'se'];
  for (const verb of D.verbs) {
    const table = D.tableOf(verb);
    for (const [key, forms] of Object.entries(table)) {
      if (!Array.isArray(forms)) continue;
      forms.forEach((f, i) => {
        assert.equal(f, f.trim().toLowerCase(), `${verb.inf} ${key}`);
        if (verb.reflexive) assert.ok(f.startsWith(`${PRON[i]} `), `${verb.inf} ${key} ${f}`);
      });
    }
  }
});

test('no form carries two written accents', () => {
  for (const verb of D.verbs) {
    const table = D.tableOf(verb);
    const all = [table.participle, table.gerund, ...table.imperative.affirmative.filter(Boolean)];
    for (const key of ['present', 'preterite', 'imperfect', 'future', 'conditional', 'subjunctive', 'pastSubjunctive']) all.push(...table[key]);
    for (const f of all) {
      for (const word of f.split(' ')) assert.ok((word.match(/[áéíóú]/g) || []).length <= 1, `${verb.inf}: ${word}`);
    }
  }
});

test('attach moves the written accent as pronouns are added', () => {
  const { attach } = D.conjugator;
  assert.equal(attach('levanta', 'te'), 'levántate');
  assert.equal(attach('pon', 'te'), 'ponte');
  assert.equal(attach('mantén', 'te'), 'mantente');
  assert.equal(attach('siente', 'se'), 'siéntese');
  assert.equal(attach('gradúa', 'te'), 'gradúate');
  assert.equal(attach('comunique', 'se'), 'comuníquese');
  assert.equal(attach('levantando', 'se'), 'levantándose');
});

test('the regular baseline ignores every irregularity', () => {
  const t = D.conjugate('tener', ['-go', 'e→ie'], { regular: true });
  assert.deepEqual(t.present, ['teno', 'tenes', 'tene', 'tenemos', 'tenéis', 'tenen']);
  assert.equal(t.preterite[0], 'tení');
  assert.equal(t.future[0], 'teneré');
});

test('tricky flags: regular verbs are plain, ser is irregular in every simple tense but the future', () => {
  assert.deepEqual(byInf('hablar').tricky, { present: false });
  assert.deepEqual(byInf('ser').tricky, { present: true });
  const irr = D.irregularMap(byInf('ser'));
  assert.ok(irr.preterite.some(Boolean));
  assert.ok(!irr.future.some(Boolean));
});

test('conjugate rejects things that are not infinitives', () => {
  assert.throws(() => D.conjugate('casa'), /cannot conjugate/);
});
