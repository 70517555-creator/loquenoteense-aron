export const REACCIONES = ['ayudo', 'identifique', 'intentare', 'emociono'] as const

export type Reaccion = (typeof REACCIONES)[number]

export type ConteoDeReacciones = Record<Reaccion, number>

export interface ReaccionesDelEpisodio {
  conteo: ConteoDeReacciones
  miReaccion?: Reaccion
  compartido: number
  reproducciones: number
}

export const sinReacciones = (): ConteoDeReacciones => ({ ayudo: 0, identifique: 0, intentare: 0, emociono: 0 })
