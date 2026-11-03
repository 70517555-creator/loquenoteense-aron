import type { Icon, IconWeight } from '@phosphor-icons/react'
import { clases } from '../utils/clases'

interface Props {
  icono: Icon
  peso?: IconWeight
  className?: string
}

// Ícono decorativo junto a un texto: mismo tamaño que la letra y en dos tonos.
export function Ico({ icono: Componente, peso = 'duotone', className }: Props) {
  return <Componente size="1.2em" weight={peso} className={clases('ico', className)} aria-hidden="true" />
}
