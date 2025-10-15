/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  // add more as needed:
  // readonly VITE_FEATURE_FLAG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
