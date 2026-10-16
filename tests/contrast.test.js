'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers/load');

const tokens = fs.readFileSync(path.join(ROOT, 'css/tokens.css'), 'utf8');

function token(name) {
  const m = tokens.match(new RegExp(`--${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)\\)`));
  assert.ok(m, `token --${name} must be an oklch() value`);
  return { L: Number(m[1]) / 100, C: Number(m[2]), h: Number(m[3]) };
}

function luminance({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (x) => Math.min(1, Math.max(0, x));
  const r = clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function ratio(fg, bg) {
  const a = luminance(token(fg));
  const b = luminance(token(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('ink on paper is at least 7:1', () => assert.ok(ratio('color-ink', 'color-paper') >= 7));
test('muted label text on paper is at least 4.5:1', () => assert.ok(ratio('color-muted', 'color-paper') >= 4.5));
test('text on the accent plate is at least 4.5:1', () => assert.ok(ratio('color-accent-ink', 'color-accent') >= 4.5));
test('accent against paper is at least 3:1 for UI boundaries', () => assert.ok(ratio('color-accent', 'color-paper') >= 3));
test('paper text on ink (correct state) is at least 7:1', () => assert.ok(ratio('color-paper', 'color-ink') >= 7));
