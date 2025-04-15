import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: undefined,
      setToken: (token) => set({ token }),
    }),
    {
      name: "test-dfns-auth-token",
    }
  )
);
