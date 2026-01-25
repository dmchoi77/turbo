# AGENTS.md

AI 에이전트를 위한 프로젝트 컨텍스트 문서입니다.

---

## Project Overview

**Turborepo 기반 모노레포** - Blog CMS 플랫폼

| 항목            | 내용             |
| --------------- | ---------------- |
| Package Manager | pnpm 9.6.0       |
| Node Version    | >= 18            |
| Build System    | Turborepo 2.3+   |
| Language        | TypeScript 5.5.4 |
| Test Framework  | Vitest 2.1+      |

---

## Repository Structure

```
turbo/
├── apps/
│   ├── api/          # NestJS 10 + Prisma (Blog CMS API)
│   ├── web/          # Next.js 15 + React 19 (Main web app)
│   ├── docs/         # Next.js (Documentation site)
│   ├── my-app/       # Vite + React (Module Federation Host)
│   └── remote-app/   # Vite + React (Module Federation Remote)
├── packages/
│   ├── ui/           # @repo/ui - React component library
│   ├── hooks/        # @repo/hooks - Custom React hooks
│   ├── utils/        # @repo/utils - Utility functions
│   ├── core/         # @repo/core - Core business logic
│   ├── legacy/       # @repo/legacy - Legacy code (deprecated)
│   ├── eslint-config/    # @repo/eslint-config - Shared ESLint config
│   └── typescript-config/ # @repo/typescript-config - Shared tsconfig
├── docs/
│   └── STYLE_GUIDE.md    # Commit, branch, PR conventions
├── CONVENTION.md         # Code style conventions
└── turbo.json            # Turborepo task definitions
```

---

## Apps

### `apps/api` - Blog CMS API

| 항목      | 내용                                 |
| --------- | ------------------------------------ |
| Framework | NestJS 10                            |
| ORM       | Prisma 5 + SQLite                    |
| Port      | 4000                                 |
| API Docs  | http://localhost:4000/docs (Swagger) |

**주요 모듈:**

- `posts/` - 게시글 CRUD (페이지네이션, 검색, 필터)
- `categories/` - 카테고리 관리
- `comments/` - 댓글 시스템

**Prisma 명령어:**

```bash
pnpm --filter api db:generate  # Prisma Client 생성
pnpm --filter api db:push      # 스키마 DB 적용
pnpm --filter api db:studio    # Prisma Studio GUI
```

### `apps/web` - Main Web Application

| 항목      | 내용                               |
| --------- | ---------------------------------- |
| Framework | Next.js 15 (App Router, Turbopack) |
| React     | 19.x                               |
| State     | TanStack Query 5                   |
| Animation | Framer Motion 11                   |
| Port      | 3000                               |

### `apps/my-app` & `apps/remote-app` - Module Federation

Vite + React 기반 마이크로 프론트엔드 (Jotai 상태 관리)

---

## Packages

### `@repo/ui` - Component Library

**Import Pattern:**

```typescript
import { Button } from "@repo/ui/button";
import { Tabs, Tab } from "@repo/ui/tabs";
```

**Available Components:**
`alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `code`,
`data-visualization`, `divider`, `input`, `modal`, `pagination`,
`progress`, `radio`, `select`, `spinner`, `switch`, `table`,
`tabs`, `textarea`

**Build:** Rollup → `dist/` (ESM only)

### `@repo/hooks` - Custom Hooks

```typescript
import { useDebounce } from "@repo/hooks/useDebounce";
import { useLocalStorage } from "@repo/hooks/useLocalStorage";
```

**Available Hooks:**
`useAsync`, `useClickOutside`, `useDebounce`, `useLocalStorage`,
`useMediaQuery`, `useMount`, `usePrevious`, `useSessionStorage`,
`useThrottle`, `useToggle`, `useUnmount`

### `@repo/utils` - Utilities

```typescript
import { formatDate, chunk } from "@repo/utils";
```

---

## Commands

```bash
# Development
pnpm dev                    # 전체 dev 서버
pnpm --filter web dev       # web만 실행
pnpm --filter api dev       # api만 실행

