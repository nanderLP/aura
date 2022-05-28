/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBSOCKET_URL: string;
  readonly VITE_WEBSOCKET_PROTOCOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
