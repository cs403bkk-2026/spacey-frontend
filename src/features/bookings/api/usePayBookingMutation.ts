import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Booking, PayBookingInput } from "@/types/api";

export function usePayBookingMutation(bookingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PayBookingInput) => {
      const { data } = await axiosClient.post<Booking>(`/bookings/${bookingId}/pay`, input);
      return data;
    },
    onSuccess: (booking) => {
      queryClient.setQueryData(["booking", String(booking.id)], booking);
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
