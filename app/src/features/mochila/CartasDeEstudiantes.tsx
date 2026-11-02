import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import type { CartaDeEstudiante } from '../../domain/mochila'
import { useConsulta } from '../../hooks/useConsulta'
import { BotonDeVoto } from '../foro/BotonDeVoto'

function HojaDeCarta({ carta }: { carta: CartaDeEstudiante }) {
  const { mochila } = useServicios()
  return (
    <li className="hoja-de-carta">
      <p className="hoja-de-carta__texto mano">{carta.texto}</p>
      <p className="hoja-de-carta__firma mano">Un estudiante de {carta.nivel.toLowerCase()}</p>
      <BotonDeVoto id={carta.id} total={carta.meHizoPensar} votar={() => mochila.meHizoPensar(carta)}>
        💛 Me hizo pensar
      </BotonDeVoto>
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
      <h3 className="carga__subtitulo">✉️ {datos.length === 1 ? 'Un chico del colegio escribió sobre esto' : `${datos.length} chicos del colegio escribieron sobre esto`}</h3>
      <p className="suave sin-margen">Son cartas anónimas y reales. Psicología las revisó antes de publicarlas. Léelas pensando en tu hijo.</p>
      <ul className="hojas-de-carta">{datos.map((c) => <HojaDeCarta key={c.id} carta={c} />)}</ul>
    </section>
  )
}

export function InvitacionAEscribir() {
  return <Link className="enlace-discreto" to="/escribe">¿Eres estudiante? Escribe una carta anónima</Link>
}

export function useCartasPorBolsillo(): Record<string, number> {
  const { mochila } = useServicios()
  const { datos } = useConsulta(useCallback(() => mochila.cartasPublicadas(), [mochila]))
  const conteo: Record<string, number> = {}
  for (const carta of datos ?? []) conteo[carta.carga] = (conteo[carta.carga] ?? 0) + 1
  return conteo
}
