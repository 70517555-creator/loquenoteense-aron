import type { ResumenDeVisitas } from '../domain/estadisticas'

export interface EstadisticasPort {
  contarVisita(fecha: string, primeraVez: boolean): Promise<void>
  totalDeVisitas(): Promise<number>
  resumenDeVisitas(fechas: string[]): Promise<ResumenDeVisitas>
}
