import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { frasesPortada } from '../../content/frasesPortada'
import type { ProgressStore } from '../../ports/ProgressStore'
import { indiceCircular } from '../../utils/listas'

let indiceElegido: number | undefined

export function fraseDeLaVisita(progreso: ProgressStore): string {
  if (indiceElegido === undefined) {
    const anterior = progreso.leer(CLAVES_DE_PROGRESO.frasePortada, -1)
    indiceElegido = indiceCircular(anterior + 1, frasesPortada.length)
    progreso.guardar(CLAVES_DE_PROGRESO.frasePortada, indiceElegido)
  }
  return frasesPortada[indiceElegido]
}
