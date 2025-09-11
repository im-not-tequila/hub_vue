/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // добавляй другие переменные по мере необходимости
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

