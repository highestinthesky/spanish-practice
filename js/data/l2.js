(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  const { slug, choice, distractors, vocabItems } = D.lessonKit;

  /* ---------- vocab ---------- */

  function buildVocab() {
    // Lección 2 ids predate the lesson registry (v:es:…, v:en:…); kept so saved progress still counts.
    const items = vocabItems('v', L2.vocab).map((it) => ({ ...it, mode: 'vocab' }));
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
      items.push({ id: `gt:${t.id}`, mode: 'gustar', skill: 'traduccion', form: 'en', prompt: t.prompt, lang: 'en', answers: t.answers, vos: Boolean(t.vos) });
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

  L2.parseReading = D.lessons.parseReading;

  D.addLesson({
    id: 'D3.2',
    title: 'Las diversiones',
    filters: [
      ...FILTERS.vocab.map((g) => ({ ...g, name: `vocab · ${g.name}` })),
      { ...FILTERS.pronombres[0], name: 'pronombres' },
      { ...FILTERS.gustar[0], name: 'gustar' },
      { id: 'reflexivos', name: 'reflexivos', items: L2.REFLEXIVE_SKILLS },
    ],
    build: () => [...BUILT.vocab, ...BUILT.pronombres, ...BUILT.gustar, ...L2.reflexives],
    readings: L2.readings,
  });
  L2.readings = D.lessons.readings().filter((r) => r.lesson === 'D3.2');
})(typeof window !== 'undefined' ? window : globalThis);
