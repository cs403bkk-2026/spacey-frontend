import { Navigate } from "react-router";

import { PageMain } from "@/components/page-main";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/store/useAuthStore";

export function RegisterPage() {
  useDocumentTitle("Register");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <PageMain width="narrow">
      <h1 className="text-[28px] leading-[1.43] font-bold">Register</h1>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </PageMain>
  );
}
