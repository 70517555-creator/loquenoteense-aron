import type { Enlace, Mensaje, PeticionAsistente, RespuestaAsistente } from '../../ports/AssistantPort'

export type EstrategiaDeRespuesta = (peticion: PeticionAsistente) => RespuestaAsistente

export const ultimoMensajeDelPadre = (mensajes: Mensaje[]): string =>
  mensajes.findLast((m) => m.rol === 'padre')?.texto ?? ''

export const respuestaDeLaGuia = (texto: string, enlaces?: Enlace[]): RespuestaAsistente => ({
  fuente: 'guia',
  texto,
  enlaces,
})

export const enumerar = (items: string[]) => items.map((item, i) => `${i + 1}. ${item}`).join('\n')

export const vinetas = (items: string[]) => items.map((item) => `• ${item}`).join('\n')
