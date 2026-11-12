'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const load = require('./helpers/load');

const html = fs.readFileSync(path.join(load.ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(load.ROOT, 'css/app.css'), 'utf8');
const tokens = fs.readFileSync(path.join(load.ROOT, 'css/tokens.css'), 'utf8');

test('index.html loads scripts in the same order as the test loader, then the UI', () => {
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]).filter((src) => !/^https?:/.test(src));
  assert.deepEqual(srcs, [...load.SCRIPT_ORDER, ...load.UI_SCRIPTS]);
});

test('the animation library is pinned, integrity-checked and loads before the UI', () => {
  const tag = html.match(/<script src="(https:[^"]+)"([^>]*)>/);
  assert.ok(tag, 'no CDN script');
  assert.match(tag[1], /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/\d+\.\d+\.\d+\/gsap\.min\.js$/);
  assert.match(tag[2], /integrity="sha384-[A-Za-z0-9+/=]+"/);
  assert.match(tag[2], /crossorigin="anonymous"/);
  assert.ok(html.indexOf(tag[1]) < html.indexOf(load.UI_SCRIPTS[0]));
});

test('every script in the order list exists', () => {
  for (const rel of load.SCRIPT_ORDER) assert.ok(fs.existsSync(path.join(load.ROOT, rel)), rel);
});

test('no ES modules (they fail on file://)', () => {
  assert.ok(!/type="module"/.test(html));
  for (const rel of [...load.SCRIPT_ORDER, ...load.UI_SCRIPTS]) {
    const src = fs.readFileSync(path.join(load.ROOT, rel), 'utf8');
    assert.ok(!/^\s*(import|export)\s/m.test(src), `${rel} uses import/export`);
  }
});

test('all ids the UI needs exist in the page', () => {
  for (const id of ['app', 'side', 'main', 'menu', 'close', 'scrim', 'book', 'types', 'vos', 'pool',
    'streak-box', 'streak', 'best', 'acc', 'count', 'stage', 'card', 'person', 'flag', 'verb', 'gloss',
    'form', 'field', 'input', 'echo', 'submit', 'fix', 'right', 'next', 'keys', 'empty', 'burst', 'conj', 'live',
    'modes', 'modes-ink', 'tenses', 'lesson', 'upto', 'focus', 'ambient', 'hint', 'prompt', 'choices', 'why', 'read', 'strict', 'nudge']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
});

test('outside the generated menus the page has no prose: just the wordmark and the two switches', () => {
  const body = html.slice(html.indexOf('<body>'), html.indexOf('<script')).replace(/<!-- menu:(\w+) [\s\S]*?<!-- \/menu:\1 -->/g, '');
  const text = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(text, 'repaso vosotros acentos estrictos');
});

test('index.html carries the menus written from the data (run npm run menu when this fails)', () => {
  const menu = require('../tools/menu');
  assert.equal(html, menu.apply(html, load()));
});

test('every menu is in the page markup: tabs, tense, book and type boxes, lesson drop-downs, filters, readings', () => {
  const D = load();
  for (const m of D.MODES) assert.match(html, new RegExp(`<button class="mode" id="tab-${m.id}"[^>]*role="tab"`));
  for (const t of D.tenses.all()) assert.ok(html.includes(`type="checkbox" name="tense" value="${t.id}"`), t.id);
  for (const tag of D.TYPE_TAGS) assert.ok(html.includes(`name="type" value="${tag}"`), tag);
  for (const id of ['lesson', 'upto', 'focus']) assert.match(html, new RegExp(`<select class="pick-select" id="${id}">`));
  for (const l of D.lessons.list()) {
    assert.ok(html.includes(`<option value="${l.id}">`), l.id);
    for (const g of D.lessons.filters(l.id)) for (const f of g.items) assert.ok(html.includes(`value="${f.id}" data-key="${l.id}"`), `${l.id} ${f.id}`);
  }
  for (const r of D.lessons.readings()) assert.ok(html.includes(`name="reading" value="${r.id}"`), r.id);
  // app.js wires these up; it never creates a menu control itself.
  const app = fs.readFileSync(path.join(load.ROOT, 'js/ui/app.js'), 'utf8');
  assert.ok(!/createElement\(['"](select|option|optgroup|fieldset|input)/.test(app));
  assert.ok(!/node\(['"](select|option|optgroup|fieldset|input|label|legend)['"]/.test(app));
});

test('the settings rail uses real form controls: a labelled drawer button, fieldsets, a vosotros switch', () => {
  assert.match(html, /id="menu"[^>]*aria-label="ajustes"[^>]*aria-controls="side"[^>]*aria-expanded="false"/);
  assert.match(html, /<fieldset class="group" id="tenses">/);
  assert.match(html, /<fieldset class="group" id="book">/);
  assert.match(html, /<fieldset class="group group-grow" id="types">/);
  assert.match(html, /<input[^>]*id="vos"[^>]*type="checkbox"[^>]*role="switch"/);
});

test('app.css uses no raw colours and no italics', () => {
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(css), 'hex colour in app.css');
  assert.ok(!/oklch\(|rgb\(|hsl\(/i.test(css), 'raw colour function in app.css');
  assert.ok(!/font-style:\s*italic/i.test(css + tokens));
  assert.ok(!/font-family:\s*["']/i.test(css), 'font-family must be a token');
});

test('app.css honours reduced motion', () => {
  assert.ok(/prefers-reduced-motion:\s*reduce/.test(css));
});

test('app.css only transitions transform, opacity and visibility (Global Constraints)', () => {
  const decls = [...css.matchAll(/transition:\s*([^;]+);/g)].map((m) => m[1]);
  assert.ok(decls.length > 0);
  for (const decl of decls) {
    for (const part of decl.split(',')) {
      const prop = part.trim().split(/\s+/)[0];
      assert.ok(['transform', 'opacity', 'visibility'].includes(prop), `transition on "${prop}" in: ${decl}`);
    }
  }
});
