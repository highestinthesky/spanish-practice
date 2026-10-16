(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function createSession({ verbs, tenses, store, rng = Math.random, now = Date.now }) {
    let last = null;
    const usedVerbs = [];
    const recent = [];
    let right = 0;
    let total = 0;

    const settings = () => store.state().settings;
    const tense = () => tenses.get(settings().tense) || tenses.all()[0] || null;

    function poolFor(chips) {
      const t = tense();
      if (!t) return [];
      return D.scheduler.buildPool({ verbs, tense: t, chips, vosotros: settings().vosotros });
    }

    return {
      settings,
      tense,
      toggleChip(tag) {
        const set = new Set(settings().chips);
        if (set.has(tag)) set.delete(tag);
        else set.add(tag);
        store.setSetting('chips', Array.from(set));
      },
      setVosotros(on) {
        store.setSetting('vosotros', Boolean(on));
      },
      setTense(id) {
        if (tenses.get(id)) store.setSetting('tense', id);
      },
      next() {
        const t = tense();
        if (!t) return null;
        let pool = poolFor(settings().chips);
        if (!pool.length) pool = poolFor([]);
        const item = D.scheduler.pick(pool, store.state().items, last, rng, usedVerbs);
        if (!item) return null;
        last = { key: item.key, inf: item.verb.inf };
        usedVerbs.push(item.verb.inf);
        if (usedVerbs.length > D.scheduler.RECENT_VERBS) usedVerbs.shift();
        return {
          key: item.key,
          verb: item.verb,
          person: item.person,
          tenseId: t.id,
          personLabel: t.persons[item.person],
          expected: item.verb.forms[t.id][item.person],
        };
      },
      answer(prompt, text) {
        const r = D.normalize.check(text, prompt.expected);
        const ok = r.result === 'correct';
        store.record(prompt.key, ok, now());
        recent.push(ok ? 'ok' : 'no');
        if (recent.length > 10) recent.shift();
        total += 1;
        if (ok) right += 1;
        return { ok, result: r.result, marks: r.marks, expected: prompt.expected };
      },
      recent: () => recent.slice(),
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.createSession = createSession;
})(typeof window !== 'undefined' ? window : globalThis);
