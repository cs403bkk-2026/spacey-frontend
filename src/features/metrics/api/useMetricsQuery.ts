import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { Health, Metrics } from "@/types/api";

export function useMetricsQuery() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const { data } = await axiosClient.get<Metrics>("/metrics");
      return data;
    },
  });
}

export function useHealthQuery() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await axiosClient.get<Health>("/health");
      return data;
    },
  });
}
