import { useMutation } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { LoginInput } from "@/features/auth/types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types/api";

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await axiosClient.post<User>("/login", input);
      return data;
    },
    onSuccess: (user) => {
      setAuth({ user, token: null });
    },
  });
}
