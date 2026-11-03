import type { Reaccion, ReaccionesDelEpisodio } from '../domain/podcast'

export interface PodcastPort {
  reacciones(episodio: string): Promise<ReaccionesDelEpisodio>
  reaccionar(episodio: string, reaccion: Reaccion): Promise<void>
  contarCompartido(episodio: string): Promise<void>
}
