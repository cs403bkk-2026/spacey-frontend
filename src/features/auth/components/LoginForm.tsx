import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { getApiError } from "@/api/errors";
import { useLoginMutation } from "@/features/auth/api/useLoginMutation";
import { loginSchema, type LoginInput } from "@/features/auth/types/auth";
import { errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from "@/lib/styles";

export function LoginForm({ message }: { message?: string }) {
  const navigate = useNavigate();
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values, {
      onSuccess: () => {
        void navigate("/");
      },
    });
  }

  const serverError = login.isError ? getApiError(login.error, "Could not log in") : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {message && <p className="text-sm text-ink">{message}</p>}
      <label className="block">
        <span className={labelClass}>Email</span>
        <input type="email" autoComplete="email" className={inputClass} {...register("email")} />
        {errors.email && (
          <p className={`mt-1.5 ${errorClass}`} role="alert">
            {errors.email.message}
          </p>
        )}
      </label>
      <label className="block">
        <span className={labelClass}>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          className={inputClass}
          {...register("password")}
        />
        {errors.password && (
          <p className={`mt-1.5 ${errorClass}`} role="alert">
            {errors.password.message}
          </p>
        )}
      </label>
      {serverError && (
        <p className={errorClass} role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" disabled={login.isPending} className={`w-full ${primaryButtonClass}`}>
        {login.isPending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-sm">
        <Link to="/register" className={textLinkClass}>
          Register
        </Link>
      </p>
    </form>
  );
}
