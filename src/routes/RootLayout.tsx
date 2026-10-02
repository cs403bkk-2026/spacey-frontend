import { useEffect } from "react";
import { isRouteErrorResponse, Outlet, useLocation, useRouteError } from "react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { primaryButtonClass } from "@/lib/styles";

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}

export function RootErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText || "This page could not be loaded."
    : "This page could not be loaded. Try again.";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-[28px] leading-[1.43] font-bold">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted">{message}</p>
      <button type="button" onClick={() => window.location.reload()} className={`mt-6 ${primaryButtonClass}`}>
        Try again
      </button>
    </main>
  );
}
