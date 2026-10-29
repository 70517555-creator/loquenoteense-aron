import { useState, type ReactNode } from 'react'

interface Props {
  src: string
  alt?: string
  respaldo: ReactNode
  className?: string
}

export function Ilustracion({ src, alt = '', respaldo, className }: Props) {
  const [noDisponible, setNoDisponible] = useState(false)
  if (noDisponible) return <>{respaldo}</>
  return (
    <img className={className} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setNoDisponible(true)} />
  )
}
