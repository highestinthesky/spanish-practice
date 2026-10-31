(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const { parse, words, vocabItems, conj } = D.lessonKit;

  // Descubre 3, Lección 1: Las relaciones personales. Vocabulary from the lesson's official list (Contextos);
  // Estructuras 1.1 the present tense, 1.2 ser and estar, 1.3 progressive forms.

  const GROUPS = [
    { id: 'personalidad', name: 'la personalidad', example: 'tacaño', text: `
      autoritario = strict; authoritarian
      cariñoso = affectionate
      celoso = jealous
      cuidadoso = careful
      falso = insincere
      gracioso = funny
      inseguro = insecure
      maduro = mature
      inmaduro = immature
      mentiroso = lying
      orgulloso = proud
      permisivo = permissive
      seguro = sure; confident
      sensato = sensible
      sensible = sensitive
      tacaño = stingy
      tímido = shy
      tradicional = traditional
    ` },
    { id: 'estados', name: 'los estados emocionales', example: 'agobiado', text: `
      agobiado = overwhelmed
      ansioso = anxious
      deprimido = depressed
      disgustado = upset
      emocionado = excited
      preocupado (por) = worried (about) = preocupado
      solo = alone; lonely
      tranquilo = calm
    ` },
    { id: 'sentimientos', name: 'los sentimientos', example: 'estar harto de', text: `
      adorar = to adore
      apreciar = to think highly of
      enamorarse (de) = to fall in love (with) = enamorarse
      estar harto (de) = to be sick (of) = estar harto / estar harta
      odiar = to hate
      sentirse = to feel
      soñar (con) = to dream (about) = soñar
      tener celos (de) = to be jealous (of) = tener celos
      tener vergüenza (de) = to be embarrassed (about) = tener vergüenza
    ` },
    { id: 'relaciones', name: 'las relaciones', example: 'la cita a ciegas', text: `
      el/la amado/a = loved one = el amado / la amada / amado / amada
      el ánimo = spirit
      el cariño = affection
      la cita (a ciegas) = (blind) date = la cita / la cita a ciegas
      el compromiso = commitment
      la confianza = trust; confidence
      el desánimo = the state of being discouraged
      el divorcio = divorce
      la pareja = couple; partner
      el sentimiento = feeling
      atraer = to attract
      coquetear = to flirt
      cuidar = to take care of
      dejar a alguien = to leave someone
      discutir = to argue
      educar = to raise; to bring up
      hacerle caso a alguien = to pay attention to someone
      impresionar = to impress
      llevar… años de casados = to be married for… years = llevar años de casados
      llevarse bien = to get along well
      llevarse mal = to get along badly
      mantenerse en contacto = to keep in touch
      pasarlo bien = to have a good time
      pasarlo fatal = to have a terrible time
      proponer matrimonio = to propose (marriage)
      romper (con) = to break up (with) = romper
      salir (con) = to go out (with) = salir
      soportar a alguien = to put up with someone
      casado = married
      divorciado = divorced
      separado = separated
      soltero = single
      viudo = widowed
    ` },
  ];

  const list = GROUPS.flatMap((g) => words(g.id, g.text));

  const q = (kind, text, options, extra) => ({ kind, q: text, options, ...extra });
  const tf = (text, isTrue, why) => q('tf', text, ['cierto', 'falso'], { why, fixed: true, correct: isTrue ? 0 : 1 });

  D.addLesson({
    id: 'D3.1',
    title: 'Las relaciones personales',
    skills: [
      { id: 'es-en', name: 'es → en', example: 'tacaño → stingy' },
      { id: 'en-es', name: 'en → es', example: 'stingy → tacaño' },
      { id: 'contexto', name: 'en contexto', example: 'es muy ___: nunca paga' },
      { id: 'presente', name: 'el presente', example: 'sueño, propongo, nos llevamos' },
      { id: 'ser-estar', name: 'ser y estar', example: 'es listo · está listo' },
      { id: 'progresivo', name: 'formas progresivas', example: 'sigue llamándola' },
    ],
    groups: GROUPS.map(({ id, name, example }) => ({ id, name, example })),
    build: () => [
      ...vocabItems('D3.1', list),
      ...parse('D3.1', 'contexto', `
        c | Mi tío nunca paga la cuenta en el restaurante; es muy ___. | tacaño / cariñoso / sensible / gracioso | tacaño = stingy
        c | Lucía llora con las películas tristes porque es muy ___. | sensible / sensata / tacaña / autoritaria | sensible = sensitive (no «sensible» en inglés)
        c | Elige bien sus palabras y piensa antes de actuar: es una chica ___. | sensata / sensible / celosa / falsa | sensato = sensible (con buen juicio)
        c | Mi abuela siempre me abraza y me besa; es muy ___. | cariñosa / tacaña / autoritaria / falsa | cariñoso = affectionate
        c | Pablo no habla en clase porque es ___. | tímido / gracioso / mentiroso / orgulloso | tímido = shy
        c | Siempre dice mentiras; es muy ___. | mentiroso / sensato / maduro / cuidadoso | mentiroso = lying
        c | Mi padre no me deja salir nunca; es muy ___. | autoritario / permisivo / tímido / inseguro | autoritario = strict
        c | Sus padres la dejan hacer todo; son muy ___. | permisivos / autoritarios / tradicionales / celosos | permisivo = permissive
        c | Me hace reír todo el tiempo; es muy ___. | gracioso / tacaño / deprimido / agobiado | gracioso = funny
        c | Tiene quince años pero actúa como un adulto: es muy ___. | maduro / inmaduro / inseguro / falso | maduro = mature
        c | Sonríe delante de ti, pero habla mal de ti después. Es ___. | falso / sensato / cuidadoso / tranquilo | falso = insincere
        c | Tengo tres exámenes y dos trabajos esta semana. Estoy ___. | agobiado / tranquilo / emocionado / casado | agobiado = overwhelmed
        c | Mañana empiezan las vacaciones. ¡Estoy muy ___! | emocionada / deprimida / agobiada / disgustada | emocionado = excited
        c | No duerme bien porque está ___ por su abuelo enfermo. | preocupada / emocionada / orgullosa / tranquila | preocupado por = worried about
        c | Mi novio se pone ___ cuando hablo con otros chicos. | celoso / tacaño / sensato / soltero | celoso = jealous
        c | Estoy ___ de tus mentiras: ¡no quiero oír más! | harta / soltera / casada / segura | estar harto de = to be sick of
        c | Mis primos me presentaron a un chico que no conocía: fue una cita ___. | a ciegas / a solas / a tiempo / a menudo | la cita a ciegas = blind date
        c | Le cuento todos mis secretos porque le tengo mucha ___. | confianza / vergüenza / cita / pareja | la confianza = trust
        c | Después de veinte años, Ana y Luis firmaron el ___. | divorcio / compromiso / cariño / ánimo | el divorcio = divorce
        c | Mis abuelos ___ cincuenta años de casados. | llevan / tienen / hacen / son | llevar… años de casados
        c | Rafa y yo ___ muy bien: nunca discutimos. | nos llevamos / nos dejamos / nos casamos / soportamos | llevarse bien = to get along
        c | No ___ a mi compañero de cuarto: es muy desordenado. | soporto / atraigo / adoro / aprecio | soportar = to put up with
        c | Su madre lo ___ con mucho cariño y buenos valores. | educó / dejó / discutió / coqueteó | educar = to raise
        c | Mi hermana ___ con todos los chicos en la fiesta. | coqueteó / educó / soportó / propuso | coquetear = to flirt
        c | Aunque vivimos lejos, nos ___ en contacto por teléfono. | mantenemos / llevamos / dejamos / proponemos | mantenerse en contacto = to keep in touch
        c | Te hablo y no me escuchas: ¡nunca me ___ caso! | haces / tienes / das / llevas | hacerle caso a alguien = to pay attention
        c | Su esposo murió hace dos años; ella es ___. | viuda / soltera / separada / casada | viudo = widowed
        c | Pedro le ___ matrimonio a Marta en la playa. | propuso / soportó / educó / atrajo | proponer matrimonio = to propose
        c | En la fiesta lo ___ fatal: no conocía a nadie. | pasé / llevé / tuve / hice | pasarlo fatal = to have a terrible time
        c | Me puse rojo cuando me caí delante de todos. ¡Qué ___! | vergüenza / confianza / cariño / ánimo | tener vergüenza = to be embarrassed
        c | Lo que me ___ de él es su sentido del humor. | atrae / soporta / educa / discute | atraer = to attract
        c | Rompió ___ su novio después de tres años. | con / a / de / en | romper con = to break up with
        c | Se enamoró ___ su vecina. | de / con / a / en | enamorarse de = to fall in love with
        c | Desde niño, ___ con ser astronauta. | sueña / odia / aprecia / adora | soñar con = to dream about
      `),
      ...conj('D3.1', 'presente', { tense: 'present', verbs: ['soñar', 'sentirse', 'atraer', 'proponer', 'coquetear', 'discutir', 'cuidar', 'educar', 'enamorarse', 'llevarse', 'mantenerse', 'romper', 'salir', 'soportar', 'odiar', 'apreciar', 'conocer', 'dirigir', 'construir', 'enviar', 'reírse'] }),
      ...parse('D3.1', 'presente', `
        g | Yo siempre ___ (sentirse) nervioso en una cita a ciegas. | me siento | sentirse (e→ie)
        g | Mi novio y yo nunca ___ (discutir). | discutimos | -ir regular: discutimos
        g | Mis padres ___ (soñar) con viajar a Grecia. | sueñan | soñar (o→ue) con
        g | Yo ___ (proponer) ir al cine el sábado. | propongo | proponer: como poner → propongo
        g | Yo no ___ (conocer) a tu pareja. | conozco | -cer → -zco
        g | Yo ___ (atraer) a gente muy rara. | atraigo | atraer: como traer → atraigo
        g | ¿Tú ___ (mantenerse) en contacto con tus amigos de la infancia? | te mantienes | mantenerse (como tener): te mantienes
        g | Ella siempre ___ (reírse) de mis chistes. | se ríe | reírse: se ríe (tilde)
        g | Yo ___ (escoger) a mis amigos con cuidado. | escojo | g → j delante de o
        g | Yo ___ (seguir) enamorado de ella. | sigo | seguir: sigo
        g | Mi hermano ___ (enviar) mensajes a su novia todo el día. | envía | enviar: envía (í)
        g | Nosotros ___ (salir) juntos desde hace un año. | salimos | desde hace + presente
        c | ¿Cuánto tiempo hace que ___ con Marta? | sales / saliste / salías / saldrás | hace… que + presente: acción que continúa
        c | Mañana ___ a casa de mis suegros. (futuro cercano) | vamos / fuimos / íbamos / vayamos | el presente puede expresar el futuro
        t | I never lie. | Nunca miento. / No miento nunca. | mentir (e→ie): miento
        t | We get along well. | Nos llevamos bien. | llevarse bien
        t | How long have you (tú) been going out with him? | ¿Cuánto tiempo hace que sales con él? / ¿Desde cuándo sales con él? | hace + tiempo + que + presente
      `),
      ...parse('D3.1', 'ser-estar', `
        c | Mi novio ___ muy celoso; siempre ha sido así. | es / está / son / están | característica: ser
        c | Hoy Carlos ___ celoso porque su novia salió con otro. | está / es / son / ser | estado temporal: estar
        c | La boda ___ en la iglesia de San Pedro. | es / está / son / hay | lugar de un evento: ser
        c | Los novios ___ en la iglesia ahora. | están / son / es / hay | lugar de personas: estar
        c | Mi hermano ___ muy listo: saca buenas notas. | es / está / son / ser | ser listo = clever
        c | ¿___ listos? Nos vamos al cine. | Están / Son / Es / Hay | estar listo = ready
        c | Esta película ___ aburrida; me dormí. | es / está / son / hay | ser aburrido = boring
        c | ___ aburrido: no hay nada que hacer. | Estoy / Soy / Es / Hay | estar aburrido = bored
        c | El pescado ___ muy rico; me encanta. | está / es / son / hay | estar rico = tasty
        c | Su familia ___ muy rica; tienen tres casas. | es / está / son / están | ser rico = wealthy
        c | Las manzanas todavía ___ verdes; no las comas. | están / son / es / está | estar verde = unripe
        c | Mis ojos ___ verdes. | son / están / es / hay | ser verde = color
        c | No ___ segura de que me quiera. | estoy / soy / es / está | estar seguro = to be sure
        c | Este barrio ___ seguro; se puede caminar de noche. | es / está / son / están | ser seguro = safe
        c | Mi abuelo ___ malo; tiene gripe. | está / es / son / ser | estar malo = sick
        c | Ese chico ___ malo: miente y engaña. | es / está / son / están | ser malo = bad (person)
        c | ¡Qué guapa ___ hoy! ¿Tienes una cita? | estás / eres / es / está | cambio de apariencia: estar
        c | Mi abuela ___ viva gracias a los médicos. | está / es / son / ser | estar vivo = alive
        c | Ella ___ muy viva: entiende todo enseguida. | es / está / son / están | ser vivo = sharp, lively
        c | Los anillos ___ de oro. | son / están / es / hay | material: ser de
        c | ___ las nueve y él todavía no ha llegado. | Son / Están / Es / Hay | la hora: ser
        c | Mi prima ___ embarazada. | está / es / son / ser | estar embarazada
        c | ¿De dónde ___ tu pareja? | es / está / son / están | origen: ser de
        c | La puerta ___ cerrada. | está / es / son / ser | resultado de una acción: estar + participio
        c | La carta fue ___ por su novio. | escrita / escrito / estada / sida | voz pasiva: ser + participio
        c | Mi madre ___ de viaje esta semana. | está / es / son / ser | estar de viaje
        c | Pablo ___ de camarero este verano, pero es estudiante. | está / es / son / ser | estar de + trabajo temporal
        g | Mis padres ___ casados desde 1995. | están | estar casado (estado civil)
        g | Mi tía ___ soltera y muy feliz. | es / está | estado civil: ser o estar
        g | La fiesta ___ en mi casa el sábado. | es | evento: ser
        g | Yo ___ orgulloso de ti. | estoy | estar orgulloso de = to be proud of
        t | My sister is very sensitive. | Mi hermana es muy sensible. | personalidad: ser
        t | I'm worried about my grandfather. | Estoy preocupado por mi abuelo. / Estoy preocupada por mi abuelo. | estado: estar
        t | The party is at Ana's house. | La fiesta es en casa de Ana. | evento: ser
      `),
      ...conj('D3.1', 'progresivo', { tense: 'gerund', verbs: ['discutir', 'coquetear', 'cuidar', 'soñar', 'leer', 'oír', 'traer', 'decir', 'pedir', 'mentir', 'dormir', 'morir', 'sentir', 'venir', 'ir', 'construir', 'reír', 'creer', 'seguir'] }),
      ...parse('D3.1', 'progresivo', `
        g | Mis padres están ___ (discutir) otra vez. | discutiendo | -ir: -iendo
        g | ¿Qué estás ___ (leer)? | leyendo | vocal + -iendo → -yendo
        g | Ella está ___ (mentir): no le creas. | mintiendo | -ir e→i: mintiendo
        g | El bebé está ___ (dormir). | durmiendo | -ir o→u: durmiendo
        g | Sigo ___ (pensar) en ti. | pensando | seguir + gerundio = to keep on
        g | Él continúa ___ (llamarla) todos los días. | llamándola | pronombre pegado: llamándola (tilde)
        g | Llevo dos años ___ (salir) con Ana. | saliendo | llevar + tiempo + gerundio = to have been doing
        g | Mi abuelo anda ___ (decir) que se va a casar otra vez. | diciendo | andar + gerundio = to go around doing
        g | Poco a poco, nos vamos ___ (conocer) mejor. | conociendo | ir + gerundio = gradual
        g | Estamos ___ (oír) la canción de nuestra boda. | oyendo | oír → oyendo
        r | Ella está escribiéndole una carta. (pronombre delante) | Ella le está escribiendo una carta. / Le está escribiendo una carta. | delante del verbo conjugado
        r | Te estoy esperando. (pronombre detrás) | Estoy esperándote. | pegado al gerundio, con tilde
        r | Lo sigo queriendo. (pronombre detrás) | Sigo queriéndolo. | queriendo + lo → queriéndolo
        c | Juan ___ coqueteando con todas en la fiesta. | anduvo / anda a / está de / va a | andar + gerundio
        c | ¿Cuánto tiempo ___ estudiando español? | llevas / sigues de / estás de / vas a | llevar + tiempo + gerundio
        c | Aunque rompieron, ella ___ queriéndolo. | sigue / sigue a / está de / lleva de | seguir + gerundio
        c | ___ casados. (They are married — estado, no acción) | Están / Están estando / Son estando / Están casando | estar no se usa en progresivo
        c | Voy al cine el sábado. ¿Cuál NO es correcto? | Estoy yendo al cine el sábado. / Voy al cine el sábado. / Voy a ir al cine el sábado. / Iré al cine el sábado. | el progresivo no expresa planes futuros
        t | They keep arguing. | Siguen discutiendo. / Continúan discutiendo. | seguir + gerundio
        t | I've been waiting for an hour. | Llevo una hora esperando. / Llevo una hora esperándote. | llevar + tiempo + gerundio
      `),
    ],
    readings: [
      {
        id: 'cita',
        title: 'Una cita a ciegas',
        tag: 'relaciones',
        text: `Mi amiga Sara {{es|r1}} muy [[tímida|shy]], pero también es muy [[cariñosa|affectionate]]. Lleva un año soltera y yo estoy [[harta|sick and tired]] de oírla decir que nunca va a encontrar pareja. Por eso le organicé una [[cita a ciegas|blind date]] con mi primo Hugo.

Hugo es [[gracioso|funny]] y [[sensato|sensible]], aunque a veces es un poco [[tacaño|stingy]]. Cuando le hablé de Sara, me dijo: «Vale, pero si es aburrida, me voy». Le contesté: «Sara no es aburrida; tú {{estás|r2}} aburrido porque no sales nunca».

El sábado por la noche, Sara {{estaba|r3}} muy [[ansiosa|anxious]]. Se cambió de ropa tres veces. Yo le dije: «¡Estás guapísima! Tienes que tener más [[confianza|confidence]] en ti misma».

A las nueve, Sara y Hugo se encontraron en un café. Al principio, nadie hablaba. Pero después Hugo empezó a contar chistes y Sara {{se estaba riendo|r4}} toda la noche. Hugo hasta pagó la cuenta, ¡algo muy raro en él!

Ahora llevan dos meses saliendo juntos. Se [[llevan bien|get along well]], aunque discuten un poco por el fútbol. Sara dice que sigue sin creer que su mejor cita fue una cita a ciegas.`,
        questions: [
          q('mc', '¿Por qué organizó la narradora la cita?', ['Estaba harta de oír a Sara quejarse de estar sola.', 'Hugo se lo pidió.', 'Sara quería conocer a su primo.', 'Era el cumpleaños de Sara.']),
          tf('Hugo normalmente paga la cuenta.', false, 'Es un poco tacaño: pagar fue algo muy raro en él.'),
          q('gram', '«Sara es muy tímida». ¿Por qué se usa «es»?', ['Es una característica de su personalidad.', 'Es un estado temporal.', 'Es un lugar.', 'Es una acción en progreso.'], { ref: 'r1', why: 'personalidad: ser' }),
          q('gram', '«Tú estás aburrido». ¿Qué quiere decir?', ['You are bored.', 'You are boring.', 'You were boring.', 'You get bored easily.'], { ref: 'r2', why: 'estar aburrido = bored; ser aburrido = boring' }),
          q('vocab', 'Sara estaba «ansiosa» antes de la cita. Es decir, estaba…', ['nerviosa y preocupada', 'contenta y tranquila', 'cansada', 'enojada con Hugo']),
          q('gram', '«Sara se estaba riendo toda la noche». ¿Qué expresa la forma progresiva?', ['una acción que continuaba en el pasado', 'un plan para el futuro', 'una costumbre de hoy', 'una orden'], { ref: 'r4', why: 'estar + gerundio en el pasado' }),
          tf('Sara y Hugo nunca discuten.', false, 'Discuten un poco por el fútbol.'),
        ],
      },
      {
        id: 'abuelos',
        title: 'Cincuenta años juntos',
        tag: 'familia',
        text: `Mis abuelos, Elena y Tomás, {{llevan|r1}} cincuenta años de casados. Este fin de semana toda la familia está [[festejando|celebrating]] su aniversario en el pueblo donde se conocieron.

Mi abuelo cuenta que se [[enamoró|fell in love]] de mi abuela el primer día que la vio en la plaza. Ella no le [[hacía caso|paid attention]] porque él era muy [[inmaduro|immature]] y un poco [[mentiroso|liar]]: le decía a todo el mundo que era piloto de avión. Pero él siguió {{escribiéndole|r2}} cartas durante dos años, hasta que un día ella aceptó salir con él.

Mi abuela dice que el secreto de un buen matrimonio es la [[confianza|trust]] y el [[cariño|affection]]. «Claro que discutimos», explica. «Tu abuelo es muy [[orgulloso|proud]] y yo soy un poco [[autoritaria|bossy]]. Pero nunca nos acostamos enfadados».

Hoy los dos {{están|r3}} muy [[emocionados|excited]]. Mi abuelo está preparando un discurso, y mi abuela no para de llorar de alegría. Yo los miro y pienso que es verdad: el amor se va construyendo poco a poco.`,
        questions: [
          q('mc', '¿Qué celebra la familia este fin de semana?', ['el aniversario de boda de los abuelos', 'el cumpleaños del abuelo', 'la boda de la narradora', 'la jubilación de la abuela']),
          q('gram', '«Llevan cincuenta años de casados» significa que…', ['están casados desde hace cincuenta años', 'se casaron hace cincuenta días', 'se van a casar en cincuenta años', 'se divorciaron hace cincuenta años'], { ref: 'r1', why: 'llevar + tiempo = duración hasta hoy' }),
          tf('La abuela se enamoró del abuelo el primer día.', false, 'Fue él quien se enamoró el primer día; ella no le hacía caso.'),
          q('gram', '«Siguió escribiéndole cartas». ¿Qué quiere decir «seguir + gerundio»?', ['continuar haciendo algo', 'empezar a hacer algo', 'dejar de hacer algo', 'hacer algo por primera vez'], { ref: 'r2', why: 'seguir + gerundio = to keep doing' }),
          q('vocab', 'Según la abuela, el secreto de un buen matrimonio es…', ['la confianza y el cariño', 'no discutir nunca', 'ser muy orgulloso', 'tener mucho dinero']),
          q('gram', '«Hoy los dos están muy emocionados». ¿Por qué «están»?', ['Es un estado emocional de hoy.', 'Es su personalidad.', 'Es un lugar.', 'Es la hora.'], { ref: 'r3', why: 'emoción: estar' }),
          tf('El abuelo decía que era piloto, pero no era verdad.', true, 'Era un poco mentiroso.'),
        ],
      },
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
