import type { AssistantPort, ModoAsistente } from '../../ports/AssistantPort'
import type { EstrategiaDeRespuesta } from './conversacion'
import { antesDeHablar } from './modos/antesDeHablar'
import { ensayoDeConversacion } from './modos/ensayoDeConversacion'
import { queSignifica } from './modos/queSignifica'
import { retoAMedida } from './modos/retoAMedida'
import { traductorDeEmociones } from './modos/traductorDeEmociones'

const ESTRATEGIAS: Record<ModoAsistente, EstrategiaDeRespuesta> = {
  traductor: traductorDeEmociones,
  ensayo: ensayoDeConversacion,
  antes: antesDeHablar,
  significa: queSignifica,
  reto: retoAMedida,
}

export const localAssistant: AssistantPort = {
  responder: async (peticion) => ESTRATEGIAS[peticion.modo](peticion),
}
