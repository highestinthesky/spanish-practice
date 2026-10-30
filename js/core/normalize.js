(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function norm(s) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  // Only the acute accent counts as an accent. ñ (n + tilde) and ü (u + diaeresis) are different letters.
  function stripAcute(s) {
    return s.normalize('NFD').replace(/́/g, '').normalize('NFC');
  }

  function marks(answer, expected) {
    const a = Array.from(answer);
    return Array.from(expected).map((ch, i) => a[i] !== ch);
  }

  function check(answer, expected) {
    const a = norm(answer);
    const e = norm(expected);
    const m = marks(a, e);
    if (a === e) return { result: 'correct', marks: m };
    if (stripAcute(a) === stripAcute(e)) return { result: 'accent', marks: m };
    return { result: 'wrong', marks: m };
  }

  // Loose grading (the default) counts an accent-only slip as right; the UI still points it out.
  function passes(result, strict) {
    return result === 'correct' || (result === 'accent' && !strict);
  }

  D.normalize = { norm, stripAcute, check, passes };
})(typeof window !== 'undefined' ? window : globalThis);
