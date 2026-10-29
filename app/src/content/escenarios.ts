import type { Escenario } from '../domain/tipos'

export const escenarios: Escenario[] = [
  {
    id: 'puerta', mejor: 1,
    pregunta: 'Tu hija acaba de llegar a casa y cierra la puerta de su habitación. ¿Qué haces?',
    opciones: [
      { texto: 'Voy inmediatamente a preguntarle qué pasa.', feedback: 'Tu intención es buena, pero entrar de golpe puede sentirse como invasión.' },
      { texto: 'Le doy espacio y luego me acerco con calma.', feedback: 'Darle espacio y después acercarte con calma suele abrir la conversación.' },
      { texto: 'Le digo que deje de encerrarse.', feedback: 'Esto puede cerrarla aún más: lo vive como un reclamo.' },
      { texto: 'No digo nada.', feedback: 'El silencio total puede parecer indiferencia. Dale espacio, pero hazle saber que estás.' },
    ],
  },
  {
    id: 'curso', mejor: 1,
    pregunta: 'Te enteras de que tu hijo jaló un curso. ¿Qué le dices primero?',
    opciones: [
      { texto: '“¿Por qué no estudiaste?”', feedback: 'Empezar con un “por qué” suena a juicio y lo pone a la defensiva.' },
      { texto: '“Cuéntame, ¿qué pasó con ese curso?”', feedback: 'Una pregunta abierta le da espacio para explicar sin defenderse.' },
      { texto: '“Te quito el celular una semana.”', feedback: 'La sanción inmediata corta la conversación antes de entender qué pasó.' },
      { texto: 'Espero a que él lo mencione.', feedback: 'Puede que nunca lo mencione por miedo. Abre tú el tema, con calma.' },
    ],
  },
  {
    id: 'fiesta', mejor: 1,
    pregunta: 'Tu hija quiere ir a una fiesta y no conoces a nadie. ¿Qué haces?',
    opciones: [
      { texto: 'Le digo que no, sin explicación.', feedback: 'Un “no” sin razones suele terminar en mentiras.' },
      { texto: 'Le pido conocer a sus amigos y acordamos una hora.', feedback: 'Los límites claros y conversados dan confianza a los dos.' },
      { texto: 'La dejo ir sin preguntar nada.', feedback: 'La libertad sin acompañamiento la deja sola ante decisiones grandes.' },
      { texto: 'Voy a vigilarla sin que sepa.', feedback: 'Si lo descubre, la confianza se rompe y cuesta mucho reconstruirla.' },
    ],
  },
  {
    id: 'entiendes', mejor: 1,
    pregunta: 'Tu hijo te dice: “Tú nunca me entiendes”. ¿Cómo respondes?',
    opciones: [
      { texto: '“Yo a tu edad…”', feedback: 'Comparar con tu juventud minimiza lo que siente hoy.' },
      { texto: '“Puede ser. Explícame para entenderte.”', feedback: 'Reconocer y preguntar baja la tensión de inmediato.' },
      { texto: '“No me faltes el respeto.”', feedback: 'Pedir respeto es válido, pero primero escucha qué hay detrás.' },
      { texto: 'Me retiro molesto.', feedback: 'Retirarte deja la herida abierta. Vuelve cuando estés más calmado.' },
    ],
  },
  {
    id: 'noche', mejor: 1,
    pregunta: 'Notas que tu hija pasa la noche en redes y duerme poco. ¿Qué haces?',
    opciones: [
      { texto: 'Le quito el celular sin aviso.', feedback: 'Funciona un día, pero genera resentimiento.' },
      { texto: 'Acordamos juntos una hora de desconexión, yo también.', feedback: 'Cuando tú también cumples el acuerdo, el ejemplo pesa más que la orden.' },
      { texto: 'Lo ignoro, es normal a su edad.', feedback: 'El sueño es importante para su ánimo y sus notas. Vale la pena conversarlo.' },
      { texto: 'La regaño delante de todos.', feedback: 'La vergüenza pública daña el vínculo.' },
    ],
  },
]
