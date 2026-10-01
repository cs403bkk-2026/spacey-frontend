import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { isNotFound } from "@/api/errors";
import { SpaceDetailSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { SpaceWash } from "@/components/space-wash";
import { ReservationCard } from "@/features/spaces/components/ReservationCard";
import { useSpaceBookingsQuery } from "@/features/spaces/api/useSpaceBookingsQuery";
import { useSpaceQuery } from "@/features/spaces/api/useSpaceQuery";
import { useSpacesQuery } from "@/features/spaces/api/useSpacesQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatBookingSlot, formatMoney } from "@/lib/format";
import { textLinkClass } from "@/lib/styles";
import { useAuthStore } from "@/store/useAuthStore";

export function spaceLoader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return {
    spaceId: params.spaceId ?? "",
    start: url.searchParams.get("start") ?? "",
    end: url.searchParams.get("end") ?? "",
    guests: url.searchParams.get("guests") ?? "",
  };
}

export function SpacePage() {
  const { spaceId, start, end, guests } = useLoaderData<typeof spaceLoader>();
  const spaceQuery = useSpaceQuery(spaceId);
  const bookingsQuery = useSpaceBookingsQuery(spaceId);
  const catalogQuery = useSpacesQuery();
  const user = useAuthStore((state) => state.user);
  useDocumentTitle(spaceQuery.data?.name ?? "Space");

  if (spaceQuery.isPending) return <SpaceDetailSkeleton />;

  if (spaceQuery.isError && isNotFound(spaceQuery.error)) {
    return (
      <PageMain width="narrow">
        <p>
          Space not found.{" "}
          <Link to="/" className={textLinkClass}>
            Back to spaces
          </Link>
        </p>
      </PageMain>
    );
  }

  if (!spaceQuery.data) {
    return (
      <PageMain width="narrow">
        <p>This space could not be loaded.</p>
      </PageMain>
    );
  }

  const space = spaceQuery.data;
  const upcoming = bookingsQuery.data ?? [];
  const washIndex = (catalogQuery.data ?? []).findIndex((item) => item.id === space.id);
  const guestCount = Number(guests);

  return (
    <PageMain width="detail" className="pb-28 tablet:pb-16">
      <div className="grid items-start gap-10 desktop:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-card border border-hairline tablet:aspect-4/3">
            <SpaceWash index={Math.max(washIndex, 0)} className="absolute inset-0" />
          </div>
          <h1 className="mt-6 text-[22px] leading-[1.18] font-medium tracking-[-0.44px]">{space.name}</h1>
          <p className="mt-2 text-base text-body">
            Up to {space.capacity} {space.capacity === 1 ? "person" : "people"} · {formatMoney(space.price_cents)}{" "}
            / hour
          </p>
          <p className="mt-2 text-sm text-muted">{space.available ? "Free right now" : "Booked right now"}</p>
          <div className="mt-10 flex items-baseline justify-between gap-4">
            <h2 className="text-[21px] font-bold">Already booked</h2>
            {upcoming.length > 0 && <p className="text-sm text-muted">{upcoming.length} upcoming</p>}
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No bookings coming up.</p>
          ) : (
            <ul className="mt-4 max-h-96 divide-y divide-hairline-soft overflow-y-auto rounded-card border border-hairline">
              {upcoming.map((booking) => (
                <li key={booking.id} className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-ink">{formatBookingSlot(booking.start_time, booking.end_time)}</p>
                  <p className="mt-0.5 truncate text-sm text-muted" title={booking.member}>
                    {booking.member}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm text-muted">Times are Bangkok time (UTC+7).</p>
        </div>
        <div className="desktop:sticky desktop:top-24">
          <ReservationCard
            key={`${start}-${end}-${guests}`}
            space={space}
            defaultMember={user ? user.email.split("@")[0] : ""}
            defaultStart={start}
            defaultEnd={end}
            defaultGuests={Number.isInteger(guestCount) && guestCount > 0 ? guestCount : 1}
          />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-hairline bg-canvas px-6 py-3 tablet:hidden">
        <p>
          <span className="text-[21px] font-bold">{formatMoney(space.price_cents)}</span>
          <span className="text-sm text-muted"> / hour</span>
        </p>
        <a
          href="#reserve"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-6 text-base font-medium text-on-primary"
        >
          Reserve
        </a>
      </div>
    </PageMain>
  );
}
