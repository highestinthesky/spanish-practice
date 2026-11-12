'use strict';
// Writes the mode tabs and every settings menu of the rail into index.html as plain HTML, from the verb,
// tense and lesson data. The page then carries all of its menus and drop-downs itself; js/ui/app.js only
// wires them up, shows the ones the current mode needs and fills in the live counts.
//
//   npm run menu          rewrite index.html
//   (tests/menu.test.js fails when index.html is out of date with the data)

const fs = require('node:fs');
const path = require('node:path');
const load = require('../tests/helpers/load');

const FILE = path.join(load.ROOT, 'index.html');
const REGIONS = ['tabs', 'rail'];

const BOOK_NAMES = { all: 'todos', D1: 'Descubre 1', D2: 'Descubre 2', D3: 'Descubre 3' };
const BOOK_TITLES = { D1: 'Descubre 1', D2: 'Descubre 2', D3: 'Descubre 3' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (a) =>
  Object.entries(a)
    .filter(([, v]) => v != null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');

// One row of the rail: a real input, a drawn box, the name, an optional example and a slot for the count.
function opt({ type = 'checkbox', name, value, label, example, data = {} }) {
  const input = `<input class="opt-input"${attrs({ type, name, value, ...data })}>`;
  const box = `<span class="${type === 'radio' ? 'opt-box opt-radio' : 'opt-box'}" aria-hidden="true"></span>`;
  const ex = example ? `<span class="opt-ex">${esc(example)}</span>` : '';
  return `<label class="opt">${input}${box}<span class="opt-name">${esc(label)}</span>${ex}<span class="opt-count"></span></label>`;
}

function select(id, label, lessons, first) {
  const out = [`<label class="pick" for="${id}">`, `  <span class="group-h">${esc(label)}</span>`, '  <span class="pick-box">', `    <select class="pick-select" id="${id}">`];
  if (first) out.push(`      <option value="${esc(first.value)}">${esc(first.label)}</option>`);
  for (const book of ['D1', 'D2', 'D3']) {
    const inBook = lessons.filter((l) => l.book === book);
    if (!inBook.length) continue;
    out.push(`      <optgroup label="${BOOK_TITLES[book]}">`);
    for (const l of inBook) out.push(`        <option value="${l.id}">${esc(`${l.id.slice(1)} · ${l.title}`)}</option>`);
    out.push('      </optgroup>');
  }
  out.push('    </select>', '  </span>', '</label>');
  return out;
}

function fieldset(title, rows, attr = {}) {
  return [`<fieldset class="group"${attrs(attr)}>`, `  <legend class="group-h">${esc(title)}</legend>`, ...rows.map((r) => `  ${r}`), '</fieldset>'];
}

const indent = (lines, n) => lines.map((l) => (l ? ' '.repeat(n) + l : l));

function tabs(D) {
  return D.MODES.map(
    (m) => `<button class="mode" id="tab-${m.id}" type="button" role="tab" data-mode="${m.id}" aria-controls="${m.id === 'lectura' ? 'read' : 'stage'}" aria-selected="false" tabindex="-1">${esc(m.name)}</button>`,
  );
}

function conjugarRail(D) {
  const out = ['<div class="rail" id="rail-conjugar" data-rail="conjugar">'];

  const hablar = D.conjugate('hablar');
  const tenseRows = [];
  for (const group of D.TENSE_GROUPS) {
    const list = D.tenses.all().filter((t) => t.group === group);
    if (!list.length) continue;
    tenseRows.push('<div class="type-group">', `  <p class="type-group-name">${esc(group)}</p>`);
    for (const t of list) tenseRows.push(`  ${opt({ name: 'tense', value: t.id, label: t.name, example: `hablar → ${hablar[t.id][0]}` })}`);
    tenseRows.push('</div>');
  }
  out.push(...indent(fieldset('tiempo', tenseRows, { id: 'tenses' }), 2));

  const seg = ['<div class="seg">'];
  for (const book of D.BOOKS) {
    seg.push(`  <label class="seg-opt"><input class="opt-input" type="radio" name="book" value="${book}"><span>${BOOK_NAMES[book]}</span><span class="seg-n"></span></label>`);
  }
  seg.push('</div>');
  out.push(...indent(fieldset('libro', seg, { id: 'book' }), 2));

  const types = ['<div class="types-top">', '  <label class="all"><input class="opt-input" type="checkbox" value=""><span>todos</span><span class="all-n"></span></label>', '</div>'];
  for (const group of D.TYPE_GROUPS) {
    types.push('<div class="type-group">', `  <p class="type-group-name">${esc(group.name)}</p>`);
    for (const tag of group.tags) {
      const info = D.TYPE_INFO[tag];
      types.push(`  ${opt({ name: 'type', value: tag, label: info.name, example: info.example })}`);
    }
    types.push('</div>');
  }
  out.push(...indent(fieldset('tipo de verbo', types, { id: 'types' }), 2).map((l, i) => (i === 0 ? l.replace('class="group"', 'class="group group-grow"') : l)));
  out.push('</div>');
  return out;
}

function leccionRail(D) {
  const all = D.lessons.list();
  const out = ['<div class="rail" id="rail-leccion" data-rail="leccion" hidden>'];
  out.push(...indent(select('lesson', 'lección', all), 2));
  for (const l of all) {
    out.push(`  <div class="lesson-filters" data-lesson="${l.id}" hidden>`);
    for (const group of D.lessons.filters(l.id)) {
      const rows = group.items.map((f) => opt({ value: f.id, label: f.name, example: f.example, data: { 'data-key': l.id } }));
      out.push(...indent(fieldset(group.name, rows), 4));
    }
    out.push('  </div>');
  }
  out.push('</div>');
  return out;
}

function generalRail(D) {
  const all = D.lessons.list();
  const out = ['<div class="rail" id="rail-general" data-rail="general" hidden>'];
  out.push(...indent(select('upto', 'hasta', all), 2));
  out.push(...indent(select('focus', 'foco', all, { value: '', label: 'ninguno · todo igual' }), 2));
  const rows = D.lessons.GENERAL_FILTERS.map((f) => opt({ value: f.id, label: f.name, example: f.example, data: { 'data-key': 'general' } }));
  out.push(...indent(fieldset('ejercicio', rows), 2));
  out.push('</div>');
  return out;
}

function lecturaRail(D) {
  const out = ['<div class="rail" id="rail-lectura" data-rail="lectura" hidden>'];
  for (const l of D.lessons.list()) {
    const list = D.lessons.readings().filter((r) => r.lesson === l.id);
    if (!list.length) continue;
    const rows = list.map((r) => opt({ type: 'radio', name: 'reading', value: r.id, label: r.title, example: r.tag }));
    out.push(...indent(fieldset(`lectura · ${l.id.slice(1)}`, rows), 2));
  }
  out.push('</div>');
  return out;
}

function render(D) {
  return {
    tabs: indent(tabs(D), 10),
    rail: indent([...conjugarRail(D), ...leccionRail(D), ...generalRail(D), ...lecturaRail(D)], 6),
  };
}

// Replaces what sits between <!-- menu:name --> and <!-- /menu:name --> with the generated lines.
function apply(html, D) {
  const parts = render(D);
  let out = html;
  for (const name of REGIONS) {
    const re = new RegExp(`(<!-- menu:${name} [^>]*-->)[\\s\\S]*?(\\n[ ]*<!-- /menu:${name} -->)`);
    if (!re.test(out)) throw new Error(`index.html has no menu:${name} region`);
    out = out.replace(re, (m, open, close) => `${open}\n${parts[name].join('\n')}${close}`);
  }
  return out;
}

module.exports = { render, apply, FILE };

if (require.main === module) {
  const D = load();
  const before = fs.readFileSync(FILE, 'utf8');
  const after = apply(before, D);
  if (after === before) console.log('index.html menus already up to date');
  else {
    fs.writeFileSync(FILE, after);
    console.log('index.html menus rewritten');
  }
}
