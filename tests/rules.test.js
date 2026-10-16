'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { conjugate } = require('./helpers/rules');

test('regular endings', () => {
  assert.deepEqual(conjugate('hablar', ['regular']), ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']);
  assert.deepEqual(conjugate('comer', ['regular']), ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']);
  assert.deepEqual(conjugate('vivir', ['regular']), ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']);
});

test('stem changes leave nosotros and vosotros alone', () => {
  assert.deepEqual(conjugate('pensar', ['e→ie']), ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']);
  assert.deepEqual(conjugate('poder', ['o→ue']), ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden']);
  assert.deepEqual(conjugate('pedir', ['e→i']), ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden']);
});

test('-go, -zco, spelling, -uir, í/ú', () => {
  assert.deepEqual(conjugate('hacer', ['-go']), ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen']);
  assert.deepEqual(conjugate('tener', ['-go', 'e→ie']), ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']);
  assert.deepEqual(conjugate('traer', ['-go']), ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen']);
  assert.deepEqual(conjugate('conocer', ['-zco']), ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen']);
  assert.deepEqual(conjugate('escoger', ['spelling']), ['escojo', 'escoges', 'escoge', 'escogemos', 'escogéis', 'escogen']);
  assert.deepEqual(conjugate('seguir', ['e→i', 'spelling']), ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen']);
  assert.deepEqual(conjugate('construir', ['-uir']), ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen']);
  assert.deepEqual(conjugate('enviar', ['í/ú']), ['envío', 'envías', 'envía', 'enviamos', 'enviáis', 'envían']);
});

test('reflexive verbs get their pronoun on every form', () => {
  assert.deepEqual(conjugate('acostarse', ['o→ue', 'reflexive']), ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan']);
});
