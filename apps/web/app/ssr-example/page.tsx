import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { JSX } from "react";
import type { Metadata } from "next";
import { getQueryClient } from "../get-query-client";
import { postsQueryOptions } from "./api";
import { PostsList } from "./posts-list";

export const metadata: Metadata = {
  title: "SSR Example - TanStack Query",
  description: "Server-side rendering with TanStack Query prefetching",
};

export default async function SSRExamplePage(): Promise<JSX.Element> {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(postsQueryOptions);

  return (
    <main className="ssr-example">
      <h1>TanStack Query SSR Example</h1>

      <section className="explanation">
        <h2>How it works</h2>
        <ul>
          <li>
            <strong>Server:</strong> Data is fetched using{" "}
            <code>prefetchQuery</code> in the Server Component
          </li>
          <li>
            <strong>Dehydration:</strong> Query state is serialized via{" "}
            <code>dehydrate(queryClient)</code>
          </li>
          <li>
            <strong>Hydration:</strong> <code>HydrationBoundary</code> passes
            the state to the client
          </li>
          <li>
            <strong>Client:</strong> <code>useQuery</code> picks up the
            prefetched data instantly
          </li>
        </ul>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsList />
      </HydrationBoundary>

      <style>{`
        .ssr-example {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }

        .ssr-example h1 {
          margin-bottom: 1.5rem;
          font-size: 2rem;
        }

        .explanation {
          background: #f5f5f5;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .explanation h2 {
          margin-top: 0;
          font-size: 1.25rem;
        }

        .explanation ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .explanation li {
          margin-bottom: 0.5rem;
        }

        .explanation code {
          background: #e0e0e0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.9em;
        }

        .posts-list h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .posts-list .info {
          color: #666;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .posts-list ul {
          list-style: none;
          padding: 0;
        }

        .post-item {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .post-item h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          text-transform: capitalize;
        }

        .post-item p {
          margin: 0;
          color: #555;
          line-height: 1.5;
        }

        .loading,
        .error {
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
        }

        .loading {
          background: #e3f2fd;
          color: #1565c0;
        }

        .error {
          background: #ffebee;
          color: #c62828;
        }
      `}</style>
    </main>
  );
}
