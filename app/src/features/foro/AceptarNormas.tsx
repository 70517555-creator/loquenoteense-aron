import { Link } from 'react-router-dom'

interface Props {
  aceptada: boolean
  onCambiar: (acepta: boolean) => void
}

export function AceptarNormas({ aceptada, onCambiar }: Props) {
  return (
    <label className="aceptar-normas">
      <input type="checkbox" checked={aceptada} onChange={(e) => onCambiar(e.target.checked)} />
      <span>
        Leí y acepto las <Link to="/privacidad#normas-del-foro">normas del foro</Link> y la{' '}
        <Link to="/privacidad">política de privacidad</Link>.
      </span>
    </label>
  )
}
