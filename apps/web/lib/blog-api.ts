import { api } from "./api";
import type {
  Post,
  Category,
  Comment,
  PaginatedResponse,
  PostsQueryParams,
  CreatePostData,
  CreateCategoryData,
  CreateCommentData,
} from "./types";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const postsApi = {
  getAll: (params?: PostsQueryParams) =>
    api.get<PaginatedResponse<Post>>(
      "/api/posts",
      params as Record<string, string | number | boolean>,
    ),

  getById: (id: number) => api.get<Post>(`/api/posts/${id}`),

  getBySlug: (slug: string) => api.get<Post>(`/api/posts/slug/${slug}`),

  create: (data: CreatePostData) => api.post<Post>("/api/posts", data),

  update: (id: number, data: Partial<CreatePostData>) =>
    api.patch<Post>(`/api/posts/${id}`, data),

  delete: (id: number) => api.delete<void>(`/api/posts/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>("/api/categories"),

  getById: (id: number) => api.get<Category>(`/api/categories/${id}`),

  getBySlug: (slug: string) =>
    api.get<Category>(`/api/categories/slug/${slug}`),

  create: (data: CreateCategoryData) => {
    const payload = {
      ...data,
      slug: data.slug || generateSlug(data.name),
    };
    return api.post<Category>("/api/categories", payload);
  },

  update: (id: number, data: Partial<CreateCategoryData>) =>
    api.patch<Category>(`/api/categories/${id}`, data),

  delete: (id: number) => api.delete<void>(`/api/categories/${id}`),
};

export const commentsApi = {
  getByPostId: (postId: number) =>
    api.get<Comment[]>(`/api/posts/${postId}/comments`),

  create: (postId: number, data: CreateCommentData) =>
    api.post<Comment>(`/api/posts/${postId}/comments`, data),

  delete: (id: number) => api.delete<void>(`/api/comments/${id}`),
};
