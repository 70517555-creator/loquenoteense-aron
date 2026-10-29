import { Icono } from './Icono'

export function Rostro({ piel, pelo, polo, joven }: { piel: string; pelo: string; polo: string; joven?: boolean }) {
  return (
    <svg className="rostro" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#fff6e8" />
      <path d="M10 64c2-12 11-18 22-18s20 6 22 18z" fill={polo} />
      <rect x="27" y="38" width="10" height="10" rx="4" fill={piel} />
      <ellipse cx="32" cy="28" rx="12" ry="13.5" fill={piel} />
      {joven
        ? <path d="M19 28c-2-14 9-19 17-17 7 1 11 7 9 16-3-4-8-7-15-7-5 3-8 5-11 8z" fill={pelo} />
        : <path d="M20 25c0-10 7-14 13-14s11 4 11 13c-3-4-8-6-12-6s-9 3-12 7z" fill={pelo} />}
      <circle cx="27.5" cy="30" r="1.4" fill="#2b2433" />
      <circle cx="36.5" cy="30" r="1.4" fill="#2b2433" />
      <path d={joven ? 'M29 35.5q3 -1 6 0' : 'M29 35.5q3 1.6 6 0'} stroke="#2b2433" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function EscenaCuarto() {
  return (
    <svg className="escena" viewBox="0 0 320 170" role="img" aria-label="Una adolescente sentada en su cama, abrazando sus rodillas">
      <rect width="320" height="170" fill="#f6dcc6" />
      <rect y="128" width="320" height="42" fill="#e6c3a5" />
      <rect x="214" y="18" width="78" height="64" rx="4" fill="#ffc97a" />
      <path d="M253 18v64M214 50h78" stroke="#f6dcc6" strokeWidth="5" />
      <path d="M214 18h78v14c-26 8-52 8-78 0z" fill="#c8302c" opacity=".85" />
      <circle cx="70" cy="44" r="14" fill="none" stroke="#c98a1b" strokeWidth="3" />
      <rect x="24" y="104" width="206" height="36" rx="10" fill="#8f7cc0" />
      <rect x="24" y="96" width="206" height="18" rx="9" fill="#b7a8e0" />
      <ellipse cx="54" cy="96" rx="24" ry="10" fill="#fff6e8" />
      <path d="M112 108c0-22 10-34 26-34s24 12 24 34z" fill="#2f4a8a" />
      <ellipse cx="156" cy="100" rx="20" ry="17" fill="#3d5ba3" />
      <circle cx="140" cy="62" r="15" fill="#a86f4c" />
      <path d="M123 66c-3-18 8-26 19-24 10 2 15 10 13 20-2 14-3 26-10 36-5-12-9-10-15-6-5-8-6-16-7-26z" fill="#2a1d1a" />
      <ellipse cx="160" cy="92" rx="9" ry="6" fill="#a86f4c" />
      <rect x="244" y="104" width="46" height="36" rx="4" fill="#c79a74" />
      <rect x="252" y="90" width="12" height="14" rx="2" fill="#3f7d5c" />
      <circle cx="258" cy="84" r="9" fill="#5c9c75" />
    </svg>
  )
}

const TONOS: Record<string, [string, string]> = {
  phone: ['#fde3df', '#c8302c'],
  spark: ['#e6e9f6', '#1f2a44'],
  pad: ['#fff0cf', '#b07812'],
  heart: ['#dcefe3', '#3f7d5c'],
}

export function ArteIcono({ icono }: { icono: string }) {
  const [fondo, color] = TONOS[icono] ?? TONOS.spark
  return (
    <div className="arte-icono" style={{ background: fondo, color }} aria-hidden="true">
      <span className="arte-icono__burbuja" style={{ background: color }} />
      <Icono nombre={icono} tam={72} />
    </div>
  )
}
