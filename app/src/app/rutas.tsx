import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Cargando } from '../ui/Cargando'
import { LimiteDeError } from '../ui/LimiteDeError'
import { Disposicion } from './Disposicion'
import { paginas, type NombreDePagina } from './paginas'

const { inicio: Inicio, noEncontrado: NoEncontrado, ...secciones } = paginas

const rutasDeSecciones = (Object.keys(secciones) as NombreDePagina[]).map((nombre) => {
  const Pagina = secciones[nombre]
  return { path: `/${nombre}`, element: <Pagina /> }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LimiteDeError>
        <Suspense fallback={<Cargando />}>
          <Inicio />
        </Suspense>
      </LimiteDeError>
    ),
  },
  {
    element: <Disposicion />,
    children: [...rutasDeSecciones, { path: '*', element: <NoEncontrado /> }],
  },
])
