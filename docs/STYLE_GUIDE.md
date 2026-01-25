# Style Guide

이 문서는 프로젝트의 코드 스타일, 커밋 규칙, 그리고 개발 워크플로우에 대한 가이드라인을 정의합니다.

## Table of Contents

- [Commit Message Convention](#commit-message-convention)
- [Code Formatting](#code-formatting)
- [Linting](#linting)
- [Branch Naming](#branch-naming)
- [Pull Request Guidelines](#pull-request-guidelines)

---

## Commit Message Convention

이 프로젝트는 **[Conventional Commits](https://www.conventionalcommits.org/)** 스펙을 따릅니다.

### 기본 형식

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type       | 설명                           | 예시                                |
| ---------- | ------------------------------ | ----------------------------------- |
| `feat`     | 새로운 기능 추가               | `feat: add user authentication`     |
| `fix`      | 버그 수정                      | `fix: resolve login redirect issue` |
| `docs`     | 문서 변경                      | `docs: update API documentation`    |
| `style`    | 코드 포맷팅 (기능 변경 없음)   | `style: fix indentation in utils`   |
| `refactor` | 리팩토링 (기능/버그 수정 없음) | `refactor: simplify auth logic`     |
| `perf`     | 성능 개선                      | `perf: optimize image loading`      |
| `test`     | 테스트 추가/수정               | `test: add unit tests for Button`   |
| `build`    | 빌드 시스템/의존성 변경        | `build: update vite to v5`          |
| `ci`       | CI 설정 변경                   | `ci: add GitHub Actions workflow`   |
| `chore`    | 기타 변경                      | `chore: update gitignore`           |
| `revert`   | 이전 커밋 되돌리기             | `revert: revert feat: add auth`     |

### Scope (선택)

모노레포 구조에 맞는 scope를 사용합니다:

```
feat(web): add SSR with TanStack Query
fix(ui): resolve button hover animation
docs(hooks): add useDebounce documentation
refactor(utils): simplify date formatting functions
```

**유효한 Scopes:**

- `web` - apps/web
- `docs` - apps/docs
- `ui` - packages/ui
- `utils` - packages/utils
- `hooks` - packages/hooks
- `core` - packages/core
- `config` - 설정 파일들 (eslint, typescript, turbo)

### Description 규칙

- 명령형 현재 시제 사용 ("add" not "added" or "adds")
- 첫 글자 소문자
- 끝에 마침표 없음
- 50자 이내 권장

```bash
# ✅ Good
feat(ui): add loading state to Button component
fix(web): resolve hydration mismatch in SSR

# ❌ Bad
feat(ui): Added loading state to Button component.  # 과거형, 마침표
Fix: Resolved hydration mismatch                     # 대문자, type 형식 틀림
updated button                                       # type 없음
```

### Body (선택)

- description과 빈 줄로 구분
- 변경 이유 설명
- 이전 동작과 비교 가능

```
feat(web): add SSR with TanStack Query

Implement server-side rendering for the posts page using
TanStack Query's prefetchQuery and HydrationBoundary.

This eliminates the loading state on initial page load and
improves SEO by pre-rendering content on the server.
```

### Breaking Changes

BREAKING CHANGE가 있는 경우:

```
feat(api)!: change response format for user endpoint

BREAKING CHANGE: User endpoint now returns nested profile object.
Migration required for all API consumers.
```

### Footer (선택)

- Issue 참조: `Closes #123`, `Fixes #456`
- 관련 이슈: `Refs #789`

```
fix(web): resolve infinite loop in useEffect

Closes #142
```

### 전체 예시

```
feat(ui): add Tooltip component with animation

Implement a fully accessible Tooltip component with:
- Framer Motion enter/exit animations
- Keyboard navigation support
- Multiple placement options

The component follows the same patterns as existing UI components
with interface-based props and named exports.

Closes #87
```

---

## Code Formatting

### Prettier

프로젝트는 Prettier를 사용합니다. 루트에서 포맷팅:

```bash
pnpm format
```

### 기본 설정

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### Editor 설정

VSCode 사용자는 저장 시 자동 포맷팅을 설정하세요:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## Linting

### ESLint

각 앱/패키지는 공유 ESLint 설정을 확장합니다:

```javascript
// apps/web/eslint.config.js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```

### Lint 실행

```bash
# 전체 프로젝트
pnpm lint

# 특정 앱
pnpm --filter web lint
```

### 주요 규칙

- `@typescript-eslint/no-unused-vars`: warning
- `@typescript-eslint/no-explicit-any`: error
- `react-hooks/exhaustive-deps`: warning
- `import/order`: error (자동 정렬)

---

## Branch Naming

### 형식

```
<type>/<short-description>
```

### 예시

```bash
# 기능
feat/user-authentication
feat/ssr-tanstack-query

# 버그 수정
fix/login-redirect
fix/hydration-mismatch

# 개선
refactor/auth-logic
perf/image-optimization

# 문서
docs/api-documentation

# 기타
chore/update-dependencies
```

### 규칙

- 소문자만 사용
- 단어 구분: 하이픈(-)
- 이슈 번호 포함 가능: `feat/123-user-auth`

---

## Pull Request Guidelines

### PR 제목

Conventional Commits 형식을 따릅니다:

```
feat(web): add SSR with TanStack Query
```

### PR Template

```markdown
## Summary

<!-- 변경 사항 요약 (1-3 bullet points) -->

## Changes

<!-- 상세 변경 내용 -->

## Testing

<!-- 테스트 방법 -->

## Checklist

- [ ] 타입 체크 통과 (`pnpm check-types`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 테스트 통과 (`pnpm test`)

## Related Issues

<!-- Closes #123 -->
```

### Merge 전 체크리스트

1. ✅ CI 통과
2. ✅ 코드 리뷰 승인
3. ✅ 충돌 해결
4. ✅ 최신 main과 rebase

---

## Quick Commands

```bash
# 개발 서버
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format

# 타입 체크
pnpm --filter web check-types

# 테스트
pnpm test
```
