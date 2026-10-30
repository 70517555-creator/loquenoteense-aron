import { fechaDeHoy } from '../utils/tiempo'
import { CLAVES_DE_PROGRESO } from './clavesDeProgreso'
import type { Servicios } from './servicios'

const ES_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname)

// Cuenta un celular una sola vez por día. Se marca antes de enviar porque la primera visita
// recarga la página al instalar la app; si el envío falla (sin internet), se desmarca y se reintenta luego.
export async function registrarVisitaDelDia({ progreso, estadisticas }: Servicios) {
  const hoy = fechaDeHoy()
  const contadaAntes = progreso.leer<string | null>(CLAVES_DE_PROGRESO.visitaContada, null)
  if (ES_LOCAL || contadaAntes === hoy) return
  const primeraVez = !progreso.leer(CLAVES_DE_PROGRESO.yaVisito, false)
  progreso.guardar(CLAVES_DE_PROGRESO.visitaContada, hoy)
  progreso.guardar(CLAVES_DE_PROGRESO.yaVisito, true)
  try {
    await estadisticas.contarVisita(hoy, primeraVez)
  } catch {
    progreso.guardar(CLAVES_DE_PROGRESO.visitaContada, contadaAntes)
    progreso.guardar(CLAVES_DE_PROGRESO.yaVisito, !primeraVez)
  }
}
