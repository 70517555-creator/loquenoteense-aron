export function pseudoaleatorio(indice: number, semilla: number): number {
  const valor = Math.sin(indice * 12.9898 + semilla * 78.233) * 43758.5453
  return valor - Math.floor(valor)
}

export const repetir = <T,>(cantidad: number, crear: (indice: number) => T): T[] =>
  Array.from({ length: cantidad }, (_, i) => crear(i))
