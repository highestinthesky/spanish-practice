# Operating Menu Implementation Plan

> **For agentic workers:** steps use checkbox (`- [x]`) syntax. Each task ends with a full `npm test` run.

**Goal:** Present-only drill with the other tenses parked, and a top rail redesigned as a labelled operating menu.

**Spec:** `docs/superpowers/specs/2026-10-16-operating-menu-design.md`

## Global Constraints

Everything in the 2026-10-15 plan still holds, except: short Spanish control labels are allowed inside the menu.

## Tasks

### Task 1: Park the non-present tenses
- [x] Test: `D.tenses.all()` is exactly `['present']`; `js/tenses/parked.js` registers the eight parked tenses into a fresh registry without error.
- [x] Test: the conjugation table tense list `D.TABLE_TENSES` still has all nine tenses with Spanish names.
- [x] Move `js/tenses/more.js` → `js/tenses/parked.js` exporting `D.registerParkedTenses(registry)`; drop it from `index.html` and the test loader.
- [x] Add `D.TABLE_TENSES` to `js/core/conjugate.js`; `app.js` builds the table from it.

### Task 2: Book setting and type-only chips
- [x] Test: store keeps `settings.book` (`all` | `D1` | `D2`), sanitizes anything else to `all`.
- [x] Test: `buildPool` with `book: 'D1'` keeps only D1 verbs and ANDs with chips.
- [x] Test: session migrates saved `D1`/`D2` chips into `book`; `setBook`; `poolSize()` counts distinct verbs; `countFor(tag)` counts verbs per type in the current book.
- [x] Implement in `store.js`, `scheduler.js`, `session.js`; `D.TYPE_TAGS` in `verb.js`.

### Task 3: Menu markup and behaviour
- [x] Test (page): ids `menu-toggle`, `summary`, `menu`, `book`, `types`, `vos`, `menu-done` exist; visible static text is exactly the expected label list.
- [x] Markup in `index.html`; options built in `app.js` from `D.TYPE_INFO`.
- [x] Summary text, live counts, disabled zero-count options, apply-on-close, Esc to close, focus return.

### Task 4: Hallmark styling and browser check
- [x] Styles in `app.css` with tokens only; tick and radio drawn from borders; 44px rows; one column under 700px.
- [x] Browser check at 320, 375, 768, 1280: no horizontal scroll, no console errors, menu opens/closes, filters change the prompt pool.
- [x] Log the run in `.hallmark/log.json`; update the CSS header stamp.
