import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import { LARGO_MAXIMO_COMENTARIO, type TemaDelDia } from '../../domain/foro'
import { hayRiesgo } from '../../domain/riesgo'
import { useAccion } from '../../hooks/useAccion'
import { Icono } from '../../ui/Icono'
import { LlamarAyuda } from '../../ui/LlamarAyuda'
import { ElegirApodo } from './ElegirApodo'
import { useApodo } from './useApodo'
import { AceptarNormas } from './AceptarNormas'
import { useAceptacionDeNormas } from './useAceptacionDeNormas'

interface Props {
  tema: TemaDelDia
  onEnviado: () => void
}

function AvisoDeRiesgo() {
  return (
    <div className="tarjeta aviso-riesgo" role="alert">
      <p>
        Lo que cuentas es importante y no tienes que enfrentarlo solo o sola. Psicología del colegio verá tu mensaje
        primero. Si hay peligro inmediato, llama ahora:
      </p>
      <LlamarAyuda />
    </div>
  )
}

export function FormularioDeComentario({ tema, onEnviado }: Props) {
  const { foro } = useServicios()
  const { texto: apodo } = useApodo()
  const { ocupado, error, ejecutar } = useAccion()
  const { aceptada, cambiar } = useAceptacionDeNormas()
  const [texto, setTexto] = useState('')
  const [enviado, setEnviado] = useState<{ urgente: boolean }>()
  const limpio = texto.trim()

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!limpio || ocupado || !aceptada) return
    const urgente = hayRiesgo(limpio)
    if (await ejecutar(() => foro.comentar({ tema, texto: limpio, apodo, urgente }))) {
      setTexto('')
      setEnviado({ urgente })
      onEnviado()
    }
  }

  return (
    <form className="tarjeta formulario-foro" onSubmit={enviar}>
      <h3 className="titulo-tarjeta">Comparte tu experiencia</h3>
      <ElegirApodo />
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO_COMENTARIO}
        rows={4}
        placeholder="Escribe aquí lo que te ha funcionado, lo que te cuesta o tu pregunta…"
        aria-label="Tu comentario"
      />
      <p className="privacidad">
        <Icono nombre="lock" tam={14} /> No escribas nombres, colegios ni datos de tu hijo u otras personas.
        Psicología revisa cada comentario antes de publicarlo. <Link to="/privacidad#normas-del-foro">Normas del foro</Link>
      </p>
      {error && <p className="aviso-suave">{error}</p>}
      {enviado && !enviado.urgente && <p className="aviso-suave">¡Gracias! Tu comentario está en revisión.</p>}
      {enviado?.urgente && <AvisoDeRiesgo />}
      {!aceptada && <AceptarNormas aceptada={aceptada} onCambiar={cambiar} />}
      <button className="boton" disabled={!limpio || ocupado || !aceptada}>
        <Icono nombre="send" tam={18} /> {ocupado ? 'Enviando…' : 'Enviar a revisión'}
      </button>
    </form>
  )
}
