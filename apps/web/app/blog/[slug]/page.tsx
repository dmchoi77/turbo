import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../get-query-client";
import { postsApi } from "@/lib/blog-api";
import { PostContent } from "./post-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostContent slug={slug} />
    </HydrationBoundary>
  );
}
