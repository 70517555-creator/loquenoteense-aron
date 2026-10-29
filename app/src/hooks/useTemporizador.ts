import { useEffect, useState } from 'react'

const INTERVALO_MS = 250
const VIBRACION_AL_TERMINAR = [200, 100, 200]

export function useTemporizador(minutos: number) {
  const duracion = minutos * 60_000
  const [finEn, setFinEn] = useState<number | null>(null)
  const [restante, setRestante] = useState(duracion)
  const [ahora, setAhora] = useState(0)
  const corriendo = finEn !== null

  useEffect(() => {
    if (finEn === null) return
    const id = setInterval(() => {
      const instante = Date.now()
      setAhora(instante)
      if (instante < finEn) return
      setFinEn(null)
      setRestante(0)
      navigator.vibrate?.(VIBRACION_AL_TERMINAR)
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [finEn])

  const ms = corriendo ? Math.min(restante, finEn - ahora) : restante

  const pausar = () => {
    setRestante(finEn! - Date.now())
    setFinEn(null)
  }

  const iniciar = () => {
    if (restante <= 0) return
    const instante = Date.now()
    setAhora(instante)
    setFinEn(instante + restante)
  }

  return {
    ms,
    corriendo,
    terminado: ms <= 0,
    alternar: corriendo ? pausar : iniciar,
    reiniciar: () => {
      setFinEn(null)
      setRestante(duracion)
    },
  }
}
