// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['./assets/css/main.css'],
  runtimeConfig: {
    aiProvider: process.env.AI_PROVIDER || 'ollama',
    openAiApiKey: process.env.OPENAI_API_KEY || '',
    openAiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  },
})
