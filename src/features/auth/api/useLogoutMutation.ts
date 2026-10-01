import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { axiosClient } from "@/api/axiosClient";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogoutMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      try {
        await axiosClient.post("/logout");
      } catch {
        // Logout clears the session cookie and then redirects. The browser
        // can surface that redirect as a failed request after the cookie is gone.
      }
    },
    onSettled: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
      void navigate("/");
    },
  });
}
