import type { Situacion } from '../domain/tipos'

export const situaciones: Situacion[] = [
  {
    id: 'celular', contexto: 'En casa',
    padre: 'Está todo el día en el celular, no se interesa por nada.',
    hijo: 'Es el único lugar donde puedo desconectarme.',
    detras: 'Detrás del celular muchas veces hay cansancio, aburrimiento o necesidad de un espacio propio. Antes de quitarlo, vale la pena preguntar qué encuentra ahí.',
    pruebaHoy: 'Pregúntale: “¿Qué es lo que más te gusta ver últimamente?” y pídele que te lo muestre.',
  },
  {
    id: 'notas', contexto: 'En el colegio',
    padre: 'Sus notas bajaron y no me cuenta nada.',
    hijo: 'Si le digo que no entiendo, se va a molestar.',
    detras: 'El silencio suele ser miedo a decepcionar. Una pregunta sin reclamo abre más puertas que un castigo.',
    pruebaHoy: 'Dile: “Me di cuenta de que el curso está difícil. ¿Qué parte te está costando más?”',
  },
  {
    id: 'redes', contexto: 'Redes sociales',
    padre: 'Publica cosas que no debería.',
    hijo: 'Ahí mis amigos me ven como soy.',
    detras: 'Las redes son su plaza pública: ahí se siente visto. Acompañar es enseñarle a cuidarse, no solo prohibir.',
    pruebaHoy: 'Revisen juntos la privacidad de una de sus cuentas, sin juzgar lo que veas.',
  },
  {
    id: 'amigos', contexto: 'Amigos',
    padre: 'Ya no quiere estar en familia, solo con sus amigos.',
    hijo: 'Con ellos siento que encajo.',
    detras: 'Buscar a sus pares es parte natural de crecer. No te está rechazando: está construyendo quién es.',
    pruebaHoy: 'Invita a sus amigos a casa este fin de semana. Conócelos sin interrogarlos.',
  },
  {
    id: 'emociones', contexto: 'Emociones',
    padre: 'Se encierra y llora sin decir por qué.',
    hijo: 'Ni yo sé qué me pasa.',
    detras: 'A veces todavía no hay palabras para lo que sienten. Estar cerca, sin presionar, ya es ayudar.',
    pruebaHoy: 'Siéntate cerca un rato, sin preguntar. Solo dile: “Aquí estoy cuando quieras.”',
  },
  {
    id: 'respuestas', contexto: 'Respeto',
    padre: 'Me contesta mal por todo.',
    hijo: 'Siento que todo lo que hago está mal.',
    detras: 'Cuando un adolescente se defiende todo el tiempo, muchas veces es porque se siente atacado todo el tiempo.',
    pruebaHoy: 'Hoy dile algo que hizo bien, por pequeño que sea. Y nada más.',
  },
]
