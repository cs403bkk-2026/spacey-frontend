import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variant === "primary" ? primaryButtonClass : secondaryButtonClass, className)}
      {...props}
    />
  );
}
