# syntax=docker/dockerfile:1
# ❌ 캐시 추출이 실패하는 시나리오 예시
# 이 Dockerfile은 의도적으로 캐시 추출이 실패하도록 설계되었습니다
FROM public.ecr.aws/docker/library/node:20.19.4-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN --mount=type=cache,target=/var/cache/apk \
    --mount=type=cache,target=/root/.npm \
    apk add libc6-compat && \
    npm install -g pnpm@9.0.0

WORKDIR /app

# ============================================
# 시나리오 1: id를 생략 (스테이지 간 캐시 공유 실패 가능)
# ============================================
FROM base AS installer-no-id
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# ❌ id를 생략 - 멀티 스테이지에서 캐시 공유가 불안정할 수 있음
RUN --mount=type=cache,target=${PNPM_HOME} \
    echo "=== SCENARIO 1: No ID specified ===" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts && \
    echo "Installed packages, but cache might not be shared across stages"

# ============================================
# 시나리오 2: 각 스테이지에서 다른 id 사용 (캐시 공유 실패)
# ============================================
FROM base AS installer-different-id
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# ❌ installer 스테이지에서 id=installer-cache 사용
RUN --mount=type=cache,target=${PNPM_HOME},id=installer-cache \
    echo "=== SCENARIO 2: Different IDs per stage ===" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts && \
    echo "Installed with installer-cache"

FROM installer-different-id AS builder-different-id
# ❌ builder 스테이지에서 다른 id 사용 - installer의 캐시를 사용하지 못함
RUN --mount=type=cache,target=${PNPM_HOME},id=builder-cache \
    echo "=== SCENARIO 2: Builder stage with different ID ===" && \
    STORE_PATH=$(pnpm store path) && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "✅ Cache exists (but it's a NEW empty cache, not from installer)"; \
    else \
      echo "❌ Cache NOT found"; \
    fi

# ============================================
# 시나리오 3: 최종 스테이지에서 캐시를 마운트하지 않음 (추출 실패)
# ============================================
FROM base AS installer-with-id
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# ✅ id를 명시하여 캐시 공유 준비
RUN --mount=type=cache,target=${PNPM_HOME},id=pnpm-store \
    echo "=== SCENARIO 3: Installer with ID ===" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts && \
    echo "Installed with pnpm-store cache"

FROM base AS runner-no-mount
WORKDIR /app

# ❌ 최종 스테이지에서 캐시를 마운트하지 않음
# buildkit-cache-dance가 Extract할 때 /pnpm이 마운트되지 않아 추출 실패
RUN echo "=== SCENARIO 3: Runner stage WITHOUT cache mount ===" && \
    echo "⚠️ /pnpm is NOT mounted here" && \
    echo "❌ buildkit-cache-dance will fail to extract cache" && \
    ls -la /pnpm 2>/dev/null || echo "/pnpm does not exist or is empty"

# ============================================
# 시나리오 4: 일반 디렉토리 사용 (캐시 마운트 없음)
# ============================================
FROM base AS installer-no-cache-mount
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# ❌ --mount=type=cache를 사용하지 않고 일반 디렉토리로 사용
# 이 경우 /pnpm이 이미지 레이어에 포함되지만, buildkit-cache-dance는 추출할 수 없음
RUN echo "=== SCENARIO 4: No cache mount, using regular directory ===" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts && \
    echo "⚠️ /pnpm is in image layer, but buildkit-cache-dance cannot extract it"

FROM base AS runner-no-cache-mount-final
WORKDIR /app

# ❌ 최종 스테이지는 base에서 시작하므로 installer의 /pnpm을 상속받지 않음
RUN echo "=== SCENARIO 4: Runner stage ===" && \
    echo "❌ /pnpm from installer stage is NOT available here" && \
    echo "❌ buildkit-cache-dance will fail to extract"

# ============================================
# 시나리오 5: 최종 스테이지에서 다른 id 사용 (추출 실패)
# ============================================
FROM base AS installer-correct-id
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# ✅ installer에서 id=pnpm-store 사용
RUN --mount=type=cache,target=${PNPM_HOME},id=pnpm-store \
    echo "=== SCENARIO 5: Installer with correct ID ===" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts && \
    echo "Installed with pnpm-store"

FROM base AS runner-wrong-id
WORKDIR /app

# ❌ 최종 스테이지에서 다른 id 사용 - installer의 캐시를 사용하지 못함
# buildkit-cache-dance는 /pnpm을 찾지만, 다른 id의 캐시이므로 추출 실패
RUN --mount=type=cache,target=${PNPM_HOME},id=runner-cache \
    echo "=== SCENARIO 5: Runner with DIFFERENT ID ===" && \
    echo "⚠️ Using id=runner-cache instead of id=pnpm-store" && \
    echo "❌ This is a NEW empty cache, not the one from installer" && \
    STORE_PATH=$(pnpm store path) && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "Cache exists but it's empty (new cache)"; \
    else \
      echo "Cache NOT found"; \
    fi && \
    echo "❌ buildkit-cache-dance will extract an empty cache"

# ============================================
# 최종 스테이지 (실패 시나리오 중 하나 선택)
# ============================================
# 각 시나리오를 테스트하려면 아래 FROM을 변경하세요:
# FROM runner-no-mount          # 시나리오 3
# FROM runner-no-cache-mount-final  # 시나리오 4
# FROM runner-wrong-id          # 시나리오 5

FROM runner-no-mount

