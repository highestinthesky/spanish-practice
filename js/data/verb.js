(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Chip order on screen. Tags describe a verb's behaviour and are tense-agnostic.
  const TAGS = ['e→ie', 'o→ue', 'e→i', '-go', '-zco', '-uir', 'í/ú', 'spelling', 'irregular', 'reflexive', 'regular'];

  function v(inf, gloss, tags, present) {
    const reflexive = /se$/.test(inf);
    const t = tags.slice();
    if (reflexive && !t.includes('reflexive')) t.push('reflexive');
    return { inf, gloss, tags: t, reflexive, forms: { present: present.slice() } };
  }

  function createVerbBook(tenses) {
    const verbs = [];

    function validateForms(verb, tenseId, forms) {
      const tense = tenses.get(tenseId);
      if (!tense) throw new Error(`${verb.inf}: unknown tense ${tenseId}`);
      const ok = Array.isArray(forms) && forms.length === tense.persons.length && forms.every((f) => typeof f === 'string' && f.trim());
      if (!ok) throw new Error(`${verb.inf}: ${tenseId} needs ${tense.persons.length} non-empty forms`);
    }

    function addVerbs(list) {
      for (const verb of list) {
        if (verbs.some((x) => x.inf === verb.inf)) throw new Error(`duplicate verb: ${verb.inf}`);
        for (const tag of verb.tags) {
          if (!TAGS.includes(tag)) throw new Error(`${verb.inf}: unknown tag ${tag}`);
        }
        for (const [tenseId, forms] of Object.entries(verb.forms)) validateForms(verb, tenseId, forms);
        verbs.push(verb);
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

    return { verbs, addVerbs, addForms };
  }

  const book = createVerbBook(D.tenses);
  D.TAGS = TAGS;
  D.v = v;
  D.createVerbBook = createVerbBook;
  D.verbs = book.verbs;
  D.addVerbs = book.addVerbs;
  D.addForms = book.addForms;
})(typeof window !== 'undefined' ? window : globalThis);
