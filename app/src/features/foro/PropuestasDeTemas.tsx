import { useState, type FormEvent } from 'react'
import { useServicios } from '../../app/servicios'
import { GRADOS } from '../../content/grados'
import { LARGO_MAXIMO_PROPUESTA, type Propuesta } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { Cargando } from '../../ui/Cargando'
import { Icono } from '../../ui/Icono'
import { fechaLegible } from '../../utils/tiempo'
import { BotonDeVoto } from './BotonDeVoto'
import { usePropuestas } from './useForo'
import { AceptarNormas } from './AceptarNormas'
import { useAceptacionDeNormas } from './useAceptacionDeNormas'

const CUALQUIER_NIVEL = 'Cualquier grado'

function FormularioDePropuesta({ onEnviada }: { onEnviada: () => void }) {
  const { foro } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const { aceptada, cambiar } = useAceptacionDeNormas()
  const [texto, setTexto] = useState('')
  const [nivel, setNivel] = useState(CUALQUIER_NIVEL)
  const [enviada, setEnviada] = useState(false)
  const limpio = texto.trim()

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!limpio || ocupado || !aceptada) return
    const nivelElegido = nivel === CUALQUIER_NIVEL ? undefined : nivel
    if (await ejecutar(() => foro.proponer(limpio, nivelElegido))) {
      setTexto('')
      setEnviada(true)
      onEnviada()
    }
  }

  return (
    <form className="tarjeta formulario-foro" onSubmit={enviar}>
      <h3 className="titulo-tarjeta">¿De qué te gustaría que conversemos?</h3>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO_PROPUESTA}
        placeholder="Ej.: Cómo hablar de enamoramiento sin que se cierre"
        aria-label="Tema que propones"
      />
      <select aria-label="Grado" value={nivel} onChange={(e) => setNivel(e.target.value)}>
        {[CUALQUIER_NIVEL, ...GRADOS].map((g) => <option key={g}>{g}</option>)}
      </select>
      {error && <p className="aviso-suave">{error}</p>}
      {enviada && <p className="aviso-suave">¡Gracias! Psicología revisará tu propuesta.</p>}
      {!aceptada && <AceptarNormas aceptada={aceptada} onCambiar={cambiar} />}
      <button className="boton" disabled={!limpio || ocupado || !aceptada}>
        <Icono nombre="bulb" tam={18} /> Proponer tema
      </button>
    </form>
  )
}

function TarjetaDePropuesta({ propuesta }: { propuesta: Propuesta }) {
  const { foro } = useServicios()
  const publicada = propuesta.estado === 'aprobado'

  return (
    <li className="tarjeta propuesta">
      <p className="propuesta__texto">{propuesta.texto}</p>
      {propuesta.nivel && <small className="suave">{propuesta.nivel}</small>}
      {propuesta.fechaProgramada && <span className="insignia">📅 Tema del {fechaLegible(propuesta.fechaProgramada)}</span>}
      {propuesta.estado === 'pendiente' && <span className="insignia insignia--suave">⏳ Tu propuesta está en revisión</span>}
      {propuesta.estado === 'rechazado' && <p className="comentario__rechazo">No se publicó. {propuesta.motivoRechazo}</p>}
      {publicada && (
        <BotonDeVoto id={propuesta.id} total={propuesta.votos} votar={() => foro.votar(propuesta)}>
          👍 A mí también me interesa
        </BotonDeVoto>
      )}
    </li>
  )
}

export function PropuestasDeTemas() {
  const { datos: propuestas, cargando, fallo, recargar } = usePropuestas()

  return (
    <section className="conversacion">
      <p className="suave">Propón temas y vota los que te interesan. Psicología elige los más pedidos como tema del día.</p>
      <FormularioDePropuesta onEnviada={recargar} />
      {fallo && <p className="aviso-suave">No pudimos cargar las propuestas. Revisa tu conexión.</p>}
      {cargando && !propuestas && <Cargando />}
      {propuestas?.length === 0 && <p className="suave centrado">Aún no hay propuestas. ¡Anímate a proponer la primera!</p>}
      <ul className="propuestas">
        {propuestas?.map((p) => <TarjetaDePropuesta key={p.id} propuesta={p} />)}
      </ul>
    </section>
  )
}
