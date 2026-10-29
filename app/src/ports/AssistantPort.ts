export type ModoAsistente = 'traductor' | 'ensayo' | 'antes' | 'significa' | 'reto'

export interface Mensaje {
  rol: 'padre' | 'asistente'
  texto: string
}

export interface PeticionAsistente {
  modo: ModoAsistente
  mensajes: Mensaje[]
  grado?: string
}

export interface Enlace {
  texto: string
  ruta: string
}

export interface RespuestaAsistente {
  texto: string
  fuente: 'ia' | 'guia'
  alerta?: boolean
  aviso?: string
  enlaces?: Enlace[]
}

export interface AssistantPort {
  responder(peticion: PeticionAsistente): Promise<RespuestaAsistente>
}
