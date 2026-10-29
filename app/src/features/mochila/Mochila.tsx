import { useRef, useState, type CSSProperties } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { CargaDelHijo } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { usePersistente } from '../../hooks/usePersistente'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { clases } from '../../utils/clases'
import { agregarSinRepetir } from '../../utils/listas'
import { BolsilloSecreto } from './BolsilloSecreto'
import { DetalleDeCarga } from './DetalleDeCarga'
import { DibujoDeMochila } from './DibujoDeMochila'
import { useCartas } from './useCartas'

const BOLSILLO = 'bolsillo'

function MochilaInteractiva({ cargas }: { cargas: CargaDelHijo[] }) {
  const [abiertas, setAbiertas] = usePersistente<string[]>(CLAVES_DE_PROGRESO.cargasAbiertas, [])
  const [activa, setActiva] = useState<string>()
  const cartas = useCartas()
  const { sinLeer } = cartas
  const detalle = useRef<HTMLDivElement>(null)
  const indiceActivo = cargas.findIndex((c) => c.id === activa)
  const vistas = cargas.filter((c) => abiertas.includes(c.id)).length

  const elegir = (id: string) => {
    setActiva(id)
    if (id !== BOLSILLO) setAbiertas((anteriores) => agregarSinRepetir(anteriores, id))
    requestAnimationFrame(() => detalle.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <>
      <div className={clases('mochila', vistas === cargas.length && 'mochila--liviana')}>
        <DibujoDeMochila />
        {cargas.map((carga) => (
          <button
            key={carga.id}
            className={clases(
              'etiqueta',
              `etiqueta--${carga.color}`,
              abiertas.includes(carga.id) && 'etiqueta--vista',
              activa === carga.id && 'etiqueta--activa',
            )}
            style={{ left: `${carga.x}%`, top: `${carga.y}%`, '--giro': `${carga.giro}deg` } as CSSProperties}
            onClick={() => elegir(carga.id)}
            aria-pressed={activa === carga.id}
          >
            {carga.etiqueta}
          </button>
        ))}
        <button
          className={clases('carta-del-bolsillo', activa === BOLSILLO && 'carta-del-bolsillo--activa')}
          onClick={() => elegir(BOLSILLO)}
          aria-pressed={activa === BOLSILLO}
          aria-label={`Bolsillo secreto${sinLeer ? `: ${sinLeer} carta(s) sin leer` : ''}`}
        >
          <span aria-hidden="true">✉️</span> Bolsillo secreto
          {sinLeer > 0 && <span className="carta-del-bolsillo__aviso">{sinLeer}</span>}
        </button>
      </div>

      <p className="suave centrado">Abriste {vistas} de {cargas.length} cosas que carga tu hijo</p>

      <div className="tarjeta revelado" ref={detalle}>
        {activa === BOLSILLO ? (
          <BolsilloSecreto cartas={cartas} />
        ) : indiceActivo >= 0 ? (
          <DetalleDeCarga key={activa} carga={cargas[indiceActivo]} orden={indiceActivo} />
        ) : (
          <p className="mano invitacion">Toca una etiqueta de la mochila…</p>
        )}
      </div>
      {vistas === cargas.length && (
        <p className="aviso-suave">✨ Abriste toda su mochila. Entender lo que carga ya lo hace sentir menos solo.</p>
      )}
    </>
  )
}

export default function Mochila() {
  const cargas = useContenido('cargas')
  return (
    <main>
      <Encabezado titulo="La mochila de tu hijo" icono="bag" />
      <div className="contenedor">
        <p className="entrada">
          Tu hijo carga cosas que no siempre te cuenta. Toca cada etiqueta para entender qué le pasa, practicar qué decirle y llevarte un reto de 10 minutos.
          {' '}<b>7 de 16 familias del colegio nos dijeron que su hijo necesita más tiempo con ellas</b>: diez minutos de verdad ya son un buen comienzo.
        </p>
        {cargas ? <MochilaInteractiva cargas={cargas} /> : <Cargando />}
      </div>
    </main>
  )
}
