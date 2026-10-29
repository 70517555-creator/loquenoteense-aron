import { useState } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { Escenario } from '../../domain/tipos'
import { usePersistente } from '../../hooks/usePersistente'

export function useCuestionario(escenarios: Escenario[]) {
  const [paso, setPaso] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [eleccion, setEleccion] = useState<number | null>(null)
  const [mejorResultado, setMejorResultado] = usePersistente(CLAVES_DE_PROGRESO.mejorResultadoZapatos, 0)

  const total = escenarios.length
  const escenario = escenarios[paso] as Escenario | undefined
  const respondio = eleccion !== null

  const elegir = (opcion: number) => {
    if (respondio || !escenario) return
    setEleccion(opcion)
    if (opcion === escenario.mejor) setAciertos((a) => a + 1)
  }

  const continuar = () => {
    const eraElUltimo = paso + 1 >= total
    if (eraElUltimo) setMejorResultado((mejor) => Math.max(mejor, aciertos))
    setPaso((p) => p + 1)
    setEleccion(null)
  }

  const reiniciar = () => {
    setPaso(0)
    setAciertos(0)
    setEleccion(null)
  }

  return {
    paso,
    total,
    escenario,
    eleccion,
    respondio,
    aciertos,
    mejorResultado,
    terminado: paso >= total,
    elegir,
    continuar,
    reiniciar,
  }
}
