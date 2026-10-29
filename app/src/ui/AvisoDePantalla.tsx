import type { ReactNode } from 'react'

interface Props {
  titulo: string
  descripcion: string
  children: ReactNode
}

export function AvisoDePantalla({ titulo, descripcion, children }: Props) {
  return (
    <div className="contenedor">
      <div className="tarjeta aviso-pantalla">
        <h1 className="mano aviso-pantalla__titulo">{titulo}</h1>
        <p className="suave">{descripcion}</p>
        <div className="fila">{children}</div>
      </div>
    </div>
  )
}
