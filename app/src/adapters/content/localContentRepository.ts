import { cargas } from '../../content/cargas'
import { episodios } from '../../content/episodios'
import { escenarios } from '../../content/escenarios'
import { recursos } from '../../content/recursos'
import { retos } from '../../content/retos'
import { situaciones } from '../../content/situaciones'
import { tendencias } from '../../content/tendencias'
import { voces } from '../../content/voces'
import type { ContentRepository } from '../../ports/ContentRepository'

export const localContentRepository: ContentRepository = {
  cargas: async () => cargas,
  situaciones: async () => situaciones,
  escenarios: async () => escenarios,
  voces: async () => voces,
  retos: async () => retos,
  tendencias: async () => tendencias,
  recursos: async () => recursos,
  episodios: async () => episodios,
}
