export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@module-federation/nuxt"],
  moduleFederation: {
    manifestMetadata: {
      example: "turbo-nuxt-mf-signal-console",
    },
    config: {
      name: "signalRemote",
    },
  },
});
