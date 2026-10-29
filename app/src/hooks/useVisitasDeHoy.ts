import { useCallback } from 'react'
import { CLAVES_DE_PROGRESO } from '../app/clavesDeProgreso'
import { agregarSinRepetir } from '../utils/listas'
import { fechaDeHoy } from '../utils/tiempo'
import { usePersistente } from './usePersistente'

type VisitasDelDia = { dia: string; habitaciones: string[] }

const SIN_VISITAS: VisitasDelDia = { dia: '', habitaciones: [] }

const habitacionesDeHoy = (visitas: VisitasDelDia) => (visitas.dia === fechaDeHoy() ? visitas.habitaciones : [])

export function useVisitasDeHoy() {
  const [visitas, setVisitas] = usePersistente<VisitasDelDia>(CLAVES_DE_PROGRESO.visitasDelDia, SIN_VISITAS)

  const registrar = useCallback(
    (habitacion: string) =>
      setVisitas((previo) => ({ dia: fechaDeHoy(), habitaciones: agregarSinRepetir(habitacionesDeHoy(previo), habitacion) })),
    [setVisitas],
  )

  return { visitadasHoy: habitacionesDeHoy(visitas), registrar }
}
