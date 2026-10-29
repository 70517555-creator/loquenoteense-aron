const URL_DE_GROQ = 'https://api.groq.com/openai/v1/chat/completions'
const MODELOS_EN_ORDEN = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']
const TEMPERATURA = 0.6
const MAX_TOKENS = 1000
const ESFUERZO_DE_RAZONAMIENTO = 'low'
const SIN_CUOTA = 429

const esFallaTemporal = (estado) => estado === SIN_CUOTA || estado >= 500

async function pedirAModelo(env, modelo, mensajes) {
  const res = await fetch(URL_DE_GROQ, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelo,
      messages: mensajes,
      temperature: TEMPERATURA,
      max_tokens: MAX_TOKENS,
      reasoning_effort: ESFUERZO_DE_RAZONAMIENTO,
    }),
  })
  if (!res.ok) return { texto: null, probarSiguiente: esFallaTemporal(res.status) }
  const datos = await res.json()
  return { texto: datos.choices?.[0]?.message?.content?.trim() || null, probarSiguiente: true }
}

export async function responderConGroq(env, mensajes) {
  for (const modelo of MODELOS_EN_ORDEN) {
    const { texto, probarSiguiente } = await pedirAModelo(env, modelo, mensajes)
    if (texto) return texto
    if (!probarSiguiente) break
  }
  return null
}
