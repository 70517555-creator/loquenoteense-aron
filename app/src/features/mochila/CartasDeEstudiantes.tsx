import { CaretLeft, CaretRight, Envelope, HandHeart, Heart, Sparkle } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const ETIQUETAS_DE_PESTANA = ['amarilla', 'verde', 'rosa', 'celeste', 'lila']

function HojaDeCarta({ carta, onQuitada }: { carta: CartaDeEstudiante; onQuitada: () => void }) {
  const { mochila, panel } = useServicios()
  const delEquipo = useEsDelEquipo()

  const quitar = async () => {
    if (!confirm('¿Quitar esta carta? Dejará de verse para todas las familias.')) return
    try {
      await panel.moderarCarta(carta, 'rechazado', MOTIVO_AL_RETIRAR)
      onQuitada()
    } catch {
      alert('No se pudo quitar. Revisa tu conexión e inténtalo otra vez.')
    }
  }

  return (
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
  )
}

// Un cuaderno abierto con pestañas de colores: una carta por página y, al lado, su consejo. Así no se hace una lista larga.
export function LibretaDeCartas({ cartas }: { cartas: CartaDeEstudiante[] }) {
  const [quitadas, setQuitadas] = useState<string[]>([])
  const [abierta, setAbierta] = useState(0)
  const pestanas = useRef<HTMLDivElement>(null)
  const visibles = cartas.filter((c) => !quitadas.includes(c.id))
  const actual = Math.max(0, Math.min(abierta, visibles.length - 1))

  // Con muchas cartas las pestañas se deslizan: la abierta siempre queda a la vista.
  useEffect(() => {
    const fila = pestanas.current
    const pestana = fila?.children[actual] as HTMLElement | undefined
    if (fila && pestana) fila.scrollTo({ left: pestana.offsetLeft - fila.clientWidth / 2 + pestana.clientWidth / 2, behavior: 'smooth' })
  }, [actual])

  if (!visibles.length) return null
  const carta = visibles[actual]

  const color = (i: number) => ETIQUETAS_DE_PESTANA[i % ETIQUETAS_DE_PESTANA.length]

  return (
    <div className="libreta">
      {visibles.length > 1 && (
        <div ref={pestanas} className="libreta__pestanas" role="tablist" aria-label="Cartas">
          {visibles.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={i === actual}
              className={clases('libreta__pestana', `libreta__pestana--${color(i)}`, i === actual && 'libreta__pestana--abierta')}
              onClick={() => setAbierta(i)}
            >
              Carta {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className={clases('libreta__paginas', `libreta__paginas--${color(actual)}`)} role="tabpanel" key={carta.id}>
        <div className="libreta__pagina">
          <HojaDeCarta carta={carta} onQuitada={() => setQuitadas((q) => [...q, carta.id])} />
        </div>
        <div className="libreta__espiral" aria-hidden="true" />
        <div className="libreta__pagina libreta__pagina--consejo">
          <ConsejoDeLaCarta carta={carta} />
          {visibles.length > 1 && (
            <div className="libreta__pasar">
              <button className="libreta__flecha" onClick={() => setAbierta(actual - 1)} disabled={actual === 0} aria-label="Carta anterior">
                <Ico icono={CaretLeft} />
              </button>
              <span className="suave">{actual + 1} de {visibles.length}</span>
              <button className="libreta__flecha" onClick={() => setAbierta(actual + 1)} disabled={actual === visibles.length - 1} aria-label="Carta siguiente">
                <Ico icono={CaretRight} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
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
      <LibretaDeCartas cartas={datos} />
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
