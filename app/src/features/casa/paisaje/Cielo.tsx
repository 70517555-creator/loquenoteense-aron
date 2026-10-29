import type { Momento } from '../../../hooks/useMomentoDelDia'
import { clases } from '../../../utils/clases'
import { pseudoaleatorio, repetir } from './pseudoaleatorio'

const ESTRELLAS = repetir(46, (i) => ({
  izquierda: pseudoaleatorio(i, 1) * 100,
  arriba: pseudoaleatorio(i, 2) * 58,
  tamano: 1 + Math.round(pseudoaleatorio(i, 3) * 2),
  retraso: pseudoaleatorio(i, 4) * 4,
  duracion: 2.5 + pseudoaleatorio(i, 5) * 3,
  esDestello: i % 9 === 0,
}))

const RAYOS_DEL_SOL = 12

function Nube({ variante }: { variante: number }) {
  return (
    <svg className={`nube nube--${variante}`} viewBox="0 0 220 100">
      <circle cx="70" cy="62" r="34" />
      <circle cx="112" cy="44" r="42" />
      <circle cx="158" cy="62" r="30" />
      <circle cx="40" cy="74" r="22" />
      <rect x="40" y="62" width="150" height="34" rx="17" />
    </svg>
  )
}

function Pajaro({ variante }: { variante: number }) {
  return (
    <svg className={`pajaro pajaro--${variante}`} viewBox="0 0 24 10">
      <path d="M1 6 Q6 0 12 6 Q18 0 23 6" />
    </svg>
  )
}

function Sol() {
  return (
    <span className="sol">
      <svg viewBox="0 0 100 100" className="sol__rayos">
        {repetir(RAYOS_DEL_SOL, (i) => (
          <rect key={i} x="48" y="2" width="4" height="14" rx="2" transform={`rotate(${(i * 360) / RAYOS_DEL_SOL} 50 50)`} />
        ))}
      </svg>
    </span>
  )
}

function CieloNocturno() {
  return (
    <>
      {ESTRELLAS.map((estrella, i) => (
        <span
          key={i}
          className={clases('estrella', estrella.esDestello && 'estrella--destello')}
          style={{
            left: `${estrella.izquierda}%`,
            top: `${estrella.arriba}%`,
            width: estrella.tamano,
            height: estrella.tamano,
            animationDelay: `${estrella.retraso}s`,
            animationDuration: `${estrella.duracion}s`,
          }}
        />
      ))}
      <span className="fugaz" />
      <span className="fugaz fugaz--2" />
      <span className="luna"><i /><i /><i /></span>
    </>
  )
}

export function Cielo({ momento }: { momento: Momento }) {
  const hayPajaros = momento === 'manana' || momento === 'tarde'
  return (
    <div className="cielo" aria-hidden="true">
      {momento === 'noche' ? <CieloNocturno /> : <Sol />}
      {[1, 2, 3].map((variante) => <Nube key={variante} variante={variante} />)}
      {hayPajaros && [1, 2, 3].map((variante) => <Pajaro key={variante} variante={variante} />)}
    </div>
  )
}
