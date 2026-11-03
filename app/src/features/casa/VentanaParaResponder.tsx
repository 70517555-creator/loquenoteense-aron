import { ChatCircleText, Eye } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { TemaDelDia } from '../../domain/foro'
import { useCerrarConEscape } from '../../hooks/useCerrarConEscape'
import { Icono } from '../../ui/Icono'
import { FormularioDeComentario } from '../foro/FormularioDeComentario'

interface Props {
  pregunta: TemaDelDia
  onEnviado: () => void
  onCerrar: () => void
}

export function VentanaParaResponder({ pregunta, onEnviado, onCerrar }: Props) {
  const cerrar = useCallback(() => onCerrar(), [onCerrar])
  useCerrarConEscape(cerrar)

  return createPortal(
    <div className="responder" role="dialog" aria-modal="true" aria-label="Responder la pregunta de la semana" onClick={cerrar}>
      <div className="responder__caja" onClick={(e) => e.stopPropagation()}>
        <header className="responder__cabecera">
          <span className="pregunta-casa__etiqueta"><Ico icono={ChatCircleText} /> Pregunta de la semana · Psicología</span>
          <button className="responder__cerrar" onClick={cerrar} aria-label="Cerrar">
            <Icono nombre="close" tam={20} />
          </button>
        </header>
        <h2 className="pregunta-casa__titulo mano">{pregunta.titulo}</h2>
        {pregunta.descripcion && <p className="responder__descripcion">{pregunta.descripcion}</p>}
        <FormularioDeComentario tema={pregunta} onEnviado={onEnviado} enfocar compacto />
        <Link to="/foro?seccion=semana" className="responder__ver"><Ico icono={Eye} /> Ver lo que respondieron otras familias</Link>
      </div>
    </div>,
    document.body,
  )
}
