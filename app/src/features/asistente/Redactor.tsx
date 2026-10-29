import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import { GRADOS } from '../../content/grados'
import { Icono } from '../../ui/Icono'
import { GRADO_POR_DEFECTO, type InfoModo } from './modos'

const LARGO_MAXIMO = 800

interface Props {
  modo: InfoModo
  ocupado: boolean
  onEnviar: (texto: string, grado?: string) => void
}

const enviarConEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key !== 'Enter' || e.shiftKey) return
  e.preventDefault()
  e.currentTarget.form?.requestSubmit()
}

function AvisoDePrivacidad() {
  const { conIA } = useServicios()
  return (
    <p className="privacidad">
      <Icono nombre="lock" tam={14} /> No escribas nombres ni datos personales. No guardamos tus conversaciones.
      {!conIA && ' Respuestas basadas en la guía del colegio.'} No reemplaza la orientación de un profesional.{' '}
      <Link to="/privacidad#asistente">Privacidad</Link>
    </p>
  )
}

export function Redactor({ modo, ocupado, onEnviar }: Props) {
  const [texto, setTexto] = useState('')
  const [grado, setGrado] = useState(GRADO_POR_DEFECTO)
  const limpio = texto.trim()

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (!limpio || ocupado) return
    onEnviar(limpio, modo.pideGrado ? grado : undefined)
    setTexto('')
  }

  return (
    <form className="redactor" onSubmit={enviar}>
      {modo.pideGrado && (
        <label className="redactor__grado">
          Grado de tu hijo/a
          <select value={grado} onChange={(e) => setGrado(e.target.value)}>
            {GRADOS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
      )}
      <div className="redactor__fila">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={enviarConEnter}
          placeholder={modo.ejemplo}
          rows={2}
          maxLength={LARGO_MAXIMO}
          aria-label="Tu mensaje"
        />
        <button className="boton-enviar" type="submit" disabled={!limpio || ocupado} aria-label="Enviar">
          <Icono nombre="send" tam={22} />
        </button>
      </div>
      <AvisoDePrivacidad />
    </form>
  )
}
