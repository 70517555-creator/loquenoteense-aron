interface ImportMetaEnv {
  readonly VITE_ASSISTANT_URL?: string
  readonly VITE_PODCAST_URL?: string
  readonly VITE_VIDEO_URL?: string
  readonly VITE_PRIVACY_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
