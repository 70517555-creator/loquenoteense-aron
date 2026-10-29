import { OPCIONES_DE_GRADO, PARENTESCOS, useApodo } from './useApodo'

export function ElegirApodo() {
  const { apodo, texto, cambiar } = useApodo()

  return (
    <fieldset className="apodo">
      <legend className="suave">Aparecerás como: <b>{texto}</b></legend>
      <select aria-label="Soy" value={apodo.parentesco} onChange={(e) => cambiar({ parentesco: e.target.value })}>
        {PARENTESCOS.map((p) => <option key={p}>{p}</option>)}
      </select>
      <select aria-label="Grado de mi hijo o hija" value={apodo.grado} onChange={(e) => cambiar({ grado: e.target.value })}>
        {OPCIONES_DE_GRADO.map((g) => <option key={g}>{g}</option>)}
      </select>
    </fieldset>
  )
}
