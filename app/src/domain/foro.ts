export type EstadoDePublicacion = 'pendiente' | 'aprobado' | 'rechazado'
export type RolDeAutor = 'padre' | 'psicologia'
export type Decision = Exclude<EstadoDePublicacion, 'pendiente'>

export interface TemaDelDia {
  id: string
  titulo: string
  descripcion: string
  fecha: string
}

export interface Comentario {
  id: string
  temaId: string
  temaTitulo: string
  texto: string
  apodo: string
  rol: RolDeAutor
  estado: EstadoDePublicacion
  urgente: boolean
  meAyudo: number
  creadoEn: Date
  esMio: boolean
  motivoRechazo?: string
  respondeA?: string
}

export interface Propuesta {
  id: string
  texto: string
  nivel?: string
  estado: EstadoDePublicacion
  votos: number
  creadoEn: Date
  esMia: boolean
  motivoRechazo?: string
  fechaProgramada?: string
}

export interface Reporte {
  id: string
  ruta: string
  texto: string
  motivo: string
  creadoEn: Date
}

export interface Psicologo {
  correo: string
  nombre: string
  coordinador: boolean
}

export interface ResumenDelForo {
  publicados: number
  pendientes: number
  propuestas: number
  reportes: number
  temasProgramados: number
  equipo: number
  cartas: number
}

export interface NuevoComentario {
  tema: TemaDelDia
  texto: string
  apodo: string
  urgente: boolean
}

export const LARGO_MAXIMO_COMENTARIO = 800
export const LARGO_MAXIMO_PROPUESTA = 200

export const MOTIVOS_DE_RECHAZO = [
  'Incluye nombres o datos personales',
  'No es respetuoso con otras personas',
  'No tiene relación con el tema',
  'Necesita atención directa: te escribiremos por los canales del colegio',
]

export const MOTIVO_AL_RETIRAR = 'Se retiró después de una revisión del equipo de psicología.'

export const MOTIVOS_DE_REPORTE = ['Tiene datos personales', 'Es ofensivo o irrespetuoso', 'Me preocupa la seguridad de alguien', 'Otro motivo']

export const masRecientePrimero = <T extends { creadoEn: Date }>(a: T, b: T) => b.creadoEn.getTime() - a.creadoEn.getTime()
export const masAntiguoPrimero = <T extends { creadoEn: Date }>(a: T, b: T) => a.creadoEn.getTime() - b.creadoEn.getTime()
