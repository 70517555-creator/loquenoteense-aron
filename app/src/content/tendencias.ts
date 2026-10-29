import type { Tendencia } from '../domain/tipos'

export const tendencias: Tendencia[] = [
  {
    id: 'redes', titulo: 'Redes sociales', icono: 'phone',
    loQueVes: ['Pasan demasiado tiempo en el celular.', 'Se distraen fácilmente.', 'No se interesan por otras cosas.'],
    loQueCuentan: ['Es donde me siento parte de algo.', 'Ahí hablo con mis amigos.', 'También aprendo y descubro cosas que me interesan.'],
    comoAcompanar: ['Acuerden horarios juntos, y cúmplelos tú también.', 'Pregunta qué sigue y por qué le gusta.', 'Habla de privacidad: qué se comparte y qué no.'],
    pregunta: '¿Cómo podemos acompañarlos en un uso más saludable?',
  },
  {
    id: 'ia', titulo: 'Inteligencia artificial', icono: 'spark',
    loQueVes: ['Hacen las tareas con ChatGPT.', 'Parece que ya no piensan por sí mismos.'],
    loQueCuentan: ['Me ayuda cuando no entiendo al profe.', 'Lo uso para practicar y repasar.'],
    comoAcompanar: ['Pídele que te muestre cómo la usa.', 'Conversen la diferencia entre “ayudarse” y “copiar”.', 'Valora que explique con sus palabras lo que aprendió.'],
    pregunta: '¿Cómo usar la IA para aprender, y no solo para copiar?',
  },
  {
    id: 'videojuegos', titulo: 'Videojuegos', icono: 'pad',
    loQueVes: ['Se aíslan en su cuarto.', 'Se ponen de mal humor si pierden.'],
    loQueCuentan: ['Juego con mis amigos, es como salir con ellos.', 'Me relaja después del colegio.'],
    comoAcompanar: ['Juega una partida con él o ella.', 'Revisa juntos la clasificación por edad del juego.', 'Acuerden tiempos antes de empezar, no a mitad de la partida.'],
    pregunta: '¿Y si juegas una partida con tu hijo esta semana?',
  },
  {
    id: 'emocional', titulo: 'Salud emocional', icono: 'heart',
    loQueVes: ['Están irritables o muy callados.', 'Dicen que tienen ansiedad.'],
    loQueCuentan: ['No sé cómo explicar lo que siento.', 'Me da vergüenza pedir ayuda.'],
    comoAcompanar: ['Escucha sin minimizar (“eso no es nada”).', 'Observa cambios en el sueño, el apetito o el ánimo que duren semanas.', 'Pedir ayuda profesional es un acto de amor, no de debilidad.'],
    pregunta: '¿Qué señales merecen buscar apoyo profesional?',
  },
]
