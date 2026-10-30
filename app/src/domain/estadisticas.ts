export interface VisitasDelDia {
  fecha: string
  cuenta: number
}

export interface ResumenDeVisitas {
  total: number
  dispositivos: number
  dias: VisitasDelDia[]
}

export const DIAS_EN_EL_RESUMEN = 14
