const DIACRITICOS = /[\u0300-\u036f]/g
const PUNTUACION = /[¿?¡!.,;:"“”()]/g
const ESPACIOS = /\s+/g

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .replace(PUNTUACION, ' ')
    .replace(ESPACIOS, ' ')
    .trim()
}

export function contiene(textoNormalizado: string, clave: string): boolean {
  return ` ${textoNormalizado} `.includes(` ${normalizar(clave)} `)
}
