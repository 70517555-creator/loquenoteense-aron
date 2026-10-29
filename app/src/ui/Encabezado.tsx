import { useNavigate } from 'react-router-dom'
import { Icono } from './Icono'

interface Props {
  titulo: string
  icono?: string
  volverA?: string
}

export function Encabezado({ titulo, icono, volverA = '/casa' }: Props) {
  const navegar = useNavigate()
  return (
    <header className="encabezado">
      <button className="encabezado__volver" onClick={() => navegar(volverA)} aria-label="Volver">
        <Icono nombre="back" tam={20} />
      </button>
      <h1 className="encabezado__titulo">
        {icono && <Icono nombre={icono} className="encabezado__icono" />}
        {titulo}
      </h1>
    </header>
  )
}
