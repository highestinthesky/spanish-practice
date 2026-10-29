(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Where each verb is taught in Descubre 1 and 2 (lesson vocabulary and grammar sections), reconstructed from the
  // standard lesson themes, and in Descubre 3 from the lesson charts. Verbs that appear in no lesson stay in the drill
  // as extra practice without a book tag.
  D.addLessons({
    'D1.1': ['ser'],
    'D1.2': [
      'hablar', 'bailar', 'trabajar', 'estudiar', 'comprar', 'necesitar', 'escuchar', 'practicar', 'llegar', 'buscar',
      'viajar', 'caminar', 'cantar', 'cenar', 'contestar', 'conversar', 'desayunar', 'descansar', 'desear', 'dibujar',
      'enseñar', 'esperar', 'explicar', 'llevar', 'mirar', 'preguntar', 'preparar', 'regresar', 'terminar', 'tomar',
      'estar',
    ],
    'D1.3': [
      'abrir', 'aprender', 'asistir', 'beber', 'comer', 'compartir', 'comprender', 'correr', 'creer', 'deber',
      'decidir', 'describir', 'escribir', 'leer', 'recibir', 'vivir', 'tener', 'venir',
    ],
    'D1.4': [
      'andar', 'bucear', 'escalar', 'esquiar', 'ganar', 'ir', 'nadar', 'patinar', 'pasear', 'visitar', 'jugar',
      'cerrar', 'comenzar', 'empezar', 'entender', 'pensar', 'perder', 'preferir', 'querer', 'almorzar', 'contar',
      'dormir', 'encontrar', 'mostrar', 'poder', 'recordar', 'volver', 'conseguir', 'decir', 'pedir', 'repetir',
      'seguir', 'hacer', 'poner', 'salir', 'suponer', 'traer', 'oír', 'ver',
    ],
    'D1.5': ['acampar', 'confirmar', 'pescar', 'montar', 'sacar'],
    'D1.6': ['costar', 'gastar', 'pagar', 'regatear', 'usar', 'vender', 'dar', 'saber', 'conocer', 'conducir', 'ofrecer', 'parecer', 'traducir'],
    'D1.7': [
      'acordarse', 'acostarse', 'afeitarse', 'bañarse', 'cepillarse', 'despedirse', 'despertarse', 'dormirse',
      'ducharse', 'enojarse', 'irse', 'lavarse', 'levantarse', 'llamarse', 'maquillarse', 'peinarse', 'ponerse',
      'preocuparse', 'probarse', 'quedarse', 'quitarse', 'secarse', 'sentarse', 'sentirse', 'vestirse',
    ],
    'D1.8': ['merendar', 'escoger', 'probar', 'servir', 'morir', 'recomendar'],
    'D1.9': [
      'brindar', 'celebrar', 'cumplir', 'dejar', 'divertirse', 'graduarse', 'invitar', 'jubilarse', 'nacer', 'odiar',
      'reírse', 'relajarse', 'sonreír', 'sorprender', 'casarse', 'comprometerse', 'divorciarse', 'enamorarse',
      'llevarse', 'romper', 'separarse', 'producir',
    ],
    'D2.1': [
      'caerse', 'dañar', 'doler', 'enfermarse', 'estornudar', 'lastimarse', 'olvidar', 'prohibir', 'recetar',
      'romperse', 'sufrir', 'torcerse', 'toser',
    ],
    'D2.2': [
      'apagar', 'arrancar', 'arreglar', 'bajar', 'borrar', 'cargar', 'chocar', 'descargar', 'estacionar', 'funcionar',
      'grabar', 'guardar', 'imprimir', 'llenar', 'manejar', 'navegar', 'parar', 'prender', 'quemar', 'revisar',
      'sonar', 'subir', 'abrazar', 'besar', 'saludar', 'ayudar', 'encontrarse',
    ],
    'D2.3': [
      'alquilar', 'mudarse', 'barrer', 'cocinar', 'ensuciar', 'lavar', 'limpiar', 'planchar', 'quitar', 'sacudir',
      'aconsejar', 'insistir', 'mandar', 'rogar', 'sugerir',
    ],
    'D2.4': [
      'cazar', 'conservar', 'contaminar', 'controlar', 'cuidar', 'desarrollar', 'descubrir', 'destruir', 'evitar',
      'mejorar', 'proteger', 'reciclar', 'recoger', 'reducir', 'resolver', 'respirar', 'alegrarse', 'temer', 'dudar',
      'negar',
    ],
    'D2.5': ['cobrar', 'depositar', 'firmar', 'ahorrar', 'cruzar', 'doblar', 'echar', 'quedar', 'enviar'],
    'D2.6': [
      'adelgazar', 'aliviar', 'apurarse', 'aumentar', 'calentarse', 'disfrutar', 'engordar', 'entrenarse', 'sudar',
      'tratar', 'fumar', 'consumir', 'mantenerse',
    ],
    'D2.7': ['contratar', 'despedir', 'invertir', 'renunciar', 'solicitar', 'entrevistar', 'obtener'],
    'D2.8': ['aburrirse', 'aplaudir', 'apreciar', 'dirigir', 'esculpir', 'pintar', 'presentar', 'publicar', 'tocar'],
    'D2.9': [
      'anunciar', 'comunicarse', 'durar', 'informar', 'ocurrir', 'transmitir', 'emitir', 'investigar', 'luchar',
      'declarar', 'votar', 'elegir', 'obedecer',
    ],
    // Las diversiones
    'D3.2': ['festejar', 'entretener', 'entretenerse', 'gustar', 'anotar', 'marcar', 'desafiar', 'empatar', 'vencer'],
  });
})(typeof window !== 'undefined' ? window : globalThis);
