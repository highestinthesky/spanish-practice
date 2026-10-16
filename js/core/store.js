(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const KEY = 'conjugacion.v1';
  const NEUTRAL_BOX = 2;

  function defaults() {
    return { items: {}, settings: { chips: [], vosotros: true, tense: 'present' } };
  }

  function isCount(n) {
    return Number.isInteger(n) && n >= 0;
  }

  function sanitize(raw) {
    const out = defaults();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    if (raw.items && typeof raw.items === 'object') {
      for (const [key, e] of Object.entries(raw.items)) {
        if (!e || typeof e !== 'object') continue;
        if (!Number.isInteger(e.box) || e.box < 0 || e.box > 4) continue;
        if (!isCount(e.seen) || !isCount(e.misses)) continue;
        out.items[key] = { box: e.box, seen: e.seen, misses: e.misses, last: Number.isFinite(e.last) ? e.last : 0 };
      }
    }
    const s = raw.settings;
    if (s && typeof s === 'object') {
      if (Array.isArray(s.chips)) out.settings.chips = s.chips.filter((c) => typeof c === 'string');
      if (typeof s.vosotros === 'boolean') out.settings.vosotros = s.vosotros;
      if (typeof s.tense === 'string' && s.tense) out.settings.tense = s.tense;
    }
    return out;
  }

  // getStorage is a function so that merely touching window.localStorage (which can throw) happens inside try.
  function createStore(getStorage) {
    let state = defaults();
    try {
      const raw = getStorage().getItem(KEY);
      if (raw) state = sanitize(JSON.parse(raw));
    } catch (e) {
      state = defaults();
    }

    function persist() {
      try {
        getStorage().setItem(KEY, JSON.stringify(state));
      } catch (e) {
        /* progress stays in memory for this session */
      }
    }

    return {
      state: () => state,
      record(key, correct, now) {
        const e = state.items[key] || { box: NEUTRAL_BOX, seen: 0, misses: 0, last: 0 };
        e.seen += 1;
        if (correct) {
          e.box = Math.min(e.box + 1, 4);
        } else {
          e.box = 0;
          e.misses += 1;
        }
        e.last = now;
        state.items[key] = e;
        persist();
      },
      setSetting(name, value) {
        state.settings[name] = value;
        persist();
      },
      clear() {
        state = defaults();
        try {
          getStorage().removeItem(KEY);
        } catch (e) {
          /* nothing stored, or storage blocked */
        }
      },
    };
  }

  D.STORE_KEY = KEY;
  D.createStore = createStore;

  // Created on first use so Node (tests) never touches localStorage.
  let shared = null;
  Object.defineProperty(D, 'store', {
    configurable: true,
    get() {
      return shared || (shared = createStore(() => root.localStorage));
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
