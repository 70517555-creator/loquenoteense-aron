import type {
  CargaDelHijo, Episodio, Escenario, GrupoRecursos, Reto, Situacion, Tendencia, Voz,
} from '../domain/tipos'

export interface ContentRepository {
  cargas(): Promise<CargaDelHijo[]>
  situaciones(): Promise<Situacion[]>
  escenarios(): Promise<Escenario[]>
  voces(): Promise<Voz[]>
  retos(): Promise<Reto[]>
  tendencias(): Promise<Tendencia[]>
  recursos(): Promise<GrupoRecursos[]>
  episodios(): Promise<Episodio[]>
}
