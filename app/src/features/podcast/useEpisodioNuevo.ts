import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { Episodio } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { usePersistente } from '../../hooks/usePersistente'

const DIAS_COMO_NUEVO = 30
const MS_POR_DIA = 86_400_000

export const estaPublicado = (e: Episodio) => Boolean(e.audioUrl || e.spotifyEmbed)

export function useEpisodiosEscuchados() {
  const [escuchados, setEscuchados] = usePersistente<string[]>(CLAVES_DE_PROGRESO.episodiosEscuchados, [])
  const marcar = (id: string) => setEscuchados((antes) => (antes.includes(id) ? antes : [...antes, id]))
  return { escuchados, marcar }
}

// El último episodio publicado hace menos de un mes que esta familia todavía no escuchó.
export function useEpisodioNuevo(): Episodio | undefined {
  const episodios = useContenido('episodios')
  const { escuchados } = useEpisodiosEscuchados()
  const ultimo = episodios?.filter(estaPublicado).at(-1)
  if (!ultimo || escuchados.includes(ultimo.id)) return undefined
  const dias = ultimo.publicadoEn ? (Date.now() - new Date(ultimo.publicadoEn).getTime()) / MS_POR_DIA : 0
  return dias <= DIAS_COMO_NUEVO ? ultimo : undefined
}
