import type { ReactNode } from 'react'
import { ContextoDeServicios, servicios } from './servicios'

export function ProveedorServicios({ children }: { children: ReactNode }) {
  return <ContextoDeServicios.Provider value={servicios}>{children}</ContextoDeServicios.Provider>
}
