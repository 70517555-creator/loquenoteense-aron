import { Link } from 'react-router-dom'
import { useEnLinea } from '../../hooks/useEnLinea'
import { RUTA_PARA_RESPONDER_LA_SEMANA, useComentarios, usePreguntaDeLaSemana, useSemanaRespondida } from '../foro/useForo'

function Respuestas({ temaId }: { temaId: string }) {
  const { datos } = useComentarios(temaId)
  const publicadas = datos?.filter((c) => c.estado === 'aprobado' && c.rol === 'padre').length ?? 0
  return (
    <p className="pregunta-casa__eco">
      👪 {publicadas === 0 ? 'Sé de las primeras familias en responder' : `${publicadas} ${publicadas === 1 ? 'familia ya respondió' : 'familias ya respondieron'}`}
    </p>
  )
}

export function PreguntaDeLaSemanaEnCasa() {
  const enLinea = useEnLinea()
  const { datos: pregunta } = usePreguntaDeLaSemana()
  const { respondida } = useSemanaRespondida()
  if (!enLinea || !pregunta) return null

  return (
    <Link to={RUTA_PARA_RESPONDER_LA_SEMANA} className="pregunta-casa">
      <span className="pregunta-casa__etiqueta">💬 Pregunta de la semana · Psicología</span>
      <b className="pregunta-casa__titulo mano">{pregunta.titulo}</b>
      <Respuestas temaId={pregunta.id} />
      <span className="boton pregunta-casa__boton">
        {respondida ? '👀 Ver lo que dicen otras familias' : '✍️ Responder (es anónimo)'}
      </span>
    </Link>
  )
}
