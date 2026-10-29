import { useState, type FormEvent } from 'react'
import type { Carta } from '../../domain/tipos'
import { hayRiesgo } from '../../domain/riesgo'
import { LlamarAyuda } from '../../ui/LlamarAyuda'
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
      <h3 className="carga__subtitulo">{de === 'hijo' ? '✍️ Escribe lo que no te animas a decir' : '💌 Escríbele a tu hijo/a'}</h3>
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

function SobreDeCarta({ carta, onAbrir, onBorrar }: { carta: Carta; onAbrir: () => void; onBorrar: () => void }) {
  const [abierta, setAbierta] = useState(false)
  const abrir = () => {
    setAbierta(true)
    onAbrir()
  }

  return (
    <li className="sobre">
      <div className="sobre__cabeza">
        <span aria-hidden="true">{abierta ? '📖' : '✉️'}</span>
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
        Hay cosas que cuesta decir mirando a los ojos. Aquí tu hijo puede dejarte una carta con lo que no se anima a decir en voz alta, y tú puedes responderle.
      </p>
      <p className="privacidad">🔒 Las cartas se guardan solo en este celular. No se envían a nadie, ni siquiera al colegio.</p>

      {escribiendo ? (
        <EscribirCarta de={escribiendo} onGuardada={alGuardar} onCancelar={() => setEscribiendo(undefined)} />
      ) : (
        <div className="fila">
          <button className="boton" onClick={() => empezar('hijo')}>Soy el hijo/a: escribir</button>
          <button className="boton boton--borde" onClick={() => empezar('familia')}>Soy la familia: escribir</button>
        </div>
      )}
      {guardada && <p className="aviso-suave">✉️ Carta guardada en el bolsillo. Avísale que tiene una carta esperando.</p>}

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
