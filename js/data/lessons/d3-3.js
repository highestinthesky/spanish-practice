(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const { parse, words, vocabItems, conj } = D.lessonKit;

  // Descubre 3, Lección 3: La vida diaria. Vocabulary from the lesson's Contextos (en casa, de compras,
  // expresiones, la vida diaria); Estructuras 3.1 the preterite, 3.2 the imperfect, 3.3 preterite vs. imperfect.

  const GROUPS = [
    { id: 'casa', name: 'en casa', example: 'quitar el polvo', text: `
      el balcón = balcony
      la escalera = staircase
      el hogar = home; fireplace
      la limpieza = cleaning
      los muebles = furniture
      los quehaceres = chores
      apagar = to turn off
      barrer = to sweep
      calentar = to warm up
      cocinar = to cook
      encender = to turn on
      freír = to fry
      hervir = to boil
      lavar = to wash
      limpiar = to clean
      pasar la aspiradora = to vacuum
      poner la mesa = to set the table
      quitar la mesa = to clear the table
      quitar el polvo = to dust
      tocar el timbre = to ring the doorbell
    ` },
    { id: 'compras', name: 'de compras', example: 'el reembolso', text: `
      el centro comercial = mall
      el dinero en efectivo = cash = el efectivo / en efectivo
      la ganga = bargain
      el probador = dressing room
      el reembolso = refund
      el supermercado = supermarket
      la tarjeta de crédito = credit card
      la tarjeta de débito = debit card
      devolver = to return (items)
      hacer mandados = to run errands
      ir de compras = to go shopping
      probarse = to try on
      seleccionar = to select; to pick out
      auténtico = real; genuine
      barato = cheap; inexpensive
      caro = expensive
    ` },
    { id: 'expresiones', name: 'expresiones', example: 'de vez en cuando', text: `
      a menudo = frequently; often
      a propósito = on purpose
      a tiempo = on time
      a veces = sometimes
      apenas = hardly; scarcely
      así = like this; so
      bastante = quite; enough
      casi = almost
      casi nunca = rarely
      de repente = suddenly
      de vez en cuando = now and then; once in a while
      en aquel entonces = at that time
      en el acto = immediately; on the spot
      enseguida = right away
      por casualidad = by chance
    ` },
    { id: 'vida', name: 'la vida diaria', example: 'soler', text: `
      la agenda = datebook
      la costumbre = custom; habit
      el horario = schedule
      la rutina = routine
      la soledad = solitude; loneliness
      acostumbrarse (a) = to get used to = acostumbrarse
      arreglarse = to get ready
      averiguar = to find out; to check
      probar (a) = to try = probar
      soler = to be in the habit of; to usually (do)
      atrasado = late
      cotidiano = everyday
      diario = daily
      inesperado = unexpected
    ` },
  ];

  const list = GROUPS.flatMap((g) => words(g.id, g.text));

  const q = (kind, text, options, extra) => ({ kind, q: text, options, ...extra });
  const tf = (text, isTrue, why) => q('tf', text, ['cierto', 'falso'], { why, fixed: true, correct: isTrue ? 0 : 1 });

  D.addLesson({
    id: 'D3.3',
    title: 'La vida diaria',
    skills: [
      { id: 'es-en', name: 'es → en', example: 'la ganga → bargain' },
      { id: 'en-es', name: 'en → es', example: 'bargain → la ganga' },
      { id: 'contexto', name: 'en contexto', example: 'quiero un ___ (refund)' },
      { id: 'preterito', name: 'el pretérito', example: 'barrí, hirvió, trajeron' },
      { id: 'imperfecto', name: 'el imperfecto', example: 'solía, íbamos, era' },
      { id: 'pret-imp', name: 'pretérito o imperfecto', example: 'barría cuando sonó el timbre' },
      { id: 'sentido', name: 'cambian de sentido', example: 'conocí · conocía, supe · sabía' },
      { id: 'traduccion', name: 'traducción', example: 'I used to get up early' },
    ],
    groups: GROUPS.map(({ id, name, example }) => ({ id, name, example })),
    build: () => [
      ...vocabItems('D3.3', list),
      ...parse('D3.3', 'contexto', `
        c | Los sábados por la mañana hacemos los ___: barrer, lavar y planchar. | quehaceres / reembolsos / probadores / horarios | los quehaceres = chores
        c | Antes de comer, mi hermano siempre pone la ___. | mesa / limpieza / escalera / agenda | poner la mesa = to set the table
        c | Después de cenar, yo quito la mesa y mi padre ___ los platos. | lava / barre / enciende / devuelve | lavar los platos
        c | Hay mucho polvo en los muebles; tengo que ___ el polvo. | quitar / pasar / poner / tocar | quitar el polvo = to dust
        c | La alfombra está sucia. Voy a pasar la ___. | aspiradora / escalera / ganga / limpieza | pasar la aspiradora = to vacuum
        c | Primero hay que ___ el agua y después echar la pasta. | hervir / freír / barrer / apagar | hervir = to boil
        c | Para hacer papas fritas, hay que ___ las papas en aceite. | freír / hervir / barrer / encender | freír = to fry
        c | La sopa está fría; voy a ___ en el microondas. | calentarla / apagarla / devolverla / seleccionarla | calentar = to warm up
        c | Hace frío; ¿puedes ___ la calefacción? | encender / apagar / barrer / devolver | encender = to turn on
        c | Ya es tarde: ___ la luz y duérmete. | apaga / enciende / hierve / tocas | apagar = to turn off
        c | Alguien está tocando el ___. ¿Quién será? | timbre / balcón / hogar / probador | tocar el timbre = to ring the doorbell
        c | Subimos la ___ hasta el tercer piso porque no hay ascensor. | escalera / aspiradora / limpieza / ganga | la escalera = staircase
        c | Desde el ___ se ve todo el parque. | balcón / probador / timbre / horario | el balcón = balcony
        c | Este suéter cuesta solo cinco dólares. ¡Es una ___! | ganga / ventana / agenda / costumbre | la ganga = bargain
        c | Antes de comprar los pantalones, me los ___ en el probador. | pruebo / devuelvo / selecciono / averiguo | probarse = to try on
        c | La camisa no me queda bien; voy a ___ a la tienda. | devolverla / probarla / hervirla / encenderla | devolver = to return (items)
        c | Devolví los zapatos y me dieron un ___. | reembolso / probador / timbre / horario | el reembolso = refund
        c | ¿Paga con tarjeta o en ___? | efectivo / probador / hogar / ganga | en efectivo = in cash
        c | Fui al ___ a comprar leche, pan y huevos. | supermercado / probador / balcón / hogar | el supermercado
        c | Hoy tengo que hacer ___: ir al banco, al correo y a la farmacia. | mandados / quehaceres / probadores / timbres | hacer mandados = to run errands
        c | Este bolso no es falso; es de cuero ___. | auténtico / barato / atrasado / diario | auténtico = genuine
        c | No llegues tarde: el tren sale ___. | a tiempo / a propósito / por casualidad / de repente | a tiempo = on time
        c | No lo hice ___; fue un accidente. | a propósito / a tiempo / enseguida / a menudo | a propósito = on purpose
        c | Estaba leyendo tranquilamente y ___ se fue la luz. | de repente / a menudo / casi nunca / de vez en cuando | de repente = suddenly
        c | Encontré a mi profesora en el supermercado ___. | por casualidad / a propósito / a tiempo / bastante | por casualidad = by chance
        c | No como mucha carne; solo la como ___. | de vez en cuando / en el acto / enseguida / a tiempo | de vez en cuando = once in a while
        c | El médico la atendió ___: no tuvo que esperar. | en el acto / casi nunca / a menudo / en aquel entonces | en el acto = on the spot
        c | Espérame; vuelvo ___. | enseguida / en aquel entonces / casi nunca / a menudo | enseguida = right away
        c | En 1990 yo vivía en Madrid; ___ no había teléfonos móviles. | en aquel entonces / enseguida / en el acto / a tiempo | en aquel entonces = at that time
        c | Estaba tan cansada que ___ podía abrir los ojos. | apenas / bastante / así / a menudo | apenas = hardly
        c | ___ nunca voy al centro comercial; no me gusta. | Casi / Apenas / Bastante / Así | casi nunca = rarely
        c | Mi abuela ___ dormir la siesta después de comer. | suele / averigua / prueba / selecciona | soler + infinitivo = to usually do
        c | Al principio no me gustaba el horario, pero ya me ___. | acostumbré / arreglé / averigüé / probé | acostumbrarse a = to get used to
        c | Mi hermana tarda una hora en ___ antes de salir. | arreglarse / acostumbrarse / averiguar / soler | arreglarse = to get ready
        c | Voy a ___ a qué hora abre la tienda. | averiguar / soler / arreglarme / probarme | averiguar = to find out
        c | Apunté la cita con el dentista en mi ___. | agenda / costumbre / soledad / ganga | la agenda = datebook
        c | Levantarme a las seis es parte de mi ___. | rutina / soledad / ganga / limpieza | la rutina = routine
        c | Tomar café por la mañana es una ___ de mi familia. | costumbre / limpieza / ganga / soledad | la costumbre = custom; habit
        c | Vivía sola en el campo y a veces sufría de ___. | soledad / costumbre / limpieza / rutina | la soledad = loneliness
        c | El autobús llegó ___: veinte minutos tarde. | atrasado / a tiempo / auténtico / cotidiano | atrasado = late
        c | Preparar la comida es una tarea ___. | cotidiana / inesperada / auténtica / atrasada | cotidiano = everyday
        c | La visita de mi tío fue ___: nadie sabía que venía. | inesperada / cotidiana / diaria / auténtica | inesperado = unexpected
        c | ¡No está mal! Se hace ___, mira. | así / apenas / casi / a menudo | así = like this
        c | Leo el periódico ___: todas las mañanas. | a diario / a propósito / por casualidad / en el acto | diario / a diario = daily
      `),

      ...conj('D3.3', 'preterito', { tense: 'preterite', verbs: ['barrer', 'limpiar', 'cocinar', 'apagar', 'encender', 'hervir', 'devolver', 'probarse', 'seleccionar', 'averiguar', 'arreglarse', 'tocar', 'llegar', 'empezar', 'buscar', 'pagar', 'leer', 'oír', 'caerse', 'pedir', 'dormir', 'divertirse', 'ir', 'ser', 'dar', 'ver', 'tener', 'estar', 'poder', 'poner', 'saber', 'hacer', 'querer', 'venir', 'decir', 'traer', 'conducir'] }),
      ...parse('D3.3', 'preterito', `
        g | Ayer yo ___ (barrer) toda la casa. | barrí | -er: yo -í
        g | Anoche ___ (apagar, yo) la luz a las once. | apagué | -gar: yo -gué
        g | Esta mañana ___ (tocar, yo) el timbre tres veces. | toqué | -car: yo -qué
        g | Ayer ___ (empezar, yo) a limpiar el balcón. | empecé | -zar: yo -cé
        g | ___ (averiguar, yo) a qué hora abría la tienda. | Averigüé | -guar: yo -güé
        g | El agua ___ (hervir) en cinco minutos. | hirvió | -ir e→i en él/ellos
        g | Mi madre ___ (freír) unos huevos. | frió / frio | freír: frió (también frio)
        g | Los niños ___ (dormir) diez horas. | durmieron | -ir o→u en ellos
        g | ¿Tú ___ (devolver) la chaqueta? | devolviste | sin cambio de raíz en el pretérito
        g | Nosotros ___ (hacer) los mandados por la mañana. | hicimos | hacer: hic-
        g | ¿Qué ___ (decir) el vendedor? | dijo | decir: dij-
        g | Mis primos ___ (traer) la comida. | trajeron | -j: trajeron (sin i)
        g | Ayer no ___ (poder, yo) ir al supermercado. | pude | poder: pud-
        g | Ella ___ (ponerse) el vestido nuevo. | se puso | poner: pus-
        g | ¿Dónde ___ (estar) ustedes anoche? | estuvieron | estar: estuv-
        g | Mi padre ___ (conducir) hasta el centro comercial. | condujo | -ducir: -duj-
        g | Ellos ___ (leer) el horario. | leyeron | leer: leyeron
        g | El vaso ___ (caerse) al suelo. | se cayó | caer: cayó
        g | ¿Quién ___ (ir) de compras contigo? | fue | ir: fue
        g | Anoche ___ (haber) un problema con la luz. | hubo | hay → hubo
        g | La semana pasada me ___ (dar, ellos) un reembolso. | dieron | dar: dieron (sin tilde)
        g | Nosotros ___ (venir) en autobús. | vinimos | venir: vin-
        c | Ayer ___ a mi abuela al mercado. | llevé / llevaba / llevo / llevaré | acción completa: pretérito
        c | El año pasado ___ a París dos veces. | fui / iba / voy / fuera | número de veces: pretérito
        t | I swept the floor yesterday. | Barrí el suelo ayer. / Ayer barrí el suelo. | barrí
        t | She returned the shoes. | Devolvió los zapatos. / Ella devolvió los zapatos. | devolvió
        t | We did the chores. | Hicimos los quehaceres. | hicimos
        t | What did you (tú) buy? | ¿Qué compraste? | compraste
      `),

      ...conj('D3.3', 'imperfecto', { tense: 'imperfect', verbs: ['soler', 'vivir', 'cocinar', 'limpiar', 'barrer', 'hacer', 'tener', 'querer', 'estar', 'poder', 'jugar', 'levantarse', 'acostarse', 'ir', 'ser', 'ver'] }),
      ...parse('D3.3', 'imperfecto', `
        g | De niña, yo ___ (soler) levantarme a las siete. | solía | soler en el imperfecto: hábito
        g | Cuando éramos pequeños, nosotros ___ (ir) al parque todos los días. | íbamos | ir: íbamos (tilde)
        g | Mi abuela ___ (ser) muy trabajadora. | era | ser: era
        g | Antes ___ (ver, nosotros) la tele después de cenar. | veíamos | ver: veía-
        g | En aquel entonces no ___ (haber) supermercados en el pueblo. | había | hay → había
        g | ___ (Ser) las ocho de la mañana. | Eran | la hora: imperfecto
        g | Mi madre ___ (tener) treinta años cuando nací. | tenía | la edad: imperfecto
        g | Siempre ___ (llover) en noviembre. | llovía | hábito
        g | Los domingos mi padre ___ (cocinar) para toda la familia. | cocinaba | -ar: -aba
        g | De vez en cuando, nosotros ___ (comer) en un restaurante. | comíamos | -er: -íamos
        g | La casa ___ (estar) muy limpia. | estaba | descripción: estaba
        g | Mi hermano siempre ___ (llegar) atrasado a la escuela. | llegaba | hábito con siempre
        g | ¿Dónde ___ (vivir) tú en aquel entonces? | vivías | -ir: -ías
        g | Yo ___ (estar) cansada y no tenía ganas de salir. | estaba | estado: imperfecto
        g | Hacía sol y los pájaros ___ (cantar). | cantaban | escena de fondo
        c | Cuando ___ niño, me encantaba ir de compras. | era / fui / soy / sea | etapa de la vida: imperfecto
        c | Los veranos ___ en la playa. | pasábamos / pasamos / pasemos / pasaremos | hábito: imperfecto
        t | I used to get up early. | Me levantaba temprano. / Solía levantarme temprano. | used to → imperfecto
        t | When I was ten, I lived in Chile. | Cuando tenía diez años, vivía en Chile. | edad y situación: imperfecto
        t | It was raining and it was cold. | Llovía y hacía frío. / Estaba lloviendo y hacía frío. | descripción: imperfecto
      `),

      ...parse('D3.3', 'pret-imp', `
        c | Yo ___ la escalera cuando sonó el timbre. | barría / barrí / barro / barreré | acción en curso interrumpida: imperfecto
        c | Yo barría la escalera cuando ___ el timbre. | sonó / sonaba / suena / sonará | la interrupción: pretérito
        c | Mientras mi padre cocinaba, mi madre ___ la mesa. | ponía / puso / pone / pondrá | mientras + dos acciones simultáneas: imperfecto
        c | De niña, ___ al supermercado con mi abuela todos los sábados. | iba / fui / voy / iré | todos los sábados (hábito): imperfecto
        c | El sábado pasado ___ al supermercado con mi abuela. | fui / iba / voy / vaya | una vez, completa: pretérito
        c | ___ las once de la noche cuando por fin terminamos la limpieza. | Eran / Fueron / Son / Serán | la hora en el pasado: imperfecto
        c | Cuando era joven, mi abuelo ___ en una fábrica. | trabajaba / trabajó / trabaja / trabaje | situación de fondo: imperfecto
        c | Mi abuelo ___ en esa fábrica durante cuarenta años. | trabajó / trabajaba / trabaja / trabajara | período cerrado (durante 40 años): pretérito
        c | De repente, ___ la luz. | se fue / se iba / se va / se vaya | de repente: pretérito
        c | En aquel entonces la gente no ___ tarjetas de crédito. | usaba / usó / usa / usará | en aquel entonces: imperfecto
        c | Ayer ___ tres horas en el centro comercial. | estuve / estaba / estoy / estaré | duración cerrada: pretérito
        c | ___ mucho frío, así que encendí la calefacción. | Hacía / Hizo / Hace / Hará | descripción del tiempo: imperfecto
        c | Cuando ___ al probador, vi que la camisa tenía un agujero. | entré / entraba / entro / entraré | acción puntual: pretérito
        c | La tienda ___ cerrada cuando llegamos. | estaba / estuvo / está / esté | descripción: imperfecto
        c | Anoche ___ las ventanas, apagué la luz y me acosté. | cerré / cerraba / cierro / cerraré | serie de acciones completas: pretérito
        c | Mi madre siempre ___ que la limpieza es importante. | decía / dijo / dice / diga | siempre (hábito): imperfecto
        c | Ese día mi madre ___: «Hoy no limpiamos». | dijo / decía / dice / diga | un momento concreto: pretérito
        c | Cuando ___ diez años, aprendí a cocinar. | tenía / tuve / tengo / tenga | la edad: imperfecto
        c | ___ diez años el lunes pasado. (cumplir) | Cumplí / Cumplía / Cumplo / Cumpliré | el cambio en un momento: pretérito
        c | Los niños ___ en el balcón cuando empezó a llover. | jugaban / jugaron / juegan / jueguen | acción en progreso: imperfecto
        c | Empezó a llover y los niños ___ enseguida. | entraron / entraban / entran / entren | reacción puntual: pretérito
        c | Yo no ___ que la tienda cerraba a las seis. | sabía / supe / sé / sepa | estado mental de fondo: imperfecto
        c | Por casualidad ___ un billete de veinte dólares en la calle. | encontré / encontraba / encuentro / encontrara | por casualidad, una vez: pretérito
        c | Antes, a menudo ___ la cena juntos. | preparábamos / preparamos / prepararemos / preparemos | antes + a menudo: imperfecto
        c | La casa ___ grande y tenía un jardín precioso. | era / fue / es / será | descripción: imperfecto
        c | Estábamos cenando cuando ___ el teléfono. | sonó / sonaba / suena / sonará | interrupción: pretérito
        c | El vendedor me ___ un descuento en el acto. | dio / daba / da / dé | en el acto: pretérito
        c | Mientras yo ___ el polvo, mi hermano pasaba la aspiradora. | quitaba / quité / quito / quite | mientras: imperfecto
        c | Ayer ___ a las siete, me duché y salí. | me levanté / me levantaba / me levanto / me levante | secuencia: pretérito
        c | Antes yo casi nunca ___ el desayuno. | tomaba / tomé / tomo / tome | casi nunca (hábito): imperfecto
        c | La semana pasada ___ que devolver tres cosas. | tuve / tenía / tengo / tenga | obligación cumplida: pretérito
        c | ¿Qué hora ___ cuando llegaste a casa? | era / fue / es / será | la hora: imperfecto
        c | Cuando yo trabajaba allí, el horario de la tienda ___ de nueve a cinco. | era / fue / es / será | descripción en el pasado: imperfecto
        c | Ayer me ___ la cabeza todo el día. | dolió / dolía / duele / duela | todo el día (período cerrado): pretérito
        c | Cuando era pequeño, siempre me ___ la cabeza. | dolía / dolió / duele / duela | siempre: imperfecto
        g | Mi hermano ___ (dormir) cuando yo llegué. | dormía | acción en progreso: imperfecto
        g | Cuando ___ (llegar, yo), mi hermano dormía. | llegué | la acción que interrumpe: pretérito
        g | Todos los días mi abuela ___ (barrer) el patio. | barría | todos los días: imperfecto
        g | El lunes pasado ___ (barrer, yo) el patio. | barrí | un día concreto: pretérito
        g | ___ (Hacer) sol, pero hacía frío. | Hacía | descripción del tiempo: imperfecto
        g | El verano pasado ___ (hacer) mucho calor. | hizo | período cerrado: pretérito
        g | En aquel entonces ___ (haber) muchas tiendas pequeñas. | había | descripción: imperfecto
        g | Ayer ___ (haber) una gran rebaja en el centro comercial. | hubo | evento: pretérito
        g | Mientras yo me ___ (arreglar), mi novio esperaba. | arreglaba | mientras: imperfecto
        g | Antes, yo siempre ___ (soler) hacer los mandados los viernes. | solía | soler en el pasado: imperfecto
        g | Ella ___ (estar) leyendo cuando la llamé. | estaba | progresivo del pasado: estaba + gerundio
        g | Nosotros ___ (vivir) en Lima durante cinco años. | vivimos | durante + tiempo cerrado: pretérito
        g | De repente, el perro ___ (empezar) a ladrar. | empezó | de repente: pretérito
        g | La tienda estaba llena porque ___ (haber) rebajas. | había | causa de fondo: imperfecto
      `),

      ...parse('D3.3', 'sentido', `
        c | Ayer ___ a la novia de mi hermano. (I met) | conocí / conocía / supe / sabía | conocer en pretérito = to meet
        c | Yo ya ___ a la vendedora; es mi vecina. (I knew) | conocía / conocí / sabía / supe | conocer en imperfecto = to know
        c | Anoche ___ que la tienda cerró. (found out) | supe / sabía / conocí / conocía | saber en pretérito = to find out
        c | Yo no ___ que tenías tarjeta de crédito. (didn't know) | sabía / supe / conocí / conocía | saber en imperfecto = to know
        c | Después de mucho esfuerzo, ___ abrir la puerta. (managed to) | pude / podía / quise / quería | poder en pretérito = to manage
        c | No ___ abrir la puerta y llamé a un cerrajero. (failed) | pude / podía / quise / sabía | no poder en pretérito = to fail
        c | De joven, ___ correr diez kilómetros. (was able to, in general) | podía / pude / quise / supe | poder en imperfecto = to be able (capacidad)
        c | ___ devolver la falda, pero no tenía el recibo. (tried to) | Quise / Quería / Pude / Supe | querer en pretérito = to try
        c | Mi hermano ___ ayudarme con los quehaceres. (refused) | no quiso / no quería / no pudo / no supo | no querer en pretérito = to refuse
        c | Yo ___ comprar un coche, pero no tenía dinero. (wanted) | quería / quise / pude / supe | querer en imperfecto = to want
        c | Ayer ___ que ir al banco. (had to, and did) | tuve / tenía / tengo / tendré | tener que en pretérito: lo hice
        c | ___ que ir al banco, pero se me olvidó. (was supposed to) | Tenía / Tuve / Tengo / Tendré | tener que en imperfecto: no sabemos si lo hice
        t | I met my best friend in 2019. | Conocí a mi mejor amigo en 2019. / Conocí a mi mejor amiga en 2019. | conocer (pret.) = to meet
        t | She found out the truth. | Supo la verdad. / Ella supo la verdad. | saber (pret.) = to find out
        t | They refused to clean. | No quisieron limpiar. | no querer (pret.) = to refuse
        t | We managed to finish on time. | Pudimos terminar a tiempo. | poder (pret.) = to manage
      `),

      ...parse('D3.3', 'traduccion', `
        t | When I was a child, I used to do the chores on Saturdays. | Cuando era niño, hacía los quehaceres los sábados. / Cuando era niña, hacía los quehaceres los sábados. / De niño, hacía los quehaceres los sábados. / De niña, hacía los quehaceres los sábados. | hábito: imperfecto
        t | I was sweeping when the doorbell rang. | Barría cuando sonó el timbre. / Estaba barriendo cuando sonó el timbre. / Estaba barriendo cuando tocaron el timbre. / Barría cuando tocaron el timbre. | en curso (imp.) + interrupción (pret.)
        t | Yesterday I went shopping and bought a bargain. | Ayer fui de compras y compré una ganga. | acciones completas: pretérito
        t | The store was closed. | La tienda estaba cerrada. | descripción: imperfecto
        t | It was ten o'clock. | Eran las diez. | la hora: imperfecto
        t | We usually eat at two. | Solemos comer a las dos. | soler + infinitivo
        t | I used to go to the mall often. | Iba al centro comercial a menudo. / Solía ir al centro comercial a menudo. / A menudo iba al centro comercial. | a menudo: imperfecto
        t | Suddenly the light went out. | De repente se fue la luz. / De repente, se fue la luz. / De repente se apagó la luz. | de repente: pretérito
        t | I returned the jacket and they gave me a refund. | Devolví la chaqueta y me dieron un reembolso. | pretérito
        t | My mother set the table while I cooked. | Mi madre puso la mesa mientras yo cocinaba. / Mi madre ponía la mesa mientras yo cocinaba. | mientras
        t | I couldn't get used to the schedule. | No pude acostumbrarme al horario. / No me pude acostumbrar al horario. | acostumbrarse a
        t | Did you (tú) find out the price? | ¿Averiguaste el precio? | averiguar: averiguaste
        t | She tried on three dresses. | Se probó tres vestidos. / Ella se probó tres vestidos. | probarse
        t | At that time we lived in a small house. | En aquel entonces vivíamos en una casa pequeña. | en aquel entonces: imperfecto
        t | I hardly slept last night. | Apenas dormí anoche. / Anoche apenas dormí. | apenas
        t | The bus arrived late. | El autobús llegó atrasado. / El autobús llegó tarde. | atrasado
        t | He paid in cash. | Pagó en efectivo. / Él pagó en efectivo. | en efectivo
        t | We were tired, so we went to bed early. | Estábamos cansados, así que nos acostamos temprano. / Estábamos cansadas, así que nos acostamos temprano. | estado (imp.) + acción (pret.)
      `),
    ],
    readings: [
      {
        id: 'sabado',
        title: 'Un sábado de limpieza',
        tag: 'en casa',
        text: `Cuando yo {{era|t1}} pequeña, los sábados en mi casa {{eran|t2}} días de [[limpieza|cleaning]]. Mi madre nos [[despertaba|woke up]] a las ocho y cada uno tenía sus [[quehaceres|chores]]. Mi hermano Diego [[pasaba la aspiradora|vacuumed]], mi padre lavaba los platos y yo [[quitaba el polvo|dusted]] de los muebles. No me gustaba nada, pero así era la [[costumbre|custom]] de la familia.

Un sábado de marzo, todo {{fue|t3}} diferente. Yo {{estaba barriendo|t4}} la [[escalera|staircase]] cuando alguien [[tocó el timbre|rang the doorbell]]. Era mi tía Clara, que vivía en Argentina y no venía desde hacía cinco años. ¡Fue una visita totalmente [[inesperada|unexpected]]!

Mi madre se puso a llorar [[en el acto|on the spot]]. Mi padre [[apagó|turned off]] la radio, Diego dejó la aspiradora en medio del salón y nadie volvió a limpiar ese día. Mi tía nos traía regalos para todos: a mí me dio un libro y a Diego, una camiseta de fútbol.

Esa noche cenamos todos juntos en el [[balcón|balcony]]. Mi padre [[frió|fried]] empanadas y mi madre preparó un flan. Desde entonces, cada vez que suena el timbre un sábado, pienso en mi tía Clara.`,
        questions: [
          q('mc', '¿Qué hacía la narradora los sábados?', ['Quitaba el polvo de los muebles.', 'Pasaba la aspiradora.', 'Lavaba los platos.', 'Cocinaba para todos.']),
          q('tiempo', '«Cuando yo era pequeña». ¿Por qué imperfecto?', ['Describe una etapa de la vida.', 'Es una acción que interrumpe.', 'Es una acción completa.', 'Pasó de repente.'], { ref: 't1', why: 'edad / etapa: imperfecto' }),
          q('tiempo', '«Los sábados eran días de limpieza». ¿Qué expresa el imperfecto?', ['una costumbre que se repetía', 'algo que pasó una vez', 'el final de una acción', 'una orden'], { ref: 't2', why: 'hábito: imperfecto' }),
          q('tiempo', '«Todo fue diferente». ¿Por qué pretérito?', ['Habla de un día concreto y completo.', 'Describe la casa.', 'Es una costumbre.', 'Es la hora.'], { ref: 't3', why: 'un día concreto: pretérito' }),
          q('tiempo', '«Estaba barriendo cuando alguien tocó el timbre». ¿Qué acción interrumpe a la otra?', ['tocó el timbre', 'estaba barriendo', 'las dos a la vez', 'ninguna'], { ref: 't4', why: 'en curso: imperfecto · interrupción: pretérito' }),
          tf('La tía Clara visitaba a la familia todos los meses.', false, 'No venía desde hacía cinco años.'),
          q('vocab', 'Una visita «inesperada» es una visita…', ['que nadie esperaba', 'muy larga', 'aburrida', 'que llega tarde']),
          tf('Después de la visita, la familia terminó la limpieza.', false, 'Nadie volvió a limpiar ese día.'),
        ],
      },
      {
        id: 'ganga',
        title: 'La ganga que no fue',
        tag: 'de compras',
        text: `El viernes pasado Marta {{fue|t1}} al [[centro comercial|mall]] con su amiga Inés. Las dos [[solían|used to]] ir de compras juntas una vez al mes, y siempre buscaban [[gangas|bargains]].

En una tienda de ropa, Marta vio una chaqueta de cuero [[auténtico|genuine]]. Antes costaba doscientos dólares, pero ese día la vendían por cincuenta. «¡Es una ganga!», gritó Marta. Fue al [[probador|dressing room]] y {{se la probó|t2}}. Le quedaba un poco grande, pero no le importó. La pagó con su [[tarjeta de débito|debit card]] y salió muy contenta.

Esa noche, mientras {{se arreglaba|t3}} para salir, Marta notó que la chaqueta tenía un agujero en la manga. Además, la etiqueta decía «cuero sintético». ¡No era auténtica! Al día siguiente volvió a la tienda para [[devolverla|return it]].

El vendedor le dijo que en las rebajas no hacían [[reembolsos|refunds]]. Marta {{insistió|t4}} y pidió hablar con la gerente. Por fin, la gerente le dio un vale para comprar otra cosa. Ahora Marta revisa cada prenda con cuidado y [[casi nunca|rarely]] compra algo sin averiguar de qué está hecho.`,
        questions: [
          q('mc', '¿Con qué frecuencia iban de compras Marta e Inés?', ['una vez al mes', 'todos los días', 'casi nunca', 'cada viernes']),
          q('tiempo', '«Marta fue al centro comercial». ¿Por qué pretérito?', ['Es una acción completa en un momento concreto.', 'Es una costumbre.', 'Describe a Marta.', 'Es una acción en progreso.'], { ref: 't1', why: 'el viernes pasado: pretérito' }),
          q('ref', '«Se la probó». ¿Qué es «la»?', ['la chaqueta', 'la tarjeta', 'la tienda', 'la manga'], { ref: 't2', why: 'la = la chaqueta (OD)' }),
          q('tiempo', '«Mientras se arreglaba, notó…». ¿Por qué «se arreglaba» va en imperfecto?', ['Es la acción de fondo que estaba pasando.', 'Es la acción principal y completa.', 'Pasó de repente.', 'Es una costumbre de todos los días.'], { ref: 't3', why: 'mientras + acción en curso: imperfecto' }),
          tf('La chaqueta era de cuero auténtico.', false, 'La etiqueta decía «cuero sintético».'),
          q('mc', '¿Qué le dio la gerente a Marta?', ['un vale para comprar otra cosa', 'un reembolso en efectivo', 'otra chaqueta igual', 'nada']),
          q('vocab', '«Casi nunca» quiere decir…', ['rara vez', 'siempre', 'a menudo', 'de repente']),
        ],
      },
      {
        id: 'abuela',
        title: 'Así era la vida de mi abuela',
        tag: 'vida diaria',
        text: `Mi abuela Pilar nació en un pueblo pequeño de Asturias en 1950. [[En aquel entonces|At that time]], la vida diaria {{era|t1}} muy distinta. No había lavadora ni [[aspiradora|vacuum cleaner]], así que todo se hacía a mano. Su madre lavaba la ropa en el río y Pilar la ayudaba [[a menudo|often]].

Cada mañana, Pilar se levantaba a las seis, [[encendía|lit]] el fuego del [[hogar|fireplace]] y [[calentaba|warmed up]] la leche para sus hermanos. Después caminaba tres kilómetros hasta la escuela. [[Apenas|Hardly]] había coches en el pueblo y nadie tenía teléfono.

Un invierno, cuando tenía doce años, {{hubo|t2}} una tormenta terrible. La nieve cerró el camino durante una semana y la familia no pudo salir de casa. Pilar dice que fue la semana más feliz de su infancia: no {{fue|t3}} a la escuela, jugó a las cartas con su padre y aprendió a hacer pan.

Hoy mi abuela vive en la ciudad y tiene de todo, pero dice que a veces echa de menos esa vida [[cotidiana|everyday]] tan sencilla. «No teníamos casi nada», me cuenta, «pero nunca sentí la [[soledad|loneliness]]».`,
        questions: [
          q('mc', '¿Por qué se hacía todo a mano?', ['No había lavadora ni aspiradora.', 'Pilar prefería hacerlo así.', 'Las máquinas eran muy caras en la ciudad.', 'Su madre no sabía usar máquinas.']),
          q('tiempo', '«La vida diaria era muy distinta». ¿Qué expresa «era»?', ['una descripción del pasado', 'una acción que interrumpe', 'un evento puntual', 'una orden'], { ref: 't1', why: 'descripción: imperfecto' }),
          q('mc', '¿Qué hacía Pilar cada mañana?', ['Encendía el fuego y calentaba la leche.', 'Lavaba la ropa en el río.', 'Iba a la escuela en coche.', 'Llamaba por teléfono a sus hermanos.']),
          q('tiempo', '«Un invierno… hubo una tormenta terrible». ¿Por qué «hubo» y no «había»?', ['Es un evento concreto que ocurrió.', 'Es una descripción habitual.', 'Es la hora.', 'Es la edad de Pilar.'], { ref: 't2', why: 'evento: hubo' }),
          q('tiempo', '«No fue a la escuela». ¿Ser o ir?', ['ir', 'ser'], { ref: 't3', why: 'fue a + lugar: ir', fixed: true, correct: 0 }),
          tf('Pilar recuerda la semana de la tormenta como algo muy triste.', false, 'Dice que fue la semana más feliz de su infancia.'),
          q('vocab', '«Apenas había coches» quiere decir que…', ['casi no había coches', 'había muchos coches', 'los coches eran nuevos', 'los coches llegaban tarde']),
        ],
      },
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
