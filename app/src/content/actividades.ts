export interface Actividad {
  id: string
  titulo: string
  descripcion: string
  youtube: string
}

// Videos "no listados" de YouTube. Los más nuevos van primero.
export const actividades: Actividad[] = [
  {
    id: 'entrega-2',
    titulo: 'Segunda entrega de la escuela para padres',
    descripcion: 'Así vivimos la segunda entrega del proyecto "Lo que no te enseñaron" con las familias del Cristo Moreno.',
    youtube: 'https://youtu.be/02Xa8b0RAyc',
  },
]
