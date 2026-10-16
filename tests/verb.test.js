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
  assert.deepEqual(D.TAGS, ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular']);
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
