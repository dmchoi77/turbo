# Nuxt Module Federation host

This Nuxt application consumes `SignalPanel` and `SignalCounter` from the
`nuxt-mf-remote` example. It runs at `http://localhost:4300`.

The example installs the published `@module-federation/nuxt@0.1.0` package so
it exercises the same artifacts as an external consumer.

From the `turbo` repository root:

```bash
pnpm install
pnpm --filter nuxt-mf-remote dev
pnpm --filter nuxt-mf-host dev
```

For production SSR verification, build both examples and start the remote
before the host:

```bash
pnpm --filter nuxt-mf-remote build
pnpm --filter nuxt-mf-host build
pnpm --filter nuxt-mf-remote preview
pnpm --filter nuxt-mf-host preview
```
