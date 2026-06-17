import { create } from "zustand";
import type { AdminProfile } from "@/features/auth/types/auth.types";

/**
 * Global current-user state. Holds the authenticated admin profile so any
 * feature can read it (e.g. the user's name) without its own query.
 *
 * Source of truth is the `/me` query (TanStack Query); this store is
 * hydrated from it one-way by UserHydrator. Do not fetch here.
 */
interface UserState {
  user: AdminProfile | null;
  setUser: (user: AdminProfile | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
