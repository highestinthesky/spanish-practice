'use strict';
// Forms typed by hand, separate from both the data files and the rule engine.
module.exports = {
  // Fully irregular, or irregular enough that the rule engine does not cover them.
  ser: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
  estar: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
  ir: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
  dar: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
  ver: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
  saber: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
  oír: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'],
  jugar: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
  oler: ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen'],
  reír: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'],
  sonreír: ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen'],
  reunirse: ['me reúno', 'te reúnes', 'se reúne', 'nos reunimos', 'os reunís', 'se reúnen'],
  irse: ['me voy', 'te vas', 'se va', 'nos vamos', 'os vais', 'se van'],
  // Spot checks of rule-covered verbs (data must match both the rules and these).
  decir: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
  tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
  seguir: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
  corregir: ['corrijo', 'corriges', 'corrige', 'corregimos', 'corregís', 'corrigen'],
  distinguir: ['distingo', 'distingues', 'distingue', 'distinguimos', 'distinguís', 'distinguen'],
  conducir: ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen'],
  traer: ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen'],
  construir: ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen'],
  continuar: ['continúo', 'continúas', 'continúa', 'continuamos', 'continuáis', 'continúan'],
  acostarse: ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan'],
  pedir: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
};
