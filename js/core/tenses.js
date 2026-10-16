(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  function createTenseRegistry() {
    const byId = new Map();
    return {
      register(t) {
        if (!t || typeof t.id !== 'string' || !t.id) throw new Error('tense needs an id');
        if (!Array.isArray(t.persons) || t.persons.length === 0) throw new Error(`${t.id}: tense needs persons`);
        if (t.vosotrosIndex != null && !(Number.isInteger(t.vosotrosIndex) && t.vosotrosIndex >= 0 && t.vosotrosIndex < t.persons.length)) {
          throw new Error(`${t.id}: vosotrosIndex out of range`);
        }
        if (byId.has(t.id)) throw new Error(`duplicate tense: ${t.id}`);
        byId.set(t.id, t);
      },
      get(id) {
        return byId.get(id) || null;
      },
      all() {
        return Array.from(byId.values());
      },
    };
  }

  D.createTenseRegistry = createTenseRegistry;
  D.tenses = createTenseRegistry();
})(typeof window !== 'undefined' ? window : globalThis);
