import { config } from '../config'

export function LlamarAyuda() {
  return (
    <div className="ayuda-urgente">
      {config.ayuda.map((linea) => (
        <a key={linea.tel} className="boton boton--urgente" href={`tel:${linea.tel}`}>
          Llamar a {linea.nombre}
        </a>
      ))}
    </div>
  )
}
