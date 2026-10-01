import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/api/axiosClient";
import type { CreateSpaceInput, Space, UpdateSpaceInput } from "@/types/api";

function useRefreshSpaces() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["spaces"] });
    void queryClient.invalidateQueries({ queryKey: ["metrics"] });
  };
}

export function useCreateSpaceMutation() {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async (input: CreateSpaceInput) => {
      const { data } = await axiosClient.post<Space>("/spaces", input);
      return data;
    },
    onSuccess: refresh,
  });
}

export function useUpdateSpaceMutation(spaceId: number) {
  const refresh = useRefreshSpaces();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateSpaceInput) => {
      const { data } = await axiosClient.patch<Space>(`/spaces/${spaceId}`, input);
      return data;
    },
    onSuccess: (space) => {
      queryClient.setQueryData(["space", String(space.id)], space);
      refresh();
    },
  });
}

export function useDeleteSpaceMutation(spaceId: number) {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/spaces/${spaceId}`);
    },
    onSuccess: refresh,
  });
}
