import { Check, FacebookLogo, LinkSimple, ShareNetwork, WhatsappLogo } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import type { Episodio } from '../../domain/tipos'
import { useConsulta } from '../../hooks/useConsulta'

export const PARAMETRO_EPISODIO = 'episodio'

const enlaceDe = (e: Episodio) => `${location.origin}/podcast?${PARAMETRO_EPISODIO}=${e.id}`
const mensajeDe = (e: Episodio) =>
  `Escucha el episodio ${e.numero} del podcast "Lo que no te enseñaron": ${e.titulo} (${e.duracion}). Para papás y mamás del colegio.`

function vecesCompartido(n: number) {
  if (n === 0) return 'Sé la primera familia en compartirlo'
  return n === 1 ? 'Compartido 1 vez' : `Compartido ${n} veces`
}

// En el celular abre el menú de compartir del teléfono; en la computadora, WhatsApp, Facebook o copiar el enlace.
export function CompartirEpisodio({ episodio }: { episodio: Episodio }) {
  const { podcast } = useServicios()
  const { datos } = useConsulta(useCallback(() => podcast.reacciones(episodio.id), [podcast, episodio.id]))
  const [sumadas, setSumadas] = useState(0)
  const [opciones, setOpciones] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const enlace = enlaceDe(episodio)
  const mensaje = mensajeDe(episodio)

  const contar = () => {
    setSumadas((n) => n + 1)
    podcast.contarCompartido(episodio.id).catch(() => setSumadas((n) => n - 1))
  }

  const compartir = async () => {
    if (!navigator.share) return setOpciones(!opciones)
    try {
      await navigator.share({ title: `Podcast #${episodio.numero}: ${episodio.titulo}`, text: mensaje, url: enlace })
      contar()
    } catch {
      // La persona cerró el menú sin compartir.
    }
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${mensaje} ${enlace}`)
      setCopiado(true)
      contar()
    } catch {
      prompt('Copia este enlace:', enlace)
    }
  }

  const total = (datos?.compartido ?? 0) + sumadas

  return (
    <div className="compartir-episodio">
      <button className="compartir-episodio__boton" onClick={compartir}>
        <ShareNetwork size={22} weight="bold" /> Compartir episodio
      </button>
      <span className="compartir-episodio__cuenta">{datos ? vecesCompartido(total) : ''}</span>
      {opciones && (
        <div className="compartir-episodio__opciones">
          <a className="compartir-episodio__opcion compartir-episodio__opcion--whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${mensaje} ${enlace}`)}`} target="_blank" rel="noopener noreferrer" onClick={contar}>
            <WhatsappLogo size={20} weight="fill" /> WhatsApp
          </a>
          <a className="compartir-episodio__opcion compartir-episodio__opcion--facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(enlace)}`} target="_blank" rel="noopener noreferrer" onClick={contar}>
            <FacebookLogo size={20} weight="fill" /> Facebook
          </a>
          <button className="compartir-episodio__opcion" onClick={copiar}>
            {copiado ? <Check size={20} weight="bold" /> : <LinkSimple size={20} weight="bold" />} {copiado ? 'Enlace copiado' : 'Copiar enlace'}
          </button>
        </div>
      )}
    </div>
  )
}
