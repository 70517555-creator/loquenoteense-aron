import { jerga } from '../../../content/guiaAsistente'
import { respuestaDeLaGuia, ultimoMensajeDelPadre, type EstrategiaDeRespuesta } from '../conversacion'
import { detectarTema } from '../temas'
import { contiene, normalizar } from '../../../utils/texto'

const CONSEJO = '💡 Consejo: pregúntale a tu hijo qué significa para él. “¿Me enseñas?” abre muchas puertas.'

const PALABRA_DESCONOCIDA =
  'Todavía no tengo esa palabra en mi diccionario. La jerga cambia muy rápido.\n\n' +
  'Pregúntale a tu hijo con curiosidad, sin burla: “Oye, ¿qué significa eso? ¿Me enseñas?”. ¡Es una gran excusa para conversar!'

export const queSignifica: EstrategiaDeRespuesta = ({ mensajes }) => {
  const texto = normalizar(ultimoMensajeDelPadre(mensajes))
  const halladas = Object.entries(jerga).filter(([palabra]) => contiene(texto, palabra))

  if (halladas.length === 0) return respuestaDeLaGuia(PALABRA_DESCONOCIDA, detectarTema(texto)?.enlaces)

  const definiciones = halladas.map(([palabra, significado]) => `“${palabra}”: ${significado}`)
  return respuestaDeLaGuia([...definiciones, CONSEJO].join('\n\n'))
}
