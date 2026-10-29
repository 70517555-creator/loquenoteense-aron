import { useCallback, useState, type FormEvent } from 'react'
import { useServicios } from '../../app/servicios'
import { config } from '../../config'
import type { Psicologo } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'

const NUEVO: Psicologo = { correo: '', nombre: '', coordinador: false }

function FormularioDeIntegrante({ onAgregado }: { onAgregado: () => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [nuevo, setNuevo] = useState(NUEVO)
  const completo = nuevo.correo.includes('@') && nuevo.nombre.trim()

  const agregar = async (e: FormEvent) => {
    e.preventDefault()
    if (!completo) return
    if (await ejecutar(() => panel.agregarAlEquipo(nuevo))) {
      setNuevo(NUEVO)
      onAgregado()
    }
  }

  return (
    <form className="tarjeta formulario-foro" onSubmit={agregar}>
      <h3 className="titulo-tarjeta">Agregar al equipo</h3>
      <input type="email" placeholder="Correo de Google" value={nuevo.correo} onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })} />
      <input placeholder="Nombre que verán los padres (ej.: Ps. Rosa)" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
      <label className="casilla">
        <input type="checkbox" checked={nuevo.coordinador} onChange={(e) => setNuevo({ ...nuevo, coordinador: e.target.checked })} />
        También puede agregar o quitar integrantes
      </label>
      {error && <p className="aviso-suave">{error}</p>}
      <button className="boton" disabled={ocupado || !completo}>Agregar</button>
    </form>
  )
}

function Integrante({ psicologo, protegido, onQuitado }: { psicologo: Psicologo; protegido: boolean; onQuitado: () => void }) {
  const { panel } = useServicios()
  const { ocupado, ejecutar } = useAccion()
  const quitar = async () => {
    if (confirm(`¿Quitar a ${psicologo.nombre} del equipo?`) && (await ejecutar(() => panel.quitarDelEquipo(psicologo)))) onQuitado()
  }

  return (
    <li className="tarjeta tema-anterior">
      <small className="suave">{psicologo.correo}{psicologo.coordinador && ' · coordinación'}</small>
      <b>{psicologo.nombre}</b>
      {!protegido && <button className="enlace-discreto" disabled={ocupado} onClick={quitar}>Quitar</button>}
    </li>
  )
}

export function Equipo({ yo }: { yo: Psicologo }) {
  const { panel } = useServicios()
  const { datos, cargando, recargar } = useConsulta(useCallback(() => panel.equipo(), [panel]))

  return (
    <section className="conversacion">
      <FormularioDeIntegrante onAgregado={recargar} />
      {cargando && !datos && <Cargando />}
      <ul className="lista-panel">
        {datos?.map((p) => <Integrante key={p.correo} psicologo={p} protegido={p.correo === yo.correo || p.correo === config.correoDeLaDuena} onQuitado={recargar} />)}
      </ul>
    </section>
  )
}
