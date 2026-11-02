import { useLayoutEffect, useRef, useState } from 'react'
import { clases } from '../utils/clases'

// Un texto largo se muestra recortado a pocas líneas con "Leer más"; el corto, entero.
export function TextoRecortable({ texto, className }: { texto: string; className: string }) {
  const parrafo = useRef<HTMLParagraphElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [esLargo, setEsLargo] = useState(false)

  useLayoutEffect(() => {
    const p = parrafo.current
    if (p && !abierto) setEsLargo(p.scrollHeight > p.clientHeight + 2)
  }, [texto, abierto])

  return (
    <>
      <p ref={parrafo} className={clases(className, !abierto && 'texto-recortado')}>{texto}</p>
      {(esLargo || abierto) && (
        <button className="leer-mas" onClick={() => setAbierto(!abierto)}>{abierto ? 'Ver menos' : 'Leer más'}</button>
      )}
    </>
  )
}
