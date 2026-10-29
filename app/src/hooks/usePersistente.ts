import { useCallback, useState } from 'react'
import { useServicios } from '../app/servicios'

type Actualizacion<T> = T | ((previo: T) => T)

const aplicar = <T,>(actualizacion: Actualizacion<T>, previo: T): T =>
  typeof actualizacion === 'function' ? (actualizacion as (p: T) => T)(previo) : actualizacion

export function usePersistente<T>(clave: string, inicial: T) {
  const { progreso } = useServicios()
  const [valor, setValor] = useState<T>(() => progreso.leer(clave, inicial))

  const actualizar = useCallback(
    (actualizacion: Actualizacion<T>) =>
      setValor((previo) => {
        const nuevo = aplicar(actualizacion, previo)
        progreso.guardar(clave, nuevo)
        return nuevo
      }),
    [clave, progreso],
  )

  return [valor, actualizar] as const
}
