import { MODOS_VALIDOS } from './instrucciones.js'

const MAX_MENSAJES = 12
const MAX_CARACTERES_POR_MENSAJE = 1500
const ROLES_VALIDOS = new Set(['user', 'assistant'])

const esMensajeValido = (m) => ROLES_VALIDOS.has(m?.role) && typeof m.content === 'string'

export function validarPedido(cuerpo) {
  const { modo, mensajes, grado } = cuerpo || {}
  const tieneMensajes = Array.isArray(mensajes) && mensajes.length > 0 && mensajes.length <= MAX_MENSAJES
  if (!MODOS_VALIDOS.includes(modo) || !tieneMensajes) return null

  return {
    modo,
    grado,
    mensajes: mensajes
      .filter(esMensajeValido)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES_POR_MENSAJE) })),
  }
}
