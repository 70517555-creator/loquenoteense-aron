import type { Comentario, TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { fechaLegible } from '../../utils/tiempo'
import { FormularioDeComentario } from './FormularioDeComentario'
import { TarjetaDeComentario } from './TarjetaDeComentario'
import { useComentarios } from './useForo'

interface Props {
  tema: TemaDelDia
  etiqueta: string
}

interface PropsDeLista {
  comentarios?: Comentario[]
  cargando: boolean
  fallo: boolean
}

function ListaDeComentarios({ comentarios, cargando, fallo }: PropsDeLista) {
  if (fallo) return <p className="aviso-suave">No pudimos cargar los comentarios. Revisa tu conexión.</p>
  if (cargando && !comentarios) return <Cargando />
  if (!comentarios?.length) return <p className="suave centrado">Aún no hay comentarios publicados. ¡Sé la primera persona en compartir!</p>
  return (
    <ul className="comentarios">
      {comentarios.map((c) => <TarjetaDeComentario key={c.id} comentario={c} />)}
    </ul>
  )
}

export function ConversacionDelTema({ tema, etiqueta }: Props) {
  const { datos, cargando, fallo, recargar } = useComentarios(tema.id)

  return (
    <section className="conversacion">
      <article className="tarjeta tema-del-dia">
        <span className="insignia">{etiqueta} · {fechaLegible(tema.fecha)}</span>
        <h2 className="mano titulo-grande sin-margen">{tema.titulo}</h2>
        {tema.descripcion && <p>{tema.descripcion}</p>}
      </article>
      <ListaDeComentarios comentarios={datos} cargando={cargando} fallo={fallo} />
      <FormularioDeComentario tema={tema} onEnviado={recargar} />
    </section>
  )
}
