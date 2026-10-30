import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { useConsulta } from '../../hooks/useConsulta'

const FORMATO = new Intl.NumberFormat('es-PE')

export function ContadorDeVisitas() {
  const { estadisticas } = useServicios()
  const { datos } = useConsulta(useCallback(() => estadisticas.totalDeVisitas(), [estadisticas]))
  if (!datos) return null
  return <span className="casa__visitas">👪 {FORMATO.format(datos)} {datos === 1 ? 'visita' : 'visitas'} de familias</span>
}
