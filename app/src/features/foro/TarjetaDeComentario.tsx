import { useServicios } from '../../app/servicios'
import type { Comentario } from '../../domain/foro'
import { Icono } from '../../ui/Icono'
import { clases } from '../../utils/clases'
import { BotonDeVoto } from './BotonDeVoto'
import { BotonReportar } from './BotonReportar'

const rutaDelComentario = (c: Comentario) => `temas/${c.temaId}/comentarios/${c.id}`

function EstadoPropio({ comentario }: { comentario: Comentario }) {
  if (comentario.estado === 'pendiente') {
    return <span className="insignia insignia--suave">⏳ En revisión: solo tú lo ves por ahora</span>
  }
  if (comentario.estado === 'rechazado') {
    return (
      <p className="comentario__rechazo">
        No se publicó. {comentario.motivoRechazo}
      </p>
    )
  }
  return null
}

function MeAyudo({ comentario }: { comentario: Comentario }) {
  const { foro } = useServicios()
  return (
    <BotonDeVoto id={comentario.id} total={comentario.meAyudo} votar={() => foro.marcarMeAyudo(comentario)}>
      <Icono nombre="heart" tam={16} /> Me ayudó
    </BotonDeVoto>
  )
}

interface Props {
  comentario: Comentario
  onQuitar?: (comentario: Comentario) => void
}

export function TarjetaDeComentario({ comentario, onQuitar }: Props) {
  const dePsicologia = comentario.rol === 'psicologia'
  const publicado = comentario.estado === 'aprobado'

  return (
    <li className={clases('comentario', dePsicologia && 'comentario--psicologia', !publicado && 'comentario--propio')}>
      <div className="comentario__autor">
        <b>{comentario.apodo}</b>
        {dePsicologia && <span className="insignia">Psicología del colegio</span>}
        {comentario.esMio && publicado && <small className="suave">(tú)</small>}
        {onQuitar && publicado && (
          <button className="comentario__quitar" onClick={() => onQuitar(comentario)} aria-label="Quitar este comentario del foro" title="Quitar del foro (solo psicología)">
            <Icono nombre="close" tam={16} />
          </button>
        )}
      </div>
      {comentario.respondeA && <small className="suave">En respuesta a {comentario.respondeA}</small>}
      <p className="comentario__texto">{comentario.texto}</p>
      {comentario.esMio && <EstadoPropio comentario={comentario} />}
      {publicado && (
        <div className="comentario__acciones">
          <MeAyudo comentario={comentario} />
          {!comentario.esMio && <BotonReportar ruta={rutaDelComentario(comentario)} texto={comentario.texto} />}
        </div>
      )}
    </li>
  )
}
