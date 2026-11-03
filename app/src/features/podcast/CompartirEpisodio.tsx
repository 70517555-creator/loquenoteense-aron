import { Check, FacebookLogo, LinkSimple, ShareNetwork, WhatsappLogo } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import type { Episodio } from '../../domain/tipos'
import { useConsulta } from '../../hooks/useConsulta'

export const PARAMETRO_EPISODIO = 'episodio'

// Cada episodio tiene su página en public/escuchar/<id>.html con la vista previa para WhatsApp y Facebook.
const enlaceDe = (e: Episodio) => `${location.origin}/escuchar/${e.id}`
const mensajeDe = (e: Episodio) =>
  `Escucha el episodio ${e.numero} del podcast "Lo que no te enseñaron": ${e.titulo} (${e.duracion}). Para papás y mamás del colegio.`

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
    <div className="compartir-retro">
      <button className="retro-player__boton compartir-retro__boton" onClick={compartir} aria-label={`Compartir episodio${total ? ` (compartido ${total} veces)` : ''}`} title="Compartir episodio">
        <ShareNetwork size={20} weight="bold" />
        {total > 0 && <span className="compartir-retro__cuenta">{total}</span>}
      </button>
      {opciones && (
        <div className="compartir-retro__menu" role="menu">
          <a role="menuitem" className="compartir-retro__opcion" href={`https://wa.me/?text=${encodeURIComponent(`${mensaje} ${enlace}`)}`} target="_blank" rel="noopener noreferrer" onClick={contar}>
            <WhatsappLogo size={20} weight="fill" color="#3ee07f" /> WhatsApp
          </a>
          <a role="menuitem" className="compartir-retro__opcion" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(enlace)}`} target="_blank" rel="noopener noreferrer" onClick={contar}>
            <FacebookLogo size={20} weight="fill" color="#6aa5ff" /> Facebook
          </a>
          <button role="menuitem" className="compartir-retro__opcion" onClick={copiar}>
            {copiado ? <Check size={20} weight="bold" /> : <LinkSimple size={20} weight="bold" />} {copiado ? 'Enlace copiado' : 'Copiar enlace'}
          </button>
        </div>
      )}
    </div>
  )
}
