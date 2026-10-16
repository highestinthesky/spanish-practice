(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});
  const v = D.v;

  D.addVerbs([
    // Spelling change in yo (g → j, gu → g)
    v('escoger', 'to choose', ['spelling'], ['escojo', 'escoges', 'escoge', 'escogemos', 'escogéis', 'escogen']),
    v('recoger', 'to pick up, to gather', ['spelling'], ['recojo', 'recoges', 'recoge', 'recogemos', 'recogéis', 'recogen']),
    v('proteger', 'to protect', ['spelling'], ['protejo', 'proteges', 'protege', 'protegemos', 'protegéis', 'protegen']),
    v('dirigir', 'to direct', ['spelling'], ['dirijo', 'diriges', 'dirige', 'dirigimos', 'dirigís', 'dirigen']),
    v('exigir', 'to demand', ['spelling'], ['exijo', 'exiges', 'exige', 'exigimos', 'exigís', 'exigen']),
    v('distinguir', 'to distinguish', ['spelling'], ['distingo', 'distingues', 'distingue', 'distinguimos', 'distinguís', 'distinguen']),

    // -uir adds y
    v('construir', 'to build', ['-uir'], ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen']),
    v('destruir', 'to destroy', ['-uir'], ['destruyo', 'destruyes', 'destruye', 'destruimos', 'destruís', 'destruyen']),
    v('incluir', 'to include', ['-uir'], ['incluyo', 'incluyes', 'incluye', 'incluimos', 'incluís', 'incluyen']),
    v('contribuir', 'to contribute', ['-uir'], ['contribuyo', 'contribuyes', 'contribuye', 'contribuimos', 'contribuís', 'contribuyen']),
    v('sustituir', 'to substitute', ['-uir'], ['sustituyo', 'sustituyes', 'sustituye', 'sustituimos', 'sustituís', 'sustituyen']),
    v('distribuir', 'to distribute', ['-uir'], ['distribuyo', 'distribuyes', 'distribuye', 'distribuimos', 'distribuís', 'distribuyen']),

    // Accent shift (í / ú)
    v('enviar', 'to send', ['í/ú'], ['envío', 'envías', 'envía', 'enviamos', 'enviáis', 'envían']),
    v('esquiar', 'to ski', ['í/ú'], ['esquío', 'esquías', 'esquía', 'esquiamos', 'esquiáis', 'esquían']),
    v('continuar', 'to continue', ['í/ú'], ['continúo', 'continúas', 'continúa', 'continuamos', 'continuáis', 'continúan']),
    v('actuar', 'to act', ['í/ú'], ['actúo', 'actúas', 'actúa', 'actuamos', 'actuáis', 'actúan']),
    v('graduar', 'to grade, to graduate', ['í/ú'], ['gradúo', 'gradúas', 'gradúa', 'graduamos', 'graduáis', 'gradúan']),
    v('confiar', 'to trust', ['í/ú'], ['confío', 'confías', 'confía', 'confiamos', 'confiáis', 'confían']),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
