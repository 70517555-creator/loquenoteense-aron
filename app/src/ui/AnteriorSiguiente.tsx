import type { ReactNode } from 'react'
import { Icono } from './Icono'

interface Props {
  onAnterior: () => void
  onSiguiente: () => void
  etiquetaAnterior?: string
  etiquetaSiguiente?: string
  children?: ReactNode
}

export function AnteriorSiguiente({
  onAnterior,
  onSiguiente,
  etiquetaAnterior = 'Anterior',
  etiquetaSiguiente = 'Siguiente',
  children,
}: Props) {
  return (
    <div className="navegar-pasos">
      <button className="boton-redondo" onClick={onAnterior} aria-label={etiquetaAnterior}>
        <Icono nombre="back" />
      </button>
      {children}
      <button className="boton-redondo" onClick={onSiguiente} aria-label={etiquetaSiguiente}>
        <Icono nombre="next" />
      </button>
    </div>
  )
}

export function Puntos({ total, activo }: { total: number; activo: number }) {
  return (
    <div className="puntos" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => <i key={i} className={i === activo ? 'activo' : undefined} />)}
    </div>
  )
}
