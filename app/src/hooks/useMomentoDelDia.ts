import { useEffect, useState } from 'react'

export type Momento = 'manana' | 'tarde' | 'atardecer' | 'noche'

const UN_MINUTO = 60_000

const INICIO_DE_CADA_MOMENTO: [desde: number, momento: Momento][] = [
  [19, 'noche'],
  [17, 'atardecer'],
  [12, 'tarde'],
  [5, 'manana'],
]

function momentoSegunHora(hora: number): Momento {
  return INICIO_DE_CADA_MOMENTO.find(([desde]) => hora >= desde)?.[1] ?? 'noche'
}

const momentoActual = () => momentoSegunHora(new Date().getHours())

const SALUDOS: Record<Momento, string> = {
  manana: 'Buenos días',
  tarde: 'Buenas tardes',
  atardecer: 'Buenas tardes',
  noche: 'Buenas noches',
}

export function useMomentoDelDia() {
  const [momento, setMomento] = useState(momentoActual)

  useEffect(() => {
    const id = setInterval(() => setMomento(momentoActual()), UN_MINUTO)
    return () => clearInterval(id)
  }, [])

  return { momento, saludo: SALUDOS[momento] }
}
