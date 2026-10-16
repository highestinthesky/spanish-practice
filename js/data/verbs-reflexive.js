(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  // The "reflexive" tag is added automatically for infinitives ending in -se.
  D.addVerbs([
    v('levantarse', 'to get up', ['regular'], ['me levanto', 'te levantas', 'se levanta', 'nos levantamos', 'os levantáis', 'se levantan']),
    v('acostarse', 'to go to bed', ['o→ue'], ['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan']),
    v('despertarse', 'to wake up', ['e→ie'], ['me despierto', 'te despiertas', 'se despierta', 'nos despertamos', 'os despertáis', 'se despiertan']),
    v('vestirse', 'to get dressed', ['e→i'], ['me visto', 'te vistes', 'se viste', 'nos vestimos', 'os vestís', 'se visten']),
    v('sentirse', 'to feel', ['e→ie'], ['me siento', 'te sientes', 'se siente', 'nos sentimos', 'os sentís', 'se sienten']),
    v('divertirse', 'to have fun', ['e→ie'], ['me divierto', 'te diviertes', 'se divierte', 'nos divertimos', 'os divertís', 'se divierten']),
    v('ducharse', 'to take a shower', ['regular'], ['me ducho', 'te duchas', 'se ducha', 'nos duchamos', 'os ducháis', 'se duchan']),
    v('lavarse', 'to wash oneself', ['regular'], ['me lavo', 'te lavas', 'se lava', 'nos lavamos', 'os laváis', 'se lavan']),
    v('ponerse', 'to put on, to become', ['-go'], ['me pongo', 'te pones', 'se pone', 'nos ponemos', 'os ponéis', 'se ponen']),
    v('quitarse', 'to take off', ['regular'], ['me quito', 'te quitas', 'se quita', 'nos quitamos', 'os quitáis', 'se quitan']),
    v('peinarse', 'to comb one\'s hair', ['regular'], ['me peino', 'te peinas', 'se peina', 'nos peinamos', 'os peináis', 'se peinan']),
    v('cepillarse', 'to brush', ['regular'], ['me cepillo', 'te cepillas', 'se cepilla', 'nos cepillamos', 'os cepilláis', 'se cepillan']),
    v('bañarse', 'to take a bath', ['regular'], ['me baño', 'te bañas', 'se baña', 'nos bañamos', 'os bañáis', 'se bañan']),
    v('llamarse', 'to be called', ['regular'], ['me llamo', 'te llamas', 'se llama', 'nos llamamos', 'os llamáis', 'se llaman']),
    v('irse', 'to go away, to leave', ['irregular'], ['me voy', 'te vas', 'se va', 'nos vamos', 'os vais', 'se van']),
    v('sentarse', 'to sit down', ['e→ie'], ['me siento', 'te sientas', 'se sienta', 'nos sentamos', 'os sentáis', 'se sientan']),
    v('dormirse', 'to fall asleep', ['o→ue'], ['me duermo', 'te duermes', 'se duerme', 'nos dormimos', 'os dormís', 'se duermen']),
    v('reunirse', 'to meet, to get together', ['í/ú'], ['me reúno', 'te reúnes', 'se reúne', 'nos reunimos', 'os reunís', 'se reúnen']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
