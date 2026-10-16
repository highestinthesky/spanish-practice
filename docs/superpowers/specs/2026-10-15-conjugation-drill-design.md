# Conjugation drill: design

Date: 2026-10-15
Status: awaiting review

## Purpose

Let one student drill present-tense Spanish conjugation for a Descubre 3, Lección 1 test. The verbs come from all of Descubre 1 and 2, weighted toward the tricky ones (stem changes, irregular yo forms, spelling changes, fully irregular verbs). The format follows Conjuguemos: one verb and one pronoun at a time, type the form, get an immediate verdict.

The page carries no instructional or marketing text. The only words on screen are Spanish content: infinitives, pronouns, typed forms, grammar-notation chips. English appears only when the student asks for it.

Other tenses will be added later, so the structure must make that a data-and-module addition, not a rewrite.

## Decisions already made with the student

| Question | Answer |
| --- | --- |
| Drill format | One form at a time (verb + pronoun, type one form) |
| Vosotros | Included, with a toggle to drop it |
| Accents | Strict (a missing accent is wrong) with on-screen accent keys |
| English meaning | Hidden; tap the verb to reveal |
| Tenses now | Present only |

## Assumptions (flag if wrong)

- Static site, no backend, no accounts. Progress lives in the browser's localStorage.
- Works by double-clicking `index.html` and on any static host.
- The verb list is reconstructed from standard Descubre 1 and 2 present-tense coverage. The textbook was not available, so the student should review the list (see `js/data/verbs.js` after build, or the group summary below).
- Gustar-type verbs (gustar, encantar, interesar) are out of scope. They have no six-form conjugation.
- Reflexive verbs are answered with the pronoun: `levantarse` + `yo` expects `me levanto`.

## Look (Hallmark)

- **Inferred brief** (stated aloud to the student): audience = a student cramming for one test; use = type the correct form, fast, many times; tone = austere, utilitarian.
- **Genre:** editorial. **Theme:** Grid, signal-red ink. **Macrostructure:** Marquee Hero, adapted: the verb is the hero. No nav, no footer (single-screen tool). Enrichment: none.
- **Type:** Archivo only, loaded from Google Fonts with a system-sans fallback so the page still works offline. Display 800 lowercase, tracking -0.045em. Label voice: Archivo 600, 12px uppercase, 0.09em tracking, muted.
- **Ground:** near-white cool paper `oklch(99% 0.003 255)`, ink `oklch(16% 0.010 255)`, exposed 12-column hairline grid behind the content, zero radius, zero shadow, no cards.
- **Accent:** one signal red `oklch(55% 0.21 28)`, used for the wrong-answer plate, the focus ring, and `::selection`. It stays under about 5% of the viewport except on a wrong answer, which is the page's one poster moment.
- **Tokens:** every colour, font, space, easing, and duration is a named custom property in `css/tokens.css`. No inline hex or OKLCH elsewhere.
- **Italics:** none anywhere.
- **Motion:** transform and opacity only. Reduced-motion collapses everything to a 150ms or shorter opacity change. No bounce, no confetti.

## Screen

One viewport, no scroll on a 375×667 phone.

```
┌──────────────────────────────────────────────┐
│ [chips: e→ie o→ue e→i -go -zco …]  [vosotros]│  top rail, label voice, wraps on mobile
│                                              │
│                                              │
│  pensar■                                     │  infinitive, display size, left-slammed
│  NOSOTROS                                    │  pronoun, label voice
│                                              │
│  ┌──────────────────────────────┐            │
│  │ _                            │  [  →  ]   │  input + submit mark
│  └──────────────────────────────┘            │
│  [á][é][í][ó][ú][ü][ñ]                       │  accent keys
│                                              │
│  ▮▮▮▯▯▮▮▮▮▮   87                             │  last-10 bars, accuracy digits
└──────────────────────────────────────────────┘
```

### States

1. **Asking.** Input focused. Enter submits. Empty submit does nothing.
2. **Correct.** The input row fills with ink and a check mark drawn from borders appears. After about 600ms (or on Enter) the next prompt loads. The result is never announced with words.
3. **Wrong.** The stage floods with the signal red plate. It shows the correct form in display type, with the letters the student got wrong marked by an underline. A diagonal mark replaces the check. The student's own answer sits above it in label voice, struck through. The next prompt waits for Enter, so the student reads the right answer. Enter (and a tap on the plate) is ignored for the first 400 ms and while the key is held down, so a double-tap cannot skip the correction.
4. **Accent-only miss.** Same as wrong, but the underline lands only on the missing accent. It counts as wrong for scoring.
5. **Gloss.** Tapping or activating the infinitive toggles its English meaning in label voice beneath the pronoun. Nothing else changes.
6. **Empty filter.** Not reachable. Filters combine with OR and "none selected" means all verbs.

Each interactive element has default, hover, focus-visible, active, and disabled states. Loading and error states do not exist (no network dependency except the font). Storage failure is silent and falls back to in-memory state.

