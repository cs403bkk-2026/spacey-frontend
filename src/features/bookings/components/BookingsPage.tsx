import { Link } from "react-router";

import { BookingsSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { useBookingsQuery } from "@/features/bookings/api/useBookingsQuery";
import { useSpacesQuery } from "@/features/spaces/api/useSpacesQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatMoney, formatRange } from "@/lib/format";
import { textLinkClass } from "@/lib/styles";
import { useAuthStore } from "@/store/useAuthStore";

export function BookingsPage() {
  useDocumentTitle("Bookings");
  const user = useAuthStore((state) => state.user);
  const bookingsQuery = useBookingsQuery();
  const spacesQuery = useSpacesQuery();
  const names = new Map((spacesQuery.data ?? []).map((space) => [space.id, space.name]));
  const mine = (bookingsQuery.data ?? []).filter((booking) => booking.user_id === user?.id);

  if (bookingsQuery.isPending || spacesQuery.isPending) return <BookingsSkeleton />;

  return (
    <PageMain>
      <h1 className="text-[28px] leading-[1.43] font-bold">My bookings</h1>
      <p className="mt-2 text-sm text-muted">Bookings made while you were logged in.</p>
      {bookingsQuery.isError && <p className="mt-6 text-sm text-error">Bookings are unavailable.</p>}
      {mine.length === 0 ? (
        <p className="mt-10 text-base text-muted">No bookings yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-hairline">
          {mine.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col gap-2 py-5 tablet:flex-row tablet:items-center tablet:justify-between"
            >
              <div>
                <p className="text-base font-semibold">{names.get(booking.space_id) ?? "Space"}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatRange(booking.start_time, booking.end_time)} · Bangkok time
                </p>
                <p className="mt-1 text-sm">
                  {formatMoney(booking.amount_cents)} · {booking.paid ? "Paid" : "Not paid"}
                </p>
              </div>
              <Link to={`/bookings/${booking.id}`} className={textLinkClass}>
                {booking.paid ? "Get unlock code" : "Pay"}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-10">
        <Link to="/" className={textLinkClass}>
          Back to spaces
        </Link>
      </p>
    </PageMain>
  );
}
