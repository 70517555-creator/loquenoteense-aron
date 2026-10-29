import { Suspense } from 'react'
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { useEnLinea } from '../hooks/useEnLinea'
import { useRegistrarVisita } from '../hooks/useRegistrarVisita'
import { Cargando } from '../ui/Cargando'
import { Icono } from '../ui/Icono'
import { LimiteDeError } from '../ui/LimiteDeError'
import { clases } from '../utils/clases'

const PESTANAS = [
  { ruta: '/casa', texto: 'Casa', icono: 'home' },
  { ruta: '/explorar', texto: 'Explorar', icono: 'people' },
  { ruta: '/retos', texto: 'Retos', icono: 'trophy' },
  { ruta: '/foro', texto: 'Foro', icono: 'chat' },
  { ruta: '/asistente', texto: 'Pregunta', icono: 'spark' },
]

function AvisoSinConexion() {
  return (
    <div className="sin-red" role="status">
      <Icono nombre="wifioff" tam={18} /> Sin internet: puedes seguir usando casi todo.
    </div>
  )
}

function Pestanas() {
  return (
    <nav className="pestanas" aria-label="Navegación principal">
      {PESTANAS.map((pestana) => (
        <NavLink key={pestana.ruta} to={pestana.ruta} className={({ isActive }) => clases('pestana', isActive && 'pestana--activa')}>
          <Icono nombre={pestana.icono} tam={24} />
          <span>{pestana.texto}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function Disposicion() {
  const { pathname } = useLocation()
  const enLinea = useEnLinea()
  useRegistrarVisita()

  return (
    <>
      {!enLinea && <AvisoSinConexion />}
      <LimiteDeError key={pathname}>
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </LimiteDeError>
      <Pestanas />
      <ScrollRestoration />
    </>
  )
}
