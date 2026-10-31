(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const { parse, words, vocabItems, conj } = D.lessonKit;

  // Descubre 1, Lecciones 1–9. Themes and grammar follow the publisher's scope and sequence (Contextos and
  // Estructura of each lesson); the word lists are reconstructed from the lesson themes.

  const VOCAB = [
    { id: 'es-en', name: 'es → en', example: 'la palabra → its meaning' },
    { id: 'en-es', name: 'en → es', example: 'the meaning → la palabra' },
  ];

  // groups: [{ id, name, example, text }] · skills: grammar skills · grammar: () => items
  function lesson(id, title, groups, skills, grammar, readings) {
    const list = groups.flatMap((g) => words(g.id, g.text));
    D.addLesson({
      id,
      title,
      skills: [...VOCAB, ...skills],
      groups: groups.map(({ id: gid, name, example }) => ({ id: gid, name, example })),
      build: () => [...vocabItems(id, list), ...grammar()],
      readings,
    });
  }

  const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece',
    'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
    'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta'];

  /* ---------- 1 · Hola, ¿qué tal? ---------- */

  lesson('D1.1', 'Hola, ¿qué tal?', [
    { id: 'saludos', name: 'saludos y despedidas', example: 'hasta luego', text: `
      hola = hello
      buenos días = good morning
      buenas tardes = good afternoon
      buenas noches = good evening; good night
      adiós = goodbye = chau
      hasta luego = see you later
      hasta mañana = see you tomorrow
      hasta pronto = see you soon
      nos vemos = see you
      ¿qué tal? = how are you? (informal) = ¿cómo estás?
      ¿cómo está usted? = how are you? (formal)
      ¿qué pasa? = what's happening?
      ¿qué hay de nuevo? = what's new?
      (muy) bien = (very) well; fine = bien / muy bien
      regular = so-so; OK
      nada = nothing
    ` },
    { id: 'presentaciones', name: 'presentaciones', example: 'mucho gusto', text: `
      ¿cómo te llamas? = what's your name? (informal)
      ¿cómo se llama usted? = what's your name? (formal)
      me llamo = my name is
      ¿de dónde eres? = where are you from? (informal)
      soy de = I'm from
      mucho gusto = pleased to meet you = encantado / encantada
      el gusto es mío = the pleasure is mine
      igualmente = likewise
      le presento a = I would like to introduce you to (formal)
      te presento a = I would like to introduce you to (informal)
    ` },
    { id: 'cortesia', name: 'cortesía y personas', example: 'con permiso', text: `
      por favor = please
      gracias = thank you
      muchas gracias = thank you very much
      de nada = you're welcome = no hay de qué
      perdón = pardon me; excuse me = con permiso
      lo siento = I'm sorry
      el señor = Mr.; sir
      la señora = Mrs.; ma'am
      la señorita = Miss
      el chico = boy
      la chica = girl
      el/la estudiante = student
      el profesor = teacher = la profesora
    ` },
  ], [
    { id: 'articulos', name: 'artículos y plurales', example: 'el mapa, las lecciones' },
    { id: 'numeros', name: 'números 0–30', example: '15 → quince' },
    { id: 'ser', name: 'ser', example: 'soy, eres, es' },
    { id: 'hora', name: 'la hora', example: 'son las dos y media' },
  ], () => [
    ...parse('D1.1', 'articulos', `
      g | ___ diccionario (artículo definido) | el | -o: masculino
      g | ___ palabra (artículo definido) | la | -a: femenino
      g | ___ problema (artículo definido) | el | problema es masculino aunque termina en -a
      g | ___ mapa (artículo definido) | el | mapa es masculino
      g | ___ día (artículo definido) | el | día es masculino
      g | ___ mano (artículo definido) | la | mano es femenino aunque termina en -o
      g | ___ lección (artículo definido) | la | -ción: femenino
      g | ___ televisión (artículo definido) | la | -sión: femenino
      g | ___ programa (artículo definido) | el | -ma (griego): masculino
      g | ___ cuadernos (artículo definido) | los | masculino plural
      g | ___ fotos (artículo definido) | las | la foto (la fotografía): femenino
      g | ___ estudiante (artículo indefinido, chica) | una | el/la estudiante: el artículo dice el género
      g | ___ lápices (artículo indefinido) | unos | masculino plural: unos
      g | ___ maletas (artículo indefinido) | unas | femenino plural: unas
      r | el lápiz → plural | los lápices | z → ces
      r | la lección → plural | las lecciones | pierde la tilde: lecciones
      r | el autobús → plural | los autobuses | pierde la tilde: autobuses
      r | el país → plural | los países | país → países
      r | la nacionalidad → plural | las nacionalidades | consonante → -es
      r | el chico → femenino | la chica | -o → -a
      r | el conductor → femenino | la conductora | -or → -ora
      r | el turista → femenino | la turista | -ista: solo cambia el artículo
      c | ¿Cuál es masculino? | el mapa / la mapa / la problema / el mano | mapa, problema, día, programa: masculinos
    `),
    ...NUM.map((w, n) => ({ id: `D1.1:numeros:${n}`, skill: 'numeros', form: 'gap', prompt: `${n} → ___`, answers: [w] })),
    ...parse('D1.1', 'numeros', `
      g | Diez más cinco son ___. | quince | 10 + 5 = 15
      g | Veinte menos tres son ___. | diecisiete | 20 − 3 = 17
      g | Doce más doce son ___. | veinticuatro | 12 + 12 = 24
      g | Treinta menos ocho son ___. | veintidós | 30 − 8 = 22
      g | Hay ___ (1) chico en la clase. | un | uno → un delante de un sustantivo masculino
      g | Hay ___ (21) estudiantes. | veintiún | veintiuno → veintiún delante de un sustantivo masculino
      g | Hay ___ (1) chica en la clase. | una | uno → una con femenino
      c | ¿Cómo se escribe 16? | dieciséis / diez y seis / dieziséis / diecíseis | 16–19 y 21–29 en una palabra
    `),
    ...conj('D1.1', 'ser', { tense: 'present', verbs: ['ser'] }),
    ...parse('D1.1', 'ser', `
      g | Yo ___ de California. | soy | origen: ser de
      g | ¿De dónde ___ tú? | eres | tú eres
      g | La profesora ___ de España. | es | ella es
      g | Nosotros ___ estudiantes. | somos | ocupación: ser
      g | Ellos ___ mis amigos. | son | ellos son
      g | Las maletas ___ de Pedro. | son | posesión: ser de
      g | ¿Qué ___ eso? — Es un diccionario. | es | es (la cosa)
      c | ¿___ usted la señora Martínez? | Es / Eres / Soy / Son | usted → es
      c | Ustedes ___ de Ecuador, ¿verdad? | son / sois / es / somos | ustedes → son
    `),
    ...parse('D1.1', 'hora', `
      g | 1:00 → ___ la una. | Es | la una: es (singular)
      g | 3:00 → ___ las tres. | Son | las demás horas: son
      g | 2:30 → Son las dos y ___. | media | :30 = y media
      g | 4:15 → Son las cuatro y ___. | cuarto / quince | :15 = y cuarto
      g | 6:45 → Son las siete menos ___. | cuarto / quince | :45 = menos cuarto de la hora siguiente
      g | 9:10 → Son las nueve y ___. | diez | :10 = y diez
      g | 12:00 (día) → Es ___. | mediodía / el mediodía | 12 del día = mediodía
      g | 12:00 (noche) → Es ___. | medianoche / la medianoche | 12 de la noche = medianoche
      g | La clase es ___ las ocho. | a | ¿a qué hora? → a las…
      g | Son las diez de la ___ (10 a.m.). | mañana | a.m. = de la mañana
      g | Son las cuatro de la ___ (4 p.m.). | tarde | tarde: hasta las 6–7 p.m.
      g | Son las once de la ___ (11 p.m.). | noche | noche
      r | 5:20 → escribe la hora | Son las cinco y veinte. | son las + hora + y + minutos
      r | 1:30 → escribe la hora | Es la una y media. | la una: es
      r | 7:40 → escribe la hora | Son las ocho menos veinte. / Son las siete y cuarenta. | menos: los minutos que faltan
      c | ¿Qué hora es? (1:15) | Es la una y cuarto. / Son la una y cuarto. / Es las una y cuarto. / Son las uno y cuarto. | la una → es la una
      c | ¿A qué hora es el examen? | A las nueve. / Son las nueve. / Es las nueve. / En las nueve. | ¿a qué hora? → a las
      t | What time is it? | ¿Qué hora es? | qué hora es
      t | It's two o'clock. | Son las dos. | son las dos
      t | At what time is the class? | ¿A qué hora es la clase? | a qué hora
    `),
  ]);

  /* ---------- 2 · En la clase ---------- */

  lesson('D1.2', 'En la clase', [
    { id: 'clase', name: 'la clase', example: 'la pizarra', text: `
      el borrador = eraser
      la calculadora = calculator
      el escritorio = desk
      el libro = book
      el mapa = map
      la mochila = backpack
      el papel = paper
      la papelera = wastebasket
      la pizarra = blackboard
      la pluma = pen
      la puerta = door
      el reloj = clock; watch
      la silla = chair
      la tiza = chalk
      la ventana = window
      el cuaderno = notebook
      el lápiz = pencil
      el/la compañero/a de clase = classmate = el compañero de clase / la compañera de clase / compañero de clase / compañera de clase
    ` },
    { id: 'lugares', name: 'lugares', example: 'la biblioteca', text: `
      la biblioteca = library
      la cafetería = cafeteria
      el estadio = stadium
      el laboratorio = laboratory
      la librería = bookstore
      la residencia estudiantil = dormitory
      la universidad = university; college
      el examen = test; exam
      el horario = schedule
      la prueba = test; quiz
      la tarea = homework
      el semestre = semester
    ` },
    { id: 'materias', name: 'materias', example: 'la química', text: `
      la administración de empresas = business administration
      el arte = art
      la biología = biology
      la computación = computer science
      la contabilidad = accounting
      la economía = economics
      la física = physics
      la geografía = geography
      la historia = history
      las lenguas extranjeras = foreign languages
      la literatura = literature
      las matemáticas = mathematics
      el periodismo = journalism
      la psicología = psychology
      la química = chemistry
      la sociología = sociology
    ` },
    { id: 'dias', name: 'días', example: 'el miércoles', text: `
      lunes = Monday
      martes = Tuesday
      miércoles = Wednesday
      jueves = Thursday
      viernes = Friday
      sábado = Saturday
      domingo = Sunday
      la semana = week
      hoy = today
      mañana = tomorrow
      ayer = yesterday
    ` },
  ], [
    { id: 'ar', name: 'verbos -ar', example: 'hablo, hablas' },
    { id: 'preguntas', name: 'preguntas', example: '¿dónde?, ¿cuántos?' },
    { id: 'estar', name: 'estar', example: 'estoy en la biblioteca' },
    { id: 'numeros', name: 'números 31 y más', example: '45 → cuarenta y cinco' },
  ], () => [
    ...conj('D1.2', 'ar', { tense: 'present', verbs: ['hablar', 'bailar', 'trabajar', 'estudiar', 'comprar', 'necesitar', 'escuchar', 'llegar', 'buscar', 'viajar', 'cantar', 'desayunar', 'enseñar', 'regresar', 'tomar', 'mirar', 'esperar', 'preparar'] }),
    ...parse('D1.2', 'ar', `
      g | Me gusta ___ (cantar), pero no canto bien. | cantar | después de gustar: infinitivo
      g | ¿Tú ___ (desear) tomar algo? | deseas | tú: -as
      g | Mis compañeros no ___ (trabajar) los domingos. | trabajan | ellos: -an
      g | Nosotros ___ (necesitar) una calculadora. | necesitamos | nosotros: -amos
      t | I study Spanish at the library. | Estudio español en la biblioteca. | yo: -o
      t | Do you dance? (tú) | ¿Bailas? | tú bailas
    `),
    ...parse('D1.2', 'preguntas', `
      c | ¿___ estudias? — En la biblioteca. | Dónde / Cuándo / Cuál / Quién | lugar → dónde
      c | ¿___ llega el autobús? — A las tres. | Cuándo / Dónde / Cuánto / Qué | tiempo → cuándo
      c | ¿___ estudiantes hay en la clase? — Hay veinte. | Cuántos / Cuántas / Cuánto / Qué | estudiantes (masc. plural) → cuántos
      c | ¿___ mochilas compras? — Dos. | Cuántas / Cuántos / Cuál / Cuánta | mochilas (fem. plural) → cuántas
      c | ¿___ es tu profesora? — La señora Ruiz. | Quién / Qué / Cuál / Dónde | persona → quién
      c | ¿___ son tus amigos? — Marta y Luis. | Quiénes / Quién / Cuáles / Qué | personas (plural) → quiénes
      c | ¿___ estudias español? — Porque me gusta. | Por qué / Porque / Para qué / Qué | pregunta: por qué (separado, con tilde)
      c | ¿___ estás? — Muy bien, gracias. | Cómo / Qué / Cuál / Dónde | cómo estás
      c | ¿De ___ eres? — De Chile. | dónde / adónde / cuándo / qué | origen: de dónde
      c | ¿___ vas? — A la cafetería. | Adónde / Dónde / Cuándo / Cómo | movimiento: adónde
      c | ¿___ cuesta el libro? — Veinte dólares. | Cuánto / Cuántos / Qué / Cuál | precio: cuánto
      c | ¿___ estudias? — Biología. | Qué / Cuál / Quién / Cuánto | qué + verbo: definición o cosa
      r | Tú estudias química. (pregunta con inversión) | ¿Estudias tú química? / ¿Estudias química tú? | verbo antes del sujeto
      r | Ellos trabajan los sábados. (pregunta con ¿verdad?) | Ellos trabajan los sábados, ¿verdad? / Ellos trabajan los sábados, ¿no? | tag question: ¿verdad? o ¿no?
      t | Where is the library? | ¿Dónde está la biblioteca? | dónde + estar
      t | How many books are there? | ¿Cuántos libros hay? | cuántos + masculino plural
    `),
    ...conj('D1.2', 'estar', { tense: 'present', verbs: ['estar'] }),
    ...parse('D1.2', 'estar', `
      g | La biblioteca ___ al lado de la cafetería. | está | lugar: estar
      g | ¿Cómo ___ tú? — Estoy bien. | estás | estado: estar
      g | Nosotros ___ en la clase de español. | estamos | lugar: estar
      g | Los libros ___ encima del escritorio. | están | lugar: estar
      g | Yo ___ cerca de la puerta. | estoy | yo estoy
      c | La mochila está ___ la silla (under). | debajo de / encima de / delante de / lejos de | debajo de = under
      c | El mapa está ___ la pizarra (next to). | al lado de / detrás de / dentro de / enfrente de | al lado de = next to
      c | Soy de México, pero ahora ___ en Texas. | estoy / soy / es / están | origen: ser · lugar: estar
    `),
    ...parse('D1.2', 'numeros', `
      g | 31 → ___ | treinta y uno | 31–99: decena + y + unidad
      g | 45 → ___ | cuarenta y cinco | cuarenta y cinco
      g | 58 → ___ | cincuenta y ocho | cincuenta
      g | 67 → ___ | sesenta y siete | sesenta
      g | 74 → ___ | setenta y cuatro | setenta
      g | 89 → ___ | ochenta y nueve | ochenta
      g | 93 → ___ | noventa y tres | noventa
      g | 100 → ___ | cien | 100 exacto: cien
      g | 101 → ___ | ciento uno | 101–199: ciento
      g | 200 → ___ | doscientos | doscientos
      g | 500 → ___ | quinientos | quinientos (irregular)
      g | 700 → ___ | setecientos | setecientos (irregular)
      g | 900 → ___ | novecientos | novecientos (irregular)
      g | 1.000 → ___ | mil | mil (no «un mil»)
      g | 2.000 → ___ | dos mil | mil no cambia en plural
      g | 1.000.000 → ___ | un millón | un millón; dos millones
      g | Hay ___ (300) chicas en la escuela. | trescientas | -cientos concuerda: trescientas chicas
      g | Hay un ___ (1.000.000) de personas. | millón | un millón de + sustantivo
      c | ¿Cómo se dice 2026? | dos mil veintiséis / dos mil y veintiséis / veinte veintiséis / dos miles veintiséis | sin «y» entre mil y las decenas
    `),
  ]);

  /* ---------- 3 · La familia ---------- */

  lesson('D1.3', 'La familia', [
    { id: 'familia', name: 'la familia', example: 'el cuñado', text: `
      el abuelo = grandfather
      la abuela = grandmother
      los abuelos = grandparents
      el bisabuelo = great-grandfather
      el cuñado = brother-in-law
      la cuñada = sister-in-law
      el esposo = husband = el marido
      la esposa = wife
      el hermanastro = stepbrother
      el hermano = brother
      la hermana = sister
      el hijo = son
      la hija = daughter
      los hijos = children
      la madrastra = stepmother
      la madre = mother
      el medio hermano = half-brother
      el nieto = grandson
      la nieta = granddaughter
      la nuera = daughter-in-law
      el padrastro = stepfather
      el padre = father
      los padres = parents
      los parientes = relatives
      el primo = cousin = la prima
      el sobrino = nephew
      la sobrina = niece
      el suegro = father-in-law
      la suegra = mother-in-law
      el tío = uncle
      la tía = aunt
      el yerno = son-in-law
    ` },
    { id: 'gente', name: 'gente y profesiones', example: 'el/la periodista', text: `
      el/la amigo/a = friend = el amigo / la amiga / amigo / amiga
      la gente = people
      el muchacho = boy
      la muchacha = girl
      el/la niño/a = child = el niño / la niña / niño / niña
      el novio = boyfriend
      la novia = girlfriend
      la persona = person
      el/la artista = artist
      el/la doctor(a) = doctor = el doctor / la doctora / doctor / doctora / el médico / la médica
      el/la ingeniero/a = engineer = el ingeniero / la ingeniera / ingeniero / ingeniera
      el/la periodista = journalist
      el/la programador(a) = computer programmer = el programador / la programadora / programador / programadora
    ` },
  ], [
    { id: 'adjetivos', name: 'adjetivos', example: 'las chicas altas' },
    { id: 'posesivos', name: 'posesivos', example: 'mi, tu, su, nuestra' },
    { id: 'er-ir', name: 'verbos -er / -ir', example: 'como, vivimos' },
    { id: 'tener', name: 'tener y venir', example: 'tengo, vienes, tener hambre' },
  ], () => [
    ...parse('D1.3', 'adjetivos', `
      g | Mi hermana es muy ___ (alto). | alta | concuerda en género: alta
      g | Los abuelos son ___ (simpático). | simpáticos | masculino plural
      g | Las primas son ___ (inteligente). | inteligentes | -e: solo número
      g | Mi tía es ___ (trabajador). | trabajadora | -dor → -dora
      g | Los niños son ___ (feliz). | felices | z → ces
      g | Ella es ___ (español). | española | nacionalidad en -l: española
      g | Mis cuñados son ___ (alemán). | alemanes | alemán → alemanes (sin tilde)
      g | Es un ___ (bueno) hombre. | buen | bueno → buen delante de masculino singular
      g | Es una ___ (grande) mujer. | gran | grande → gran delante de un sustantivo singular (= great)
      g | Es el ___ (primero) día de clase. | primer | primero → primer delante de masculino singular
      c | Tengo una casa ___. | roja / rojo / rojas / roja grande | casa → roja (adjetivo de color detrás)
      c | Mis padres son ___. | jóvenes / joven / jóvens / jovenes | joven → jóvenes (con tilde)
      t | My cousins (fem.) are tall and blond. | Mis primas son altas y rubias. | todo en femenino plural
      t | He is a good student. | Es un buen estudiante. | buen delante del sustantivo
    `),
    ...parse('D1.3', 'posesivos', `
      g | (yo) ___ hermanos son altos. | Mis | yo + plural → mis
      g | (tú) ¿Es ___ tía? | tu | tú: tu (sin tilde)
      g | (él) ___ abuela es de Cuba. | Su | él → su
      g | (nosotros) ___ casa es grande. | Nuestra | nuestro concuerda con la cosa: nuestra casa
      g | (nosotros) ___ primos viven en Quito. | Nuestros | nuestros primos
      g | (vosotros) ___ padres son simpáticos. | Vuestros | vosotros → vuestros | vos
      g | (ellos) ___ hijos estudian mucho. | Sus | ellos + plural → sus
      g | (usted) ¿Cómo se llama ___ esposo? | su | usted → su
      c | Marta y yo tenemos un perro. Es ___ perro. | nuestro / nuestra / sus / mi | nosotros, perro masculino
      c | ¿Es la mochila de Juan? — Sí, es ___ mochila. | su / tu / mi / sus | de Juan → su
      c | Señora, ¿___ hijas estudian aquí? | sus / tus / su / vuestras | usted + plural → sus
      t | Our grandparents live in Ecuador. | Nuestros abuelos viven en Ecuador. | nuestros
      t | Her sister is a journalist. | Su hermana es periodista. | su; sin artículo con la profesión
    `),
    ...conj('D1.3', 'er-ir', { tense: 'present', verbs: ['abrir', 'aprender', 'asistir', 'beber', 'comer', 'compartir', 'comprender', 'correr', 'creer', 'deber', 'decidir', 'escribir', 'leer', 'recibir', 'vivir'] }),
    ...parse('D1.3', 'er-ir', `
      g | Nosotros ___ (vivir) en Quito. | vivimos | -ir: -imos
      g | Nosotros ___ (comer) a las dos. | comemos | -er: -emos
      g | Mi hermano ___ (deber) estudiar más. | debe | deber + infinitivo
      g | Mis padres ___ (asistir) a la reunión. | asisten | -ir: ellos -en
      t | I read the newspaper every day. | Leo el periódico todos los días. | leer: leo
      t | Do you (tú) understand? | ¿Comprendes? / ¿Entiendes? | comprender: comprendes
    `),
    ...conj('D1.3', 'tener', { tense: 'present', verbs: ['tener', 'venir'] }),
    ...parse('D1.3', 'tener', `
      g | Quiero agua: ___ sed. (tener, yo) | tengo | tener sed = to be thirsty
      g | Mi abuelo ___ ochenta años. | tiene | edad: tener… años
      g | ¿Tú ___ hambre? | tienes | tener hambre
      g | Nosotros ___ que estudiar. | tenemos | tener que + infinitivo = to have to
      g | Ellos ___ ganas de bailar. | tienen | tener ganas de = to feel like
      g | ¿De dónde ___ tú? — Vengo de la biblioteca. | vienes | venir: vienes
      g | Mis tíos ___ a cenar esta noche. | vienen | venir: vienen
      g | Yo ___ a clase en autobús. | vengo | venir: vengo
      c | Hace mucho calor; ___. | tengo calor / estoy calor / soy calor / hago calor | tener calor = to be hot
      c | No me gusta el avión; ___. | tengo miedo / estoy miedo / tengo frío / tengo prisa | tener miedo = to be afraid
      c | Son las ocho y la clase es a las ocho; ___. | tengo prisa / tengo razón / tengo sueño / tengo suerte | tener prisa = to be in a hurry
      c | Dos más dos son cuatro. — Sí, ___. | tienes razón / eres razón / tienes cuidado / tienes suerte | tener razón = to be right
      t | I'm sleepy. | Tengo sueño. | tener sueño
      t | She is twenty years old. | Tiene veinte años. | tener… años
    `),
  ]);

  /* ---------- 4 · Los pasatiempos ---------- */

  lesson('D1.4', 'Los pasatiempos', [
    { id: 'pasatiempos', name: 'pasatiempos', example: 'pasear en bicicleta', text: `
      andar en patineta = to skateboard
      bucear = to scuba dive
      escalar montañas = to climb mountains
      escribir una carta = to write a letter
      esquiar = to ski
      ganar = to win
      ir de excursión = to go on a hike
      leer el periódico = to read the newspaper
      nadar = to swim
      pasear = to take a walk; to stroll
      pasear en bicicleta = to ride a bicycle
      patinar = to skate
      practicar deportes = to play sports
      tomar el sol = to sunbathe
      ver películas = to watch movies
      visitar monumentos = to visit monuments
      la diversión = fun activity; entertainment
      el fin de semana = weekend
      el pasatiempo = pastime; hobby
      los ratos libres = spare (free) time
      el videojuego = video game
    ` },
    { id: 'deportes', name: 'deportes', example: 'el baloncesto', text: `
      el baloncesto = basketball
      el béisbol = baseball
      el ciclismo = cycling
      el equipo = team
      el esquí = skiing
      el fútbol = soccer
      el fútbol americano = football
      el golf = golf
      el hockey = hockey
      el/la jugador(a) = player = el jugador / la jugadora / jugador / jugadora
      la natación = swimming
      el partido = game; match
      la pelota = ball
      el tenis = tennis
      el vóleibol = volleyball
      deportivo = sports-related
      favorito = favorite
    ` },
    { id: 'ciudad', name: 'lugares en la ciudad', example: 'el gimnasio', text: `
      el café = café
      el centro = downtown
      el cine = movie theater
      el gimnasio = gym
      la iglesia = church
      el lugar = place
      el museo = museum
      el parque = park
      la piscina = swimming pool
      la plaza = city or town square
      el restaurante = restaurant
    ` },
  ], [
    { id: 'ir', name: 'ir e ir a + infinitivo', example: 'voy al cine, vamos a nadar' },
    { id: 'raiz', name: 'cambio de raíz e→ie, o→ue', example: 'quiero, puedo' },
    { id: 'e-i', name: 'cambio de raíz e→i', example: 'pido, sigo' },
    { id: 'yo', name: 'yo irregular', example: 'hago, pongo, salgo' },
  ], () => [
    ...conj('D1.4', 'ir', { tense: 'present', verbs: ['ir'] }),
    ...parse('D1.4', 'ir', `
      g | Los sábados yo ___ al gimnasio. | voy | ir: voy
      g | ¿Adónde ___ tú? | vas | ir: vas
      g | Nosotros ___ a nadar esta tarde. | vamos | ir a + infinitivo: futuro cercano
      g | Mis amigos ___ a ver una película. | van | ellos van a…
      g | Vamos ___ museo. | al | a + el → al
      g | Voy ___ la piscina. | a | a + la: no se contrae
      g | ¡___ a bailar! (Let's dance!) | Vamos | vamos a + infinitivo = let's
      r | Juego al tenis. (mañana: ir a + infinitivo) | Voy a jugar al tenis. | ir a + infinitivo
      r | Ellos patinan en el parque. (ir a + infinitivo) | Ellos van a patinar en el parque. / Van a patinar en el parque. | van a patinar
      t | We are going to the movies. | Vamos al cine. | a + el = al
      t | Are you going to swim? (tú) | ¿Vas a nadar? | vas a + infinitivo
    `),
    ...conj('D1.4', 'raiz', { tense: 'present', verbs: ['cerrar', 'comenzar', 'empezar', 'entender', 'pensar', 'perder', 'preferir', 'querer', 'almorzar', 'contar', 'dormir', 'encontrar', 'mostrar', 'poder', 'recordar', 'volver', 'jugar'] }),
    ...parse('D1.4', 'raiz', `
      g | El partido ___ (empezar) a las ocho. | empieza | e→ie: empieza
      g | Nosotros ___ (querer) ir al parque. | queremos | nosotros: sin cambio
      g | ¿Tú ___ (poder) jugar hoy? | puedes | o→ue: puedes
      g | Mi hermano ___ (jugar) al fútbol. | juega | jugar: u→ue
      g | Yo ___ (pensar) ir al museo. | pienso | pensar + infinitivo = to plan to
      g | ¿A qué hora ___ (volver) ustedes? | vuelven | o→ue: vuelven
      t | I prefer to swim. | Prefiero nadar. | preferir: prefiero
      t | We can't sleep. | No podemos dormir. | poder: podemos (sin cambio)
    `),
    ...conj('D1.4', 'e-i', { tense: 'present', verbs: ['conseguir', 'decir', 'pedir', 'repetir', 'seguir'] }),
    ...parse('D1.4', 'e-i', `
      g | Yo siempre ___ (pedir) pizza. | pido | e→i: pido
      g | ¿Tú ___ (conseguir) entradas? | consigues | conseguir: consigues
      g | Ella ___ (decir) la verdad. | dice | decir: e→i
      g | Nosotros ___ (seguir) al equipo. | seguimos | nosotros: sin cambio
      g | Yo ___ (seguir) las instrucciones. | sigo | seguir: sigo (gu → g)
      g | Yo ___ (decir) que sí. | digo | decir: digo (-go y e→i)
    `),
    ...conj('D1.4', 'yo', { tense: 'present', verbs: ['hacer', 'poner', 'salir', 'suponer', 'traer', 'oír', 'ver'], persons: [0, 1, 2, 3, 5] }),
    ...parse('D1.4', 'yo', `
      g | Yo ___ (hacer) la tarea por la noche. | hago | hacer: hago
      g | Yo ___ (poner) la mochila en la silla. | pongo | poner: pongo
      g | Los viernes yo ___ (salir) con mis amigos. | salgo | salir: salgo
      g | Yo ___ (traer) la pelota. | traigo | traer: traigo
      g | Yo no ___ (oír) nada. | oigo | oír: oigo
      g | Yo ___ (ver) películas los sábados. | veo | ver: veo
      g | Yo ___ (suponer) que sí. | supongo | suponer: supongo
      g | ¿Tú ___ (oír) la música? | oyes | oír: oyes (y)
      c | Yo ___ del gimnasio a las seis. | salgo / salo / sale / salgo de | salir: salgo
    `),
  ]);

  /* ---------- 5 · Las vacaciones ---------- */

  lesson('D1.5', 'Las vacaciones', [
    { id: 'viaje', name: 'viajes', example: 'el pasaje de ida y vuelta', text: `
      acampar = to camp
      confirmar una reservación = to confirm a reservation
      estar de vacaciones = to be on vacation
      hacer las maletas = to pack (one's suitcases)
      hacer un viaje = to take a trip
      ir de compras = to go shopping
      ir de vacaciones = to go on vacation
      ir en autobús = to go by bus
      jugar a las cartas = to play cards
      montar a caballo = to ride a horse
      pescar = to fish
      sacar fotos = to take photos
      el aeropuerto = airport
      la agencia de viajes = travel agency
      el equipaje = luggage
      la estación de autobuses = bus station
      la llegada = arrival
      el pasaje (de ida y vuelta) = (round-trip) ticket
      el pasaporte = passport
      la playa = beach
      la salida = departure; exit
      el/la viajero/a = traveler = el viajero / la viajera / viajero / viajera
    ` },
    { id: 'hotel', name: 'el hotel', example: 'la habitación doble', text: `
      el ascensor = elevator
      la cama = bed
      el/la empleado/a = employee = el empleado / la empleada / empleado / empleada
      la habitación individual = single room
      la habitación doble = double room
      el hotel = hotel
      el/la huésped = guest
      la llave = key
      el piso = floor (of a building)
      la planta baja = ground floor
    ` },
    { id: 'tiempo', name: 'tiempo y estaciones', example: 'hace fresco', text: `
      la primavera = spring
      el verano = summer
      el otoño = fall; autumn
      el invierno = winter
      enero = January
      febrero = February
      marzo = March
      abril = April
      mayo = May
      junio = June
      julio = July
      agosto = August
      septiembre = September
      octubre = October
      noviembre = November
      diciembre = December
      está nublado = it's cloudy
      hace buen tiempo = the weather is good
      hace calor = it's hot
      hace fresco = it's cool
      hace frío = it's cold
      hace sol = it's sunny
      hace viento = it's windy
      llueve = it's raining
      nieva = it's snowing
    ` },
    { id: 'ordinales', name: 'ordinales', example: 'tercer', text: `
      primero = first
      segundo = second
      tercero = third
      cuarto = fourth
      quinto = fifth
      sexto = sixth
      séptimo = seventh
      octavo = eighth
      noveno = ninth
      décimo = tenth
    ` },
  ], [
    { id: 'emociones', name: 'estar + emociones', example: 'estoy cansado' },
    { id: 'progresivo', name: 'presente progresivo', example: 'estoy leyendo' },
    { id: 'ser-estar', name: 'ser y estar', example: 'es alto · está cansado' },
    { id: 'od', name: 'objeto directo', example: 'lo, la, los, las' },
  ], () => [
    ...parse('D1.5', 'emociones', `
      g | Después del viaje, nosotros ___ (estar) cansados. | estamos | estado: estar + adjetivo
      g | Mi madre ___ (estar) preocupada porque no llamo. | está | emoción: estar
      g | ¿Por qué ___ (estar) tú tan contento? | estás | estar contento
      g | Las chicas están ___ (aburrido). | aburridas | concuerda: aburridas
      g | La puerta está ___ (abierto). | abierta | estado: abierta
      c | Tengo examen mañana; estoy ___. | nervioso / nerviosa de / feliz de / alegre de | nervioso = nervous
      c | Mi novia se fue; estoy ___. | triste / tristes / avergonzada de / ordenados | triste = sad
      c | No hay nada que hacer; estoy ___. | aburrido / aburrida de / cómodo de / listo de | aburrido = bored
      c | La habitación está ___: todo en su lugar. | ordenada / desordenada / sucia / cansada | ordenado = neat
      t | We are happy. | Estamos contentos. / Estamos felices. / Estamos alegres. | estar + emoción
      t | Are you (tú) tired? | ¿Estás cansado? / ¿Estás cansada? | estar cansado
      t | The windows are closed. | Las ventanas están cerradas. | estado: cerradas
    `),
    ...conj('D1.5', 'progresivo', { tense: 'gerund', verbs: ['hablar', 'comer', 'escribir', 'leer', 'dormir', 'pedir', 'decir', 'jugar', 'hacer', 'oír', 'traer', 'nadar', 'pescar', 'acampar', 'esquiar', 'servir', 'seguir', 'creer'] }),
    ...parse('D1.5', 'progresivo', `
      r | Juego a las cartas. (ahora mismo: progresivo) | Estoy jugando a las cartas. | estar + gerundio
      r | Ellos leen en la playa. (progresivo) | Ellos están leyendo en la playa. / Están leyendo en la playa. | leer → leyendo
      r | ¿Duermes? (progresivo) | ¿Estás durmiendo? | dormir → durmiendo (o→u)
      r | Pedimos la cuenta. (progresivo) | Estamos pidiendo la cuenta. | pedir → pidiendo (e→i)
      c | ¿Qué estás haciendo? — ___. | Estoy sacando fotos. / Saco fotos ayer. / Estoy saco fotos. / Soy sacando fotos. | estar + gerundio
      t | It's raining. | Está lloviendo. / Llueve. | llover → lloviendo
      t | We are fishing. | Estamos pescando. | estar + pescando
    `),
    ...parse('D1.5', 'ser-estar', `
      c | Mi hermana ___ muy alta. | es / está / son / están | característica: ser
      c | La comida ___ fría. | está / es / son / están | estado: estar
      c | ¿Dónde ___ el hotel? | está / es / son / hay | lugar de una cosa: estar
      c | La fiesta ___ en el hotel. | es / está / hay / son | lugar de un evento: ser
      c | Hoy ___ martes. | es / está / son / hay | fecha y día: ser
      c | ___ las cuatro de la tarde. | Son / Están / Es / Hay | la hora: ser
      c | Los pasaportes ___ de Ana. | son / están / es / hay | posesión: ser de
      c | Nosotros ___ estudiantes. | somos / estamos / son / es | ocupación: ser
      c | Mis padres ___ de vacaciones. | están / son / es / hay | estar de vacaciones
      c | Yo ___ enfermo hoy. | estoy / soy / es / está | salud: estar
      c | La maleta ___ de cuero. | es / está / son / hay | material: ser de
      c | Ella ___ hablando por teléfono. | está / es / son / hay | progresivo: estar + gerundio
      c | El examen ___ difícil. | es / está / son / están | característica: ser
      c | ¡Qué bonita ___ hoy, Marta! | estás / eres / es / está | cambio de apariencia: estar
      c | Mi amiga ___ muy lista (smart). | es / está / son / están | ser listo = smart; estar listo = ready
      c | ¿___ listos para salir? | Están / Son / Es / Hay | estar listo = ready
      g | El aeropuerto ___ lejos del centro. | está | lugar: estar
      g | Juan ___ muy simpático. | es | personalidad: ser
    `),
    ...parse('D1.5', 'od', `
      g | ¿Tienes el pasaporte? — Sí, ___ tengo. | lo | el pasaporte → lo
      g | ¿Haces las maletas? — Sí, ___ hago ahora. | las | las maletas → las
      g | ¿Confirmas la reservación? — Sí, ___ confirmo. | la | la reservación → la
      g | ¿Compraste los pasajes? — No, no ___ compré. | los | los pasajes → los
      g | ¿Me llamas mañana? — Sí, ___ llamo. | te | me → te
      g | ¿Nos visitas en julio? — Sí, ___ visito. | los / las | nos → los / las
      g | ¿Ves a Carmen? — Sí, ___ veo. | la | a Carmen → la
      r | Voy a sacar fotos. (fotos → pronombre, al final) | Voy a sacarlas. | pegado al infinitivo
      r | Voy a sacar fotos. (pronombre delante) | Las voy a sacar. | delante del verbo conjugado
      r | Estoy escribiendo la postal. (pronombre al final) | Estoy escribiéndola. | gerundio + la, con tilde
      r | Estoy escribiendo la postal. (pronombre delante) | La estoy escribiendo. | delante de estar
      t | I see them (masc.). | Los veo. | los
      t | We have it (fem.). | La tenemos. | la
    `),
  ]);

  /* ---------- 6 · ¡De compras! ---------- */

  lesson('D1.6', '¡De compras!', [
    { id: 'ropa', name: 'la ropa', example: 'la falda', text: `
      el abrigo = coat
      los bluejeans = jeans
      la blusa = blouse
      la bolsa = purse; bag
      la bota = boot
      los calcetines = socks
      la camisa = shirt
      la camiseta = t-shirt
      la cartera = wallet
      la chaqueta = jacket
      el cinturón = belt
      la corbata = tie
      la falda = skirt
      las gafas (de sol) = (sun)glasses
      los guantes = gloves
      el impermeable = raincoat
      las medias = pantyhose; stockings
      los pantalones = pants
      los pantalones cortos = shorts
      el sombrero = hat
      el suéter = sweater
      el traje = suit
      el traje de baño = bathing suit
      el vestido = dress
      los zapatos de tenis = sneakers
    ` },
    { id: 'compras', name: 'de compras', example: 'regatear', text: `
      el almacén = department store
      la caja = cash register
      el centro comercial = shopping mall
      el/la cliente/a = customer = el cliente / la clienta / cliente / clienta
      el/la dependiente/a = clerk = el dependiente / la dependienta / dependiente / dependienta
      el dinero = money
      (en) efectivo = cash
      el mercado (al aire libre) = (open-air) market
      el precio (fijo) = (fixed; set) price
      la rebaja = sale
      el regalo = gift
      la tarjeta de crédito = credit card
      la tienda = shop; store
      costar = to cost
      gastar = to spend (money)
      hacer juego (con) = to match (with)
      llevar = to wear; to take
      pagar = to pay
      regatear = to bargain
      usar = to wear; to use
      vender = to sell
      barato = cheap
      caro = expensive
      corto = short (in length)
      largo = long
      elegante = elegant
      loco = crazy
    ` },
    { id: 'colores', name: 'colores', example: 'anaranjado', text: `
      amarillo = yellow
      anaranjado = orange
      azul = blue
      blanco = white
      gris = gray
      marrón = brown = café
      morado = purple
      negro = black
      rojo = red
      rosado = pink
      verde = green
    ` },
  ], [
    { id: 'saber-conocer', name: 'saber y conocer', example: 'sé nadar · conozco a Ana' },
    { id: 'oi', name: 'objeto indirecto', example: 'le compro, les doy' },
    { id: 'preterito', name: 'pretérito regular', example: 'compré, vendiste' },
    { id: 'demostrativos', name: 'demostrativos', example: 'este, esa, aquellos' },
  ], () => [
    ...conj('D1.6', 'saber-conocer', { tense: 'present', verbs: ['saber', 'conocer'] }),
    ...parse('D1.6', 'saber-conocer', `
      c | ¿___ (tú) a la dependienta? | Conoces / Sabes / Conoce / Sabe | conocer: personas
      c | Yo no ___ cuánto cuesta. | sé / conozco / sabe / conoce | saber: información
      c | Mi hermana ___ regatear muy bien. | sabe / conoce / sé / conozco | saber + infinitivo = to know how to
      c | Nosotros ___ un mercado muy bueno. | conocemos / sabemos / conozco / sé | conocer: lugares
      c | ¿___ ustedes dónde está la caja? | Saben / Conocen / Sabe / Conoce | saber dónde…
      c | Yo ___ Lima muy bien: viví allí dos años. | conozco / sé / conoce / sabe | conocer un lugar
      g | Yo ___ (conocer) a tu hermano. | conozco | conocer: conozco
      g | Yo ___ (saber) tu número de teléfono. | sé | saber: sé (con tilde)
      g | Ella ___ (traducir) del inglés. | traduce | traducir: traduzco, traduces, traduce
      g | Yo ___ (conducir) al centro comercial. | conduzco | conducir: conduzco
      g | Yo te ___ (ofrecer) un precio fijo. | ofrezco | ofrecer: ofrezco
      t | Do you (tú) know how to swim? | ¿Sabes nadar? | saber + infinitivo
      t | I know Mexico City. | Conozco la Ciudad de México. / Conozco Ciudad de México. | conocer un lugar
    `),
    ...parse('D1.6', 'oi', `
      g | Yo ___ compro un regalo a mi madre. | le | a mi madre → le
      g | La dependienta ___ muestra los zapatos a nosotros. | nos | a nosotros → nos
      g | ¿___ das el dinero a tus hermanos? | Les | a tus hermanos → les
      g | Mi abuela ___ regala un suéter a mí. | me | a mí → me
      g | ¿Quién ___ vende la ropa a ti? | te | a ti → te
      g | El cliente ___ paga al dependiente. | le | al dependiente → le
      r | Voy a comprarle una corbata a papá. (pronombre delante) | Le voy a comprar una corbata a papá. | delante del verbo conjugado
      r | Les estoy escribiendo a mis primos. (pronombre detrás) | Estoy escribiéndoles a mis primos. | gerundio + les, con tilde
      c | ¿Qué ___ vas a regalar a tus padres? | les / los / le / se | les: objeto indirecto plural
      t | I give her a gift. | Le doy un regalo. | dar: le doy
      t | They sell us clothes. | Nos venden ropa. | nos
    `),
    ...conj('D1.6', 'preterito', { tense: 'preterite', verbs: ['comprar', 'gastar', 'pagar', 'regatear', 'usar', 'vender', 'abrir', 'comer', 'escribir', 'vivir', 'llegar', 'buscar', 'empezar', 'practicar', 'leer', 'creer', 'oír'] }),
    ...parse('D1.6', 'preterito', `
      g | Ayer yo ___ (pagar) con tarjeta de crédito. | pagué | -gar: yo -gué
      g | Ayer yo ___ (buscar) una falda negra. | busqué | -car: yo -qué
      g | Anoche yo ___ (empezar) a leer el libro. | empecé | -zar: yo -cé
      g | Ella ___ (leer) el periódico. | leyó | leer: leyó (y)
      g | Ellos ___ (oír) la noticia. | oyeron | oír: oyeron
      g | La semana pasada nosotros ___ (vender) el coche. | vendimos | -er: -imos
      g | ¿___ (comprar) tú los zapatos? | Compraste | tú: -aste
      c | Anoche yo ___ hasta las diez. | estudié / estudie / estudió / estudio | yo: -é con tilde
      t | I spent a lot of money. | Gasté mucho dinero. | gastar: gasté
      t | Did you (tú) see the sale? | ¿Viste la rebaja? | ver: viste
    `),
    ...parse('D1.6', 'demostrativos', `
      g | ___ (this) camisa es muy cara. | Esta | este, esta: cerca de mí
      g | ___ (these) zapatos son baratos. | Estos | estos: masculino plural
      g | ¿Te gusta ___ (that) falda? | esa | ese, esa: cerca de ti
      g | ___ (those) pantalones son elegantes. | Esos | esos: masculino plural
      g | ___ (that over there) tienda vende sombreros. | Aquella | aquella: lejos
      g | ___ (those over there) chicos son mis primos. | Aquellos | aquellos: lejos, masculino plural
      c | No quiero este suéter; quiero ___. | ese / esa / eso / esos | pronombre: ese (suéter)
      c | ¿Qué es ___? — Es un regalo. | esto / este / esta / estos | cosa desconocida: esto (neutro)
      c | ___ es muy interesante (what you said). | Eso / Ese / Esa / Esos | idea: eso (neutro)
      c | Prefiero estas botas, no ___ de allá. | aquellas / aquellos / esas de / estas | aquellas (botas)
      t | I like this jacket. | Me gusta esta chaqueta. | esta
      t | Those (over there) stores are expensive. | Aquellas tiendas son caras. | aquellas
    `),
  ]);

  /* ---------- 7 · La rutina diaria ---------- */

  lesson('D1.7', 'La rutina diaria', [
    { id: 'rutina', name: 'la rutina', example: 'despertarse', text: `
      acostarse = to go to bed
      afeitarse = to shave
      bañarse = to take a bath
      cepillarse el pelo = to brush one's hair
      cepillarse los dientes = to brush one's teeth
      despertarse = to wake up
      dormirse = to go to sleep; to fall asleep
      ducharse = to shower
      lavarse la cara = to wash one's face
      levantarse = to get up
      maquillarse = to put on makeup
      peinarse = to comb one's hair
      ponerse = to put on
      secarse = to dry oneself
      quitarse = to take off
      vestirse = to get dressed
    ` },
    { id: 'bano', name: 'el baño', example: 'la toalla', text: `
      el baño = bathroom = el cuarto de baño
      el champú = shampoo
      la crema de afeitar = shaving cream
      la ducha = shower
      el espejo = mirror
      el inodoro = toilet
      el jabón = soap
      el lavabo = sink
      el maquillaje = makeup
      la pasta de dientes = toothpaste
      la toalla = towel
      el despertador = alarm clock
      las pantuflas = slippers
    ` },
    { id: 'tiempo', name: 'expresiones de tiempo', example: 'por la mañana', text: `
      antes (de) = before
      después = afterwards
      después (de) = after
      durante = during
      entonces = then; so
      luego = later
      por la mañana = in the morning
      por la noche = at night
      por la tarde = in the afternoon; in the evening
      por último = finally
    ` },
  ], [
    { id: 'reflexivos', name: 'verbos reflexivos', example: 'me levanto, se ducha' },
    { id: 'negativos', name: 'indefinidos y negativos', example: 'nadie, nunca, algo' },
    { id: 'ser-ir', name: 'pretérito de ser e ir', example: 'fui, fue, fueron' },
    { id: 'gustar', name: 'verbos como gustar', example: 'me encanta, te falta' },
  ], () => [
    ...conj('D1.7', 'reflexivos', { tense: 'present', verbs: ['levantarse', 'acostarse', 'despertarse', 'ducharse', 'afeitarse', 'vestirse', 'peinarse', 'maquillarse', 'lavarse', 'sentarse', 'ponerse', 'quedarse', 'irse', 'dormirse'] }),
    ...parse('D1.7', 'reflexivos', `
      g | Yo ___ (cepillarse) los dientes después de comer. | me cepillo | yo: me
      g | Ellas ___ (maquillarse) antes de salir. | se maquillan | ellas: se
      g | Nosotros ___ (despertarse) a las siete. | nos despertamos | nosotros: nos (sin cambio de raíz)
      r | Voy a ducharme. (pronombre delante) | Me voy a duchar. | delante del verbo conjugado
      r | Me estoy vistiendo. (pronombre detrás) | Estoy vistiéndome. | gerundio + me, con tilde
      c | Primero ___ y después me visto. | me ducho / ducho / me duchas / se ducho | reflexivo: me ducho
      c | Ana ___ a su hijo. | baña / se baña / me baña / se bañan | bañar a otra persona: sin se
      c | Ana ___ antes de dormir. | se baña / baña / me baña / se bañan | bañarse uno mismo: se
      t | I get up at six. | Me levanto a las seis. | levantarse
      t | Do you (tú) shave every day? | ¿Te afeitas todos los días? | afeitarse
    `),
    ...parse('D1.7', 'negativos', `
      g | No hay ___ (nobody) en el baño. | nadie | no… nadie
      g | ¿Quieres ___ (something)? | algo | algo = something
      g | No quiero ___ (nothing). | nada | no… nada (doble negación)
      g | Yo ___ (never) me maquillo. | nunca / jamás | nunca delante del verbo: sin no
      g | No me levanto temprano ___ (never). | nunca / jamás | no + verbo + nunca
      g | ¿Tienes ___ (some) champú? | algún | alguno → algún delante de masculino singular
      g | No tengo ___ (no) toalla. | ninguna | ninguna (singular)
      g | No hay ___ (no) libro aquí. | ningún | ninguno → ningún delante de masculino singular
      g | A mí no me gusta. — A mí ___. | tampoco | negativo + negativo: tampoco
      g | A mí me gusta. — A mí ___. | también | afirmativo: también
      g | No me ducho ___ me baño. (nor) | ni | no… ni
      c | ¿Alguien llamó? — No, ___ llamó. | nadie / alguien / ninguno / nada | nadie
      c | ¿Siempre te levantas tarde? — No, ___. | nunca / siempre / algo / alguien | nunca
      t | I don't want anything. | No quiero nada. | doble negación
      t | Nobody is here. | No hay nadie aquí. / Nadie está aquí. / No está nadie aquí. | nadie
    `),
    ...conj('D1.7', 'ser-ir', { tense: 'preterite', verbs: ['ser', 'ir'] }),
    ...parse('D1.7', 'ser-ir', `
      c | Ayer ___ al cine. ¿Ser o ir? | ir / ser | fui + a + lugar: ir
      c | La película ___ muy buena. ¿Ser o ir? | ser / ir | fue + adjetivo: ser
      c | Mis padres ___ profesores. ¿Ser o ir? | ser / ir | fueron + profesión: ser
      c | Nosotros ___ a la playa en julio. ¿Ser o ir? | ir / ser | fuimos a: ir
      g | El año pasado yo ___ (ir) a Perú. | fui | ir: fui
      g | ¿Cómo ___ (ser) el viaje? | fue | ser: fue
      g | ¿Adónde ___ (ir) tú ayer? | fuiste | ir: fuiste
      g | Las vacaciones ___ (ser) fantásticas. | fueron | ser: fueron
      t | We went to the market. | Fuimos al mercado. | ir: fuimos
      t | It was a good day. | Fue un buen día. | ser: fue
    `),
    ...parse('D1.7', 'gustar', `
      g | A mí ___ (encantar) las pantuflas. | me encantan | encantar + plural
      g | A Juan ___ (importar) la ropa. | le importa | importar + singular
      g | ¿A ti ___ (molestar) el ruido? | te molesta | molestar + singular
      g | A nosotros ___ (faltar) jabón. | nos falta | faltar + singular
      g | A mis hermanos ___ (aburrir) los museos. | les aburren | aburrir + plural
      g | A ella ___ (fascinar) bailar. | le fascina | infinitivo: singular
      g | A mí no ___ (gustar) levantarme temprano. | me gusta | infinitivo: singular
      c | A ustedes ___ las películas de terror. | les interesan / les interesa / le interesan / los interesan | ustedes → les; plural → interesan
      c | ___ me encanta el chocolate. | A mí / Mí / Yo / A me | a mí (énfasis)
      t | I like the shower. | Me gusta la ducha. | gustar + singular
      t | We are missing two towels. | Nos faltan dos toallas. | faltar + plural
      t | Do you (tú) like to sleep late? | ¿Te gusta dormir tarde? / ¿Te gusta levantarte tarde? | gustar + infinitivo
    `),
  ]);

  /* ---------- 8 · La comida ---------- */

  lesson('D1.8', 'La comida', [
    { id: 'comida', name: 'la comida', example: 'el pollo asado', text: `
      el arroz = rice
      el atún = tuna
      el bistec = steak
      los camarones = shrimp
      la carne = meat
      la carne de res = beef
      la chuleta (de cerdo) = (pork) chop
      los espárragos = asparagus
      los frijoles = beans
      la hamburguesa = hamburger
      el huevo = egg
      el jamón = ham
      la langosta = lobster
      la lechuga = lettuce
      la mantequilla = butter
      la manzana = apple
      los mariscos = shellfish
      la naranja = orange
      el pan (tostado) = (toasted) bread
      las papas fritas = fried potatoes; French fries
      el pavo = turkey
      el pescado = fish
      el pollo (asado) = (roast) chicken
      el queso = cheese
      el salmón = salmon
      la sopa = soup
      el tomate = tomato
      la uva = grape
      la zanahoria = carrot
      el agua (mineral) = (mineral) water
      la bebida = drink
      el café = coffee
      la cerveza = beer
      el jugo (de fruta) = (fruit) juice
      la leche = milk
      el refresco = soft drink
      el vino (blanco/tinto) = (white/red) wine = el vino blanco / el vino tinto / el vino
    ` },
    { id: 'restaurante', name: 'en el restaurante', example: 'el/la camarero/a', text: `
      el/la camarero/a = waiter = el camarero / la camarera / camarero / camarera / el mesero / la mesera
      la comida = food; meal
      el/la dueño/a = owner = el dueño / la dueña / dueño / dueña
      el menú = menu
      la sección de (no) fumar = (non) smoking section
      el almuerzo = lunch
      la cena = dinner
      el desayuno = breakfast
      los entremeses = hors d'oeuvres; appetizers
      el plato (principal) = (main) dish
      delicioso = delicious
      rico = tasty = sabroso
      almorzar = to have lunch
      escoger = to choose
      merendar = to snack
      morir = to die
      pedir = to order (food)
      probar = to taste; to try
      recomendar = to recommend
      servir = to serve
    ` },
  ], [
    { id: 'pret-raiz', name: 'pretérito con cambio de raíz', example: 'pidió, durmieron' },
    { id: 'dobles', name: 'dobles pronombres', example: 'se lo, me la' },
    { id: 'comparar', name: 'comparaciones y superlativos', example: 'más rico que, el mejor' },
  ], () => [
    ...conj('D1.8', 'pret-raiz', { tense: 'preterite', verbs: ['pedir', 'servir', 'repetir', 'seguir', 'conseguir', 'preferir', 'dormir', 'morir', 'vestirse', 'sentirse', 'divertirse'], persons: [0, 2, 3, 5] }),
    ...parse('D1.8', 'pret-raiz', `
      g | El camarero ___ (servir) la sopa. | sirvió | -ir e→i en él/ellos: sirvió
      g | Ellos ___ (pedir) langosta. | pidieron | pidieron
      g | Yo ___ (pedir) pollo asado. | pedí | yo: sin cambio
      g | Mi abuelo ___ (dormir) la siesta. | durmió | o→u: durmió
      g | Los niños ___ (preferir) las papas fritas. | prefirieron | e→i: prefirieron
      g | ¿Qué ___ (pedir) tú? | pediste | tú: sin cambio
      c | ¿Quién ___ el vino? | sirvió / servió / sirvío / servió el | servir → sirvió
      t | She ordered the salmon. | Pidió el salmón. | pidió
      t | They slept well. | Durmieron bien. | durmieron
    `),
    ...parse('D1.8', 'dobles', `
      r | El camarero me sirve el café. (dobles pronombres) | El camarero me lo sirve. / Me lo sirve. | el café → lo
      r | Le doy la carta a Ana. (dobles pronombres) | Se la doy. | le + la → se la
      r | Les recomiendo los mariscos. (dobles pronombres) | Se los recomiendo. | les + los → se los
      r | Nos traen las bebidas. (dobles pronombres) | Nos las traen. | nos + las
      r | Te preparo la cena. (dobles pronombres) | Te la preparo. | te + la
      r | Voy a pedirle el menú al camarero. (dobles pronombres, al final) | Voy a pedírselo. | infinitivo + se + lo, con tilde
      r | Le estoy sirviendo la sopa. (dobles pronombres, delante) | Se la estoy sirviendo. | se la delante de estar
      g | ¿Me pasas la sal? — Sí, ___ paso. | te la | me → te; la sal → la
      g | ¿Le diste el dinero al dueño? — Sí, ___ di. | se lo | le + lo → se lo
      g | ¿Les sirvieron las uvas a los niños? — Sí, ___ sirvieron. | se las | les + las → se las
      c | ¿Quién te recomendó el restaurante? — Mi tía ___ recomendó. | me lo / se lo / te lo / me la | te → me; el restaurante → lo
      t | I give it (masc.) to him. | Se lo doy. | le + lo → se lo
    `),
    ...parse('D1.8', 'comparar', `
      g | El bistec es ___ (more expensive than) el pollo. | más caro que | más + adjetivo + que
      g | La sopa es ___ (as tasty as) la ensalada. | tan rica como / tan sabrosa como | tan + adjetivo + como
      g | Tengo ___ (as much hunger as) tú. | tanta hambre como | tanto/a + sustantivo + como (el hambre: femenino)
      g | Comí ___ (as many potatoes as) mi hermano. | tantas papas como | tantas + sustantivo + como
      g | Este restaurante es ___ (better) que el otro. | mejor | bueno → mejor
      g | El servicio es ___ (worse) que antes. | peor | malo → peor
      g | Mi hermano es ___ (older) que yo. | mayor | edad: mayor
      g | Mi prima es ___ (younger) que yo. | menor | edad: menor
      g | Es el plato ___ (most delicious) del menú. | más delicioso | superlativo: el más… de
      g | Este pastel está ___ (super rico). | riquísimo | rico → riquísimo (c → qu)
      g | La comida está ___ (extremely good). | buenísima | -ísimo/a
      g | Hay ___ de diez platos (more than). | más | más de + número
      c | Este café es ___ del mundo. | el mejor / el más bueno que / mejor de / el mejor que | el mejor de
      c | Ana come ___ yo (as much as). | tanto como / tan como / tanta como / tantos como | verbo + tanto como
      t | Fish is healthier than meat. | El pescado es más sano que la carne. | más… que
      t | She is the best waitress in the restaurant. | Es la mejor camarera del restaurante. / Es la mejor mesera del restaurante. | la mejor… del
    `),
  ]);

  /* ---------- 9 · Las fiestas ---------- */

  lesson('D1.9', 'Las fiestas', [
    { id: 'fiestas', name: 'fiestas', example: 'brindar', text: `
      la alegría = happiness
      el aniversario (de bodas) = (wedding) anniversary
      la boda = wedding
      el cumpleaños = birthday
      el día de fiesta = holiday
      la fiesta = party
      el/la invitado/a = guest = el invitado / la invitada / invitado / invitada
      la Navidad = Christmas
      la quinceañera = young woman celebrating her fifteenth birthday
      la sorpresa = surprise
      brindar = to toast (drink)
      celebrar = to celebrate
      cumplir años = to have a birthday
      dejar una propina = to leave a tip
      divertirse = to have fun
      invitar = to invite
      pasarlo bien = to have a good time
      regalar = to give (a gift)
      reírse = to laugh
      relajarse = to relax
      sonreír = to smile
      sorprender = to surprise
      el flan (de caramelo) = baked (caramel) custard
      la galleta = cookie
      el helado = ice cream
      el pastel (de chocolate) = (chocolate) cake = la torta
      el postre = dessert
      los dulces = sweets; candy
    ` },
    { id: 'relaciones', name: 'relaciones y vida', example: 'casarse con', text: `
      la amistad = friendship
      el amor = love
      el divorcio = divorce
      el estado civil = marital status
      el matrimonio = marriage
      la pareja = couple; partner
      el/la recién casado/a = newlywed = el recién casado / la recién casada / recién casado / recién casada
      casarse (con) = to get married (to)
      comprometerse (con) = to get engaged (to)
      divorciarse (de) = to get divorced (from)
      enamorarse (de) = to fall in love (with)
      llevarse bien/mal (con) = to get along well/badly (with) = llevarse bien / llevarse mal
      odiar = to hate
      romper (con) = to break up (with)
      salir (con) = to go out (with); to date
      separarse (de) = to separate (from)
      tener una cita = to have a date; an appointment
      casado = married
      divorciado = divorced
      juntos = together
      separado = separated
      soltero = single
      viudo = widowed
      la adolescencia = adolescence
      la edad = age
      la juventud = youth
      la madurez = maturity; middle age
      la muerte = death
      el nacimiento = birth
      la niñez = childhood
      la vejez = old age
      jubilarse = to retire (from work)
      nacer = to be born
    ` },
  ], [
    { id: 'pret-irr', name: 'pretéritos irregulares', example: 'tuve, hizo, dijeron' },
    { id: 'sentido', name: 'verbos que cambian en pretérito', example: 'conocí, supe, no quise' },
    { id: 'que-cual', name: '¿qué? o ¿cuál?', example: '¿cuál es tu número?' },
    { id: 'prep', name: 'pronombres con preposición', example: 'para mí, conmigo' },
  ], () => [
    ...conj('D1.9', 'pret-irr', { tense: 'preterite', verbs: ['tener', 'estar', 'poder', 'poner', 'saber', 'venir', 'querer', 'hacer', 'decir', 'traer', 'conducir', 'traducir', 'dar', 'producir'] }),
    ...parse('D1.9', 'pret-irr', `
      g | Anoche ___ (haber) una fiesta en casa de Ana. | hubo | hay → hubo
      g | Mi tío ___ (hacer) un pastel. | hizo | hacer: hizo (z)
      g | Los invitados ___ (traer) regalos. | trajeron | -j-: trajeron (sin i)
      g | Ellos ___ (decir) que sí. | dijeron | dijeron (sin i)
      g | Yo ___ (estar) en la boda. | estuve | estar: estuve (sin tilde)
      g | ¿Qué te ___ (dar) tus padres? | dieron | dar: dieron
      g | Nosotros ___ (venir) en coche. | vinimos | venir: vinimos
      c | Él ___ el discurso de la boda. | hizo / hació / hico / hizó | hacer → hizo
      t | We had a party. | Tuvimos una fiesta. | tener: tuvimos
      t | She brought the dessert. | Trajo el postre. | traer: trajo
    `),
    ...parse('D1.9', 'sentido', `
      c | Ayer ___ a mi suegra en la boda. (met) | conocí / conocía / supe / sabía | conocer en pretérito = to meet
      c | Anoche ___ que Ana se comprometió. (found out) | supe / sabía / conocí / pude | saber en pretérito = to find out
      c | Por fin ___ abrir la botella. (managed to) | pude / podía / quise / supe | poder en pretérito = to manage to
      c | Intenté, pero no ___ terminar. (failed to) | pude / podía / quise / sabía | no poder en pretérito = to fail to
      c | Él ___ ir a la fiesta, pero no tuvo tiempo. (tried to) | quiso / quería / pudo / supo | querer en pretérito = to try
      c | Ella ___ bailar conmigo. (refused) | no quiso / no quería / no pudo / no supo | no querer en pretérito = to refuse
      t | I met his wife yesterday. | Conocí a su esposa ayer. / Ayer conocí a su esposa. | conocí = met
      t | We found out the truth. | Supimos la verdad. | supimos = found out
      t | They refused to come. | No quisieron venir. | no quisieron = refused
    `),
    ...parse('D1.9', 'que-cual', `
      c | ¿___ es tu número de teléfono? | Cuál / Qué / Cómo / Quién | ser + dato de un grupo: cuál
      c | ¿___ es una quinceañera? | Qué / Cuál / Quién / Cuáles | definición: qué
      c | ¿___ postre prefieres? | Qué / Cuál / Cuáles / Quién | qué + sustantivo
      c | ¿___ de los pasteles es el tuyo? | Cuál / Qué / Quién / Cuánto | cuál de…
      c | ¿___ son tus fiestas favoritas? | Cuáles / Qué / Cuál / Quiénes | cuáles: plural
      c | ¿___ hiciste el fin de semana? | Qué / Cuál / Cuáles / Quién | qué + verbo
      c | ¿___ es la fecha de la boda? | Cuál / Qué / Cuándo es / Cómo | cuál es la fecha
      c | ¿___ es tu dirección? | Cuál / Qué / Dónde / Cuánto | cuál es tu dirección
      c | ¿___ hora es? | Qué / Cuál / Cuánta / Cuáles | qué hora
      c | ¿___ regalo te gusta más, este o ese? | Qué / Cuál / Cuáles / Quién | qué + sustantivo
      t | What is your name? (tú) | ¿Cuál es tu nombre? / ¿Cómo te llamas? | cuál es tu nombre
      t | What is a flan? | ¿Qué es un flan? | definición: qué
    `),
    ...parse('D1.9', 'prep', `
      g | El pastel es para ___ (yo). | mí | después de preposición: mí (con tilde)
      g | ¿Quieres ir ___ (con + yo)? | conmigo | con + yo → conmigo
      g | Voy a la fiesta ___ (con + tú). | contigo | con + tú → contigo
      g | Este regalo es para ___ (tú). | ti | para ti (sin tilde)
      g | Entre ___ (tú y yo), no me gusta. | tú y yo | entre: tú y yo, no ti y mí
      g | Según ___ (tú), ¿quién ganó? | tú | según: tú
      g | Bailamos cerca de ___ (ellos). | ellos | ellos no cambia
      g | Lo hice por ___ (usted). | usted | usted no cambia
      c | ¿Esto es para ___? | ti / tú / te / tí | para ti
      c | Ana siempre habla de ___. | sí misma / se / sí / ella misma de | reflexivo: sí misma
      t | Come with me! (tú) | ¡Ven conmigo! | conmigo
      t | Is the gift for me? | ¿El regalo es para mí? / ¿Es el regalo para mí? / ¿Es para mí el regalo? | para mí
    `),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
