(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // Fully irregular
    v('ser', 'to be (identity, traits)', ['irregular'], ['soy', 'eres', 'es', 'somos', 'sois', 'son']),
    v('estar', 'to be (state, place)', ['irregular'], ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están']),
    v('ir', 'to go', ['irregular'], ['voy', 'vas', 'va', 'vamos', 'vais', 'van']),
    v('dar', 'to give', ['irregular'], ['doy', 'das', 'da', 'damos', 'dais', 'dan']),
    v('ver', 'to see', ['irregular'], ['veo', 'ves', 've', 'vemos', 'veis', 'ven']),
    v('saber', 'to know (facts, how to)', ['irregular'], ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben']),
    v('oír', 'to hear', ['irregular'], ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen']),
    v('decir', 'to say, to tell', ['irregular', 'e→i', '-go'], ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen']),

    // -go in yo
    v('hacer', 'to do, to make', ['-go'], ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen']),
    v('poner', 'to put, to place', ['-go'], ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen']),
    v('salir', 'to leave, to go out', ['-go'], ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen']),
    v('tener', 'to have', ['-go', 'e→ie'], ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']),
    v('venir', 'to come', ['-go', 'e→ie'], ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen']),
    v('traer', 'to bring', ['-go'], ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen']),
    v('caer', 'to fall', ['-go'], ['caigo', 'caes', 'cae', 'caemos', 'caéis', 'caen']),
    v('valer', 'to be worth', ['-go'], ['valgo', 'vales', 'vale', 'valemos', 'valéis', 'valen']),
    v('suponer', 'to suppose', ['-go'], ['supongo', 'supones', 'supone', 'suponemos', 'suponéis', 'suponen']),
    v('mantener', 'to maintain, to keep', ['-go', 'e→ie'], ['mantengo', 'mantienes', 'mantiene', 'mantenemos', 'mantenéis', 'mantienen']),
    v('obtener', 'to obtain', ['-go', 'e→ie'], ['obtengo', 'obtienes', 'obtiene', 'obtenemos', 'obtenéis', 'obtienen']),

    // -zco in yo
    v('conocer', 'to know (people, places)', ['-zco'], ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen']),
    v('parecer', 'to seem', ['-zco'], ['parezco', 'pareces', 'parece', 'parecemos', 'parecéis', 'parecen']),
    v('ofrecer', 'to offer', ['-zco'], ['ofrezco', 'ofreces', 'ofrece', 'ofrecemos', 'ofrecéis', 'ofrecen']),
    v('merecer', 'to deserve', ['-zco'], ['merezco', 'mereces', 'merece', 'merecemos', 'merecéis', 'merecen']),
    v('obedecer', 'to obey', ['-zco'], ['obedezco', 'obedeces', 'obedece', 'obedecemos', 'obedecéis', 'obedecen']),
    v('conducir', 'to drive', ['-zco'], ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen']),
    v('traducir', 'to translate', ['-zco'], ['traduzco', 'traduces', 'traduce', 'traducimos', 'traducís', 'traducen']),
    v('producir', 'to produce', ['-zco'], ['produzco', 'produces', 'produce', 'producimos', 'producís', 'producen']),
    v('reconocer', 'to recognize', ['-zco'], ['reconozco', 'reconoces', 'reconoce', 'reconocemos', 'reconocéis', 'reconocen']),
    v('aparecer', 'to appear', ['-zco'], ['aparezco', 'apareces', 'aparece', 'aparecemos', 'aparecéis', 'aparecen']),
    v('agradecer', 'to thank, to be grateful', ['-zco'], ['agradezco', 'agradeces', 'agradece', 'agradecemos', 'agradecéis', 'agradecen']),
    v('crecer', 'to grow', ['-zco'], ['crezco', 'creces', 'crece', 'crecemos', 'crecéis', 'crecen']),
    v('nacer', 'to be born', ['-zco'], ['nazco', 'naces', 'nace', 'nacemos', 'nacéis', 'nacen']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
