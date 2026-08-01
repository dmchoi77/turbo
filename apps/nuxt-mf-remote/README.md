# Nuxt Module Federation remote

This Nuxt application exposes `SignalPanel` and `SignalCounter` through the
published `@module-federation/nuxt@0.1.0` package. It runs at
`http://localhost:4301`.

Federation assets:

- `http://localhost:4301/_mf/mf-manifest.json`
- `http://localhost:4301/_mf/remoteEntry.js`
- `http://localhost:4301/_mf/remoteEntry.ssr.js`

The standalone page renders both exposed components locally. The host consumes
the same components through Module Federation.
