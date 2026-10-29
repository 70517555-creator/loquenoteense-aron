import type { CargaDelHijo } from '../domain/tipos'

// Los datos salen de la encuesta a 16 familias y 26 docentes del colegio (octubre de 2026).
export const FUENTE_DE_LOS_DATOS = 'Encuesta a familias y docentes del Cristo Moreno, octubre de 2026'

export const cargas: CargaDelHijo[] = [
  {
    id: 'emociones', etiqueta: 'Lo que siento', titulo: 'Lo que siento y no sé explicar', color: 'rosa', x: 13, y: 20, giro: -4,
    voz: 'Un rato estoy bien y de pronto no. Ni yo sé por qué. Y cuando me preguntas, me molesta más.',
    loQuePasa: 'En la adolescencia el cerebro está cambiando: las emociones llegan rápido y fuertes, y la parte que las ordena madura después. No es mala actitud: muchas veces ni ellos entienden lo que sienten.',
    dato: 'Los cambios de humor son lo que más mencionaron las familias como difícil de manejar. Y 1 de cada 4 docentes dice que las emociones son lo que más les cuesta hablar con un adulto.',
    situacion: {
      frase: 'Llega del colegio, tira la puerta y dice: "¡Déjenme en paz!"',
      respuestas: [
        { texto: '"¡A mí no me hablas así! Vuelve y cierra bien."', reaccion: 'Siento que te importa más la puerta que yo. Me encierro más.', abre: false },
        { texto: '"Ya, estás en tu edad, se te pasa."', reaccion: 'Siento que lo que me pasa no es importante para ti.', abre: false },
        { texto: '"Te veo mal. No te voy a presionar; cuando quieras, aquí estoy."', reaccion: 'No me obligas a hablar, pero sé que puedo ir contigo. Más tarde quizás te busque.', abre: true },
      ],
    },
    evita: ['Decir "eso no es nada" o "estás exagerando".', 'Exigir que hable en el momento del enojo.'],
    prueba: ['"Se nota que fue un día pesado."', '"No tienes que explicármelo ahora."'],
    reto: 'Hoy, sin preguntar nada, ofrécele algo que le guste (un té, su comida favorita) y quédate cerca 10 minutos.',
  },
  {
    id: 'casa', etiqueta: 'Lo que pasa en casa', titulo: 'Lo que pasa en casa', color: 'crema', x: 54, y: 22, giro: 3,
    voz: 'Escucho las peleas, aunque crean que no. Me preocupa y no sé a quién contárselo.',
    loQuePasa: 'Los chicos sienten todo lo que pasa en casa: discusiones, problemas de dinero, una separación. Si nadie les explica, se imaginan lo peor o creen que es su culpa.',
    dato: 'Casi la mitad de los docentes del colegio dice que los problemas familiares son el tema que más les cuesta hablar a los adolescentes con un adulto.',
    situacion: {
      frase: 'Después de una discusión fuerte en casa, tu hijo te pregunta: "¿Se van a separar?"',
      respuestas: [
        { texto: '"Esas son cosas de grandes, tú no te metas."', reaccion: 'Me quedo con la duda y con miedo. Me lo imagino peor.', abre: false },
        { texto: '"Ay, no pasa nada, todo está bien."', reaccion: 'Sé que no es verdad. Aprendo que en esta casa no se habla de lo que duele.', abre: false },
        { texto: '"Tuvimos una discusión fuerte y te asustaste. No es tu culpa. Lo estamos resolviendo los adultos."', reaccion: 'Me siento más tranquilo. Sé que puedo preguntar y que no tengo que arreglarlo yo.', abre: true },
      ],
    },
    evita: ['Hablar mal del otro papá o mamá delante de él.', 'Usarlo de mensajero entre adultos.'],
    prueba: ['"Lo que pasa entre los adultos no es tu culpa."', '"Puedes preguntarme lo que quieras sobre esto."'],
    reto: 'Pregúntale: "¿Hay algo de la casa que te preocupe?" Escucha sin defenderte, aunque lo que diga te duela.',
  },
  {
    id: 'celular', etiqueta: 'Mi celular', titulo: 'Lo que vivo en el celular', color: 'verde', x: 13, y: 39, giro: 2,
    voz: 'Ahí están mis amigos, mis chistes, lo que me gusta. Cuando me lo quitas, siento que me quitas a mi gente.',
    loQuePasa: 'Para ellos el celular no es solo un aparato: es donde viven su vida social. Por eso quitárselo como castigo duele tanto, y por eso necesitan que los acompañemos ahí también.',
    dato: 'El uso del celular y las redes es una de las situaciones que más les cuesta a las familias del colegio. Los docentes piden algo simple: dejar los celulares en el almuerzo y la cena, también los de los adultos.',
    situacion: {
      frase: 'Son las 11 de la noche y sigue con el celular. Mañana tiene clases.',
      respuestas: [
        { texto: 'Se lo quitas sin decir nada y te vas.', reaccion: 'Me da rabia. Mañana busco cómo usarlo a escondidas.', abre: false },
        { texto: '"¡Ese celular te está malogrando la vida!"', reaccion: 'Siento que no entiendes nada de mi mundo. Dejo de contarte lo que veo.', abre: false },
        { texto: '"Ya es tarde. Acordemos una hora para dejarlo cargando fuera del cuarto, y yo también dejo el mío."', reaccion: 'Me molesta un poco, pero es justo. Y si tú también lo dejas, te creo.', abre: true },
      ],
    },
    evita: ['Revisar su celular a escondidas.', 'Pedirle que lo deje mientras tú sigues con el tuyo.'],
    prueba: ['"¿Qué es lo que más te gusta ver? Enséñame."', '"Pongamos juntos las reglas del celular en casa."'],
    reto: 'Hoy, en la comida, todos dejan el celular en otra mesa, tú primero. Pregúntale qué video lo hizo reír esta semana.',
  },
  {
    id: 'amigos', etiqueta: 'Mis amigos', titulo: 'Lo que me dicen mis amigos', color: 'crema', x: 54, y: 41, giro: -3,
    voz: 'Mis amigos me entienden. Con ellos no siento que me juzgan. A veces hago cosas para que no me dejen de lado.',
    loQuePasa: 'En esta etapa los amigos se vuelven muy importantes: es normal y sano. El riesgo aparece cuando son el único lugar donde se sienten escuchados.',
    dato: 'La mitad de los docentes del colegio dice que, cuando un adolescente siente que un adulto no lo comprende, busca a sus amigos. Y a varias familias les preocupa que "se deje llevar por los demás".',
    situacion: {
      frase: 'Te cuenta: "Todos mis amigos van a ir a la fiesta de Mateo y yo también quiero ir."',
      respuestas: [
        { texto: '"Tus amigos no me importan. No vas y punto."', reaccion: 'Siento que no confías en mí. La próxima no te pido permiso, voy y ya.', abre: false },
        { texto: '"Si tus amigos se tiran de un puente, ¿tú también?"', reaccion: 'Me siento tonto. No te voy a contar más lo que hacen mis amigos.', abre: false },
        { texto: '"Cuéntame de tus amigos y de la fiesta. Veamos juntos cómo puedes ir seguro."', reaccion: 'Siento que me tomas en serio. Te cuento más, y me cuesta menos aceptar tus condiciones.', abre: true },
      ],
    },
    evita: ['Criticar a sus amigos sin conocerlos.', 'Decir "esa juntita no te conviene" como primera reacción.'],
    prueba: ['"Invita a tus amigos a la casa, me gustaría conocerlos."', '"¿Qué es lo que más te gusta de tu mejor amigo?"'],
    reto: 'Pregúntale el nombre de sus 3 mejores amigos y algo de cada uno. Si no sabes, ese ya es un buen comienzo.',
  },
  {
    id: 'no-te-cuento', etiqueta: 'Lo que no te cuento', titulo: 'Lo que no te cuento por miedo', color: 'rosa', x: 13, y: 58, giro: 3,
    voz: 'A veces quiero contarte algo, pero pienso en cómo vas a reaccionar y mejor me callo.',
    loQuePasa: 'Muchos chicos no cuentan sus problemas por miedo al castigo, al grito o a decepcionar. No es que no quieran a sus papás: es que todavía no se sienten seguros para hablar.',
    dato: '9 de cada 10 familias dicen que su hijo les cuenta sus problemas. Pero cuando les preguntamos cuándo fue la última vez, algunas responden "hace 6 meses" o "hace 2 años", y otras dicen que tiene miedo de ser castigado. Para los docentes, lo que más cierra la conversación es juzgar rápido.',
    situacion: {
      frase: 'Por fin se anima: "Mamá, tengo que contarte algo… me jalaron en matemática."',
      respuestas: [
        { texto: '"¿¡Qué!? ¡Te pasas el día en el celular! Estás castigado."', reaccion: 'Aprendo que contarte la verdad me trae problemas. La próxima vez no te cuento.', abre: false },
        { texto: '"Siempre lo mismo contigo. Tu primo sí tiene buenas notas."', reaccion: 'Me duele que me compares. Siento que nunca soy suficiente.', abre: false },
        { texto: '"Gracias por decírmelo, sé que no fue fácil. Ahora veamos juntos qué pasó."', reaccion: 'Me siento aliviado. Aprendo que puedo contarte las cosas difíciles.', abre: true },
      ],
    },
    evita: ['Castigar antes de escuchar toda la historia.', 'Compararlo con hermanos, primos o compañeros.'],
    prueba: ['"Gracias por contármelo."', '"No me voy a enojar contigo por decirme la verdad."'],
    reto: 'Dile hoy: "Puedes contarme lo que sea; quizás me preocupe, pero no te voy a dejar solo." Y cúmplelo la próxima vez.',
  },
  {
    id: 'futuro', etiqueta: 'Mi futuro', titulo: 'Mi futuro y mis estudios', color: 'verde', x: 54, y: 60, giro: -2,
    voz: 'Todos me preguntan qué voy a estudiar y yo no sé. Me da miedo equivocarme y decepcionarte.',
    loQuePasa: 'Elegir qué hacer con su vida pesa mucho. Además, hoy creen que la IA lo resuelve todo, y necesitan adultos que los ayuden a pensar, no que decidan por ellos.',
    dato: 'A la mitad de las familias, lo que más les preocupa cuando su hijo empieza a decidir es que se equivoque. Algunas también dicen que su hijo "piensa que la IA soluciona todo".',
    situacion: {
      frase: 'Te dice: "No sé qué quiero estudiar. Creo que nada me gusta."',
      respuestas: [
        { texto: '"Vas a estudiar Medicina, como tu tío. Eso da plata."', reaccion: 'Siento que mi opinión no cuenta. Si estudio eso, lo haré por ti.', abre: false },
        { texto: '"¿Cómo que no sabes? A tu edad yo ya trabajaba."', reaccion: 'Me siento perdido y además culpable. Me cierro.', abre: false },
        { texto: '"Está bien no saberlo todavía. ¿Qué cosas haces sin que el tiempo se te pase?"', reaccion: 'Me quito un peso de encima. Empiezo a pensar en lo que de verdad me gusta.', abre: true },
      ],
    },
    evita: ['Decidir la carrera por él.', 'Decir que sus gustos "no dan de comer" sin conversar.'],
    prueba: ['"Equivocarte también es parte de aprender."', '"Te ayudo a averiguar, pero la decisión es tuya."'],
    reto: 'Cuéntale qué querías ser tú a su edad y qué pasó después. Luego pregúntale qué le gustaría probar este año.',
  },
]

export const tituloDeCarga = (id: string) => cargas.find((c) => c.id === id)?.titulo ?? id
