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