### Controls (no label text)

- **Chips:** `e→ie`, `o→ue`, `e→i`, `-go`, `-zco`, `-uir`, `í/ú`, `spelling`, `irregular`, `reflexive`, `regular`. Multi-select, OR logic, none selected = all. Selected chip is ink-filled, unselected is hairline-bordered. `jugar` (u→ue) sits under `o→ue`.
- **Vosotros toggle:** a chip showing the word `vosotros`. On = six persons, off = five.
- **Accent keys:** insert the character at the caret, keep focus on the input, never blur the mobile keyboard (use `pointerdown` with `preventDefault`).
- **Tense switch:** rendered only if more than one tense is registered. Today it does not render.
- **Reset:** none visible. Progress can be cleared from the console (`Drill.store.clear()`); a visible reset is out of scope.

### Keyboard

Enter submits or advances. Tab order: chips, vosotros, verb (gloss), input, accent keys. No Alt+vowel shortcuts, because they differ by platform; the on-screen keys cover accents.

### Accessibility

Visually hidden live region announces "correct" or the correct answer for screen readers. Contrast: body text 7:1 or better, signal red on paper at least 4.5:1 (checked before ship). Touch targets are at least 44px tall; the seven accent keys share one row, so at 320px wide they flex down to about 36px wide. Colour is never the only signal (shape marks accompany it).

### Responsive

Verified at 320, 375, 414, 768 and desktop. No horizontal scroll (`overflow-x: clip` on `html` and `body`). Display verb scales with `clamp()` and wraps with `overflow-wrap: anywhere`. Grid tracks use `minmax(0, 1fr)`. Chips and accent keys wrap to a second row on narrow screens, never to two-line labels.

## Data model

```js
// js/data/verbs.js  →  window.Drill.verbs
{
  inf: "pensar",
  gloss: "to think",
  tags: ["e→ie"],            // drives chips; a verb may have several
  reflexive: false,
  forms: {
    present: ["pienso", "piensas", "piensa", "pensamos", "pensáis", "piensan"]
  }
}
```

- `forms[tenseId]` is an array indexed by person (0..5: yo, tú, él/ella/Ud., nosotros, vosotros, ellos/ellas/Uds.).
- Reflexive forms are stored with the pronoun: `"me levanto"`.
- Forms are stored explicitly, never generated at runtime. Generation happens only in the tests, as an independent check.
- Tags are tense-agnostic descriptors of the verb's behaviour; tense-specific tags can be added later without touching existing records.

### Tense registry

```js
Drill.tenses.register({
  id: "present",
  mark: "…",                         // label shown on the future tense switch
  persons: ["yo","tú","él / ella / Ud.","nosotros","vosotros","ellos / ellas / Uds."]
});
```

Adding preterite later = add `forms.preterite` to each verb record, add `js/tenses/preterite.js` that registers it, add one `<script>` tag. The scheduler, checker, store, and UI read the registry and need no changes. The store keys include the tense id so progress never mixes.

## Modules

| File | Responsibility | Depends on |
| --- | --- | --- |
| `js/core/normalize.js` | NFC-normalise, trim, collapse whitespace, lowercase; compare strictly; compute accent-only diff and per-letter diff for the wrong-answer underline | none |
| `js/core/tenses.js` | Tense registry | none |
| `js/data/verb.js` | Tag list, verb builder `v()`, verb book (`addVerbs`, `addForms`) with validation | `tenses.js` |
| `js/core/session.js` | Ties scheduler, store and checker together; last-ten results and accuracy | scheduler, store, normalize |
| `js/core/scheduler.js` | Pick the next (verb, person) from the filtered pool, weighted by history | none |
| `js/core/store.js` | localStorage wrapper with try/catch and in-memory fallback | none |
| `js/data/verbs.js` | The verb records | none |
| `js/tenses/present.js` | Registers the present tense | `tenses.js` |
| `js/ui/app.js` | DOM, events, state machine (asking → correct/wrong → asking) | all of the above |
| `css/tokens.css`, `css/app.css` | Design tokens, layout | none |
| `tests/*.test.js` | Node's built-in `node:test`, no dependencies | core modules |

Core modules use a small wrapper so they work as classic `<script>` tags (attach to `window.Drill`) and as CommonJS in Node tests. No ES modules, because Chrome blocks them on `file://`.

## Behaviour details

### Checking

1. Normalise both strings (NFC, trim, collapse internal whitespace, lowercase).
2. Equal → correct.
3. Equal after stripping combining marks (accents) but not `ñ` vs `n` (ñ is a different letter) → accent-only miss, counted wrong.
4. Otherwise wrong. The diff for the plate is a simple per-position comparison against the correct form (aligned from the start; extra or missing letters mark the tail).

`ü` and `ñ` are treated as distinct letters, not accents. Only `á é í ó ú` count as accents.

### Scheduling

Each item is `tenseId|inf|personIndex`. State per item: `box` (0–4), `seen`, `misses`, `last`.

