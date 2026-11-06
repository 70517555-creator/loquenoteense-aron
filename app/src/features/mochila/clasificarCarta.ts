import type { CargaDelHijo } from '../../domain/tipos'
import type { AssistantPort } from '../../ports/AssistantPort'
import { pedirEnFila } from './colaDeIA'

// La IA elige de qué tema de la mochila habla una carta; psicología puede cambiarlo antes de aprobar.
export async function clasificarCarta(asistente: AssistantPort, texto: string, cargas: CargaDelHijo[], primero = false): Promise<string | undefined> {
  const opciones = cargas.map((c, i) => `${i + 1}) ${c.titulo}`).join('\n')
  const pregunta =
    `Un estudiante escribió esta carta anónima para los papás: "${texto}".\n` +
    `¿De cuál de estos temas habla más? Responde solo con el número.\n${opciones}`
  const respuesta = await pedirEnFila(asistente, { modo: 'traductor', mensajes: [{ rol: 'padre', texto: pregunta }] }, primero)
  if (respuesta.fuente !== 'ia') return undefined
  const numero = Number(respuesta.texto.match(/\d+/)?.[0])
  return cargas[numero - 1]?.id
}
