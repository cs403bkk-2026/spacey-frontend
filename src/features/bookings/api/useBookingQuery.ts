import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Booking } from "@/types/api";

export function useBookingQuery(bookingId: string) {
  return useQuery({
    queryKey: ["booking", bookingId],
    enabled: Number.isInteger(Number(bookingId)) && Number(bookingId) > 0,
    queryFn: async () => {
      const { data } = await axiosClient.get<Booking>(`/bookings/${bookingId}`);
      return data;
    },
  });
}
