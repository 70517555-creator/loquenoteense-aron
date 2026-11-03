import { Envelope, EnvelopeOpen, LockSimple, PaperPlaneTilt, PencilSimpleLine } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import { CARGA_POR_CLASIFICAR, LARGO_MAXIMO_CARTA_DE_ESTUDIANTE, NIVELES_DE_ESTUDIANTE } from '../../domain/mochila'
import { hayRiesgo } from '../../domain/riesgo'
import type { Carta } from '../../domain/tipos'
import { useAccion } from '../../hooks/useAccion'
import { Ico } from '../../ui/Ico'
import { LlamarAyuda } from '../../ui/LlamarAyuda'
import { clases } from '../../utils/clases'
import type { Cartas } from './useCartas'

const LARGO_MAXIMO_CARTA = 600

const INICIOS: Record<Carta['de'], string[]> = {
  hijo: ['Lo que no me animo a decirte es…', 'Me gustaría que…', 'Me preocupa…', 'Gracias por…'],
  familia: ['Estoy orgulloso/a de ti porque…', 'Perdón por…', 'Quiero que sepas que…', 'Me gustó cuando…'],
}

const REMITENTE: Record<Carta['de'], string> = { hijo: 'Carta de tu hijo/a', familia: 'Carta de tu familia' }

const fechaCorta = (iso: string) => new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })

