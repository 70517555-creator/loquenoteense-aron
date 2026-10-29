export const config = {
  nombreApp: 'Lo que no te enseñaron',
  colegio: 'I.E.P. Santísimo Cristo Moreno',
  urlAsistente: import.meta.env.VITE_ASSISTANT_URL?.trim() || undefined,
  urlPodcast: import.meta.env.VITE_PODCAST_URL?.trim() || undefined,
  urlVideo: import.meta.env.VITE_VIDEO_URL?.trim() || undefined,
  correoDePrivacidad: import.meta.env.VITE_PRIVACY_EMAIL?.trim() || undefined,
  correoDeLaDuena: 'aneska2291@gmail.com',
  firebase: {
    apiKey: 'AIzaSyD4ileGy-gS8zG4h1u1oHOaLGa9-YsAjlI',
    authDomain: 'cristomoreno-3ccba.firebaseapp.com',
    projectId: 'cristomoreno-3ccba',
    appId: '1:396979313694:web:15cde50e615c54b8a8620f',
  },
  ayuda: [
    { nombre: 'Línea 113, opción 5', detalle: 'Salud mental · MINSA · gratuita, 24 h', tel: '113' },
    { nombre: 'Línea 100', detalle: 'Violencia familiar · gratuita, 24 h', tel: '100' },
    { nombre: 'SAMU 106', detalle: 'Emergencias médicas', tel: '106' },
  ],
}
