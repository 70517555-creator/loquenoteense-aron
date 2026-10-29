import type {
  Episodio, Escenario, Etiqueta, GrupoRecursos, Reto, Situacion, Tendencia, Voz,
} from '../domain/tipos'

export interface ContentRepository {
  etiquetas(): Promise<Etiqueta[]>
  situaciones(): Promise<Situacion[]>
  escenarios(): Promise<Escenario[]>
  voces(): Promise<Voz[]>
  retos(): Promise<Reto[]>
  tendencias(): Promise<Tendencia[]>
  recursos(): Promise<GrupoRecursos[]>
  episodios(): Promise<Episodio[]>
}
