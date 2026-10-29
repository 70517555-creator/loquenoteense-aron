import { useState, type ReactNode } from 'react'
import { useAccion } from '../../hooks/useAccion'
import { clases } from '../../utils/clases'
import { useVotosPropios } from './useForo'

interface Props {
  id: string
  total: number
  votar: () => Promise<void>
  children: ReactNode
}

export function BotonDeVoto({ id, total, votar, children }: Props) {
  const { yaVoto, registrarVoto } = useVotosPropios()
  const { ocupado, ejecutar } = useAccion()
  const [sumado, setSumado] = useState(false)
  const votado = yaVoto(id)
  const conteo = total + Number(sumado)

  const alVotar = async () => {
    registrarVoto(id)
    setSumado(await ejecutar(votar))
  }

  return (
    <button className={clases('me-ayudo', votado && 'me-ayudo--activo')} onClick={alVotar} disabled={votado || ocupado}>
      {children}
      {conteo > 0 && ` · ${conteo}`}
    </button>
  )
}
