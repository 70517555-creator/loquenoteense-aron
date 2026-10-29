import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import type { Psicologo } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { Equipo } from './Equipo'
import { ProgramarTemas } from './ProgramarTemas'
import { Publicados } from './Publicados'
import { Reportes } from './Reportes'
import { Resumen } from './Resumen'
import { Revisar } from './Revisar'

const SIN_PERMISO = 'Esta cuenta no está en el equipo de psicología. Pide a coordinación que te agregue.'

function Entrar({ onEntro }: { onEntro: (p: Psicologo) => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [sinPermiso, setSinPermiso] = useState(false)

  const entrar = () =>
    ejecutar(async () => {
      const psicologo = await panel.entrarConGoogle()
      setSinPermiso(!psicologo)
      if (psicologo) onEntro(psicologo)
    })

  return (
    <div className="tarjeta aviso-pantalla">
      <h2 className="mano aviso-pantalla__titulo">Panel de psicología</h2>
      <p className="suave">Revisa comentarios, responde a los padres y programa el tema del día.</p>
      {sinPermiso && <p className="aviso-suave">{SIN_PERMISO}</p>}
      {error && <p className="aviso-suave">No se pudo iniciar sesión. Inténtalo otra vez.</p>}
      <button className="boton boton--grande" disabled={ocupado} onClick={entrar}>Entrar con Google</button>
    </div>
  )
}

function Panel({ psicologo, onSalir }: { psicologo: Psicologo; onSalir: () => void }) {
  const secciones = [
    { titulo: 'Por revisar', contenido: <Revisar psicologo={psicologo} /> },
    { titulo: 'Temas', contenido: <ProgramarTemas /> },
    { titulo: 'Reportes', contenido: <Reportes /> },
    ...(psicologo.coordinador
      ? [
          { titulo: 'Publicados', contenido: <Publicados /> },
          { titulo: 'Equipo', contenido: <Equipo yo={psicologo} /> },
          { titulo: 'Resumen', contenido: <Resumen /> },
        ]
      : []),
  ]
  const [activa, setActiva] = useState(0)

  return (
    <>
      <div className="panel__saludo">
        <p>Hola, <b>{psicologo.nombre}</b></p>
        <button className="enlace-discreto" onClick={onSalir}>Salir</button>
      </div>
      <Fichas etiqueta="Secciones del panel" opciones={secciones.map((s) => s.titulo)} activa={activa} onCambiar={setActiva} />
      {secciones[activa].contenido}
    </>
  )
}

export default function Psicologia() {
  const { panel } = useServicios()
  const sesion = useConsulta(useCallback(() => panel.sesionActual(), [panel]))
  const [psicologo, setPsicologo] = useState<Psicologo | null>()
  const actual = psicologo === undefined ? sesion.datos : psicologo

  const salir = async () => {
    await panel.salir()
    setPsicologo(null)
  }

  return (
    <main>
      <Encabezado titulo="Psicología" icono="heart" volverA="/foro" />
      <div className="contenedor foro">
        {sesion.cargando && psicologo === undefined ? (
          <Cargando />
        ) : actual ? (
          <Panel psicologo={actual} onSalir={salir} />
        ) : (
          <Entrar onEntro={setPsicologo} />
        )}
      </div>
    </main>
  )
}
