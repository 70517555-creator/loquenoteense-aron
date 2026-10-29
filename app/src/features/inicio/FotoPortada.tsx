import { useState } from 'react'

type Version = 'movil' | 'escritorio' | 'ninguna'

export function FotoPortada() {
  const [version, setVersion] = useState<Version>('movil')
  if (version === 'ninguna') return null

  const alFallar = () => setVersion(version === 'movil' ? 'escritorio' : 'ninguna')

  return (
    <picture className="portada__foto">
      {version === 'movil' && (
        <source media="(max-width: 700px), (orientation: portrait)" srcSet="/images/portada-movil.webp" />
      )}
      <img
        src="/images/portada.webp"
        alt="Una familia abrazada, de espaldas, mirando el colegio al atardecer"
        onError={alFallar}
      />
    </picture>
  )
}
