import { useMutation } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { RegisterInput } from "@/features/auth/types/auth";
import type { User } from "@/types/api";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await axiosClient.post<User>("/register", input);
      return data;
    },
  });
}
