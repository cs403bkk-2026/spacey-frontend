import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Space } from "@/types/api";

export function useSpaceQuery(spaceId: string) {
  return useQuery({
    queryKey: ["space", spaceId],
    enabled: Number.isInteger(Number(spaceId)) && Number(spaceId) > 0,
    queryFn: async () => {
      const { data } = await axiosClient.get<Space>(`/spaces/${spaceId}`);
      return data;
    },
  });
}
