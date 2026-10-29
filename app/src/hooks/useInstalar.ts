import { useEffect, useState } from 'react'

interface EventoInstalar extends Event {
  prompt(): Promise<void>
}

const estaInstalada = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

const esIPhone = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export function useInstalar() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null)
  const instalada = estaInstalada()

  useEffect(() => {
    const guardarEvento = (e: Event) => {
      e.preventDefault()
      setEvento(e as EventoInstalar)
    }
    window.addEventListener('beforeinstallprompt', guardarEvento)
    return () => window.removeEventListener('beforeinstallprompt', guardarEvento)
  }, [])

  const instalar = async () => {
    if (!evento) return
    await evento.prompt()
    setEvento(null)
  }

  return {
    puedeInstalar: Boolean(evento) && !instalada,
    mostrarAyudaIPhone: esIPhone() && !instalada,
    instalar,
  }
}
