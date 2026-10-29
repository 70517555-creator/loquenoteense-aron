import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import { config } from '../../config'
import { normasDelForo, politicaDePrivacidad, type SeccionDePolitica } from '../../content/politicas'
import { Encabezado } from '../../ui/Encabezado'

function Seccion({ seccion }: { seccion: SeccionDePolitica }) {
  return (
    <section className="politica__seccion" id={seccion.id}>
      <h2 className="titulo-tarjeta">{seccion.titulo}</h2>
      {seccion.parrafos?.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
      {seccion.puntos && (
        <ul>
          {seccion.puntos.map((punto) => <li key={punto}>{punto}</li>)}
        </ul>
      )}
    </section>
  )
}

function Contacto() {
  return (
    <section className="tarjeta politica__contacto" id="contacto">
      <h2 className="titulo-tarjeta">¿Tienes dudas o quieres ejercer tus derechos?</h2>
      {config.correoDePrivacidad ? (
        <p>
          Escríbenos a <a href={`mailto:${config.correoDePrivacidad}`}>{config.correoDePrivacidad}</a> o acércate a la
          Dirección del {config.colegio}.
        </p>
      ) : (
        <p>Acércate a la Dirección del {config.colegio}.</p>
      )}
      <p className="suave">
        También puedes presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de
        Justicia y Derechos Humanos.
      </p>
    </section>
  )
}

function BorrarMisDatos() {
  const { progreso } = useServicios()
  const [borrado, setBorrado] = useState(false)

  const borrar = () => {
    if (!confirm('¿Borrar tu avance, tus notas y tu apodo de este celular? No se puede deshacer.')) return
    progreso.borrarTodo()
    setBorrado(true)
  }

  return (
    <section className="tarjeta politica__borrar">
      <h2 className="titulo-tarjeta">Borrar mis datos de este celular</h2>
      <p className="suave">Elimina tu avance, tus notas de los retos, tu apodo y tus votos. Tus comentarios del foro no se borran con este botón.</p>
      {borrado ? (
        <p className="aviso-suave">Listo, borramos tus datos de este celular.</p>
      ) : (
        <button className="boton boton--borde" onClick={borrar}>Borrar mis datos</button>
      )}
    </section>
  )
}

function useIrAlAncla() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])
}

export default function Privacidad() {
  useIrAlAncla()
  return (
    <main>
      <Encabezado titulo="Privacidad y normas" icono="lock" />
      <div className="contenedor politica">
        <p className="suave">Te contamos, con palabras sencillas, qué información usa esta app, para qué y cómo la cuidamos.</p>
        {politicaDePrivacidad.map((seccion) => <Seccion key={seccion.id} seccion={seccion} />)}
        <section className="tarjeta politica__normas" id="normas-del-foro">
          <h2 className="titulo-tarjeta">Normas del foro "Entre padres"</h2>
          <ol>
            {normasDelForo.map((norma) => <li key={norma}>{norma}</li>)}
          </ol>
        </section>
        <BorrarMisDatos />
        <Contacto />
      </div>
    </main>
  )
}
