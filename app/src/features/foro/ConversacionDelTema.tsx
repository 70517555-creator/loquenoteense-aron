import { useServicios } from '../../app/servicios'
import { MOTIVO_AL_RETIRAR, type Comentario, type TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { fechaLegible } from '../../utils/tiempo'
import { FormularioDeComentario } from './FormularioDeComentario'
import { TarjetaDeComentario } from './TarjetaDeComentario'
import { useComentarios } from './useForo'
import { useEsDelEquipo } from './useEsDelEquipo'

const POCOS_COMENTARIOS = 3

interface Props {
  tema: TemaDelDia
  etiqueta: string
  autor?: string
  enfocar?: boolean
}

interface PropsDeLista {
  comentarios?: Comentario[]
  cargando: boolean
  fallo: boolean
  onQuitar?: (comentario: Comentario) => void
}

function InvitacionACompartir({ primera }: { primera: boolean }) {
  return (
    <p className="tarjeta invitacion-foro">
      💛 {primera ? 'Las primeras familias que comparten ayudan a todas las demás.' : 'Cada experiencia suma.'}{' '}
      Tu experiencia puede ser justo lo que otra mamá o papá del colegio necesita leer hoy. Es anónimo y psicología lo revisa antes de publicarlo.
    </p>
  )
}

function ListaDeComentarios({ comentarios, cargando, fallo, onQuitar }: PropsDeLista) {
  if (fallo) return <p className="aviso-suave">No pudimos cargar los comentarios. Revisa tu conexión.</p>
  if (cargando && !comentarios) return <Cargando />
  const publicados = comentarios?.filter((c) => c.estado === 'aprobado').length ?? 0
  return (
    <>
      {!!comentarios?.length && (
        <ul className="comentarios">
          {comentarios.map((c) => <TarjetaDeComentario key={c.id} comentario={c} onQuitar={onQuitar} />)}
        </ul>
      )}
      {publicados < POCOS_COMENTARIOS && <InvitacionACompartir primera={publicados === 0} />}
    </>
  )
}

export function ConversacionDelTema({ tema, etiqueta, autor, enfocar }: Props) {
  const { datos, cargando, fallo, recargar } = useComentarios(tema.id)
  const { panel } = useServicios()
  const delEquipo = useEsDelEquipo()
  const quitar = async (comentario: Comentario) => {
    if (!confirm('¿Quitar este comentario del foro? Dejará de verse para todas las familias.')) return
    try {
      await panel.moderarComentario(comentario, 'rechazado', MOTIVO_AL_RETIRAR)
      recargar()
    } catch {
      alert('No se pudo quitar. Revisa tu conexión e inténtalo otra vez.')
    }
  }

  return (
    <section className="conversacion">
      <article className="tarjeta tema-del-dia">
        <span className="insignia">{etiqueta} · {fechaLegible(tema.fecha)}</span>
        {autor && <small className="tema-del-dia__autor">{autor}</small>}
        <h2 className="mano titulo-grande sin-margen">{tema.titulo}</h2>
        {tema.descripcion && <p>{tema.descripcion}</p>}
      </article>
      <ListaDeComentarios comentarios={datos} cargando={cargando} fallo={fallo} onQuitar={delEquipo ? quitar : undefined} />
      <FormularioDeComentario tema={tema} onEnviado={recargar} enfocar={enfocar && !cargando} />
    </section>
  )
}
