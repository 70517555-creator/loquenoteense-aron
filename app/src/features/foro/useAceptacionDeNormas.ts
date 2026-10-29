import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { VERSION_DE_POLITICA } from '../../content/politicas'
import { usePersistente } from '../../hooks/usePersistente'

export function useAceptacionDeNormas() {
  const [version, setVersion] = usePersistente<string | null>(CLAVES_DE_PROGRESO.politicaAceptada, null)
  const aceptada = version === VERSION_DE_POLITICA
  const cambiar = (acepta: boolean) => setVersion(acepta ? VERSION_DE_POLITICA : null)
  return { aceptada, cambiar }
}
