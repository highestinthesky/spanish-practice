(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Cumulative review for the general mode: each block names the latest lesson it needs, so the items only
  // come up once that lesson is in range. They mix grammar from several lessons, the way a cumulative test does.
  //   traduccion: translate · error: rewrite the sentence correctly · tiempo: pick the tense · elige: pick the form

  D.addMixed('D1.3', 'traduccion', `
    t | My grandparents live in Ecuador and have a big house. | Mis abuelos viven en Ecuador y tienen una casa grande. | vivir + tener; adjetivo detrás
    t | We are students and we are in the library. | Somos estudiantes y estamos en la biblioteca. | ser (ocupación) · estar (lugar)
    t | Do you (tú) have to work on Saturday? | ¿Tienes que trabajar el sábado? | tener que + infinitivo
    t | Her brother is tall and very nice. | Su hermano es alto y muy simpático. | su; ser + adjetivos
  `);
  D.addMixed('D1.3', 'error', `
    r | Corrige: Mi hermanas son altos. | Mis hermanas son altas. | mis + concordancia en femenino plural
    r | Corrige: Yo soy en la clase. | Yo estoy en la clase. / Estoy en la clase. | lugar: estar
    r | Corrige: Nosotros comemos en la cafetería y bebimos agua. (presente) | Nosotros comemos en la cafetería y bebemos agua. / Comemos en la cafetería y bebemos agua. | los dos en presente
    r | Corrige: Ella tiene veinte año. | Ella tiene veinte años. / Tiene veinte años. | años en plural
  `);
  D.addMixed('D1.5', 'elige', `
    c | ¿Dónde ___ tus padres? — En la playa. | están / son / hay / van | lugar: estar
    c | La fiesta ___ en el hotel. | es / está / hay / va | evento: ser
    c | ¿Tienes los pasajes? — Sí, ___ tengo aquí. | los / las / les / lo | los pasajes → los
    c | Mañana ___ a esquiar. | vamos / vamos a / vemos / vayamos | ir a + infinitivo: vamos a esquiar
    c | Ahora mismo yo ___ las maletas. | estoy haciendo / hago ahora mismo de / soy haciendo / estoy hago | progresivo: estar + gerundio
    c | ¿Qué tiempo hace? — ___ frío. | Hace / Está / Es / Tiene | tiempo: hace frío
  `);
  D.addMixed('D1.5', 'traduccion', `
    t | We are going to visit the museum tomorrow. | Vamos a visitar el museo mañana. / Mañana vamos a visitar el museo. | ir a + infinitivo
    t | I can't sleep because I'm nervous. | No puedo dormir porque estoy nervioso. / No puedo dormir porque estoy nerviosa. | poder (o→ue) · estar + emoción
    t | They are playing cards right now. | Están jugando a las cartas ahora mismo. / Ahora mismo están jugando a las cartas. / Están jugando cartas ahora mismo. | progresivo
    t | I'm bringing the ball. | Traigo la pelota. / Estoy trayendo la pelota. | traer: traigo
  `);
  D.addMixed('D1.6', 'tiempo', `
    c | Ayer yo ___ unos zapatos en el mercado. | compré / compro / compraba / compraré | ayer: pretérito
    c | Todos los días ___ el autobús a las ocho. | tomo / tomé / tomaré / tome | todos los días (presente): presente
    c | Anoche nosotros ___ en un restaurante. | comimos / comemos / comíamos / comeremos | anoche: pretérito
    c | El año pasado mi hermana ___ en Lima. | vivió / vive / vivirá / viva | el año pasado: pretérito
  `);
  D.addMixed('D1.6', 'error', `
    r | Corrige: Yo conozco nadar. | Yo sé nadar. / Sé nadar. | saber + infinitivo
    r | Corrige: Le doy el regalo a ellos. | Les doy el regalo a ellos. / Les doy el regalo. | a ellos → les
    r | Corrige: Ayer yo pagé la cuenta. | Ayer yo pagué la cuenta. / Ayer pagué la cuenta. | -gar: pagué
    r | Corrige: Ese camisas son caras. | Esas camisas son caras. | esas (femenino plural)
  `);
  D.addMixed('D1.8', 'elige', `
    c | ¿Le diste las flores a tu madre? — Sí, ___ di. | se las / le las / se los / las le | le + las → se las
    c | El camarero nos ___ la sopa ayer. | sirvió / servió / sirve ayer / servía ayer | servir (pret.): sirvió
    c | Mi coche es ___ que el tuyo. | mejor / más bueno de / más mejor / el mejor | bueno → mejor
    c | No hay ___ en la cocina. | nadie / alguien / ningún / algún | no… nadie
    c | A mis padres les ___ los mariscos. | encantan / encanta / encantamos / encantas | encantar + plural
    c | Ayer ___ al mercado y compré uvas. | fui / fue / iba / voy | ir (pret.): fui
  `);
  D.addMixed('D1.8', 'traduccion', `
    t | I got up at seven and went to the market. | Me levanté a las siete y fui al mercado. | reflexivo + pretérito de ir
    t | She ordered fish and he ordered chicken. | Ella pidió pescado y él pidió pollo. / Pidió pescado y él pidió pollo. | pedir: pidió
    t | I like the soup, but I don't like the salad. | Me gusta la sopa, pero no me gusta la ensalada. | gustar + singular
    t | Can you give it (the menu) to me? (tú) | ¿Me lo puedes dar? / ¿Puedes dármelo? | me + lo
  `);
  D.addMixed('D1.9', 'error', `
    r | Corrige: Ayer yo tení una fiesta. | Ayer yo tuve una fiesta. / Ayer tuve una fiesta. | tener (pret.): tuve
    r | Corrige: ¿Vienes con mí? | ¿Vienes conmigo? | con + yo → conmigo
    r | Corrige: ¿Qué es tu número de teléfono? | ¿Cuál es tu número de teléfono? | cuál es + dato
    r | Corrige: Ellos dijieron la verdad. | Ellos dijeron la verdad. / Dijeron la verdad. | -j: dijeron
    r | Corrige: Se lo doy a ella el regalo. | Se lo doy a ella. / Le doy el regalo a ella. | se lo ya reemplaza el regalo
  `);
  D.addMixed('D2.1', 'tiempo', `
    c | Cuando ___ niño, vivía en el campo. | era / fui / soy / sea | etapa: imperfecto
    c | Ayer ___ al médico porque me dolía la garganta. | fui / iba / voy / vaya | acción completa: pretérito
    c | Mientras yo estudiaba, mi hermano ___ la tele. | veía / vio / ve / vea | mientras: imperfecto
    c | ___ las dos de la tarde cuando ocurrió el accidente. | Eran / Fueron / Son / Era | hora: imperfecto
    c | De repente el niño ___ y se rompió el brazo. | se cayó / se caía / se cae / se caiga | de repente: pretérito
  `);
  D.addMixed('D2.1', 'traduccion', `
    t | I was sleeping when the phone rang. | Dormía cuando sonó el teléfono. / Estaba durmiendo cuando sonó el teléfono. | imperfecto + pretérito
    t | I dropped the glass. (unplanned) | Se me cayó el vaso. | se me cayó
    t | When I was little, I was always sick. | Cuando era pequeño, siempre estaba enfermo. / Cuando era pequeña, siempre estaba enferma. / De pequeño, siempre estaba enfermo. / De pequeña, siempre estaba enferma. | hábito: imperfecto
  `);
  D.addMixed('D2.3', 'elige', `
    c | Quiero que tú ___ la mesa. | pongas / pones / poner / pusiste | querer que + subjuntivo
    c | Quiero ___ la mesa. | poner / ponga / pongo / pongas | mismo sujeto: infinitivo
    c | ¡___ la televisión, por favor! (apagar, tú) | Apaga / Apague / Apagas / Apagues | tú afirmativo: apaga
    c | ¡No ___ la televisión! (apagar, tú) | apagues / apagas / apaga / apague | tú negativo: no apagues
    c | ¡___ ustedes aquí! (sentarse) | Siéntense / Siéntanse / Se sientan / Siéntese | ustedes: siéntense
    c | Estudio mucho ___ sacar buenas notas. | para / por / porque / para que | para + infinitivo
    c | Caminamos ___ el parque. | por / para / en por / a | por: a través de
    c | La chica con ___ hablé es mi vecina. | quien / que / lo que / cual | preposición + persona: quien
  `);
  D.addMixed('D2.3', 'error', `
    r | Corrige: Mi madre quiere que yo limpio la casa. | Mi madre quiere que yo limpie la casa. / Mi madre quiere que limpie la casa. | querer que + subjuntivo
    r | Corrige: No hablas tan rápido, por favor. (mandato, tú) | No hables tan rápido, por favor. | negativo: subjuntivo
    r | Corrige: Gracias para la ayuda. | Gracias por la ayuda. | gracias por
    r | Corrige: Lo que casa quiero es grande. | La casa que quiero es grande. | que (no lo que) con antecedente
  `);
  D.addMixed('D2.4', 'elige', `
    c | Me alegro de que ___ buen tiempo. | haga / hace / hacer / hizo | emoción: subjuntivo
    c | Creo que ___ buen tiempo mañana. | hará / haga / hiciera / haya | creer que: indicativo
    c | Dudo que el río ___ limpio. | esté / está / estar / estará | duda: subjuntivo
    c | Vamos a salir cuando ___ de llover. | deje / deja / dejará / dejó | cuando (futuro): subjuntivo
    c | Lo hago para que tú ___ tranquila. | estés / estás / estar / estarás | para que + subjuntivo
  `);
  D.addMixed('D2.5', 'traduccion', `
    t | I'm looking for a bank that's open on Sundays. | Busco un banco que esté abierto los domingos. / Busco un banco que abra los domingos. | cláusula adjetival: subjuntivo
    t | Let's cross the street. | Crucemos la calle. / Vamos a cruzar la calle. | mandato nosotros
    t | The doors are closed. | Las puertas están cerradas. | estar + participio
    t | I hope you (tú) recycle the cans. | Espero que recicles las latas. / Ojalá que recicles las latas. | esperar que + subjuntivo
  `);
  D.addMixed('D2.6', 'tiempo', `
    c | Este año yo ___ mucho. | he viajado / había viajado / viajaba / haya viajado | este año: pretérito perfecto
    c | Cuando llegué, la clase ya ___. | había empezado / ha empezado / empieza / haya empezado | anterior a otra acción pasada: pluscuamperfecto
    c | Me alegro de que tú ___ de fumar. | hayas dejado / has dejado / habías dejado / dejaste ya | emoción + perfecto de subjuntivo
    c | ¿Alguna vez ___ un maratón? | has corrido / habías corrido / corrías / hayas corrido | experiencia: pretérito perfecto
  `);
  D.addMixed('D2.7', 'tiempo', `
    c | Mañana ___ a trabajar temprano. | saldré / saldría / salí / salga | mañana: futuro
    c | El jefe quería que yo ___ el informe. | terminara / termine / termino / terminaré | pasado + influencia: imperfecto de subjuntivo
    c | Para el lunes, ya ___ el proyecto. | habré terminado / habría terminado / he terminado / terminara | para + fecha futura: futuro perfecto
    c | ¿Dónde ___ mis llaves? (I wonder) | estarán / están / estaban / estén | probabilidad: futuro
  `);
  D.addMixed('D2.8', 'tiempo', `
    c | Yo en tu lugar ___ el puesto. | aceptaría / aceptaré / acepté / acepte | consejo hipotético: condicional
    c | Me ___ ir al concierto. | gustaría / gustará / gusté / guste | cortesía: me gustaría
    c | Habríamos ido, pero ___ enfermos. | estábamos / estuvimos ya / estaríamos / estemos | razón de fondo: imperfecto
    c | Ojalá ___ visto la obra. | hubiera / había / habría / haya | ojalá + pluscuamperfecto de subjuntivo
  `);
  D.addMixed('D2.9', 'elige', `
    c | Si ___ dinero, compraría una casa. | tuviera / tengo / tendría / tenga | si + imperfecto de subjuntivo → condicional
    c | Si llueve, ___ en casa. | nos quedaremos / nos quedaríamos / nos quedáramos / nos quedemos | si + presente → futuro
    c | Si hubieras estudiado, ___ el examen. | habrías aprobado / aprobarías / aprobaste / apruebes | si + pluscuamperfecto → condicional perfecto
    c | Es necesario que todos ___. | voten / votan / votar / votarán | es necesario que + subjuntivo
    c | Busco a alguien que ___ chino. | hable / habla / hablar / hablará | antecedente desconocido: subjuntivo
  `);
  D.addMixed('D2.9', 'traduccion', `
    t | If I were president, I would fight for peace. | Si fuera presidente, lucharía por la paz. / Si fuera presidenta, lucharía por la paz. / Si yo fuera presidente, lucharía por la paz. | si + imperfecto de subj. → condicional
    t | It's important that you (tú) vote. | Es importante que votes. | es importante que + subjuntivo
    t | I didn't think that he had told the truth. | No pensé que hubiera dicho la verdad. / No creí que hubiera dicho la verdad. / No creía que hubiera dicho la verdad. | duda (pasado) + pluscuamperfecto de subj.
  `);
  D.addMixed('D3.1', 'elige', `
    c | Mi novio ___ muy cariñoso, pero hoy está de mal humor. | es / está / son / están | personalidad: ser
    c | Llevo tres años ___ español. | estudiando / estudiar / estudiado / estudio | llevar + tiempo + gerundio
    c | Yo ___ en contacto con mis amigos de la escuela. | me mantengo / mantengo me / me mantenga / me mantuve ayer | mantenerse (como tener): me mantengo
    c | Siguen ___ aunque se quieren mucho. | discutiendo / discutir / discuten / discutido | seguir + gerundio
    c | Esa manzana ___ verde: no está madura. | está / es / son / hay | estar verde = unripe
  `);
  D.addMixed('D3.1', 'traduccion', `
    t | My sister is sick of her boyfriend's lies. | Mi hermana está harta de las mentiras de su novio. | estar harto de
    t | We have been going out for a year. | Llevamos un año saliendo. / Salimos desde hace un año. / Hace un año que salimos. | llevar + gerundio / hace… que + presente
    t | He is boring, but today he is bored. | Es aburrido, pero hoy está aburrido. / Él es aburrido, pero hoy está aburrido. | ser aburrido · estar aburrido
  `);
  D.addMixed('D3.2', 'elige', `
    c | ¿Le compraste las entradas a tu hermano? — Sí, ___ compré. | se las / le las / se los / les las | le + las → se las
    c | A mis amigos les ___ los conciertos. | encantan / encanta / encantamos / encantas | encantar + plural
    c | Me ___ dos entradas para el partido. | faltan / falta / falto / faltas | faltar + plural
    c | Ayer ___ en el parque de atracciones. | nos divertimos / nos divertíamos ya / divertimos / nos divirtamos | divertirse (pret.): nos divertimos
    c | ¿Vienes al cine ___? | conmigo / con mí / con yo / mi | con + yo → conmigo
    c | Los aficionados ___ cuando su equipo perdió. | se pusieron tristes / pusieron tristes / se ponían tristes ya / se ponen tristes ayer | ponerse + adjetivo (pret.)
  `);
  D.addMixed('D3.2', 'traduccion', `
    t | I bought the tickets and gave them to my friends. | Compré las entradas y se las di a mis amigos. | se las di
    t | We love going to the circus. | Nos encanta ir al circo. | encantar + infinitivo
    t | Does the noise bother you? (tú) | ¿Te molesta el ruido? | molestar + singular
  `);
  D.addMixed('D3.3', 'tiempo', `
    c | Cuando ___ pequeña, mi abuela me contaba cuentos. | era / fui / soy / sea | etapa: imperfecto
    c | Ayer ___ la casa, hice los mandados y cociné. | limpié / limpiaba / limpio / limpie | serie de acciones: pretérito
    c | Yo ___ la cena cuando llegó mi hermano. | preparaba / preparé / preparo / prepare | en curso: imperfecto
    c | En aquel entonces nadie ___ teléfono móvil. | tenía / tuvo / tiene / tenga | en aquel entonces: imperfecto
    c | Por fin ___ abrir la puerta. | pude / podía / puedo / pueda | poder (pret.) = to manage
    c | ___ a mi mejor amiga en la escuela. (met) | Conocí / Conocía / Conozco / Conociera | conocer (pret.) = to meet
    c | Mi madre quería que yo ___ mi cuarto. | limpiara / limpie / limpio / limpiaba | pasado + influencia: imperfecto de subjuntivo
    c | Me alegro de que ___ conseguir un reembolso. | hayas podido / has podido / pudiste ya / habías podido | emoción + perfecto de subjuntivo
  `);
  D.addMixed('D3.3', 'traduccion', `
    t | I was cooking when my parents arrived. | Cocinaba cuando llegaron mis padres. / Estaba cocinando cuando llegaron mis padres. / Cocinaba cuando mis padres llegaron. / Estaba cocinando cuando mis padres llegaron. | imperfecto + pretérito
    t | My mother wanted me to set the table. | Mi madre quería que pusiera la mesa. / Mi madre quería que yo pusiera la mesa. / Mi madre quería que yo pusiese la mesa. | imperfecto de subjuntivo
    t | We used to go shopping on Saturdays, but yesterday we stayed home. | Íbamos de compras los sábados, pero ayer nos quedamos en casa. / Solíamos ir de compras los sábados, pero ayer nos quedamos en casa. | hábito (imp.) vs. una vez (pret.)
    t | I returned it (the shirt) because it was too big. | La devolví porque era demasiado grande. / La devolví porque me quedaba grande. / La devolví porque estaba demasiado grande. | pretérito + imperfecto (causa)
  `);
  D.addMixed('D3.3', 'error', `
    r | Corrige: Cuando fui niño, jugaba en el parque. | Cuando era niño, jugaba en el parque. | etapa de la vida: imperfecto
    r | Corrige: Ayer barría la casa y después salí. | Ayer barrí la casa y después salí. | acción completa: pretérito
    r | Corrige: El agua hervió en cinco minutos. | El agua hirvió en cinco minutos. | hervir: hirvió
    r | Corrige: Era las tres cuando llegué. | Eran las tres cuando llegué. | las tres → eran
    r | Corrige: Ayer yo averigué el precio. | Ayer yo averigüé el precio. / Ayer averigüé el precio. | -guar: averigüé
  `);
})(typeof window !== 'undefined' ? window : globalThis);
