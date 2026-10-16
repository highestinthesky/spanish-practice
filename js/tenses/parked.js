(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Drillable tenses parked for later. The drill is present-only for now; this file is NOT loaded by index.html.
  // To bring them back: load this file after js/tenses/present.js and call D.registerParkedTenses(D.tenses)
  // before the verb data files, so every verb gets these forms. The menu then needs a tense picker again.
  // Ids match the keys of the conjugator's output.
  const PARKED = [
    { id: 'preterite', mark: 'pret', name: 'pretérito' },
    { id: 'imperfect', mark: 'imp', name: 'imperfecto' },
    { id: 'future', mark: 'fut', name: 'futuro' },
    { id: 'conditional', mark: 'cond', name: 'condicional' },
    { id: 'subjunctive', mark: 'subj', name: 'subjuntivo presente' },
    { id: 'pastSubjunctive', mark: 'subj imp', name: 'subjuntivo imperfecto' },
    { id: 'perfect', mark: 'perf', name: 'pretérito perfecto' },
    { id: 'pluperfect', mark: 'plusc', name: 'pluscuamperfecto' },
  ];

  D.registerParkedTenses = (registry) => {
    for (const t of PARKED) registry.register({ ...t, persons: D.PERSONS, vosotrosIndex: 4 });
  };
})(typeof window !== 'undefined' ? window : globalThis);
