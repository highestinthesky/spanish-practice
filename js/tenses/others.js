(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Every tense past the present. Loaded right after js/tenses/present.js and before the verb data files,
  // so each verb gets these forms from the conjugator. Ids match the keys of the conjugator's output.
  // group sorts them in the menu: indicativo, compuestos, subjuntivo.
  //
  // Each tense has its own verb types, the ones a learner sorts verbs into for that tense (tuve and dije in the
  // pretérito, tendré and haré in the futuro). types names and groups them for the menu; kinds(verb) says which
  // a verb belongs to, read off its generated forms. Every verb gets at least one type: regular when nothing
  // else applies. reflexive is a type in every tense.

  const bare = (f) => String(f).split(' ').pop(); // me lavé → lavé, he hablado → hablado
  const forms = (verb, id) => verb.table[id].map(bare);
  const regular = (verb, id) => verb.regularTable[id].map(bare);
  const ending = (verb) => verb.inf.replace(/se$/, '').slice(-2).replace('í', 'i');
  const withReflexive = (verb, kinds) => (verb.reflexive ? [...kinds, 'reflexive'] : kinds);
  const orRegular = (kinds) => (kinds.length ? kinds : ['regular']);

  const others = (reflexive, regularEx) => ({
    name: 'otros',
    items: [
      { id: 'reflexive', name: 'reflexivo', example: reflexive },
      { id: 'regular', name: 'regular', example: regularEx },
    ],
  });

  /* ---------- pretérito and subjuntivo imperfecto (built on the pretérito's ellos form) ---------- */

  function pastKinds(verb, { spelling }) {
    const t = forms(verb, 'preterite');
    const r = regular(verb, 'preterite');
    const out = [];
    if (['fui', 'di', 'vi'].includes(t[0])) out.push('unique');
    else if (t[0] !== r[0] && /je$/.test(t[0])) out.push('j');
    else if (t[0] !== r[0] && /[eo]$/.test(t[0])) out.push('strong');
    else {
      if (t[2] !== r[2] && /yó$/.test(t[2])) out.push('y');
      else if (t[2] !== r[2]) out.push('stem');
      if (spelling && t[0] !== r[0] && /(qu|gu|gü|c)é$/.test(t[0])) out.push('spelling');
    }
    return withReflexive(verb, orRegular(out));
  }

  const pastTypes = (ex) => [
    {
      name: 'irregular',
      items: [
        { id: 'strong', name: 'raíz fuerte', example: ex.strong },
        { id: 'j', name: 'raíz en j', example: ex.j },
        { id: 'unique', name: 'ser · ir · dar · ver', example: ex.unique },
      ],
    },
    {
      name: 'cambio en él y ellos',
      items: [
        { id: 'stem', name: '-ir: e → i, o → u', example: ex.stem },
        { id: 'y', name: 'i → y', example: ex.y },
      ],
    },
    ...(ex.spelling ? [{ name: 'ortografía', items: [{ id: 'spelling', name: 'yo -qué -gué -cé', example: ex.spelling }] }] : []),
    others(ex.reflexive, ex.regular),
  ];

  /* ---------- futuro and condicional (same stem) ---------- */

  function futureKinds(verb) {
    const stem = forms(verb, 'future')[0].slice(0, -1);
    const reg = regular(verb, 'future')[0].slice(0, -1);
    let kind = 'regular';
    if (stem !== reg) kind = stem === reg.replace(/[ei]r$/, 'r') ? 'drop' : /dr$/.test(stem) ? 'dr' : 'short';
    return withReflexive(verb, [kind]);
  }

  const futureTypes = (ex) => [
    {
      name: 'raíz irregular',
      items: [
        { id: 'drop', name: 'pierde la vocal', example: ex.drop },
        { id: 'dr', name: 'raíz en -dr-', example: ex.dr },
        { id: 'short', name: 'raíz corta', example: ex.short },
      ],
    },
    others(ex.reflexive, ex.regular),
  ];

  /* ---------- imperfecto ---------- */

  function imperfectKinds(verb) {
    const irregular = forms(verb, 'imperfect')[0] !== regular(verb, 'imperfect')[0];
    return withReflexive(verb, [irregular ? 'irregular' : ending(verb) === 'ar' ? 'ar' : 'er-ir']);
  }

  const imperfectTypes = [
    {
      name: 'terminación',
      items: [
        { id: 'ar', name: '-ar → -aba', example: 'hablar → hablaba' },
        { id: 'er-ir', name: '-er / -ir → -ía', example: 'comer → comía' },
      ],
    },
    { name: 'irregular', items: [{ id: 'irregular', name: 'ser · ir · ver', example: 'ir → iba' }] },
    { name: 'otros', items: [{ id: 'reflexive', name: 'reflexivo', example: 'lavarse → me lavaba' }] },
  ];

  /* ---------- compuestos: the participle ---------- */

  function participleKinds(verb) {
    const p = verb.table.participle;
    const r = verb.regularTable.participle;
    let kind = 'regular';
    if (p !== r) kind = p.replace('ído', 'ido') === r ? 'accent' : 'irregular';
    return withReflexive(verb, [kind]);
  }

  const participleTypes = (aux) => [
    {
      name: 'participio',
      items: [
        { id: 'irregular', name: 'irregular', example: `hacer → ${aux} hecho` },
        { id: 'accent', name: '-ído con acento', example: `leer → ${aux} leído` },
      ],
    },
    others(`lavarse → me ${aux} lavado`, `hablar → ${aux} hablado`),
  ];

  /* ---------- subjuntivo presente: from the yo of the present ---------- */

  function subjunctiveKinds(verb) {
    const t = forms(verb, 'subjunctive');
    const yo = forms(verb, 'present')[0];
    const type = ending(verb) === 'ar' ? 'ar' : 'er';
    const stemOf = verb.inf.replace(/se$/, '').slice(0, -2);
    const end = type === 'ar' ? 'e' : 'a';
    // tenga from tengo, busque from busco: the yo stem plus the ending, spelled. sea, vaya, esté come from nowhere.
    const fromYo = /o$/.test(yo) && [yo.slice(0, -1) + end, D.conjugator.join(yo.slice(0, -1), end, type)].includes(t[0]);
    const out = [];
    if (!fromYo) out.push('irregular');
    else {
      const has = (tag) => verb.tags.includes(tag);
      const stems = ['e→ie', 'o→ue', 'e→i'].filter(has);
      // tenga, conozca, construya, vea keep the yo's stem in every person, so tener is no longer e → ie here.
      if (['-go', '-zco', '-uir'].some(has) || (has('irregular') && !stems.length)) out.push('yo');
      else {
        out.push(...stems);
        if (has('í/ú')) out.push('accent');
        if (D.conjugator.join(stemOf, end, type) !== stemOf + end) out.push('spelling');
      }
    }
    return withReflexive(verb, orRegular(out));
  }

  const subjunctiveTypes = [
    {
      name: 'cambio de raíz',
      items: [
        { id: 'e→ie', name: 'e → ie', example: 'pensar → piense' },
        { id: 'o→ue', name: 'o → ue', example: 'poder → pueda' },
        { id: 'e→i', name: 'e → i', example: 'pedir → pida' },
      ],
    },
    {
      name: 'irregular',
      items: [
        { id: 'yo', name: 'raíz del yo', example: 'tener → tenga' },
        { id: 'irregular', name: 'ser · ir · estar · dar · saber', example: 'ir → vaya' },
      ],
    },
    {
      name: 'ortografía y acento',
      items: [
        { id: 'spelling', name: 'ortográfico', example: 'buscar → busque' },
        { id: 'accent', name: 'í / ú', example: 'enviar → envíe' },
      ],
    },
    others('lavarse → me lave', 'hablar → hable'),
  ];

  const OTHERS = [
    {
      id: 'preterite', mark: 'pret', name: 'pretérito', group: 'indicativo',
      types: pastTypes({
        strong: 'tener → tuve', j: 'decir → dije', unique: 'ir → fui', stem: 'pedir → pidió', y: 'leer → leyó',
        spelling: 'buscar → busqué', reflexive: 'lavarse → me lavé', regular: 'hablar → hablé',
      }),
      kinds: (verb) => pastKinds(verb, { spelling: true }),
    },
    { id: 'imperfect', mark: 'imp', name: 'imperfecto', group: 'indicativo', types: imperfectTypes, kinds: imperfectKinds },
    {
      id: 'future', mark: 'fut', name: 'futuro', group: 'indicativo',
      types: futureTypes({ drop: 'poder → podré', dr: 'tener → tendré', short: 'hacer → haré', reflexive: 'lavarse → me lavaré', regular: 'hablar → hablaré' }),
      kinds: futureKinds,
    },
    {
      id: 'conditional', mark: 'cond', name: 'condicional', group: 'indicativo',
      types: futureTypes({ drop: 'poder → podría', dr: 'tener → tendría', short: 'hacer → haría', reflexive: 'lavarse → me lavaría', regular: 'hablar → hablaría' }),
      kinds: futureKinds,
    },
    { id: 'perfect', mark: 'perf', name: 'pretérito perfecto', group: 'compuestos', types: participleTypes('he'), kinds: participleKinds },
    { id: 'pluperfect', mark: 'plusc', name: 'pluscuamperfecto', group: 'compuestos', types: participleTypes('había'), kinds: participleKinds },
    { id: 'subjunctive', mark: 'subj', name: 'subjuntivo presente', group: 'subjuntivo', types: subjunctiveTypes, kinds: subjunctiveKinds },
    {
      id: 'pastSubjunctive', mark: 'subj imp', name: 'subjuntivo imperfecto', group: 'subjuntivo',
      types: pastTypes({
        strong: 'tener → tuviera', j: 'decir → dijera', unique: 'ir → fuera', stem: 'pedir → pidiera', y: 'leer → leyera',
        reflexive: 'lavarse → me lavara', regular: 'hablar → hablara',
      }),
      kinds: (verb) => pastKinds(verb, { spelling: false }),
    },
  ];

  D.TENSE_GROUPS = ['indicativo', 'compuestos', 'subjuntivo'];
  D.registerOtherTenses = (registry) => {
    for (const t of OTHERS) registry.register({ ...t, persons: D.PERSONS, vosotrosIndex: 4 });
  };
  D.registerOtherTenses(D.tenses);
})(typeof window !== 'undefined' ? window : globalThis);
