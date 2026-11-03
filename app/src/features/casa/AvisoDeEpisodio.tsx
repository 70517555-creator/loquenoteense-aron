import { Headphones } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useEpisodioNuevo } from '../podcast/useEpisodioNuevo'

// Se ve hasta que la familia le da play al episodio nuevo.
export function AvisoDeEpisodio() {
  const episodio = useEpisodioNuevo()
  if (!episodio) return null
  return (
    <Link to="/podcast" className="aviso-episodio">
      <span className="aviso-episodio__icono"><Headphones size={20} weight="fill" /></span>
      <span className="aviso-episodio__texto">
        <small>Nuevo episodio del podcast</small>
        <b>#{episodio.numero} {episodio.titulo}</b>
      </span>
      <span className="aviso-episodio__accion">Escuchar</span>
    </Link>
  )
}
