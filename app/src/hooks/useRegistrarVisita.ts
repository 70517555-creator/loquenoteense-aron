import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useVisitasDeHoy } from './useVisitasDeHoy'

const RUTAS_QUE_NO_SON_HABITACIONES = new Set(['', 'casa'])

export function useRegistrarVisita() {
  const { pathname } = useLocation()
  const { registrar } = useVisitasDeHoy()

  useEffect(() => {
    const habitacion = pathname.split('/')[1]
    if (!RUTAS_QUE_NO_SON_HABITACIONES.has(habitacion)) registrar(habitacion)
  }, [pathname, registrar])
}
