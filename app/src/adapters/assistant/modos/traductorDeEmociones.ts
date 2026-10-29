import { frasesHijo } from '../../../content/guiaAsistente'
import { respuestaDeLaGuia, ultimoMensajeDelPadre, type EstrategiaDeRespuesta } from '../conversacion'
import { detectarTema } from '../temas'
import { contiene, normalizar } from '../../../utils/texto'

const SIN_COINCIDENCIAS =
  'Detrás de casi todo lo que dice un adolescente hay una emoción: cansancio, miedo, vergüenza o ganas de ser escuchado.\n\n' +
  'Antes de responder, prueba nombrar lo que crees que siente: “Parece que eso te molestó mucho”. ' +
  'Escríbeme la frase exacta que te dijo y te ayudo a traducirla.'

export const traductorDeEmociones: EstrategiaDeRespuesta = ({ mensajes }) => {
  const texto = normalizar(ultimoMensajeDelPadre(mensajes))
  const frase = frasesHijo.find((f) => f.claves.some((clave) => contiene(texto, clave)))
  const tema = detectarTema(texto)

  if (frase) {
    return respuestaDeLaGuia(
      `💬 Lo que quizá quiere decir:\n${frase.significado}\n\n🤝 Cómo podrías responder:\n${frase.responder}`,
      tema?.enlaces,
    )
  }
  if (tema) return respuestaDeLaGuia(tema.respuesta, tema.enlaces)
  return respuestaDeLaGuia(SIN_COINCIDENCIAS)
}
