import { Link } from "react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { textLinkClass } from "@/lib/styles";

export function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-[28px] leading-[1.43] font-bold">Page not found</h1>
      <p className="mt-4 text-sm">
        <Link to="/" className={textLinkClass}>
          Back to spaces
        </Link>
      </p>
    </main>
  );
}
