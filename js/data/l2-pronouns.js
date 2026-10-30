(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  // Descubre 3, Lección 2, Estructuras: object pronouns (direct, indirect, double) and prepositional pronouns.
  L2.PRONOUN_SKILLS = [
    { id: 'od', name: 'objeto directo', example: 'lo, la, los, las' },
    { id: 'oi', name: 'objeto indirecto', example: 'me, te, le, nos, les' },
    { id: 'doble', name: 'doble', example: 'le + lo → se lo' },
    { id: 'prep', name: 'preposicionales', example: 'para mí, conmigo' },
    { id: 'pos', name: 'posición', example: 'cómpralas, voy a verlo' },
  ];

  // gap: type the word(s) for ___ · rewrite: say it again with pronouns · choice: first option is right.
  // vos: only with vosotros on.
  const gap = (skill, id, prompt, answers, why, extra) => ({ skill, id, kind: 'gap', prompt, answers, why, ...extra });
  const rw = (skill, id, prompt, answers, why) => ({ skill, id, kind: 'rewrite', prompt, answers, why });
  const ch = (skill, id, prompt, options, why, extra) => ({ skill, id, kind: 'choice', prompt, options, why, ...extra });

  L2.pronouns = [
    gap('od', 'partido', '¿Viste el partido anoche? — Sí, ___ vi con mis amigos.', ['lo'], 'lo = el partido (masculino singular)'),
    gap('od', 'entradas', '¿Tienes las entradas? — No, no ___ tengo.', ['las'], 'las = las entradas (femenino plural)'),
    gap('od', 'cantante', '¿Conoces a la cantante? — Sí, ___ conozco desde niña.', ['la'], 'la = a la cantante (persona, femenino)'),
    gap('od', 'musicos', 'Los aficionados aplauden a los músicos. → Los aficionados ___ aplauden.', ['los'], 'los = a los músicos'),
    gap('od', 'escuchas', '¿Me escuchas bien? — Sí, ___ escucho perfectamente.', ['te'], 'me (pregunta) → te (respuesta)'),
    gap('od', 'campeonato', '¿Quién ganó el campeonato? — Nuestro equipo ___ ganó.', ['lo'], 'lo = el campeonato'),
    gap('od', 'videojuegos', '¿Dónde compraron los videojuegos? — ___ compramos en el centro.', ['los'], 'los = los videojuegos'),
    gap('od', 'invitas', '¿Nos invitas a la fiesta? — Claro, ___ invito a ustedes.', ['los'], 'a ustedes → los (OD plural)'),
    gap('od', 'obra', '¿Vas a ver la obra de teatro? — Sí, voy a ver___ el sábado.', ['la'], 'verla: el pronombre se une al infinitivo'),
    ch('od', 'album', 'Mi hermana tiene un álbum nuevo y ___ escucha todo el día.', ['lo', 'la', 'le', 'los'], 'lo = el álbum (masculino singular)'),
    ch('od', 'cartas', '¿Las cartas? Yo ___ guardo en el cajón.', ['las', 'les', 'los', 'la'], 'las = las cartas'),
    ch('od', 'arbitro', 'El árbitro está allí. ¿___ ves?', ['Lo', 'Le', 'La', 'Se'], 'lo = al árbitro (OD de persona, masculino)'),

    gap('oi', 'estrategia', 'El entrenador ___ explica la estrategia a los jugadores.', ['les'], 'les = a los jugadores (OI plural)'),
    gap('oi', 'numero', '¿___ das tu número? (a mí)', ['me'], 'a mí → me'),
    gap('oi', 'regalo', 'Mi abuelo ___ regaló un juego de mesa a mi hermana.', ['le'], 'le = a mi hermana; el OI se repite con «a + persona»'),
    gap('oi', 'cancion', 'El cantante ___ dedicó una canción a nosotros.', ['nos'], 'a nosotros → nos'),
    gap('oi', 'arbitro-dijo', '¿Qué ___ dijo el árbitro a ti?', ['te'], 'a ti → te'),
    gap('oi', 'escribir', 'Voy a escribir___ un mensaje a mis primos.', ['les'], 'escribirles: les = a mis primos'),
    gap('oi', 'vosotros', 'Chicos, ¿quién ___ vendió las entradas a vosotros?', ['os'], 'a vosotros → os', { vos: true }),
    ch('oi', 'flores', 'A Elena ___ trajeron flores después del estreno.', ['le', 'la', 'se', 'lo'], 'le = a Elena (OI: recibe las flores)'),
    ch('oi', 'grupo', 'Los espectadores ___ pidieron otra canción al grupo.', ['le', 'les', 'lo', 'se'], 'el grupo es singular → le'),
    ch('oi', 'padres', 'A mis padres ___ compré boletos para el circo.', ['les', 'los', 'le', 'se'], 'les = a mis padres (OI plural)'),

    rw('doble', 'boleto', 'Le doy el boleto a Marta.', ['se lo doy', 'se lo doy a marta'], 'le + lo → se lo'),
    rw('doble', 'fotos', 'Les mostramos las fotos del festival a nuestros padres.', ['se las mostramos', 'se las mostramos a nuestros padres'], 'les + las → se las'),
    rw('doble', 'prestas', '¿Me prestas tus cartas?', ['me las prestas'], 'me + las: el OI va primero'),
    rw('doble', 'compro', 'Te compro la entrada.', ['te la compro'], 'te + la'),
    rw('doble', 'tarjeta', 'El árbitro le mostró la tarjeta roja al jugador.', ['el árbitro se la mostró', 'se la mostró', 'el árbitro se la mostró al jugador', 'se la mostró al jugador'], 'le + la → se la'),
    rw('doble', 'recomendaron', 'Nos recomendaron el concierto.', ['nos lo recomendaron'], 'nos + lo'),
    rw('doble', 'regalar', 'Voy a regalarle el videojuego a mi hermano.', ['voy a regalárselo', 'se lo voy a regalar'], 'le + lo → se lo; con infinitivo: delante del verbo o pegado (con acento)'),
    rw('doble', 'explicando', 'Estoy explicándoles las reglas del ajedrez a los niños.', ['estoy explicándoselas', 'se las estoy explicando'], 'les + las → se las; pegado al gerundio lleva acento'),
    ch('doble', 'album-me', '¿El álbum? Mi amiga ___ prestó ayer. (a mí)', ['me lo', 'se lo', 'me la', 'lo me'], 'OI (me) + OD (lo), en ese orden'),
    ch('doble', 'se-las', '¿Las entradas? Ya ___ di a Carlos.', ['se las', 'le las', 'les las', 'se los'], 'le/les + lo/la/los/las → se'),
    ch('doble', 'nos-la', '¿La pizza? El camarero ___ trajo fría. (a nosotros)', ['nos la', 'se la', 'la nos', 'nos lo'], 'nos + la'),

    gap('prep', 'para-mi', 'Este boleto es para ___. (yo)', ['mí'], 'después de preposición: yo → mí (con acento)'),
    gap('prep', 'conmigo', '¿Quieres ir al cine ___? (con + yo)', ['conmigo'], 'con + yo → conmigo'),
    gap('prep', 'sin-ti', 'No puedo jugar al billar sin ___. (tú)', ['ti'], 'tú → ti (sin acento)'),
    gap('prep', 'contigo', 'Ana va al concierto ___. (con + tú)', ['contigo'], 'con + tú → contigo'),
    gap('prep', 'entre', 'Entre ___, el concierto fue aburrido. (tú y yo)', ['tú y yo'], 'entre usa los pronombres de sujeto: entre tú y yo'),
    gap('prep', 'ella', 'A ___ le encanta el circo. (ella)', ['ella'], 'a + ella: igual que el sujeto'),
    gap('prep', 'nosotros', 'A ___ nos gusta el boliche. (nosotros)', ['nosotros'], 'a + nosotros'),
    gap('prep', 'consigo', 'Pedro siempre lleva su guitarra ___. (con + él mismo)', ['consigo'], 'con + sí mismo → consigo'),
    gap('prep', 'ustedes', 'Estas entradas son para ___. (ustedes)', ['ustedes'], 'para + ustedes'),
    ch('prep', 'segun', 'Según ___, el equipo va a ganar. (yo)', ['yo', 'mí', 'me', 'conmigo'], 'según y entre van con yo / tú'),
    ch('prep', 'ti', 'El regalo es para ___.', ['ti', 'tí', 'te', 'tu'], 'ti nunca lleva acento'),
    ch('prep', 'vosotros', 'Las palomitas son para ___. (vosotros)', ['vosotros', 'os', 'vos', 'ustedes'], 'para + vosotros', { vos: true }),

    rw('pos', 'comprar', 'Voy a comprar las entradas.', ['voy a comprarlas', 'las voy a comprar'], 'con infinitivo: delante del verbo conjugado o pegado al infinitivo'),
    rw('pos', 'viendo', 'Estamos viendo el partido.', ['estamos viéndolo', 'lo estamos viendo'], 'pegado al gerundio, con acento: viéndolo'),
    rw('pos', 'compra', 'Compra las entradas. (mandato)', ['cómpralas'], 'mandato afirmativo: pegado y con acento'),
    rw('pos', 'no-compres', 'No compres las entradas. (mandato)', ['no las compres'], 'mandato negativo: delante del verbo'),
    rw('pos', 'pon', 'Pon el disco. (mandato)', ['ponlo'], 'pon + lo; una sílaba, sin acento'),
    rw('pos', 'trae', 'Tráeme el boleto. (mandato)', ['tráemelo'], 'OI + OD pegados al mandato'),
    rw('pos', 'di', 'Dime la verdad. (mandato)', ['dímela'], 'di + me + la → dímela'),
    ch('pos', 'verlo', '¿El partido? Quiero ___.', ['verlo', 'lo ver', 'velo', 'verle'], 'pegado al infinitivo'),
    ch('pos', 'explicame', 'Las reglas del juego: ___, por favor. (tú, mandato)', ['explícamelas', 'explicamelas', 'me las explica', 'explícalasme'], 'OI antes del OD, con acento en la sílaba fuerte'),
  ].map((it) => ({ ...it, vos: Boolean(it.vos) }));
})(typeof window !== 'undefined' ? window : globalThis);
