const MS_POR_DIA = 86_400_000

export function diaDelAnio(fecha = new Date()): number {
  const inicioDelAnio = new Date(fecha.getFullYear(), 0, 0)
  return Math.floor((fecha.getTime() - inicioDelAnio.getTime()) / MS_POR_DIA)
}

const dosDigitos = (n: number) => String(n).padStart(2, '0')

export function formatoMinutosSegundos(ms: number): string {
  const segundos = Math.max(0, Math.ceil(ms / 1000))
  return `${dosDigitos(Math.floor(segundos / 60))}:${dosDigitos(segundos % 60)}`
}

export function fechaDeHoy(fecha = new Date()): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`
}

export function lunesDeLaSemana(fecha = new Date()): string {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() - ((fecha.getDay() + 6) % 7))
  return fechaDeHoy(lunes)
}

export function numeroDeSemana(lunesIso: string): number {
  const [anio, mes, dia] = lunesIso.split('-').map(Number)
  return Math.floor(Date.UTC(anio, mes - 1, dia) / (7 * MS_POR_DIA))
}

const FORMATO_DE_FECHA = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })

export function fechaLegible(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.split('-').map(Number)
  return FORMATO_DE_FECHA.format(new Date(anio, mes - 1, dia))
}
