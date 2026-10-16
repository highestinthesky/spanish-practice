'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const SIX = ['a', 'b', 'c', 'd', 'e', 'f'];

function freshBook() {
  const tenses = D.createTenseRegistry();
  tenses.register({ id: 'present', mark: 'pres', persons: ['1', '2', '3', '4', '5', '6'], vosotrosIndex: 4 });
  return { tenses, book: D.createVerbBook(tenses) };
}

test('v() builds a record and detects reflexive verbs', () => {
  const plain = D.v('hablar', 'to speak', ['regular'], SIX);
  assert.equal(plain.reflexive, false);
  assert.deepEqual(plain.tags, ['regular']);
  assert.deepEqual(plain.forms.present, SIX);

  const refl = D.v('lavarse', 'to wash oneself', ['regular'], SIX);
  assert.equal(refl.reflexive, true);
  assert.deepEqual(refl.tags, ['regular', 'reflexive']);
});

test('v() copies its inputs', () => {
  const tags = ['regular'];
  const forms = SIX.slice();
  const verb = D.v('hablar', 'x', tags, forms);
  tags.push('mutated');
  forms[0] = 'mutated';
  assert.deepEqual(verb.tags, ['regular']);
  assert.equal(verb.forms.present[0], 'a');
});

test('TAGS lists the chip order', () => {
  assert.deepEqual(D.TAGS, ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular', 'D1', 'D2']);
});

test('v() without forms leaves every tense to the conjugator', () => {
  const verb = D.v('pensar', 'to think', ['e→ie']);
  assert.deepEqual(verb.forms, {});
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  book.addVerbs([verb]);
  assert.deepEqual(verb.forms.present, ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']);
  assert.deepEqual(verb.forms.preterite, ['pensé', 'pensaste', 'pensó', 'pensamos', 'pensasteis', 'pensaron']);
});

test('addVerbs keeps forms typed by hand and flags tenses that break the regular pattern', () => {
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  tenses.register({ id: 'imperfect', mark: 'imp', persons: SIX });
  const pensar = D.v('pensar', 'x', ['e→ie'], SIX);
  const hablar = D.v('hablar', 'x', ['regular']);
  book.addVerbs([pensar, hablar]);
  assert.deepEqual(pensar.forms.present, SIX);
  assert.deepEqual(pensar.tricky, { present: true, preterite: false, imperfect: false });
  assert.deepEqual(hablar.tricky, { present: false, preterite: false, imperfect: false });
});

test('addLessons tags verbs with their book and rejects unknown verbs or books', () => {
  const { book } = freshBook();
  book.addVerbs([D.v('hablar', 'x', ['regular'])]);
  book.addLessons({ 'D1.2': ['hablar'] });
  assert.ok(book.verbs[0].tags.includes('D1'));
  assert.deepEqual(book.verbs[0].lessons, ['D1.2']);
  assert.throws(() => book.addLessons({ 'D1.2': ['comer'] }), /unknown verb/);
  assert.throws(() => book.addLessons({ 'D9.1': ['hablar'] }), /unknown book/);
});

test('irregularMap marks only the forms that differ from the plain pattern', () => {
  const verb = D.v('tener', 'x', ['-go', 'e→ie']);
  const irr = D.irregularMap(verb);
  assert.deepEqual(irr.present, [true, true, true, false, false, true]);
  assert.deepEqual(irr.imperfect, [false, false, false, false, false, false]);
  assert.ok(irr.preterite.every(Boolean));
  assert.equal(irr.participle, false);
  assert.deepEqual(irr.imperative.affirmative, [false, true, true, true, false, true]);
});

test('addVerbs accepts valid verbs and rejects duplicates', () => {
  const { book } = freshBook();
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  assert.equal(book.verbs.length, 1);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]), /duplicate verb: hablar/);
});

test('addVerbs rejects unknown tags and wrong form counts', () => {
  const { book } = freshBook();
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['bogus'], SIX)]), /unknown tag/);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], SIX.slice(0, 5))]), /needs 6/);
  assert.throws(() => book.addVerbs([D.v('hablar', 'x', ['regular'], ['a', 'b', 'c', 'd', 'e', ' '])]), /non-empty/);
});

test('addForms adds a new tense to existing verbs (future tenses)', () => {
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  book.addForms('preterite', { hablar: ['1', '2', '3', '4', '5', '6'] });
  assert.deepEqual(book.verbs[0].forms.preterite, ['1', '2', '3', '4', '5', '6']);
});

test('addForms rejects unknown verbs, unknown tenses, and bad lengths', () => {
  const { tenses, book } = freshBook();
  tenses.register({ id: 'preterite', mark: 'pret', persons: SIX });
  book.addVerbs([D.v('hablar', 'x', ['regular'], SIX)]);
  assert.throws(() => book.addForms('preterite', { comer: SIX }), /unknown verb/);
  assert.throws(() => book.addForms('imperfect', { hablar: SIX }), /unknown tense/);
  assert.throws(() => book.addForms('preterite', { hablar: ['a'] }), /needs 6/);
});

test('every verb-type chip has a menu name, a worked example and exactly one group', () => {
  const grouped = D.TYPE_GROUPS.flatMap((g) => g.tags);
  assert.deepEqual([...grouped].sort(), [...D.TYPE_TAGS].sort());
  for (const tag of D.TYPE_TAGS) {
    const info = D.TYPE_INFO[tag];
    assert.ok(info && info.name && /→/.test(info.example), tag);
  }
});
