(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  D.MODES = [
    { id: 'conjugar', name: 'conjugar' },
    { id: 'vocab', name: 'vocab' },
    { id: 'pronombres', name: 'pronombres' },
    { id: 'gustar', name: 'gustar' },
    { id: 'lectura', name: 'lectura' },
    { id: 'mezcla', name: 'mezcla' },
  ];

  /* ---------- helpers ---------- */

  const slug = (s) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Seeded by the item id, so an item's options keep the same order on every visit.
  function rngFor(id) {
    let h = 2166136261;
    for (const ch of id) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
    let a = h >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // options[0] is the answer on the way in; shuffled, with the answer's new index.
  function choice(id, options) {
    const order = shuffle(options, rngFor(id));
    return { options: order, correct: order.indexOf(options[0]) };
  }

  // Three wrong options, preferring the same group, never repeating the answer.
  function distractors(id, answer, near, far) {
    const rng = rngFor(`${id}:d`);
    const pickFrom = (pool, n) => shuffle(pool.filter((x) => x !== answer), rng).slice(0, n);
    const first = pickFrom(Array.from(new Set(near)), 3);
    const rest = pickFrom(Array.from(new Set(far)).filter((x) => !first.includes(x)), 3 - first.length);
    return [...first, ...rest];
  }

  // Accepted Spanish for a vocab entry: with its article, and the bare word for nouns.
  function forms(es) {
    const m = es.match(/^(el\/la|el|la|los|las) (.+)$/);
    if (!m) return [es];
    if (m[1] === 'el/la') return [`el ${m[2]}`, `la ${m[2]}`, m[2]];
    return [es, m[2]];
  }

  /* ---------- vocab ---------- */

  function buildVocab() {
    const items = [];
    const allEn = L2.vocab.map((w) => w.en);
    for (const w of L2.vocab) {
      const id = `v:es:${slug(w.es)}`;
      const near = L2.vocab.filter((x) => x.group === w.group && x.en !== w.en).map((x) => x.en);
      items.push({
        id, mode: 'vocab', skill: 'es-en', group: w.group, big: w.es, lang: 'es',
        ...choice(id, [w.en, ...distractors(id, w.en, near, allEn)]),
      });
    }
    // One en → es card per meaning, accepting every word that has it (anotar and marcar).
    const byEn = new Map();
    for (const w of L2.vocab) {
      if (!byEn.has(w.en)) byEn.set(w.en, []);
      byEn.get(w.en).push(w);
    }
    for (const [en, words] of byEn) {
      const answers = Array.from(new Set(words.flatMap((w) => [...forms(w.es), ...w.also.flatMap(forms)])));
      items.push({ id: `v:en:${slug(en)}`, mode: 'vocab', skill: 'en-es', group: words[0].group, big: en, lang: 'en', answers });
    }
    for (const c of L2.context) {
      const id = `v:cx:${c.id}`;
      items.push({ id, mode: 'vocab', skill: 'contexto', group: c.group, prompt: c.prompt, why: c.why, ...choice(id, c.options) });
    }
    return items;
  }

  /* ---------- pronouns ---------- */

  function buildPronouns() {
    return L2.pronouns.map((p) => {
      const id = `p:${p.skill}:${p.id}`;
      const base = { id, mode: 'pronombres', skill: p.skill, prompt: p.prompt, why: p.why, vos: p.vos, form: p.kind };
      return p.kind === 'choice' ? { ...base, ...choice(id, p.options) } : { ...base, answers: p.answers };
    });
  }

  /* ---------- gustar ---------- */

  function buildGustar() {
    const items = [];
    for (const v of L2.gustarVerbs) {
      for (const exp of L2.EXPERIENCERS) {
        for (const t of v.things) {
          const form = t.n === 'pl' ? v.pl : v.sg;
          items.push({
            id: `g:${slug(v.inf)}:${exp.id}:${t.id}`,
            mode: 'gustar', skill: 'forma', form: 'gap', number: t.n, vos: Boolean(exp.vos),
            prompt: `${exp.a} ___ (${v.inf}) ${t.t}.`,
            answers: [`${exp.p} ${form}`],
            why: `${t.t}: ${t.n === 'pl' ? 'plural' : 'singular'} → ${form} · ${exp.a.toLowerCase()} → ${exp.p}`,
          });
        }
      }
    }
    const allEn = L2.gustarVerbs.map((v) => v.en);
    for (const v of L2.gustarVerbs) {
      const id = `gm:${slug(v.inf)}`;
      items.push({ id, mode: 'gustar', skill: 'significado', big: v.inf, lang: 'es', ...choice(id, [v.en, ...distractors(id, v.en, allEn, allEn)]) });
    }
    for (const a of L2.gustarA) {
      const id = `ga:${a.id}`;
      const base = { id, mode: 'gustar', skill: 'a', prompt: a.prompt, why: a.why, vos: Boolean(a.vos), form: a.kind };
      items.push(a.kind === 'choice' ? { ...base, ...choice(id, a.options) } : { ...base, answers: a.answers });
    }
    for (const t of L2.gustarTranslate) {
      items.push({ id: `gt:${t.id}`, mode: 'gustar', skill: 'traduccion', form: 'en', prompt: t.prompt, lang: 'en', answers: t.answers });
    }
    return items;
  }

  const BUILT = { vocab: buildVocab(), pronombres: buildPronouns(), gustar: buildGustar() };

  const FILTERS = {
    vocab: [
      {
        id: 'kind', name: 'ejercicio', items: [
          { id: 'es-en', name: 'es → en', example: 'la taquilla → box office' },
          { id: 'en-es', name: 'en → es', example: 'box office → la taquilla' },
          { id: 'contexto', name: 'en contexto', example: 'hacer ___ dos horas' },
        ],
      },
      { id: 'tema', name: 'tema', items: L2.VOCAB_GROUPS },
    ],
    pronombres: [{ id: 'skill', name: 'ejercicio', items: L2.PRONOUN_SKILLS }],
    gustar: [{ id: 'skill', name: 'ejercicio', items: L2.GUSTAR_SKILLS }],
  };

  const keep = (it, off, vosotros) => (vosotros || !it.vos) && !off.includes(it.skill) && !off.includes(it.group);

  L2.filters = (mode) => FILTERS[mode] || [];

  // What a mode drills under the given settings. mezcla is the three decks together, each under its own filters.
  L2.items = (mode, settings) => {
    if (mode === 'mezcla') return ['vocab', 'pronombres', 'gustar'].flatMap((m) => L2.items(m, settings));
    const off = (settings.ex && settings.ex[mode]) || [];
    return (BUILT[mode] || []).filter((it) => keep(it, off, settings.vosotros));
  };

  // Items carrying this filter, whatever else is unticked.
  L2.count = (mode, filterId, settings) =>
    (BUILT[mode] || []).filter((it) => (it.skill === filterId || it.group === filterId) && keep(it, [], settings.vosotros)).length;

  L2.skillName = (item) => {
    for (const group of FILTERS[item.mode] || []) {
      const hit = group.items.find((f) => f.id === item.skill);
      if (hit) return hit.name;
    }
    return item.skill;
  };

  /* ---------- reading ---------- */

  // Flat list of parts: text, gloss ([[word|gloss]]), ref ({{word|id}}) and a break between paragraphs.
  L2.parseReading = (text) => {
    const parts = [];
    text.split(/\n\s*\n/).forEach((para, i) => {
      if (i) parts.push({ type: 'break' });
      const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\{\{([^|}]+)\|([^}]+)\}\}/g;
      let at = 0;
      let m;
      while ((m = re.exec(para))) {
        if (m.index > at) parts.push({ type: 'text', text: para.slice(at, m.index) });
        if (m[1]) parts.push({ type: 'gloss', text: m[1], gloss: m[2] });
        else parts.push({ type: 'ref', text: m[3], id: m[4] });
        at = re.lastIndex;
      }
      if (at < para.length) parts.push({ type: 'text', text: para.slice(at) });
    });
    return parts;
  };

  L2.readings = L2.readings.map((r) => ({
    ...r,
    questions: r.questions.map((qn, i) => {
      if (qn.fixed) return qn;
      return { ...qn, ...choice(`r:${r.id}:${i}`, qn.options) };
    }),
  }));
})(typeof window !== 'undefined' ? window : globalThis);
