import { createContext, useContext } from 'react'
import { localAssistant } from '../adapters/assistant/localAssistant'
import { crearRemoteAssistant } from '../adapters/assistant/remoteAssistant'
import { crearResilientAssistant } from '../adapters/assistant/resilientAssistant'
import { localContentRepository } from '../adapters/content/localContentRepository'
import { localProgressStore } from '../adapters/progress/localProgressStore'
import { config } from '../config'
import { perezoso } from '../utils/perezoso'
import type { AssistantPort } from '../ports/AssistantPort'
import type { ContentRepository } from '../ports/ContentRepository'
import type { ForoPort, PanelDePsicologiaPort } from '../ports/ForoPort'
import type { MochilaPort } from '../ports/MochilaPort'
import type { ProgressStore } from '../ports/ProgressStore'

export interface Servicios {
  contenido: ContentRepository
  asistente: AssistantPort
  progreso: ProgressStore
  foro: ForoPort
  panel: PanelDePsicologiaPort
  mochila: MochilaPort
  conIA: boolean
}

function crearAsistente(): AssistantPort {
  const principal = config.urlAsistente ? crearRemoteAssistant(config.urlAsistente) : localAssistant
  return crearResilientAssistant(principal, localAssistant)
}

export const servicios: Servicios = {
  contenido: localContentRepository,
  asistente: crearAsistente(),
  progreso: localProgressStore,
  foro: perezoso(() => import('../adapters/foro/firestoreForo').then((m) => m.firestoreForo)),
  panel: perezoso(() => import('../adapters/foro/firestorePanel').then((m) => m.firestorePanel)),
  mochila: perezoso(() => import('../adapters/foro/firestoreMochila').then((m) => m.firestoreMochila)),
  conIA: Boolean(config.urlAsistente),
}

export const ContextoDeServicios = createContext<Servicios>(servicios)

export const useServicios = () => useContext(ContextoDeServicios)
