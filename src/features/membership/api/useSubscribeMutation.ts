import { useMutation } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Subscription } from "@/types/api";

export function useSubscribeMutation() {
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axiosClient.post<Subscription>(
        `/members/${encodeURIComponent(name)}/subscribe`,
      );
      return data;
    },
  });
}
