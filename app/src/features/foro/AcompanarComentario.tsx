import { HandHeart, Sparkle } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useServicios } from '../../app/servicios'
import { FIRMA_DE_PSICOLOGIA, type Comentario } from '../../domain/foro'
import { hayRiesgo } from '../../domain/riesgo'
import { useAccion } from '../../hooks/useAccion'
import { useCerrarConEscape } from '../../hooks/useCerrarConEscape'
import { Ico } from '../../ui/Ico'
import { Icono } from '../../ui/Icono'
import { pedirEnFila } from '../mochila/colaDeIA'
import { sinGuiones } from './useApodo'

const MAX_CARACTERES = 800

// Frases para empezar: acompañan y validan, sin sonar a sermón ni a chat informal.
const FRASES_PARA_EMPEZAR = [
  'Gracias por compartir esto con las demás familias.',
  'Lo que sientes tiene mucho sentido.',
  'No es algo que te pase solo a ti: a muchas familias del colegio les pasa algo parecido.',
  'Algo que puede ayudar es',
  'Si quieres conversarlo con calma, en psicología del colegio te escuchamos.',
]

const pedidoDeBorrador = (comentario: Comentario) =>
  `Soy del equipo de psicología del colegio y voy a responder en el foro de padres a este comentario de "${sinGuiones(comentario.apodo)}" sobre el tema "${comentario.temaTitulo}": "${comentario.texto}". ` +
  'Escribe una respuesta de 3 a 5 frases, cálida y profesional, que haga sentir a la familia acompañada y comprendida: valida lo que siente, ' +
  'da una idea concreta y amable, y ofrece el apoyo de psicología del colegio. Sin emojis, sin listas, sin saludos informales y sin firmar.'

interface Props {
  comentario: Comentario
  onCerrar: () => void
  onPublicado: () => void
}

export function AcompanarComentario({ comentario, onCerrar, onPublicado }: Props) {
  const { panel, asistente } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [texto, setTexto] = useState('')
  const [preparando, setPreparando] = useState(false)
  const [sinBorrador, setSinBorrador] = useState(false)
  const cerrar = useCallback(() => onCerrar(), [onCerrar])
  useCerrarConEscape(cerrar)
  const quien = sinGuiones(comentario.apodo).split(' · ')[0]
  const conRiesgo = comentario.urgente || hayRiesgo(comentario.texto)

  const agregarFrase = (frase: string) => setTexto((actual) => (actual.trim() ? `${actual.trimEnd()} ${frase}` : frase).slice(0, MAX_CARACTERES))

  const pedirBorrador = async () => {
    setPreparando(true)
    setSinBorrador(false)
    try {
      const respuesta = await pedirEnFila(asistente, { modo: 'traductor', mensajes: [{ rol: 'padre', texto: pedidoDeBorrador(comentario) }] }, true)
      if (respuesta.fuente === 'ia' && !respuesta.alerta) setTexto(respuesta.texto.replace(/\n{2,}/g, '\n').slice(0, MAX_CARACTERES))
      else setSinBorrador(true)
    } catch {
      setSinBorrador(true)
    } finally {
      setPreparando(false)
    }
  }

  const publicar = async () => {
    const limpio = texto.trim()
    if (limpio && (await ejecutar(() => panel.responder(comentario, limpio, FIRMA_DE_PSICOLOGIA)))) onPublicado()
  }

  return createPortal(
    <div className="responder" role="dialog" aria-modal="true" aria-label={`Acompañar a ${quien}`} onClick={cerrar}>
      <div className="responder__caja acompanar" onClick={(e) => e.stopPropagation()}>
        <div className="responder__cabecera">
          <h2 className="mano titulo-tarjeta sin-margen"><Ico icono={HandHeart} /> Acompañar a {quien}</h2>
          <button className="responder__cerrar" onClick={cerrar} aria-label="Cerrar"><Icono nombre="close" tam={20} /></button>
        </div>

        <blockquote className="acompanar__original">
          {comentario.texto}
          <small>{sinGuiones(comentario.apodo)} · {comentario.temaTitulo}</small>
        </blockquote>

        <div className="acompanar__frases">
          <small className="suave">Toca una frase para empezar:</small>
          {FRASES_PARA_EMPEZAR.map((frase) => (
            <button key={frase} type="button" className="ficha" onClick={() => agregarFrase(frase)}>{frase}</button>
          ))}
        </div>

        <textarea
          rows={6}
          value={texto}
          maxLength={MAX_CARACTERES}
          placeholder={preparando ? 'La IA está preparando un borrador…' : 'Escribe unas palabras que lo hagan sentir escuchado y acompañado.'}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Tu respuesta"
        />
        {conRiesgo ? (
          <small className="aviso-suave">Este comentario tiene señales de riesgo: por seguridad la IA no prepara borradores para estos casos. Escribe tú la respuesta.</small>
        ) : (
          <button type="button" className="enlace-discreto acompanar__ia" disabled={preparando} onClick={pedirBorrador}>
            {preparando ? 'Preparando borrador…' : <><Ico icono={Sparkle} /> {texto ? 'Pedir otro borrador a la IA' : 'Pedir un borrador a la IA'}</>}
          </button>
        )}
        {sinBorrador && <small className="aviso-suave">La IA no respondió esta vez. Intenta en un momento o escríbelo tú.</small>}
        {error && <p className="aviso-suave">{error}</p>}

        <p className="acompanar__firma">
          Se publicará en la nota de {quien}, firmado solo como <b>{FIRMA_DE_PSICOLOGIA}</b> (sin tu nombre)
        </p>
        <button className="boton boton--exito" disabled={ocupado || !texto.trim()} onClick={publicar}>
          <Ico icono={HandHeart} /> {ocupado ? 'Publicando…' : 'Publicar acompañamiento'}
        </button>
      </div>
    </div>,
    document.body,
  )
}
