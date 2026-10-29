import { useCallback, useEffect, useMemo, useState } from 'react'

interface Resultado<T> {
  solicitud: object
  datos?: T
  fallo: boolean
}

export function useConsulta<T>(cargar: () => Promise<T>) {
  const [version, setVersion] = useState(0)
  const solicitud = useMemo(() => ({ cargar, version }), [cargar, version])
  const [resultado, setResultado] = useState<Resultado<T>>()

  useEffect(() => {
    let vigente = true
    solicitud.cargar().then(
      (datos) => vigente && setResultado({ solicitud, datos, fallo: false }),
      () => vigente && setResultado((previo) => ({ solicitud, datos: previo?.datos, fallo: true })),
    )
    return () => {
      vigente = false
    }
  }, [solicitud])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])
  const vigente = resultado?.solicitud === solicitud

  return {
    datos: resultado?.datos,
    cargando: !vigente,
    fallo: vigente && resultado.fallo,
    recargar,
  }
}
