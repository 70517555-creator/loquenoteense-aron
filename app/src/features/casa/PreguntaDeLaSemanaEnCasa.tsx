import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { TemaDelDia } from '../../domain/foro'
import { useEnLinea } from '../../hooks/useEnLinea'
import { useApodo } from '../foro/useApodo'
import { useComentarios, usePreguntaDeLaSemanaInmediata, useSemanaRespondida } from '../foro/useForo'
import { VentanaParaResponder } from './VentanaParaResponder'

const RUTA_DE_LAS_RESPUESTAS = '/foro?seccion=semana'

function textoDeRespuestas(publicadas: number) {
  if (publicadas === 0) return 'Sé de las primeras familias en responder'
  return publicadas === 1 ? '1 familia ya respondió' : `${publicadas} familias ya respondieron`
}

function Tarjeta({ pregunta }: { pregunta: TemaDelDia }) {
  const comentarios = useComentarios(pregunta.id)
  const { respondida } = useSemanaRespondida()
  const { apodo } = useApodo()
  const [escribiendo, setEscribiendo] = useState(false)

  const publicadas = comentarios.datos?.filter((c) => c.estado === 'aprobado' && c.rol === 'padre').length

  return (
    <section className="pregunta-casa" aria-label="Pregunta de la semana">
      <span className="pregunta-casa__etiqueta">💬 Pregunta de la semana · Psicología</span>
      <h2 className="pregunta-casa__titulo mano">{pregunta.titulo}</h2>
      <button className="pregunta-casa__escribir" onClick={() => setEscribiendo(true)}>
        <span className="pregunta-casa__avatar" aria-hidden="true">✍️</span>
        <span>{respondida ? '¿Quieres contar algo más?' : `Cuéntanos qué haces tú, ${apodo.parentesco.toLowerCase()}…`}</span>
      </button>
      {escribiendo && <VentanaParaResponder pregunta={pregunta} onEnviado={comentarios.recargar} onCerrar={() => setEscribiendo(false)} />}
      <p className="pregunta-casa__eco" aria-live="polite">
        {publicadas === undefined ? <span className="pregunta-casa__cargando">👪 Viendo cuántas familias respondieron…</span> : (
          <>
            👪 {textoDeRespuestas(publicadas)}
            {publicadas > 0 && <> <Link to={RUTA_DE_LAS_RESPUESTAS} className="sin-cortes">Leer respuestas →</Link></>}
          </>
        )}
      </p>
    </section>
  )
}

export function PreguntaDeLaSemanaEnCasa() {
  const enLinea = useEnLinea()
  const pregunta = usePreguntaDeLaSemanaInmediata()
  if (!enLinea) return null
  return <Tarjeta pregunta={pregunta} />
}
