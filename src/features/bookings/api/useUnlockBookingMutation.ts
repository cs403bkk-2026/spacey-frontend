import { useMutation } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { UnlockResult } from "@/types/api";

export function useUnlockBookingMutation(bookingId: number) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.post<UnlockResult>(`/bookings/${bookingId}/unlock`);
      return data;
    },
  });
}
