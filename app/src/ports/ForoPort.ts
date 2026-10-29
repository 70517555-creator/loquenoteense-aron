import type {
  Comentario, Decision, NuevoComentario, Propuesta, Psicologo, Reporte, ResumenDelForo, TemaDelDia,
} from '../domain/foro'
import type { CartaDeEstudiante, ConteoDeCasa } from '../domain/mochila'

export interface ForoPort {
  temaDeLaFecha(fecha: string): Promise<TemaDelDia | null>
  temasAnteriores(hasta: string): Promise<TemaDelDia[]>
  comentarios(temaId: string): Promise<Comentario[]>
  comentar(nuevo: NuevoComentario): Promise<void>
  marcarMeAyudo(comentario: Comentario): Promise<void>
  propuestas(): Promise<Propuesta[]>
  proponer(texto: string, nivel?: string): Promise<void>
  votar(propuesta: Propuesta): Promise<void>
  reportar(ruta: string, texto: string, motivo: string): Promise<void>
}

export interface Pendientes {
  comentarios: Comentario[]
  propuestas: Propuesta[]
  cartas: CartaDeEstudiante[]
}

export interface PanelDePsicologiaPort {
  sesionActual(): Promise<Psicologo | null>
  entrarConGoogle(): Promise<Psicologo | null>
  salir(): Promise<void>
  pendientes(): Promise<Pendientes>
  moderarComentario(comentario: Comentario, decision: Decision, motivo?: string): Promise<void>
  moderarPropuesta(propuesta: Propuesta, decision: Decision, motivo?: string): Promise<void>
  moderarCarta(carta: CartaDeEstudiante, decision: Decision, motivo?: string): Promise<void>
  responder(comentario: Comentario, texto: string, nombre: string): Promise<void>
  propuestasAprobadas(): Promise<Propuesta[]>
  temasProgramados(desde: string): Promise<TemaDelDia[]>
  programarTema(tema: Omit<TemaDelDia, 'id'>, propuesta?: Propuesta): Promise<void>
  borrarTema(tema: TemaDelDia): Promise<void>
  reportes(): Promise<Reporte[]>
  resolverReporte(reporte: Reporte): Promise<void>
  ocultarReportado(reporte: Reporte): Promise<void>
  resumen(hoy: string): Promise<ResumenDelForo>
  resultadosDeCasa(): Promise<Record<string, ConteoDeCasa>>
  publicados(): Promise<Comentario[]>
  equipo(): Promise<Psicologo[]>
  agregarAlEquipo(psicologo: Psicologo): Promise<void>
  quitarDelEquipo(psicologo: Psicologo): Promise<void>
}
