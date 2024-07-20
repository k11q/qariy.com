// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "nuxt-headlessui", '@vueuse/nuxt', '@nuxtjs/web-vitals'],
  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/index.html']
    }
  },

  css: [
    "~/layouts/global.css",
  ],

  compatibilityDate: "2024-07-21",
})