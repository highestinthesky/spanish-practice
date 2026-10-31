(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const { parse, words, vocabItems, conj } = D.lessonKit;

  // Descubre 2, Lecciones 1–9. Themes and grammar follow the publisher's scope and sequence; the word lists
  // are reconstructed from the lesson themes.

  const VOCAB = [
    { id: 'es-en', name: 'es → en', example: 'la palabra → its meaning' },
    { id: 'en-es', name: 'en → es', example: 'the meaning → la palabra' },
  ];

  function lesson(id, title, groups, skills, grammar) {
    const list = groups.flatMap((g) => words(g.id, g.text));
    D.addLesson({
      id,
      title,
      skills: [...VOCAB, ...skills],
      groups: groups.map(({ id: gid, name, example }) => ({ id: gid, name, example })),
      build: () => [...vocabItems(id, list), ...grammar()],
    });
  }

  /* ---------- 1 · En el consultorio ---------- */

  lesson('D2.1', 'En el consultorio', [
    { id: 'cuerpo', name: 'el cuerpo', example: 'la garganta', text: `
      la boca = mouth
      el brazo = arm
      la cabeza = head
      el corazón = heart
      el cuello = neck
      el cuerpo = body
      el dedo = finger
      el dedo del pie = toe
      el estómago = stomach
      la garganta = throat
      el hueso = bone
      la nariz = nose
      el oído = (sense of) hearing; inner ear
      el ojo = eye
      la oreja = (outer) ear
      el pie = foot
      la pierna = leg
      la rodilla = knee
      el tobillo = ankle
    ` },
    { id: 'salud', name: 'la salud', example: 'la receta', text: `
      el accidente = accident
      el antibiótico = antibiotic
      la aspirina = aspirin
      la clínica = clinic
      el consultorio = doctor's office
      el/la dentista = dentist
      el/la doctor(a) = doctor = el doctor / la doctora / doctor / doctora / el médico / la médica
      el dolor (de cabeza) = (head)ache; pain = el dolor / el dolor de cabeza
      el/la enfermero/a = nurse = el enfermero / la enfermera / enfermero / enfermera
      el examen médico = physical exam
      la farmacia = pharmacy
      la gripe = flu
      el hospital = hospital
      la infección = infection
      el medicamento = medication
      la operación = operation
      el/la paciente = patient
      las pastillas = pills; tablets
      la radiografía = X-ray
      la receta = prescription
      el resfriado = cold (illness)
      la sala de emergencia = emergency room
      la salud = health
      el síntoma = symptom
      la tos = cough
    ` },
    { id: 'verbos', name: 'síntomas y verbos', example: 'torcerse el tobillo', text: `
      caerse = to fall (down)
      dañar = to damage; to break down
      darse con = to bump into; to run into
      doler = to hurt
      enfermarse = to get sick
      estar enfermo = to be sick
      estornudar = to sneeze
      lastimarse (el pie) = to injure (one's foot) = lastimarse
      olvidar = to forget
      poner una inyección = to give an injection
      prohibir = to prohibit; to forbid
      recetar = to prescribe
      romper = to break
      romperse (la pierna) = to break (one's leg) = romperse
      sacar(se) un diente = to have a tooth removed = sacarse un diente
      ser alérgico (a) = to be allergic (to)
      sufrir una enfermedad = to suffer an illness
      tener dolor = to have pain
      tener fiebre = to have a fever
      tomar la temperatura = to take someone's temperature
      torcerse (el tobillo) = to sprain (one's ankle) = torcerse
      toser = to cough
      congestionado = congested; stuffed-up
      embarazada = pregnant
      grave = grave; serious
      mareado = dizzy; nauseated
      saludable = healthy
      sano = healthy
    ` },
  ], [
    { id: 'imperfecto', name: 'el imperfecto', example: 'iba, era, tenía' },
    { id: 'pret-imp', name: 'pretérito o imperfecto', example: 'dormía cuando sonó' },
    { id: 'se', name: 'construcciones con se', example: 'se me cayó, se habla' },
    { id: 'adverbios', name: 'adverbios', example: 'rápidamente, a menudo' },
  ], () => [
    ...conj('D2.1', 'imperfecto', { tense: 'imperfect', verbs: ['ser', 'ir', 'ver', 'tener', 'estar', 'jugar', 'comer', 'vivir', 'doler', 'toser', 'sufrir', 'hacer', 'querer', 'poder'] }),
    ...parse('D2.1', 'imperfecto', `
      g | Cuando era niña, yo siempre ___ (enfermarse) en invierno. | me enfermaba | hábito en el pasado
      g | De niños, nosotros ___ (ir) al dentista cada seis meses. | íbamos | ir: íbamos (con tilde)
      g | Mi abuela ___ (ser) enfermera. | era | ser: era
      g | ___ (ser) las tres de la tarde cuando llegamos. | Eran | hora en el pasado: imperfecto
      g | El paciente ___ (tener) fiebre y tos. | tenía | descripción
      g | Antes no ___ (haber) farmacia en el pueblo. | había | hay → había
      g | ¿Qué ___ (ver) tú en la tele de pequeño? | veías | ver: veía (irregular)
      t | When I was a child, I used to play soccer. | Cuando era niño, jugaba al fútbol. / Cuando era niña, jugaba al fútbol. / De niño, jugaba al fútbol. / De niña, jugaba al fútbol. | hábito: imperfecto
      t | My head hurt. | Me dolía la cabeza. | descripción de un estado: imperfecto
    `),
    ...parse('D2.1', 'pret-imp', `
      c | Yo ___ cuando sonó el teléfono. | dormía / dormí / duermo / dormiré | acción en progreso interrumpida: imperfecto
      c | Ayer ___ al consultorio a las nueve. | fui / iba / voy / iré | acción completa con hora exacta: pretérito
      c | De niño, siempre me ___ la garganta en invierno. | dolía / dolió / duele / dolerá | hábito: imperfecto
      c | El médico me ___ una inyección y me fui. | puso / ponía / pone / ponga | serie de acciones completas: pretérito
      c | La enfermera ___ alta y simpática. | era / fue / es / sea | descripción en el pasado: imperfecto
      c | De repente, ___ el accidente. | ocurrió / ocurría / ocurre / ocurra | de repente: pretérito
      c | Mientras el doctor me examinaba, yo ___ nervioso. | estaba / estuve / estoy / esté | estado de fondo: imperfecto
      c | Me ___ el tobillo jugando al fútbol. | torcí / torcía / tuerzo / tuerza | evento puntual: pretérito
      c | ___ las once de la noche cuando llegamos a la sala de emergencia. | Eran / Fueron / Son / Era | la hora: imperfecto
      c | El año pasado me ___ la pierna. | rompí / rompía / rompo / rompa | evento completo: pretérito
      c | Mi hermano ___ tres veces al hospital ese mes. | fue / iba / va / vaya | número de veces: pretérito
      c | Cuando ___ pequeña, tenía muchas alergias. | era / fui / soy / sea | edad / etapa: imperfecto
      g | Yo ___ (leer) cuando la enfermera me llamó. | leía | en progreso: imperfecto
      g | Ayer el doctor me ___ (recetar) unas pastillas. | recetó | completo: pretérito
    `),
    ...parse('D2.1', 'se', `
      g | A mí ___ cayó el vaso. (unplanned) | se me | se + me + verbo
      g | A Juan ___ olvidaron las pastillas. | se le | se + le; olvidaron (las pastillas)
      g | A nosotros ___ rompió la radiografía. | se nos | se + nos
      g | ¿A ti ___ perdió la receta? | se te | se + te
      g | A los niños ___ cayeron los juguetes. | se les | se + les; cayeron (plural)
      g | En esta clínica ___ habla español. | se | se impersonal
      g | ___ venden medicamentos en la farmacia. | Se | se + plural: venden
      g | Se me ___ (olvidar) las llaves. | olvidaron | el verbo concuerda con las llaves
      c | ¿Qué te pasó? — Se me ___ el diente. | rompió / rompí / rompieron / rompe | concuerda con el diente
      c | Aquí ___ prohíbe fumar. | se / le / lo / me | se impersonal
      t | I dropped the pills. (unplanned) | Se me cayeron las pastillas. | se me cayeron
      t | Spanish is spoken here. | Aquí se habla español. / Se habla español aquí. | se impersonal
    `),
    ...parse('D2.1', 'adverbios', `
      g | rápido → ___ | rápidamente | adjetivo + -mente
      g | fácil → ___ | fácilmente | conserva la tilde
      g | tranquilo → ___ | tranquilamente | femenino + -mente
      g | constante → ___ | constantemente | -e + -mente
      g | El doctor habla ___ (slowly). | lentamente / despacio | lento → lentamente
      g | La enfermera trabaja ___ (carefully). | cuidadosamente / con cuidado | cuidadoso → cuidadosamente
      g | ___ (Fortunately), no fue grave. | Afortunadamente / Por suerte | afortunado → afortunadamente
      g | Voy al médico ___ (often). | a menudo / con frecuencia / frecuentemente | a menudo
      g | ___ (sometimes) me duele la cabeza. | A veces | a veces
      g | Me siento ___ (well). | bien | bueno → bien (adverbio)
      g | Me siento ___ (badly). | mal | malo → mal (adverbio)
      c | El paciente respondió ___ y claramente. | lenta / lentamente / lento / lentas | dos adverbios: solo el último lleva -mente
      t | She speaks clearly. | Habla claramente. / Ella habla claramente. | claro → claramente
    `),
  ]);

  /* ---------- 2 · La tecnología ---------- */

  lesson('D2.2', 'La tecnología', [
    { id: 'electronica', name: 'electrónica', example: 'el control remoto', text: `
      la cámara digital = digital camera
      el canal = (TV) channel
      el cargador = charger
      el cederrón = CD-ROM
      el control remoto = remote control
      el estéreo = stereo
      el (teléfono) celular = cell phone = el celular / el teléfono celular / el móvil
      la televisión por cable = cable television
      el televisor = television set
      el radio = radio (set)
      el reproductor de MP3 = MP3 player
      apagar = to turn off
      funcionar = to work; to function
      llamar = to call
      poner = to turn on = prender / encender
      sonar = to ring
      descompuesto = not working; out of order
      lento = slow
      lleno = full
    ` },
    { id: 'computadora', name: 'la computadora', example: 'la contraseña', text: `
      el archivo = file
      la arroba = @ symbol
      el blog = blog
      el buscador = browser
      la computadora portátil = portable computer; laptop
      la conexión inalámbrica = wireless connection
      la dirección electrónica = e-mail address
      la impresora = printer
      Internet = Internet
      el mensaje de texto = text message
      el monitor = (computer) monitor
      la página principal = home page
      la pantalla = screen
      el programa de computación = software
      el ratón = mouse
      la red = network; Web
      el sitio web = website
      el teclado = keyboard
      la contraseña = password
      borrar = to erase
      descargar = to download
      escanear = to scan
      grabar = to record
      guardar = to save
      imprimir = to print
      navegar (en Internet) = to surf (the Internet) = navegar
    ` },
    { id: 'carro', name: 'el carro', example: 'el volante', text: `
      la autopista = highway = la carretera
      el baúl = trunk
      la calle = street
      el capó = hood
      el carro = car = el coche / el auto
      la circulación = traffic = el tráfico
      el garaje = garage; (mechanic's) repair shop
      la gasolina = gasoline
      la gasolinera = gas station
      la licencia de conducir = driver's license
      la llanta = tire
      el/la mecánico/a = mechanic = el mecánico / la mecánica / mecánico / mecánica
      el parabrisas = windshield
      la policía = police (force)
      la velocidad máxima = speed limit
      el volante = steering wheel
      arrancar = to start
      arreglar = to fix; to arrange
      bajar(se) de = to get off of / out of (a vehicle) = bajarse de
      conducir = to drive = manejar
      estacionar = to park
      llenar (el tanque) = to fill (the tank) = llenar
      parar = to stop
      revisar (el aceite) = to check (the oil) = revisar
      subir(se) a = to get on / into (a vehicle) = subirse a
    ` },
  ], [
    { id: 'mandatos-tu', name: 'mandatos con tú', example: 'apaga, no borres' },
    { id: 'por-para', name: 'por y para', example: 'por la calle, para mañana' },
    { id: 'reciprocos', name: 'reflexivos recíprocos', example: 'nos escribimos' },
    { id: 'posesivos', name: 'posesivos tónicos', example: 'el mío, una amiga suya' },
  ], () => [
    ...conj('D2.2', 'mandatos-tu', { tense: 'cmd', sign: '+', persons: [1], verbs: ['apagar', 'arreglar', 'borrar', 'descargar', 'guardar', 'imprimir', 'llenar', 'manejar', 'parar', 'revisar', 'hacer', 'poner', 'salir', 'tener', 'venir', 'decir', 'ir', 'ser'] }),
    ...conj('D2.2', 'mandatos-tu', { tense: 'cmd', sign: '-', persons: [1], verbs: ['apagar', 'arreglar', 'borrar', 'descargar', 'guardar', 'imprimir', 'llenar', 'manejar', 'parar', 'revisar', 'hacer', 'poner', 'salir', 'tener', 'venir', 'decir', 'ir', 'ser'] }),
    ...parse('D2.2', 'mandatos-tu', `
      r | Tienes que guardar el archivo. (mandato) | Guarda el archivo. / ¡Guarda el archivo! | tú afirmativo = él del presente
      r | No debes manejar tan rápido. (mandato) | No manejes tan rápido. / ¡No manejes tan rápido! | negativo: no + subjuntivo
      r | Debes apagarlo. (mandato) | Apágalo. / ¡Apágalo! | pronombre pegado, con tilde
      r | No debes descargarlo. (mandato) | No lo descargues. / ¡No lo descargues! | negativo: pronombre delante
      r | Debes ponerte el cinturón. (mandato) | Ponte el cinturón. / ¡Ponte el cinturón! | poner → pon + te
      r | No debes decírselo. (mandato) | No se lo digas. / ¡No se lo digas! | no + se lo + subjuntivo
      c | ¡___ la verdad! (decir, tú) | Di / Dice / Dices / Diga | decir → di
      c | ¡No ___ tan tarde! (llegar, tú) | llegues / llegas / llega / llegue | -gar → -gues
      t | Turn off the TV! (tú) | ¡Apaga la televisión! / ¡Apaga el televisor! / ¡Apaga la tele! | apaga
      t | Don't erase the file! (tú) | ¡No borres el archivo! | no borres
    `),
    ...parse('D2.2', 'por-para', `
      c | Caminamos ___ la calle. | por / para | por: a lo largo de, a través de
      c | Salgo ___ Lima mañana. | para / por | para: destino
      c | La tarea es ___ el lunes. | para / por | para: fecha límite
      c | Pagué cien dólares ___ el celular. | por / para | por: intercambio
      c | Estudio ___ ser ingeniera. | para / por | para + infinitivo: propósito
      c | Hablamos ___ teléfono una hora. | por / para | por: medio
      c | Este cargador es ___ ti. | para / por | para: destinatario
      c | Estuve en el garaje ___ dos horas. | por / para | por: duración
      c | No fui a clase ___ la lluvia. | por / para | por: causa
      c | Te llamo ___ la tarde. | por / para | por la mañana / tarde / noche
      c | ___ mí, la computadora es lenta. | Para / Por | para mí = in my opinion
      c | Trabajo ___ una compañía de tecnología. | para / por | para: empleador
      c | Gracias ___ arreglar el carro. | por / para | gracias por
      c | Mi hermana trabajó ___ mí porque yo estaba enferma. | por / para | por: en lugar de
      c | ___ supuesto, te ayudo. | Por / Para | por supuesto
      c | ___ ser tan joven, maneja muy bien. | Para / Por | para: comparación con lo esperado
      t | I'm leaving for the gas station. | Salgo para la gasolinera. / Me voy para la gasolinera. | para: destino
      t | Thanks for the gift. | Gracias por el regalo. | gracias por
    `),
    ...parse('D2.2', 'reciprocos', `
      g | Ana y yo ___ (escribirse) mensajes todos los días. | nos escribimos | recíproco: nos
      g | Ellos ___ (conocerse) en Internet el año pasado. | se conocieron | recíproco: se
      g | Los novios ___ (abrazarse) en el aeropuerto. | se abrazaron / se abrazan | recíproco: se
      g | ¿Vosotros ___ (llamarse) cada noche? | os llamáis | recíproco: os | vos
      g | Mis padres ___ (quererse) mucho. | se quieren | recíproco: se
      g | Nosotros ___ (ayudarse) con la tarea. | nos ayudamos | recíproco: nos
      g | Los amigos ___ (saludarse) con un beso. | se saludan | recíproco: se
      g | Tú y yo ___ (verse) mañana. | nos vemos | tú y yo = nosotros
      c | Juan y María ___ en la boda. | se besaron / besaron / se besó / nos besamos | el uno al otro: se
      t | We understand each other. | Nos entendemos. / Nos comprendemos. | recíproco
      t | They see each other every day. | Se ven todos los días. | se ven
    `),
    ...parse('D2.2', 'posesivos', `
      g | Este celular es ___ (mine). | mío | ser + mío
      g | Esa computadora es ___ (yours, tú). | tuya | concuerda con la computadora
      g | Los archivos son ___ (ours). | nuestros | nuestros
      g | ¿Son ___ (his) estas llaves? | suyas | las llaves → suyas
      g | Mi carro es rojo; ___ (yours, tú) es azul. | el tuyo | pronombre: el tuyo
      g | Tu impresora funciona, pero ___ (mine) no. | la mía | pronombre: la mía
      g | Unos amigos ___ (of mine) vienen mañana. | míos | sustantivo + míos
      g | Es una idea ___ (of hers). | suya | una idea suya
      c | ¿De quién es este ratón? — Es ___. | mío / mi / mía / el mío de | ser + posesivo tónico
      c | Mis llantas son nuevas; ___ son viejas. | las suyas / sus / suyos / los suyos | las llantas → las suyas
      t | The keyboard is mine. | El teclado es mío. | mío
      t | A friend of yours (tú) called. | Llamó un amigo tuyo. / Un amigo tuyo llamó. / Una amiga tuya llamó. / Llamó una amiga tuya. | sustantivo + tuyo
    `),
  ]);

  /* ---------- 3 · La vivienda ---------- */

  lesson('D2.3', 'La vivienda', [
    { id: 'casa', name: 'la casa', example: 'el sótano', text: `
      las afueras = suburbs; outskirts
      el alquiler = rent (payment)
      el ama (m., f.) de casa = housekeeper; caretaker = el ama de casa / ama de casa
      el barrio = neighborhood
      el edificio de apartamentos = apartment building
      el/la vecino/a = neighbor = el vecino / la vecina / vecino / vecina
      la vivienda = housing
      el balcón = balcony
      la cocina = kitchen
      el comedor = dining room
      la entrada = entrance
      la escalera = stairs; stairway
      el garaje = garage
      el jardín = garden; yard
      el pasillo = hallway
      el patio = patio; yard
      la sala = living room
      el sótano = basement; cellar
      el altillo = attic
      la alfombra = carpet; rug
      la almohada = pillow
      el armario = closet
      el cartel = poster
      la cómoda = chest of drawers
      las cortinas = curtains
      el cuadro = picture
      el estante = bookcase; bookshelves
      la lámpara = lamp
      la luz = light; electricity
      la manta = blanket
      la mesita de noche = night stand
      los muebles = furniture
      la pared = wall
      la pintura = painting; picture
      el sillón = armchair
      el sofá = couch; sofa
      alquilar = to rent
      mudarse = to move (from one house to another)
    ` },
    { id: 'quehaceres', name: 'quehaceres', example: 'sacudir los muebles', text: `
      arreglar = to neaten; to straighten up
      barrer el suelo = to sweep the floor
      cocinar = to cook
      ensuciar = to get (something) dirty
      hacer la cama = to make the bed
      hacer quehaceres domésticos = to do household chores
      lavar (el suelo, los platos) = to wash (the floor, the dishes) = lavar / lavar los platos / lavar el suelo
      limpiar la casa = to clean the house
      pasar la aspiradora = to vacuum
      planchar la ropa = to iron the clothes
      poner la mesa = to set the table
      quitar la mesa = to clear the table
      quitar el polvo = to dust
      sacar la basura = to take out the trash
      sacudir los muebles = to dust the furniture
      la cafetera = coffee maker
      la estufa = stove
      el horno (de microondas) = (microwave) oven = el horno / el microondas
      la lavadora = washing machine
      el lavaplatos = dishwasher
      el refrigerador = refrigerator
      la secadora = clothes dryer
      la tostadora = toaster
      la copa = wineglass; goblet
      la cuchara = (table or large) spoon
      el cuchillo = knife
      el plato = plate
      la servilleta = napkin
      la taza = cup
      el tenedor = fork
      el vaso = glass
    ` },
  ], [
    { id: 'relativos', name: 'pronombres relativos', example: 'que, quien, lo que' },
    { id: 'mandatos-ud', name: 'mandatos formales', example: 'barra, no salgan' },
    { id: 'subjuntivo', name: 'presente de subjuntivo', example: 'que limpies, que vaya' },
    { id: 'voluntad', name: 'subjuntivo de voluntad', example: 'quiero que barras' },
  ], () => [
    ...parse('D2.3', 'relativos', `
      c | La casa ___ alquilamos tiene tres baños. | que / quien / lo que / quienes | que: cosas y personas
      c | El vecino con ___ hablé es muy simpático. | quien / que / lo que / cual | después de preposición, persona: quien
      c | Las chicas con ___ vivo son de Chile. | quienes / quien / que / lo que | plural: quienes
      c | ___ necesito es una lámpara nueva. | Lo que / Que / Quien / El que es | idea: lo que
      c | No entiendo ___ dices. | lo que / que / quien / cual | lo que = what
      c | El apartamento ___ está en el centro es caro. | que / quien / lo que / donde que | que (sujeto)
      c | La señora a ___ le alquilé el piso es mi tía. | quien / que / lo que / quienes | a quien
      c | Este es el barrio ___ crecí. | donde / que / quien / lo que | lugar: donde (en que)
      g | La alfombra ___ compré es azul. | que | que
      g | El hombre a ___ llamé es el dueño. | quien | a quien
      g | ___ más me gusta es el jardín. | Lo que | lo que
      t | The house that I want is in the suburbs. | La casa que quiero está en las afueras. | que
      t | What I need is a sofa. | Lo que necesito es un sofá. | lo que
    `),
    ...conj('D2.3', 'mandatos-ud', { tense: 'cmd', sign: '+', persons: [2, 5], verbs: ['barrer', 'cocinar', 'lavar', 'limpiar', 'planchar', 'sacudir', 'hacer', 'poner', 'salir', 'venir', 'traer', 'ir', 'ser', 'dar', 'saber', 'estar'] }),
    ...conj('D2.3', 'mandatos-ud', { tense: 'cmd', sign: '-', persons: [2, 5], verbs: ['barrer', 'cocinar', 'lavar', 'limpiar', 'hacer', 'poner', 'salir', 'ir', 'sacar', 'empezar', 'pagar'] }),
    ...parse('D2.3', 'mandatos-ud', `
      r | Señora, debe sacar la basura. (mandato, usted) | Saque la basura. / Señora, saque la basura. | sacar → saque (c → qu)
      r | Señores, deben hacer la cama. (mandato, ustedes) | Hagan la cama. / Señores, hagan la cama. | hacer → hagan
      r | Debe ponerla aquí. (mandato, usted) | Póngala aquí. | pronombre pegado, con tilde
      r | No deben tocarlo. (mandato, ustedes) | No lo toquen. | negativo: pronombre delante
      c | ¡___ la mesa, por favor! (poner, usted) | Ponga / Pone / Pon / Pongas | usted: ponga
      c | ¡No ___ el sofá todavía! (mover, ustedes) | muevan / mueven / mueva / movan | o→ue: muevan
      t | Sweep the floor, please. (usted) | Barra el suelo, por favor. / Por favor, barra el suelo. | barra
      t | Don't go out! (ustedes) | ¡No salgan! | no salgan
    `),
    ...conj('D2.3', 'subjuntivo', { tense: 'subjunctive', verbs: ['limpiar', 'barrer', 'sacudir', 'hacer', 'poner', 'tener', 'ir', 'ser', 'estar', 'dar', 'saber', 'pensar', 'volver', 'pedir', 'dormir', 'llegar', 'buscar', 'empezar'] }),
    ...parse('D2.3', 'subjuntivo', `
      g | Es necesario que tú ___ (hacer) la cama. | hagas | hacer → haga (raíz del yo)
      g | Es importante que nosotros ___ (barrer) el suelo. | barramos | -er → -a
      g | Es urgente que ellos ___ (sacar) la basura. | saquen | c → qu
      g | Es bueno que ___ (haber) muchos muebles. | haya | haber → haya
      g | Es mejor que usted ___ (ir) ahora. | vaya | ir → vaya
      g | Es malo que tú no ___ (dormir) bien. | duermas | o→ue
      g | Es necesario que nosotros ___ (dormir) ocho horas. | durmamos | nosotros: o→u
      c | Es importante que tú ___ los platos. | laves / lavas / lava / lavar | subjuntivo: laves
    `),
    ...parse('D2.3', 'voluntad', `
      g | Mi madre quiere que yo ___ (limpiar) mi cuarto. | limpie | querer que + subjuntivo
      g | Te aconsejo que ___ (alquilar) un apartamento cerca. | alquiles | aconsejar que
      g | Insisto en que ustedes ___ (quitar) la mesa. | quiten | insistir en que
      g | El dueño nos pide que no ___ (hacer) ruido. | hagamos | pedir que
      g | Te sugiero que ___ (poner) la lámpara aquí. | pongas | sugerir que
      g | Prefiero que tú ___ (venir) mañana. | vengas | preferir que
      g | Mis padres me prohíben que ___ (mudarse). | me mude | prohibir que
      g | Quiero ___ (mudarse) a las afueras. | mudarme | mismo sujeto: infinitivo
      c | Ella quiere ___ la casa. | pintar / pinte / pinta / pintara | mismo sujeto: infinitivo
      c | Ella quiere que yo ___ la casa. | pinte / pintar / pinto / pinta | otro sujeto: que + subjuntivo
      c | Te ruego que me ___. | ayudes / ayudas / ayudar / ayuda | rogar que + subjuntivo
      t | I want you (tú) to clean the kitchen. | Quiero que limpies la cocina. | querer que + subjuntivo
      t | They ask us to set the table. | Nos piden que pongamos la mesa. | pedir que + subjuntivo
    `),
  ]);

  /* ---------- 4 · La naturaleza ---------- */

  lesson('D2.4', 'La naturaleza', [
    { id: 'naturaleza', name: 'la naturaleza', example: 'el bosque tropical', text: `
      el árbol = tree
      el bosque (tropical) = (tropical; rain) forest = el bosque / el bosque tropical
      el cielo = sky
      el cráter = crater
      el desierto = desert
      la estrella = star
      la flor = flower
      la hierba = grass
      el lago = lake
      la luna = moon
      la naturaleza = nature
      la nube = cloud
      la piedra = stone
      la planta = plant
      el río = river
      la selva = jungle
      el sendero = trail; path
      el sol = sun
      la tierra = land; soil
      el valle = valley
      el volcán = volcano
      el animal = animal
      el ave = bird = el pájaro
      la ballena = whale
      el gato = cat
      el mono = monkey
      el perro = dog
      el pez = fish (live)
      la tortuga (marina) = (sea) turtle = la tortuga
      la vaca = cow
    ` },
    { id: 'ambiente', name: 'el medio ambiente', example: 'el reciclaje', text: `
      la conservación = conservation
      la contaminación (del aire; del agua) = (air; water) pollution = la contaminación
      la deforestación = deforestation
      la ecología = ecology
      el ecoturismo = ecotourism
      la energía (nuclear; solar) = (nuclear; solar) energy = la energía
      el envase = container
      la extinción = extinction
      la fábrica = factory
      el gobierno = government
      la lata = (tin) can
      la ley = law
      el medio ambiente = environment
      el peligro = danger
      la (sobre)población = (over)population = la población / la sobrepoblación
      el reciclaje = recycling
      el recurso natural = natural resource
      la solución = solution
      cazar = to hunt
      conservar = to conserve
      contaminar = to pollute
      controlar = to control
      cuidar = to take care of
      dejar de (+ inf.) = to stop (doing something) = dejar de
      desarrollar = to develop
      descubrir = to discover
      destruir = to destroy
      estar afectado (por) = to be affected (by)
      evitar = to avoid
      mejorar = to improve
      proteger = to protect
      reciclar = to recycle
      recoger = to pick up
      reducir = to reduce
      resolver = to resolve; to solve
      respirar = to breathe
      ecologista = ecological; ecologist
      puro = pure
      renovable = renewable
    ` },
  ], [
    { id: 'emocion', name: 'subjuntivo con emoción', example: 'me alegro de que recicles' },
    { id: 'duda', name: 'subjuntivo con duda', example: 'dudo que llueva · creo que llueve' },
    { id: 'conjunciones', name: 'subjuntivo con conjunciones', example: 'para que, antes de que' },
  ], () => [
    ...parse('D2.4', 'emocion', `
      g | Me alegro de que ustedes ___ (reciclar). | reciclen | alegrarse de que + subjuntivo
      g | Es triste que los árboles ___ (desaparecer). | desaparezcan | es triste que
      g | Temo que la ballena ___ (estar) en peligro. | esté | temer que
      g | Me molesta que la gente ___ (contaminar) el río. | contamine | molestar que
      g | Es una lástima que no ___ (haber) más parques. | haya | es una lástima que
      g | Espero que el gobierno ___ (proteger) el bosque. | proteja | g → j: proteja
      g | Ojalá que ___ (llover) pronto. | llueva | ojalá (que) + subjuntivo
      g | Nos sorprende que el lago ___ (ser) tan puro. | sea | sorprender que
      g | Me alegro de ___ (estar) aquí. | estar | mismo sujeto: infinitivo
      g | Siento que tú no ___ (poder) venir. | puedas | sentir que
      c | Es extraño que el cielo ___ tan oscuro. | esté / está / estar / estará | es extraño que + subjuntivo
      c | Ojalá ___ más energía solar. | usemos / usamos / usar / usaremos | ojalá + subjuntivo
      t | I'm glad you (tú) recycle. | Me alegro de que recicles. / Me alegra que recicles. | alegrarse de que
      t | I hope it doesn't rain. | Espero que no llueva. / Ojalá que no llueva. / Ojalá no llueva. | esperar que
    `),
    ...parse('D2.4', 'duda', `
      c | Dudo que la contaminación ___ pronto. | termine / termina / terminar / terminará | dudar que + subjuntivo
      c | Creo que la energía solar ___ el futuro. | es / sea / ser / fuera | creer que (afirmativo) + indicativo
      c | No creo que el gobierno ___ la ley. | cambie / cambia / cambiar / cambiará | no creer que + subjuntivo
      c | Es verdad que el río ___ contaminado. | está / esté / estar / estuviera | es verdad que + indicativo
      c | No es verdad que los animales ___ peligrosos. | sean / son / ser / serán | no es verdad que + subjuntivo
      c | Es posible que ___ esta tarde. | nieve / nieva / nevar / nevará | es posible que + subjuntivo
      c | Estoy seguro de que ellos ___ reciclar. | saben / sepan / saber / supieran | estar seguro de que + indicativo
      c | No estoy seguro de que ellos ___ reciclar. | sepan / saben / saber / sabrán | no estar seguro + subjuntivo
      c | Niego que la fábrica ___ el problema. | cause / causa / causar / causará | negar que + subjuntivo
      c | No dudo que ___ una solución. | hay / haya / haber / hubiera | no dudar que + indicativo
      c | Quizás ___ más tortugas este año. | haya / hay / haber / habrá | quizás / tal vez (duda) + subjuntivo
      c | Es probable que el volcán no ___ peligro. | sea / es / ser / será | es probable que + subjuntivo
      g | Pienso que la deforestación ___ (ser) grave. | es | pensar que + indicativo
      g | No pienso que ___ (ser) fácil. | sea | no pensar que + subjuntivo
      t | I doubt that they will come. | Dudo que vengan. | dudar que + subjuntivo
    `),
    ...parse('D2.4', 'conjunciones', `
      g | Reciclamos para que el planeta ___ (estar) limpio. | esté | para que + subjuntivo
      g | Vamos al lago antes de que ___ (llover). | llueva | antes de que + subjuntivo
      g | No podemos ir sin que tú nos ___ (llevar). | lleves | sin que + subjuntivo
      g | Te presto el libro con tal de que me lo ___ (devolver). | devuelvas | con tal (de) que + subjuntivo
      g | Lleva agua en caso de que ___ (hacer) calor. | haga | en caso de que + subjuntivo
      g | No habrá peces a menos que ___ (limpiar, nosotros) el río. | limpiemos | a menos que + subjuntivo
      g | Vamos a salir cuando ___ (dejar) de llover. | deje | cuando (futuro) + subjuntivo
      g | Siempre salgo cuando ___ (hacer) sol. | hace | cuando (hábito) + indicativo
      g | Te llamo en cuanto ___ (llegar, yo). | llegue | en cuanto (futuro) + subjuntivo
      g | Esperaremos hasta que ___ (salir) el sol. | salga | hasta que (futuro) + subjuntivo
      g | Estudio para ___ (proteger) el medio ambiente. | proteger | para + infinitivo: mismo sujeto
      c | Ayer salimos después de que ___ de llover. | dejó / deje / deja / dejara | pasado: indicativo
      c | Cuidamos los árboles ___ los niños tengan sombra. | para que / para / porque / a menos de | para que + subjuntivo
      t | We'll go as soon as it stops raining. | Iremos en cuanto deje de llover. / Vamos a ir en cuanto deje de llover. / Iremos tan pronto como deje de llover. | en cuanto + subjuntivo
    `),
  ]);

  /* ---------- 5 · En la ciudad ---------- */

  lesson('D2.5', 'En la ciudad', [
    { id: 'ciudad', name: 'la ciudad', example: 'la carnicería', text: `
      la carnicería = butcher shop
      la frutería = fruit store
      la heladería = ice cream shop
      la joyería = jewelry store
      la lavandería = laundromat
      la panadería = bakery
      la pastelería = pastry shop
      la peluquería = beauty salon = el salón de belleza
      la pescadería = fish market
      la zapatería = shoe store
      el supermercado = supermarket
      la cuadra = (city) block
      la dirección = address
      la esquina = corner
      el estacionamiento = parking lot
      derecho = straight (ahead)
      enfrente de = opposite; facing
      hacia = toward
      cruzar = to cross
      doblar = to turn
      hacer diligencias = to run errands
      quedar = to be located
      el letrero = sign
      el puente = bridge
      el semáforo = traffic light
    ` },
    { id: 'banco', name: 'el banco y el correo', example: 'el cajero automático', text: `
      el banco = bank
      el cajero automático = ATM
      la cuenta corriente = checking account
      la cuenta de ahorros = savings account
      el cheque (de viajero) = (traveler's) check = el cheque
      ahorrar = to save (money)
      cobrar = to cash (a check)
      depositar = to deposit
      firmar = to sign
      llenar (un formulario) = to fill out (a form) = llenar un formulario
      pagar a plazos = to pay in installments
      pagar al contado = to pay in cash = pagar en efectivo
      pedir prestado = to borrow
      pedir un préstamo = to apply for a loan
      ser gratis = to be free of charge
      el correo = mail; post office
      la carta = letter
      el/la cartero/a = mail carrier = el cartero / la cartera / cartero / cartera
      el paquete = package
      el sello = stamp = la estampilla
      el sobre = envelope
      echar (una carta) al buzón = to put (a letter) in the mailbox; to mail = echar una carta al buzón
      enviar = to send; to mail = mandar
    ` },
  ], [
    { id: 'adjetival', name: 'subjuntivo en cláusulas adjetivales', example: 'busco un banco que abra' },
    { id: 'mandatos-nos', name: 'mandatos con nosotros', example: 'crucemos, vámonos' },
    { id: 'participios', name: 'participios como adjetivos', example: 'la carta escrita' },
  ], () => [
    ...parse('D2.5', 'adjetival', `
      g | Busco un banco que ___ (abrir) los sábados. | abra | algo que no sé si existe: subjuntivo
      g | Conozco un banco que ___ (abrir) los sábados. | abre | existe: indicativo
      g | ¿Hay alguna panadería que ___ (vender) pan sin gluten? | venda | ¿hay…? (no sé): subjuntivo
      g | No hay nadie aquí que ___ (saber) la dirección. | sepa | no existe: subjuntivo
      g | Necesito un apartamento que ___ (estar) cerca del centro. | esté | necesito + que: subjuntivo
      g | Tengo un apartamento que ___ (estar) cerca del centro. | está | ya lo tengo: indicativo
      g | Quiero un trabajo que ___ (pagar) bien. | pague | g → gu
      g | No conozco ninguna joyería que ___ (ser) barata. | sea | ninguna: subjuntivo
      c | Buscamos al cartero que ___ en esta calle. | trabaja / trabaje / trabajar / trabajará | persona específica (al): indicativo
      c | Buscamos un cartero que ___ español. | hable / habla / hablar / habló | cualquiera (un): subjuntivo
      c | Hay una heladería que ___ helado de mango. | tiene / tenga / tener / tuviera | existe: indicativo
      t | I need a store that sells stamps. | Necesito una tienda que venda sellos. / Necesito una tienda que venda estampillas. | necesito + subjuntivo
      t | Is there anyone who can help me? | ¿Hay alguien que pueda ayudarme? / ¿Hay alguien que me pueda ayudar? | ¿hay alguien que…?
    `),
    ...conj('D2.5', 'mandatos-nos', { tense: 'cmd', sign: '+', persons: [3], verbs: ['cruzar', 'doblar', 'firmar', 'depositar', 'ahorrar', 'enviar', 'hacer', 'salir', 'pagar', 'buscar', 'empezar', 'pedir', 'dormir', 'sentarse', 'levantarse', 'irse', 'ponerse'] }),
    ...conj('D2.5', 'mandatos-nos', { tense: 'cmd', sign: '-', persons: [3], verbs: ['cruzar', 'doblar', 'firmar', 'gastar', 'salir', 'pagar', 'ir', 'sentarse', 'irse'] }),
    ...parse('D2.5', 'mandatos-nos', `
      r | Vamos a cruzar la calle. (mandato con nosotros) | Crucemos la calle. | z → c: crucemos
      r | Vamos a firmar el cheque. (mandato con nosotros) | Firmemos el cheque. | firmemos
      r | Vamos a enviarlo. (mandato con nosotros) | Enviémoslo. | pronombre pegado, con tilde
      r | Vamos a sentarnos. (mandato con nosotros) | Sentémonos. | sentemos + nos → sentémonos (sin s)
      r | Vamos a irnos. (mandato con nosotros) | Vámonos. | irse → vámonos
      r | No vamos a pagarlo ahora. (mandato con nosotros) | No lo paguemos ahora. | negativo: pronombre delante
      c | ¡___ a la panadería! (ir, nosotros) | Vamos / Vayamos a / Vamonos / Iremos | ir: vamos (afirmativo)
      c | ¡No ___ a la heladería! (ir, nosotros) | vayamos / vamos / vámonos / iremos | ir negativo: no vayamos
      t | Let's turn right. | Doblemos a la derecha. / Vamos a doblar a la derecha. | doblemos
      t | Let's not spend so much. | No gastemos tanto. | no gastemos
    `),
    ...parse('D2.5', 'participios', `
      g | La carta está ___ (escribir). | escrita | escribir → escrito
      g | Las tiendas están ___ (cerrar). | cerradas | concuerda: cerradas
      g | El paquete está ___ (abrir). | abierto | abrir → abierto
      g | Los cheques están ___ (firmar). | firmados | firmados
      g | La ventana está ___ (romper). | rota | romper → roto
      g | Los problemas están ___ (resolver). | resueltos | resolver → resuelto
      g | La mesa está ___ (poner). | puesta | poner → puesto
      g | El banco está ___ (hacer) de piedra. | hecho | hacer → hecho
      g | Las cartas ya están ___ (enviar). | enviadas | enviadas
      g | El ladrón está ___ (morir). | muerto | morir → muerto
      g | Los formularios están ___ (llenar). | llenos / llenados | llenar → llenado; lleno (adj.)
      g | Los sobres están ___ (cubrir) de sellos. | cubiertos | cubrir → cubierto
      c | La heladería está ___ hasta las diez. | abierta / abierto / abrida / abiertas | abierta (la heladería)
      t | The bank is closed. | El banco está cerrado. | estar + participio
      t | The letters are written. | Las cartas están escritas. | escritas
    `),
  ]);

  /* ---------- 6 · El bienestar ---------- */

  lesson('D2.6', 'El bienestar', [
    { id: 'bienestar', name: 'el bienestar', example: 'el estrés', text: `
      el bienestar = well-being
      la droga = drug
      el/la drogadicto/a = drug addict = el drogadicto / la drogadicta / drogadicto / drogadicta
      el masaje = massage
      el estrés = stress
      la clase de ejercicios aeróbicos = aerobics class
      el/la entrenador(a) = trainer = el entrenador / la entrenadora / entrenador / entrenadora
      la cinta caminadora = treadmill
      el músculo = muscle
      adelgazar = to lose weight; to slim down
      aliviar el estrés = to reduce stress = aliviar
      apurarse = to hurry; to rush = darse prisa
      aumentar de peso = to gain weight = engordar
      calentarse = to warm up
      disfrutar (de) = to enjoy; to reap the benefits (of) = disfrutar
      entrenarse = to train
      estar a dieta = to be on a diet
      estar en buena forma = to be in good shape
      hacer ejercicio = to exercise
      hacer gimnasia = to work out
      levantar pesas = to lift weights
      llevar una vida sana = to lead a healthy lifestyle
      mantenerse en forma = to stay in shape
      sudar = to sweat
      tratar de (+ inf.) = to try (to do something) = tratar de
      activo = active
      débil = weak
      en exceso = in excess; too much
      flexible = flexible
      fuerte = strong
      sedentario = sedentary
      tranquilo = calm; quiet
    ` },
    { id: 'nutricion', name: 'la nutrición', example: 'las proteínas', text: `
      la bebida alcohólica = alcoholic beverage
      la cafeína = caffeine
      la caloría = calorie
      el colesterol = cholesterol
      la grasa = fat
      la merienda = afternoon snack
      el mineral = mineral
      la nutrición = nutrition
      el/la nutricionista = nutritionist
      la proteína = protein
      la vitamina = vitamin
      comer una dieta equilibrada = to eat a balanced diet
      consumir alcohol = to consume alcohol
      descafeinado = decaffeinated
      fumar = to smoke
    ` },
  ], [
    { id: 'perfecto', name: 'pretérito perfecto', example: 'he corrido, has visto' },
    { id: 'pluscuamperfecto', name: 'pluscuamperfecto', example: 'había comido' },
    { id: 'perfecto-subj', name: 'perfecto de subjuntivo', example: 'que hayas comido' },
  ], () => [
    ...conj('D2.6', 'perfecto', { tense: 'perfect', verbs: ['adelgazar', 'sudar', 'entrenarse', 'disfrutar', 'fumar', 'comer', 'hacer', 'ver', 'escribir', 'decir', 'poner', 'volver', 'romper', 'abrir', 'morir', 'ir', 'ser', 'leer'] }),
    ...parse('D2.6', 'perfecto', `
      g | Este mes yo ___ (adelgazar) dos kilos. | he adelgazado | haber + participio
      g | ¿Tú ya ___ (hacer) ejercicio hoy? | has hecho | hacer → hecho
      g | Nosotros nunca ___ (fumar). | hemos fumado | hemos + participio
      g | ¿Alguna vez ___ (ver, ustedes) un masaje así? | han visto | ver → visto
      g | Mi hermano ___ (volver) del gimnasio. | ha vuelto | volver → vuelto
      g | Todavía no ___ (escribir, yo) el informe. | he escrito | escribir → escrito
      c | Hoy los atletas ___ mucho. | han sudado / han sudados / hayan sudado / habían suda | el participio no cambia con haber
      r | Ya hice la tarea. (pretérito perfecto, con pronombre) | Ya la he hecho. | el pronombre va delante de haber
      t | I have lost weight. | He adelgazado. / He bajado de peso. | he + participio
      t | Have you (tú) ever lifted weights? | ¿Alguna vez has levantado pesas? / ¿Has levantado pesas alguna vez? | has + participio
    `),
    ...conj('D2.6', 'pluscuamperfecto', { tense: 'pluperfect', verbs: ['comer', 'salir', 'hacer', 'ver', 'decir', 'volver', 'entrenarse', 'dejar', 'empezar', 'terminar', 'estar', 'ser'] }),
    ...parse('D2.6', 'pluscuamperfecto', `
      g | Cuando llegué al gimnasio, la clase ya ___ (empezar). | había empezado | antes de otra acción pasada
      g | Antes de 2020, yo nunca ___ (correr) un maratón. | había corrido | había + participio
      g | Ellos ya ___ (comer) cuando los llamé. | habían comido | habían
      g | ¿Tú ya ___ (dejar) de fumar en esa época? | habías dejado | habías
      g | Nosotros ___ (ver) al entrenador antes. | habíamos visto | habíamos
      g | Me dijo que ya ___ (hacer) los ejercicios. | había hecho | hecho
      c | Cuando el médico llegó, el paciente ya ___. | se había ido / se ha ido / se iba / se fue ya | anterior a otra acción pasada
      t | I had never seen a treadmill. | Nunca había visto una cinta caminadora. | había + participio
      t | They had already eaten. | Ya habían comido. | habían comido
    `),
    ...parse('D2.6', 'perfecto-subj', `
      g | Me alegro de que tú ___ (dejar) de fumar. | hayas dejado | emoción + haya + participio
      g | Espero que ellos ___ (hacer) ejercicio hoy. | hayan hecho | haya + hecho
      g | Dudo que él ___ (adelgazar) tanto. | haya adelgazado | duda + haya
      g | Es bueno que nosotros ___ (comer) bien. | hayamos comido | hayamos
      g | No creo que ustedes ___ (entrenarse) bastante. | se hayan entrenado | se + hayan
      g | Ojalá que el estrés ___ (disminuir). | haya disminuido | ojalá + haya
      g | Es posible que yo ___ (aumentar) de peso. | haya aumentado | haya (yo)
      g | No hay nadie que ___ (correr) más que ella. | haya corrido | no hay nadie que + haya
      c | Me sorprende que tú no ___ la noticia. | hayas visto / has visto / habías visto / viste ya | emoción: subjuntivo
      c | Creo que ella ___ mucho. | ha mejorado / haya mejorado / había mejore / mejore | creer que: indicativo
      t | I'm glad you (tú) have exercised. | Me alegro de que hayas hecho ejercicio. / Me alegra que hayas hecho ejercicio. | alegrarse de que + haya
    `),
  ]);

  /* ---------- 7 · El mundo del trabajo ---------- */

  lesson('D2.7', 'El mundo del trabajo', [
    { id: 'profesiones', name: 'profesiones', example: 'el/la abogado/a', text: `
      el/la abogado/a = lawyer = el abogado / la abogada / abogado / abogada
      el actor = actor = la actriz
      el/la arqueólogo/a = archeologist = el arqueólogo / la arqueóloga / arqueólogo / arqueóloga
      el/la arquitecto/a = architect = el arquitecto / la arquitecta / arquitecto / arquitecta
      el/la bombero/a = firefighter = el bombero / la bombera / bombero / bombera
      el/la carpintero/a = carpenter = el carpintero / la carpintera / carpintero / carpintera
      el/la científico/a = scientist = el científico / la científica / científico / científica
      el/la cocinero/a = cook; chef = el cocinero / la cocinera / cocinero / cocinera
      el/la consejero/a = counselor; advisor = el consejero / la consejera / consejero / consejera
      el/la contador(a) = accountant = el contador / la contadora / contador / contadora
      el/la corredor(a) de bolsa = stockbroker = el corredor de bolsa / la corredora de bolsa
      el/la diseñador(a) = designer = el diseñador / la diseñadora / diseñador / diseñadora
      el/la electricista = electrician
      el hombre de negocios = businessman = la mujer de negocios
      el/la maestro/a = teacher = el maestro / la maestra / maestro / maestra
      el/la peluquero/a = hairdresser = el peluquero / la peluquera / peluquero / peluquera
      el/la pintor(a) = painter = el pintor / la pintora / pintor / pintora
      el/la político/a = politician = el político / la política / político / política
      el/la psicólogo/a = psychologist = el psicólogo / la psicóloga / psicólogo / psicóloga
      el/la secretario/a = secretary = el secretario / la secretaria / secretario / secretaria
      el/la técnico/a = technician = el técnico / la técnica / técnico / técnica
    ` },
    { id: 'trabajo', name: 'el trabajo', example: 'la entrevista', text: `
      el ascenso = promotion
      el aumento de sueldo = raise (in salary)
      la carrera = career
      la compañía = company; firm = la empresa
      el empleo = job; employment
      el/la gerente = manager
      el/la jefe/a = boss = el jefe / la jefa / jefe / jefa
      los negocios = business; commerce
      la ocupación = occupation
      el oficio = trade
      la profesión = profession
      la reunión = meeting
      el teletrabajo = telecommuting
      el trabajo = job; work
      la videoconferencia = videoconference
      dejar = to quit; to leave behind
      despedir = to fire
      invertir = to invest
      renunciar (a) = to resign (from) = renunciar
      tener éxito = to be successful
      comercial = commercial; business-related
      el anuncio = advertisement
      el/la aspirante = candidate; applicant
      los beneficios = benefits
      el currículum = résumé
      la entrevista = interview
      el/la entrevistador(a) = interviewer = el entrevistador / la entrevistadora / entrevistador / entrevistadora
      el puesto = position; job
      el salario = salary = el sueldo
      la solicitud (de trabajo) = (job) application = la solicitud
      contratar = to hire
      entrevistar = to interview
      ganar = to earn
      obtener = to obtain; to get
      solicitar = to apply (for a job)
    ` },
  ], [
    { id: 'futuro', name: 'el futuro', example: 'trabajaré, tendrás' },
    { id: 'futuro-perfecto', name: 'futuro perfecto', example: 'habré terminado' },
    { id: 'subj-pasado', name: 'imperfecto de subjuntivo', example: 'que trabajara, que fuera' },
  ], () => [
    ...conj('D2.7', 'futuro', { tense: 'future', verbs: ['trabajar', 'ganar', 'invertir', 'contratar', 'tener', 'poder', 'salir', 'hacer', 'decir', 'saber', 'poner', 'venir', 'querer'] }),
    ...parse('D2.7', 'futuro', `
      g | El año que viene yo ___ (trabajar) en una empresa grande. | trabajaré | futuro: infinitivo + é
      g | ¿Cuándo ___ (saber) tú el resultado de la entrevista? | sabrás | saber → sabr-
      g | Mañana ___ (haber) una reunión a las nueve. | habrá | hay → habrá
      g | La gerente ___ (decir) quién recibe el ascenso. | dirá | decir → dir-
      g | Nosotros ___ (hacer) la videoconferencia el lunes. | haremos | hacer → har-
      g | Ellos ___ (tener) éxito en su carrera. | tendrán | tener → tendr-
      g | ¿Dónde ___ (estar) mi currículum? (probabilidad) | estará | futuro de probabilidad = I wonder
      g | ___ (Ser) las diez. (probablemente) | Serán | probabilidad: serán
      r | Voy a solicitar el puesto. (futuro simple) | Solicitaré el puesto. | ir a + inf. → futuro
      t | I will be a lawyer. | Seré abogado. / Seré abogada. | ser → seré
      t | Will you (tú) quit your job? | ¿Dejarás tu trabajo? / ¿Renunciarás a tu trabajo? | futuro
    `),
    ...parse('D2.7', 'futuro-perfecto', `
      g | Para el viernes, yo ya ___ (terminar) el proyecto. | habré terminado | habré + participio
      g | Para 2030, nosotros ___ (ahorrar) mucho dinero. | habremos ahorrado | habremos
      g | Cuando llegues, ellos ya ___ (salir). | habrán salido | habrán
      g | ¿Tú ___ (recibir) el aumento para diciembre? | habrás recibido | habrás
      g | Dentro de un año, ella ___ (obtener) el ascenso. | habrá obtenido | habrá
      g | Para las cinco, el jefe ya ___ (despedir) al técnico. | habrá despedido | habrá
      g | Antes de la entrevista, yo ___ (escribir) el currículum. | habré escrito | escrito
      g | Ustedes ___ (hacer) todo para mañana. | habrán hecho | hecho
      g | ¿Dónde está Ana? — ___ (ir) a la reunión. (probabilidad) | Habrá ido | probabilidad en el pasado
      c | Para junio, yo ___ la universidad. | habré terminado / habría terminado / he terminado / había terminado | para + futuro: futuro perfecto
      t | By tomorrow, I will have finished. | Para mañana, habré terminado. / Para mañana habré terminado. | habré terminado
    `),
    ...conj('D2.7', 'subj-pasado', { tense: 'pastSubjunctive', verbs: ['trabajar', 'contratar', 'ganar', 'tener', 'ser', 'ir', 'hacer', 'poder', 'decir', 'saber', 'venir', 'pedir', 'dormir', 'leer'] }),
    ...parse('D2.7', 'subj-pasado', `
      g | El jefe quería que yo ___ (llegar) temprano. | llegara / llegase | pasado + que + imperfecto de subjuntivo
      g | Me pidieron que ___ (traer) el currículum. | trajera / trajese | traje- → trajera
      g | Era importante que nosotros ___ (hablar) con la gerente. | habláramos / hablásemos | nosotros: tilde
      g | Dudaba que ellos me ___ (contratar). | contrataran / contratasen | dudar (pasado)
      g | Buscaban un aspirante que ___ (saber) inglés. | supiera / supiese | supieron → supiera
      g | Esperaba que tú ___ (tener) éxito. | tuvieras / tuvieses | tuvieron → tuviera
      g | Me alegré de que ella ___ (obtener) el puesto. | obtuviera / obtuviese | obtuvieron → obtuviera
      g | No había nadie que ___ (poder) ayudarme. | pudiera / pudiese | pudieron → pudiera
      c | Te aconsejé que ___ a ese puesto. | renunciaras / renuncies / renunciabas / renunciarás | pasado → imperfecto de subjuntivo
      c | Quiero que ___ a la entrevista. | vengas / vinieras / vienes / vendrás | presente → presente de subjuntivo
      t | They wanted me to work on Saturday. | Querían que trabajara el sábado. / Querían que yo trabajara el sábado. / Querían que trabajase el sábado. | querían que + imperfecto de subjuntivo
    `),
  ]);

  /* ---------- 8 · Un festival de arte ---------- */

  lesson('D2.8', 'Un festival de arte', [
    { id: 'artes', name: 'las artes', example: 'la escultura', text: `
      la artesanía = craftsmanship; crafts
      el boleto = ticket
      la canción = song
      la comedia = comedy; play
      el concierto = concert
      el cuento = short story
      la cultura = culture
      el drama = drama; play
      la escultura = sculpture
      el espectáculo = show
      la estatua = statue
      el festival = festival
      la historia = history; story
      la música = music
      la obra = work (of art, music, etc.)
      la obra maestra = masterpiece
      la ópera = opera
      la orquesta = orchestra
      el personaje (principal) = (main) character = el personaje
      la pintura = painting
      el poema = poem
      la poesía = poetry
      el público = audience
      el teatro = theater
      la tragedia = tragedy
      el/la bailarín/bailarina = dancer = el bailarín / la bailarina / bailarín / bailarina
      el/la compositor(a) = composer = el compositor / la compositora / compositor / compositora
      el/la director(a) = director; (musical) conductor = el director / la directora / director / directora
      el/la dramaturgo/a = playwright = el dramaturgo / la dramaturga / dramaturgo / dramaturga
      el/la escritor(a) = writer = el escritor / la escritora / escritor / escritora
      el/la escultor(a) = sculptor = el escultor / la escultora / escultor / escultora
      el/la poeta = poet
      aburrirse = to get bored
      aplaudir = to applaud
      apreciar = to appreciate
      dirigir = to direct
      esculpir = to sculpt
      hacer el papel (de) = to play the role (of) = hacer el papel
      pintar = to paint
      presentar = to present; to put on (a performance)
      publicar = to publish
      tocar (un instrumento musical) = to touch; to play (a musical instrument) = tocar
    ` },
    { id: 'cine', name: 'cine y televisión', example: 'el premio', text: `
      el canal = channel
      el/la comentarista = commentator
      el concurso = game show; contest
      los dibujos animados = cartoons
      el documental = documentary
      el premio = prize; award
      el programa de entrevistas = talk show
      la telenovela = soap opera
      de acción = action
      de aventuras = adventure
      de ciencia ficción = science fiction
      de horror = horror
      de vaqueros = western
      clásico = classical
      dramático = dramatic
      extranjero = foreign
      famoso = famous
      folclórico = folk
      moderno = modern
      musical = musical
      romántico = romantic
      talentoso = talented
    ` },
  ], [
    { id: 'condicional', name: 'el condicional', example: 'iría, podrías' },
    { id: 'cond-perfecto', name: 'condicional perfecto', example: 'habría ido' },
    { id: 'plusc-subj', name: 'pluscuamperfecto de subjuntivo', example: 'que hubiera visto' },
  ], () => [
    ...conj('D2.8', 'condicional', { tense: 'conditional', verbs: ['pintar', 'aplaudir', 'publicar', 'tocar', 'tener', 'poder', 'salir', 'hacer', 'decir', 'saber', 'poner', 'venir', 'querer', 'ir'] }),
    ...parse('D2.8', 'condicional', `
      g | Yo ___ (ir) al concierto, pero no tengo boleto. | iría | condicional: infinitivo + ía
      g | ¿___ (poder) tú prestarme tu guitarra? | Podrías | cortesía: podrías
      g | Me ___ (gustar) ver la ópera. | gustaría | me gustaría = I would like
      g | Con más tiempo, ella ___ (escribir) más poemas. | escribiría | escribiría
      g | Nosotros ___ (hacer) el papel principal. | haríamos | hacer → har-
      g | Ellos dijeron que ___ (venir) al festival. | vendrían | futuro en el pasado
      g | ¿Qué hora era? — ___ (Ser) las diez. (probabilidad en el pasado) | Serían | probabilidad en el pasado
      g | Yo en tu lugar no ___ (decir) nada. | diría | decir → dir-
      t | I would like to be a dancer. | Me gustaría ser bailarín. / Me gustaría ser bailarina. | gustaría
      t | Would you (tú) buy that painting? | ¿Comprarías esa pintura? / ¿Comprarías ese cuadro? | condicional
    `),
    ...parse('D2.8', 'cond-perfecto', `
      g | Yo ___ (ir) al festival, pero estaba enferma. | habría ido | habría + participio
      g | Con un buen director, la película ___ (ganar) el premio. | habría ganado | habría ganado
      g | Nosotros ___ (aplaudir) más, pero estábamos cansados. | habríamos aplaudido | habríamos
      g | ¿Tú ___ (hacer) el papel de Romeo? | habrías hecho | hecho
      g | Ellos ___ (ver) la obra, pero no había boletos. | habrían visto | visto
      g | Ella ___ (publicar) el cuento con más tiempo. | habría publicado | habría
      g | En tu lugar, yo ___ (decir) la verdad. | habría dicho | dicho
      g | ¿Qué ___ (hacer) usted en esa situación? | habría hecho | habría
      g | Sin tu ayuda, yo no ___ (terminar) la escultura. | habría terminado | habría
      c | Yo ___ el poema, pero no tenía papel. | habría escrito / habré escrito / he escrito / hubiera escribido | habría + participio
      t | I would have gone to the concert. | Habría ido al concierto. / Hubiera ido al concierto. | habría ido
    `),
    ...parse('D2.8', 'plusc-subj', `
      g | Me alegré de que tú ___ (ganar) el premio. | hubieras ganado / hubieses ganado | pasado + emoción: hubiera
      g | Dudaba que ellos ___ (ver) la obra. | hubieran visto / hubiesen visto | hubieran visto
      g | Esperaba que el público ___ (aplaudir) más. | hubiera aplaudido / hubiese aplaudido | hubiera
      g | No creí que ella ___ (escribir) ese poema. | hubiera escrito / hubiese escrito | escrito
      g | Fue una lástima que nosotros no ___ (ir). | hubiéramos ido / hubiésemos ido | hubiéramos (tilde)
      g | Ojalá ___ (estar, yo) en el estreno. | hubiera estado / hubiese estado | ojalá + hubiera: deseo imposible del pasado
      g | Me sorprendió que el director ___ (renunciar). | hubiera renunciado / hubiese renunciado | hubiera
      g | No había nadie que ___ (leer) el cuento. | hubiera leído / hubiese leído | leído (tilde)
      c | Sentí mucho que ustedes no ___ al festival. | hubieran venido / han venido / hayan venido / vinieron | pasado + emoción: hubieran
      t | I wish I had seen the show. | Ojalá hubiera visto el espectáculo. / Ojalá hubiese visto el espectáculo. | ojalá + hubiera
    `),
  ]);

  /* ---------- 9 · Las actualidades ---------- */

  lesson('D2.9', 'Las actualidades', [
    { id: 'politica', name: 'política y noticias', example: 'las elecciones', text: `
      el acontecimiento = event
      las actualidades = news; current events
      el artículo = article
      el diario = newspaper = el periódico
      el informe = report; paper (written work)
      los medios de comunicación = means of communication; media
      las noticias = news
      la prensa = press
      el reportaje = report
      anunciar = to announce; to advertise
      comunicarse (con) = to communicate (with) = comunicarse
      durar = to last
      informar = to inform
      ocurrir = to occur; to happen
      transmitir = to broadcast = emitir
      el/la candidato/a = candidate = el candidato / la candidata / candidato / candidata
      el/la ciudadano/a = citizen = el ciudadano / la ciudadana / ciudadano / ciudadana
      el deber = responsibility; obligation
      los derechos = rights
      la dictadura = dictatorship
      el discurso = speech
      las elecciones = election
      la encuesta = poll; survey
      la huelga = strike
      la igualdad = equality
      la desigualdad = inequality
      la libertad = freedom
      la paz = peace
      la guerra = war
      la política = politics
      el/la representante = representative
      declarar = to declare
      elegir = to elect
      luchar (por/contra) = to fight; to struggle (for/against) = luchar
      votar = to vote
      político = political
    ` },
    { id: 'desastres', name: 'desastres', example: 'el terremoto', text: `
      el crimen = crime; murder
      el desastre (natural) = (natural) disaster = el desastre
      el ejército = army
      la experiencia = experience
      el huracán = hurricane
      el incendio = fire
      la inundación = flood
      la libertad de prensa = freedom of the press
      la tormenta = storm
      el tornado = tornado
      la violencia = violence
      el terremoto = earthquake
      el terrorismo = terrorism
      la víctima = victim
    ` },
  ], [
    { id: 'si', name: 'cláusulas con si', example: 'si tuviera, iría' },
    { id: 'resumen', name: 'resumen del subjuntivo', example: 'indicativo o subjuntivo' },
  ], () => [
    ...parse('D2.9', 'si', `
      g | Si ___ (llover) mañana, no habrá elecciones. | llueve | si + presente → futuro
      g | Si votas, ___ (ayudar) a tu país. | ayudarás / ayudas | si + presente → futuro o presente
      g | Si yo ___ (ser) presidenta, lucharía por la igualdad. | fuera / fuese | si + imperfecto de subjuntivo → condicional
      g | Si tuviéramos dinero, ___ (viajar) a Uruguay. | viajaríamos | condicional
      g | Si ___ (haber) un terremoto, ¿qué harías? | hubiera / hubiese | hay → hubiera
      g | Si hubieras leído el diario, ___ (saber) la noticia. | habrías sabido / hubieras sabido | si + pluscuamperfecto de subj. → condicional perfecto
      g | Si ___ (ver, yo) la tormenta, no habría salido. | hubiera visto / hubiese visto | hubiera visto
      g | Si los candidatos ___ (decir) la verdad, la gente votaría. | dijeran / dijesen | decir → dijeran
      g | Si me ___ (llamar) ayer, habría ido contigo. | hubieras llamado / hubieses llamado | condición pasada
      g | Si hace buen tiempo, ___ (ir, nosotros) a la playa. | iremos / vamos | si + presente → futuro
      c | Si yo ___ más tiempo, leería el periódico. | tuviera / tenga / tendría / tengo | nunca condicional después de si
      c | Si ganas las elecciones, ¿qué ___? | harás / harías / hicieras / hagas | si + presente → futuro
      c | Si hubiera estudiado, ___ el examen. | habría aprobado / aprobaría / apruebe / hubiera aprobar | condición pasada → condicional perfecto
      t | If I were rich, I would help the victims. | Si fuera rico, ayudaría a las víctimas. / Si fuera rica, ayudaría a las víctimas. / Si yo fuera rico, ayudaría a las víctimas. | si + imperfecto subj. → condicional
      t | If it rains, we will stay home. | Si llueve, nos quedaremos en casa. / Si llueve, nos vamos a quedar en casa. | si + presente → futuro
    `),
    ...parse('D2.9', 'resumen', `
      c | Es importante que todos ___. | voten / votan / votar / votarán | impersonal de influencia: subjuntivo
      c | Es cierto que la huelga ___ tres días. | duró / durara / dure / durar | certeza: indicativo
      c | El presidente quería que el ejército ___. | ayudara / ayude / ayudaba / ayudará | pasado + influencia: imperfecto de subj.
      c | Busco un candidato que ___ honesto. | sea / es / era / será | antecedente desconocido: subjuntivo
      c | Tengo un representante que ___ muy honesto. | es / sea / fuera / ser | antecedente conocido: indicativo
      c | Me alegro de que ___ la paz. | haya / hay / hubo / habrá | emoción: subjuntivo
      c | Te llamaré cuando ___ las noticias. | termine / termina / terminó / terminará | cuando + futuro: subjuntivo
      c | Siempre leo el diario cuando ___ el desayuno. | tomo / tome / tomara / tomaré | hábito: indicativo
      c | No creo que la encuesta ___ correcta. | sea / es / será / era | duda: subjuntivo
      c | Creo que la encuesta ___ correcta. | es / sea / fuera / ser | creencia: indicativo
      c | Ojalá ___ más libertad de prensa. | hubiera / había / habrá / hay | ojalá (deseo difícil): imperfecto de subj.
      c | Aunque ___ mañana, iré a votar. (I don't know if it will rain) | llueva / llueve / lloverá / llovía | aunque + incertidumbre: subjuntivo
      c | Aunque ___ ahora, voy a votar. (it's raining now) | llueve / llueva / lloviera / lloverá | aunque + hecho: indicativo
      c | Lo hicieron sin que nadie lo ___. | supiera / sabía / sepa / sabrá | sin que (pasado): imperfecto de subj.
      c | El reportero habla como si ___ todo. | supiera / sabe / sepa / sabrá | como si + imperfecto de subj.
      t | It's necessary that the citizens vote. | Es necesario que los ciudadanos voten. | es necesario que + subjuntivo
    `),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
