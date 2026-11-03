import type { EstadoDePublicacion } from './foro'

export type RespuestaDeCasa = 'si' | 'aveces' | 'no'

export type ConteoDeCasa = Record<RespuestaDeCasa, number>

export interface ResultadoDeCasa {
  conteo: ConteoDeCasa
  miRespuesta?: RespuestaDeCasa
}

// Consejo para los papás que acompaña a una carta: lo escribe psicología o lo prepara la IA.
export interface ConsejoDeCarta {
  texto: string
  de: 'psicologia' | 'ia'
}

export interface CartaDeEstudiante {
  id: string
  carga: string
  texto: string
  nivel: string
  estado: EstadoDePublicacion
  urgente: boolean
  meHizoPensar: number
  creadoEn: Date
  esMia: boolean
  motivoRechazo?: string
  consejo?: ConsejoDeCarta
}

export interface NuevaCartaDeEstudiante {
  carga: string
  texto: string
  nivel: string
  urgente: boolean
}

export const OPCIONES_DE_CASA: { valor: RespuestaDeCasa; texto: string }[] = [
  { valor: 'si', texto: 'Sí, me pasa' },
  { valor: 'aveces', texto: 'A veces' },
  { valor: 'no', texto: 'No me pasa' },
]

export const CONTEO_VACIO: ConteoDeCasa = { si: 0, aveces: 0, no: 0 }

// Con pocas respuestas un porcentaje engaña: esperamos a tener una muestra razonable.
export const MINIMO_PARA_PORCENTAJE = 10

// Las cartas del bolsillo secreto llegan sin tema: la IA lo sugiere y psicología lo confirma al aprobar.
export const CARGA_POR_CLASIFICAR = 'por-clasificar'

export const NIVELES_DE_ESTUDIANTE = ['Secundaria', '6.° de primaria']

export const LARGO_MAXIMO_CARTA_DE_ESTUDIANTE = 800

export const MOTIVOS_DE_RECHAZO_DE_CARTA = [
  'Tiene nombres o datos que permiten reconocerte',
  'No es respetuosa con otras personas',
  'Necesita atención directa: acércate a psicología del colegio, estamos para ti',
]

export const totalDe = (conteo: ConteoDeCasa) => conteo.si + conteo.aveces + conteo.no

export const lesPasa = (conteo: ConteoDeCasa) => conteo.si + conteo.aveces
