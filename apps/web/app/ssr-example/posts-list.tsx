"use client";

import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { postsQueryOptions, type Post } from "./api";

export function PostsList(): JSX.Element {
  const { data: posts, isLoading, error } = useQuery(postsQueryOptions);

  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="posts-list">
      <h2>Posts (SSR Prefetched)</h2>
      <p className="info">
        These posts were prefetched on the server. No loading state was shown on
        initial render!
      </p>
      <ul>
        {posts?.map((post: Post) => (
          <li key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
