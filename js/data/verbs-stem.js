(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // e → ie
    v('querer', 'to want, to love', ['e→ie'], ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren']),
    v('pensar', 'to think', ['e→ie'], ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan']),
    v('empezar', 'to begin', ['e→ie'], ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan']),
    v('comenzar', 'to begin', ['e→ie'], ['comienzo', 'comienzas', 'comienza', 'comenzamos', 'comenzáis', 'comienzan']),
    v('cerrar', 'to close', ['e→ie'], ['cierro', 'cierras', 'cierra', 'cerramos', 'cerráis', 'cierran']),
    v('entender', 'to understand', ['e→ie'], ['entiendo', 'entiendes', 'entiende', 'entendemos', 'entendéis', 'entienden']),
    v('perder', 'to lose', ['e→ie'], ['pierdo', 'pierdes', 'pierde', 'perdemos', 'perdéis', 'pierden']),
    v('preferir', 'to prefer', ['e→ie'], ['prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren']),
    v('sentir', 'to feel, to regret', ['e→ie'], ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten']),
    v('mentir', 'to lie', ['e→ie'], ['miento', 'mientes', 'miente', 'mentimos', 'mentís', 'mienten']),
    v('sugerir', 'to suggest', ['e→ie'], ['sugiero', 'sugieres', 'sugiere', 'sugerimos', 'sugerís', 'sugieren']),
    v('recomendar', 'to recommend', ['e→ie'], ['recomiendo', 'recomiendas', 'recomienda', 'recomendamos', 'recomendáis', 'recomiendan']),
    v('despertar', 'to wake (someone) up', ['e→ie'], ['despierto', 'despiertas', 'despierta', 'despertamos', 'despertáis', 'despiertan']),
    v('encender', 'to turn on, to light', ['e→ie'], ['enciendo', 'enciendes', 'enciende', 'encendemos', 'encendéis', 'encienden']),
    v('defender', 'to defend', ['e→ie'], ['defiendo', 'defiendes', 'defiende', 'defendemos', 'defendéis', 'defienden']),
    v('negar', 'to deny', ['e→ie'], ['niego', 'niegas', 'niega', 'negamos', 'negáis', 'niegan']),
    v('convertir', 'to convert, to turn into', ['e→ie'], ['convierto', 'conviertes', 'convierte', 'convertimos', 'convertís', 'convierten']),

    // o → ue (jugar is u → ue)
    v('poder', 'to be able to, can', ['o→ue'], ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden']),
    v('dormir', 'to sleep', ['o→ue'], ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']),
    v('volver', 'to return', ['o→ue'], ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven']),
    v('encontrar', 'to find', ['o→ue'], ['encuentro', 'encuentras', 'encuentra', 'encontramos', 'encontráis', 'encuentran']),
    v('almorzar', 'to have lunch', ['o→ue'], ['almuerzo', 'almuerzas', 'almuerza', 'almorzamos', 'almorzáis', 'almuerzan']),
    v('costar', 'to cost', ['o→ue'], ['cuesto', 'cuestas', 'cuesta', 'costamos', 'costáis', 'cuestan']),
    v('mostrar', 'to show', ['o→ue'], ['muestro', 'muestras', 'muestra', 'mostramos', 'mostráis', 'muestran']),
    v('recordar', 'to remember', ['o→ue'], ['recuerdo', 'recuerdas', 'recuerda', 'recordamos', 'recordáis', 'recuerdan']),
    v('contar', 'to count, to tell', ['o→ue'], ['cuento', 'cuentas', 'cuenta', 'contamos', 'contáis', 'cuentan']),
    v('devolver', 'to return (something)', ['o→ue'], ['devuelvo', 'devuelves', 'devuelve', 'devolvemos', 'devolvéis', 'devuelven']),
    v('resolver', 'to resolve, to solve', ['o→ue'], ['resuelvo', 'resuelves', 'resuelve', 'resolvemos', 'resolvéis', 'resuelven']),
    v('mover', 'to move', ['o→ue'], ['muevo', 'mueves', 'mueve', 'movemos', 'movéis', 'mueven']),
    v('probar', 'to try, to taste', ['o→ue'], ['pruebo', 'pruebas', 'prueba', 'probamos', 'probáis', 'prueban']),
    v('morir', 'to die', ['o→ue'], ['muero', 'mueres', 'muere', 'morimos', 'morís', 'mueren']),
    v('doler', 'to hurt, to ache', ['o→ue'], ['duelo', 'dueles', 'duele', 'dolemos', 'doléis', 'duelen']),
    v('oler', 'to smell', ['o→ue'], ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen']),
    v('jugar', 'to play (a game, sport)', ['o→ue'], ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan']),

    // e → i
    v('pedir', 'to ask for, to order', ['e→i'], ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden']),
    v('servir', 'to serve', ['e→i'], ['sirvo', 'sirves', 'sirve', 'servimos', 'servís', 'sirven']),
    v('repetir', 'to repeat', ['e→i'], ['repito', 'repites', 'repite', 'repetimos', 'repetís', 'repiten']),
    v('seguir', 'to follow, to continue', ['e→i', 'spelling'], ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen']),
    v('conseguir', 'to get, to achieve', ['e→i', 'spelling'], ['consigo', 'consigues', 'consigue', 'conseguimos', 'conseguís', 'consiguen']),
    v('vestir', 'to dress', ['e→i'], ['visto', 'vistes', 'viste', 'vestimos', 'vestís', 'visten']),
    v('competir', 'to compete', ['e→i'], ['compito', 'compites', 'compite', 'competimos', 'competís', 'compiten']),
    v('corregir', 'to correct', ['e→i', 'spelling'], ['corrijo', 'corriges', 'corrige', 'corregimos', 'corregís', 'corrigen']),
    v('elegir', 'to choose, to elect', ['e→i', 'spelling'], ['elijo', 'eliges', 'elige', 'elegimos', 'elegís', 'eligen']),
    v('despedir', 'to fire, to see off', ['e→i'], ['despido', 'despides', 'despide', 'despedimos', 'despedís', 'despiden']),
    v('reír', 'to laugh', ['irregular', 'e→i', 'í/ú'], ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen']),
    v('sonreír', 'to smile', ['irregular', 'e→i', 'í/ú'], ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen']),
    v('medir', 'to measure', ['e→i'], ['mido', 'mides', 'mide', 'medimos', 'medís', 'miden']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
