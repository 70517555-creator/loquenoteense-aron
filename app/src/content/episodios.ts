import type { Episodio } from '../domain/tipos'

export const episodios: Episodio[] = [
  {
    id: 'ep1', numero: 1, duracion: '12 min',
    titulo: 'No vienes con manual',
    descripcion: 'Por qué nadie nos enseñó a ser padres, y por qué nunca es tarde para aprender.',
  },
  {
    id: 'ep2', numero: 2, duracion: '15 min',
    titulo: 'Qué hay detrás de la puerta cerrada',
    descripcion: 'Adolescencia, silencio y espacio propio: cuándo acercarse y cuándo esperar.',
  },
  {
    id: 'ep3', numero: 3, duracion: '14 min',
    titulo: 'El celular no es el enemigo',
    descripcion: 'Redes, videojuegos e IA: cómo acompañar sin prohibir todo.',
  },
]
