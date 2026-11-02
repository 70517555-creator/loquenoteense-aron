import type { PreguntaDeLaSemana } from '../domain/foro'

// Salen de lo que contaron las familias y los docentes en la encuesta del colegio (octubre de 2026).
// Se turnan cada lunes, salvo que psicología escriba otra pregunta desde su panel.
export const preguntasDeLaSemana: PreguntaDeLaSemana[] = [
  {
    titulo: '¿Qué acuerdo sobre el celular les ha funcionado en casa?',
    descripcion: 'En la encuesta, el celular salió como una de las cosas que más cuesta manejar. ¿Lo dejan fuera de la mesa? ¿Tienen una hora para apagarlo? Cuéntanos qué les sirvió, o qué no.',
  },
  {
    titulo: 'Cuando tu hijo llega de mal humor, ¿qué haces?',
    descripcion: 'Los cambios de ánimo fueron lo más difícil para muchas familias del colegio. ¿Qué te ha ayudado a acompañarlo sin terminar peleando?',
  },
  {
    titulo: '¿Cuándo fue la última vez que tu hijo te contó un problema?',
    descripcion: 'Algunas familias nos dijeron "hace meses". ¿Qué crees que hace que tu hijo se anime a contarte algo, o que prefiera callarse?',
  },
  {
    titulo: '¿Conoces a los amigos de tu hijo?',
    descripcion: 'Cuando un chico no se siente comprendido, busca a sus amigos. ¿Cómo te has acercado a su mundo sin que lo sienta como control?',
  },
  {
    titulo: '¿Cómo le hablas a tu hijo de los problemas de la casa?',
    descripcion: 'Para muchos docentes, los problemas familiares son lo que más les cuesta hablar a los chicos. ¿Qué le cuentas y qué prefieres guardar? Sin nombres ni detalles.',
  },
  {
    titulo: '¿Qué hiciste tú cuando no sabías qué estudiar?',
    descripcion: 'A la mitad de las familias les preocupa que su hijo se equivoque al decidir su futuro. ¿Qué te ayudó a ti, o qué te hubiera gustado escuchar a su edad?',
  },
]
