(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const WEIGHTS = [8, 4, 2, 1, 0.5];
  const UNSEEN = 3;

  function itemKey(tenseId, inf, person) {
    return `${tenseId}|${inf}|${person}`;
  }

  function buildPool({ verbs, tense, chips, vosotros }) {
    const wanted = chips && chips.length ? new Set(chips) : null;
    const pool = [];
    for (const verb of verbs) {
      if (!verb.forms[tense.id]) continue;
      if (wanted && !verb.tags.some((t) => wanted.has(t))) continue;
      for (let person = 0; person < tense.persons.length; person += 1) {
        if (!vosotros && person === tense.vosotrosIndex) continue;
        pool.push({ key: itemKey(tense.id, verb.inf, person), verb, person });
      }
    }
    return pool;
  }

  function weightOf(entry) {
    if (!entry || !entry.seen) return UNSEEN;
    return WEIGHTS[entry.box];
  }

  // Never the same item twice running; prefer a different verb from the last one when the pool allows it.
  function pick(pool, items, last, rng) {
    if (!pool.length) return null;
    let candidates = pool;
    if (last) {
      const otherKey = pool.filter((p) => p.key !== last.key);
      if (otherKey.length) {
        candidates = otherKey;
        const otherVerb = otherKey.filter((p) => p.verb.inf !== last.inf);
        if (otherVerb.length) candidates = otherVerb;
      }
    }
    const weights = candidates.map((p) => weightOf(items[p.key]));
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < candidates.length; i += 1) {
      r -= weights[i];
      if (r < 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }

  D.scheduler = { WEIGHTS, UNSEEN, itemKey, buildPool, weightOf, pick };
})(typeof window !== 'undefined' ? window : globalThis);
