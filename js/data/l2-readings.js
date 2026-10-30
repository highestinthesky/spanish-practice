(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});

  // Original short readings on the lesson theme. In the text, [[palabra|gloss]] marks a glossed word and
  // {{pronombre|id}} a pronoun that a question points at. In each question the first option is right.
  // kind: mc (comprensión) · tf (cierto / falso) · vocab (palabra en contexto) · ref (pronombre).
  const q = (kind, text, options, extra) => ({ kind, q: text, options, ...extra });
  // cierto / falso always in that order.
  const tf = (text, isTrue, why) => q('tf', text, ['cierto', 'falso'], { why, fixed: true, correct: isTrue ? 0 : 1 });

  L2.readings = [
    {
      id: 'entradas',
      title: 'Entradas agotadas',
      tag: 'música',
      text: `El sábado pasado, Sofía y su hermano Mateo querían ir al [[concierto|concert]] de Los Rayos, su [[grupo musical|band]] favorito. A Sofía le encanta la cantante, Lucía Ríos, y siempre escucha su último [[álbum|album]] en el autobús.

Llegaron al teatro a las seis, pero ya había mucha gente [[haciendo cola|waiting in line]] delante de la [[taquilla|box office]]. Después de una hora, la empleada les dijo: «Lo siento, las entradas están [[agotadas|sold out]]». Mateo estaba muy triste, pero Sofía tuvo una idea. Su prima Valeria trabaja en el teatro, así que Sofía {{la|r1}} llamó por teléfono.

Valeria tenía dos entradas extra y {{se las|r2}} regaló a sus primos. Los [[asientos|seats]] estaban un poco lejos del [[escenario|stage]], pero no les importó. Cuando Lucía Ríos cantó su canción más famosa, todos los [[espectadores|spectators]] se levantaron para [[aplaudir|applaud]].

Al salir, Mateo le dijo a su hermana: «Gracias por no rendirte. ¡[[Valió la pena|it was worth it]]!». Sofía sonrió y le contestó: «Para {{mí|r3}}, lo mejor fue cantar contigo».`,
      questions: [
        q('mc', '¿Por qué querían ir al concierto Sofía y Mateo?', ['Los Rayos es su grupo favorito.', 'Su prima canta en el grupo.', 'Ganaron las entradas en la lotería.', 'Su padre trabaja en el teatro.']),
        tf('Sofía y Mateo compraron las entradas en la taquilla.', false, 'Las entradas estaban agotadas; se las regaló Valeria.'),
        q('ref', 'En «Sofía la llamó por teléfono», ¿a quién se refiere «la»?', ['a Valeria', 'a la cantante', 'a la empleada', 'a la taquilla'], { ref: 'r1', why: 'la = OD, la prima Valeria' }),
        q('ref', 'En «se las regaló a sus primos», ¿qué reemplazan «se» y «las»?', ['se = a sus primos · las = las entradas', 'se = a Valeria · las = las canciones', 'se = a la empleada · las = las entradas', 'se = a Mateo · las = las cartas'], { ref: 'r2', why: 'les + las → se las' }),
        q('vocab', 'En el texto, «agotadas» quiere decir que…', ['no quedaban entradas', 'las entradas eran caras', 'las entradas eran gratis', 'los espectadores estaban cansados']),
        tf('Los asientos estaban muy cerca del escenario.', false, 'Estaban un poco lejos del escenario.'),
        q('ref', '«Para mí, lo mejor fue cantar contigo». ¿Por qué se dice «mí» y no «yo»?', ['Va después de una preposición.', 'Es el sujeto de la frase.', 'Es un objeto directo.', 'Es un mandato.'], { ref: 'r3', why: 'después de preposición: mí, ti (pero con + yo → conmigo)' }),
      ],
    },
    {
      id: 'final',
      title: 'La final del campeonato',
      tag: 'deportes',
      text: `Este domingo fue la final del [[campeonato|championship]] regional de fútbol. El [[equipo|team]] de nuestro barrio, Los Halcones, jugó contra Las Águilas, los [[campeones|champions]] del año pasado. Más de dos mil [[aficionados|fans]] llenaron el estadio.

En el primer tiempo, Las Águilas [[anotaron|scored]] un gol muy rápido. Nuestro [[entrenador|coach]], el señor Ortega, estaba nervioso, pero no {{lo|r1}} mostró. En el descanso, les habló a los jugadores con calma: «Ustedes pueden [[vencer|defeat]] a cualquier equipo. Yo confío en {{ustedes|r2}}».

En el segundo tiempo, Diego, nuestro delantero, [[marcó|scored]] un gol increíble y el partido quedó en [[empate|tie]]. Faltaban dos minutos cuando el [[árbitro|referee]] [[pitó un penalti|called a penalty]] a nuestro favor. A Diego le temblaban las piernas, pero pateó el balón con fuerza y… ¡gol!

Después del partido, los jugadores levantaron la copa y {{se la|r3}} dedicaron al señor Ortega. A mí me encantó ver a todo el barrio [[festejando|celebrating]] en la calle hasta la medianoche.`,
      questions: [
        q('mc', '¿Contra quién jugó el equipo del barrio?', ['contra los campeones del año anterior', 'contra el equipo del señor Ortega', 'contra un club de otro país', 'contra los aficionados']),
        tf('Los Halcones anotaron el primer gol.', false, 'Las Águilas anotaron primero.'),
        q('ref', 'En «pero no lo mostró», ¿a qué se refiere «lo»?', ['a que estaba nervioso', 'al gol', 'al estadio', 'al árbitro'], { ref: 'r1', why: 'lo también puede reemplazar una idea entera' }),
        q('ref', 'En «Yo confío en ustedes», «ustedes» es un pronombre…', ['preposicional (va después de «en»)', 'de objeto directo', 'de objeto indirecto', 'reflexivo'], { ref: 'r2' }),
        q('ref', 'En «se la dedicaron al señor Ortega», «la» es…', ['la copa', 'la final', 'la calle', 'la medianoche'], { ref: 'r3', why: 'le + la → se la; la = la copa' }),
        q('vocab', '«El partido quedó en empate» significa que…', ['los dos equipos tenían los mismos goles', 'el partido terminó', 'el árbitro paró el partido', 'Los Halcones ganaron']),
        tf('Al narrador le gustó ver la celebración en la calle.', true, '«A mí me encantó ver a todo el barrio festejando».'),
      ],
    },
    {
      id: 'correo',
      title: 'Un correo de Camila',
      tag: 'gustar',
      text: `¡Hola, Andrés! ¿Qué tal tus vacaciones? Aquí en Valparaíso lo estamos pasando muy bien. A mis padres les [[fascina|fascinates]] el mar, así que todas las mañanas [[damos un paseo|take a walk]] por la playa. Por las tardes, mi hermano Tomás y yo vamos a la [[feria|fair]]. A él le encantan los juegos mecánicos, pero a mí me dan miedo. Prefiero jugar a los [[dardos|darts]]: ¡ayer gané un oso de peluche y {{se lo|r1}} regalé a mi hermanita!

Por la noche nos quedamos en casa y jugamos a las [[cartas|cards]] o al [[ajedrez|chess]]. A Tomás le [[aburre|bores]] el ajedrez, así que siempre pierde. A mí me [[molesta|bothers]] un poco que él use el móvil durante el juego, pero no le digo nada.

El sábado hay un [[festival|festival]] de música en el puerto. Nos [[faltan|we need]] dos entradas porque mi prima Inés y su novio quieren venir con {{nosotros|r2}}. ¿Tú sabes dónde venden entradas baratas? Si las encuentras, ¿{{me las|r3}} puedes comprar? Te pago cuando vuelva.

¡Un abrazo y que te [[diviertas|have fun]] mucho! Camila`,
      questions: [
        q('mc', '¿Qué hacen los padres de Camila por la mañana?', ['Dan un paseo por la playa.', 'Van a la feria.', 'Juegan al ajedrez.', 'Compran entradas.']),
        tf('A Camila le encantan los juegos mecánicos.', false, 'A ella le dan miedo; a Tomás le encantan.'),
        q('ref', 'En «se lo regalé a mi hermanita», «lo» es…', ['el oso de peluche', 'el juego mecánico', 'el dardo', 'el móvil'], { ref: 'r1', why: 'le + lo → se lo; lo = el oso' }),
        q('mc', '¿Por qué pierde Tomás al ajedrez?', ['Le aburre el juego.', 'No le gustan las cartas.', 'Le molesta Camila.', 'Le falta una pieza.']),
        q('ref', '«¿Me las puedes comprar?» Otra forma correcta es…', ['¿Puedes comprármelas?', '¿Puedes me las comprar?', '¿Puedes comprarlasme?', '¿Me puedes las comprar?'], { ref: 'r3', why: 'con infinitivo: delante del verbo conjugado o pegado al infinitivo, OI antes del OD' }),
        q('vocab', '«Nos faltan dos entradas» quiere decir…', ['Necesitamos dos entradas más.', 'Tenemos dos entradas extra.', 'Perdimos dos entradas.', 'Las entradas cuestan dos euros.']),
        q('ref', '«Quieren venir con nosotros». ¿Cuál es correcto con «yo»?', ['quieren venir conmigo', 'quieren venir con mí', 'quieren venir con yo', 'quieren venir con me'], { ref: 'r2', why: 'con + yo → conmigo' }),
      ],
    },
    {
      id: 'club',
      title: 'El club de los sábados',
      tag: 'ocio',
      text: `En mi barrio hay un [[club deportivo|sports club]] que abre los sábados para los jóvenes. Mucha gente piensa que el [[ocio|leisure]] es perder el tiempo, pero para {{nosotros|r1}} es la mejor parte de la semana.

Por la mañana, los más activos juegan al [[boliche|bowling]] o al [[billar|billiards]]. La señora Méndez, la directora del club, es muy [[animada|lively]] y siempre organiza un [[torneo|tournament]]. El mes pasado mi amigo Raúl la [[desafió|challenged]] a una partida de billar… ¡y ella {{lo|r3}} venció en diez minutos! Desde ese día, Raúl la llama «la campeona».

Por la tarde preferimos los [[juegos de mesa|board games]]. A mí me interesan los juegos de estrategia, pero a mis amigas les gustan más los [[videojuegos|video games]]. Cuando alguien gana, todos [[brindamos|toast]] con limonada.

Lo que más me gusta del club es que nadie mira el reloj. Mi madre siempre me pregunta: «¿No te aburres allí todo el día?». Y yo {{le|r2}} contesto: «Mamá, en el club nadie se aburre. Es el lugar más [[entretenido|entertaining]] de la ciudad».`,
      questions: [
        q('mc', '¿Quién es la señora Méndez?', ['la directora del club', 'la madre del narrador', 'una árbitra', 'una cantante']),
        tf('Raúl le ganó a la señora Méndez al billar.', false, 'Ella lo venció en diez minutos.'),
        q('ref', 'En «ella lo venció», «lo» es…', ['Raúl', 'el billar', 'el torneo', 'el club'], { ref: 'r3', why: 'lo = OD, a Raúl' }),
        q('ref', 'En «Y yo le contesto», «le» se refiere…', ['a mi madre', 'a Raúl', 'a la señora Méndez', 'al club'], { ref: 'r2', why: 'le = OI, a mi madre' }),
        q('vocab', 'Una persona «animada» es…', ['alegre y con mucha energía', 'cansada', 'aburrida y seria', 'muy competitiva']),
        q('mc', 'Según el narrador, ¿qué es el ocio para los jóvenes del club?', ['la mejor parte de la semana', 'perder el tiempo', 'un trabajo', 'algo aburrido']),
        q('ref', 'En «para nosotros», «nosotros» es un pronombre…', ['preposicional', 'de objeto directo', 'de objeto indirecto', 'reflexivo'], { ref: 'r1' }),
      ],
    },
    {
      id: 'estreno',
      title: 'La noche del estreno',
      tag: 'teatro',
      text: `Mi tía Rosa es actriz y el viernes fue el [[estreno|premiere]] de su nueva [[obra de teatro|play]]. Toda la familia fue a verla. Mi padre compró las entradas en la [[taquilla|box office]] una semana antes, porque sabía que se iban a [[agotar|sell out]].

Antes de la [[función|performance]], mi primo Lucas estaba de mal humor. «A mí no me gusta el teatro», dijo. «Prefiero los [[videojuegos|video games]]». Mi madre {{lo|r1}} miró muy seria y él no dijo nada más.

Cuando se abrió el telón, todos nos quedamos en silencio. El [[escenario|stage]] parecía un parque de verdad, con árboles y luces de colores. Mi tía hacía el papel de una cantante famosa que vuelve a su pueblo. Al final, el público se levantó y empezó a [[aplaudir|applaud]] durante cinco minutos.

Después fuimos al camerino a darle flores a mi tía. Ella {{nos|r2}} abrazó a todos. Lucas le pidió un autógrafo y ella {{se lo|r3}} firmó con una sonrisa. En el coche, Lucas confesó: «Bueno… la obra fue más [[entretenida|entertaining]] de lo que pensaba».`,
      questions: [
        q('mc', '¿Quién es Rosa?', ['la tía del narrador, que es actriz', 'una cantante famosa de verdad', 'la madre de Lucas', 'la empleada de la taquilla']),
        tf('El padre compró las entradas el mismo día del estreno.', false, 'Las compró una semana antes.'),
        q('ref', 'En «Mi madre lo miró», «lo» es…', ['Lucas', 'el teatro', 'el videojuego', 'el padre'], { ref: 'r1', why: 'lo = OD, a Lucas' }),
        q('mc', '¿Qué pensaba Lucas del teatro antes de la función?', ['No le gustaba.', 'Le encantaba.', 'Le interesaba mucho.', 'Le daba igual.']),
        q('ref', '«Ella nos abrazó a todos». Aquí «nos» es un pronombre de…', ['objeto directo', 'objeto indirecto', 'preposicional', 'sujeto'], { ref: 'r2', why: 'abrazar a alguien: la persona es el OD' }),
        q('ref', 'En «ella se lo firmó», ¿qué reemplazan «se» y «lo»?', ['se = a Lucas · lo = el autógrafo', 'se = a la tía · lo = el teatro', 'se = al público · lo = el programa', 'se = a la madre · lo = el coche'], { ref: 'r3', why: 'le + lo → se lo' }),
        q('vocab', '«El público empezó a aplaudir» quiere decir que la gente…', ['dio palmadas porque le gustó', 'se fue del teatro', 'cantó con la actriz', 'hizo cola en la taquilla']),
        tf('Al final, a Lucas la obra le pareció mejor de lo que esperaba.', true, '«La obra fue más entretenida de lo que pensaba».'),
      ],
    },
    {
      id: 'feria',
      title: 'Domingo en la feria',
      tag: 'diversiones',
      text: `Cada septiembre llega a mi pueblo la [[feria|fair]]. Es el evento más [[animado|lively]] del año: hay música, comida y un pequeño [[parque de atracciones|amusement park]] con una noria enorme.

Este año fui con mis amigos Daniel y Paula. A Daniel le [[fascinan|fascinate]] las montañas rusas, pero a Paula le [[dan miedo|scare]]. Por eso, mientras Daniel subía a la montaña rusa por tercera vez, Paula y yo jugamos a los [[dardos|darts]]. Ella ganó un sombrero ridículo y {{me lo|r1}} puso en la cabeza. ¡Qué vergüenza!

Por la tarde había un [[torneo|tournament]] de [[boliche|bowling]] en la plaza. Daniel {{nos|r2}} desafió a una partida. Paula [[anotó|scored]] más puntos que nadie y [[venció|defeated]] a todos los chicos. Daniel no podía creerlo.

Cuando empezó a oscurecer, compramos churros y nos sentamos a ver los fuegos artificiales. Paula me dijo: «Sin {{ti|r3}}, la feria no habría sido tan [[divertida|fun]]». Yo sonreí, todavía con el sombrero en la cabeza.`,
      questions: [
        q('mc', '¿Cuándo llega la feria al pueblo?', ['cada septiembre', 'cada domingo', 'cada verano', 'una vez cada diez años']),
        tf('A Paula le encantan las montañas rusas.', false, 'A ella le dan miedo; a Daniel le fascinan.'),
        q('ref', 'En «me lo puso en la cabeza», «lo» es…', ['el sombrero', 'el dardo', 'el churro', 'el torneo'], { ref: 'r1', why: 'me (a mí) + lo (el sombrero)' }),
        q('ref', 'En «Daniel nos desafió», ¿a quiénes desafió?', ['a Paula y al narrador', 'a los chicos del pueblo', 'a sus padres', 'a los vendedores de churros'], { ref: 'r2', why: 'nos = a nosotros (Paula y yo)' }),
        q('mc', '¿Quién ganó el torneo de boliche?', ['Paula', 'Daniel', 'el narrador', 'nadie: fue un empate']),
        q('ref', '«Sin ti». ¿Por qué se usa «ti» y no «tú»?', ['Va después de la preposición «sin».', 'Es el sujeto del verbo.', 'Es un objeto indirecto.', 'Es un mandato.'], { ref: 'r3', why: 'después de preposición: mí, ti' }),
        q('vocab', 'Si un evento es «animado», es…', ['alegre y lleno de vida', 'triste y silencioso', 'muy caro', 'peligroso']),
      ],
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