- Unseen item weight: 3
- Seen item weight by box: `[8, 4, 2, 1, 0.5][box]`
- Correct → `box = min(box + 1, 4)`. Wrong → `box = 0`.
- Never repeat the same item twice in a row; avoid the same verb twice in a row when the pool has more than one verb.
- Pool = items whose verb matches any selected chip (or all), whose person is enabled (vosotros toggle), and whose tense is the active one.

Tricky verbs dominate naturally because they are about 80% of the pool.

### Persistence

One key, `conjugacion.v1`, JSON: `{ items: {...}, settings: { chips: [...], vosotros: true, tense: "present" } }`. Corrupt JSON or a throwing `localStorage` resets silently to defaults. Schema version in the key name allows a future migration.

### Progress display

- Last 10 results as ten stepped cells (ink = correct, signal = wrong, hairline = not yet answered).
- Accuracy over the current session as a two-digit number. Hidden until the first answer.

## Verb list

About 140 verbs, roughly 110 tricky and 30 regular. Reconstructed from standard Descubre 1 and 2 coverage; student to review.

- **Fully irregular:** ser, estar, ir, dar, ver, saber, oír, decir
- **-go in yo:** hacer, poner, salir, tener, venir, traer, caer, valer, suponer, mantener, obtener
- **-zco:** conocer, parecer, ofrecer, merecer, obedecer, conducir, traducir, producir, reconocer, aparecer, agradecer, crecer, nacer
- **e→ie:** querer, pensar, empezar, comenzar, cerrar, entender, perder, preferir, sentir, mentir, sugerir, recomendar, despertar, encender, defender, negar, convertir
- **o→ue:** poder, dormir, volver, encontrar, almorzar, costar, mostrar, recordar, contar, devolver, resolver, mover, probar, morir, doler, oler, jugar (u→ue)
- **e→i:** pedir, servir, repetir, seguir, conseguir, vestir, competir, corregir, elegir, despedir, reír, sonreír, medir
- **Spelling changes in yo:** escoger, recoger, proteger, dirigir, exigir, distinguir
- **-uir (adds y):** construir, destruir, incluir, contribuir, sustituir, distribuir (huir dropped: its vosotros form is spelled differently across textbooks and the RAE)
- **Accent shifts (í/ú):** enviar, esquiar, continuar, actuar, graduar, confiar
- **Reflexive:** levantarse, acostarse, despertarse, vestirse, sentirse, divertirse, ducharse, lavarse, ponerse, quitarse, peinarse, cepillarse, bañarse, llamarse, irse, sentarse, dormirse, reunirse
- **Regular -ar:** hablar, bailar, trabajar, estudiar, comprar, necesitar, escuchar, nadar, practicar, llegar, buscar, cocinar, limpiar, viajar
- **Regular -er/-ir:** comer, beber, correr, aprender, leer, creer, vender, deber, vivir, escribir, abrir, recibir, compartir, asistir, subir, decidir

Verbs that fit several groups carry several tags (e.g. `decir`: `e→i`, `-go`, `irregular`; `acostarse`: `o→ue`, `reflexive`; `seguir`: `e→i`, `spelling`).

## Testing

Node's built-in `node --test`, no installs.

1. **Data integrity:** every verb has six non-empty forms for `present`; no duplicate infinitives; every tag is in the known set; reflexive verbs' forms start with the correct pronoun for each person.
2. **Independent rules check:** a test-only conjugator derives forms for regular -ar/-er/-ir, the three stem-change families (including nosotros/vosotros staying unchanged), -go, -zco, -uir, spelling changes, and accent shifts. Every verb tagged as following a rule must match the rule's output. Fully irregular verbs are checked against a hand-written fixture.
3. **Checker:** correct, wrong, accent-only miss, case and whitespace tolerance, `ñ` vs `n`, reflexive pronoun missing.
4. **Scheduler:** respects the vosotros toggle, respects filters, never repeats the same item twice in a row, weights missed items higher over many draws (seeded RNG).
5. **Store:** survives a throwing `localStorage`, survives corrupt JSON.
6. **Browser verification** (manual, with screenshots): 320, 375, 414, 768, desktop; correct, wrong, accent-only, gloss, vosotros toggle, chips; no console errors; keyboard-only run-through; accent keys on a touch viewport.

## Hallmark and impeccable-lite checks at the end

- Hallmark: pre-emit self-critique stamped at the top of `app.css`, 58-gate slop test, `.hallmark/log.json` entry, `tokens.css` emitted.
- impeccable-lite: `harden` (storage failure, very long forms such as reflexive plurals, rapid input, empty pool), `adapt` (touch, mobile keyboard, small phones), `clarify` (screen-reader text only, since no visible copy exists). `onboard` and `optimize` are skipped: there is no first-run text by request, and the page is a few small static files.

## Out of scope

Other tenses, gustar-type verbs, accounts or sync, audio, a visible settings or reset UI, a visible score history, sentences or translation exercises.
