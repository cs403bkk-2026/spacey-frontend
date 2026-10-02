import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

import { pathnameWithinApp } from "@/lib/app-path";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/spaces");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const { pathname } = useLocation();
  const active = isActive(pathnameWithinApp(pathname), href);

  return (
    <Link
      to={href}
      className={cn(
        "text-base font-semibold",
        active ? "text-ink underline decoration-2 underline-offset-8" : "text-muted",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
