import { useCallback, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import {
  LARGO_MAXIMO_CARTA_DE_ESTUDIANTE, NIVELES_DE_ESTUDIANTE, type CartaDeEstudiante,
} from '../../domain/mochila'
import { hayRiesgo } from '../../domain/riesgo'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { useContenido } from '../../hooks/useContenido'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { LlamarAyuda } from '../../ui/LlamarAyuda'
import { clases } from '../../utils/clases'

const INICIOS = [
  'Lo que me gustaría que mis papás entendieran es…',
  'Me duele cuando…',
  'Me ayudaría mucho que…',
  'No me animo a decirles que…',
  'Gracias por…',
]

const ESTADOS: Record<CartaDeEstudiante['estado'], string> = {
  pendiente: '⏳ Psicología la está leyendo',
  aprobado: '✅ Ya la pueden leer las familias',
  rechazado: '✋ No se publicó',
}

function AvisoDeRiesgo() {
  return (
    <div className="tarjeta aviso-riesgo" role="alert">
      <p>
        <b>Lo que sientes importa y no tienes que cargarlo solo/a.</b> Como esta carta es anónima, no sabremos quién eres:
        por eso, acércate hoy a psicología del colegio o a un adulto de confianza. Estamos para ti. Si estás en peligro, llama ahora:
      </p>
      <LlamarAyuda />
    </div>
  )
}

function MisCartas({ cartas }: { cartas: CartaDeEstudiante[] }) {
  if (!cartas.length) return null
  return (
    <section className="tarjeta mis-cartas">
      <h2 className="mano titulo-tarjeta">Tus cartas</h2>
      <ul className="sobres">
        {cartas.map((carta) => (
          <li key={carta.id} className="sobre">
            <small className="suave">{carta.creadoEn.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} · {ESTADOS[carta.estado]}</small>
            <p className="sobre__texto mano">{carta.texto}</p>
            {carta.estado === 'aprobado' && (
              <b className="mis-cartas__eco">
                💛 {carta.meHizoPensar === 1 ? 'A 1 familia' : `A ${carta.meHizoPensar} familias`} le hizo pensar tu carta
              </b>
            )}
            {carta.estado === 'rechazado' && carta.motivoRechazo && <small className="suave">Motivo: {carta.motivoRechazo}</small>}
          </li>
        ))}
      </ul>
    </section>
  )
}

function FormularioDeCarta({ onEnviada }: { onEnviada: () => void }) {
  const { mochila } = useServicios()
  const cargas = useContenido('cargas')
  const { ocupado, error, ejecutar } = useAccion()
  const [carga, setCarga] = useState<string>()
  const [nivel, setNivel] = useState(NIVELES_DE_ESTUDIANTE[0])
  const [texto, setTexto] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [enviada, setEnviada] = useState<{ urgente: boolean }>()
  const limpio = texto.trim()
  const urgente = hayRiesgo(texto)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!carga || !limpio || !acepta) return
    if (await ejecutar(() => mochila.escribirCarta({ carga, texto: limpio, nivel, urgente }))) {
      setEnviada({ urgente })
      setTexto('')
      setAcepta(false)
      onEnviada()
    }
  }

  if (enviada) {
    return (
      <div className="tarjeta centrado">
        <h2 className="mano titulo-tarjeta">¡Tu carta va en camino! ✉️</h2>
        <p>Psicología la leerá y, si está todo bien, aparecerá en la mochila para que la lean las familias del colegio. Nadie sabrá que la escribiste tú.</p>
        {enviada.urgente && <AvisoDeRiesgo />}
        <button className="boton boton--borde" onClick={() => setEnviada(undefined)}>Escribir otra carta</button>
      </div>
    )
  }

  if (!cargas) return <Cargando />
  return (
    <form className="tarjeta formulario-foro escribe" onSubmit={enviar}>
      <h2 className="carga__subtitulo">1. ¿De qué quieres hablar?</h2>
      <div className="inicios">
        {cargas.map((c) => (
          <button type="button" key={c.id} className={clases('ficha', carga === c.id && 'ficha--activa')} aria-pressed={carga === c.id} onClick={() => setCarga(c.id)}>
            {c.titulo}
          </button>
        ))}
      </div>

      <h2 className="carga__subtitulo">2. ¿En qué nivel estás?</h2>
      <div className="inicios">
        {NIVELES_DE_ESTUDIANTE.map((n) => (
          <button type="button" key={n} className={clases('ficha', nivel === n && 'ficha--activa')} aria-pressed={nivel === n} onClick={() => setNivel(n)}>
            {n}
          </button>
        ))}
      </div>

      <h2 className="carga__subtitulo">3. Escribe tu carta</h2>
      <p className="suave">Si no sabes cómo empezar, toca una frase:</p>
      <div className="inicios">
        {INICIOS.map((inicio) => (
          <button type="button" key={inicio} className="ficha" onClick={() => setTexto((t) => (t ? `${t}\n${inicio} ` : `${inicio} `))}>
            {inicio}
          </button>
        ))}
      </div>
      <textarea
        className="carta-nueva__texto"
        rows={7}
        maxLength={LARGO_MAXIMO_CARTA_DE_ESTUDIANTE}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Querida familia…"
        aria-label="Tu carta"
      />
      <small className="suave">{texto.length}/{LARGO_MAXIMO_CARTA_DE_ESTUDIANTE}</small>
      {urgente && <AvisoDeRiesgo />}

      <label className="aceptar-normas">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>
          No escribí nombres ni datos que permitan reconocerme a mí ni a otras personas. Leí las{' '}
          <Link to="/privacidad#normas-de-las-cartas">normas de las cartas</Link>.
        </span>
      </label>
      {error && <p className="aviso-suave">{error}</p>}
      <button className="boton boton--grande" disabled={ocupado || !carga || !limpio || !acepta}>Enviar mi carta</button>
      {!carga && <small className="suave centrado">Elige primero de qué quieres hablar.</small>}
    </form>
  )
}

export default function Escribe() {
  const { mochila } = useServicios()
  const mias = useConsulta(useCallback(() => mochila.misCartas(), [mochila]))

  return (
    <main>
      <Encabezado titulo="Escribe a los papás" icono="send" />
      <div className="contenedor foro">
        <div className="tarjeta escribe__portada">
          <h2 className="mano titulo-tarjeta">Para los estudiantes del Cristo Moreno</h2>
          <p>
            ¿Hay algo que te gustaría que los papás entendieran, pero cuesta decirlo en voz alta? Escríbelo aquí.
            Tu carta irá a <b>la mochila</b> que leen las familias del colegio.
          </p>
          <ul className="escribe__garantias">
            <li>🙈 <b>Es anónima:</b> no pedimos tu nombre, ni grado, ni sección.</li>
            <li>👀 <b>Psicología la lee primero</b> y solo publica lo que cuida a todos.</li>
            <li>💛 <b>Verás cuántas familias</b> dijeron que tu carta les hizo pensar.</li>
          </ul>
        </div>
        <FormularioDeCarta onEnviada={mias.recargar} />
        {mias.datos && <MisCartas cartas={mias.datos} />}
      </div>
    </main>
  )
}
