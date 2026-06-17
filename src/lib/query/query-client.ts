import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a QueryClient with app-wide defaults.
 * A fresh instance is created per app load (see QueryProvider) to avoid
 * sharing cache across requests/users.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1 min: avoid immediate refetches
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
