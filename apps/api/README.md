# Blog API

NestJS 기반 Blog CMS API 서버입니다.

## 기술 스택

- **Framework**: NestJS 10
- **ORM**: Prisma 5
- **Database**: SQLite
- **Documentation**: Swagger/OpenAPI

## 시작하기

### 1. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env
```

### 2. 의존성 설치 및 DB 설정

```bash
# 루트에서 실행
pnpm install

# Prisma 클라이언트 생성 및 DB 마이그레이션
pnpm --filter api db:generate
pnpm --filter api db:push
```

### 3. 개발 서버 실행

```bash
# api만 실행
pnpm --filter api dev

# 또는 turbo로 전체 실행
pnpm dev
```

- API 서버: http://localhost:4000
- Swagger 문서: http://localhost:4000/docs

## API 엔드포인트

### Posts (게시글)

| Method | Endpoint                | 설명                                   |
| ------ | ----------------------- | -------------------------------------- |
| GET    | `/api/posts`            | 게시글 목록 (페이지네이션, 검색, 필터) |
| GET    | `/api/posts/:id`        | 게시글 상세 조회                       |
| GET    | `/api/posts/slug/:slug` | 슬러그로 게시글 조회                   |
| POST   | `/api/posts`            | 게시글 생성                            |
| PATCH  | `/api/posts/:id`        | 게시글 수정                            |
| DELETE | `/api/posts/:id`        | 게시글 삭제                            |

#### 쿼리 파라미터 (GET /api/posts)

| 파라미터   | 타입            | 설명                          |
| ---------- | --------------- | ----------------------------- |
| page       | number          | 페이지 번호 (기본값: 1)       |
| limit      | number          | 페이지당 항목 수 (기본값: 10) |
| published  | boolean         | 게시 상태 필터                |
| categoryId | number          | 카테고리 필터                 |
| search     | string          | 제목/내용 검색                |
| sortBy     | string          | 정렬 기준 필드                |
| sortOrder  | 'asc' \| 'desc' | 정렬 방향 (기본값: desc)      |

### Categories (카테고리)

| Method | Endpoint                     | 설명                                 |
| ------ | ---------------------------- | ------------------------------------ |
| GET    | `/api/categories`            | 카테고리 목록 (게시글 수 포함)       |
| GET    | `/api/categories/:id`        | 카테고리 상세 조회                   |
| GET    | `/api/categories/slug/:slug` | 슬러그로 카테고리 조회 (게시글 포함) |
| POST   | `/api/categories`            | 카테고리 생성                        |
| PATCH  | `/api/categories/:id`        | 카테고리 수정                        |
| DELETE | `/api/categories/:id`        | 카테고리 삭제                        |

### Comments (댓글)

| Method | Endpoint                      | 설명               |
| ------ | ----------------------------- | ------------------ |
| GET    | `/api/posts/:postId/comments` | 게시글의 댓글 목록 |
| POST   | `/api/posts/:postId/comments` | 댓글 작성          |
| GET    | `/api/comments/:id`           | 댓글 상세 조회     |
| DELETE | `/api/comments/:id`           | 댓글 삭제          |

## 스크립트

```bash
pnpm dev          # 개발 서버 (watch 모드)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # ESLint 검사
pnpm test         # 테스트 실행

# Prisma
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # 스키마를 DB에 적용
pnpm db:migrate   # 마이그레이션 생성 및 적용
pnpm db:studio    # Prisma Studio 실행 (DB GUI)
```

## 프로젝트 구조

```
apps/api/
├── prisma/
│   └── schema.prisma       # DB 스키마 정의
├── src/
│   ├── common/             # 공통 DTO (페이지네이션 등)
│   ├── modules/
│   │   ├── posts/          # 게시글 모듈
│   │   │   ├── dto/        # CreatePostDto, UpdatePostDto, QueryPostsDto
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   └── posts.module.ts
│   │   ├── categories/     # 카테고리 모듈
│   │   └── comments/       # 댓글 모듈
│   ├── prisma/             # Prisma 서비스
│   ├── app.module.ts       # 루트 모듈
│   └── main.ts             # 앱 엔트리포인트
├── .env                    # 환경변수 (gitignore)
├── .env.example            # 환경변수 예시
├── nest-cli.json           # NestJS CLI 설정
├── package.json
└── tsconfig.json
```

## 데이터 모델

```prisma
model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  categoryId  Int?
  category    Category? @relation(...)
  comments    Comment[]
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  slug        String   @unique
  description String?
  posts       Post[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  author    String
  email     String?
  postId    Int
  post      Post     @relation(...)
}
```

## API 사용 예시

### 게시글 생성

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "첫 번째 글",
    "slug": "first-post",
    "content": "Hello World!",
    "published": true
  }'
```

### 게시글 목록 조회 (페이지네이션)

```bash
curl "http://localhost:4000/api/posts?page=1&limit=10&published=true"
```

### 카테고리 생성

```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Technology",
    "slug": "technology",
    "description": "기술 관련 글"
  }'
```

### 댓글 작성

```bash
curl -X POST http://localhost:4000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "좋은 글이네요!",
    "author": "홍길동",
    "email": "hong@example.com"
  }'
```

## 프론트엔드 연동

CORS가 `localhost:3000`, `localhost:3001`에 대해 활성화되어 있습니다.

```typescript
// React Query 예시
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async (page = 1) => {
  const res = await fetch(`http://localhost:4000/api/posts?page=${page}`);
  return res.json();
};

function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => fetchPosts(1),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data.data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```
