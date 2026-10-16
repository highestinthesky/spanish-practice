(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  const MIX = 'mix';
  // A missed form comes back after this many other prompts, marked as a retry.
  const RETRY_AFTER = 3;

  function createSession({ verbs, tenses, store, rng = Math.random, now = Date.now }) {
    let last = null;
    const usedVerbs = [];
    const recent = [];
    let retries = [];
    let served = 0;
    let right = 0;
    let total = 0;

    const settings = () => store.state().settings;
    const mixed = () => settings().tense === MIX && tenses.all().length > 0;
    const tense = () => tenses.get(settings().tense) || tenses.all()[0] || null;
    const inPlay = () => (mixed() ? tenses.all() : [tense()].filter(Boolean));

    function poolFor(chips) {
      const pool = [];
      for (const t of inPlay()) pool.push(...D.scheduler.buildPool({ verbs, tense: t, chips, vosotros: settings().vosotros }));
      return pool;
    }

    function dueRetry() {
      const ids = new Set(inPlay().map((t) => t.id));
      retries = retries.filter((r) => ids.has(r.tense.id) && (settings().vosotros || r.person !== r.tense.vosotrosIndex));
      const i = retries.findIndex((r) => r.due <= served && (!last || r.key !== last.key));
      return i < 0 ? null : retries.splice(i, 1)[0];
    }

    return {
      settings,
      tense,
      mixed,
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
        if (id === MIX || tenses.get(id)) store.setSetting('tense', id);
      },
      next() {
        if (!inPlay().length) return null;
        let item = dueRetry();
        const retry = Boolean(item);
        if (!item) {
          let pool = poolFor(settings().chips);
          if (!pool.length) pool = poolFor([]);
          item = D.scheduler.pick(pool, store.state().items, last, rng, usedVerbs, now());
        }
        if (!item) return null;
        served += 1;
        last = { key: item.key, inf: item.verb.inf };
        usedVerbs.push(item.verb.inf);
        if (usedVerbs.length > D.scheduler.RECENT_VERBS) usedVerbs.shift();
        const entry = store.state().items[item.key];
        // Last answer on this exact form was wrong (this session or an earlier one).
        const missed = entry && entry.seen && entry.box === 0 ? entry.misses : 0;
        return {
          key: item.key,
          verb: item.verb,
          person: item.person,
          tense: item.tense,
          tenseId: item.tense.id,
          personLabel: item.tense.persons[item.person],
          expected: item.verb.forms[item.tense.id][item.person],
          retry,
          missed,
          item,
        };
      },
      answer(prompt, text) {
        const r = D.normalize.check(text, prompt.expected);
        const ok = r.result === 'correct';
        store.record(prompt.key, ok, now());
        retries = retries.filter((x) => x.key !== prompt.key);
        if (!ok && prompt.item) retries.push({ ...prompt.item, due: served + RETRY_AFTER });
        recent.push(ok ? 'ok' : 'no');
        if (recent.length > 10) recent.shift();
        total += 1;
        if (ok) right += 1;
        return { ok, result: r.result, marks: r.marks, expected: prompt.expected };
      },
      pendingRetries: () => retries.length,
      recent: () => recent.slice(),
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.MIX = MIX;
  D.RETRY_AFTER = RETRY_AFTER;
  D.createSession = createSession;
})(typeof window !== 'undefined' ? window : globalThis);
