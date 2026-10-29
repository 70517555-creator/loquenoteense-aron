import { useState, type CSSProperties } from 'react'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import type { Etiqueta } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { usePersistente } from '../../hooks/usePersistente'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { clases } from '../../utils/clases'
import { agregarSinRepetir } from '../../utils/listas'

const ETIQUETA_SIN_NOMBRE = '?'

function Cremallera({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="#0f1b30" strokeWidth="7" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#b9c4d6" strokeWidth="2" strokeDasharray="2 3" />
    </>
  )
}

function Jalador({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-4" y="-3" width="8" height="7" rx="2" fill="#8c96a8" />
      <rect x="-4.5" y="3" width="9" height="20" rx="4.5" fill="#c8302c" />
      <rect x="-2" y="6" width="4" height="9" rx="2" fill="#7d1b18" />
    </g>
  )
}

function DibujoDeMochila() {
  return (
    <svg className="mochila__dibujo" viewBox="0 0 300 360" aria-hidden="true">
      <defs>
        <linearGradient id="mochila-tela" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35527a" />
          <stop offset="1" stopColor="#1c2d4a" />
        </linearGradient>
        <linearGradient id="mochila-bolsillo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b4467" />
          <stop offset="1" stopColor="#18263f" />
        </linearGradient>
        <pattern id="mochila-malla" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#16233a" />
          <circle cx="2.5" cy="2.5" r="1" fill="#2c4262" />
        </pattern>
      </defs>
      <path d="M96 64C58 76 40 150 44 252" fill="none" stroke="#14213a" strokeWidth="20" strokeLinecap="round" />
      <path d="M204 64c38 12 56 86 52 188" fill="none" stroke="#14213a" strokeWidth="20" strokeLinecap="round" />
      <path d="M122 50c0-26 56-26 56 0" fill="none" stroke="#14213a" strokeWidth="12" strokeLinecap="round" />
      <rect x="30" y="206" width="26" height="104" rx="10" fill="url(#mochila-malla)" />
      <rect x="244" y="206" width="26" height="104" rx="10" fill="url(#mochila-malla)" />
      <path d="M48 112c0-50 42-76 102-76s102 26 102 76v192c0 26-18 40-44 40H92c-26 0-44-14-44-40z" fill="url(#mochila-tela)" />
      <path d="M58 116c0-40 36-66 92-66s92 26 92 66" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeDasharray="5 4" />
      <path d="M64 96c14-30 44-46 86-46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
      <Cremallera d="M66 122c12-50 156-50 168 0" />
      <Jalador x={228} y={110} />
      <rect x="72" y="208" width="156" height="112" rx="26" fill="url(#mochila-bolsillo)" />
      <rect x="80" y="216" width="140" height="96" rx="20" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="5 4" />
      <Cremallera d="M88 234h124" />
      <Jalador x={190} y={234} />
      <path d="M60 330c30 12 150 12 180 0" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="6" strokeLinecap="round" />
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
            style={{ left: `${etiqueta.x}%`, top: `${etiqueta.y}%`, '--giro': `${etiqueta.giro}deg` } as CSSProperties}
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
