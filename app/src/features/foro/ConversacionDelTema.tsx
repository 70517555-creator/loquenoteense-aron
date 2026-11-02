import type { Comentario, TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { fechaLegible } from '../../utils/tiempo'
import { FormularioDeComentario } from './FormularioDeComentario'
import { TarjetaDeComentario } from './TarjetaDeComentario'
import { useComentarios } from './useForo'

const POCOS_COMENTARIOS = 3

interface Props {
  tema: TemaDelDia
  etiqueta: string
  autor?: string
}

interface PropsDeLista {
  comentarios?: Comentario[]
  cargando: boolean
  fallo: boolean
}

function InvitacionACompartir({ primera }: { primera: boolean }) {
  return (
    <p className="tarjeta invitacion-foro">
      💛 {primera ? 'Las primeras familias que comparten ayudan a todas las demás.' : 'Cada experiencia suma.'}{' '}
      Tu experiencia puede ser justo lo que otra mamá o papá del colegio necesita leer hoy. Es anónimo y psicología lo revisa antes de publicarlo.
    </p>
  )
}

function ListaDeComentarios({ comentarios, cargando, fallo }: PropsDeLista) {
  if (fallo) return <p className="aviso-suave">No pudimos cargar los comentarios. Revisa tu conexión.</p>
  if (cargando && !comentarios) return <Cargando />
  const publicados = comentarios?.filter((c) => c.estado === 'aprobado').length ?? 0
  return (
    <>
      {!!comentarios?.length && (
        <ul className="comentarios">
          {comentarios.map((c) => <TarjetaDeComentario key={c.id} comentario={c} />)}
        </ul>
      )}
      {publicados < POCOS_COMENTARIOS && <InvitacionACompartir primera={publicados === 0} />}
    </>
  )
}

export function ConversacionDelTema({ tema, etiqueta, autor }: Props) {
  const { datos, cargando, fallo, recargar } = useComentarios(tema.id)

  return (
    <section className="conversacion">
      <article className="tarjeta tema-del-dia">
        <span className="insignia">{etiqueta} · {fechaLegible(tema.fecha)}</span>
        {autor && <small className="tema-del-dia__autor">{autor}</small>}
        <h2 className="mano titulo-grande sin-margen">{tema.titulo}</h2>
        {tema.descripcion && <p>{tema.descripcion}</p>}
      </article>
      <ListaDeComentarios comentarios={datos} cargando={cargando} fallo={fallo} />
      <FormularioDeComentario tema={tema} onEnviado={recargar} />
    </section>
  )
}
