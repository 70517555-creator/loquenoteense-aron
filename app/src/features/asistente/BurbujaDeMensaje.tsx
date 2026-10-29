import { Link } from 'react-router-dom'
import type { Enlace } from '../../ports/AssistantPort'
import { Icono } from '../../ui/Icono'
import { LlamarAyuda } from '../../ui/LlamarAyuda'
import { clases } from '../../utils/clases'
import type { Burbuja } from './useConversacion'

const ETIQUETA_DE_FUENTE = {
  ia: '✨ Respuesta con IA · revisa siempre con tu criterio',
  guia: '📘 Guía del colegio',
}

function EnlacesSugeridos({ enlaces }: { enlaces: Enlace[] }) {
  return (
    <div className="burbuja__enlaces">
      {enlaces.map((enlace) => (
        <Link key={enlace.ruta} to={enlace.ruta} className="enlace-chip">
          {enlace.texto} <Icono nombre="arrow" tam={14} />
        </Link>
      ))}
    </div>
  )
}

export function BurbujaDeMensaje({ burbuja }: { burbuja: Burbuja }) {
  const { rol, texto, aviso, alerta, enlaces, fuente } = burbuja
  const mostrarFuente = rol === 'asistente' && fuente && !alerta

  return (
    <div className={clases('burbuja', `burbuja--${rol}`, alerta && 'burbuja--alerta')}>
      {aviso && <p className="burbuja__aviso">{aviso}</p>}
      <p className="burbuja__texto">{texto}</p>
      {alerta && <LlamarAyuda />}
      {enlaces?.length ? <EnlacesSugeridos enlaces={enlaces} /> : null}
      {mostrarFuente && <small className="burbuja__fuente">{ETIQUETA_DE_FUENTE[fuente]}</small>}
    </div>
  )
}

export function BurbujaPensando() {
  return (
    <div className="burbuja burbuja--asistente burbuja--pensando">
      <span /><span /><span />
    </div>
  )
}
