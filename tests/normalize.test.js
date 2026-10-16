'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const { norm, stripAcute, check } = D.normalize;

test('norm trims, collapses whitespace, lowercases', () => {
  assert.equal(norm('  Me   LEVANTO '), 'me levanto');
});

test('norm treats non-breaking spaces as spaces', () => {
  assert.equal(norm('me levanto '), 'me levanto');
});

test('norm converts decomposed accents to composed form', () => {
  assert.equal(norm('pensáis'), 'pensáis');
});

test('stripAcute removes only acute accents', () => {
  assert.equal(stripAcute('pensáis'), 'pensais');
  assert.equal(stripAcute('baño'), 'baño');
  assert.equal(stripAcute('güe'), 'güe');
});

test('check: exact match is correct with no marks', () => {
  const r = check('pienso', 'pienso');
  assert.equal(r.result, 'correct');
  assert.deepEqual(r.marks, [false, false, false, false, false, false]);
});

test('check: case and spacing are forgiven (Review Focus 1)', () => {
  assert.equal(check('  PIENSO ', 'pienso').result, 'correct');
  assert.equal(check(' Me  Levanto ', 'me levanto').result, 'correct');
});

test('check: decomposed accent input is correct (Review Focus 2)', () => {
  assert.equal(check('pensáis', 'pensáis').result, 'correct');
});

test('check: missing accent is an accent miss and marks only the accent', () => {
  const r = check('pensais', 'pensáis');
  assert.equal(r.result, 'accent');
  assert.deepEqual(r.marks, [false, false, false, false, true, false, false]);
});

test('check: n for ñ is wrong, not an accent miss (Review Focus 4)', () => {
  const r = check('bano', 'baño');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [false, false, true, false]);
});

test('check: wrong ending marks the differing letters', () => {
  const r = check('piensan', 'pienso');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [false, false, false, false, false, true]);
});

test('check: reflexive verb without the pronoun is wrong (Review Focus 4)', () => {
  const r = check('levanto', 'me levanto');
  assert.equal(r.result, 'wrong');
  assert.equal(r.marks.length, 'me levanto'.length);
});

test('check: empty answer is wrong and marks every letter', () => {
  const r = check('', 'pienso');
  assert.equal(r.result, 'wrong');
  assert.deepEqual(r.marks, [true, true, true, true, true, true]);
});

test('check: marks always match the length of the normalised expected form', () => {
  assert.equal(check('x', 'Me Levanto').marks.length, 10);
});
