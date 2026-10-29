import { useCallback, useState } from 'react'

const ERROR_DE_CONEXION = 'No pudimos guardar. Revisa tu conexión e inténtalo otra vez.'

const mensajeDeError = (error: unknown) => (error instanceof Error && !('code' in error) ? error.message : ERROR_DE_CONEXION)

export function useAccion() {
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState<string>()

  const ejecutar = useCallback(async (accion: () => Promise<unknown>) => {
    setOcupado(true)
    setError(undefined)
    try {
      await accion()
      return true
    } catch (e) {
      setError(mensajeDeError(e))
      return false
    } finally {
      setOcupado(false)
    }
  }, [])

  return { ocupado, error, ejecutar }
}
