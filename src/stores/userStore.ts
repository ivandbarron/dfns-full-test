import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RegisterEndUserResponse } from "@dfns/sdk/generated/auth";

type TUserStore = {
  user: RegisterEndUserResponse | undefined;
  setUser: (user: RegisterEndUserResponse | undefined) => void;
};

export const useUserStore = create(
  persist<TUserStore>(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
    }),
    {
      name: "test-dfns-user",
    }
  )
);
