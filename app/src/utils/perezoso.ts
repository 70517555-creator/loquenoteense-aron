type Metodos<T> = { [K in keyof T]: T[K] extends (...args: infer A) => Promise<infer R> ? (...args: A) => Promise<R> : never }

export function perezoso<T extends Metodos<T>>(cargar: () => Promise<T>): T {
  let instancia: Promise<T> | undefined
  const obtener = () => (instancia ??= cargar())

  return new Proxy({} as T, {
    get: (_, metodo) => async (...args: unknown[]) => {
      const objetivo = await obtener()
      const funcion = objetivo[metodo as keyof T] as (...a: unknown[]) => Promise<unknown>
      return funcion.apply(objetivo, args)
    },
  })
}
