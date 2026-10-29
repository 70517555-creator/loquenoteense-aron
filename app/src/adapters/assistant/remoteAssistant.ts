import type { AssistantPort, Mensaje } from '../../ports/AssistantPort'

const TIEMPO_LIMITE_MS = 20_000
const MAX_MENSAJES = 12
const MAX_CARACTERES_POR_MENSAJE = 1_500

const aFormatoDeChat = (mensajes: Mensaje[]) =>
  mensajes.slice(-MAX_MENSAJES).map((m) => ({
    role: m.rol === 'padre' ? 'user' : 'assistant',
    content: m.texto.slice(0, MAX_CARACTERES_POR_MENSAJE),
  }))

async function leerRespuesta(res: Response): Promise<string> {
  if (!res.ok) throw new Error(`El asistente respondió ${res.status}`)
  const { reply } = (await res.json()) as { reply?: string }
  if (!reply) throw new Error('Respuesta vacía')
  return reply
}

export function crearRemoteAssistant(url: string): AssistantPort {
  return {
    async responder({ modo, mensajes, grado }) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
        body: JSON.stringify({ modo, grado, mensajes: aFormatoDeChat(mensajes) }),
      })
      return { texto: await leerRespuesta(res), fuente: 'ia' }
    },
  }
}
