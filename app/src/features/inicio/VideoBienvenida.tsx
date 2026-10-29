import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useCerrarConEscape } from '../../hooks/useCerrarConEscape'
import { Icono } from '../../ui/Icono'
import { clases } from '../../utils/clases'
import { urlDeInsercion, type VideoDeYouTube } from './youtube'

interface Props {
  video: VideoDeYouTube
  onCerrar: () => void
}

function controlarReproductor(marco: RefObject<HTMLIFrameElement | null>) {
  const enviar = (func: string, args: unknown[] = []) =>
    marco.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')

  return {
    activarSonido() {
      enviar('unMute')
      enviar('setVolume', [100])
      enviar('playVideo')
    },
  }
}

export function VideoBienvenida({ video, onCerrar }: Props) {
  const marco = useRef<HTMLIFrameElement>(null)
  const botonCerrar = useRef<HTMLButtonElement>(null)
  const [conSonido, setConSonido] = useState(false)

  useCerrarConEscape(onCerrar)
  useEffect(() => botonCerrar.current?.focus(), [])

  const activarSonido = () => {
    controlarReproductor(marco).activarSonido()
    setConSonido(true)
  }

  return createPortal(
    <div className="video-bienvenida" role="dialog" aria-modal="true" aria-label="Video de bienvenida" onClick={onCerrar}>
      <div
        className={clases('video-bienvenida__caja', video.vertical && 'video-bienvenida__caja--vertical')}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={botonCerrar} className="video-bienvenida__cerrar" onClick={onCerrar} aria-label="Cerrar video">
          <Icono nombre="close" tam={22} />
        </button>
        <div className="video-bienvenida__marco">
          <iframe
            ref={marco}
            src={urlDeInsercion(video)}
            title="Video de bienvenida"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="video-bienvenida__pie">
          {conSonido ? (
            <p className="mano video-bienvenida__lema">Bienvenido, bienvenida ♡</p>
          ) : (
            <button className="boton boton--grande" onClick={activarSonido}>
              <Icono nombre="volume" tam={20} /> Activar sonido
            </button>
          )}
          <button className="boton boton--borde" onClick={onCerrar}>Entrar a la app</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
