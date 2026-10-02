import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Booking, CreateBookingInput } from "@/types/api";

export function useCreateBookingMutation(spaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const { data } = await axiosClient.post<Booking>(`/spaces/${spaceId}/bookings`, input);
      return data;
    },
    onSuccess: (booking) => {
      queryClient.setQueryData(["booking", String(booking.id)], booking);
      void queryClient.invalidateQueries({ queryKey: ["spaces"] });
      void queryClient.invalidateQueries({ queryKey: ["space", String(spaceId)] });
      void queryClient.invalidateQueries({ queryKey: ["space-bookings", String(spaceId)] });
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
