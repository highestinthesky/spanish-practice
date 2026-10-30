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
    let streak = 0;
    let best = 0;

    const settings = () => store.state().settings;

    // Older menus saved an include-list of chips (books mixed in). Turn it into the book setting and the
    // list of unticked types once, so the student keeps what they had chosen.
    {
      const chips = settings().chips || [];
      if (chips.length) {
        const books = chips.filter((c) => /^D\d$/.test(c));
        const types = chips.filter((c) => !books.includes(c));
        if (books.length === 1) store.setSetting('book', books[0]);
        if (types.length) store.setSetting('off', (D.TYPE_TAGS || []).filter((t) => !types.includes(t)));
        store.setSetting('chips', []);
      }
    }
    const off = () => settings().off || [];

    const mixed = () => settings().tense === MIX && tenses.all().length > 0;
    const tense = () => tenses.get(settings().tense) || tenses.all()[0] || null;
    const inPlay = () => (mixed() ? tenses.all() : [tense()].filter(Boolean));

    function poolFor({ book = settings().book, unticked = off(), chips = [] } = {}) {
      const pool = [];
      for (const t of inPlay()) {
        pool.push(...D.scheduler.buildPool({ verbs, tense: t, chips, book, off: unticked, vosotros: settings().vosotros }));
      }
      return pool;
    }

    // Exactly what the menu says: no fallback. An empty selection gives an empty pool.
    const activePool = () => poolFor();
    const allowed = (verb) => {
      const book = settings().book;
      if (/^D\d$/.test(book) && !verb.tags.includes(book)) return false;
      return !verb.tags.some((t) => off().includes(t));
    };

    const distinctVerbs = (pool) => new Set(pool.map((p) => p.verb.inf)).size;

    function dueRetry() {
      const ids = new Set(inPlay().map((t) => t.id));
      retries = retries.filter(
        (r) => ids.has(r.tense.id) && allowed(r.verb) && (settings().vosotros || r.person !== r.tense.vosotrosIndex)
      );
      const i = retries.findIndex((r) => r.due <= served && (!last || r.key !== last.key));
      return i < 0 ? null : retries.splice(i, 1)[0];
    }

    return {
      settings,
      tense,
      mixed,
      // Every type starts ticked; off lists the unticked ones.
      typeOn: (tag) => !off().includes(tag),
      toggleType(tag) {
        const set = new Set(off());
        if (set.has(tag)) set.delete(tag);
        else set.add(tag);
        store.setSetting('off', Array.from(set));
      },
      setAllTypes(on) {
        store.setSetting('off', on ? [] : (D.TYPE_TAGS || []).slice());
      },
      setBook(book) {
        if ((D.BOOKS || ['all']).includes(book)) store.setSetting('book', book);
      },
      // Distinct verbs in the pool being drilled, and per-option counts for the menu.
      poolSize: () => distinctVerbs(activePool()),
      // How many verbs of the chosen book have this type, whatever else is ticked.
      countFor: (tag) => distinctVerbs(poolFor({ chips: [tag], unticked: [] })),
      bookCount: (book) => distinctVerbs(poolFor({ book, unticked: [] })),
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
        if (!item) item = D.scheduler.pick(activePool(), store.state().items, last, rng, usedVerbs, now());
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
        const ok = D.normalize.passes(r.result, store.state().settings.strictAccents);
        store.record(prompt.key, ok, now());
        retries = retries.filter((x) => x.key !== prompt.key);
        if (!ok && prompt.item) retries.push({ ...prompt.item, due: served + RETRY_AFTER });
        recent.push(ok ? 'ok' : 'no');
        if (recent.length > 10) recent.shift();
        total += 1;
        if (ok) right += 1;
        streak = ok ? streak + 1 : 0;
        if (streak > best) best = streak;
        return { ok, result: r.result, marks: r.marks, expected: prompt.expected };
      },
      pendingRetries: () => retries.length,
      recent: () => recent.slice(),
      streak: () => streak,
      best: () => best,
      count: () => total,
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.MIX = MIX;
  D.RETRY_AFTER = RETRY_AFTER;
  D.createSession = createSession;
})(typeof window !== 'undefined' ? window : globalThis);
