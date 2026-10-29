import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { usePersistente } from '../../hooks/usePersistente'

type PorReto<T> = Record<string, T>

const sinClave = <T,>(registro: PorReto<T>, clave: string): PorReto<T> =>
  Object.fromEntries(Object.entries(registro).filter(([k]) => k !== clave))

export function useProgresoDeRetos() {
  const [cumplidos, setCumplidos] = usePersistente<PorReto<string>>(CLAVES_DE_PROGRESO.retosCumplidos, {})
  const [pasos, setPasos] = usePersistente<PorReto<boolean[]>>(CLAVES_DE_PROGRESO.pasosDeRetos, {})
  const [notas, setNotas] = usePersistente<PorReto<string>>(CLAVES_DE_PROGRESO.notasDeRetos, {})

  return {
    totalCumplidos: Object.keys(cumplidos).length,

    estaCumplido: (id: string) => id in cumplidos,
    alternarCumplido: (id: string) =>
      setCumplidos((actual) => (id in actual ? sinClave(actual, id) : { ...actual, [id]: new Date().toISOString() })),

    pasoMarcado: (id: string, paso: number) => Boolean(pasos[id]?.[paso]),
    marcarPaso: (id: string, paso: number, marcado: boolean) =>
      setPasos((actual) => {
        const marcados = [...(actual[id] ?? [])]
        marcados[paso] = marcado
        return { ...actual, [id]: marcados }
      }),

    notaDe: (id: string) => notas[id] ?? '',
    guardarNota: (id: string, nota: string) => setNotas((actual) => ({ ...actual, [id]: nota })),
  }
}
