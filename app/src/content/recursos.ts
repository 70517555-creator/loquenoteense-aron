import type { GrupoRecursos } from '../domain/tipos'

export const recursos: GrupoRecursos[] = [
  {
    id: 'preguntas', titulo: 'Preguntas',
    items: [
      { texto: '¿Qué es algo que últimamente te preocupa y que nunca me has contado?' },
      { texto: '¿Qué te hace sentir más apoyado/a en casa?' },
      { texto: '¿En qué momento sientes que no te entiendo?' },
      { texto: '¿Qué es lo mejor que te pasó esta semana?' },
      { texto: 'Si pudieras cambiar una regla de la casa, ¿cuál sería?' },
      { texto: '¿A quién admiras y por qué?' },
    ],
  },
  {
    id: 'guias', titulo: 'Guías',
    items: [
      { texto: 'Escucha sin corregir en los primeros minutos.', detalle: 'Si interrumpes para corregir, aprenden que contarte algo tiene un costo.' },
      { texto: 'Habla en el carro o caminando.', detalle: 'Sin mirarse de frente, la tensión baja y es más fácil abrirse.' },
      { texto: 'Cierra con un agradecimiento, no con un sermón.', detalle: '“Gracias por contarme” hace que la próxima vez vuelva a hacerlo.' },
      { texto: 'Nombra la emoción antes de dar soluciones.', detalle: '“Parece que eso te frustró mucho” vale más que tres consejos.' },
    ],
  },
  {
    id: 'descargables', titulo: 'Descargables',
    items: [
      { texto: 'Tarjetas de preguntas para la cena', detalle: 'Próximamente' },
      { texto: 'Calendario de retos de 30 días', detalle: 'Próximamente' },
    ],
  },
]
