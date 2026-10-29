import { hayRiesgo } from '../../domain/riesgo'
import type { AssistantPort, PeticionAsistente } from '../../ports/AssistantPort'
import { ultimoMensajeDelPadre } from './conversacion'
import { respuestaDeRiesgo } from './seguridad'

const AVISO_SIN_INTERNET = 'Sin internet: te respondo con la guía del colegio.'
const AVISO_SERVICIO_NO_DISPONIBLE = 'Nuestro asistente está descansando 💛 Mientras tanto, te respondo con la guía del colegio.'

const estaSinConexion = () => typeof navigator !== 'undefined' && !navigator.onLine

export function crearResilientAssistant(principal: AssistantPort, respaldo: AssistantPort): AssistantPort {
  const responderConRespaldo = async (peticion: PeticionAsistente, aviso: string) => ({
    ...(await respaldo.responder(peticion)),
    aviso,
  })

  return {
    async responder(peticion) {
      if (hayRiesgo(ultimoMensajeDelPadre(peticion.mensajes))) return respuestaDeRiesgo()
      if (estaSinConexion()) return responderConRespaldo(peticion, AVISO_SIN_INTERNET)
      try {
        return await principal.responder(peticion)
      } catch {
        return responderConRespaldo(peticion, AVISO_SERVICIO_NO_DISPONIBLE)
      }
    },
  }
}
