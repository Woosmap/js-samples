/// <reference types="vite/client" />

/**
 *  @external https://vitejs.dev/guide/env-and-mode.html
 */
interface ImportMetaEnv {
  readonly VITE_WOOSMAP_PUBLIC_API_KEY: string;
  readonly VITE_WOOSMAP_SDK_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
