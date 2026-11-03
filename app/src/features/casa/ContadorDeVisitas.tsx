import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { useConsulta } from '../../hooks/useConsulta'

const FORMATO = new Intl.NumberFormat('es-PE')

export function ContadorDeVisitas({ className = 'casa__visitas' }: { className?: string }) {
  const { estadisticas } = useServicios()
  const { datos } = useConsulta(useCallback(() => estadisticas.totalDeVisitas(), [estadisticas]))
  if (!datos) return null
  return <span className={className}>👪 <b>{FORMATO.format(datos)}</b> {datos === 1 ? 'visita' : 'visitas'} de familias</span>
}
