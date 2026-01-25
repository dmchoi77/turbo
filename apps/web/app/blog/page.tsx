import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import { postsApi, categoriesApi } from "@/lib/blog-api";
import { BlogContent } from "./blog-content";

export default async function BlogPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["posts", { page: 1, limit: 9, published: true }],
      queryFn: () => postsApi.getAll({ page: 1, limit: 9, published: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: () => categoriesApi.getAll(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogContent />
    </HydrationBoundary>
  );
}
