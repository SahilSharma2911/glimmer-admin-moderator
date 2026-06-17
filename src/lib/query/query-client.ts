import { QueryClient } from "@tanstack/react-query";

/** Creates a QueryClient with app-wide defaults. */
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

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the QueryClient. On the server a fresh client is made per request;
 * in the browser a single shared instance is reused so non-React code (e.g.
 * the axios interceptor) can clear the same cache the provider uses.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
