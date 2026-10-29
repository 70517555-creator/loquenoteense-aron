import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AvisoDePantalla } from './AvisoDePantalla'

interface Props {
  children: ReactNode
}

interface Estado {
  hayError: boolean
}

export class LimiteDeError extends Component<Props, Estado> {
  state: Estado = { hayError: false }

  static getDerivedStateFromError(): Estado {
    return { hayError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en pantalla:', error, info)
  }

  render() {
    if (!this.state.hayError) return this.props.children
    return (
      <AvisoDePantalla titulo="Algo se desacomodó en esta habitación" descripcion="No es tu culpa. Intenta de nuevo o vuelve a la casa.">
        <button className="boton" onClick={() => location.reload()}>Reintentar</button>
        <a className="boton boton--borde" href="/casa">Volver a la casa</a>
      </AvisoDePantalla>
    )
  }
}
