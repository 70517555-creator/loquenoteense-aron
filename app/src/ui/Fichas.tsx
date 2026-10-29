import { useId } from 'react'
import { clases } from '../utils/clases'

interface Props {
  etiqueta: string
  opciones: string[]
  activa: number
  onCambiar: (indice: number) => void
}

export function Fichas({ etiqueta, opciones, activa, onCambiar }: Props) {
  const id = useId()
  return (
    <div className="fichas" role="tablist" aria-label={etiqueta}>
      {opciones.map((opcion, i) => (
        <button
          key={opcion}
          id={`${id}-${i}`}
          role="tab"
          aria-selected={i === activa}
          className={clases('ficha', i === activa && 'ficha--activa')}
          onClick={() => onCambiar(i)}
        >
          {opcion}
        </button>
      ))}
    </div>
  )
}
