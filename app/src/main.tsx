import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { router } from './app/rutas'
import { ProveedorServicios } from './app/ProveedorServicios'
import { registrarVisitaDelDia } from './app/registrarVisitaDelDia'
import { servicios } from './app/servicios'
import '@fontsource/caveat/latin-600.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './styles/index.css'

const MINUTOS_ENTRE_REVISIONES = 30

// La app instalada casi nunca se abre desde cero: busca la versión nueva al volver a ella y cada media hora.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registro) {
    if (!registro) return
    const buscarVersionNueva = () => navigator.onLine && registro.update().catch(() => {})
    setInterval(buscarVersionNueva, MINUTOS_ENTRE_REVISIONES * 60_000)
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && buscarVersionNueva())
  },
})
void registrarVisitaDelDia(servicios)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorServicios>
      <RouterProvider router={router} />
    </ProveedorServicios>
  </StrictMode>,
)
