(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  D.tenses.register({
    id: 'present',
    mark: 'pres',
    persons: ['yo', 'tú', 'él / ella / Ud.', 'nosotros', 'vosotros', 'ellos / ellas / Uds.'],
    vosotrosIndex: 4,
  });
})(typeof window !== 'undefined' ? window : globalThis);
