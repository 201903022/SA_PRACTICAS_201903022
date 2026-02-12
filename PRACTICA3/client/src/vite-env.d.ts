interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_PREFIX: string;
  // Agrega aquí todas tus variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}