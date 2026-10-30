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
    verb('gustar', 'to like, to be pleasing to', 'gusta', 'gustan', [pl('videojuegos', 'los videojuegos'), sg('boliche', 'el boliche'), inf('cine', 'ir al cine'), pl('mesa', 'los juegos de mesa'), sg('circo', 'el circo'), inf('cartas', 'jugar a las cartas')]),
    verb('encantar', 'to like very much, to love', 'encanta', 'encantan', [pl('conciertos', 'los conciertos'), sg('musica', 'la música en vivo'), inf('salsa', 'bailar salsa'), pl('ferias', 'las ferias'), sg('zoo', 'el zoológico')]),
    verb('fascinar', 'to fascinate', 'fascina', 'fascinan', [pl('terror', 'las películas de terror'), sg('ajedrez', 'el ajedrez'), inf('tenis', 'ver partidos de tenis'), pl('acrobatas', 'los acróbatas del circo')]),
    verb('aburrir', 'to bore', 'aburre', 'aburren', [pl('telenovelas', 'las telenovelas'), sg('golf', 'el golf'), inf('cola', 'hacer cola'), pl('dardos', 'los dardos')]),
    verb('interesar', 'to interest', 'interesa', 'interesan', [pl('deportes', 'los deportes'), sg('teatro', 'el teatro'), inf('guitarra', 'aprender a tocar la guitarra'), pl('obras', 'las obras de teatro')]),
    verb('importar', 'to matter, to be important to', 'importa', 'importan', [pl('resultados', 'los resultados'), sg('opinion', 'la opinión del entrenador'), inf('ganar', 'ganar el torneo')]),
    verb('molestar', 'to bother, to annoy', 'molesta', 'molestan', [pl('ruidosos', 'los espectadores ruidosos'), sg('humo', 'el humo'), inf('esperar', 'esperar en la taquilla')]),
    verb('preocupar', 'to worry', 'preocupa', 'preocupan', [pl('examenes', 'los exámenes'), sg('partido', 'el partido de mañana'), inf('perder', 'perder el campeonato')]),
    verb('faltar', 'to lack, to need', 'falta', 'faltan', [pl('jugadores', 'dos jugadores'), sg('asiento', 'un asiento'), inf('practicar', 'practicar más'), pl('cartas', 'tres cartas')]),
    verb('hacer falta', 'to miss, to need', 'hace falta', 'hacen falta', [pl('entradas', 'dos entradas'), sg('arbitro', 'un buen árbitro'), inf('descansar', 'descansar'), pl('vacaciones', 'unas vacaciones')]),
    verb('doler', 'to hurt, to ache', 'duele', 'duelen', [pl('pies', 'los pies'), sg('cabeza', 'la cabeza'), pl('piernas', 'las piernas'), sg('estomago', 'el estómago')]),
    verb('quedar', 'to be left over', 'queda', 'quedan', [pl('partidos', 'tres partidos'), sg('semana', 'una semana de vacaciones'), pl('entradas', 'dos entradas'), sg('dinero', 'poco dinero')]),
    verb('caer bien', 'to get along well with, to like (someone)', 'cae bien', 'caen bien', [pl('aficionados', 'los aficionados del otro equipo'), sg('entrenadora', 'la nueva entrenadora'), sg('arbitro', 'el árbitro'), pl('primos', 'tus primos')]),
    verb('caer mal', 'to not get along with, to dislike (someone)', 'cae mal', 'caen mal', [pl('arbitros', 'los árbitros injustos'), sg('cantante', 'el cantante'), pl('vecinos', 'los vecinos'), sg('vecina', 'la nueva vecina')]),
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
    { kind: 'gap', id: 'a-ellos', prompt: 'A ___ les fascinan los dardos. (ellos)', answers: ['ellos'], why: 'a + ellos, y después les' },
    { kind: 'gap', id: 'a-usted', prompt: 'A ___ le encanta el billar, ¿verdad? (usted)', answers: ['usted'], why: 'a usted → le' },
    { kind: 'gap', id: 'a-ti-tu', prompt: '¿A ___ te preocupan los exámenes? (tú)', answers: ['ti'], why: 'después de a: tú → ti' },
    { kind: 'choice', id: 'gustan-ti', prompt: '¿A ti te ___ los videojuegos?', options: ['gustan', 'gusta', 'gustas', 'gusto'], why: 'concuerda con «los videojuegos» (plural)' },
    { kind: 'choice', id: 'duele', prompt: 'A Luis le ___ la cabeza.', options: ['duele', 'duelen', 'duelo', 'dolemos'], why: '«la cabeza» es singular → duele' },
    { kind: 'choice', id: 'hacen-falta', prompt: 'A mis padres les ___ falta unas vacaciones.', options: ['hacen', 'hace', 'hago', 'hacemos'], why: '«unas vacaciones» es plural → hacen falta' },
    { kind: 'choice', id: 'vecinos', prompt: '___ les molesta el ruido de la fiesta.', options: ['A los vecinos', 'Los vecinos', 'Para los vecinos', 'De los vecinos'], why: 'la persona va con a: a los vecinos les…' },
    { kind: 'choice', id: 'caen-ellos', prompt: 'Me ___ ellos. (caer bien)', options: ['caen bien', 'cae bien', 'caigo bien', 'caes bien'], why: 'el sujeto es ellos → caen bien' },
    { kind: 'choice', id: 'quedan', prompt: 'A nosotros nos ___ dos partidos.', options: ['quedan', 'queda', 'quedamos', 'quedáis'], why: '«dos partidos» es plural → quedan' },
    { kind: 'choice', id: 'si-abro', prompt: '¿Le ___ a usted si abro la ventana?', options: ['molesta', 'molestan', 'molesto', 'molestas'], why: 'una frase entera cuenta como singular' },
    { kind: 'choice', id: 'interesan', prompt: 'A ella no le ___ los deportes.', options: ['interesan', 'interesa', 'interesas', 'interesamos'], why: '«los deportes» es plural' },
    { kind: 'choice', id: 'me-fascina', prompt: 'A mí ___ fascina el circo.', options: ['me', 'mí', 'yo', 'le'], why: 'a mí → me' },
    { kind: 'choice', id: 'encanta-que', prompt: 'A Paula le ___ el teatro y los conciertos.', options: ['encantan', 'encanta', 'encantas', 'encanto'], why: 'dos cosas juntas → plural' },
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
    { id: 'circo', prompt: 'They love the circus.', answers: ['les encanta el circo', 'a ellos les encanta el circo', 'a ellas les encanta el circo'] },
    { id: 'teatro-usted', prompt: 'Do you (usted) like the theater?', answers: ['le gusta el teatro', 'a usted le gusta el teatro'] },
    { id: 'deportes', prompt: 'We are interested in sports.', answers: ['nos interesan los deportes', 'a nosotros nos interesan los deportes'] },
    { id: 'cola', prompt: 'Waiting in line bothers me.', answers: ['me molesta hacer cola', 'a mí me molesta hacer cola', 'hacer cola me molesta'] },
    { id: 'espalda', prompt: 'Her back hurts.', answers: ['le duele la espalda', 'a ella le duele la espalda'] },
    { id: 'entrada-ti', prompt: 'You (tú) need a ticket.', answers: ['te falta una entrada', 'te hace falta una entrada', 'te falta un boleto', 'te hace falta un boleto', 'a ti te falta una entrada', 'a ti te hace falta una entrada'] },
    { id: 'resultados', prompt: 'The results surprise them.', answers: ['les sorprenden los resultados', 'a ellos les sorprenden los resultados', 'a ellas les sorprenden los resultados', 'los resultados les sorprenden'] },
    { id: 'dolares', prompt: 'I have ten dollars left.', answers: ['me quedan diez dólares', 'a mí me quedan diez dólares'] },
    { id: 'campeonato', prompt: 'The championship worries the coach.', answers: ['al entrenador le preocupa el campeonato', 'le preocupa el campeonato al entrenador', 'el campeonato le preocupa al entrenador', 'a la entrenadora le preocupa el campeonato'] },
    { id: 'cae-mal', prompt: "We don't like the referee. (caer mal)", answers: ['nos cae mal el árbitro', 'el árbitro nos cae mal', 'a nosotros nos cae mal el árbitro'] },
    { id: 'mesa', prompt: 'Board games bore me.', answers: ['me aburren los juegos de mesa', 'a mí me aburren los juegos de mesa', 'los juegos de mesa me aburren'] },
    { id: 'hermano', prompt: 'Chess fascinates my brother.', answers: ['a mi hermano le fascina el ajedrez', 'le fascina el ajedrez a mi hermano', 'el ajedrez le fascina a mi hermano'] },
    { id: 'importa', prompt: "It doesn't matter to us.", answers: ['no nos importa', 'a nosotros no nos importa'] },
    { id: 'vosotros', prompt: 'Do you (vosotros) like concerts?', answers: ['os gustan los conciertos', 'a vosotros os gustan los conciertos'], vos: true },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
