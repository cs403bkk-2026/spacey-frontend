import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { BookingList } from "@/types/api";

export function useSpaceBookingsQuery(spaceId: string) {
  return useQuery({
    queryKey: ["space-bookings", spaceId],
    enabled: Number.isInteger(Number(spaceId)) && Number(spaceId) > 0,
    queryFn: async () => {
      const { data } = await axiosClient.get<BookingList>(`/spaces/${spaceId}/bookings`);
      const now = Date.now();
      return data.bookings.filter((booking) => new Date(booking.end_time).getTime() > now);
    },
  });
}
