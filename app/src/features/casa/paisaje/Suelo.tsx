import type { Momento } from '../../../hooks/useMomentoDelDia'
import { pseudoaleatorio, repetir } from './pseudoaleatorio'

type Ubicacion = [x: number, y: number, escala: number]

const COLINAS = {
  lejos: 'M0 190 C180 120 330 150 470 175 C640 205 760 110 940 130 C1110 150 1250 95 1440 140 V360 H0Z',
  medio: 'M0 245 C210 190 380 230 560 240 C760 252 900 195 1080 205 C1240 214 1340 185 1440 200 V360 H0Z',
  cerca: 'M0 300 C240 270 480 292 720 290 C960 288 1200 268 1440 285 V360 H0Z',
}

const ARBOLES: Ubicacion[] = [[90, 232, 1.1], [205, 238, 0.85], [1240, 205, 1.05], [1350, 214, 0.8], [1150, 212, 0.7]]
const MATORRALES: Ubicacion[] = [[40, 300, 1], [330, 296, 0.8], [1090, 290, 0.9], [1395, 292, 1.1]]

const FLORES_POR_LADO = 13
const FLORES = repetir(FLORES_POR_LADO * 2, (i) => ({
  x: (i < FLORES_POR_LADO ? 20 : 940) + pseudoaleatorio(i, 10) * 480,
  y: 300 + pseudoaleatorio(i, 11) * 50,
  radio: 3 + pseudoaleatorio(i, 12) * 2.5,
  color: i % 4,
}))

const LUCIERNAGAS = repetir(12, (i) => ({
  izquierda: 4 + pseudoaleatorio(i, 6) * 92,
  abajo: 40 + pseudoaleatorio(i, 7) * 150,
  retraso: pseudoaleatorio(i, 8) * 6,
  duracion: 5 + pseudoaleatorio(i, 9) * 5,
}))

const PARPADEO_DE_LUCIERNAGA_S = 2.2

const ubicar = ([x, y, escala]: Ubicacion) => `translate(${x} ${y}) scale(${escala})`

function Arbol({ ubicacion }: { ubicacion: Ubicacion }) {
  return (
    <g className="arbol" transform={ubicar(ubicacion)}>
      <path className="arbol__tronco" d="M-6 34 L-4 -20 Q0 -30 4 -20 L6 34Z" />
      <circle className="arbol__copa" cx="-24" cy="-34" r="24" />
      <circle className="arbol__copa" cx="22" cy="-36" r="26" />
      <circle className="arbol__copa" cx="0" cy="-62" r="30" />
      <circle className="arbol__copa" cx="-4" cy="-26" r="22" />
      <circle className="arbol__copa--luz" cx="-12" cy="-72" r="13" />
      <circle className="arbol__copa--luz" cx="-30" cy="-44" r="8" />
    </g>
  )
}

function Matorral({ ubicacion }: { ubicacion: Ubicacion }) {
  return (
    <g className="matorral" transform={ubicar(ubicacion)}>
      <circle cx="-18" cy="-6" r="16" />
      <circle cx="2" cy="-14" r="20" />
      <circle cx="22" cy="-5" r="15" />
    </g>
  )
}

function Luciernagas() {
  return LUCIERNAGAS.map((luciernaga, i) => (
    <span
      key={i}
      className="luciernaga"
      style={{
        left: `${luciernaga.izquierda}%`,
        bottom: luciernaga.abajo,
        animationDelay: `${luciernaga.retraso}s, ${luciernaga.retraso}s`,
        animationDuration: `${luciernaga.duracion}s, ${PARPADEO_DE_LUCIERNAGA_S}s`,
      }}
    />
  ))
}

export function Suelo({ momento }: { momento: Momento }) {
  const hayLuciernagas = momento === 'noche' || momento === 'atardecer'
  return (
    <div className="suelo" aria-hidden="true">
      <svg className="suelo__colinas" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice">
        <path className="colina colina--lejos" d={COLINAS.lejos} />
        <path className="colina colina--medio" d={COLINAS.medio} />
        {ARBOLES.map((ubicacion, i) => <Arbol key={i} ubicacion={ubicacion} />)}
        <path className="colina colina--cerca" d={COLINAS.cerca} />
        {MATORRALES.map((ubicacion, i) => <Matorral key={i} ubicacion={ubicacion} />)}
        {FLORES.map((flor, i) => (
          <circle key={i} className={`florcita florcita--${flor.color}`} cx={flor.x} cy={flor.y} r={flor.radio} />
        ))}
      </svg>
      {hayLuciernagas && <Luciernagas />}
    </div>
  )
}
