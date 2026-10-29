import { Link } from 'react-router-dom'
import { AvisoDePantalla } from '../ui/AvisoDePantalla'

export default function NoEncontrado() {
  return (
    <main>
      <AvisoDePantalla titulo="Esta puerta no lleva a ningún lado" descripcion="Puede que el enlace haya cambiado.">
        <Link className="boton" to="/casa">Volver a la casa</Link>
      </AvisoDePantalla>
    </main>
  )
}
