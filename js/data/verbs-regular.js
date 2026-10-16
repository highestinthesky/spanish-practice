(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // -ar
    v('hablar', 'to speak', ['regular'], ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']),
    v('bailar', 'to dance', ['regular'], ['bailo', 'bailas', 'baila', 'bailamos', 'bailáis', 'bailan']),
    v('trabajar', 'to work', ['regular'], ['trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajáis', 'trabajan']),
    v('estudiar', 'to study', ['regular'], ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian']),
    v('comprar', 'to buy', ['regular'], ['compro', 'compras', 'compra', 'compramos', 'compráis', 'compran']),
    v('necesitar', 'to need', ['regular'], ['necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitáis', 'necesitan']),
    v('escuchar', 'to listen', ['regular'], ['escucho', 'escuchas', 'escucha', 'escuchamos', 'escucháis', 'escuchan']),
    v('nadar', 'to swim', ['regular'], ['nado', 'nadas', 'nada', 'nadamos', 'nadáis', 'nadan']),
    v('practicar', 'to practice', ['regular'], ['practico', 'practicas', 'practica', 'practicamos', 'practicáis', 'practican']),
    v('llegar', 'to arrive', ['regular'], ['llego', 'llegas', 'llega', 'llegamos', 'llegáis', 'llegan']),
    v('buscar', 'to look for', ['regular'], ['busco', 'buscas', 'busca', 'buscamos', 'buscáis', 'buscan']),
    v('cocinar', 'to cook', ['regular'], ['cocino', 'cocinas', 'cocina', 'cocinamos', 'cocináis', 'cocinan']),
    v('limpiar', 'to clean', ['regular'], ['limpio', 'limpias', 'limpia', 'limpiamos', 'limpiáis', 'limpian']),
    v('viajar', 'to travel', ['regular'], ['viajo', 'viajas', 'viaja', 'viajamos', 'viajáis', 'viajan']),

    // -er
    v('comer', 'to eat', ['regular'], ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']),
    v('beber', 'to drink', ['regular'], ['bebo', 'bebes', 'bebe', 'bebemos', 'bebéis', 'beben']),
    v('correr', 'to run', ['regular'], ['corro', 'corres', 'corre', 'corremos', 'corréis', 'corren']),
    v('aprender', 'to learn', ['regular'], ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden']),
    v('leer', 'to read', ['regular'], ['leo', 'lees', 'lee', 'leemos', 'leéis', 'leen']),
    v('creer', 'to believe', ['regular'], ['creo', 'crees', 'cree', 'creemos', 'creéis', 'creen']),
    v('vender', 'to sell', ['regular'], ['vendo', 'vendes', 'vende', 'vendemos', 'vendéis', 'venden']),
    v('deber', 'should, ought to', ['regular'], ['debo', 'debes', 'debe', 'debemos', 'debéis', 'deben']),

    // -ir
    v('vivir', 'to live', ['regular'], ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']),
    v('escribir', 'to write', ['regular'], ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben']),
    v('abrir', 'to open', ['regular'], ['abro', 'abres', 'abre', 'abrimos', 'abrís', 'abren']),
    v('recibir', 'to receive', ['regular'], ['recibo', 'recibes', 'recibe', 'recibimos', 'recibís', 'reciben']),
    v('compartir', 'to share', ['regular'], ['comparto', 'compartes', 'comparte', 'compartimos', 'compartís', 'comparten']),
    v('asistir', 'to attend', ['regular'], ['asisto', 'asistes', 'asiste', 'asistimos', 'asistís', 'asisten']),
    v('subir', 'to go up, to climb', ['regular'], ['subo', 'subes', 'sube', 'subimos', 'subís', 'suben']),
    v('decidir', 'to decide', ['regular'], ['decido', 'decides', 'decide', 'decidimos', 'decidís', 'deciden']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
