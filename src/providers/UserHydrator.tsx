"use client";

import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import { useUserStore } from "@/store/user.store";

/**
 * Bridges the `/me` query into the global user store (one-way).
 * Renders nothing; mount once near the app root, inside QueryProvider.
 */
export function UserHydrator() {
  const { data } = useMe();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  return null;
}
