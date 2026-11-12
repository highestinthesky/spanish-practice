(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Every tense past the present. Loaded right after js/tenses/present.js and before the verb data files,
  // so each verb gets these forms from the conjugator. Ids match the keys of the conjugator's output.
  // group sorts them in the menu: indicativo, compuestos, subjuntivo.
  const OTHERS = [
    { id: 'preterite', mark: 'pret', name: 'pretérito', group: 'indicativo' },
    { id: 'imperfect', mark: 'imp', name: 'imperfecto', group: 'indicativo' },
    { id: 'future', mark: 'fut', name: 'futuro', group: 'indicativo' },
    { id: 'conditional', mark: 'cond', name: 'condicional', group: 'indicativo' },
    { id: 'perfect', mark: 'perf', name: 'pretérito perfecto', group: 'compuestos' },
    { id: 'pluperfect', mark: 'plusc', name: 'pluscuamperfecto', group: 'compuestos' },
    { id: 'subjunctive', mark: 'subj', name: 'subjuntivo presente', group: 'subjuntivo' },
    { id: 'pastSubjunctive', mark: 'subj imp', name: 'subjuntivo imperfecto', group: 'subjuntivo' },
  ];

  D.TENSE_GROUPS = ['indicativo', 'compuestos', 'subjuntivo'];
  D.registerOtherTenses = (registry) => {
    for (const t of OTHERS) registry.register({ ...t, persons: D.PERSONS, vosotrosIndex: 4 });
  };
  D.registerOtherTenses(D.tenses);
})(typeof window !== 'undefined' ? window : globalThis);
