import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { BookingList } from "@/types/api";

export function useBookingsQuery() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await axiosClient.get<BookingList>("/bookings");
      return data.bookings;
    },
  });
}
