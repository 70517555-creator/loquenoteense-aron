import { ArrowClockwise, ArrowCounterClockwise, Pause, Play, SpeakerHigh, SpeakerSlash, Stop } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { Episodio } from '../../domain/tipos'
import { formatoMinutosSegundos } from '../../utils/tiempo'

const SALTO_SEGUNDOS = 15
const VELOCIDADES = [1, 1.25, 1.5]
const BARRAS = 28

interface Props {
  episodio: Episodio
  onEmpezar?: () => void
  accion?: React.ReactNode
}

// El ecualizador lee el audio de verdad; si el navegador no lo permite, las barras se mueven solas.
function useEcualizador(audio: React.RefObject<HTMLAudioElement | null>, lienzo: React.RefObject<HTMLCanvasElement | null>, sonando: boolean) {
  const analizador = useRef<AnalyserNode | null>(null)
  const contexto = useRef<AudioContext | null>(null)

  const conectar = () => {
    if (contexto.current || !audio.current) return
    try {
      const ctx = new AudioContext()
      const fuente = ctx.createMediaElementSource(audio.current)
      const nodo = ctx.createAnalyser()
      nodo.fftSize = 128
      nodo.smoothingTimeConstant = 0.75
      fuente.connect(nodo)
      nodo.connect(ctx.destination)
      contexto.current = ctx
      analizador.current = nodo
    } catch {
      analizador.current = null
    }
  }

  useEffect(() => {
    const c = lienzo.current
    const g = c?.getContext('2d')
    if (!c || !g) return
    let cuadro = 0
    const datos = new Uint8Array(64)
    const dibujar = (t: number) => {
      const ancho = (c.width = c.clientWidth * devicePixelRatio)
      const alto = (c.height = c.clientHeight * devicePixelRatio)
      g.clearRect(0, 0, ancho, alto)
      if (sonando && analizador.current) analizador.current.getByteFrequencyData(datos)
      const paso = ancho / BARRAS
      for (let i = 0; i < BARRAS; i++) {
        const real = analizador.current && sonando ? Math.min(1, (datos[Math.floor((i / BARRAS) * 22) + 1] / 255) * (1 + i / BARRAS)) : 0
        const simulado = sonando && !analizador.current ? 0.35 + 0.3 * Math.sin(t / 180 + i * 0.7) * Math.sin(t / 420 + i) : 0
        const nivel = Math.max(0.06, real || simulado)
        const bloques = Math.round(nivel * 12)
        for (let b = 0; b < bloques; b++) {
          const y = alto - (b + 1) * (alto / 12)
          g.fillStyle = b > 9 ? '#ff6b5e' : b > 6 ? '#ffd75e' : '#6dfc9b'
          g.fillRect(i * paso + paso * 0.15, y + 1, paso * 0.7, alto / 12 - 2)
        }
      }
      if (sonando) cuadro = requestAnimationFrame(dibujar)
    }
    cuadro = requestAnimationFrame(dibujar)
    return () => cancelAnimationFrame(cuadro)
  }, [sonando, lienzo])

  useEffect(() => () => void contexto.current?.close(), [])

  return { conectar, reanudar: () => contexto.current?.resume() }
}

