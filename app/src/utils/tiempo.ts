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

const FORMATO_RELATIVO = new Intl.RelativeTimeFormat('es-PE', { numeric: 'auto' })
const MS_POR_HORA = 3_600_000
const MS_POR_MINUTO = 60_000
const DIAS_EN_FORMATO_RELATIVO = 6

// "hace 5 minutos", "hace 3 horas", "ayer"; desde la semana pasada, la fecha corta.
export function haceCuanto(fecha: Date, ahora = new Date()): string {
  const diferencia = fecha.getTime() - ahora.getTime()
  const distancia = Math.abs(diferencia)
  if (distancia >= MS_POR_DIA * (DIAS_EN_FORMATO_RELATIVO + 1)) return fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  if (distancia >= MS_POR_DIA) return FORMATO_RELATIVO.format(Math.round(diferencia / MS_POR_DIA), 'day')
  if (distancia >= MS_POR_HORA) return FORMATO_RELATIVO.format(Math.round(diferencia / MS_POR_HORA), 'hour')
  return FORMATO_RELATIVO.format(Math.round(diferencia / MS_POR_MINUTO), 'minute')
}
