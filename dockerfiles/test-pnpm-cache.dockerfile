# syntax=docker/dockerfile:1
# Test Dockerfile for pnpm store caching
FROM public.ecr.aws/docker/library/node:20.19.4-alpine AS base

# pnpm 환경 변수 설정
# 문서에 따르면 PNPM_HOME을 store-dir로 직접 사용
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# pnpm 설치
RUN --mount=type=cache,target=/var/cache/apk \
    --mount=type=cache,target=/root/.npm \
    apk add libc6-compat && \
    npm install -g pnpm@9.0.0

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 pnpm-lock.yaml, workspace 설정 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# workspace 패키지들의 package.json만 복사
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# 디버깅: 캐시 주입 후 확인 (문서 방식)
RUN --mount=type=cache,target=${PNPM_HOME} \
    echo "=== DEBUG: pnpm store location and size ===" && \
    echo "PNPM_HOME: $PNPM_HOME" && \
    echo "PNPM contents before install: $(ls -la ${PNPM_HOME} 2>/dev/null || echo 'empty')" && \
    STORE_PATH=$(pnpm store path) && \
    echo "Store path: $STORE_PATH" && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "Store exists: YES" && \
      du -sh "$STORE_PATH" && \
      find "$STORE_PATH" -type f 2>/dev/null | wc -l | xargs echo "File count:"; \
    else \
      echo "Store exists: NO"; \
    fi && \
    echo "==========================================="

# pnpm install 실행 (문서 방식)
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts 2>&1 | grep -E "(reused|Progress:|Done)" && \
    echo "=== After install ===" && \
    pnpm store path | xargs du -sh 2>/dev/null || echo "Store not found"
