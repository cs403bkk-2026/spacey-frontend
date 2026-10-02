import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { isNotFound } from "@/api/errors";
import { BookingDetailSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { BookingPanel } from "@/features/bookings/components/BookingPanel";
import { useBookingQuery } from "@/features/bookings/api/useBookingQuery";
import { useSpacesQuery } from "@/features/spaces/api/useSpacesQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { textLinkClass } from "@/lib/styles";

export function bookingLoader({ params }: LoaderFunctionArgs) {
  return { bookingId: params.bookingId ?? "" };
}

export function BookingPage() {
  const { bookingId } = useLoaderData<typeof bookingLoader>();
  const bookingQuery = useBookingQuery(bookingId);
  const spacesQuery = useSpacesQuery();
  useDocumentTitle(`Booking #${bookingId}`);

  if (bookingQuery.isPending) return <BookingDetailSkeleton />;

  if (bookingQuery.isError && isNotFound(bookingQuery.error)) {
    return (
      <PageMain width="narrow">
        <p>
          Booking not found.{" "}
          <Link to="/" className={textLinkClass}>
            Back to spaces
          </Link>
        </p>
      </PageMain>
    );
  }

  if (!bookingQuery.data) {
    return (
      <PageMain width="narrow">
        <p>This booking could not be loaded.</p>
      </PageMain>
    );
  }

  const booking = bookingQuery.data;
  const spaceName =
    (spacesQuery.data ?? []).find((space) => space.id === booking.space_id)?.name ?? "Space";

  return (
    <PageMain width="narrow">
      <BookingPanel key={`${booking.paid}-${booking.card_last4 ?? ""}`} booking={booking} spaceName={spaceName} />
      <p className="mt-6">
        <Link to="/" className={textLinkClass}>
          Back to spaces
        </Link>
      </p>
    </PageMain>
  );
}
