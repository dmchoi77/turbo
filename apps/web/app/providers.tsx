"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX, ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
