import { useState } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { Etiqueta } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { usePersistente } from '../../hooks/usePersistente'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { clases } from '../../utils/clases'
import { agregarSinRepetir } from '../../utils/listas'

const ETIQUETA_SIN_NOMBRE = '?'

function DibujoDeMochila() {
  return (
    <svg className="mochila__dibujo" viewBox="0 0 300 360" aria-hidden="true">
      <path d="M115 52c0-26 70-26 70 0" fill="none" stroke="#3c3f46" strokeWidth="16" strokeLinecap="round" />
      <path d="M40 120c0-50 40-78 110-78s110 28 110 78v190c0 22-16 36-40 36H80c-24 0-40-14-40-36z" fill="#4a4e57" />
      <path d="M40 120c0-50 40-78 110-78s110 28 110 78v20H40z" fill="#565b66" />
      <rect x="80" y="250" width="140" height="80" rx="18" fill="#3f434b" />
      <path d="M92 270h116" stroke="#2f3238" strokeWidth="4" strokeDasharray="6 6" />
      <circle cx="150" cy="140" r="6" fill="#2f3238" />
    </svg>
  )
}

function Reflexion({ etiqueta }: { etiqueta?: Etiqueta }) {
  if (!etiqueta) return <p className="mano invitacion">Elige una etiqueta de la mochila…</p>
  const titulo = etiqueta.texto === ETIQUETA_SIN_NOMBRE ? 'Lo que aún no sé nombrar' : etiqueta.texto
  return (
    <>
      <h2 className="mano titulo-tarjeta">{titulo}</h2>
      <p>{etiqueta.reflexion}</p>
      <p className="pregunta-guia">🤔 {etiqueta.pregunta}</p>
    </>
  )
}

function MochilaInteractiva({ etiquetas }: { etiquetas: Etiqueta[] }) {
  const [vistas, setVistas] = usePersistente<string[]>(CLAVES_DE_PROGRESO.etiquetasMochila, [])
  const [activa, setActiva] = useState<string>()
  const abrioTodas = etiquetas.every((e) => vistas.includes(e.id))

  const elegir = (id: string) => {
    setActiva(id)
    setVistas((anteriores) => agregarSinRepetir(anteriores, id))
  }

  return (
    <>
      <div className={clases('mochila', abrioTodas && 'mochila--liviana')}>
        <DibujoDeMochila />
        {etiquetas.map((etiqueta) => (
          <button
            key={etiqueta.id}
            className={clases(
              'etiqueta',
              `etiqueta--${etiqueta.color}`,
              vistas.includes(etiqueta.id) && 'etiqueta--vista',
              activa === etiqueta.id && 'etiqueta--activa',
            )}
            style={{ left: `${etiqueta.x}%`, top: `${etiqueta.y}%`, rotate: `${etiqueta.giro}deg` }}
            onClick={() => elegir(etiqueta.id)}
            aria-pressed={activa === etiqueta.id}
          >
            {etiqueta.texto}
          </button>
        ))}
      </div>

      <div className="tarjeta revelado" aria-live="polite">
        <Reflexion etiqueta={etiquetas.find((e) => e.id === activa)} />
      </div>
      {abrioTodas && <p className="aviso-suave">✨ Abriste toda tu mochila. Reconocer lo que cargamos ya la hace más liviana.</p>}
    </>
  )
}

export default function Mochila() {
  const etiquetas = useContenido('etiquetas')
  return (
    <main>
      <Encabezado titulo="Mi mochila" icono="bag" />
      <div className="contenedor">
        <p className="entrada">
          Todos llevamos una mochila. Esta es la tuya ahora. Toca cada tema para ver cómo influye en tu forma de acompañar.
        </p>
        {etiquetas ? <MochilaInteractiva etiquetas={etiquetas} /> : <Cargando />}
      </div>
    </main>
  )
}
