import { HandHeart, Lightbulb, Plant, SmileyMelting, type Icon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import { REACCIONES, sinReacciones, type Reaccion } from '../../domain/podcast'
import { useConsulta } from '../../hooks/useConsulta'
import { clases } from '../../utils/clases'

const DETALLE: Record<Reaccion, { texto: string; Icono: Icon }> = {
  ayudo: { texto: 'Me ayudó', Icono: Lightbulb },
  identifique: { texto: 'Me identifiqué', Icono: HandHeart },
  intentare: { texto: 'Lo voy a intentar', Icono: Plant },
  emociono: { texto: 'Me emocionó', Icono: SmileyMelting },
}

export function Reacciones({ episodio }: { episodio: string }) {
  const { podcast } = useServicios()
  const { datos, fallo } = useConsulta(useCallback(() => podcast.reacciones(episodio), [podcast, episodio]))
  const [elegida, setElegida] = useState<Reaccion>()
  const [enviando, setEnviando] = useState(false)
  if (!datos && !fallo) return null
  const conteo = datos?.conteo ?? sinReacciones()

  const mia = elegida ?? datos?.miReaccion
  const reaccionar = async (r: Reaccion) => {
    if (mia || enviando) return
    setEnviando(true)
    setElegida(r)
    try {
      await podcast.reaccionar(episodio, r)
    } catch {
      setElegida(undefined)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="reacciones" aria-label="Reacciones al episodio">
      <p className="reacciones__pregunta">{mia ? 'Gracias por contarnos cómo te llegó.' : '¿Cómo te llegó este episodio?'}</p>
      <div className="reacciones__lista">
        {REACCIONES.map((r) => {
          const { texto, Icono } = DETALLE[r]
          const total = conteo[r] + (elegida === r ? 1 : 0)
          return (
            <button
              key={r}
              className={clases('reaccion-boton', mia === r && 'reaccion-boton--mia')}
              onClick={() => reaccionar(r)}
              disabled={!!mia && mia !== r}
              aria-pressed={mia === r}
            >
              <Icono size={26} weight={mia === r ? 'fill' : 'duotone'} />
              <span>{texto}</span>
              {total > 0 && <b>{total}</b>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
