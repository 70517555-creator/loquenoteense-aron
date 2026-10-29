export type Tono = 'reproche' | 'apertura' | 'neutro'

export const escenaInicialDelEnsayo =
  '(Tu hijo de 14 años llega del colegio, tira la mochila y se va a su cuarto.)\n\n— ¿Qué? Estoy cansado.'

export const frasesDeReproche = [
  'por que no', 'siempre', 'nunca', 'tienes que', 'debes', 'a tu edad', 'cuando yo era', 'te castigo',
  'te quito', 'vas a ver', 'flojo', 'floja', 'ocioso', 'ociosa', 'vago', 'vaga', 'malcriado', 'malcriada',
  'tu hermano', 'tu hermana',
]

export const frasesDeApertura = [
  'cuentame', 'como estas', 'como te sientes', 'que te pasa', 'que paso', 'me preocupa', 'me siento',
  'te entiendo', 'quiero entender', 'ayudame a entender', 'te escucho', 'estoy aqui', 'gracias', 'que piensas',
  'perdon', 'disculpa',
]

export const respuestasDelHijoPorConfianza: string[][] = [
  ['Mmm… nada. Estoy bien.', 'Ya, ¿qué quieres? Estoy ocupado.'],
  ['Es que el colegio está pesado últimamente…', 'No sé… hay cosas que no me salen.'],
  ['En el salón hay unos chicos que se burlan y no sé qué hacer.', 'Me da miedo decepcionarte si te cuento todo.'],
  ['Gracias por escucharme. No pensé que me ibas a entender.', 'Creo que sí quiero que me ayudes.'],
]

export const respuestasDelHijoCerrado = [
  '¿Ves? Siempre es lo mismo contigo.',
  'Ya, mejor me voy a mi cuarto.',
  'Para qué te cuento si me vas a regañar.',
]

export const consejoSegunTono: Record<Tono, string> = {
  reproche: '💡 Ojo: esa frase sonó a reclamo y tu hijo se cerró. Prueba empezar por lo que sientes: “Me preocupa verte así”.',
  apertura: '💡 Muy bien: hablaste desde la calma y le diste espacio. Así se abre la conversación.',
  neutro: '💡 Vas bien. Prueba con una pregunta abierta o nombrando lo que crees que siente.',
}
