'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./helpers/load')();

const { shouldIgnoreEnter, MIN_WRONG_MS } = D.advanceGuard;

test('the wrong plate stays up for at least 400 ms', () => {
  assert.equal(MIN_WRONG_MS, 400);
});

test('held-down Enter (repeat) is ignored in every mode (Review Focus 5)', () => {
  for (const mode of ['asking', 'correct', 'wrong']) {
    assert.equal(shouldIgnoreEnter({ mode, repeat: true, shownAt: 0, now: 99999 }), true, mode);
  }
});

test('a second Enter right after a wrong answer cannot dismiss the plate (Review Focus 5)', () => {
  assert.equal(shouldIgnoreEnter({ mode: 'wrong', repeat: false, shownAt: 1000, now: 1080 }), true);
  assert.equal(shouldIgnoreEnter({ mode: 'wrong', repeat: false, shownAt: 1000, now: 1399 }), true);
});

test('Enter dismisses the wrong plate once 400 ms have passed', () => {
  assert.equal(shouldIgnoreEnter({ mode: 'wrong', repeat: false, shownAt: 1000, now: 1400 }), false);
  assert.equal(shouldIgnoreEnter({ mode: 'wrong', repeat: false, shownAt: 1000, now: 5000 }), false);
});

test('Enter is never delayed while asking or after a correct answer', () => {
  assert.equal(shouldIgnoreEnter({ mode: 'asking', repeat: false, shownAt: 0, now: 0 }), false);
  assert.equal(shouldIgnoreEnter({ mode: 'correct', repeat: false, shownAt: 0, now: 0 }), false);
});
