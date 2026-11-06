import { useEffect, useState } from 'react'
import { useServicios } from '../../app/servicios'
import type { CartaDeEstudiante, ConsejoDeCarta } from '../../domain/mochila'
import type { AssistantPort } from '../../ports/AssistantPort'
import { pedirEnFila } from './colaDeIA'

const PREFIJO_DE_GUARDADO = 'consejo-ia:'

const preguntaParaLaIA = (carta: CartaDeEstudiante) =>
  `Un estudiante de ${carta.nivel.toLowerCase() || 'secundaria'} del colegio escribió esta carta anónima para los papás: "${carta.texto}". ` +
  '¿Qué puede estar sintiendo un chico que escribe esto y qué podría decirle un papá o una mamá si su hijo le contara algo así?'

// Solo sirve la respuesta de la IA: la guía local es genérica y no habla de esta carta.
export async function pedirConsejoALaIA(asistente: AssistantPort, carta: CartaDeEstudiante, primero = false): Promise<string | undefined> {
  const respuesta = await pedirEnFila(asistente, { modo: 'traductor', mensajes: [{ rol: 'padre', texto: preguntaParaLaIA(carta) }] }, primero)
  return respuesta.fuente === 'ia' && !respuesta.alerta ? respuesta.texto.replace(/\n{2,}/g, '\n') : undefined
}

function leerGuardado(id: string) {
  try {
    return localStorage.getItem(PREFIJO_DE_GUARDADO + id) ?? undefined
  } catch {
    return undefined
  }
}

function guardar(id: string, texto: string) {
  try {
    localStorage.setItem(PREFIJO_DE_GUARDADO + id, texto)
  } catch {
    // Sin almacenamiento: se volverá a pedir la próxima vez.
  }
}

// El consejo de psicología (o el que se aprobó con la carta); si aún no hay, la IA lo prepara al momento.
export function useConsejoDeCarta(carta: CartaDeEstudiante): { consejo?: ConsejoDeCarta; preparando: boolean } {
  const { asistente } = useServicios()
  const guardado = carta.consejo ? undefined : leerGuardado(carta.id)
  const [deLaIA, setDeLaIA] = useState(guardado)
  const [preparando, setPreparando] = useState(!carta.consejo && !guardado)

  useEffect(() => {
    if (carta.consejo || deLaIA) return
    let vigente = true
    pedirConsejoALaIA(asistente, carta)
      .then((texto) => {
        if (!vigente || !texto) return
        guardar(carta.id, texto)
        setDeLaIA(texto)
      })
      .catch(() => {})
      .finally(() => vigente && setPreparando(false))
    return () => { vigente = false }
  }, [asistente, carta, deLaIA])

  if (carta.consejo) return { consejo: carta.consejo, preparando: false }
  return { consejo: deLaIA ? { texto: deLaIA, de: 'ia' } : undefined, preparando }
}
