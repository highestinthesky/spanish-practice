(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  D.PERSONS = ['yo', 'tú', 'él / ella / Ud.', 'nosotros', 'vosotros', 'ellos / ellas / Uds.'];

  D.tenses.register({
    id: 'present',
    mark: 'pres',
    name: 'presente',
    persons: D.PERSONS,
    vosotrosIndex: 4,
  });
})(typeof window !== 'undefined' ? window : globalThis);
