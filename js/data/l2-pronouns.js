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

    // More practice, same five skills.
    gap('od', 'abuelos', '¿Llamaste a tus abuelos? — Sí, ___ llamé ayer.', ['los'], 'los = a tus abuelos (persona, masculino plural)'),
    gap('od', 'pastel', '¿Quién trae el pastel? — Yo ___ traigo.', ['lo'], 'lo = el pastel'),
    gap('od', 'pizza', '¿Pediste la pizza? — Sí, ___ pedí hace media hora.', ['la'], 'la = la pizza'),
    gap('od', 'llamas', '¿Me llamas mañana? — Claro, ___ llamo a las diez.', ['te'], 'me (pregunta) → te (respuesta)'),
    gap('od', 'platos', '¿Vas a lavar los platos? — Sí, voy a lavar___ ahora.', ['los'], 'lavarlos: pegado al infinitivo'),
    gap('od', 'album-nuevo', '¿Compraste el álbum nuevo? — No, no ___ compré todavía.', ['lo'], 'no + pronombre + verbo'),
    gap('od', 'montanas', '¿Ves las montañas desde aquí? — Sí, ___ veo muy bien.', ['las'], 'las = las montañas'),
    gap('od', 'vosotros-veo', 'Chicos, ¿me veis? — Sí, profesora, ___ vemos.', ['la', 'te'], 'a la profesora → la (o te, si la tutean)', { vos: true }),
    ch('od', 'entrenadora', '¿Y la nueva entrenadora? No ___ conozco.', ['la', 'le', 'lo', 'se'], 'la = a la entrenadora (OD de persona, femenino)'),
    ch('od', 'dardos', '¿Los dardos? Mi hermano ___ perdió.', ['los', 'les', 'las', 'lo'], 'los = los dardos'),
    ch('od', 'marta-sofia', '¿Invitaste a Marta y a Sofía? — Sí, ___ invité.', ['las', 'les', 'los', 'la'], 'las = a Marta y a Sofía (OD femenino plural)'),

    gap('oi', 'consejos', 'Mis padres siempre ___ dan consejos a mí.', ['me'], 'a mí → me'),
    gap('oi', 'amarilla', 'El árbitro ___ mostró la tarjeta amarilla al portero.', ['le'], 'le = al portero'),
    gap('oi', 'carta', '¿___ escribes una carta a tus abuelos?', ['les'], 'les = a tus abuelos'),
    gap('oi', 'leccion', 'La profesora ___ explicó la lección a nosotros.', ['nos'], 'a nosotros → nos'),
    gap('oi', 'pedirle', 'Voy a pedir___ ayuda a mi hermano.', ['le'], 'pedirle: le = a mi hermano'),
    gap('oi', 'os-dijo', '¿Quién ___ dijo eso a vosotros?', ['os'], 'a vosotros → os', { vos: true }),
    ch('oi', 'regalo-ti', 'A ti ___ voy a comprar un regalo.', ['te', 'ti', 'le', 'se'], 'a ti → te'),
    ch('oi', 'postales', 'Mi tía ___ manda postales a sus sobrinos.', ['les', 'los', 'le', 'se'], 'les = a sus sobrinos (OI plural)'),
    ch('oi', 'menu', 'A usted ___ traigo el menú en seguida.', ['le', 'lo', 'la', 'se'], 'a usted → le (OI)'),

    rw('doble', 'vecinos', 'Les vendí los boletos a mis vecinos.', ['se los vendí', 'se los vendí a mis vecinos'], 'les + los → se los'),
    rw('doble', 'helado', '¿Me compras un helado?', ['me lo compras'], 'me + lo'),
    rw('doble', 'reglas', 'Nos explicaron las reglas.', ['nos las explicaron'], 'nos + las'),
    rw('doble', 'autografo', 'Le pedí un autógrafo al cantante.', ['se lo pedí', 'se lo pedí al cantante'], 'le + lo → se lo'),
    rw('doble', 'devuelvo', 'Te devuelvo las cartas mañana.', ['te las devuelvo mañana', 'mañana te las devuelvo'], 'te + las'),
    rw('doble', 'guitarra', 'Le regalaron una guitarra a Pablo.', ['se la regalaron', 'se la regalaron a pablo'], 'le + la → se la'),
    rw('doble', 'os-doy', 'Os doy las entradas.', ['os las doy'], 'os + las', { vos: true }),
    ch('doble', 'dinero', '¿El dinero? Ya ___ devolví a mi padre.', ['se lo', 'le lo', 'lo le', 'se la'], 'le + lo → se lo'),
    ch('doble', 'fotos-nos', '¿Las fotos? Mis amigos ___ mandaron. (a nosotros)', ['nos las', 'se las', 'las nos', 'nos los'], 'OI (nos) antes del OD (las)'),
    ch('doble', 'boleto-me', '¿El boleto? ¿___ das? (a mí)', ['Me lo', 'Se lo', 'Lo me', 'Me la'], 'me + lo'),

    gap('prep', 'cerca', 'Siéntate cerca de ___. (yo)', ['mí'], 'de + yo → de mí'),
    gap('prep', 'para-el', 'Este mensaje es para ___. (él)', ['él'], 'para + él (con acento: pronombre)'),
    gap('prep', 'de-ti', 'Hablamos mucho de ___ ayer. (tú)', ['ti'], 'de + tú → de ti'),
    gap('prep', 'en-ella', 'Pienso en ___ todo el día. (ella)', ['ella'], 'en + ella'),
    gap('prep', 'conmigo-viajan', 'Mis padres viajan ___ a todas partes. (con + yo)', ['conmigo'], 'con + yo → conmigo'),
    gap('prep', 'menos', 'Todos fueron a la feria menos ___. (yo)', ['yo'], 'menos, excepto, según y entre van con yo / tú'),
    gap('prep', 'excepto', 'Excepto ___, todos aplaudieron. (tú)', ['tú'], 'excepto + tú'),
    ch('prep', 'para-ti', 'Hay un regalo para ___ y otro para mí. (tú)', ['ti', 'tú', 'te', 'contigo'], 'para + tú → para ti'),
    ch('prep', 'entre-nosotros', 'Entre ___ no hay secretos. (tú y yo)', ['tú y yo', 'ti y mí', 'te y me', 'ti y yo'], 'entre tú y yo'),
    ch('prep', 'con-nosotros', 'El entrenador está contento con ___. (nosotros)', ['nosotros', 'nos', 'conmigo', 'nuestro'], 'con + nosotros'),

    rw('pos', 'tarea', 'Tengo que hacer la tarea.', ['tengo que hacerla', 'la tengo que hacer'], 'con infinitivo: delante del verbo conjugado o pegado'),
    rw('pos', 'leyendo', 'Está leyendo la revista.', ['está leyéndola', 'la está leyendo'], 'pegado al gerundio, con acento: leyéndola'),
    rw('pos', 'escucha', 'Escucha la canción. (mandato)', ['escúchala'], 'mandato afirmativo: pegado y con acento'),
    rw('pos', 'no-mires', 'No mires el partido. (mandato)', ['no lo mires'], 'mandato negativo: delante del verbo'),
    rw('pos', 'dame', 'Dame las entradas. (mandato)', ['dámelas'], 'da + me + las → dámelas'),
    rw('pos', 'no-digas', 'No me digas la respuesta. (mandato)', ['no me la digas'], 'mandato negativo: OI + OD delante del verbo'),
    rw('pos', 'haz', 'Haz los ejercicios. (mandato)', ['hazlos'], 'haz + los; una sílaba, sin acento'),
    rw('pos', 'pensamos', 'Pensamos ver la película.', ['pensamos verla', 'la pensamos ver'], 'con infinitivo: dos posiciones'),
    rw('pos', 'escribiendole', 'Estoy escribiéndole una carta a Ana.', ['estoy escribiéndosela', 'se la estoy escribiendo'], 'le + la → se la; pegado al gerundio con acento'),
    ch('pos', 'cantala', '¿La canción? ___, por favor. (tú, mandato)', ['Cántala', 'Cantala', 'La canta', 'Cantalá'], 'pegado al mandato, acento en la sílaba fuerte'),
    ch('pos', 'no-laves', '¿Los platos? No ___. (tú, mandato)', ['los laves', 'lávalos', 'laves los', 'los lavas'], 'mandato negativo: pronombre delante'),
    ch('pos', 'darselo', '¿El regalo? Voy a ___. (a ella)', ['dárselo', 'dárlelo', 'darselo', 'dárlo'], 'dar + se + lo → dárselo (con acento)'),
  ].map((it) => ({ ...it, vos: Boolean(it.vos) }));
})(typeof window !== 'undefined' ? window : globalThis);
