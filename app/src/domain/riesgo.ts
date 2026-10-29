import { normalizar } from '../utils/texto'

const SENALES_DE_RIESGO = [
  'suicid', 'matarse', 'matarme', 'quitarse la vida', 'quitarme la vida', 'no quiere vivir', 'no quiero vivir',
  'quiere morir', 'quiero morir', 'morirse', 'se corta', 'cortarse', 'se cortaba', 'autolesion', 'se lastima',
  'se hace dano', 'abuso', 'abusaron', 'la tocaron', 'lo tocaron', 'violacion', 'violaron', 'le pegan en casa',
  'me pega', 'nos pega', 'amenaza con matar', 'pastillas para morir',
]

export function hayRiesgo(texto: string): boolean {
  const normalizado = normalizar(texto)
  return SENALES_DE_RIESGO.some((senal) => normalizado.includes(senal))
}
