import { useCallback, useSyncExternalStore } from 'react'

// true mientras la pantalla cumpla la media query (se actualiza al girar o cambiar el tamaño).
export function useMedia(consulta: string): boolean {
  const suscribir = useCallback(
    (avisar: () => void) => {
      const lista = window.matchMedia(consulta)
      lista.addEventListener('change', avisar)
      return () => lista.removeEventListener('change', avisar)
    },
    [consulta],
  )
  return useSyncExternalStore(suscribir, () => window.matchMedia(consulta).matches, () => false)
}
