import type { Enlace } from '../ports/AssistantPort'

export interface Tema {
  id: string
  claves: string[]
  respuesta: string
  enlaces: Enlace[]
}

export const temas: Tema[] = [
  {
    id: 'celular', claves: ['celular', 'cel', 'telefono', 'movil', 'pantalla', 'tiktok', 'instagram', 'redes', 'whatsapp', 'youtube', 'internet'],
    respuesta: 'Esto le pasa a muchas familias. Antes de quitar el celular, intenta entender qué encuentra ahí: compañía, descanso, diversión. Luego acuerden juntos horarios que tú también cumplas.',
    enlaces: [{ texto: 'Situación: “Está todo el día en el celular”', ruta: '/explorar?s=celular' }, { texto: 'El mundo de hoy: redes sociales', ruta: '/mundo?t=redes' }],
  },
  {
    id: 'notas', claves: ['nota', 'notas', 'jalo', 'jalado', 'curso', 'examen', 'colegio', 'tarea', 'tareas', 'estudia', 'estudiar', 'libreta'],
    respuesta: 'Cuando las notas bajan, casi siempre hay algo detrás: no entiende, está cansado o tiene miedo de decepcionarte. Empieza con una pregunta abierta, sin reclamo: “¿Qué parte te está costando más?”.',
    enlaces: [{ texto: 'Situación: “Sus notas bajaron”', ruta: '/explorar?s=notas' }, { texto: 'Practica: jaló un curso', ruta: '/zapatos' }],
  },
  {
    id: 'encierro', claves: ['encierra', 'encerrado', 'encerrada', 'cuarto', 'habitacion', 'puerta', 'aislado', 'aislada', 'no sale', 'llora', 'triste', 'callado', 'callada'],
    respuesta: 'Encerrarse a veces es una forma de calmarse. Dale espacio, pero hazle saber que estás disponible: “Aquí estoy cuando quieras hablar”. Si la tristeza dura semanas o notas cambios fuertes, busca apoyo profesional.',
    enlaces: [{ texto: 'Situación: “Se encierra y llora”', ruta: '/explorar?s=emociones' }, { texto: 'Salud emocional', ruta: '/mundo?t=emocional' }],
  },
  {
    id: 'respeto', claves: ['contesta', 'grita', 'grosero', 'grosera', 'respeto', 'falta el respeto', 'rebelde', 'malcriado', 'malcriada', 'responde mal'],
    respuesta: 'Cuando un adolescente se defiende todo el tiempo, muchas veces es porque se siente atacado todo el tiempo. Baja el tono primero tú, reconoce lo que siente y pon el límite después, con calma.',
    enlaces: [{ texto: 'Situación: “Me contesta mal”', ruta: '/explorar?s=respuestas' }, { texto: 'Reto: pedir perdón primero', ruta: '/retos?r=perdon' }],
  },
  {
    id: 'limites', claves: ['limite', 'limites', 'permiso', 'fiesta', 'salir', 'hora', 'castigo', 'castigar', 'regla', 'reglas'],
    respuesta: 'Los límites funcionan mejor cuando se explican y se acuerdan. Escucha primero su propuesta, explica tu preocupación y lleguen a un acuerdo concreto (hora, lugar, cómo te avisa).',
    enlaces: [{ texto: 'Practica: la fiesta', ruta: '/zapatos' }, { texto: 'Reto: un acuerdo, no una orden', ruta: '/retos?r=acuerdo' }],
  },
  {
    id: 'amigos', claves: ['amigos', 'amigas', 'amigo', 'amiga', 'junta', 'juntas', 'grupo', 'no quiere estar en familia'],
    respuesta: 'Buscar a sus amigos es parte natural de crecer. No te está rechazando. Conocer a sus amigos (invitarlos a casa) te ayuda a acompañarlo mejor que prohibirle verlos.',
    enlaces: [{ texto: 'Situación: “Solo quiere estar con sus amigos”', ruta: '/explorar?s=amigos' }],
  },
  {
    id: 'videojuegos', claves: ['juego', 'juegos', 'videojuego', 'videojuegos', 'play', 'free fire', 'fortnite', 'roblox', 'minecraft', 'consola', 'gamer'],
    respuesta: 'Para muchos chicos, jugar en línea es “salir con amigos”. Acuerden tiempos antes de empezar la partida, revisen juntos la edad recomendada del juego y, si puedes, juega una vez con él.',
    enlaces: [{ texto: 'Videojuegos', ruta: '/mundo?t=videojuegos' }, { texto: 'Reto: entra a su mundo', ruta: '/retos?r=su-mundo' }],
  },
  {
    id: 'ia', claves: ['chatgpt', 'ia', 'inteligencia artificial', 'copia', 'copiar', 'gemini'],
    respuesta: 'La IA puede ayudar a aprender si se usa para entender, no para copiar. Pídele que te muestre cómo la usa y que te explique con sus palabras lo que aprendió.',
    enlaces: [{ texto: 'Inteligencia artificial', ruta: '/mundo?t=ia' }],
  },
  {
    id: 'sueno', claves: ['duerme', 'dormir', 'sueno', 'desvela', 'madrugada', 'noche', 'trasnocha'],
    respuesta: 'Dormir poco afecta su ánimo y sus notas. Acuerden una hora para dejar las pantallas fuera del cuarto, y que tú también la respetes: el ejemplo pesa más que la orden.',
    enlaces: [{ texto: 'Practica: noches en redes', ruta: '/zapatos' }],
  },
  {
    id: 'bullying', claves: ['bullying', 'acoso', 'molestan', 'le pegan', 'se burlan', 'burlan', 'ciberacoso'],
    respuesta: 'Si sospechas que lo están molestando, créele y agradécele que te lo cuente. No minimices ni lo culpes. Comunícate con su tutor o con psicología del colegio para actuar juntos.',
    enlaces: [{ texto: 'Salud emocional', ruta: '/mundo?t=emocional' }],
  },
  {
    id: 'enamoramiento', claves: ['enamorado', 'enamorada', 'novio', 'novia', 'crush', 'le gusta alguien'],
    respuesta: 'Enamorarse es parte de crecer. Si reaccionas con burla o miedo, dejará de contarte. Muestra interés, conversa sobre el respeto en la pareja y mantén la puerta abierta.',
    enlaces: [{ texto: 'Recursos para conversar', ruta: '/recursos' }],
  },
]

