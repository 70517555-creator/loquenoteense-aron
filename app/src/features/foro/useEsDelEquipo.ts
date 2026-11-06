import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import type { Psicologo } from '../../domain/foro'
import { useConsulta } from '../../hooks/useConsulta'

export function usePsicologoActual(): Psicologo | null {
  const { panel } = useServicios()
  const { datos } = useConsulta(useCallback(() => panel.sesionActual(), [panel]))
  return datos ?? null
}

export function useEsDelEquipo() {
  return Boolean(usePsicologoActual())
}
