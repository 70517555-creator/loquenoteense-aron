import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import type { CartaDeEstudiante } from '../../domain/mochila'
import { useConsulta } from '../../hooks/useConsulta'
import { BotonDeVoto } from '../foro/BotonDeVoto'

function SobreDeEstudiante({ carta }: { carta: CartaDeEstudiante }) {
  const { mochila } = useServicios()
  const [abierta, setAbierta] = useState(false)

  return (
    <li className="sobre sobre--estudiante">
      <div className="sobre__cabeza">
        <span aria-hidden="true">{abierta ? '📖' : '✉️'}</span>
        <b>Un estudiante de {carta.nivel.toLowerCase()}</b>
      </div>
      {abierta ? (
        <>
          <p className="sobre__texto mano">{carta.texto}</p>
          <BotonDeVoto id={carta.id} total={carta.meHizoPensar} votar={() => mochila.meHizoPensar(carta)}>
            💛 Me hizo pensar
          </BotonDeVoto>
        </>
      ) : (
        <button className="boton boton--borde" onClick={() => setAbierta(true)}>Abrir carta</button>
      )}
    </li>
  )
}

export function CartasDeEstudiantes({ carga }: { carga: string }) {
  const { mochila } = useServicios()
  const { datos } = useConsulta(useCallback(() => mochila.cartas(carga), [mochila, carga]))

  return (
    <section className="carga__bloque">
      <h3 className="carga__subtitulo">✉️ Cartas de los chicos del colegio</h3>
      {datos?.length ? (
        <>
          <p className="suave">
            {datos.length === 1 ? 'Un estudiante escribió' : `${datos.length} estudiantes escribieron`} sobre esto, de forma anónima.
            Psicología las revisó antes de publicarlas.
          </p>
          <ul className="sobres">{datos.map((c) => <SobreDeEstudiante key={c.id} carta={c} />)}</ul>
        </>
      ) : (
        <p className="suave">Todavía no hay cartas sobre esto. Pronto los chicos del colegio podrán escribir aquí.</p>
      )}
      <Link className="enlace-discreto" to="/escribe">¿Eres estudiante? Escribe una carta anónima</Link>
    </section>
  )
}
