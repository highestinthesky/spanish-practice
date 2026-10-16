(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Full conjugation of one verb from its infinitive and its behaviour tags.
  // Irregular stems live in MODELS below; everything else follows the rules of the three regular patterns.

  const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
  const BOOT = [0, 1, 2, 5]; // yo, tú, él, ellos: the persons that take a stem change

  const ENDINGS = {
    present: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
    preterite: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
    imperfect: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
    subjunctive: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
  };
  const FUTURE = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
  const CONDITIONAL = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
  const STRONG = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
  const HABER = {
    perfect: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
    pluperfect: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
  };

  const FUI = ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'];

  // Exact infinitives. Forms given here replace the generated ones; stems feed the generator.
  //   pret: strong preterite stem   fut: future/conditional stem   tu: affirmative tú command
  const EXACT = {
    ser: {
      present: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
      preterite: FUI,
      imperfect: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
      subjunctive: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'],
      tu: 'sé',
    },
    ir: {
      present: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
      preterite: FUI,
      imperfect: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
      subjunctive: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'],
      gerund: 'yendo',
      tu: 've',
      nos: 'vamos',
    },
    estar: {
      present: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
      subjunctive: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'],
      pret: 'estuv',
    },
    dar: {
      present: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
      preterite: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
      subjunctive: ['dé', 'des', 'dé', 'demos', 'deis', 'den'],
    },
    ver: {
      present: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
      preterite: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
      imperfect: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
      participle: 'visto',
    },
    saber: {
      present: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
      subjunctive: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'],
      pret: 'sup',
      fut: 'sabr',
    },
    oír: { present: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'] },
    oler: {
      present: ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen'],
      subjunctive: ['huela', 'huelas', 'huela', 'olamos', 'oláis', 'huelan'],
    },
    poder: { pret: 'pud', fut: 'podr', gerund: 'pudiendo' },
    querer: { pret: 'quis', fut: 'querr' },
    andar: { pret: 'anduv' },
    decir: { pret: 'dij', fut: 'dir', participle: 'dicho', tu: 'di' },
    salir: { fut: 'saldr', tu: 'sal' },
    valer: { fut: 'valdr' },
    morir: { participle: 'muerto' },
    romper: { participle: 'roto' },
    abrir: { participle: 'abierto' },
  };

  // Compounds share their base's irregularities: mantener → mantuve, mantendré, mantén; describir → descrito.
  // Forms and stems here are suffixes; the compound's prefix is put in front.
  const SUFFIX = [
    ['tener', { pret: 'tuv', fut: 'tendr', tu: 'ten', tuAfterPrefix: 'tén' }],
    ['poner', { pret: 'pus', fut: 'pondr', participle: 'puesto', tu: 'pon', tuAfterPrefix: 'pón' }],
    ['venir', { pret: 'vin', fut: 'vendr', tu: 'ven', tuAfterPrefix: 'vén' }],
    ['hacer', { pret: 'hic', fut: 'har', participle: 'hecho', tu: 'haz' }],
    ['traer', { pret: 'traj' }],
    ['ducir', { pret: 'duj' }],
    ['scribir', { participle: 'scrito' }],
    ['cubrir', { participle: 'cubierto' }],
    ['volver', { participle: 'vuelto' }],
    ['solver', { participle: 'suelto' }],
    [
      'reír',
      {
        present: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'],
        preterite: ['reí', 'reíste', 'rió', 'reímos', 'reísteis', 'rieron'],
        subjunctive: ['ría', 'rías', 'ría', 'riamos', 'riáis', 'rían'],
        gerund: 'riendo',
      },
    ],
  ];

  function modelFor(base) {
    if (EXACT[base]) return EXACT[base];
    for (const [suffix, m] of SUFFIX) {
      if (!base.endsWith(suffix)) continue;
      const pre = base.slice(0, -suffix.length);
      const out = {};
      for (const [k, val] of Object.entries(m)) {
        if (k === 'tuAfterPrefix') continue;
        out[k] = Array.isArray(val) ? val.map((f) => pre + f) : pre + val;
      }
      if (pre && m.tuAfterPrefix) out.tu = pre + m.tuAfterPrefix;
      return out;
    }
    return {};
  }

  /* ---------- spelling ---------- */

  const isFront = (ch) => 'eéií'.includes(ch);

  // Keep the stem's sound in front of the ending: busqué, llegué, empecé, escojo, sigo, venzo, averigüe.
  function joinSpelled(stem, ending, type) {
    const front = isFront(ending[0]);
    if (type === 'ar') {
      if (!front) return stem + ending;
      if (/gu$/.test(stem)) return `${stem.slice(0, -1)}ü${ending}`;
      if (/c$/.test(stem)) return `${stem.slice(0, -1)}qu${ending}`;
      if (/g$/.test(stem)) return `${stem}u${ending}`;
      if (/z$/.test(stem)) return `${stem.slice(0, -1)}c${ending}`;
      return stem + ending;
    }
    if (front) return stem + ending;
    if (/[gq]u$/.test(stem)) return stem.slice(0, -2) + (stem.endsWith('gu') ? 'g' : 'c') + ending;
    if (/c$/.test(stem)) return `${stem.slice(0, -1)}z${ending}`;
    if (/g$/.test(stem)) return `${stem.slice(0, -1)}j${ending}`;
    return stem + ending;
  }

  function replaceLast(str, from, to) {
    const i = str.lastIndexOf(from);
    return i < 0 ? null : str.slice(0, i) + to + str.slice(i + from.length);
  }

  /* ---------- stress, for pronouns attached to commands and gerunds ---------- */

  const STRONG_V = 'aeoáéóíú'; // accented í/ú break a diphthong, so they count as strong
  const VOWELS = 'aeiouáéíóúü';
  const ACUTE = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
  const PLAIN = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

  // Syllable nuclei as arrays of letter indices. The u of que/qui/gue/gui is silent.
  function nuclei(word) {
    const out = [];
    let prevVowel = false;
    let prevStrong = false;
    for (let i = 0; i < word.length; i += 1) {
      const ch = word[i];
      const silentU = ch === 'u' && /[gq]/.test(word[i - 1] || '') && isFront(word[i + 1] || '');
      if (!VOWELS.includes(ch) || silentU) {
        prevVowel = false;
        continue;
      }
      const strong = STRONG_V.includes(ch);
      if (prevVowel && !(strong && prevStrong)) out[out.length - 1].push(i);
      else out.push([i]);
      prevVowel = true;
      prevStrong = strong;
    }
    return out;
  }

  const defaultStress = (word, count) => (/[aeiouns]$/.test(word) ? count - 2 : count - 1);

  function stressedNucleus(word) {
    const ns = nuclei(word);
    const marked = ns.findIndex((n) => n.some((i) => 'áéíóú'.includes(word[i])));
    if (marked >= 0) return marked;
    return Math.max(0, defaultStress(word, ns.length));
  }

  // Attach unstressed pronouns to a form, moving the written accent as Spanish spelling requires.
  function attach(form, clitic) {
    const s = stressedNucleus(form);
    const word = form + clitic;
    const ns = nuclei(word);
    const nucleus = ns[s];
    const marked = nucleus.find((i) => 'áéíóú'.includes(word[i]));
    // A written í/ú that splits a diphthong (gradúa, ríe) stays whatever happens.
    if (marked != null && 'íú'.includes(word[marked])) return word;
    const needs = ns.length > 1 && s !== defaultStress(word, ns.length);
    if (marked != null) return needs ? word : word.slice(0, marked) + PLAIN[word[marked]] + word.slice(marked + 1);
    if (!needs) return word;
    const strong = nucleus.find((i) => 'aeo'.includes(word[i]));
    const at = strong != null ? strong : nucleus[nucleus.length - 1];
    return word.slice(0, at) + ACUTE[word[at]] + word.slice(at + 1);
  }

  /* ---------- the conjugator ---------- */

  function parse(inf) {
    const reflexive = /(ar|er|ir|ír)se$/.test(inf);
    const base = reflexive ? inf.slice(0, -2) : inf;
    const ending = base.slice(-2);
    const type = ending === 'ar' ? 'ar' : ending === 'er' ? 'er' : 'ir';
    if (!/^(ar|er|ir|ír)$/.test(ending)) throw new Error(`cannot conjugate ${inf}`);
    return { reflexive, base, type, stem: base.slice(0, -2) };
  }

  // opts.regular: ignore every irregularity (the pattern a learner would guess), used to spot what is irregular.
  function conjugate(inf, tags = [], opts = {}) {
    const regular = Boolean(opts.regular);
    const { reflexive, base, type, stem } = parse(inf);
    const m = regular ? {} : modelFor(base);
    const has = (t) => !regular && tags.includes(t);
    // The regular baseline also skips spelling changes, so busqué and escojo show up as worth a look.
    const join = regular ? (s, e) => s + e : joinSpelled;
    const pastType = type === 'ar' ? 'ar' : 'er';
    const vowelStem = !regular && type !== 'ar' && /[aeiou]$/.test(stem) && !/[gq]u$/.test(stem);
    const strongVowelStem = vowelStem && /[aeo]$/.test(stem);

    // Stem of yo, tú, él, ellos in the present.
    let boot = stem;
    if (has('e→ie')) boot = replaceLast(stem, 'e', 'ie') || stem;
    if (has('o→ue')) boot = replaceLast(stem, 'o', 'ue') || replaceLast(stem, 'u', 'ue') || stem;
    if (has('e→i')) boot = replaceLast(stem, 'e', 'i') || stem;
    if (has('-uir')) boot = `${stem}y`;
    if (has('í/ú')) {
      const i = Math.max(stem.lastIndexOf('i'), stem.lastIndexOf('u'));
      if (i >= 0) boot = stem.slice(0, i) + ACUTE[stem[i]] + stem.slice(i + 1);
    }

    // -ir stem-changers also change (e → i, o → u) in the preterite third persons, the gerund and the subjunctive.
    let weak = null;
    if (type === 'ir' && (has('e→ie') || has('e→i') || has('o→ue'))) {
      weak = has('o→ue') ? replaceLast(stem, 'o', 'u') : replaceLast(stem, 'e', 'i');
    }

    // Present
    let present = m.present;
    if (!present) {
      present = ENDINGS.present[type].map((e, i) => join(BOOT.includes(i) ? boot : stem, e, type));
      if (has('-go')) {
        const src = has('e→i') ? boot : stem;
        let yo;
        if (/c$/.test(src)) yo = `${src.slice(0, -1)}g`;
        else if (/[aeiou]$/.test(src)) yo = `${src}ig`;
        else yo = `${src}g`;
        present[0] = `${yo}o`;
      }
      if (has('-zco')) present[0] = `${stem.slice(0, -1)}zco`;
    }

    // Preterite
    let preterite = m.preterite;
    if (!preterite && m.pret) {
      preterite = STRONG.map((e, i) => (i === 5 && /j$/.test(m.pret) ? `${m.pret}eron` : join(m.pret, e, 'er')));
    }
    if (!preterite) {
      preterite = ENDINGS.preterite[pastType].map((e) => join(stem, e, type));
      if (weak) {
        preterite[2] = join(weak, 'ió', type);
        preterite[5] = join(weak, 'ieron', type);
      }
      if (vowelStem) {
        preterite[2] = `${stem}yó`;
        preterite[5] = `${stem}yeron`;
        if (strongVowelStem) [1, 3, 4].forEach((i) => (preterite[i] = stem + preterite[i].slice(stem.length).replace(/^i/, 'í')));
      }
    }

    const imperfect = m.imperfect || ENDINGS.imperfect[pastType].map((e) => join(stem, e, type));

    const futStem = m.fut || base.replace('í', 'i');
    const future = FUTURE.map((e) => futStem + e);
    const conditional = CONDITIONAL.map((e) => futStem + e);

    // Present subjunctive: built on the yo form (tenga, conozca, construya), keeping the boot pattern otherwise.
    let subjunctive = m.subjunctive;
    if (!subjunctive) {
      const ends = ENDINGS.subjunctive[pastType];
      const yo = present[0];
      const fromYo = has('-uir') || yo !== join(boot, 'o', type);
      subjunctive = ends.map((e, i) => {
        if (fromYo) return yo.slice(0, -1) + e;
        if (BOOT.includes(i)) return join(boot, e, type);
        return join(weak || stem, e, type);
      });
    }

    // Imperfect subjunctive: third-person plural preterite minus -ron.
    const pastStem = preterite[5].slice(0, -3);
    const accented = pastStem.replace(/([aeo])$/, (v) => ACUTE[v]);
    const pastSubjunctive = ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran'].map((e, i) => (i === 3 ? accented : pastStem) + e);

    let participle = m.participle;
    if (!participle) {
      if (type === 'ar') participle = `${stem}ado`;
      else participle = stem + (strongVowelStem ? 'ído' : 'ido');
    }

    let gerund = m.gerund;
    if (!gerund) {
      if (type === 'ar') gerund = `${stem}ando`;
      else gerund = (weak || stem) + (vowelStem ? 'yendo' : 'iendo');
    }

    // Commands (index 0, yo, has none).
    const tu = m.tu || present[2];
    const nosAff = m.nos || subjunctive[3];
    const vosAff = `${base.slice(0, -1)}d`;
    const affirmative = [null, tu, subjunctive[2], nosAff, vosAff, subjunctive[5]];
    const negative = [null, ...subjunctive.slice(1).map((f) => `no ${f}`)];

    const withPronoun = (forms) => (reflexive ? forms.map((f, i) => `${PRONOUNS[i]} ${f}`) : forms.slice());

    let affOut = affirmative;
    let negOut = negative;
    if (reflexive) {
      affOut = affirmative.map((f, i) => {
        if (f == null) return null;
        if (i === 3) return attach(f.replace(/s$/, ''), 'nos');
        if (i === 4) {
          if (base === 'ir') return 'idos';
          return type === 'ir' ? `${f.slice(0, -2)}íos` : `${f.slice(0, -1)}os`;
        }
        return attach(f, PRONOUNS[i]);
      });
      negOut = subjunctive.map((f, i) => (i === 0 ? null : `no ${PRONOUNS[i]} ${f}`));
    }

    const gerundOut = reflexive ? attach(gerund, 'se') : gerund;

    return {
      inf,
      reflexive,
      participle,
      gerund: gerundOut,
      present: withPronoun(present),
      preterite: withPronoun(preterite),
      imperfect: withPronoun(imperfect),
      future: withPronoun(future),
      conditional: withPronoun(conditional),
      subjunctive: withPronoun(subjunctive),
      pastSubjunctive: withPronoun(pastSubjunctive),
      perfect: withPronoun(HABER.perfect.map((h) => `${h} ${participle}`)),
      pluperfect: withPronoun(HABER.pluperfect.map((h) => `${h} ${participle}`)),
      imperative: { affirmative: affOut, negative: negOut },
    };
  }

  // Tenses shown in the full table after a miss, in table order. Independent of which tenses the drill asks.
  D.TABLE_TENSES = [
    { id: 'present', name: 'presente' },
    { id: 'preterite', name: 'pretérito' },
    { id: 'imperfect', name: 'imperfecto' },
    { id: 'future', name: 'futuro' },
    { id: 'conditional', name: 'condicional' },
    { id: 'subjunctive', name: 'subjuntivo presente' },
    { id: 'pastSubjunctive', name: 'subjuntivo imperfecto' },
    { id: 'perfect', name: 'pretérito perfecto' },
    { id: 'pluperfect', name: 'pluscuamperfecto' },
  ];

  D.conjugate = conjugate;
  D.conjugator = { conjugate, attach, nuclei, join: joinSpelled, PRONOUNS };
})(typeof window !== 'undefined' ? window : globalThis);
