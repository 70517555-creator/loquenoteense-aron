import type { ProgressStore } from '../../ports/ProgressStore'

const PREFIJO = 'lqnte:'

export const localProgressStore: ProgressStore = {
  leer<T>(clave: string, porDefecto: T): T {
    try {
      const guardado = localStorage.getItem(PREFIJO + clave)
      return guardado === null ? porDefecto : (JSON.parse(guardado) as T)
    } catch {
      return porDefecto
    }
  },

  guardar<T>(clave: string, valor: T) {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
    } catch {
      return
    }
  },

  borrarTodo() {
    try {
      Object.keys(localStorage)
        .filter((clave) => clave.startsWith(PREFIJO))
        .forEach((clave) => localStorage.removeItem(clave))
    } catch {
      return
    }
  },
}