export interface FraseHijo {
  claves: string[]
  significado: string
  responder: string
}

export const frasesHijo: FraseHijo[] = [
  { claves: ['dejame en paz', 'dejame solo', 'dejame sola', 'dejame tranquilo', 'dejame tranquila'],
    significado: 'Muchas veces quiere decir: “Estoy saturado y necesito calmarme antes de hablar”. No siempre es rechazo.',
    responder: '“Está bien, te doy un rato. Cuando quieras, aquí estoy.” Y vuelve más tarde, con calma.' },
  { claves: ['nadie me entiende', 'no me entiendes', 'nunca me entiendes', 'no me entienden'],
    significado: 'Suele significar: “Me siento solo con lo que me pasa”. Está pidiendo ser escuchado, no corregido.',
    responder: '“Puede que tengas razón. Explícame para poder entenderte.”' },
  { claves: ['no me importa', 'me da igual', 'normal', 'da igual'],
    significado: 'A veces es una forma de protegerse: si “no le importa”, no le duele. Detrás puede haber frustración.',
    responder: 'No discutas la frase. Prueba: “Parece que estás cansado de esto. ¿Qué es lo que más te frustra?”' },
  { claves: ['nada', 'no paso nada', 'estoy bien', 'todo bien'],
    significado: 'Puede ser cierto, o puede que no tenga ganas o palabras todavía. Las preguntas cerradas reciben respuestas cerradas.',
    responder: 'Cambia la pregunta: “¿Qué fue lo mejor y lo peor de tu día?”' },
  { claves: ['es mi vida', 'yo decido', 'no te metas'],
    significado: 'Está pidiendo autonomía. Quiere sentir que tiene voz en sus decisiones.',
    responder: '“Tienes razón, es tu vida y quiero que decidas cada vez más. Ayúdame a entender tu plan.”' },
  { claves: ['ustedes no saben', 'tu no sabes', 'no sabes nada'],
    significado: 'Siente que su mundo es distinto al tuyo, y en parte es verdad.',
    responder: '“Es cierto, no conozco bien eso. ¿Me enseñas?” La curiosidad desarma.' },
  { claves: ['me aburro', 'aburrido', 'aburrida', 'todo es aburrido'],
    significado: 'Puede ser falta de motivación, cansancio o algo más profundo si dura mucho tiempo.',
    responder: 'Propón algo juntos, sin obligarlo. Si el desgano dura semanas, conversa con psicología del colegio.' },
  { claves: ['odio el colegio', 'no quiero ir al colegio', 'no quiero ir'],
    significado: 'Algo en el colegio le está pesando: un curso, un compañero, un profesor o la presión.',
    responder: '“¿Qué es lo que más te pesa del colegio ahora?” Escucha sin defender al colegio de inmediato.' },
  { claves: ['ya se', 'ya lo se', 'si ya se'],
    significado: 'Suele significar: “Ya me lo dijiste muchas veces”. Siente que lo sermonean.',
    responder: 'Di menos. Pregunta más: “¿Qué crees que podrías hacer distinto?”' },
]

