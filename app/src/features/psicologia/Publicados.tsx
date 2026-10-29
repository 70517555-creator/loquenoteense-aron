import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import { MOTIVO_AL_RETIRAR, type Comentario } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { clases } from '../../utils/clases'

function ComentarioPublicado({ comentario, onOculto }: { comentario: Comentario; onOculto: () => void }) {
  const { panel } = useServicios()
  const { ocupado, ejecutar } = useAccion()

  const ocultar = async () => {
    if (!confirm('¿Ocultar este comentario? Dejará de verse en el foro.')) return
    if (await ejecutar(() => panel.moderarComentario(comentario, 'rechazado', MOTIVO_AL_RETIRAR))) onOculto()
  }

  return (
    <li className={clases('tarjeta', 'por-revisar', comentario.rol === 'psicologia' && 'comentario--psicologia')}>
      <small className="suave">
        {comentario.temaTitulo} · {comentario.creadoEn.toLocaleDateString('es-PE')} · ❤️ {comentario.meAyudo}
      </small>
      <b>{comentario.apodo}</b>
      <p className="comentario__texto">{comentario.texto}</p>
      <div className="moderacion">
        <button className="boton boton--borde" disabled={ocupado} onClick={ocultar}>Ocultar</button>
      </div>
    </li>
  )
}

export function Publicados() {
  const { panel } = useServicios()
  const { datos, cargando, fallo, recargar } = useConsulta(useCallback(() => panel.publicados(), [panel]))
  const [filtro, setFiltro] = useState('')
  const buscado = filtro.trim().toLowerCase()
  const visibles = datos?.filter((c) => !buscado || `${c.texto} ${c.apodo} ${c.temaTitulo}`.toLowerCase().includes(buscado))

  if (fallo) return <p className="aviso-suave">No pudimos cargar los comentarios publicados.</p>
  if (cargando && !datos) return <Cargando />
  return (
    <section className="conversacion">
      <input className="campo" placeholder="Buscar por palabra, apodo o tema" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      {visibles?.length === 0 && <p className="suave centrado">No hay comentarios publicados{buscado && ' con esa búsqueda'}.</p>}
      <ul className="lista-panel">
        {visibles?.map((c) => <ComentarioPublicado key={`${c.temaId}/${c.id}`} comentario={c} onOculto={recargar} />)}
      </ul>
    </section>
  )
}
