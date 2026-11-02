import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { useConsulta } from '../../hooks/useConsulta'

export function useEsDelEquipo() {
  const { panel } = useServicios()
  const { datos } = useConsulta(useCallback(() => panel.sesionActual(), [panel]))
  return Boolean(datos)
}