export function ReproductorRetro({ episodio, onEmpezar, accion }: Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const [sonando, setSonando] = useState(false)
  const [tiempo, setTiempo] = useState(0)
  const [duracion, setDuracion] = useState(0)
  const [volumen, setVolumen] = useState(1)
  const [mudo, setMudo] = useState(false)
  const [velocidad, setVelocidad] = useState(1)
  const { conectar, reanudar } = useEcualizador(audio, lienzo, sonando)

  const alternar = async () => {
    const a = audio.current
    if (!a) return
    if (!a.paused) return a.pause()
    conectar()
    await reanudar()
    await a.play().catch(() => {})
    onEmpezar?.()
  }

  const detener = () => {
    const a = audio.current
    if (!a) return
    a.pause()
    a.currentTime = 0
  }

  const saltar = (segundos: number) => {
    const a = audio.current
    if (a) a.currentTime = Math.min(Math.max(0, a.currentTime + segundos), a.duration || 0)
  }

  const cambiarVelocidad = () => {
    const siguiente = VELOCIDADES[(VELOCIDADES.indexOf(velocidad) + 1) % VELOCIDADES.length]
    setVelocidad(siguiente)
    if (audio.current) audio.current.playbackRate = siguiente
  }

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volumen
      audio.current.muted = mudo
    }
  }, [volumen, mudo])

  const avance = duracion ? (tiempo / duracion) * 100 : 0

  return (
    <section className="retro-player" aria-label={`Reproductor del episodio ${episodio.numero}`}>
      <audio
        ref={audio}
        src={episodio.audioUrl}
        preload="metadata"
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
        onEnded={() => setSonando(false)}
        onTimeUpdate={(e) => setTiempo(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
      />
      <div className="retro-player__pantalla">
        <canvas ref={lienzo} className="retro-player__barras" aria-hidden="true" />
        <div className="retro-player__lcd">
          <span className="retro-player__marquesina">
            <span>EPISODIO {episodio.numero} · {episodio.titulo.toUpperCase()} · LO QUE NO TE ENSEÑARON ·&nbsp;</span>
          </span>
          <span className="retro-player__estado">{sonando ? '► REPRODUCIENDO' : tiempo > 0 ? '❚❚ EN PAUSA' : '■ LISTO'}</span>
          <span className="retro-player__tiempo">{formatoMinutosSegundos(tiempo * 1000)} / {formatoMinutosSegundos(duracion * 1000)}</span>
        </div>
      </div>

      <input
        className="retro-player__progreso"
        type="range"
        min={0}
        max={duracion || 0}
        step={1}
        value={tiempo}
        style={{ '--avance': `${avance}%` } as React.CSSProperties}
        onChange={(e) => audio.current && (audio.current.currentTime = Number(e.target.value))}
        aria-label="Avance del episodio"
      />

      <div className="retro-player__controles">
        <button className="retro-player__boton" onClick={detener} aria-label="Detener">
          <Stop weight="fill" size={18} />
        </button>
        <button className="retro-player__boton" onClick={() => saltar(-SALTO_SEGUNDOS)} aria-label={`Retroceder ${SALTO_SEGUNDOS} segundos`}>
          <ArrowCounterClockwise weight="bold" size={18} />
          <small>{SALTO_SEGUNDOS}</small>
        </button>
        <button className="retro-player__play" onClick={alternar} aria-label={sonando ? 'Pausar' : 'Reproducir'}>
          {sonando ? <Pause weight="fill" size={30} /> : <Play weight="fill" size={30} />}
        </button>
        <button className="retro-player__boton" onClick={() => saltar(SALTO_SEGUNDOS)} aria-label={`Adelantar ${SALTO_SEGUNDOS} segundos`}>
          <ArrowClockwise weight="bold" size={18} />
          <small>{SALTO_SEGUNDOS}</small>
        </button>
        <button className="retro-player__boton retro-player__velocidad" onClick={cambiarVelocidad} aria-label="Cambiar velocidad">
          {velocidad}x
        </button>
        {accion}
        <div className="retro-player__volumen">
          <button className="retro-player__boton" onClick={() => setMudo(!mudo)} aria-label={mudo ? 'Activar sonido' : 'Silenciar'}>
            {mudo || volumen === 0 ? <SpeakerSlash weight="fill" size={18} /> : <SpeakerHigh weight="fill" size={18} />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={mudo ? 0 : volumen} onChange={(e) => { setVolumen(Number(e.target.value)); setMudo(false) }} aria-label="Volumen" />
        </div>
      </div>
    </section>
  )
}
