import { lazy } from 'react'

export const paginas = {
  inicio: lazy(() => import('../features/inicio/Inicio')),
  casa: lazy(() => import('../features/casa/Casa')),
  mochila: lazy(() => import('../features/mochila/Mochila')),
  explorar: lazy(() => import('../features/explorar/Explorar')),
  zapatos: lazy(() => import('../features/zapatos/Zapatos')),
  voces: lazy(() => import('../features/voces/Voces')),
  retos: lazy(() => import('../features/retos/Retos')),
  mundo: lazy(() => import('../features/mundo/Mundo')),
  recursos: lazy(() => import('../features/recursos/Recursos')),
  podcast: lazy(() => import('../features/podcast/Podcast')),
  asistente: lazy(() => import('../features/asistente/Asistente')),
  foro: lazy(() => import('../features/foro/Foro')),
  psicologia: lazy(() => import('../features/psicologia/Psicologia')),
  privacidad: lazy(() => import('../features/privacidad/Privacidad')),
  noEncontrado: lazy(() => import('../features/NoEncontrado')),
}

export type NombreDePagina = Exclude<keyof typeof paginas, 'inicio' | 'noEncontrado'>
