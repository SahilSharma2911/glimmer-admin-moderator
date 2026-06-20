import { useQueries } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { globalEventKeys } from "./useGlobalEvents";
import { tokenStore } from "@/lib/api/token";
import type { EventStatus } from "../types/global-events.types";

/** Total counts per tab (`all` + each derived status). */
export interface GlobalEventCounts {
  all: number;
  UPCOMING: number;
  LIVE: number;
  ENDED: number;
}

const STATUSES: EventStatus[] = ["LIVE", "UPCOMING", "ENDED"];

/**
 * Tab counts for the events table. Runs one lightweight query per status (and
 * one for "all"), reading just `pagination.total` — the rows themselves are
 * fetched by the table. Cached under the `list` key prefix so create/update/
 * delete invalidations refresh the badges too.
 */
export function useGlobalEventCounts(): {
  counts: GlobalEventCounts;
  isLoading: boolean;
} {
  const enabled = Boolean(tokenStore.get());

  const results = useQueries({
    queries: [
      {
        queryKey: globalEventKeys.count("ALL"),
        queryFn: () => globalEventsApi.list({ limit: 1 }),
        enabled,
      },
      ...STATUSES.map((status) => ({
        queryKey: globalEventKeys.count(status),
        queryFn: () => globalEventsApi.list({ status, limit: 1 }),
        enabled,
      })),
    ],
  });

  const [all, live, upcoming, ended] = results;

  return {
    isLoading: results.some((r) => r.isLoading),
    counts: {
      all: all?.data?.pagination.total ?? 0,
      LIVE: live?.data?.pagination.total ?? 0,
      UPCOMING: upcoming?.data?.pagination.total ?? 0,
      ENDED: ended?.data?.pagination.total ?? 0,
    },
  };
}
