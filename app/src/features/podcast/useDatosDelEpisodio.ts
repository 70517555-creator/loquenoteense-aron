import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { useConsulta } from '../../hooks/useConsulta'

// Reacciones y contadores del episodio, pedidos una sola vez para toda la página.
export function useDatosDelEpisodio(episodio: string) {
  const { podcast } = useServicios()
  return useConsulta(useCallback(() => podcast.reacciones(episodio), [podcast, episodio]))
}
