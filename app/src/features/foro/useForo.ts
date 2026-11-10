import { useCallback } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { useServicios } from '../../app/servicios'
import { preguntasDeLaSemana } from '../../content/preguntasDeLaSemana'
import { temasDeReserva } from '../../content/temasDeReserva'
import type { TemaDelDia } from '../../domain/foro'
import { useConsulta } from '../../hooks/useConsulta'
import { usePersistente } from '../../hooks/usePersistente'
import { agregarSinRepetir } from '../../utils/listas'
import { diaDelAnio, fechaDeHoy, lunesDeLaSemana, numeroDeSemana } from '../../utils/tiempo'

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

export const PREFIJO_DE_SEMANA = 'semana-'

export const preguntaPreparada = (lunes: string) => preguntasDeLaSemana[numeroDeSemana(lunes) % preguntasDeLaSemana.length]

const temaDeLaSemana = (lunes: string, pregunta = preguntaPreparada(lunes)): TemaDelDia =>
  ({ id: `${PREFIJO_DE_SEMANA}${lunes}`, fecha: lunes, ...pregunta })

export function usePreguntaDeLaSemana() {
  const { foro } = useServicios()
  const lunes = lunesDeLaSemana()
  return useConsulta(useCallback(async () => {
    const propia = await foro.preguntaDeLaSemana(lunes).catch(() => null)
    return temaDeLaSemana(lunes, propia ?? undefined)
  }, [foro, lunes]))
}

// Muestra al instante la pregunta preparada mientras llega la que haya escrito psicología.
export function usePreguntaDeLaSemanaInmediata(): TemaDelDia {
  const { datos } = usePreguntaDeLaSemana()
  return datos ?? temaDeLaSemana(lunesDeLaSemana())
}

export function useTemasAnteriores() {
  const { foro } = useServicios()
  const hoy = fechaDeHoy()
  return useConsulta(useCallback(() => foro.temasAnteriores(hoy), [foro, hoy]))
}

const SEMANAS_EN_EL_ARCHIVO = 16

export interface SemanaArchivada {
  tema: TemaDelDia
  publicados: number
}

// Las preguntas de semanas pasadas no viven en la lista de temas: se arman por fecha y solo se muestran las que tienen comentarios.
export function useSemanasAnteriores() {
  const { foro } = useServicios()
  const lunes = lunesDeLaSemana()
  return useConsulta(useCallback(async () => {
    const [anio, mes, dia] = lunes.split('-').map(Number)
    const semanas = Array.from({ length: SEMANAS_EN_EL_ARCHIVO }, (_, i) => fechaDeHoy(new Date(anio, mes - 1, dia - 7 * (i + 1))))
    const archivo = await Promise.all(semanas.map(async (otroLunes): Promise<SemanaArchivada> => {
      const [propia, publicados] = await Promise.all([
        foro.preguntaDeLaSemana(otroLunes).catch(() => null),
        foro.cuantosPublicados(`${PREFIJO_DE_SEMANA}${otroLunes}`).catch(() => 0),
      ])
      return { tema: temaDeLaSemana(otroLunes, propia ?? undefined), publicados }
    }))
    return archivo.filter((s) => s.publicados > 0)
  }, [foro, lunes]))
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

export const PARAMETRO_RESPONDER = 'responder'

export function useSemanaRespondida() {
  const [lunesRespondido, setLunesRespondido] = usePersistente<string | null>(CLAVES_DE_PROGRESO.semanaRespondida, null)
  const lunes = lunesDeLaSemana()
  return { respondida: lunesRespondido === lunes, marcarRespondida: () => setLunesRespondido(lunes) }
}
