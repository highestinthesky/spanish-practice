(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  D.PERSONS = ['yo', 'tú', 'él / ella / Ud.', 'nosotros', 'vosotros', 'ellos / ellas / Uds.'];

  // How the menu names and groups the present's verb types: the tags of the verb data (js/data/verb.js).
  // The example shows the change in one form.
  D.TYPE_GROUPS = [
    { name: 'cambio de raíz', tags: ['e→ie', 'o→ue', 'e→i'] },
    { name: 'yo irregular', tags: ['-go', '-zco'] },
    { name: 'ortografía y acento', tags: ['-uir', 'í/ú', 'spelling'] },
    { name: 'otros', tags: ['irregular', 'reflexive', 'regular'] },
  ];
  D.TYPE_INFO = {
    'e→ie': { name: 'e → ie', example: 'pensar → pienso' },
    'o→ue': { name: 'o → ue', example: 'poder → puedo' },
    'e→i': { name: 'e → i', example: 'pedir → pido' },
    '-go': { name: 'yo -go', example: 'hacer → hago' },
    '-zco': { name: 'yo -zco', example: 'conocer → conozco' },
    '-uir': { name: '-uir + y', example: 'construir → construyo' },
    'í/ú': { name: 'í / ú', example: 'enviar → envío' },
    spelling: { name: 'ortográfico', example: 'escoger → escojo' },
    irregular: { name: 'irregular', example: 'ser → soy' },
    reflexive: { name: 'reflexivo', example: 'lavarse → me lavo' },
    regular: { name: 'regular', example: 'hablar → hablo' },
  };

  D.tenses.register({
    id: 'present',
    mark: 'pres',
    name: 'presente',
    group: 'indicativo',
    persons: D.PERSONS,
    vosotrosIndex: 4,
    types: D.TYPE_GROUPS.map((g) => ({ name: g.name, items: g.tags.map((id) => ({ id, ...D.TYPE_INFO[id] })) })),
    kinds: (verb) => verb.tags.filter((t) => !/^D\d$/.test(t)),
  });
})(typeof window !== 'undefined' ? window : globalThis);
