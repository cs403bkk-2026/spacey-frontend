import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { getApiError } from "@/api/errors";
import { useRegisterMutation } from "@/features/auth/api/useRegisterMutation";
import { registerSchema, type RegisterInput } from "@/features/auth/types/auth";
import { errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from "@/lib/styles";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerAccount = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: RegisterInput) {
    registerAccount.mutate(values, {
      onSuccess: () => {
        void navigate("/login?message=Registered. Please log in.");
      },
    });
  }

  const serverError = registerAccount.isError
    ? getApiError(registerAccount.error, "Could not create the account")
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
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
      <button type="submit" disabled={registerAccount.isPending} className={`w-full ${primaryButtonClass}`}>
        {registerAccount.isPending ? "Creating account…" : "Register"}
      </button>
      <p className="text-sm">
        <Link to="/login" className={textLinkClass}>
          Log in
        </Link>
      </p>
    </form>
  );
}
