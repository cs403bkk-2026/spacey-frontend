import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import { toBangkokIso } from "@/lib/format";
import type { SpaceList } from "@/types/api";

export function useSpacesQuery(start = "", end = "") {
  const startIso = start ? (toBangkokIso(start) ?? start) : "";
  const endIso = end ? (toBangkokIso(end) ?? end) : "";

  return useQuery({
    queryKey: ["spaces", startIso, endIso],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (startIso) params.start_time = startIso;
      if (endIso) params.end_time = endIso;
      const { data } = await axiosClient.get<SpaceList>("/spaces", {
        params: Object.keys(params).length > 0 ? params : undefined,
      });
      return data.spaces;
    },
  });
}
