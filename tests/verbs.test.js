'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();
const { conjugate } = require('./helpers/rules');
const FIXTURES = require('./fixtures/forms');

const RULE_TAGS = ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling'];
const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
// Verbs the rule engine does not cover; they are checked against hand-typed fixtures only.
const FIXTURE_ONLY = ['ser', 'estar', 'ir', 'dar', 'ver', 'saber', 'oír', 'jugar', 'oler', 'reír', 'sonreír', 'reunirse', 'irse'];

const byInf = (inf) => D.verbs.find((v) => v.inf === inf);

test('there are verbs', () => {
  assert.ok(D.verbs.length > 0);
});

test('every verb has six trimmed lower-case present forms and a gloss', () => {
  for (const verb of D.verbs) {
    assert.equal(verb.forms.present.length, 6, verb.inf);
    for (const f of verb.forms.present) {
      assert.equal(f, f.trim().toLowerCase(), `${verb.inf}: "${f}"`);
      assert.ok(f.length > 0, verb.inf);
    }
    assert.ok(verb.gloss && verb.gloss.length > 1, `${verb.inf} needs a gloss`);
    assert.ok(verb.tags.some((t) => t !== 'reflexive'), `${verb.inf} needs a tag besides reflexive`);
  }
});

test('infinitives are unique', () => {
  const infs = D.verbs.map((v) => v.inf);
  assert.equal(new Set(infs).size, infs.length);
});

test('reflexive verbs carry the right pronoun on every form, others never start with one', () => {
  for (const verb of D.verbs) {
    verb.forms.present.forEach((f, i) => {
      if (verb.reflexive) assert.ok(f.startsWith(`${PRONOUNS[i]} `), `${verb.inf} form ${i}: ${f}`);
      else assert.ok(!f.includes(' '), `${verb.inf} form ${i}: ${f}`);
    });
  }
});

test('hand-typed fixtures match the data for every fixture verb that exists', () => {
  for (const [inf, forms] of Object.entries(FIXTURES)) {
    const verb = byInf(inf);
    if (verb) assert.deepEqual(verb.forms.present, forms, inf);
  }
});

test('every FIXTURE_ONLY verb that exists has a fixture', () => {
  for (const inf of FIXTURE_ONLY) {
    if (byInf(inf)) assert.ok(FIXTURES[inf], `${inf} needs a fixture`);
  }
});

test('every other verb matches the independent rule engine', () => {
  for (const verb of D.verbs) {
    if (FIXTURE_ONLY.includes(verb.inf)) continue;
    const ruleTags = verb.tags.filter((t) => RULE_TAGS.includes(t));
    assert.ok(ruleTags.length > 0 || verb.tags.includes('regular'), `${verb.inf} has no rule tag and is not regular`);
    assert.deepEqual(verb.forms.present, conjugate(verb.inf, verb.tags), verb.inf);
  }
});

test('regular verbs carry no rule tags', () => {
  for (const verb of D.verbs.filter((v) => v.tags.includes('regular'))) {
    assert.deepEqual(verb.tags.filter((t) => RULE_TAGS.includes(t) || t === 'irregular'), [], verb.inf);
  }
});

test('coverage: at least 140 verbs, at least 70% tricky, every chip has at least 5 verbs', () => {
  assert.ok(D.verbs.length >= 140, `only ${D.verbs.length} verbs`);
  const tricky = D.verbs.filter((v) => !v.tags.includes('regular')).length;
  assert.ok(tricky / D.verbs.length >= 0.7, `tricky share ${tricky}/${D.verbs.length}`);
  for (const tag of D.TAGS) {
    const n = D.verbs.filter((v) => v.tags.includes(tag)).length;
    assert.ok(n >= 5, `${tag} has only ${n} verbs`);
  }
});
