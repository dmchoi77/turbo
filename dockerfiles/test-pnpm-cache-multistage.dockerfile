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
# fetch로 먼저 다운로드만 하고, offline 모드로 설치하여 속도 향상
# --ignore-scripts: husky 등 prepare 스크립트 실행 방지 (Docker에서는 불필요)
# 
# ⚠️ 캐시 추출 문제 분석을 위한 두 가지 방식 테스트:
# 
# 방식 1: --mount=type=cache 사용 (권장)
# - 장점: 캐시가 빌드 컨테이너 외부에 저장되어 추출 가능
# - 단점: 각 RUN 명령마다 마운트 필요, 스테이지 간 공유를 위해 id 필요
RUN --mount=type=cache,target=/pnpm,id=pnpm-store \
    echo "=== INSTALLER STAGE: pnpm store location and size ===" && \
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
    echo "===========================================" && \
    pnpm config set store-dir ${PNPM_HOME} && \
    echo "=== Starting pnpm fetch and install ===" && \
    pnpm fetch && \
    pnpm install --offline --frozen-lockfile --ignore-scripts 2>&1 | grep -E "(reused|Progress:|Done)" && \
    echo "=== After install ===" && \
    pnpm store path | xargs du -sh 2>/dev/null || echo "Store not found" && \
    echo "=== Store verification ===" && \
    if [ -d "$(pnpm store path)" ]; then \
      echo "Store directory exists" && \
      du -sh "$(pnpm store path)" && \
      find "$(pnpm store path)" -type f 2>/dev/null | wc -l | xargs echo "Total files in store:"; \
    fi

# ===== BUILDER STAGE =====
FROM installer AS builder
WORKDIR /app

# 캐시가 installer 스테이지에서 builder 스테이지로 제대로 전달되는지 확인
# ⚠️ 중요: 같은 캐시 ID 사용
RUN --mount=type=cache,target=/pnpm,id=pnpm-store \
    echo "=== BUILDER STAGE: Verifying cache from installer stage ===" && \
    STORE_PATH=$(pnpm store path) && \
    echo "Store path: $STORE_PATH" && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "✅ Cache exists from previous stage: YES" && \
      du -sh "$STORE_PATH" && \
      find "$STORE_PATH" -type f 2>/dev/null | wc -l | xargs echo "File count:" && \
      echo "✅ Cache successfully shared between stages!"; \
    else \
      echo "❌ Cache NOT found - cache sharing failed!"; \
    fi && \
    echo "=== BUILDER STAGE: Testing pnpm commands with cached store ===" && \
    pnpm --version && \
    pnpm store path && \
    echo "=== BUILDER STAGE: Cache verification complete ==="

# 실제 빌드가 있다면 여기서 실행
# RUN --mount=type=cache,target=/pnpm,id=pnpm-store \
#     pnpm build

# ===== CACHE EXTRACTION STAGE =====
# buildkit-cache-dance가 캐시를 추출할 수 있도록 별도 스테이지 생성
# 이 스테이지는 최종 이미지에 포함되지 않지만, 빌드 중에 실행되어 캐시를 마운트 상태로 유지
FROM builder AS cache-extraction
WORKDIR /app

# ⚠️ 핵심: buildkit-cache-dance가 추출할 수 있도록 캐시를 마운트하고 확인
# 이 RUN 명령이 실행되는 동안 /pnpm이 마운트되어 있어야 추출 가능
RUN --mount=type=cache,target=/pnpm,id=pnpm-store \
    echo "=== CACHE EXTRACTION STAGE: Preparing cache for extraction ===" && \
    STORE_PATH=$(pnpm store path) && \
    echo "Store path: $STORE_PATH" && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "✅ Cache is mounted and ready for extraction" && \
      du -sh "$STORE_PATH" && \
      find "$STORE_PATH" -type f 2>/dev/null | wc -l | xargs echo "Total files:" && \
      echo "✅ This stage ensures /pnpm is mounted when buildkit-cache-dance extracts"; \
    else \
      echo "❌ Cache NOT mounted - extraction will fail!"; \
    fi && \
    # 캐시 디렉토리 구조 확인 (buildkit-cache-dance가 찾을 수 있도록)
    echo "=== Cache directory structure ===" && \
    ls -la /pnpm 2>/dev/null || echo "/pnpm not accessible" && \
    echo "=== Cache extraction stage complete ==="

# ===== RUNNER STAGE (최종 이미지) =====
FROM base AS runner
WORKDIR /app

# 최종 스테이지에서도 캐시 접근 가능한지 확인 (선택적)
# ⚠️ 주의: runner 스테이지는 최종 이미지이므로, 여기서 캐시를 마운트하면
# buildkit-cache-dance가 추출할 수 있지만, 이미지 크기가 커질 수 있음
# 대신 cache-extraction 스테이지를 타겟으로 빌드하는 것이 좋음
RUN --mount=type=cache,target=/pnpm,id=pnpm-store \
    echo "=== RUNNER STAGE: Final cache verification (optional) ===" && \
    STORE_PATH=$(pnpm store path) && \
    echo "Store path: $STORE_PATH" && \
    if [ -d "$STORE_PATH" ] && [ "$(ls -A $STORE_PATH 2>/dev/null)" ]; then \
      echo "✅ Cache accessible in runner stage: YES" && \
      du -sh "$STORE_PATH" && \
      find "$STORE_PATH" -type f 2>/dev/null | wc -l | xargs echo "File count:"; \
    else \
      echo "⚠️ Cache NOT accessible in runner stage (this is OK if using cache-extraction stage)"; \
    fi && \
    echo "=== RUNNER STAGE: Verification complete ==="

# 최종 스테이지 설정
# ⚠️ 중요: buildkit-cache-dance가 캐시를 추출하려면 cache-extraction 스테이지를 타겟으로 빌드해야 함
# 또는 runner 스테이지에서 캐시를 마운트한 상태로 빌드해야 함
FROM runner

