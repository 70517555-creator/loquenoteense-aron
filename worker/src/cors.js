const UN_DIA_EN_SEGUNDOS = '86400'

const origenesPermitidos = (env) =>
  (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean)

export function evaluarOrigen(request, env) {
  const origen = request.headers.get('Origin') || ''
  const permitido = origenesPermitidos(env).includes(origen)
  return {
    permitido,
    cabeceras: {
      'Access-Control-Allow-Origin': permitido ? origen : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': UN_DIA_EN_SEGUNDOS,
      Vary: 'Origin',
    },
  }
}
