import { useEffect, useRef, useState, type FormEvent } from 'react'
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
import { PREFIJO_DE_SEMANA, useSemanaRespondida } from './useForo'

interface Props {
  tema: TemaDelDia
  onEnviado: () => void
  enfocar?: boolean
  compacto?: boolean
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

export function FormularioDeComentario({ tema, onEnviado, enfocar, compacto }: Props) {
  const { foro } = useServicios()
  const { texto: apodo } = useApodo()
  const { ocupado, error, ejecutar } = useAccion()
  const { aceptada, cambiar } = useAceptacionDeNormas()
  const [texto, setTexto] = useState('')
  const [enviado, setEnviado] = useState<{ urgente: boolean }>()
  const limpio = texto.trim()
  const caja = useRef<HTMLTextAreaElement>(null)
  const { marcarRespondida } = useSemanaRespondida()

  useEffect(() => {
    if (!enfocar) return
    if (!compacto) caja.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    caja.current?.focus({ preventScroll: !compacto })
  }, [enfocar, compacto])

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!limpio || ocupado || !aceptada) return
    const urgente = hayRiesgo(limpio)
    if (await ejecutar(() => foro.comentar({ tema, texto: limpio, apodo, urgente }))) {
      setTexto('')
      setEnviado({ urgente })
      if (tema.id.startsWith(PREFIJO_DE_SEMANA)) marcarRespondida()
      onEnviado()
    }
  }

  return (
    <form className={compacto ? 'formulario-foro formulario-foro--compacto' : 'tarjeta formulario-foro'} onSubmit={enviar}>
      {!compacto && <h3 className="titulo-tarjeta">✍️ Escribe tu respuesta</h3>}
      <textarea
        ref={caja}
        className="formulario-foro__caja"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO_COMENTARIO}
        rows={compacto ? 3 : 4}
        placeholder="Escribe aquí lo que te ha funcionado, lo que te cuesta o tu pregunta…"
        aria-label="Tu comentario"
      />
      <ElegirApodo />
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
