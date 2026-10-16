(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // A missed answer must be readable: a double-tap, a bouncing key or a held Enter must not skip the plate.
  const MIN_WRONG_MS = 400;

  function shouldIgnoreEnter({ mode, repeat, shownAt, now }) {
    if (repeat) return true;
    if (mode === 'wrong' && now - shownAt < MIN_WRONG_MS) return true;
    return false;
  }

  D.advanceGuard = { MIN_WRONG_MS, shouldIgnoreEnter };
})(typeof window !== 'undefined' ? window : globalThis);
