# Local Next.js on kind Design

## Summary

This design adds a local Kubernetes workflow for running the `apps/web` Next.js application on a `kind` cluster. The workflow builds a production-style standalone Next.js container image, loads it into kind, applies Kubernetes manifests, and exposes the app through `kubectl port-forward`.

The scope is intentionally local-first. It is meant for learning and repeatable development experiments, not for a cloud production deployment.

## Goals

- Run `apps/web` inside a local `kind` Kubernetes cluster.
- Use a production-like Next.js standalone runtime image instead of `next dev`.
- Keep the setup small and understandable for local Kubernetes practice.
- Add documentation that lets a developer rebuild, deploy, verify, and clean up the local app.

## Non-Goals

- No cloud registry, ingress controller, TLS, autoscaling, or production Kubernetes hardening.
- No live file syncing into pods.
- No Kubernetes deployment for `apps/api` in this first step.
- No Skaffold, Tilt, Helm, or Kustomize dependency.

## Recommended Approach

Use a Next.js standalone container image and plain Kubernetes manifests.

The flow is:

1. Build `apps/web` with `output: "standalone"`.
2. Build a Docker image from the monorepo root context.
3. Load the image into the local kind cluster.
4. Apply Kubernetes YAML for a namespace, deployment, and service.
5. Use `kubectl port-forward` to open the app on `localhost`.

This is the best fit because it teaches the core Kubernetes primitives while staying close to how a Next.js app is normally packaged for production.

## Architecture

### Next.js Build

`apps/web/next.config.js` will enable standalone output. Next.js will emit a minimal server bundle under `.next/standalone`, along with static assets under `.next/static`.

The existing `transpilePackages` setting remains in place so workspace packages such as `@repo/ui` and `@repo/utils` continue to build correctly.

### Container Image

`apps/web/Dockerfile` will be a multi-stage Dockerfile:

- `base`: Node image with Corepack and pnpm 9.6.0.
- `deps`: install workspace dependencies from the lockfile.
- `builder`: build only the `web` package.
- `runner`: copy standalone server output and static assets, then run `node apps/web/server.js`.

The image will listen on port `3000` and set `NODE_ENV=production`.

The Docker build context should be the repository root so pnpm workspace packages are available during the build.

### Kubernetes Manifests

`k8s/local/web.yaml` will define:

- `Namespace`: `turbo-local`
- `Deployment`: `web`, with one replica using the local image
- `Service`: `web`, exposing port `3000` inside the cluster

The image pull policy should be `IfNotPresent` so kind uses the image loaded from the local Docker daemon.

### Local Access

Local access will use port forwarding:

```bash
kubectl -n turbo-local port-forward service/web 3000:3000
```

Then the app should be available at:

```text
http://localhost:3000
```

## File Changes

- `apps/web/next.config.js`
  - Add `output: "standalone"`.
- `apps/web/Dockerfile`
  - Add the production-style multi-stage image build.
- `.dockerignore`
  - Exclude generated output and local-only files from Docker build context.
- `k8s/local/web.yaml`
  - Add local Kubernetes resources for the web app.
- `docs/local-kubernetes.md`
  - Document setup, build, deploy, verify, and cleanup commands.

## Commands

Expected local workflow:

```bash
kind create cluster --name turbo-local
docker build -f apps/web/Dockerfile -t turbo-web:local .
kind load docker-image turbo-web:local --name turbo-local
kubectl apply -f k8s/local/web.yaml
kubectl -n turbo-local rollout status deployment/web
kubectl -n turbo-local port-forward service/web 3000:3000
```

Cleanup:

```bash
kubectl delete -f k8s/local/web.yaml
kind delete cluster --name turbo-local
```

## Error Handling

- If the image is not found by Kubernetes, reload it with `kind load docker-image turbo-web:local --name turbo-local`.
- If the pod crashes, inspect it with `kubectl -n turbo-local logs deployment/web` and `kubectl -n turbo-local describe pod`.
- If port `3000` is already occupied, use a different local port, for example `kubectl -n turbo-local port-forward service/web 3001:3000`.
- If the Docker build fails because workspace dependencies are missing, confirm the build context is the repository root.

## Testing And Verification

Implementation should verify:

- `pnpm --filter web build` succeeds.
- `docker build -f apps/web/Dockerfile -t turbo-web:local .` succeeds.
- `kind load docker-image turbo-web:local --name turbo-local` succeeds when a kind cluster exists.
- `kubectl apply -f k8s/local/web.yaml` succeeds.
- `kubectl -n turbo-local rollout status deployment/web` reports a ready deployment.
- A request to the port-forwarded app returns an HTML response.

## Risks

- Next.js standalone output can be sensitive to monorepo file paths. The Dockerfile should copy the exact standalone output layout that Next.js emits for this workspace.
- Native dependencies may require matching OS libraries in the runtime image. This app currently appears to use standard JavaScript dependencies, so a slim Node runtime should be enough.
- The current web app may call APIs that are not available inside the local cluster. This first design only guarantees the web process runs; API integration can be added later.

## Future Extensions

- Add `apps/api` deployment and internal service DNS.
- Add an ingress controller for hostname-based local routing.
- Add a `Makefile` or package script for the repeated local workflow.
- Add resource requests, liveness probes, and readiness probes after the basic path is stable.
