import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types/api";

const STORAGE_KEY = "spacy-auth";

type AuthSnapshot = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthState = AuthSnapshot & {
  setAuth: (user: User) => void;
  logout: () => void;
};

const emptyAuth: AuthSnapshot = {
  user: null,
  isAuthenticated: false,
};

function readStoredAuth(): AuthSnapshot {
  if (typeof localStorage === "undefined") return emptyAuth;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAuth;
    const parsed = JSON.parse(raw) as { state?: Partial<AuthSnapshot> };
    const user = parsed.state?.user;
    if (!user || typeof user.id !== "number" || typeof user.email !== "string") {
      return emptyAuth;
    }
    return {
      user,
      isAuthenticated: true,
    };
  } catch {
    return emptyAuth;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...readStoredAuth(),
      setAuth: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: () => set(emptyAuth),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
