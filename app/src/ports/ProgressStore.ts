export interface ProgressStore {
  leer<T>(clave: string, porDefecto: T): T
  guardar<T>(clave: string, valor: T): void
  borrarTodo(): void
}
