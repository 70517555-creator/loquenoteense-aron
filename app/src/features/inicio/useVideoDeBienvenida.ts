import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { usePersistente } from '../../hooks/usePersistente'
import { videoDeBienvenida, type VideoDeYouTube } from './youtube'

export const PARAMETRO_ABRIR_VIDEO = 'video'

export interface VideoAbierto {
  video: VideoDeYouTube
  titulo: string
  bienvenida: boolean
}

const BIENVENIDA: VideoAbierto | null = videoDeBienvenida && { video: videoDeBienvenida, titulo: 'Video de bienvenida', bienvenida: true }

export function useVideoDeBienvenida() {
  const [params, setParams] = useSearchParams()
  const [yaLoVio, setYaLoVio] = usePersistente(CLAVES_DE_PROGRESO.videoVisto, false)
  const pidioVerlo = params.has(PARAMETRO_ABRIR_VIDEO)
  const [abierto, setAbierto] = useState<VideoAbierto | null>(
    () => (BIENVENIDA && navigator.onLine && (!yaLoVio || pidioVerlo) ? BIENVENIDA : null),
  )

  const cerrar = useCallback(() => {
    setAbierto((actual) => {
      if (actual?.bienvenida) setYaLoVio(true)
      return null
    })
    setParams({}, { replace: true })
  }, [setYaLoVio, setParams])

  return {
    bienvenida: BIENVENIDA,
    abierto,
    abrir: setAbierto,
    cerrar,
  }
}
