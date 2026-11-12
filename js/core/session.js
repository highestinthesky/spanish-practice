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

    // The ticked tenses. Before the tense menu there was one tense, or 'mix' for all of them.
    const chosen = () => {
      const list = settings().tenses;
      if (Array.isArray(list)) return list;
      const old = settings().tense;
      if (old === MIX) return tenses.all().map((t) => t.id);
      return [(tenses.get(old) || tenses.all()[0] || {}).id].filter(Boolean);
    };
    const inPlay = () => tenses.all().filter((t) => chosen().includes(t.id));
    // Menu counts look past the tense choice when nothing is ticked, so the other options never read 0.
    const counted = () => (inPlay().length ? inPlay() : tenses.all());

    function poolFor({ book = settings().book, unticked = off(), chips = [], over = inPlay() } = {}) {
      const pool = [];
      for (const t of over) {
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
      tensesInPlay: inPlay,
      tenseOn: (id) => chosen().includes(id),
      toggleTense(id) {
        if (!tenses.get(id)) return;
        const set = new Set(chosen());
        if (set.has(id)) set.delete(id);
        else set.add(id);
        store.setSetting('tenses', tenses.all().map((t) => t.id).filter((x) => set.has(x)));
      },
      // Verbs of the chosen book and types that this tense would drill.
      tenseCount: (id) => {
        const t = tenses.get(id);
        return t ? distinctVerbs(poolFor({ over: [t] })) : 0;
      },
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
      countFor: (tag) => distinctVerbs(poolFor({ chips: [tag], unticked: [], over: counted() })),
      bookCount: (book) => distinctVerbs(poolFor({ book, unticked: [], over: counted() })),
      setVosotros(on) {
        store.setSetting('vosotros', Boolean(on));
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
