'use strict';
// Independent present-tense conjugator, used ONLY by tests to double-check the stored forms.
// It never touches the data files.
const ENDINGS = {
  ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
  er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
  ir: ['o', 'es', 'e', 'imos', 'ís', 'en'],
};
const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
const SHAPED = [0, 1, 2, 5]; // the "boot": yo, tú, él, ellos

function replaceLast(str, from, to) {
  const i = str.lastIndexOf(from);
  if (i < 0) throw new Error(`no "${from}" in "${str}"`);
  return str.slice(0, i) + to + str.slice(i + from.length);
}

function conjugate(inf, tags) {
  const base = inf.endsWith('se') ? inf.slice(0, -2) : inf;
  const type = base.slice(-2);
  const ending = ENDINGS[type];
  if (!ending) throw new Error(`cannot conjugate ${inf}`);
  const stem = base.slice(0, -2);
  const stems = [stem, stem, stem, stem, stem, stem];

  for (const p of SHAPED) {
    if (tags.includes('e→ie')) stems[p] = replaceLast(stem, 'e', 'ie');
    if (tags.includes('o→ue')) stems[p] = replaceLast(stem, 'o', 'ue');
    if (tags.includes('e→i')) stems[p] = replaceLast(stem, 'e', 'i');
    if (tags.includes('-uir')) stems[p] = `${stem}y`;
    if (tags.includes('í/ú')) stems[p] = stem.replace(/i$/, 'í').replace(/u$/, 'ú');
  }

  const forms = stems.map((s, i) => s + ending[i]);

  if (tags.includes('-go')) {
    // decir is the only e→i verb here whose yo form keeps the changed vowel (digo); tener and venir do not (tengo, vengo).
    const src = tags.includes('e→i') ? stems[0] : stem;
    let yo;
    if (/c$/.test(src)) yo = `${src.slice(0, -1)}g`; // hacer → hag, decir → dig
    else if (/[aeiou]$/.test(src)) yo = `${src}ig`; // traer → traig, caer → caig
    else yo = `${src}g`; // poner → pong, salir → salg
    forms[0] = `${yo}o`;
  }
  if (tags.includes('-zco')) {
    forms[0] = `${stem.replace(/c$/, 'zc')}o`; // conocer → conozco
  }
  if (tags.includes('spelling')) {
    const src = stems[0];
    let yo = src;
    if (/gu$/.test(src)) yo = src.slice(0, -1); // seguir → sig
    else if (/g$/.test(src)) yo = `${src.slice(0, -1)}j`; // escoger → escoj
    else if (/c$/.test(src)) yo = `${src.slice(0, -1)}z`; // torcer → tuerz
    forms[0] = `${yo}o`;
  }

  return tags.includes('reflexive') ? forms.map((f, i) => `${PRONOUNS[i]} ${f}`) : forms;
}

module.exports = { conjugate };
