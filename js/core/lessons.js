(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Every Descubre lesson registers here with its skills, its items and its readings. Items are built on
  // first use, so the verb data and the conjugator can load after this file.

  // In a lesson deck each skill weighs about as much as this many hand-written items, however many it has,
  // so 300 generated verb forms do not crowd out 15 sentences.
  const SKILL_SIZE = 24;
  const VOCAB_SKILLS = ['es-en', 'en-es', 'contexto'];

  /* ---------- kit: shared by every lesson file ---------- */

  const slug = (s) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function hash(s) {
    let h = 2166136261;
    for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
    return (h >>> 0).toString(36);
  }

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

  // Hand-written items, one per line:   kind | prompt | answers | why [| vos]
  //   g: type the word(s) for ___ · r: say it again (rewrite) · t: translate the English · c: choice, first right
  // Alternatives are separated by " / ". Lines starting with # are notes.
  function parse(lesson, skill, text) {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((line) => {
        const [kind, prompt, alts = '', why = '', flag = ''] = line.split('|').map((s) => s.trim());
        const list = alts.split(' / ').map((s) => s.trim()).filter(Boolean);
        const id = `${lesson}:${skill}:${hash(prompt)}`;
        const base = { id, skill, prompt, why, vos: flag === 'vos' };
        if (!prompt || !list.length) throw new Error(`${lesson}/${skill}: incomplete line "${line}"`);
        if (kind === 'c') return { ...base, form: 'choice', ...choice(id, list) };
        if (kind === 't') return { ...base, form: 'en', lang: 'en', answers: list };
        if (kind === 'r') return { ...base, form: 'rewrite', answers: list };
        if (kind === 'g') return { ...base, form: 'gap', answers: list };
        throw new Error(`${lesson}/${skill}: unknown kind "${kind}" in "${line}"`);
      });
  }

  // Vocabulary, one word per line:   español = English [= also accepted / …]
  function words(group, text) {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((line) => {
        const [es, en, also = ''] = line.split(' = ').map((s) => s.trim());
        if (!es || !en) throw new Error(`vocab ${group}: bad line "${line}"`);
        return { group, es, en, also: also ? also.split(' / ').map((s) => s.trim()) : [] };
      });
  }

  // es → en (pick the meaning) and en → es (type the word) for every entry. One en → es card per meaning.
  function vocabItems(lesson, list) {
    const items = [];
    const allEn = list.map((w) => w.en);
    for (const w of list) {
      const id = `${lesson}:es:${slug(w.es)}`;
      const near = list.filter((x) => x.group === w.group && x.en !== w.en).map((x) => x.en);
      items.push({ id, skill: 'es-en', group: w.group, big: w.es, lang: 'es', ...choice(id, [w.en, ...distractors(id, w.en, near, allEn)]) });
    }
    const byEn = new Map();
    for (const w of list) {
      if (!byEn.has(w.en)) byEn.set(w.en, []);
      byEn.get(w.en).push(w);
    }
    for (const [en, ws] of byEn) {
      const answers = Array.from(new Set(ws.flatMap((w) => [...forms(w.es), ...w.also.flatMap(forms)])));
      items.push({ id: `${lesson}:en:${slug(en)}`, skill: 'en-es', group: ws[0].group, big: en, lang: 'en', answers });
    }
    return items;
  }

  /* ---------- verb forms from the conjugator ---------- */

  const SUBJECTS = [['Yo'], ['Tú'], ['Él', 'Ella', 'Usted', 'Mi hermano', 'La profesora'], ['Nosotros', 'Nosotras'], ['Vosotros'], ['Ellos', 'Ellas', 'Ustedes', 'Mis amigos']];
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  // What leads each tense into a sentence, so the form has a reason to be that tense.
  const LEAD = {
    present: '',
    preterite: 'Ayer',
    imperfect: 'De pequeños, todos los veranos',
    future: 'Mañana',
    conditional: 'Con más tiempo,',
    subjunctive: 'Es importante que',
    pastSubjunctive: 'Era importante que',
    perfect: 'Esta semana',
    pluperfect: 'Antes de las ocho,',
  };
  const ESTAR = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];
  const CMD = { 1: 'tú', 2: 'usted', 3: 'nosotros', 4: 'vosotros', 5: 'ustedes' };

  function verbNamed(inf) {
    const v = D.verbs.find((x) => x.inf === inf);
    if (!v) throw new Error(`unknown verb ${inf}`);
    return v;
  }

  // tense: a conjugator key, or gerund, or cmd (with persons [1..5] and sign + or -).
  function conj(lesson, skill, { tense, verbs, persons = [0, 1, 2, 3, 4, 5], sign = '+' }) {
    const items = [];
    for (const inf of verbs) {
      const verb = verbNamed(inf);
      const table = D.tableOf(verb);
      for (const p of persons) {
        const rng = rngFor(`${inf}:${p}:${tense}`);
        const subj = SUBJECTS[p][Math.floor(rng() * SUBJECTS[p].length)];
        const id = `${lesson}:${skill}:${tense}${tense === 'cmd' ? sign : ''}:${slug(inf)}:${p}`;
        // Half the weight of a hand-written sentence in the same skill: the forms are drill, the sentences are use.
        const base = { id, skill, form: 'gap', vos: p === 4, verb: inf, weight: 0.5 };
        if (tense === 'gerund') {
          items.push({ ...base, prompt: `${subj} ${ESTAR[p]} ___ (${inf}).`, answers: [table.gerund] });
        } else if (tense === 'cmd') {
          const f = table.imperative[sign === '+' ? 'affirmative' : 'negative'][p];
          if (!f) continue;
          const shown = sign === '+' ? f : f.replace(/^no /, '');
          items.push({ ...base, prompt: sign === '+' ? `(${CMD[p]}) ¡___! (${inf})` : `(${CMD[p]}) ¡No ___! (${inf})`, answers: [shown] });
        } else {
          const f = table[tense][p];
          const lead = LEAD[tense];
          const who = lead ? `${lead} ${lower(subj)}` : subj;
          items.push({ ...base, prompt: `${who} ___ (${inf}).`, answers: [f] });
        }
      }
    }
    return items;
  }

  /* ---------- registry ---------- */

  const BOOK_ORDER = { D1: 1, D2: 2, D3: 3 };
  const order = (id) => {
    const [book, n] = id.split('.');
    return BOOK_ORDER[book] * 100 + Number(n);
  };

  const defs = [];
  const built = new Map();

  // def: { id: 'D1.4', title, skills: [{ id, name, example }], groups?: [{ id, name, example }],
  //        filters?: [...] (replaces the default ejercicio / tema groups), build: () => items, readings?: [...] }
  function addLesson(def) {
    if (!/^D[123]\.\d+$/.test(def.id)) throw new Error(`bad lesson id ${def.id}`);
    if (defs.some((d) => d.id === def.id)) throw new Error(`duplicate lesson ${def.id}`);
    defs.push(def);
    defs.sort((a, b) => order(a.id) - order(b.id));
  }

  const getDef = (id) => defs.find((d) => d.id === id) || null;

  // Items of a lesson, tagged with the lesson and a category, each skill weighted to about SKILL_SIZE items.
  function builtFor(id) {
    if (built.has(id)) return built.get(id);
    const def = getDef(id);
    if (!def) return [];
    const raw = def.build();
    const per = {};
    for (const it of raw) per[it.skill] = (per[it.skill] || 0) + 1;
    const items = raw.map((it) => ({
      ...it,
      lesson: id,
      cat: VOCAB_SKILLS.includes(it.skill) || it.mode === 'vocab' ? 'vocab' : 'gram',
      weight: (it.weight || 1) * Math.min(1, SKILL_SIZE / per[it.skill]),
    }));
    built.set(id, items);
    return items;
  }

  const filtersOf = (def) => {
    if (!def) return [];
    if (def.filters) return def.filters;
    const out = [{ id: 'skill', name: 'ejercicio', items: def.skills }];
    if (def.groups && def.groups.length) out.push({ id: 'tema', name: 'tema', items: def.groups });
    return out;
  };

  const keep = (it, off, vosotros) => (vosotros || !it.vos) && !off.includes(it.skill) && !off.includes(it.group);
  const offFor = (settings, key) => (settings.ex && settings.ex[key]) || [];

  // Cumulative review that mixes lessons. Each item names the latest lesson it needs.
  const mixed = [];

  // Every lesson up to `upto` (and the mixed review those lessons unlock), each lesson weighing the same;
  // with a focus lesson, that lesson alone is half of what comes up.
  const generalCache = new Map();
  function general(settings) {
    const upto = getDef(settings.upto) ? settings.upto : defs[defs.length - 1].id;
    const off = offFor(settings, 'general');
    const key = JSON.stringify([upto, settings.focus, off, settings.vosotros]);
    if (generalCache.has(key)) return generalCache.get(key);
    const lessons = defs.filter((d) => order(d.id) <= order(upto));
    const focus = lessons.some((d) => d.id === settings.focus) ? settings.focus : '';
    const groups = lessons.map((d) => ({ id: d.id, items: builtFor(d.id).filter((it) => !off.includes(it.cat) && (settings.vosotros || !it.vos)) }));
    const mix = off.includes('mix') ? [] : mixed.filter((it) => order(it.lesson) <= order(upto) && (settings.vosotros || !it.vos));
    // The mixed review counts as two lessons: it is what a cumulative test looks like.
    if (mix.length) groups.push({ id: 'mix', items: mix, share: 2 });
    const live = groups.filter((g) => g.items.length);
    const others = live.filter((g) => g.id !== focus).reduce((s, g) => s + (g.share || 1), 0);
    const items = [];
    for (const g of live) {
      const sum = g.items.reduce((s, it) => s + it.weight, 0);
      let share = g.share || 1;
      if (g.id === focus && others > 0) share = others;
      for (const it of g.items) items.push({ ...it, weight: (it.weight * share) / sum });
    }
    // The rail asks for a few variants at once (one per filter count); keep a handful.
    if (generalCache.size > 8) generalCache.delete(generalCache.keys().next().value);
    generalCache.set(key, items);
    return items;
  }

  const readingCache = new Map();
  function readingsOf(def) {
    if (!readingCache.has(def.id)) {
      readingCache.set(
        def.id,
        (def.readings || []).map((r) => ({
          ...r,
          lesson: def.id,
          questions: r.questions.map((qn, i) => (qn.fixed || qn.correct != null ? qn : { ...qn, ...choice(`r:${r.id}:${i}`, qn.options) })),
        })),
      );
    }
    return readingCache.get(def.id);
  }

  // Flat list of parts: text, gloss ([[word|gloss]]), ref ({{word|id}}) and a break between paragraphs.
  function parseReading(text) {
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
  }

  const MIX_NAMES = { traduccion: 'traducción', error: 'corrige', tiempo: 'tiempo verbal', elige: 'elige' };

  D.MODES = [
    { id: 'conjugar', name: 'conjugar' },
    { id: 'leccion', name: 'lección' },
    { id: 'general', name: 'general' },
    { id: 'lectura', name: 'lectura' },
  ];

  D.lessonKit = { slug, hash, rngFor, shuffle, choice, distractors, forms, parse, words, vocabItems, conj, verbNamed };
  D.addLesson = addLesson;
  D.addMixed = (lesson, skill, text) => {
    for (const it of parse(`mix.${lesson}`, skill, text)) mixed.push({ ...it, lesson, cat: 'mix', weight: 1, general: true });
  };
  D.lessons = {
    SKILL_SIZE,
    order,
    list: () => defs.map((d) => ({ id: d.id, title: d.title, book: d.id.split('.')[0] })),
    get: (id) => {
      const d = getDef(id);
      return d ? { id: d.id, title: d.title } : null;
    },
    filters: (id) => filtersOf(getDef(id)),
    all: (id) => builtFor(id),
    items: (id, settings) => builtFor(id).filter((it) => keep(it, offFor(settings, id), settings.vosotros)),
    // Items carrying this filter, whatever else is unticked.
    count: (id, filterId, settings) =>
      builtFor(id).filter((it) => (it.skill === filterId || it.group === filterId) && keep(it, [], settings.vosotros)).length,
    general,
    mixed: () => mixed.slice(),
    GENERAL_FILTERS: [
      { id: 'vocab', name: 'vocabulario', example: 'palabras de cada lección' },
      { id: 'gram', name: 'gramática', example: 'estructuras y verbos' },
      { id: 'mix', name: 'repaso mixto', example: 'traducción, errores, tiempos' },
    ],
    skillName(item) {
      if (item.cat === 'mix') return MIX_NAMES[item.skill] || item.skill;
      for (const group of filtersOf(getDef(item.lesson))) {
        const hit = group.items.find((f) => f.id === item.skill);
        if (hit) return hit.name;
      }
      return item.skill;
    },
    groupName(item) {
      const def = getDef(item.lesson);
      const groups = (def && (def.groups || (def.filters || []).flatMap((f) => f.items))) || [];
      const hit = groups.find((g) => g.id === item.group);
      return hit ? hit.name : '';
    },
    readings: () => defs.flatMap((d) => readingsOf(d)),
    parseReading,
  };
})(typeof window !== 'undefined' ? window : globalThis);
