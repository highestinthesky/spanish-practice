(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Ids match the keys of the conjugator's output. Order is the order of the chips.
  [
    { id: 'preterite', mark: 'pret', name: 'pretérito' },
    { id: 'imperfect', mark: 'imp', name: 'imperfecto' },
    { id: 'future', mark: 'fut', name: 'futuro' },
    { id: 'conditional', mark: 'cond', name: 'condicional' },
    { id: 'subjunctive', mark: 'subj', name: 'subjuntivo presente' },
    { id: 'pastSubjunctive', mark: 'subj imp', name: 'subjuntivo imperfecto' },
    { id: 'perfect', mark: 'perf', name: 'pretérito perfecto' },
    { id: 'pluperfect', mark: 'plusc', name: 'pluscuamperfecto' },
  ].forEach((t) => D.tenses.register({ ...t, persons: D.PERSONS, vosotrosIndex: 4 }));
})(typeof window !== 'undefined' ? window : globalThis);
