import { useEffect, useState, type RefObject } from 'react'

// Se vuelve true la primera vez que el elemento aparece en pantalla (y se queda así).
export function useAlVerse(ref: RefObject<Element | null>, margen = '200px'): boolean {
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    const elemento = ref.current
    if (visto || !elemento) return
    if (typeof IntersectionObserver === 'undefined') return setVisto(true)
    const observador = new IntersectionObserver(([entrada]) => entrada.isIntersecting && setVisto(true), { rootMargin: margen })
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [ref, margen, visto])
  return visto
}
