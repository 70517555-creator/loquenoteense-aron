import { useCallback } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { useServicios } from '../../app/servicios'
import { temasDeReserva } from '../../content/temasDeReserva'
import type { TemaDelDia } from '../../domain/foro'
import { useConsulta } from '../../hooks/useConsulta'
import { usePersistente } from '../../hooks/usePersistente'
import { agregarSinRepetir } from '../../utils/listas'
import { diaDelAnio, fechaDeHoy } from '../../utils/tiempo'

export const PREFIJO_DE_RESERVA = 'reserva-'

function temaDeReserva(fecha: string): TemaDelDia {
  const tema = temasDeReserva[diaDelAnio() % temasDeReserva.length]
  return { id: `${PREFIJO_DE_RESERVA}${fecha}`, fecha, ...tema }
}

export function useTemaDeHoy() {
  const { foro } = useServicios()
  const hoy = fechaDeHoy()
  return useConsulta(useCallback(async () => (await foro.temaDeLaFecha(hoy)) ?? temaDeReserva(hoy), [foro, hoy]))
}

export function useTemasAnteriores() {
  const { foro } = useServicios()
  const hoy = fechaDeHoy()
  return useConsulta(useCallback(() => foro.temasAnteriores(hoy), [foro, hoy]))
}

export function useComentarios(temaId: string) {
  const { foro } = useServicios()
  return useConsulta(useCallback(() => foro.comentarios(temaId), [foro, temaId]))
}

export function usePropuestas() {
  const { foro } = useServicios()
  return useConsulta(useCallback(() => foro.propuestas(), [foro]))
}

export function useVotosPropios() {
  const [votos, setVotos] = usePersistente<string[]>(CLAVES_DE_PROGRESO.votosDelForo, [])
  const yaVoto = (id: string) => votos.includes(id)
  const registrarVoto = (id: string) => setVotos((previos) => agregarSinRepetir(previos, id))
  return { yaVoto, registrarVoto }
}
