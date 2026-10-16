(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Chip order on screen. Tags describe a verb's present-tense behaviour; D1 and D2 mark the Descubre book.
  const TAGS = ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular', 'D1', 'D2'];

  // present is optional: without it every tense comes from the conjugator.
  function v(inf, gloss, tags, present) {
    const reflexive = /se$/.test(inf);
    const t = tags.slice();
    if (reflexive && !t.includes('reflexive')) t.push('reflexive');
    return { inf, gloss, tags: t, reflexive, forms: present ? { present: present.slice() } : {} };
  }

  // Full table and its regular-pattern twin, computed once per verb on first use.
  function tableOf(verb) {
    if (!verb.table) {
      verb.table = D.conjugate(verb.inf, verb.tags);
      verb.regularTable = D.conjugate(verb.inf, verb.tags, { regular: true });
    }
    return verb.table;
  }

  // A form is irregular when it is not what the plain -ar/-er/-ir pattern would give.
  function irregularMap(verb) {
    tableOf(verb);
    const out = {};
    for (const [key, forms] of Object.entries(verb.table)) {
      if (Array.isArray(forms)) out[key] = forms.map((f, i) => f !== verb.regularTable[key][i]);
    }
    out.participle = verb.table.participle !== verb.regularTable.participle;
    out.gerund = verb.table.gerund !== verb.regularTable.gerund;
    out.imperative = {};
    for (const side of ['affirmative', 'negative']) {
      out.imperative[side] = verb.table.imperative[side].map((f, i) => f != null && f !== verb.regularTable.imperative[side][i]);
    }
    return out;
  }

  function createVerbBook(tenses) {
    const verbs = [];

    function validateForms(verb, tenseId, forms) {
      const tense = tenses.get(tenseId);
      if (!tense) throw new Error(`${verb.inf}: unknown tense ${tenseId}`);
      const ok = Array.isArray(forms) && forms.length === tense.persons.length && forms.every((f) => typeof f === 'string' && f.trim());
      if (!ok) throw new Error(`${verb.inf}: ${tenseId} needs ${tense.persons.length} non-empty forms`);
    }

    // Every registered tense the conjugator knows is filled in; forms typed by hand are kept as they are.
    // tricky[tenseId] is true when any form of that tense breaks the regular pattern.
    function addVerbs(list) {
      for (const verb of list) {
        if (verbs.some((x) => x.inf === verb.inf)) throw new Error(`duplicate verb: ${verb.inf}`);
        for (const tag of verb.tags) {
          if (!TAGS.includes(tag)) throw new Error(`${verb.inf}: unknown tag ${tag}`);
        }
        verb.tricky = {};
        if (D.conjugate) {
          const table = tableOf(verb);
          const irr = irregularMap(verb);
          for (const tense of tenses.all()) {
            if (!Array.isArray(table[tense.id])) continue;
            if (!verb.forms[tense.id]) verb.forms[tense.id] = table[tense.id].slice();
            verb.tricky[tense.id] = irr[tense.id].some(Boolean);
          }
        }
        for (const [tenseId, forms] of Object.entries(verb.forms)) validateForms(verb, tenseId, forms);
        verbs.push(verb);
      }
    }

    // Marks which Descubre lesson taught each verb: { 'D1.4': ['jugar', …] }.
    function addLessons(map) {
      for (const [lesson, infs] of Object.entries(map)) {
        const book = lesson.split('.')[0];
        if (!TAGS.includes(book)) throw new Error(`addLessons: unknown book ${book}`);
        for (const inf of infs) {
          const verb = verbs.find((x) => x.inf === inf);
          if (!verb) throw new Error(`addLessons: unknown verb ${inf}`);
          if (!verb.tags.includes(book)) verb.tags.push(book);
          verb.lessons = (verb.lessons || []).concat(lesson);
        }
      }
    }

    function addForms(tenseId, map) {
      for (const [inf, forms] of Object.entries(map)) {
        const verb = verbs.find((x) => x.inf === inf);
        if (!verb) throw new Error(`addForms: unknown verb ${inf}`);
        validateForms(verb, tenseId, forms);
        verb.forms[tenseId] = forms.slice();
      }
    }

    return { verbs, addVerbs, addForms, addLessons };
  }

  const book = createVerbBook(D.tenses);
  D.TAGS = TAGS;
  D.v = v;
  D.createVerbBook = createVerbBook;
  D.verbs = book.verbs;
  D.addVerbs = book.addVerbs;
  D.addForms = book.addForms;
  D.addLessons = book.addLessons;
  D.tableOf = tableOf;
  D.irregularMap = irregularMap;
})(typeof window !== 'undefined' ? window : globalThis);
