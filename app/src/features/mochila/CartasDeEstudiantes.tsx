import { Envelope, HandHeart, Heart, Sparkle } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import type { CartaDeEstudiante } from '../../domain/mochila'
import { useConsulta } from '../../hooks/useConsulta'
import { MOTIVO_AL_RETIRAR } from '../../domain/foro'
import { Icono } from '../../ui/Icono'
import { TextoRecortable } from '../../ui/TextoRecortable'
import { clases } from '../../utils/clases'
import { BotonDeVoto } from '../foro/BotonDeVoto'
import { useEsDelEquipo } from '../foro/useEsDelEquipo'
import { useConsejoDeCarta } from './useConsejoDeCarta'

function ConsejoDeLaCarta({ carta }: { carta: CartaDeEstudiante }) {
  const { consejo, preparando } = useConsejoDeCarta(carta)
  if (preparando) return <p className="consejo-de-carta consejo-de-carta--preparando"><Ico icono={Sparkle} /> Preparando un consejo para ti…</p>
  if (!consejo) return null
  return (
    <div className={clases('consejo-de-carta', consejo.de === 'psicologia' && 'consejo-de-carta--psicologia')}>
      <b>{consejo.de === 'psicologia' ? <><Ico icono={HandHeart} /> Lo que dice psicología</> : <><Ico icono={Sparkle} /> Una idea para ti</>}</b>
      <TextoRecortable texto={consejo.texto} className="consejo-de-carta__texto" />
    </div>
  )
}

export function HojaDeCarta({ carta }: { carta: CartaDeEstudiante }) {
  const { mochila, panel } = useServicios()
  const delEquipo = useEsDelEquipo()
  const [quitada, setQuitada] = useState(false)
  if (quitada) return null

  const quitar = async () => {
    if (!confirm('¿Quitar esta carta? Dejará de verse para todas las familias.')) return
    try {
      await panel.moderarCarta(carta, 'rechazado', MOTIVO_AL_RETIRAR)
      setQuitada(true)
    } catch {
      alert('No se pudo quitar. Revisa tu conexión e inténtalo otra vez.')
    }
  }

  return (
    <li className="carta-con-consejo">
      <div className="hoja-de-carta">
        {delEquipo && (
          <button className="comentario__quitar hoja-de-carta__quitar" onClick={quitar} aria-label="Quitar esta carta" title="Quitar carta (solo psicología)">
            <Icono nombre="close" tam={14} />
          </button>
        )}
        <p className="hoja-de-carta__texto mano">{carta.texto}</p>
        <p className="hoja-de-carta__firma mano">Un estudiante de {carta.nivel.toLowerCase()}</p>
        <BotonDeVoto id={carta.id} total={carta.meHizoPensar} votar={() => mochila.meHizoPensar(carta)}>
          <Ico icono={Heart} /> Me hizo pensar
        </BotonDeVoto>
      </div>
      <ConsejoDeLaCarta carta={carta} />
    </li>
  )
}

// Lo más valioso de cada bolsillo: lo que escribieron de verdad los chicos del colegio. Solo aparece si hay cartas publicadas.
export function CartasDeEstudiantes({ carga }: { carga: string }) {
  const { mochila } = useServicios()
  const { datos } = useConsulta(useCallback(() => mochila.cartas(carga), [mochila, carga]))
  if (!datos?.length) return null

  return (
    <section className="carga__bloque cartas-de-chicos">
      <h3 className="carga__subtitulo"><Ico icono={Envelope} /> {datos.length === 1 ? 'Un chico del colegio escribió sobre esto' : `${datos.length} chicos del colegio escribieron sobre esto`}</h3>
      <p className="suave sin-margen">Son cartas anónimas y reales. Psicología las revisó antes de publicarlas. Léelas pensando en tu hijo.</p>
      <NotaDeConsejos />
      <ul className="hojas-de-carta">{datos.map((c) => <HojaDeCarta key={c.id} carta={c} />)}</ul>
    </section>
  )
}

export function NotaDeConsejos() {
  return <small className="suave"><Ico icono={HandHeart} /> Los consejos en verde son de psicología. <Ico icono={Sparkle} /> Las ideas en amarillo las prepara la inteligencia artificial.</small>
}

export function InvitacionAEscribir() {
  return <Link className="enlace-discreto" to="/escribe">¿Eres estudiante? Escribe una carta anónima</Link>
}

export function useCartasPublicadas() {
  const { mochila } = useServicios()
  return useConsulta(useCallback(() => mochila.cartasPublicadas(), [mochila])).datos
}

export function useCartasPorBolsillo(): Record<string, number> {
  const datos = useCartasPublicadas()
  const conteo: Record<string, number> = {}
  for (const carta of datos ?? []) conteo[carta.carga] = (conteo[carta.carga] ?? 0) + 1
  return conteo
}
