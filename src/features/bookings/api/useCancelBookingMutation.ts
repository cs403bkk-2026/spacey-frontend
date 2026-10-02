import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { axiosClient } from "@/api/axiosClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { Booking } from "@/types/api";

export function useCancelBookingMutation(bookingId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.delete<Booking>(`/bookings/${bookingId}`);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["spaces"] });
      await queryClient.invalidateQueries({ queryKey: ["metrics"] });
      const signedIn = useAuthStore.getState().isAuthenticated;
      void navigate(signedIn ? "/bookings" : "/");
    },
  });
}
