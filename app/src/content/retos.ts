import type { Reto } from '../domain/tipos'

export const retos: Reto[] = [
  {
    id: 'quince', titulo: '15 minutos para conocer a tu hijo', minutos: 15, temas: ['comunicacion', 'emociones'],
    descripcion: 'No tienes que resolver nada. Solo conversar.',
    pasos: ['Elige un momento sin distracciones.', 'Haz una de las preguntas sugeridas.', 'Escucha sin interrumpir.', 'Al final, anota cómo te sentiste y qué descubriste.'],
  },
  {
    id: 'cena', titulo: 'Cena sin pantallas', minutos: 30, temas: ['celular', 'redes', 'familia'],
    descripcion: 'Una comida donde todos, también tú, dejan el celular lejos de la mesa.',
    pasos: ['Pon una caja o canasta para los celulares.', 'Cada uno cuenta lo mejor y lo más difícil de su día.', 'Nadie corrige ni da consejos: solo escuchan.', 'Agradece al final por el momento.'],
  },
  {
    id: 'su-mundo', titulo: 'Entra a su mundo', minutos: 20, temas: ['videojuegos', 'redes', 'amigos'],
    descripcion: 'Pídele que te enseñe algo que le guste: un juego, un video, una canción.',
    pasos: ['Pregúntale qué le gusta ver o jugar últimamente.', 'Pídele que te lo enseñe, como si fuera tu profe.', 'Muestra curiosidad real, sin criticar.', 'Pregúntale qué es lo que más le gusta de eso.'],
  },
  {
    id: 'carta', titulo: 'Una carta corta', minutos: 10, temas: ['emociones', 'comunicacion'],
    descripcion: 'Escríbele unas líneas diciéndole algo que admiras de él o ella.',
    pasos: ['Piensa en algo concreto que hizo bien esta semana.', 'Escríbelo en un papel, sin “peros”.', 'Déjalo en su mochila o en su almohada.', 'No esperes respuesta: el gesto ya cuenta.'],
  },
  {
    id: 'caminata', titulo: 'Caminata sin rumbo', minutos: 20, temas: ['comunicacion', 'emociones'],
    descripcion: 'Caminar uno al lado del otro baja la tensión: es más fácil hablar sin mirarse de frente.',
    pasos: ['Invítalo a acompañarte a comprar algo o a dar una vuelta.', 'Deja que el silencio también exista.', 'Si habla, escucha. Si no, disfruta la compañía.', 'De regreso, agradécele por acompañarte.'],
  },
  {
    id: 'perdon', titulo: 'Pedir perdón primero', minutos: 5, temas: ['respeto', 'limites', 'comunicacion'],
    descripcion: 'Si alguna vez le levantaste la voz o fuiste injusto, nombra eso y pide disculpas.',
    pasos: ['Recuerda un momento concreto en que te equivocaste.', 'Díselo con calma: “Ese día no estuvo bien cómo te hablé”.', 'No lo acompañes de un sermón.', 'Observa cómo cambia el ambiente.'],
  },
  {
    id: 'acuerdo', titulo: 'Un acuerdo, no una orden', minutos: 15, temas: ['limites', 'celular', 'sueno'],
    descripcion: 'Elijan juntos una regla de la casa y decidan cómo se va a cumplir.',
    pasos: ['Escojan un tema: horarios, celular, tareas o salidas.', 'Escucha primero su propuesta.', 'Lleguen a un acuerdo que ambos puedan cumplir.', 'Escríbanlo y péguenlo en un lugar visible.'],
  },
]
