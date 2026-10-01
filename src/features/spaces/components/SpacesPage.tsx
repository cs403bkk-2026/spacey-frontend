import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { getApiError } from "@/api/errors";
import { SpacesSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { SearchBar } from "@/components/search-bar";
import { SpaceCard } from "@/components/space-card";
import { useSpacesQuery } from "@/features/spaces/api/useSpacesQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { errorClass, textLinkClass } from "@/lib/styles";

export function spacesLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return {
    q: url.searchParams.get("q") ?? "",
    start: url.searchParams.get("start") ?? "",
    end: url.searchParams.get("end") ?? "",
    guests: url.searchParams.get("guests") ?? "",
  };
}

export function SpacesPage() {
  useDocumentTitle("Spaces");
  const search = useLoaderData<typeof spacesLoader>();
  const spacesQuery = useSpacesQuery(search.start, search.end);
  const guestCount = Number(search.guests);
  const spaces = (spacesQuery.data ?? []).filter((space) => {
    const nameOk = !search.q || space.name.toLowerCase().includes(search.q.trim().toLowerCase());
    const guestOk = !search.guests || (Number.isInteger(guestCount) && space.capacity >= guestCount);
    return nameOk && guestOk;
  });
  const filtered = Boolean(search.q || search.start || search.end || search.guests);

  if (spacesQuery.isPending) return <SpacesSkeleton />;

  return (
    <PageMain>
      <h1 className="max-w-xl text-[28px] leading-[1.43] font-bold">Spaces for the hour you need</h1>
      <p className="mt-2 max-w-xl text-base text-body">
        Book a desk or a room. Pay once, or subscribe and walk straight in.
      </p>
      <div className="mt-8">
        <SearchBar q={search.q} start={search.start} end={search.end} guests={search.guests} />
      </div>
      <p className="mt-4 text-sm text-muted">Times are Bangkok time (UTC+7).</p>
      {spacesQuery.isError && (
        <p className={`mt-6 ${errorClass}`} role="alert">
          {getApiError(spacesQuery.error, "Spaces are unavailable.")}
        </p>
      )}
      {spacesQuery.isSuccess && spaces.length === 0 && (
        <p className="mt-16 text-base text-muted">No spaces match that search.</p>
      )}
      {spaces.length > 0 && (
        <ul className="mt-16 grid grid-cols-1 gap-x-4 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-4">
          {spaces.map((space) => {
            const query = new URLSearchParams();
            if (search.start) query.set("start", search.start);
            if (search.end) query.set("end", search.end);
            if (search.guests) query.set("guests", search.guests);
            const suffix = query.toString();
            const washIndex = (spacesQuery.data ?? []).findIndex((item) => item.id === space.id);
            return (
              <li key={space.id}>
                <SpaceCard
                  space={space}
                  href={suffix ? `/spaces/${space.id}?${suffix}` : `/spaces/${space.id}`}
                  booked={!space.available}
                  index={washIndex}
                />
              </li>
            );
          })}
        </ul>
      )}
      {filtered && (
        <p className="mt-10">
          <Link to="/" className={textLinkClass}>
            Clear search
          </Link>
        </p>
      )}
    </PageMain>
  );
}
