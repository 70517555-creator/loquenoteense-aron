import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { usePersistente } from '../../hooks/usePersistente'
import { videoDeBienvenida } from './youtube'

export const PARAMETRO_ABRIR_VIDEO = 'video'

export function useVideoDeBienvenida() {
  const [params, setParams] = useSearchParams()
  const [yaLoVio, setYaLoVio] = usePersistente(CLAVES_DE_PROGRESO.videoVisto, false)
  const pidioVerlo = params.has(PARAMETRO_ABRIR_VIDEO)
  const [abierto, setAbierto] = useState(
    () => Boolean(videoDeBienvenida) && navigator.onLine && (!yaLoVio || pidioVerlo),
  )

  const cerrar = useCallback(() => {
    setAbierto(false)
    setYaLoVio(true)
    setParams({}, { replace: true })
  }, [setYaLoVio, setParams])

  return {
    video: videoDeBienvenida,
    abierto,
    abrir: () => setAbierto(true),
    cerrar,
  }
}
