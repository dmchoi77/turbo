export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json() as Promise<Post[]>;
}

export async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch post ${id}`);
  }
  return response.json() as Promise<Post>;
}

export const postsQueryOptions = {
  queryKey: ["posts"] as const,
  queryFn: fetchPosts,
};

export const postQueryOptions = (id: number) => ({
  queryKey: ["post", id] as const,
  queryFn: () => fetchPost(id),
});
