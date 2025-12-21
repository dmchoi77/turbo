# syntax=docker/dockerfile:1
# Test Dockerfile for pnpm store caching with multi-stage build
# mc-web-2.dockerfile 구조를 참고하여 작성
FROM public.ecr.aws/docker/library/node:20.19.4-alpine AS base

# pnpm 환경 변수 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# pnpm 설치
RUN --mount=type=cache,target=/var/cache/apk \
    --mount=type=cache,target=/root/.npm \
    apk add libc6-compat && \
    npm install -g pnpm@9.0.0

# ===== INSTALLER STAGE - 의존성 설치 전용 =====
FROM base AS installer
WORKDIR /app

# 먼저 package.json 관련 파일들만 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# workspace 패키지들의 package.json만 복사
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# 의존성 설치
# 단일 스테이지 Dockerfile과 동일하게 id를 지정하지 않음
RUN --mount=type=cache,target=/pnpm \
    pnpm config set store-dir /pnpm && \
    pnpm fetch && \
    pnpm install --frozen-lockfile --ignore-scripts

# ===== BUILDER STAGE =====
FROM installer AS builder
WORKDIR /app

# 빌드 작업 (캐시 마운트)
RUN --mount=type=cache,target=/pnpm \
    echo "Builder stage"

# ===== RUNNER STAGE (최종 이미지) =====
FROM builder AS runner
WORKDIR /app

# 최종 스테이지에서 캐시를 마운트하여 buildkit-cache-dance가 추출할 수 있도록 함
# 단일 스테이지 Dockerfile과 동일하게 마지막 RUN 명령에서 캐시를 마운트
# 이 RUN 명령이 실행되는 동안 /pnpm이 마운트되어 있어야 buildkit-cache-dance가 추출 가능
RUN --mount=type=cache,target=/pnpm \
    pnpm store path && \
    echo "=== Cache is mounted and ready for buildkit-cache-dance extraction ==="

