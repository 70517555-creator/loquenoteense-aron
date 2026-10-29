export interface Habitacion {
  id: string
  titulo: string
  ruta: string
  icono: string
  frase: string
}

export const habitaciones: Habitacion[] = [
  { id: 'explorar', titulo: 'Explorar situaciones', ruta: '/explorar', icono: 'people', frase: 'Dos miradas, una misma casa' },
  { id: 'mochila', titulo: 'La mochila de tu hijo', ruta: '/mochila', icono: 'bag', frase: 'Lo que carga y no te cuenta' },
  { id: 'zapatos', titulo: 'Ponte en mis zapatos', ruta: '/zapatos', icono: 'shoe', frase: '¿Tú qué harías?' },
  { id: 'voces', titulo: 'Voces reales', ruta: '/voces', icono: 'chat', frase: 'Lo que dicen nuestros estudiantes' },
  { id: 'retos', titulo: 'Retos en familia', ruta: '/retos', icono: 'trophy', frase: 'Pequeños pasos, grandes cambios' },
  { id: 'mundo', titulo: 'El mundo de hoy', ruta: '/mundo', icono: 'globe', frase: 'Redes, IA, videojuegos y emociones' },
  { id: 'recursos', titulo: 'Recursos para conversar', ruta: '/recursos', icono: 'book', frase: 'Preguntas que abren puertas' },
  { id: 'podcast', titulo: 'Podcast', ruta: '/podcast', icono: 'headphones', frase: 'Escúchanos de camino al trabajo' },
]

export const asistenteHabitacion: Habitacion = {
  id: 'asistente', titulo: '¿Qué pasó hoy en casa?', ruta: '/asistente', icono: 'spark', frase: 'Aquí se escucha sin juzgar',
}

export const foroHabitacion: Habitacion = {
  id: 'foro', titulo: 'Entre padres', ruta: '/foro', icono: 'chat', frase: 'El balcón donde conversan las familias',
}
