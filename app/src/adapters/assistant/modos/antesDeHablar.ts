import {
  consejoSobreGritos,
  estructuraRecomendada,
  lenguajeCercano,
  revisiones,
} from '../../../content/guiaAntesDeHablar'
import { respuestaDeLaGuia, ultimoMensajeDelPadre, vinetas, type EstrategiaDeRespuesta } from '../conversacion'
import { detectarTema } from '../temas'
import { normalizar } from '../../../utils/texto'

const SIGNOS_REPETIDOS = /!{2,}/
const PALABRA_EN_MAYUSCULAS = /\b[A-ZÁÉÍÓÚÑ]{5,}\b/

const pareceGrito = (original: string) => SIGNOS_REPETIDOS.test(original) || PALABRA_EN_MAYUSCULAS.test(original)

function consejosPara(original: string, normalizado: string): string[] {
  const consejos = revisiones.filter((r) => r.patron.test(normalizado)).map((r) => r.consejo)
  return pareceGrito(original) ? [...consejos, consejoSobreGritos] : consejos
}

function valoracion(consejos: string[], esCercano: boolean): string {
  if (consejos.length) return `🔍 Algunas cosas a cuidar:\n${vinetas(consejos)}`
  return esCercano
    ? '✅ Tu mensaje suena cercano y respetuoso. ¡Adelante!'
    : '✅ No veo frases que suenen a reclamo. Para hacerlo aún más cercano, empieza contando cómo te sientes.'
}

export const antesDeHablar: EstrategiaDeRespuesta = ({ mensajes }) => {
  const original = ultimoMensajeDelPadre(mensajes)
  const normalizado = normalizar(original)
  const consejos = consejosPara(original, normalizado)
  const esCercano = lenguajeCercano.test(normalizado)

  const partes = [valoracion(consejos, esCercano), estructuraRecomendada]
  if (esCercano && consejos.length) partes.push('Lo bueno: ya hablas desde lo que sientes. ¡Eso ayuda mucho!')

  return respuestaDeLaGuia(partes.join('\n\n'), detectarTema(normalizado)?.enlaces)
}
