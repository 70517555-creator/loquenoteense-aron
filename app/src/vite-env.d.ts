interface ImportMetaEnv {
  readonly VITE_ASSISTANT_URL?: string
  readonly VITE_PODCAST_URL?: string
  readonly VITE_VIDEO_URL?: string
  readonly VITE_PRIVACY_EMAIL?: string
}

declare const __VERSION__: string

interface ImportMeta {
  readonly env: ImportMetaEnv
}
