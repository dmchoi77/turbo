export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number | null;
  category: Category | null;
  comments?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
  posts?: Post[];
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  postId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PostsQueryParams {
  page?: number;
  limit?: number;
  published?: boolean;
  categoryId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  categoryId?: number;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
}

export interface CreateCommentData {
  content: string;
  author: string;
  email?: string;
}
