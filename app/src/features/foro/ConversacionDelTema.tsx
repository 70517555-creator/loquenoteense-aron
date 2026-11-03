import { useState } from 'react'
import { useServicios } from '../../app/servicios'
import { MOTIVO_AL_RETIRAR, type Comentario, type TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { fechaLegible } from '../../utils/tiempo'
import { FormularioDeComentario } from './FormularioDeComentario'
import { TarjetaDeComentario } from './TarjetaDeComentario'
import { useComentarios } from './useForo'
import { useEsDelEquipo } from './useEsDelEquipo'

const POCOS_COMENTARIOS = 3
const COMENTARIOS_A_LA_VISTA = 8

interface Props {
  tema: TemaDelDia
  etiqueta: string
  autor?: string
  enfocar?: boolean
  resumida?: boolean
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
  const [verTodos, setVerTodos] = useState(false)
  if (fallo) return <p className="aviso-suave">No pudimos cargar los comentarios. Revisa tu conexión.</p>
  if (cargando && !comentarios) return <Cargando />
  const publicados = comentarios?.filter((c) => c.estado === 'aprobado').length ?? 0
  const visibles = verTodos ? comentarios : comentarios?.slice(0, COMENTARIOS_A_LA_VISTA)
  const ocultos = (comentarios?.length ?? 0) - (visibles?.length ?? 0)
  return (
    <>
      {publicados < POCOS_COMENTARIOS && <InvitacionACompartir primera={publicados === 0} />}
      {!!comentarios?.length && (
        <div className="mural-foro">
          <h3 className="mural-foro__titulo">📌 Lo que comparten las familias <span>({publicados})</span></h3>
          <ul className="mural">
            {visibles?.map((c) => <TarjetaDeComentario key={c.id} comentario={c} onQuitar={onQuitar} />)}
          </ul>
          {ocultos > 0 && (
            <button className="boton mural-foro__mas" onClick={() => setVerTodos(true)}>
              Ver {ocultos} {ocultos === 1 ? 'nota más' : 'notas más'}
            </button>
          )}
        </div>
      )}
    </>
  )
}

export function ConversacionDelTema({ tema, etiqueta, autor, enfocar, resumida }: Props) {
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
      {resumida ? (
        <article className="tarjeta tema-resumido">
          <p className="tema-resumido__contexto">{autor ?? etiqueta}: <b>{tema.titulo}</b></p>
          <FormularioDeComentario tema={tema} onEnviado={recargar} enfocar={enfocar && !cargando} compacto />
        </article>
      ) : (
        <article className="tarjeta tema-del-dia">
          <span className="insignia">{autor ?? etiqueta} · {fechaLegible(tema.fecha)}</span>
          <h2 className="mano titulo-grande sin-margen">{tema.titulo}</h2>
          {tema.descripcion && <p className="sin-margen">{tema.descripcion}</p>}
          <FormularioDeComentario tema={tema} onEnviado={recargar} enfocar={enfocar && !cargando} compacto />
        </article>
      )}
      <ListaDeComentarios comentarios={datos} cargando={cargando} fallo={fallo} onQuitar={delEquipo ? quitar : undefined} />
    </section>
  )
}
