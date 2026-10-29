export interface SeccionDePolitica {
  id: string
  titulo: string
  parrafos?: string[]
  puntos?: string[]
}

export const FECHA_DE_ACTUALIZACION = '28 de octubre de 2026'
export const VERSION_DE_POLITICA = '2026-10-28'

export const politicaDePrivacidad: SeccionDePolitica[] = [
  {
    id: 'responsable',
    titulo: '¿Quién cuida tu información?',
    parrafos: [
      'El responsable de esta aplicación es el I.E.P. Santísimo Cristo Moreno. Tratamos la información según la Ley N.° 29733, Ley de Protección de Datos Personales del Perú, y su reglamento.',
      'Esta app es una escuela para padres: no pide tu nombre, no tiene cuentas para las familias y no tiene publicidad.',
    ],
  },
  {
    id: 'celular',
    titulo: 'Lo que se guarda solo en tu celular',
    parrafos: ['Para que la app recuerde tu avance, guardamos algunos datos únicamente en tu teléfono. Nadie más los ve, ni siquiera el colegio:'],
    puntos: [
      'Las habitaciones que visitaste hoy.',
      'Lo que abriste en "La mochila de tu hijo", las cartas del bolsillo secreto, tu resultado en "Ponte en mis zapatos" y los retos que cumpliste, con tus notas.',
      'El apodo que elegiste para el foro (por ejemplo, "Mamá · 3.° de secundaria") y los votos que diste.',
      'Si ya viste el video de bienvenida.',
    ],
  },
  {
    id: 'asistente',
    titulo: 'El asistente "¿Qué pasó hoy en casa?"',
    puntos: [
      'Lo que escribes se envía de forma segura a un servicio de inteligencia artificial (Groq) solo para generar la respuesta. El colegio no guarda tus conversaciones.',
      'Para evitar abusos, el sistema cuenta cuántas preguntas llegan desde cada conexión durante un minuto. No se usa para identificarte.',
      'Si escribes algo que indica riesgo (por ejemplo, autolesión o violencia), tu celular muestra de inmediato las líneas de ayuda, sin enviar ese mensaje a la inteligencia artificial.',
      'Te pedimos no escribir nombres ni datos que permitan reconocer a tu hijo o a otras personas.',
    ],
  },
  {
    id: 'foro',
    titulo: 'El foro "Entre padres"',
    puntos: [
      'Entras sin cuenta. El sistema le asigna a tu celular un código anónimo para que puedas ver tus propios comentarios en revisión y votar una sola vez.',
      'Guardamos el texto de tus comentarios y propuestas, el apodo que elegiste, la fecha, los votos y los reportes.',
      'El equipo de psicología del colegio revisa cada comentario antes de publicarlo. Si no se publica, te mostramos el motivo.',
      'Como el foro es anónimo, el colegio no puede saber quién escribió. Por eso, ante señales de riesgo te mostramos las líneas de ayuda y, si lo necesitas, te invitamos a acercarte al área de psicología.',
    ],
  },
  {
    id: 'mochila',
    titulo: 'La mochila de tu hijo',
    puntos: [
      'Cuando respondes "¿Esto te pasa en casa?", guardamos solo tu respuesta (sí, a veces o no) junto al código anónimo de tu celular, para que respondas una sola vez. Los resultados se muestran sumados, nunca uno por uno.',
      'Las cartas del "bolsillo secreto" se quedan solo en tu celular: no se envían a nadie.',
    ],
  },
  {
    id: 'cartas-de-estudiantes',
    titulo: 'Las cartas de los estudiantes',
    parrafos: [
      'Los estudiantes de secundaria (y de 6.° de primaria) pueden escribir cartas anónimas para las familias, como parte de una actividad de tutoría autorizada por el colegio.',
    ],
    puntos: [
      'No pedimos nombre, grado, sección ni ningún dato personal: solo el nivel (secundaria o 6.° de primaria), el tema y el texto de la carta.',
      'El equipo de psicología lee cada carta antes de publicarla. Si tiene nombres o datos que permitan reconocer a alguien, no se publica.',
      'Si una carta muestra señales de riesgo, el celular del estudiante le muestra de inmediato las líneas de ayuda y lo invita a acercarse a psicología del colegio.',
      'Las familias solo pueden leer las cartas y marcar "Me hizo pensar". No pueden responderlas ni saber quién las escribió.',
    ],
  },
  {
    id: 'equipo',
    titulo: 'El equipo de psicología',
    parrafos: [
      'Los psicólogos entran al panel con su cuenta de Google. Guardamos su correo y el nombre que verán los padres, solo para darles acceso y firmar sus respuestas.',
    ],
  },
  {
    id: 'terceros',
    titulo: 'Servicios externos que usamos',
    parrafos: ['Para funcionar gratis y sin caerse, la app usa estos servicios. Algunos guardan la información fuera del Perú (principalmente en Estados Unidos), con medidas de seguridad:'],
    puntos: [
      'Google Firebase: publica la app y guarda el foro.',
      'Cloudflare: conecta el asistente con la inteligencia artificial.',
      'Groq: genera las respuestas del asistente.',
      'YouTube y Spotify: muestran el video de bienvenida y el podcast. Al reproducirlos, estos servicios pueden aplicar sus propias políticas.',
    ],
  },
  {
    id: 'no-hacemos',
    titulo: 'Lo que nunca hacemos',
    puntos: [
      'No vendemos ni compartimos tu información con fines comerciales.',
      'No usamos publicidad ni herramientas para seguir lo que haces.',
      'No publicamos fotos reales de estudiantes.',
      'Las frases de "Voces reales" son anónimas y se usan solo con autorización escrita de las familias.',
    ],
  },
  {
    id: 'tiempo',
    titulo: '¿Cuánto tiempo se guarda?',
    puntos: [
      'Lo que está en tu celular se queda ahí hasta que lo borres (con el botón de abajo o borrando los datos del navegador).',
      'Los comentarios del foro se guardan mientras el foro esté activo. Psicología puede retirar los que ya no sean necesarios.',
      'Las cartas de los estudiantes se guardan mientras la actividad esté activa. Psicología puede retirarlas en cualquier momento.',
      'Los reportes se eliminan cuando psicología los revisa.',
    ],
  },
  {
    id: 'derechos',
    titulo: 'Tus derechos',
    parrafos: [
      'Puedes pedir acceder, corregir, cancelar u oponerte al uso de tu información (derechos ARCO). Como el foro es anónimo, para ubicar un comentario indícanos el tema, la fecha y el texto aproximado.',
    ],
  },
  {
    id: 'seguridad',
    titulo: 'Cómo protegemos la información',
    puntos: [
      'Toda la información viaja cifrada (HTTPS).',
      'Las reglas del foro se aplican en el servidor: nadie puede publicar sin revisión ni entrar al panel sin estar en el equipo de psicología.',
      'Las claves de los servicios nunca están dentro de la app.',
    ],
  },
  {
    id: 'cambios',
    titulo: 'Cambios en esta política',
    parrafos: ['Si cambiamos algo importante, lo avisaremos en la app. Última actualización: ' + FECHA_DE_ACTUALIZACION + '.'],
  },
]

export const normasDeLasCartas: string[] = [
  'No escribas tu nombre ni el de otras personas (compañeros, profesores o familiares).',
  'No pongas tu grado, sección, teléfono ni redes sociales.',
  'Escribe con respeto: puedes contar lo que te duele sin insultar a nadie.',
  'Si estás en peligro, no esperes: habla hoy con un adulto de confianza o con psicología del colegio, o llama a la Línea 113 (opción 5) o a la Línea 100.',
]

export const normasDelForo: string[] = [
  'Habla desde tu experiencia y con respeto: todos estamos aprendiendo.',
  'No escribas nombres, colegios, secciones ni datos que permitan reconocer a tu hijo o a otras personas.',
  'No compartas fotos, teléfonos ni enlaces personales.',
  'No juzgues ni te burles de otras familias.',
  'Si alguien está en peligro, llama a la Línea 113 (opción 5), a la Línea 100 o al SAMU 106. El foro no reemplaza la atención profesional.',
  'Si ves algo que no corresponde, usa el botón "Reportar".',
]
