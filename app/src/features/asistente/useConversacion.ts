import { useState } from 'react'
import { useServicios } from '../../app/servicios'
import { escenaInicialDelEnsayo } from '../../content/guiaEnsayo'
import type { Mensaje, ModoAsistente, RespuestaAsistente } from '../../ports/AssistantPort'

export type Burbuja = Mensaje & Partial<Omit<RespuestaAsistente, 'texto'>>

const ERROR_INESPERADO: Burbuja = {
  rol: 'asistente',
  texto: 'No pude responder ahora. Inténtalo en un momento.',
  fuente: 'guia',
}

const mensajesIniciales = (modo: ModoAsistente): Burbuja[] =>
  modo === 'ensayo' ? [{ rol: 'asistente', texto: escenaInicialDelEnsayo }] : []

const soloTexto = (burbujas: Burbuja[]): Mensaje[] => burbujas.map(({ rol, texto }) => ({ rol, texto }))

export function useConversacion(modo: ModoAsistente) {
  const { asistente } = useServicios()
  const [mensajes, setMensajes] = useState(() => mensajesIniciales(modo))
  const [pensando, setPensando] = useState(false)

  const agregar = (burbuja: Burbuja) => setMensajes((anteriores) => [...anteriores, burbuja])

  async function enviar(texto: string, grado?: string) {
    if (pensando) return
    const historial: Burbuja[] = [...mensajes, { rol: 'padre', texto }]
    setMensajes(historial)
    setPensando(true)
    try {
      const respuesta = await asistente.responder({ modo, grado, mensajes: soloTexto(historial) })
      agregar({ rol: 'asistente', ...respuesta })
    } catch {
      agregar(ERROR_INESPERADO)
    } finally {
      setPensando(false)
    }
  }

  return { mensajes, pensando, enviar }
}
