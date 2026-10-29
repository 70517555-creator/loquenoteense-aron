import { useEffect, useState } from 'react'
import { useServicios } from '../app/servicios'
import type { ContentRepository } from '../ports/ContentRepository'

type Coleccion = keyof ContentRepository
type DatosDe<C extends Coleccion> = Awaited<ReturnType<ContentRepository[C]>>

export function useContenido<C extends Coleccion>(coleccion: C) {
  const { contenido } = useServicios()
  const [datos, setDatos] = useState<DatosDe<C>>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    const cargar = contenido[coleccion] as () => Promise<DatosDe<C>>
    cargar()
      .then((d) => vigente && setDatos(d))
      .catch((e) => vigente && setError(e))
    return () => {
      vigente = false
    }
  }, [contenido, coleccion])

  if (error) throw error
  return datos
}
