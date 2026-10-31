# Every Descubre lesson, a general mode and a 24-hour cooldown: design

Date: 2026-10-30
Status: built on request ("consolidate and prepare for future lessons"); decisions below are mine unless quoted.

## What the student asked

1. Targeted practice for each Descubre lesson before D3.2.
2. Add D3.3.
3. A general practice section: all knowledge up to a lesson, with a special focus on one lesson.
4. The same exercise should not come back within about 24 hours.
5. More general exercises.

## Sources

- Lesson themes and grammar points: Vista Higher Learning's Descubre scope and sequence (Teacher's Edition
  pp. T4–T7), which lists Contextos and Estructura for Descubre 1, 2 and 3.
- D3.1 vocabulary: the official word list in the publisher's Descubre 3 sample lesson (Lección 1).
- D3.3 vocabulary: a student-made Lección 3 list matching the Imagina/Descubre 3 Contextos (en casa, de compras,
  expresiones, la vida diaria). Replace it with the official list if it differs.
- D1 and D2 word lists are reconstructed from each lesson's themes.

## Decisions

| Question | Decision |
| --- | --- |
| Shape | Four tabs: `conjugar` (unchanged), `lección`, `general`, `lectura`. The old vocab / pronombres / gustar / mezcla tabs became lesson D3.2; saved settings move over (store migration). |
| Lesson registry | `js/core/lessons.js`: each lesson registers its skills, vocab groups, items and readings. A shared kit builds vocab cards, parses one-line hand-written items and generates verb forms from the conjugator. Old D3.2 item ids are kept, so progress carries over. |
| Per-lesson practice | Vocabulary (es → en, en → es, plus context sentences for D3.1–D3.3) and one skill per Estructura point. Conjugation points are generated from the conjugator (half weight) and backed by hand-written sentences. |
| Balance | Inside a lesson each skill weighs about 24 items, however many it has. |
| General mode | "hasta" picks the last lesson; every lesson up to it weighs the same. "foco" makes one lesson half of everything. Filters: vocabulario, gramática, repaso mixto. |
| Mixed review | ~120 cumulative items (translation, fix-the-error, choose the tense or form), each unlocked by the latest lesson it needs. Only in the general mode. |
| Cooldown | An exercise answered right is held back for 24 hours, in every mode (the store is shared). Misses are not held back: they return as retries. When everything is cooling, the longest-rested quarter comes back first. The conjugation drill applies the same rule per form. The rail shows "N para hoy". |
| D3.2 | Gains Estructuras 2.3 (reflexive verbs), which the test-prep build had left out. |
| D3.3 | Vocabulary with a context sentence for most words, the preterite, the imperfect, preterite vs. imperfect, verbs that change meaning, translations, and three readings with tense questions that highlight the verb. Its verbs join the conjugation drill under D3. |
