import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { router } from './app/rutas'
import { ProveedorServicios } from './app/ProveedorServicios'
import '@fontsource/caveat/latin-600.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './styles/index.css'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorServicios>
      <RouterProvider router={router} />
    </ProveedorServicios>
  </StrictMode>,
)
