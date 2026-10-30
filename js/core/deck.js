(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // A missed item comes back after this many others, as in the conjugation drill.
  const RETRY_AFTER = 3;
  const RECENT = 4;
  // Pick weight by Leitner box: missed items (box 0) come up most, mastered ones (box 4) least.
  const WEIGHT = [8, 5, 3, 2, 1];
  const NEUTRAL_BOX = 2;

  // Exercise answers are sentences: Spanish opening marks and final punctuation do not count.
  function norm(s) {
    return D.normalize
      .norm(s)
      .replace(/[¿¡]/g, '')
      .replace(/[.!?…]+$/g, '')
      .replace(/\s*,\s*/g, ', ')
      .trim();
  }

  function marks(answer, expected) {
    const a = Array.from(answer);
    return Array.from(expected).map((ch, i) => a[i] !== ch);
  }

  // Any listed answer is right. A near miss is compared with the closest answer so the marks make sense.
  function check(text, answers) {
    const a = norm(text);
    const list = answers.map(norm);
    const hit = list.findIndex((e) => e === a);
    if (hit >= 0) return { result: 'correct', marks: marks(a, list[hit]), expected: answers[hit] };
    const bare = D.normalize.stripAcute(a);
    const near = list.findIndex((e) => D.normalize.stripAcute(e) === bare);
    if (near >= 0) return { result: 'accent', marks: marks(a, list[near]), expected: answers[near] };
    return { result: 'wrong', marks: marks(a, list[0]), expected: answers[0] };
  }

  function createDeck({ items, store, rng = Math.random, now = Date.now }) {
    const recent = [];
    let retries = [];
    let served = 0;
    let right = 0;
    let total = 0;
    let streak = 0;
    let best = 0;

    const keyOf = (item) => `ex:${item.id}`;

    function dueRetry(pool) {
      const ids = new Set(pool.map((it) => it.id));
      retries = retries.filter((r) => ids.has(r.item.id));
      const last = recent[recent.length - 1];
      const i = retries.findIndex((r) => r.due <= served && r.item.id !== last);
      return i < 0 ? null : retries.splice(i, 1)[0].item;
    }

    function pick(pool) {
      const fresh = pool.filter((it) => !recent.includes(it.id));
      const lastId = recent[recent.length - 1];
      const from = fresh.length ? fresh : pool.filter((it) => it.id !== lastId);
      const list = from.length ? from : pool;
      const saved = store.state().items;
      const weights = list.map((it) => {
        const e = saved[keyOf(it)];
        // Generated families (306 gustar forms) carry a weight so they do not crowd out the hand-written items.
        return WEIGHT[e ? e.box : NEUTRAL_BOX] * (it.weight || 1);
      });
      let r = rng() * weights.reduce((s, w) => s + w, 0);
      for (let i = 0; i < list.length; i += 1) {
        r -= weights[i];
        if (r < 0) return list[i];
      }
      return list[list.length - 1];
    }

    return {
      size: () => items().length,
      next() {
        const pool = items();
        if (!pool.length) return null;
        let item = dueRetry(pool);
        const retry = Boolean(item);
        if (!item) item = pick(pool);
        served += 1;
        recent.push(item.id);
        if (recent.length > RECENT) recent.shift();
        const entry = store.state().items[keyOf(item)];
        const missed = entry && entry.seen && entry.box === 0 ? entry.misses : 0;
        return { key: keyOf(item), item, retry, missed };
      },
      // Choice items take the index of the option picked; typed items take the text.
      answer(prompt, given) {
        const { item } = prompt;
        let res;
        if (item.options) {
          const ok = given === item.correct;
          res = { ok, result: ok ? 'correct' : 'wrong', expected: item.options[item.correct], picked: given, marks: [] };
        } else {
          const r = check(given, item.answers);
          res = { ok: r.result === 'correct', result: r.result, expected: r.expected, marks: r.marks };
        }
        store.record(prompt.key, res.ok, now());
        retries = retries.filter((r) => r.item.id !== item.id);
        if (!res.ok) retries.push({ item, due: served + RETRY_AFTER });
        total += 1;
        if (res.ok) right += 1;
        streak = res.ok ? streak + 1 : 0;
        if (streak > best) best = streak;
        return res;
      },
      streak: () => streak,
      best: () => best,
      count: () => total,
      accuracy: () => (total ? Math.round((100 * right) / total) : null),
    };
  }

  D.exercise = { norm, check, RETRY_AFTER };
  D.createDeck = createDeck;
})(typeof window !== 'undefined' ? window : globalThis);
