(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  // Descubre 3, Lección 2, Estructuras: gustar and verbs like it. The verb agrees with the thing liked;
  // the pronoun names the person. Infinitives count as singular.
  L2.GUSTAR_SKILLS = [
    { id: 'forma', name: 'forma', example: 'a Marta le encantan' },
    { id: 'a', name: 'a + pronombre', example: 'a mí me, a ellos les' },
    { id: 'significado', name: 'significado', example: 'caer bien' },
    { id: 'traduccion', name: 'traducción', example: 'my head hurts' },
  ];

  L2.EXPERIENCERS = [
    { id: 'mi', a: 'A mí', p: 'me' },
    { id: 'ti', a: 'A ti', p: 'te' },
    { id: 'marta', a: 'A Marta', p: 'le' },
    { id: 'usted', a: 'A usted', p: 'le' },
    { id: 'nosotros', a: 'A nosotros', p: 'nos' },
    { id: 'vosotros', a: 'A vosotros', p: 'os', vos: true },
    { id: 'amigos', a: 'A mis amigos', p: 'les' },
  ];

  const pl = (id, t) => ({ id, t, n: 'pl' });
  const sg = (id, t) => ({ id, t, n: 'sg' });
  const inf = (id, t) => ({ id, t, n: 'inf' });
  const verb = (inf, en, sgForm, plForm, things) => ({ inf, en, sg: sgForm, pl: plForm, things });

  L2.gustarVerbs = [
    verb('gustar', 'to like, to be pleasing to', 'gusta', 'gustan', [pl('videojuegos', 'los videojuegos'), sg('boliche', 'el boliche'), inf('cine', 'ir al cine')]),
    verb('encantar', 'to like very much, to love', 'encanta', 'encantan', [pl('conciertos', 'los conciertos'), sg('musica', 'la música en vivo'), inf('salsa', 'bailar salsa')]),
    verb('fascinar', 'to fascinate', 'fascina', 'fascinan', [pl('terror', 'las películas de terror'), sg('ajedrez', 'el ajedrez'), inf('tenis', 'ver partidos de tenis')]),
    verb('aburrir', 'to bore', 'aburre', 'aburren', [pl('telenovelas', 'las telenovelas'), sg('golf', 'el golf'), inf('cola', 'hacer cola')]),
    verb('interesar', 'to interest', 'interesa', 'interesan', [pl('deportes', 'los deportes'), sg('teatro', 'el teatro'), inf('guitarra', 'aprender a tocar la guitarra')]),
    verb('importar', 'to matter, to be important to', 'importa', 'importan', [pl('resultados', 'los resultados'), sg('opinion', 'la opinión del entrenador'), inf('ganar', 'ganar el torneo')]),
    verb('molestar', 'to bother, to annoy', 'molesta', 'molestan', [pl('ruidosos', 'los espectadores ruidosos'), sg('humo', 'el humo'), inf('esperar', 'esperar en la taquilla')]),
    verb('preocupar', 'to worry', 'preocupa', 'preocupan', [pl('examenes', 'los exámenes'), sg('partido', 'el partido de mañana'), inf('perder', 'perder el campeonato')]),
    verb('faltar', 'to lack, to need', 'falta', 'faltan', [pl('jugadores', 'dos jugadores'), sg('asiento', 'un asiento')]),
    verb('hacer falta', 'to miss, to need', 'hace falta', 'hacen falta', [pl('entradas', 'dos entradas'), sg('arbitro', 'un buen árbitro')]),
    verb('doler', 'to hurt, to ache', 'duele', 'duelen', [pl('pies', 'los pies'), sg('cabeza', 'la cabeza')]),
    verb('quedar', 'to be left over', 'queda', 'quedan', [pl('partidos', 'tres partidos'), sg('semana', 'una semana de vacaciones')]),
    verb('caer bien', 'to get along well with, to like (someone)', 'cae bien', 'caen bien', [pl('aficionados', 'los aficionados del otro equipo'), sg('entrenadora', 'la nueva entrenadora')]),
    verb('caer mal', 'to not get along with, to dislike (someone)', 'cae mal', 'caen mal', [pl('arbitros', 'los árbitros injustos'), sg('cantante', 'el cantante')]),
    verb('sorprender', 'to surprise', 'sorprende', 'sorprenden', [pl('noticias', 'las noticias'), sg('final', 'el final de la película'), inf('loteria', 'ganar la lotería')]),
    verb('disgustar', 'to upset', 'disgusta', 'disgustan', [pl('violentas', 'las películas violentas'), sg('comida', 'la comida del estadio'), inf('perder', 'perder')]),
  ];

  // a + pronombre and agreement traps. gap: type the word; choice: first option is right.
  L2.gustarA = [
    { kind: 'gap', id: 'a-mi', prompt: 'A ___ me aburren las telenovelas.', answers: ['mí'], why: 'a mí (con acento) aclara o refuerza me' },
    { kind: 'gap', id: 'a-ti', prompt: 'A ___ te encanta bailar, ¿verdad?', answers: ['ti'], why: 'a ti (sin acento) va con te' },
    { kind: 'choice', id: 'a-nosotros', prompt: '___ nos faltan dos jugadores.', options: ['A nosotros', 'Nosotros', 'A nos', 'Nos a'], why: 'a + nosotros, y después nos' },
    { kind: 'choice', id: 'amigos-les', prompt: 'A mis amigos ___ fascina el boliche.', options: ['les', 'los', 'le', 'se'], why: 'a mis amigos → les (OI plural)' },
    { kind: 'choice', id: 'pablo-le', prompt: 'A Pablo ___ duelen los pies después del partido.', options: ['le', 'lo', 'les', 'se'], why: 'a Pablo → le' },
    { kind: 'choice', id: 'ustedes-les', prompt: '¿A ustedes ___ interesa el teatro?', options: ['les', 'los', 'se', 'le'], why: 'a ustedes → les' },
    { kind: 'choice', id: 'encantan', prompt: 'A mí me ___ los conciertos al aire libre.', options: ['encantan', 'encanta', 'encanto', 'encantamos'], why: 'el verbo concuerda con «los conciertos», no con «mí»' },
    { kind: 'choice', id: 'gusta-ir', prompt: 'Nos ___ ir al parque de atracciones.', options: ['gusta', 'gustan', 'gustamos', 'gustáis'], why: 'un infinitivo cuenta como singular' },
    { kind: 'choice', id: 'caes', prompt: 'Me ___ tú. (caer bien)', options: ['caes bien', 'cae bien', 'caigo bien', 'caen bien'], why: 'el sujeto es tú → caes bien' },
    { kind: 'choice', id: 'ana-y-yo', prompt: 'A Ana y a mí ___ encanta el circo.', options: ['nos', 'les', 'me', 'le'], why: 'Ana y yo = nosotros → nos' },
    { kind: 'choice', id: 'vosotros-os', prompt: 'A vosotros ___ molesta el ruido, ¿no?', options: ['os', 'les', 'vos', 'nos'], why: 'a vosotros → os', vos: true },
  ];

  // English → Spanish. Every natural word order the lesson teaches is accepted.
  L2.gustarTranslate = [
    { id: 'conciertos', prompt: 'I love concerts.', answers: ['me encantan los conciertos', 'a mí me encantan los conciertos'] },
    { id: 'entradas', prompt: 'We need two tickets.', answers: ['nos faltan dos entradas', 'nos hacen falta dos entradas', 'nos faltan dos boletos', 'nos hacen falta dos boletos', 'a nosotros nos faltan dos entradas', 'a nosotros nos hacen falta dos entradas'] },
    { id: 'cabeza', prompt: 'My head hurts.', answers: ['me duele la cabeza', 'a mí me duele la cabeza'] },
    { id: 'ajedrez', prompt: 'Chess bores them.', answers: ['les aburre el ajedrez', 'a ellos les aburre el ajedrez', 'a ellas les aburre el ajedrez', 'el ajedrez les aburre'] },
    { id: 'videojuegos', prompt: 'Do you (tú) like video games?', answers: ['te gustan los videojuegos', 'a ti te gustan los videojuegos'] },
    { id: 'arbitro', prompt: 'The referee annoys us.', answers: ['nos molesta el árbitro', 'el árbitro nos molesta', 'a nosotros nos molesta el árbitro'] },
    { id: 'teatro', prompt: 'She is interested in theater.', answers: ['le interesa el teatro', 'a ella le interesa el teatro'] },
    { id: 'entrenador', prompt: 'I like the coach. (caer bien)', answers: ['me cae bien el entrenador', 'el entrenador me cae bien', 'a mí me cae bien el entrenador', 'me cae bien la entrenadora', 'la entrenadora me cae bien'] },
    { id: 'partidos', prompt: 'We have two games left.', answers: ['nos quedan dos partidos', 'a nosotros nos quedan dos partidos'] },
    { id: 'musica', prompt: 'Does the music bother you? (usted)', answers: ['le molesta la música', 'a usted le molesta la música'] },
    { id: 'pies', prompt: 'His feet hurt.', answers: ['le duelen los pies', 'a él le duelen los pies'] },
    { id: 'ganar', prompt: "Winning doesn't matter to me.", answers: ['no me importa ganar', 'a mí no me importa ganar'] },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
