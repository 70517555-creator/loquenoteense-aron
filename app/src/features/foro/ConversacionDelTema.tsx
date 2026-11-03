import { Heart, PushPin } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useState, type ReactNode } from 'react'
import { useServicios } from '../../app/servicios'
import { MOTIVO_AL_RETIRAR, type Comentario, type TemaDelDia } from '../../domain/foro'
import { useMedia } from '../../hooks/useMedia'
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
  sinTablero?: boolean
}

function InvitacionACompartir({ primera }: { primera: boolean }) {
  return (
    <p className="tarjeta invitacion-foro">
      <Ico icono={Heart} peso="fill" /> {primera ? 'Las primeras familias que comparten ayudan a todas las demás.' : 'Cada experiencia suma.'}{' '}
      Tu experiencia puede ser justo lo que otra mamá o papá del colegio necesita leer hoy. Es anónimo y psicología lo revisa antes de publicarlo.
    </p>
  )
}

const PANTALLA_DE_MURAL = '(min-width: 1200px) and (orientation: landscape)'

interface PropsDeLista {
  comentarios?: Comentario[]
  cargando: boolean
  fallo: boolean
  onQuitar?: (comentario: Comentario) => void
  tarjeta: ReactNode
  sinTablero?: boolean
}

// Celular y tablet: la tarjeta para responder y debajo las notas. Pantallas anchas: la tarjeta al centro de un
// corcho y las notas a los dos costados.
function ListaDeComentarios({ comentarios, cargando, fallo, onQuitar, tarjeta, sinTablero }: PropsDeLista) {
  const [verTodos, setVerTodos] = useState(false)
  const ancha = useMedia(PANTALLA_DE_MURAL) && !sinTablero
  if (fallo) return <>{tarjeta}<p className="aviso-suave">No pudimos cargar los comentarios. Revisa tu conexión.</p></>
  if (cargando && !comentarios) return <>{tarjeta}<Cargando /></>
  const publicados = comentarios?.filter((c) => c.estado === 'aprobado').length ?? 0
  const visibles = (verTodos ? comentarios : comentarios?.slice(0, COMENTARIOS_A_LA_VISTA)) ?? []
  const ocultos = (comentarios?.length ?? 0) - visibles.length
  const invitacion = publicados < POCOS_COMENTARIOS && <InvitacionACompartir primera={publicados === 0} />
  const titulo = <h3 className="mural-foro__titulo"><Ico icono={PushPin} peso="fill" /> Lo que comparten las familias <span>({publicados})</span></h3>
  const verMas = ocultos > 0 && (
    <button className="boton mural-foro__mas" onClick={() => setVerTodos(true)}>
      Ver {ocultos} {ocultos === 1 ? 'nota más' : 'notas más'}
    </button>
  )
  const notas = (lista: Comentario[], clase = 'mural') => (
    <ul className={clase}>{lista.map((c) => <TarjetaDeComentario key={c.id} comentario={c} onQuitar={onQuitar} />)}</ul>
  )

  if (ancha && visibles.length) {
    return (
      <div className="tablero">
        {notas(visibles.filter((_, i) => i % 2 === 0), 'mural tablero__lado')}
        <div className="tablero__centro">
          {tarjeta}
          {invitacion}
          {titulo}
          {verMas}
        </div>
        {notas(visibles.filter((_, i) => i % 2 === 1), 'mural tablero__lado')}
      </div>
    )
  }

  return (
    <>
      {tarjeta}
      {invitacion}
      {!!visibles.length && (
        <div className="mural-foro">
          {titulo}
          {notas(visibles)}
          {verMas}
        </div>
      )}
    </>
  )
}

export function ConversacionDelTema({ tema, etiqueta, autor, enfocar, resumida, sinTablero }: Props) {
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

  const tarjeta = resumida ? (
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
  )

  return (
    <section className="conversacion">
      <ListaDeComentarios comentarios={datos} cargando={cargando} fallo={fallo} onQuitar={delEquipo ? quitar : undefined} tarjeta={tarjeta} sinTablero={sinTablero} />
    </section>
  )
}
