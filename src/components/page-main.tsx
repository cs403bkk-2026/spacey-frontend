import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageMain({
  children,
  width = "wide",
  className = "",
}: {
  children: ReactNode;
  width?: "wide" | "detail" | "narrow";
  className?: string;
}) {
  const max =
    width === "narrow" ? "max-w-md" : width === "detail" ? "max-w-[1080px]" : "max-w-[1280px]";

  return <main className={cn("mx-auto w-full flex-1 px-6 py-16 desktop:px-10", max, className)}>{children}</main>;
}
