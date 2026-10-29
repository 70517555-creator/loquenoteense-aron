import { clases } from '../utils/clases'
import { porcentaje } from '../utils/listas'

interface Props {
  avance: number
  total: number
  className?: string
}

export function BarraDeProgreso({ avance, total, className }: Props) {
  return (
    <div className={clases('barra-progreso', className)} aria-hidden="true">
      <div style={{ width: `${porcentaje(avance, total)}%` }} />
    </div>
  )
}
