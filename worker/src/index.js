import { evaluarOrigen } from './cors.js'
import { limpiarFormato } from './formato.js'
import { responderConGroq } from './groq.js'
import { instruccionesDelSistema } from './instrucciones.js'
import { validarPedido } from './validacion.js'

const responderJson = (cuerpo, estado, cabeceras) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...cabeceras, 'Content-Type': 'application/json' } })

async function superoElLimite(request, env) {
  if (!env.RATE_LIMITER) return false
  const ip = request.headers.get('CF-Connecting-IP') || 'anonimo'
  const { success } = await env.RATE_LIMITER.limit({ key: ip })
  return !success
}

async function leerJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export default {
  async fetch(request, env) {
    const { permitido, cabeceras } = evaluarOrigen(request, env)
    const responder = (cuerpo, estado) => responderJson(cuerpo, estado, cabeceras)

    if (request.method === 'OPTIONS') return new Response(null, { status: permitido ? 204 : 403, headers: cabeceras })
    if (request.method !== 'POST') return responder({ error: 'method' }, 405)
    if (!permitido) return responder({ error: 'origin' }, 403)
    if (await superoElLimite(request, env)) return responder({ error: 'rate' }, 429)

    const pedido = validarPedido(await leerJson(request))
    if (!pedido) return responder({ error: 'input' }, 400)

    const sistema = { role: 'system', content: instruccionesDelSistema(pedido.modo, pedido.grado) }
    const respuesta = await responderConGroq(env, [sistema, ...pedido.mensajes])
    if (!respuesta) return responder({ error: 'unavailable' }, 503)
    return responder({ reply: limpiarFormato(respuesta) }, 200)
  },
}
