export const indiceCircular = (indice: number, total: number) => ((indice % total) + total) % total

export const agregarSinRepetir = <T,>(lista: T[], item: T) => (lista.includes(item) ? lista : [...lista, item])

export const porcentaje = (parte: number, total: number) => (total ? (parte / total) * 100 : 0)

export const rotar = <T,>(lista: T[], pasos: number) => {
  const inicio = indiceCircular(pasos, lista.length)
  return [...lista.slice(inicio), ...lista.slice(0, inicio)]
}
