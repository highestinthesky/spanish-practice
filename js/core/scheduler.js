(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const WEIGHTS = [8, 4, 2, 1, 0.5];
  const UNSEEN = 3;
  // A verb that follows the plain pattern in a tense comes up less often than one that breaks it.
  const PLAIN = 0.4;

  const MIN = 60 * 1000;
  // After a correct answer the whole verb rests, longer the better it is known (index = box after the answer).
  const REST_MS = [0, 2 * MIN, 15 * MIN, 60 * MIN, 24 * 60 * MIN];

  function itemKey(tenseId, inf, person) {
    return `${tenseId}|${inf}|${person}`;
  }

  const infOf = (key) => key.split('|')[1];

  // Book ('D1', 'D2', 'D3'; anything else means all) AND any of the chips (none means all) AND none of the
  // unticked types in off: a verb with any unticked type is left out (acostarse is o→ue and reflexive).
  function buildPool({ verbs, tense, chips, vosotros, book, off }) {
    const wanted = chips && chips.length ? new Set(chips) : null;
    const inBook = /^D\d$/.test(book) ? book : null;
    const unticked = off && off.length ? new Set(off) : null;
    const pool = [];
    for (const verb of verbs) {
      if (!verb.forms[tense.id]) continue;
      if (inBook && !verb.tags.includes(inBook)) continue;
      if (unticked && verb.tags.some((t) => unticked.has(t))) continue;
      if (wanted && !verb.tags.some((t) => wanted.has(t))) continue;
      const tricky = !verb.tricky || verb.tricky[tense.id] !== false;
      for (let person = 0; person < tense.persons.length; person += 1) {
        if (!vosotros && person === tense.vosotrosIndex) continue;
        pool.push({ key: itemKey(tense.id, verb.inf, person), verb, person, tense, tricky });
      }
    }
    return pool;
  }

  function weightOf(entry, tricky = true) {
    const base = !entry || !entry.seen ? UNSEEN : WEIGHTS[entry.box];
    return tricky ? base : base * PLAIN;
  }

  // Verbs whose most recent answer (any tense, any person) was right and is still inside its rest window.
  function restingVerbs(items, now) {
    const latest = new Map();
    for (const [key, e] of Object.entries(items)) {
      if (!e || !e.seen) continue;
      const inf = infOf(key);
      const prev = latest.get(inf);
      if (!prev || e.last >= prev.last) latest.set(inf, e);
    }
    const out = new Set();
    for (const [inf, e] of latest) {
      if (e.box > 0 && now < e.last + REST_MS[e.box]) out.add(inf);
    }
    return out;
  }

  const RECENT_VERBS = 8;
  // A form answered right does not come back for a day while the pool has others.
  const COOLDOWN_MS = 24 * 60 * MIN;

  // Never the same item twice running, no resting verb while the pool has awake ones, and no verb from the
  // recent window (newest last) while the pool has others. A small pool drops the oldest verbs from the window
  // until something is left.
  function pick(pool, items, last, rng, recent = [], now = null) {
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
    if (now != null) {
      const resting = restingVerbs(items, now);
      const awake = candidates.filter((p) => !resting.has(p.verb.inf));
      if (awake.length) candidates = awake;
      const cool = candidates.filter((p) => {
        const e = items[p.key];
        return !(e && e.seen && e.box > 0 && now < e.last + COOLDOWN_MS);
      });
      if (cool.length) candidates = cool;
    }
    for (let from = 0; from < recent.length; from += 1) {
      const avoid = new Set(recent.slice(from));
      const fresh = candidates.filter((p) => !avoid.has(p.verb.inf));
      if (fresh.length) {
        candidates = fresh;
        break;
      }
    }
    const weights = candidates.map((p) => weightOf(items[p.key], p.tricky !== false));
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < candidates.length; i += 1) {
      r -= weights[i];
      if (r < 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }

  D.scheduler = { WEIGHTS, UNSEEN, PLAIN, REST_MS, RECENT_VERBS, COOLDOWN_MS, itemKey, buildPool, weightOf, restingVerbs, pick };
})(typeof window !== 'undefined' ? window : globalThis);
