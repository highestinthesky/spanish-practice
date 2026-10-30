(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  // Descubre 3, Lección 2 (Las diversiones), reconstructed from the lesson's Contextos list. Replace with the
  // official list if it differs. `also` lists extra accepted spellings for en → es (the other gender, say).
  L2.VOCAB_GROUPS = [
    { id: 'musica', name: 'música y teatro', example: 'la taquilla' },
    { id: 'lugares', name: 'lugares de recreo', example: 'la feria' },
    { id: 'deportes', name: 'deportes', example: 'el árbitro' },
    { id: 'diversiones', name: 'diversiones', example: 'el ajedrez' },
    { id: 'adjetivos', name: 'adjetivos', example: 'animado' },
  ];

  const w = (group, es, en, also) => ({ group, es, en, also: also || [] });

  L2.vocab = [
    w('musica', 'el álbum', 'album'),
    w('musica', 'el asiento', 'seat'),
    w('musica', 'el/la cantante', 'singer'),
    w('musica', 'el concierto', 'concert'),
    w('musica', 'el conjunto musical', 'musical group, band', ['el grupo musical', 'grupo musical', 'el conjunto', 'conjunto']),
    w('musica', 'el escenario', 'stage'),
    w('musica', 'el espectáculo', 'show, performance'),
    w('musica', 'el estreno', 'premiere, debut'),
    w('musica', 'la función', 'performance (theater, movie)'),
    w('musica', 'el músico', 'musician', ['la música']),
    w('musica', 'la obra de teatro', 'play (theater)'),
    w('musica', 'la taquilla', 'box office'),
    w('musica', 'aplaudir', 'to applaud'),
    w('musica', 'conseguir entradas', 'to get tickets', ['conseguir boletos']),
    w('musica', 'hacer cola', 'to wait in line'),
    w('musica', 'valer la pena', 'to be worth it'),

    w('lugares', 'el cine', 'movie theater'),
    w('lugares', 'el circo', 'circus'),
    w('lugares', 'la feria', 'fair'),
    w('lugares', 'el festival', 'festival'),
    w('lugares', 'el parque de atracciones', 'amusement park'),
    w('lugares', 'el zoológico', 'zoo'),

    w('deportes', 'el aficionado', 'fan', ['la aficionada']),
    w('deportes', 'el árbitro', 'referee', ['la árbitra']),
    w('deportes', 'el campeón', 'champion', ['la campeona']),
    w('deportes', 'el campeonato', 'championship'),
    w('deportes', 'el club deportivo', 'sports club'),
    w('deportes', 'el/la deportista', 'athlete'),
    w('deportes', 'el empate', 'tie (game)'),
    w('deportes', 'el entrenador', 'coach, trainer', ['la entrenadora']),
    w('deportes', 'el equipo', 'team'),
    w('deportes', 'el espectador', 'spectator', ['la espectadora']),
    w('deportes', 'el torneo', 'tournament'),
    w('deportes', 'anotar', 'to score (a goal, a point)'),
    w('deportes', 'marcar', 'to score (a goal, a point)'),
    w('deportes', 'desafiar', 'to challenge'),
    w('deportes', 'empatar', 'to tie (games)'),
    w('deportes', 'ganar un partido', 'to win a game'),
    w('deportes', 'perder un partido', 'to lose a game'),
    w('deportes', 'vencer', 'to defeat'),

    w('diversiones', 'el ajedrez', 'chess'),
    w('diversiones', 'el billar', 'billiards'),
    w('diversiones', 'el boliche', 'bowling'),
    w('diversiones', 'las cartas', '(playing) cards', ['los naipes']),
    w('diversiones', 'los dardos', 'darts'),
    w('diversiones', 'el juego de mesa', 'board game'),
    w('diversiones', 'la lotería', 'lottery'),
    w('diversiones', 'el ocio', 'leisure'),
    w('diversiones', 'el pasatiempo', 'pastime'),
    w('diversiones', 'el tiempo libre', 'free time', ['los ratos libres']),
    w('diversiones', 'el videojuego', 'video game'),
    w('diversiones', 'brindar', 'to toast (drink)'),
    w('diversiones', 'celebrar', 'to celebrate', ['festejar']),
    w('diversiones', 'dar un paseo', 'to take a stroll'),
    w('diversiones', 'disfrutar', 'to enjoy'),
    w('diversiones', 'divertirse', 'to have fun'),
    w('diversiones', 'entretenerse', 'to amuse oneself'),
    w('diversiones', 'aburrirse', 'to get bored'),
    w('diversiones', 'reunirse', 'to get together'),
    w('diversiones', 'salir a comer', 'to go out to eat'),

    w('adjetivos', 'animado', 'lively', ['animada']),
    w('adjetivos', 'divertido', 'fun', ['divertida']),
    w('adjetivos', 'entretenido', 'entertaining', ['entretenida']),
    w('adjetivos', 'aficionado a', 'fond of, a fan of', ['aficionada a']),
  ];

  // Vocabulary in context: the first option is the answer; the builder shuffles them.
  const c = (group, id, prompt, options, why) => ({ group, id, prompt, options, why });

  L2.context = [
    c('musica', 'taquilla', 'Compramos las entradas en la ___ del teatro.', ['taquilla', 'escenario', 'función', 'butaca'], 'la taquilla = box office'),
    c('musica', 'cola', 'Había mucha gente; tuvimos que hacer ___ dos horas.', ['cola', 'función', 'escenario', 'estreno'], 'hacer cola = to wait in line'),
    c('musica', 'escenario', 'Los músicos salieron al ___ y todos gritaron.', ['escenario', 'asiento', 'álbum', 'zoológico'], 'el escenario = stage'),
    c('musica', 'estreno', 'Esta noche es el ___ de la película: nadie la ha visto todavía.', ['estreno', 'empate', 'álbum', 'ocio'], 'el estreno = premiere'),
    c('musica', 'aplaudir', 'Al final del concierto, el público empezó a ___.', ['aplaudir', 'empatar', 'vencer', 'desafiar'], 'aplaudir = to applaud'),
    c('musica', 'pena', 'La obra es larga, pero vale la ___.', ['pena', 'cola', 'función', 'feria'], 'valer la pena = to be worth it'),
    c('musica', 'asiento', 'Mi ___ está en la fila tres, muy cerca del escenario.', ['asiento', 'torneo', 'conjunto', 'boliche'], 'el asiento = seat'),
    c('musica', 'album', 'El grupo acaba de sacar un ___ con doce canciones nuevas.', ['álbum', 'árbitro', 'campeonato', 'circo'], 'el álbum = album'),
    c('musica', 'funcion', 'La primera ___ empieza a las siete y la segunda a las diez.', ['función', 'feria', 'lotería', 'cantante'], 'la función = performance, showing'),
    c('lugares', 'zoo', 'En el ___ vimos leones, jirafas y monos.', ['zoológico', 'circo', 'cine', 'escenario'], 'el zoológico = zoo'),
    c('lugares', 'parque', 'Subimos a la montaña rusa en el parque de ___.', ['atracciones', 'deportes', 'teatro', 'mesa'], 'el parque de atracciones = amusement park'),
    c('lugares', 'circo', 'Los payasos y los acróbatas trabajan en el ___.', ['circo', 'torneo', 'festival', 'billar'], 'el circo = circus'),
    c('lugares', 'feria', 'En la ___ del pueblo hay comida, música y juegos.', ['feria', 'taquilla', 'función', 'cartas'], 'la feria = fair'),
    c('deportes', 'arbitro', 'El ___ pitó el final del partido.', ['árbitro', 'aficionado', 'espectador', 'cantante'], 'el árbitro = referee'),
    c('deportes', 'empate', 'El partido terminó dos a dos: fue un ___.', ['empate', 'estreno', 'torneo', 'campeón'], 'el empate = tie'),
    c('deportes', 'aficionados', 'Los ___ del equipo cantaron durante todo el partido.', ['aficionados', 'árbitros', 'entrenadores', 'músicos'], 'el aficionado = fan'),
    c('deportes', 'entrenador', 'El ___ prepara a los jugadores todos los días.', ['entrenador', 'espectador', 'árbitro', 'aficionado'], 'el entrenador = coach'),
    c('deportes', 'vencer', 'Nuestro equipo quiere ___ a los campeones este año.', ['vencer', 'empatar', 'aplaudir', 'brindar'], 'vencer = to defeat'),
    c('deportes', 'marcar', 'Diego corrió y logró ___ un gol en el último minuto.', ['marcar', 'aplaudir', 'brindar', 'desafiar'], 'marcar / anotar un gol = to score a goal'),
    c('deportes', 'empatar', 'Si los dos equipos tienen los mismos puntos, van a ___.', ['empatar', 'vencer', 'anotar', 'entretener'], 'empatar = to tie'),
    c('deportes', 'desafiar', 'Mi hermano siempre me quiere ___ a una carrera.', ['desafiar', 'empatar', 'aplaudir', 'brindar'], 'desafiar = to challenge'),
    c('deportes', 'campeonato', 'El equipo que gana el ___ recibe una copa.', ['campeonato', 'pasatiempo', 'conjunto', 'estreno'], 'el campeonato = championship'),
    c('deportes', 'torneo', 'Hay un ___ de tenis con dieciséis jugadores.', ['torneo', 'ocio', 'asiento', 'álbum'], 'el torneo = tournament'),
    c('diversiones', 'ajedrez', 'En el ___ hay reyes, reinas y caballos.', ['ajedrez', 'billar', 'boliche', 'dardos'], 'el ajedrez = chess'),
    c('diversiones', 'boliche', 'En el ___ tiras una bola para derribar diez pinos.', ['boliche', 'ajedrez', 'billar', 'circo'], 'el boliche = bowling'),
    c('diversiones', 'dardos', 'Lanzó los ___ y uno cayó en el centro del blanco.', ['dardos', 'naipes', 'videojuegos', 'boletos'], 'los dardos = darts'),
    c('diversiones', 'loteria', 'Mi tío compra un boleto de ___ cada semana, pero nunca gana.', ['lotería', 'taquilla', 'feria', 'función'], 'la lotería = lottery'),
    c('diversiones', 'brindar', 'Levantamos las copas para ___ por los novios.', ['brindar', 'vencer', 'empatar', 'aburrirse'], 'brindar = to toast'),
    c('diversiones', 'tiempo', 'En mi tiempo ___ leo novelas y juego videojuegos.', ['libre', 'animado', 'deportivo', 'musical'], 'el tiempo libre = free time'),
    c('diversiones', 'aburrirse', 'Sin nada que hacer, los niños empezaron a ___.', ['aburrirse', 'divertirse', 'entretenerse', 'reunirse'], 'aburrirse = to get bored'),
    c('diversiones', 'reunirse', 'Los viernes me gusta ___ con mis amigos en un café.', ['reunirme', 'aburrirme', 'vencerme', 'empatarme'], 'reunirse (con) = to get together (with)'),
    c('diversiones', 'mesa', 'El Monopoly es mi juego de ___ favorito.', ['mesa', 'cartas', 'cola', 'pena'], 'el juego de mesa = board game'),
    c('adjetivos', 'animado', 'La fiesta estuvo muy ___: todos bailaron hasta tarde.', ['animada', 'aburrida', 'agotada', 'cansada'], 'animado/a = lively'),
    c('adjetivos', 'aficionado', 'Soy muy ___ al fútbol: no me pierdo ningún partido.', ['aficionado', 'entretenido', 'animado', 'deportivo'], 'ser aficionado/a a = to be a fan of'),
    c('adjetivos', 'entretenido', 'El libro es tan ___ que lo leí en un día.', ['entretenido', 'agotado', 'aficionado', 'deportivo'], 'entretenido/a = entertaining'),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
