import { Navigate, useSearchParams } from "react-router";

import { PageMain } from "@/components/page-main";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/store/useAuthStore";

export function LoginPage() {
  useDocumentTitle("Log in");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [params] = useSearchParams();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <PageMain width="narrow">
      <h1 className="text-[28px] leading-[1.43] font-bold">Log in</h1>
      <div className="mt-8">
        <LoginForm message={params.get("message") ?? undefined} />
      </div>
    </PageMain>
  );
}
