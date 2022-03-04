/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
