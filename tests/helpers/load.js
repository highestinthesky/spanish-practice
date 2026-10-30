'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

// Same order as the <script> tags in index.html (a test enforces this).
const SCRIPT_ORDER = [
  'js/core/normalize.js',
  'js/core/tenses.js',
  'js/core/store.js',
  'js/core/scheduler.js',
  'js/core/session.js',
  'js/core/guard.js',
  'js/core/deck.js',
  'js/core/conjugate.js',
  'js/data/verb.js',
  'js/tenses/present.js',
  'js/data/verbs-irregular.js',
  'js/data/verbs-stem.js',
  'js/data/verbs-spelling.js',
  'js/data/verbs-reflexive.js',
  'js/data/verbs-regular.js',
  'js/data/verbs-descubre.js',
  'js/data/descubre.js',
  'js/data/l2-vocab.js',
  'js/data/l2-pronouns.js',
  'js/data/l2-gustar.js',
  'js/data/l2-readings.js',
  'js/data/l2.js',
];
// The UI: motion and the reading view, then the app that wires them up.
const UI_SCRIPTS = ['js/ui/motion.js', 'js/ui/reading.js', 'js/ui/app.js'];

// Loads every script that exists yet, so early tasks can run before later files are written.
function load() {
  for (const rel of SCRIPT_ORDER) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) require(abs);
  }
  return globalThis.Drill;
}

module.exports = load;
module.exports.SCRIPT_ORDER = SCRIPT_ORDER;
module.exports.UI_SCRIPTS = UI_SCRIPTS;
module.exports.ROOT = ROOT;
