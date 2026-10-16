# Operating menu and present-only drill: design

Date: 2026-10-16
Status: approved by the student's standing instructions (no questions possible; decisions below are final)

## Why

1. The student wants to drill the present tense only, for now. The other tenses built in `word-updates` must be kept for later, not deleted.
2. The top rail is a row of identical boxed words (`e→ie`, `-go`, `í/ú`, `D1`, `pres`, `todo`). Selected chips are ink-filled, but nothing says what ink means, what a chip does, or what "nothing selected" means (it means "all verbs"). The student could not tell what was selected. The rail is the drill's **operating menu**: it decides what gets practised. It has to read like a control panel, not a header.

## Decisions

| Question | Decision |
| --- | --- |
| Drillable tenses | Present only. The other eight tense registrations move to `js/tenses/parked.js`, which `index.html` does not load. Adding one `<script>` tag brings them back. |
| Conjugation table on a miss | Unchanged: still shows every tense. The table reads its tense list from the conjugator (`D.TABLE_TENSES`), not from the drill registry, so parking tenses does not shrink it. |
| Visible words | Short Spanish control labels are now allowed in the menu (section titles, option names, worked examples, counts). Still no instructions, sentences, or English UI copy. |
| Book filter | Separate from verb types and exclusive: `todos` / `Descubre 1` / `Descubre 2` (radio). It combines with the types by AND. |
| Verb-type filter | Checkboxes with a visible tick, grouped, each with a worked example (`pensar → pienso`) and a live count. Types combine by OR. None ticked = all types, shown by a ticked `todos` row. |
| Vosotros | A labelled on/off switch inside the menu (`vosotros` · `sí` / `no`). |
| Where state shows | A summary bar that is always visible and states the current setup in words: `presente · todos los verbos · 320` or `presente · e→ie, -go · D1 · 41 verbos · sin vosotros`. The bar *is* the menu button. |
| When changes apply | Immediately to the summary and counts; the prompt is replaced when the menu closes (only if something changed), so the student is not thrown a new verb on every tick. |
| Old saved chips `D1`/`D2` | Migrated once into the book setting. |

## Layout (Hallmark: editorial, Marquee Hero, Grid theme)

```
closed
┌──────────────────────────────────────────────────────────────┐
│ PRESENTE  ·  E→IE, -GO  ·  DESCUBRE 1  ·  41 VERBOS      [ MENÚ ▾ ] │  ← one button, full width, 56px
└──────────────────────────────────────────────────────────────┘

open (pushes the stage down; no overlay, no focus trap)
┌──────────────────────────────────────────────────────────────┐
│ PRESENTE · …                                         [ CERRAR ▴ ] │
├──────────────────────────────────────────────────────────────┤
│ LIBRO        (●) todos 320   ( ) Descubre 1 160   ( ) Descubre 2 126 │
│ TIPO DE VERBO                                          [ todos ✓ ] │
│  CAMBIO DE RAÍZ   [✓] e → ie   pensar → pienso   34               │
│                   [ ] o → ue   poder → puedo     30               │
│                   [ ] e → i    pedir → pido      17               │
│  YO IRREGULAR     [ ] -go …   [ ] -zco …                          │
│  ORTOGRAFÍA       [ ] -uir …  [ ] í / ú …  [ ] g → j, gu → g …    │
│  OTROS            [ ] irregular  [ ] reflexivo  [ ] regular       │
│ PERSONAS     vosotros  [ sí | no ]                               │
│                                                       [ LISTO ]  │
└──────────────────────────────────────────────────────────────┘
```

- Checkboxes and radios are real `<input>` elements, so state, keyboard, and screen readers work natively. The tick is drawn from borders, the radio dot is an ink square: a selected control changes shape, not only colour.
- An option with 0 verbs in the chosen book is disabled and shows `0`.
- `listo` closes the menu and puts focus back in the answer box (ready to type); Esc closes it and returns focus to the menu button. The bar button has `aria-expanded`.
- Mobile: the option grid becomes one column; the panel scrolls with the page. Every row is a 44px-tall target.

## Out of scope

Reset-progress button, tense switch UI (comes back with the parked tenses), English labels.
