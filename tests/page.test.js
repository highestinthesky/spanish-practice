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
    'modes', 'modes-ink', 'ex-groups', 'ambient', 'hint', 'prompt', 'choices', 'why', 'read', 'strict', 'nudge']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
});

test('the page has no prose: the only hard-coded words are the wordmark and the rail labels', () => {
  const body = html.slice(html.indexOf('<body>'), html.indexOf('<script'));
  const text = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(text, 'repaso libro tipo de verbo vosotros acentos estrictos');
});

test('the settings rail uses real form controls: a labelled drawer button, fieldsets, a vosotros switch', () => {
  assert.match(html, /id="menu"[^>]*aria-label="ajustes"[^>]*aria-controls="side"[^>]*aria-expanded="false"/);
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
