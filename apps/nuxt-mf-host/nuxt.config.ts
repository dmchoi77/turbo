export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  experimental: {
    viteEnvironmentApi: true,
  },
  modules: ["@module-federation/nuxt"],
  moduleFederation: {
    remoteComponents: {
      signalRemote: ["SignalPanel", "SignalCounter"],
    },
    config: {
      name: "signalHost",
      hostInitInjectLocation: "entry",
      remotes: {
        signalRemote: {
          type: "module",
          name: "signalRemote",
          entry: "http://localhost:4301/_mf/mf-manifest.json",
          entryGlobalName: "signalRemote",
          shareScope: "default",
        },
      },
    },
  },
});
