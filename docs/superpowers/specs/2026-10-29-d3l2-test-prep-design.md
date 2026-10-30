# Descubre 3 · Lección 2 test prep: design

Date: 2026-10-29
Status: the student asked for a comprehensive plan and immediate execution while away ("save questions for now"). Every decision below is my call and is marked as such where it is not theirs.

## Why

The Lección 2 (Las diversiones) test covers:

- **Contenido:** vocabulario L2 · pronombres de OD, OI, preposicionales · verbos como GUSTAR
- **Formato:** lectura y comprensión · vocabulario y gramática aplicada

The site only drills present-tense conjugation. It has to cover every line above, stay the same app (warm paper, indigo, Fraunces display, GSAP letter motion) and get more motion: letters that float out in several directions, not only pop.

## What the student said

- Tailor the site to the five test items above.
- Keep it visually appealing and interactive.
- More animation than letters popping: e.g. letters floating out in multiple directions. Stylish.
- Use the Descubre 3 guide for vocabulary; they can supply the official list later.

## Decisions (mine)

| Question | Decision |
| --- | --- |
| Shape | One app, six **modes** chosen from a tab strip in the top bar: `conjugar` (the existing drill, unchanged), `vocab`, `pronombres`, `gustar`, `lectura`, `mezcla`. The chosen mode is remembered in the store. |
| Mode settings | The side rail shows the settings of the active mode only. `conjugar` keeps libro / tipo de verbo / vosotros. Exercise modes show `ejercicio` checkboxes (kinds of exercise, with counts) and, for vocab, `tema` checkboxes (vocabulary groups). `lectura` lists the passages. vosotros stays a shared switch. |
| Vocabulary source | Reconstructed from the Descubre 3 / Imagina Lección 2 list (música y teatro · lugares de recreo · deportes · diversiones · verbos · adjetivos). Flagged in the code so the official list can replace it. |
| Vocab exercises | three kinds: **es → en** (Spanish word shown big with the letter animation, pick the meaning of four), **en → es** (type the Spanish; nouns accept the bare noun or with article, the article is shown on the answer), **contexto** (a sentence with a gap, pick the word of four). Distractors come from the same group. |
| Pronoun exercises | Hand-written items in five skills: **OD** (lo/la/los/las), **OI** (me/te/le/nos/os/les), **doble** (se lo, me la …), **preposicional** (para mí, conmigo, contigo, entre tú y yo), **posición** (with infinitive, gerund and commands, accent on the stressed vowel). Typed or chosen. Every item carries a one-line *por qué* shown after a miss. Several correct answers are accepted where Spanish allows them (`las voy a comprar` / `voy a comprarlas`). |
| Gustar exercises | Generated: experiencer (a mí … a ellos) × 14 verbs like gustar × things (singular noun, plural noun, infinitive) → type `le encantan`. Plus hand-written: meaning of the verb (choice), the `a + pronombre` slot (`a mí`, `a ti`), and short translations. vosotros items follow the vosotros switch. |
| Reading | Four short original passages on the lesson theme, each with 6–7 questions: comprehension (choice), cierto / falso, vocabulary in context, and **pronoun reference** ("¿a qué se refiere *las*?"), which highlights the pronoun in the passage. Glossed words in the passage show their English on tap. One question at a time; a score screen at the end with a replay. |
| Mezcla | The union of the vocab, pronombres and gustar decks, each filtered by its own settings: the "vocabulario y gramática aplicada" section of the test. |
| Checking | Case, outer spaces, ¿¡ and final .!? are ignored. Accent-only mistakes count as wrong (as in the drill) and say *acento*. |
| Scheduling | Same idea as the drill: a missed item returns after 3 others, flagged `repaso`; items answered wrong before are weighted up; the last few items are not repeated. Progress per item persists in the same store. |
| Stats | Streak, accuracy and count are per mode, for this visit. |
| Brand | The wordmark becomes `repaso` (the app is no longer only conjugation). |

## Motion (mine)

All through the existing GSAP, all off under reduced motion or without GSAP.

- **Letter entrances**, picked at random per prompt: flip-rise (existing), converge (letters float in from scattered directions), wave, spin-in, blur-slide.
- **Letter exits** (ghost copies), random: scatter-up (existing), explode (radial in every direction), fall (gravity with tumble), vortex (spiral into the centre), wind (blown sideways).
- **Correct:** the answer's letters float up and drift apart like balloons before settling, sparks burst, a ripple ring leaves the button. Every 5 in a row a large `×5` stamp lands and floats off.
- **Ambient:** faint ¿ ¡ ñ á é glyphs drift behind the stage; each correct answer sends a gust through them.
- **Choices:** buttons arrive from alternating sides; the right one pops green, the wrong ones tip and fade; a wrong pick shakes.
- **Tabs:** an indicator slides between modes; the card swaps with a short flip.
- **Reading:** paragraphs rise in; the referenced pronoun gets a sweeping highlight; the score ring counts up.

## Non-goals

- No new tenses (the drill stays present-only).
- No accounts, no server, no build step; still opens from `file://`.
- No translation of the whole UI to English; labels stay short Spanish words.

## Constraints

- Plain scripts on `window.Drill`, no ES modules (they fail on `file://`); test loader order must match `index.html`.
- `app.css`: colours only through tokens, no italics, transitions only on transform/opacity/visibility, reduced-motion honoured. New colours meet the existing contrast tests.
- Layout works from 320px to 1440px; mobile keeps the drawer.

## Left to the builder

Exact copy of items and passages, distractor choice, animation timings.
