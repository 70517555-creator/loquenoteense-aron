import {
  consejoSegunTono,
  frasesDeApertura,
  frasesDeReproche,
  respuestasDelHijoCerrado,
  respuestasDelHijoPorConfianza,
  type Tono,
} from '../../../content/guiaEnsayo'
import type { Mensaje } from '../../../ports/AssistantPort'
import { respuestaDeLaGuia, type EstrategiaDeRespuesta } from '../conversacion'
import { contiene, normalizar } from '../../../utils/texto'

const CONFIANZA_MAXIMA = respuestasDelHijoPorConfianza.length - 1

function tonoDe(mensaje: string): Tono {
  const texto = normalizar(mensaje)
  if (frasesDeReproche.some((frase) => contiene(texto, frase))) return 'reproche'
  if (frasesDeApertura.some((frase) => contiene(texto, frase))) return 'apertura'
  return 'neutro'
}

const AJUSTE_DE_CONFIANZA: Record<Tono, number> = { apertura: 1, reproche: -1, neutro: 0 }

function evaluarConversacion(mensajes: Mensaje[]) {
  let confianza = 0
  let ultimoTono: Tono = 'neutro'
  for (const { texto } of mensajes.filter((m) => m.rol === 'padre')) {
    ultimoTono = tonoDe(texto)
    confianza = Math.min(CONFIANZA_MAXIMA, Math.max(0, confianza + AJUSTE_DE_CONFIANZA[ultimoTono]))
  }
  return { confianza, ultimoTono }
}

function respuestaDelHijo(confianza: number, tono: Tono, turno: number) {
  if (tono === 'reproche') return respuestasDelHijoCerrado[turno % respuestasDelHijoCerrado.length]
  const opciones = respuestasDelHijoPorConfianza[confianza]
  return opciones[turno % opciones.length]
}

export const ensayoDeConversacion: EstrategiaDeRespuesta = ({ mensajes }) => {
  const { confianza, ultimoTono } = evaluarConversacion(mensajes)
  const hijo = respuestaDelHijo(confianza, ultimoTono, mensajes.length)
  return respuestaDeLaGuia(`— ${hijo}\n\n${consejoSegunTono[ultimoTono]}`)
}
