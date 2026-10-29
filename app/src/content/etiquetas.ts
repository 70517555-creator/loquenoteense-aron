import type { Etiqueta } from '../domain/tipos'

export const etiquetas: Etiqueta[] = [
  {
    id: 'miedo-sufra', texto: 'Miedo a que mi hijo sufra', color: 'crema', x: 17, y: 26, giro: -4,
    reflexion: 'Querer protegerlo es amor. Pero si evitamos que se equivoque, también le quitamos la oportunidad de aprender a levantarse.',
    pregunta: '¿De qué lo estoy protegiendo que en realidad podría aprender solo?',
  },
  {
    id: 'mis-padres', texto: 'Lo que aprendí de mis padres', color: 'verde', x: 53, y: 28, giro: 3,
    reflexion: 'Repetimos lo que vivimos, a veces sin darnos cuenta. No es culpa: es herencia. Y la herencia se puede elegir.',
    pregunta: '¿Qué quiero conservar de cómo me criaron y qué quiero hacer distinto?',
  },
  {
    id: 'no-se-hablarle', texto: 'No sé cómo hablarle', color: 'rosa', x: 15, y: 45, giro: 2,
    reflexion: 'Nadie nace sabiendo. La conversación se construye: empieza escuchando más de lo que hablas.',
    pregunta: '¿Cuándo fue la última vez que solo lo escuché, sin corregirlo?',
  },
  {
    id: 'miedo-equivocarme', texto: 'Miedo a equivocarme', color: 'crema', x: 55, y: 47, giro: -3,
    reflexion: 'Equivocarte y pedir disculpas le enseña más a tu hijo que fingir que siempre tienes la razón.',
    pregunta: '¿Alguna vez le he pedido perdón a mi hijo? ¿Cómo reaccionó?',
  },
  {
    id: 'limites', texto: 'No sé cuándo poner límites', color: 'rosa', x: 17, y: 68, giro: -2,
    reflexion: 'Los límites claros y explicados dan seguridad. No son castigo: son el marco donde se puede crecer.',
    pregunta: '¿Mis reglas en casa se explican o solo se imponen?',
  },
  {
    id: 'incognita', texto: '?', color: 'verde', x: 60, y: 73, giro: 4,
    reflexion: 'Hay cargas que aún no tienen nombre. Está bien. Esta mochila también se puede ir vaciando, poco a poco.',
    pregunta: '¿Qué llevo encima que todavía no me animo a nombrar?',
  },
]
