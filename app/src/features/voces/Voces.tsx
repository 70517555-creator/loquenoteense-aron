import { Envelope, Microphone } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import type { Voz } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { masRecientePrimero } from '../../domain/foro'
import { HojaDeCarta, InvitacionAEscribir, NotaDeConsejos, useCartasPublicadas } from '../mochila/CartasDeEstudiantes'

const COLORES_DE_AVATAR = ['#c8302c', '#1f2a44', '#b07812', '#3f7d5c', '#7a5ca8', '#b2507a']
const RETRASO_DE_ENTRADA_MS = 80

const colorDeAvatar = (posicion: number) => COLORES_DE_AVATAR[posicion % COLORES_DE_AVATAR.length]

function TarjetaDeVoz({ voz, posicion }: { voz: Voz; posicion: number }) {
  return (
    <li className="tarjeta voz" style={{ animationDelay: `${posicion * RETRASO_DE_ENTRADA_MS}ms` }}>
      <span className="voz__avatar" style={{ background: colorDeAvatar(posicion) }} aria-hidden="true">
        {voz.iniciales}
      </span>
      <div>
        <p className="voz__texto">“{voz.texto}”</p>
        <small className="suave">Estudiante, {voz.grado}</small>
      </div>
    </li>
  )
}

function CartasRecientes() {
  const cartas = useCartasPublicadas()
  if (!cartas?.length) return null
  return (
    <section className="voces__cartas">
      <h2 className="mano titulo-tarjeta sin-margen"><Ico icono={Envelope} /> Lo que nos escriben los chicos</h2>
      <p className="suave sin-margen">Cartas anónimas y reales de estudiantes del colegio. Psicología las revisó antes de publicarlas.</p>
      <NotaDeConsejos />
      <ul className="hojas-de-carta">{[...cartas].sort(masRecientePrimero).map((c) => <HojaDeCarta key={c.id} carta={c} />)}</ul>
    </section>
  )
}

export default function Voces() {
  const voces = useContenido('voces')
  return (
    <main>
      <Encabezado titulo="Voces reales" icono="mic" />
      <div className="contenedor">
        <CartasRecientes />
        <h2 className="mano titulo-tarjeta"><Ico icono={Microphone} /> Lo que dijeron en la encuesta</h2>
        <p className="entrada">Esto dijeron los estudiantes de nuestro colegio. Sus nombres se mantienen en reserva.</p>
        {voces ? (
          <ul className="voces">
            {voces.map((voz, i) => <TarjetaDeVoz key={voz.id} voz={voz} posicion={i} />)}
          </ul>
        ) : (
          <Cargando />
        )}
        <div className="retro">
          <Icono nombre="bulb" tam={20} /> Cada familia es diferente. Lo importante es abrir la conversación.
        </div>
        <InvitacionAEscribir />
      </div>
    </main>
  )
}
