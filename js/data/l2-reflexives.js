(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const L2 = (D.L2 = D.L2 || {});
  const { parse } = D.lessonKit;

  // Descubre 3, Lección 2, Estructuras 2.3: reflexive verbs, verbs whose meaning changes with se, verbs that
  // are always pronominal, and where the pronoun goes.
  L2.REFLEXIVE_SKILLS = [
    { id: 'rf-forma', name: 'forma y posición', example: 'me divierto, voy a divertirme' },
    { id: 'rf-sentido', name: 'con o sin se', example: 'dormir / dormirse' },
  ];

  L2.reflexives = [
    ...parse('D3.2', 'rf-forma', `
      g | Los sábados yo ___ (divertirse) mucho en la feria. | me divierto | divertirse (e→ie): me divierto
      g | ¿A qué hora ___ (levantarse) tú los domingos? | te levantas | tú → te levantas
      g | Mis primos ___ (aburrirse) en los conciertos de música clásica. | se aburren | ellos → se aburren
      g | Nosotros ___ (reunirse) en el café después del partido. | nos reunimos | reunirse: nos reunimos (ú en reúno, no en nosotros)
      g | Mi hermana ___ (ponerse) nerviosa antes de cada función. | se pone | ponerse + adjetivo = to become
      g | Los jugadores ___ (quejarse) del árbitro. | se quejan | quejarse siempre lleva se
      g | Yo nunca ___ (acordarse) de la letra de las canciones. | me acuerdo | acordarse (o→ue) de
      g | ¿Vosotros ___ (sentarse) en la primera fila? | os sentáis | vosotros → os sentáis | vos
      g | Tú ___ (vestirse) muy elegante para el estreno. | te vistes | vestirse (e→i): te vistes
      g | El público ___ (despedirse) del cantante con aplausos. | se despide | despedirse (e→i) de
      g | Nosotros no ___ (atreverse) a subir a la montaña rusa. | nos atrevemos | atreverse a + infinitivo
      g | Ustedes ___ (arrepentirse) de no ir al concierto. | se arrepienten | arrepentirse (e→ie) de
      g | Ella ___ (darse) cuenta de que las entradas estaban agotadas. | se dio / se da | darse cuenta de = to realize
      g | Yo ___ (irse) temprano porque el espectáculo era aburrido. | me fui / me voy | irse = to leave
      g | Mis amigos y yo ___ (divertirse) en el parque de atracciones. | nos divertimos | nosotros: nos divertimos (sin cambio de raíz)
      r | Voy a ducharme antes del partido. (pronombre delante) | Me voy a duchar antes del partido. | el pronombre va delante del verbo conjugado o pegado al infinitivo
      r | Me estoy preparando para el concierto. (pronombre detrás) | Estoy preparándome para el concierto. | pegado al gerundio, con tilde: preparándome
      r | Nos vamos a sentar aquí. (pronombre detrás) | Vamos a sentarnos aquí. | pegado al infinitivo: sentarnos
      r | Te tienes que vestir ya. (pronombre detrás) | Tienes que vestirte ya. | tener que + infinitivo + te
      r | Se están divirtiendo mucho. (pronombre detrás) | Están divirtiéndose mucho. | divirtiendo + se → divirtiéndose
      g | ¡___ (sentarse, tú) aquí, al lado del escenario! | Siéntate | mandato afirmativo: pronombre pegado, con tilde
      g | ¡No ___ (preocuparse, tú) por las entradas! | te preocupes | mandato negativo: no te preocupes
      g | ¡___ (divertirse, ustedes) en la fiesta! | Diviértanse | ustedes: diviértanse
      g | ¡___ (quedarse, nosotros) hasta el final del partido! | Quedémonos | nosotros: quedemos + nos → quedémonos (sin la s)
      c | Antes de salir, Ana ___ el pelo. | se peina / peina / se peinan / te peinas | se peina: la acción vuelve al sujeto
      c | Los aficionados ___ cuando su equipo pierde. | se enojan / enojan / se enoja / nos enojamos | enojarse = to get angry
      c | Mañana vamos a ___ temprano para hacer cola. | levantarnos / levantarse / nos levantar / levantamos | infinitivo + nos
      c | ¿Cómo ___ tus amigos cuando ganan? — Se ponen muy contentos. | se ponen / ponen / se pone / te pones | ponerse + adjetivo
      t | We have a great time at the circus. | Nos divertimos mucho en el circo. / Lo pasamos muy bien en el circo. | divertirse
      t | I always fall asleep during the movie. | Siempre me duermo durante la película. / Me duermo siempre durante la película. | dormirse = to fall asleep
      t | They got bored at the game. | Se aburrieron en el partido. | aburrirse
      t | Are you leaving already? (tú) | ¿Ya te vas? / ¿Te vas ya? | irse = to leave
    `),
    ...parse('D3.2', 'rf-sentido', `
      c | El concierto empieza a las ocho; ¿por qué no ___ ahora? | nos vamos / vamos / nos ponemos / ponemos | irse = to leave (un lugar)
      c | Esta noche ___ al cine con mis primos. | voy / me voy / me pongo / me llevo | ir a un lugar: sin se
      c | Mi abuelo siempre ___ en el sofá viendo el partido. | se duerme / duerme / se va / va | dormirse = to fall asleep
      c | Los bebés ___ diez horas cada noche. | duermen / se duermen / se van / se acuerdan | dormir = to sleep
      c | Yo ___ el abrigo porque hacía frío en el estadio. | me puse / puse / me llevé / llevé | ponerse (ropa) = to put on
      c | El camarero ___ la mesa para seis personas. | puso / se puso / se llevó / se quedó | poner la mesa = to set the table
      c | Mis hermanos ___ muy bien; nunca discuten. | se llevan / llevan / se parecen / se ponen | llevarse bien = to get along
      c | ¿Quién ___ las entradas al concierto? — Yo las llevo en la mochila. | lleva / se lleva / se parece / se pone | llevar = to carry, to take
      c | Marta ___ mucho a su madre: tienen los mismos ojos. | se parece / parece / se pone / se lleva | parecerse a = to look like
      c | El partido ___ muy aburrido. | parece / se parece / se pone / se queda | parecer = to seem
      c | ¿___ del nombre de la cantante? | Te acuerdas / Acuerdas / Te pareces / Te quedas | acordarse de = to remember
      c | Los músicos ___ tocar dos canciones más. | acordaron / se acordaron / se llevaron / se pusieron | acordar = to agree
      c | Los jugadores ___ las camisetas al final del partido. | se quitaron / quitaron / se pusieron a / se fueron | quitarse (ropa) = to take off
      c | ¿Quién ___ mi asiento? ¡Estaba aquí antes! | me quitó / se quitó / me quité / se quita | quitar = to take away
      c | Nosotros ___ en casa porque llovía. | nos quedamos / quedamos / nos fuimos / fuimos | quedarse = to stay
      c | ___ con Ana a las siete delante del cine. | Quedamos / Nos quedamos / Nos vamos / Nos ponemos | quedar con alguien = to arrange to meet
      c | El árbitro no ___ cuenta del error. | se dio / dio / se fue / se puso | darse cuenta de = to realize
      c | Cuando ganó el campeonato, el equipo ___ a cantar. | se puso / puso / se quedó / se fue | ponerse a + infinitivo = to start to
      c | Después de tantas derrotas, el entrenador ___ triste. | se puso / puso / se fue / se dio | ponerse + adjetivo = to become
      c | Ella ___ de no ir al estreno con nosotros. | se arrepintió / arrepintió / se quedó / se puso | arrepentirse: siempre con se
      c | Mi hermano siempre ___ de que la música está muy alta. | se queja / queja / se queda / se pone | quejarse: siempre con se
      c | ¿Tú ___ a cantar en el escenario? | te atreves / atreves / te pones / te vas | atreverse a: siempre con se
      c | ¿A qué hora ___ el espectáculo? | termina / se termina / se queda / se pone | terminar: el espectáculo (sin se)
      c | Pedro y Elena ___ en el festival y ahora son novios. | se conocieron / conocieron / se parecieron / se quedaron | recíproco: se conocieron (el uno al otro)
    `),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
