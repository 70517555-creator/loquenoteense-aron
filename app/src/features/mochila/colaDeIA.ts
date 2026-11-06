import type { AssistantPort, PeticionAsistente, RespuestaAsistente } from '../../ports/AssistantPort'

// El asistente acepta pocos pedidos por minuto desde un mismo internet (el del colegio es uno solo).
// Por eso las cartas piden a la IA de una en una y, si el asistente dice "espera", se vuelve a intentar.
const PAUSA_ENTRE_PEDIDOS_MS = 1_500
const ESPERAS_PARA_REINTENTAR_MS = [12_000, 25_000]

const pendientes: Array<() => Promise<void>> = []
let atendiendo = false

const esperar = (ms: number) => new Promise((listo) => setTimeout(listo, ms))

async function atender() {
  if (atendiendo) return
  atendiendo = true
  while (pendientes.length) {
    await pendientes.shift()!()
    await esperar(PAUSA_ENTRE_PEDIDOS_MS)
  }
  atendiendo = false
}

async function intentarVarias(asistente: AssistantPort, peticion: PeticionAsistente) {
  let respuesta = await asistente.responder(peticion)
  for (const espera of ESPERAS_PARA_REINTENTAR_MS) {
    if (respuesta.fuente === 'ia' || respuesta.alerta) break
    await esperar(espera)
    respuesta = await asistente.responder(peticion)
  }
  return respuesta
}

// "primero": lo que psicología pidió con un clic pasa adelante de la fila.
export function pedirEnFila(asistente: AssistantPort, peticion: PeticionAsistente, primero = false): Promise<RespuestaAsistente> {
  return new Promise((resolver, fallar) => {
    const tarea = () => intentarVarias(asistente, peticion).then(resolver, fallar)
    if (primero) pendientes.unshift(tarea)
    else pendientes.push(tarea)
    void atender()
  })
}
