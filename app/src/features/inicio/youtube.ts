import { config } from '../../config'

export interface VideoDeYouTube {
  id: string
  vertical: boolean
}

const DOMINIOS_DE_YOUTUBE = new Set(['youtube.com', 'youtube-nocookie.com'])
const RUTA_CON_ID = /^\/(?:shorts|embed|live)\/([^/?]+)/
const ID_VALIDO = /^[\w-]{6,}$/

function extraerId(url: URL): string | null {
  const dominio = url.hostname.replace(/^www\.|^m\./, '')
  if (dominio === 'youtu.be') return url.pathname.slice(1)
  if (DOMINIOS_DE_YOUTUBE.has(dominio)) return url.searchParams.get('v') ?? url.pathname.match(RUTA_CON_ID)?.[1] ?? null
  return null
}

export function leerYouTube(enlace: string): VideoDeYouTube | null {
  try {
    const url = new URL(enlace)
    const id = extraerId(url)
    return id && ID_VALIDO.test(id) ? { id, vertical: url.pathname.startsWith('/shorts/') } : null
  } catch {
    return null
  }
}

export const videoDeBienvenida = config.urlVideo ? leerYouTube(config.urlVideo) : null

export function urlDeInsercion({ id }: VideoDeYouTube): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    origin: window.location.origin,
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}