export const jerga: Record<string, string> = {
  cringe: 'Algo que da vergüenza ajena.',
  npc: 'Viene de los videojuegos (personaje no jugable). Se usa para alguien que “no piensa por sí mismo” o actúa como robot.',
  aesthetic: 'Un estilo visual bonito o armonioso (colores, fotos, ropa).',
  random: 'Algo inesperado o sin sentido aparente.',
  crush: 'La persona que le gusta.',
  ghostear: 'Dejar de responderle a alguien de golpe, sin explicación.',
  stalkear: 'Revisar a fondo las redes de alguien.',
  flex: 'Presumir algo (ropa, logros, dinero).',
  delulu: 'De “delusional”: alguien que se ilusiona demasiado, a veces en broma.',
  rizz: 'Carisma o habilidad para coquetear.',
  sus: 'Sospechoso.',
  'red flag': 'Señal de alerta en una persona o relación.',
  'green flag': 'Una buena señal en una persona.',
  goat: 'Lo mejor de todos los tiempos (Greatest Of All Time).',
  pov: '“Punto de vista”: videos donde muestran una situación como si tú la vivieras.',
  shippear: 'Desear que dos personas sean pareja.',
  funar: 'Exponer públicamente a alguien por algo que hizo mal.',
  bro: 'Amigo, hermano.',
  f: 'Se usa para lamentar algo (“F por eso”).',
  xd: 'Una carita riéndose.',
  troll: 'Alguien que molesta o bromea para provocar.',
  skin: 'Apariencia de un personaje en un videojuego (muchas veces se compra).',
  streamer: 'Persona que transmite en vivo jugando o conversando.',
  'no cap': 'En serio, sin mentir.',
  slay: 'Hacer algo increíblemente bien, lucirse.',
  basado: 'Alguien que dice lo que piensa sin miedo (puede ser elogio o ironía).',
  brainrot: 'Contenido sin sentido que “pudre el cerebro”; también el humor absurdo de internet.',
  skibidi: 'Viene de un video viral absurdo; se usa como palabra sin significado, solo por humor.',
  aura: 'Lo “cool” o respetable que parece alguien. “Perdió aura” = hizo el ridículo.',
  sigma: 'Alguien que “va por su cuenta”, independiente. Muchas veces se usa en broma.',
  mewing: 'Un gesto con la mandíbula que se volvió tendencia en videos.',
  hater: 'Alguien que critica todo con mala onda.',
  spoiler: 'Contar el final de una serie o película antes de tiempo.',
  'ok boomer': 'Forma burlona de decir que alguien piensa “a la antigua”.',
}
