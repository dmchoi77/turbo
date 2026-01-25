# Code Conventions

이 문서는 프로젝트의 코드 스타일 및 구조에 대한 가이드라인을 정의합니다.

## Table of Contents

- [Variable Naming](#variable-naming)
- [React Component Structure](#react-component-structure)
- [File and Directory Naming](#file-and-directory-naming)
- [Import Patterns](#import-patterns)
- [TypeScript Patterns](#typescript-patterns)

---

## Variable Naming

### 기본 규칙

| 유형            | 규칙             | 예시                                    |
| --------------- | ---------------- | --------------------------------------- |
| 변수            | camelCase        | `isModalOpen`, `userData`, `inputValue` |
| 상수            | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL`       |
| 함수            | camelCase        | `fetchUserData`, `handleSubmit`         |
| 컴포넌트        | PascalCase       | `Button`, `UserProfile`, `DataTable`    |
| 타입/인터페이스 | PascalCase       | `UserData`, `ButtonProps`               |

### 함수 이름 Prefix 규칙

| Prefix             | 용도              | 예시                                  |
| ------------------ | ----------------- | ------------------------------------- |
| `is`, `has`, `can` | Boolean 반환 함수 | `isValid`, `hasPermission`, `canEdit` |
| `get`              | 값 조회 함수      | `getUserById`, `getQueryClient`       |
| `set`              | 값 설정 함수      | `setActiveTab`, `setFormData`         |
| `handle`           | 이벤트 핸들러     | `handleClick`, `handleSubmit`         |
| `fetch`            | API 호출 함수     | `fetchPosts`, `fetchUserData`         |
| `format`           | 데이터 포맷팅     | `formatDate`, `formatCurrency`        |
| `use`              | React Hook        | `useDebounce`, `useLocalStorage`      |

### Boolean 변수

```typescript
// ✅ Good
const isLoading = true;
const hasError = false;
const canSubmit = true;
const shouldRefetch = false;

// ❌ Bad
const loading = true;
const error = false;
const submit = true;
```

---

## React Component Structure

### 파일 구조

```
packages/ui/src/
├── button/
│   └── index.tsx      # 컴포넌트 + 타입 정의
├── tabs/
│   └── index.tsx      # 복합 컴포넌트 (Compound Component)
└── modal/
    └── index.tsx
```

### 컴포넌트 파일 템플릿

```tsx
"use client"; // 클라이언트 컴포넌트일 경우에만

import { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

// 1. Props 인터페이스 정의 (interface 사용, [ComponentName]Props 명명)
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

// 2. Named Export 사용 (pages 제외)
export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      className={className}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

### Export 규칙

| 위치                | Export 방식                                       |
| ------------------- | ------------------------------------------------- |
| `packages/ui/**`    | Named Export (`export const Button`)              |
| `packages/utils/**` | Named Export (`export const formatDate`)          |
| `packages/hooks/**` | Named Export (`export function useDebounce`)      |
| `app/**/page.tsx`   | Default Export (`export default function Page`)   |
| `app/**/layout.tsx` | Default Export (`export default function Layout`) |

### Props 정의 규칙

```typescript
// ✅ Good - interface 사용, [ComponentName]Props 명명
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

// ✅ Good - HTML 속성 확장
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// ❌ Bad - type 사용
type ButtonProps = {
  children: ReactNode;
};

// ❌ Bad - I prefix 사용
interface IButtonProps {
  children: ReactNode;
}
```

### Context 패턴 (Compound Components)

```typescript
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// 내부 컴포넌트에서 context 필수 체크
export const Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");
  // ...
};
```

### "use client" 지시어

```typescript
// ✅ 클라이언트 컴포넌트가 필요한 경우:
// - useState, useEffect 등 React hooks 사용
// - 이벤트 핸들러 (onClick, onChange 등)
// - 브라우저 API 접근
// - Framer Motion 애니메이션
"use client";

// ✅ 서버 컴포넌트 (기본값, 지시어 없음):
// - 데이터 fetching (async/await)
// - 정적 콘텐츠 렌더링
```

### JSX Return Type

```typescript
// 일반 컴포넌트
export function Button({ children }: ButtonProps): JSX.Element {
  return <button>{children}</button>;
}

// 비동기 서버 컴포넌트
export default async function Page(): Promise<JSX.Element> {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

---

## File and Directory Naming

### 규칙 요약

| 대상           | 규칙                   | 예시                                   |
| -------------- | ---------------------- | -------------------------------------- |
| 디렉토리       | kebab-case             | `data-visualization/`, `ssr-example/`  |
| 컴포넌트 폴더  | kebab-case             | `button/`, `user-profile/`             |
| 컴포넌트 파일  | index.tsx              | `button/index.tsx`                     |
| 유틸리티 파일  | kebab-case             | `get-query-client.ts`                  |
| Hook 파일      | camelCase (use prefix) | `useDebounce.ts`, `useLocalStorage.ts` |
| Next.js 라우팅 | 소문자                 | `page.tsx`, `layout.tsx`               |

### 디렉토리 구조 예시

```
apps/web/app/
├── layout.tsx           # 루트 레이아웃
├── page.tsx             # 메인 페이지
├── providers.tsx        # 프로바이더
├── get-query-client.ts  # 유틸리티
└── ssr-example/         # 기능별 라우트
    ├── page.tsx
    ├── api.ts
    └── posts-list.tsx   # 로컬 컴포넌트

packages/ui/src/
├── button/
│   └── index.tsx
├── tabs/
│   └── index.tsx
└── data-visualization/
    └── index.tsx
```

---

## Import Patterns

### 모노레포 패키지 임포트

```typescript
// ✅ Good - @repo alias 사용
import { Button } from "@repo/ui/button";
import { formatDate } from "@repo/utils";
import { useDebounce } from "@repo/hooks/useDebounce";

// ❌ Bad - 상대 경로 사용
import { Button } from "../../../packages/ui/src/button";
```

### Import 순서

```typescript
// 1. React 및 외부 라이브러리
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// 2. 내부 패키지 (@repo/*)
import { Button } from "@repo/ui/button";
import { formatDate } from "@repo/utils";

// 3. 로컬 파일
import { postsQueryOptions } from "./api";
import styles from "./page.module.css";

// 4. 타입 임포트
import type { Metadata } from "next";
import type { Post } from "./api";
```

---

## TypeScript Patterns

### 타입 vs 인터페이스

```typescript
// ✅ Props, 객체 구조 - interface 사용
interface UserProps {
  name: string;
  email: string;
}

// ✅ Union, Intersection, 유틸리티 타입 - type 사용
type ButtonVariant = "primary" | "secondary" | "danger";
type RequiredUserProps = Required<UserProps>;
```

### 제네릭

```typescript
// ✅ Good
export function useDebounce<T>(value: T, delay: number): T {
  // ...
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  // ...
};
```

### Strict Mode

- `as any` 사용 금지
- `@ts-ignore` 사용 금지
- `@ts-expect-error` 사용 금지
- 명시적 타입 정의 권장

---

## Quick Reference

```typescript
// ✅ 올바른 예시
"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";

interface CardProps {
  children: ReactNode;
  title: string;
  isActive?: boolean;
}

export const Card = ({ children, title, isActive = false }: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div>
      <h2>{title}</h2>
      {isExpanded && children}
      <Button onClick={handleToggle}>
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
    </motion.div>
  );
};
```
