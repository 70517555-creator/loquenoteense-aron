import { useEffect, useId, useRef } from 'react'
import { clases } from '../utils/clases'

interface Props {
  etiqueta: string
  opciones: string[]
  activa: number
  onCambiar: (indice: number) => void
}

export function Fichas({ etiqueta, opciones, activa, onCambiar }: Props) {
  const id = useId()
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ficha = contenedor.current?.children[activa]
    ficha?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activa])

  return (
    <div className="fichas" role="tablist" aria-label={etiqueta} ref={contenedor}>
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
