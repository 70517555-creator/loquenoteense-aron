import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { Carta } from '../../domain/tipos'
import { usePersistente } from '../../hooks/usePersistente'

export function useCartas() {
  const [cartas, setCartas] = usePersistente<Carta[]>(CLAVES_DE_PROGRESO.cartasDelBolsillo, [])

  const guardar = (de: Carta['de'], texto: string) =>
    setCartas((previas) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, de, texto: texto.trim(), fecha: new Date().toISOString(), leida: false },
      ...previas,
    ])

  const marcarLeida = (id: string) => setCartas((previas) => previas.map((c) => (c.id === id ? { ...c, leida: true } : c)))

  const borrar = (id: string) => setCartas((previas) => previas.filter((c) => c.id !== id))

  return { cartas, sinLeer: cartas.filter((c) => !c.leida).length, guardar, marcarLeida, borrar }
}

export type Cartas = ReturnType<typeof useCartas>