# Build
pnpm build                  # 전체 빌드

# Quality
pnpm lint                   # 전체 린트
pnpm test                   # 전체 테스트
pnpm format                 # Prettier 포맷팅

# Type Check
pnpm --filter web check-types
pnpm --filter api check-types
```

---

## Code Conventions

> 상세 규칙: [CONVENTION.md](./CONVENTION.md)

### Naming

| 유형            | 규칙             | 예시                            |
| --------------- | ---------------- | ------------------------------- |
| 변수            | camelCase        | `isModalOpen`, `userData`       |
| 상수            | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`               |
| 함수            | camelCase        | `fetchUserData`, `handleSubmit` |
| 컴포넌트        | PascalCase       | `Button`, `UserProfile`         |
| 타입/인터페이스 | PascalCase       | `UserData`, `ButtonProps`       |
| 디렉토리        | kebab-case       | `data-visualization/`           |
| Hook 파일       | camelCase        | `useDebounce.ts`                |

### Function Prefixes

| Prefix             | 용도          |
| ------------------ | ------------- |
| `is`, `has`, `can` | Boolean 반환  |
| `get`              | 값 조회       |
| `set`              | 값 설정       |
| `handle`           | 이벤트 핸들러 |
| `fetch`            | API 호출      |
| `use`              | React Hook    |

### Component Structure

```tsx
"use client"; // 클라이언트 컴포넌트만

import { ReactNode } from "react";
import { Button } from "@repo/ui/button";

// interface 사용, [Name]Props 명명
interface CardProps {
  children: ReactNode;
  title: string;
  isActive?: boolean;
}

// Named export (pages 제외)
export const Card = ({ children, title, isActive = false }: CardProps) => {
  return <div>{children}</div>;
};
```

### Export Rules

| 위치                | Export 방식    |
| ------------------- | -------------- |
| `packages/**`       | Named Export   |
| `app/**/page.tsx`   | Default Export |
| `app/**/layout.tsx` | Default Export |

### FORBIDDEN

- `as any`
- `@ts-ignore`
- `@ts-expect-error`
- `type` alias for Props (use `interface`)
- `I` prefix for interfaces

---

## Git Conventions

> 상세 규칙: [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md)

### Commit Format

```
<type>[scope]: <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes:** `web`, `api`, `docs`, `ui`, `utils`, `hooks`, `core`, `config`

**Examples:**

```bash
feat(ui): add Tooltip component with animation
fix(web): resolve hydration mismatch in SSR
refactor(api): simplify authentication logic
```

### Branch Naming

```
<type>/<short-description>

# Examples
feat/user-authentication
fix/login-redirect
docs/api-documentation
```

---

## Import Order

```typescript
// 1. React & external libraries
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 2. Internal packages (@repo/*)
import { Button } from "@repo/ui/button";
import { formatDate } from "@repo/utils";

// 3. Local files
import { postsQueryOptions } from "./api";

// 4. Type imports
import type { Metadata } from "next";
```

---

## Testing

```bash
pnpm test              # Run all tests
pnpm --filter api test # Run api tests only
```

테스트 파일: `**/*.test.ts`, `**/*.spec.ts`

---

## Key Files

| 파일                            | 용도                  |
| ------------------------------- | --------------------- |
| `turbo.json`                    | Turborepo task 정의   |
| `pnpm-workspace.yaml`           | Workspace 패키지 정의 |
| `CONVENTION.md`                 | 코드 스타일 가이드    |
| `docs/STYLE_GUIDE.md`           | Git/PR 컨벤션         |
| `apps/api/prisma/schema.prisma` | DB 스키마             |

---

## Quick Reference

### 새 UI 컴포넌트 추가

```bash
pnpm --filter @repo/ui generate:component
```

### 특정 앱만 빌드

```bash
pnpm --filter web build
pnpm --filter api build
```

### Prisma DB 작업

```bash
pnpm --filter api db:generate
pnpm --filter api db:push
pnpm --filter api db:migrate
```
