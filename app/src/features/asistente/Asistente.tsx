import { asistenteHabitacion } from '../../app/habitaciones'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { clases } from '../../utils/clases'
import { BurbujaDeMensaje, BurbujaPensando } from './BurbujaDeMensaje'
import { MODOS, type InfoModo } from './modos'
import { Redactor } from './Redactor'
import { useConversacion } from './useConversacion'

function SelectorDeModo({ activo, onElegir }: { activo: InfoModo; onElegir: (modo: InfoModo) => void }) {
  return (
    <div className="modos" role="tablist" aria-label="¿Qué necesitas?">
      {MODOS.map((modo) => (
        <button
          key={modo.id}
          role="tab"
          aria-selected={modo.id === activo.id}
          className={clases('modo', modo.id === activo.id && 'modo--activo')}
          onClick={() => onElegir(modo)}
        >
          <Icono nombre={modo.icono} tam={22} />
          <span>{modo.titulo}</span>
        </button>
      ))}
    </div>
  )
}

function Conversacion({ modo }: { modo: InfoModo }) {
  const { mensajes, pensando, enviar } = useConversacion(modo.id)
  const final = useRef<HTMLDivElement>(null)

  useEffect(() => {
    final.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes, pensando])

  return (
    <>
      <div className="chat" aria-live="polite">
        {mensajes.map((burbuja, i) => <BurbujaDeMensaje key={i} burbuja={burbuja} />)}
        {pensando && <BurbujaPensando />}
        <div ref={final} />
      </div>
      <Redactor modo={modo} ocupado={pensando} onEnviar={enviar} />
    </>
  )
}

export default function Asistente() {
  const [params, setParams] = useSearchParams()
  const modo = MODOS.find((m) => m.id === params.get('modo')) ?? MODOS[0]

  return (
    <main className="asistente">
      <Encabezado titulo={asistenteHabitacion.titulo} icono={asistenteHabitacion.icono} />
      <div className="contenedor">
        <SelectorDeModo activo={modo} onElegir={(m) => setParams({ modo: m.id }, { replace: true })} />
        <p className="entrada">{modo.explicacion}</p>
        <Conversacion key={modo.id} modo={modo} />
      </div>
    </main>
  )
}
