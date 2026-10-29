import { temas, type Tema } from '../../content/guiaAsistente'
import { contiene } from '../../utils/texto'

const coincidencias = (texto: string, tema: Tema) => tema.claves.filter((clave) => contiene(texto, clave)).length

export function detectarTema(textoNormalizado: string): Tema | undefined {
  let mejor: { tema: Tema; puntos: number } | undefined
  for (const tema of temas) {
    const puntos = coincidencias(textoNormalizado, tema)
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) mejor = { tema, puntos }
  }
  return mejor?.tema
}