function EscribirCarta({ de, onGuardada, onCancelar }: { de: Carta['de']; onGuardada: (texto: string) => void; onCancelar: () => void }) {
  const [texto, setTexto] = useState('')
  const riesgo = de === 'hijo' && hayRiesgo(texto)

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    if (texto.trim()) onGuardada(texto)
  }

  return (
    <form className="carta-nueva" onSubmit={guardar}>
      <h3 className="carga__subtitulo">{de === 'hijo' ? <><Ico icono={PencilSimpleLine} /> Escribe lo que no te animas a decir</> : <><Ico icono={Envelope} /> Escríbele a tu hijo/a</>}</h3>
      <p className="suave">Puedes empezar con una de estas frases:</p>
      <div className="inicios">
        {INICIOS[de].map((inicio) => (
          <button type="button" key={inicio} className="ficha" onClick={() => setTexto((t) => (t ? `${t}\n${inicio} ` : `${inicio} `))}>
            {inicio}
          </button>
        ))}
      </div>
      <textarea
        className="campo carta-nueva__texto"
        rows={6}
        maxLength={LARGO_MAXIMO_CARTA}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí…"
        aria-label="Tu carta"
      />
      <small className="suave">{texto.length}/{LARGO_MAXIMO_CARTA}</small>
      {riesgo && (
        <div className="retro retro--rosa" role="alert">
          Lo que escribes es importante y no tienes que cargarlo solo/a. Habla hoy con un adulto de confianza o llama ahora:
          <LlamarAyuda />
        </div>
      )}
      <div className="fila">
        <button className="boton" disabled={!texto.trim()}>Guardar en el bolsillo</button>
        <button type="button" className="boton boton--borde" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

// Lo que escribe el estudiante va a psicología: la IA le pone tema y prepara un consejo para los papás.
function CartaAlColegio({ onCancelar }: { onCancelar: () => void }) {
  const { mochila } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [nivel, setNivel] = useState(NIVELES_DE_ESTUDIANTE[0])
  const [texto, setTexto] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [enviada, setEnviada] = useState<{ urgente: boolean }>()
  const limpio = texto.trim()
  const urgente = hayRiesgo(texto)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!limpio || !acepta) return
    if (await ejecutar(() => mochila.escribirCarta({ carga: CARGA_POR_CLASIFICAR, texto: limpio, nivel, urgente }))) setEnviada({ urgente })
  }

  if (enviada) {
    return (
      <div className="carta-nueva carta-enviada">
        <h3 className="carga__subtitulo"><Ico icono={PaperPlaneTilt} /> ¡Tu carta va en camino!</h3>
        <p>Es anónima. Psicología del colegio la leerá y, si cuida a todos, la podrán leer las familias junto con un consejo para los papás.</p>
        {enviada.urgente && (
          <div className="retro retro--rosa" role="alert">
            Lo que sientes importa y no tienes que cargarlo solo/a. Como la carta es anónima, no sabremos quién eres: acércate hoy a psicología o a un adulto de confianza. Si estás en peligro, llama ahora:
            <LlamarAyuda />
          </div>
        )}
        <div className="fila">
          <Link className="boton boton--borde" to="/escribe">Ver cómo va mi carta</Link>
          <button type="button" className="enlace-discreto" onClick={onCancelar}>Cerrar</button>
        </div>
      </div>
    )
  }

  return (
    <form className="carta-nueva" onSubmit={enviar}>
      <h3 className="carga__subtitulo"><Ico icono={PencilSimpleLine} /> Escribe lo que no te animas a decir</h3>
      <p className="suave">¿En qué nivel estás?</p>
      <div className="inicios">
        {NIVELES_DE_ESTUDIANTE.map((n) => (
          <button type="button" key={n} className={clases('ficha', nivel === n && 'ficha--activa')} aria-pressed={nivel === n} onClick={() => setNivel(n)}>
            {n}
          </button>
        ))}
      </div>
      <p className="suave">Puedes empezar con una de estas frases:</p>
      <div className="inicios">
        {INICIOS.hijo.map((inicio) => (
          <button type="button" key={inicio} className="ficha" onClick={() => setTexto((t) => (t ? `${t}
${inicio} ` : `${inicio} `))}>
            {inicio}
          </button>
        ))}
      </div>
      <textarea
        className="campo carta-nueva__texto"
        rows={6}
        maxLength={LARGO_MAXIMO_CARTA_DE_ESTUDIANTE}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Querida familia…"
        aria-label="Tu carta"
      />
      <small className="suave">{texto.length}/{LARGO_MAXIMO_CARTA_DE_ESTUDIANTE}</small>
      {urgente && (
        <div className="retro retro--rosa" role="alert">
          Lo que escribes es importante y no tienes que cargarlo solo/a. Habla hoy con un adulto de confianza o llama ahora:
          <LlamarAyuda />
        </div>
      )}
      <label className="aceptar-normas">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>
          No escribí nombres ni datos que permitan reconocerme a mí ni a otras personas. Leí las{' '}
          <Link to="/privacidad#normas-de-las-cartas">normas de las cartas</Link>.
        </span>
      </label>
      {error && <p className="aviso-suave">{error}</p>}
      <div className="fila">
        <button className="boton" disabled={ocupado || !limpio || !acepta}><Ico icono={PaperPlaneTilt} /> Enviar mi carta</button>
        <button type="button" className="boton boton--borde" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

function SobreDeCarta({ carta, onAbrir, onBorrar }: { carta: Carta; onAbrir: () => void; onBorrar: () => void }) {
  const [abierta, setAbierta] = useState(false)
  const abrir = () => {
    setAbierta(true)
    onAbrir()
  }

  return (
    <li className="sobre">
      <div className="sobre__cabeza">
        {abierta ? <Ico icono={EnvelopeOpen} /> : <Ico icono={Envelope} />}
        <b>{REMITENTE[carta.de]}</b>
        <small className="suave">{fechaCorta(carta.fecha)}</small>
        {!carta.leida && <span className="sobre__nueva">Nueva</span>}
      </div>
      {abierta ? (
        <>
          <p className="sobre__texto mano">{carta.texto}</p>
          {carta.de === 'hijo' && (
            <p className="suave sobre__consejo">
              Antes de responder: agradécele por escribirte. No lo corrijas ni lo castigues por lo que te contó. Si quieres, respóndele con otra carta.
            </p>
          )}
          <button className="enlace-discreto" onClick={() => confirm('¿Borrar esta carta? No se puede recuperar.') && onBorrar()}>
            Borrar carta
          </button>
        </>
      ) : (
        <button className="boton boton--borde" onClick={abrir}>Abrir carta</button>
      )}
    </li>
  )
}

export function BolsilloSecreto({ cartas: { cartas, guardar, marcarLeida, borrar } }: { cartas: Cartas }) {
  const [escribiendo, setEscribiendo] = useState<Carta['de']>()
  const [guardada, setGuardada] = useState(false)

  const alGuardar = (texto: string) => {
    if (!escribiendo) return
    guardar(escribiendo, texto)
    setEscribiendo(undefined)
    setGuardada(true)
  }

  const empezar = (de: Carta['de']) => {
    setGuardada(false)
    setEscribiendo(de)
  }

  return (
    <article className="carga">
      <h2 className="mano titulo-tarjeta">El bolsillo secreto</h2>
      <p>
        Hay cosas que cuesta decir mirando a los ojos. <b>Si eres estudiante</b>, escribe aquí lo que no te animas a decir: llega de forma anónima a psicología del colegio
        y, si cuida a todos, la leerán las familias con un consejo para los papás.
      </p>
      <p className="privacidad"><Ico icono={LockSimple} /> Si eres la familia, tu carta para tu hijo se guarda solo en este celular, para que la lea cuando quiera.</p>

      {escribiendo === 'hijo' ? (
        <CartaAlColegio onCancelar={() => setEscribiendo(undefined)} />
      ) : escribiendo ? (
        <EscribirCarta de={escribiendo} onGuardada={alGuardar} onCancelar={() => setEscribiendo(undefined)} />
      ) : (
        <div className="fila">
          <button className="boton" onClick={() => empezar('hijo')}>Soy estudiante: escribir</button>
          <button className="boton boton--borde" onClick={() => empezar('familia')}>Soy la familia: escribir</button>
        </div>
      )}
      {guardada && <p className="aviso-suave"><Ico icono={Envelope} /> Carta guardada en el bolsillo. Avísale que tiene una carta esperando.</p>}

      {cartas.length > 0 && (
        <ul className="sobres">
          {cartas.map((carta) => (
            <SobreDeCarta key={carta.id} carta={carta} onAbrir={() => marcarLeida(carta.id)} onBorrar={() => borrar(carta.id)} />
          ))}
        </ul>
      )}
    </article>
  )
}
