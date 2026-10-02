import { getApiError } from "@/api/errors";
import { useCancelBookingMutation } from "@/features/bookings/api/useCancelBookingMutation";
import { errorClass, secondaryButtonClass } from "@/lib/styles";

export function CancelBooking({ id }: { id: number }) {
  const cancel = useCancelBookingMutation(id);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!window.confirm("Cancel this booking? This cannot be undone.")) return;
        cancel.mutate();
      }}
    >
      {cancel.isError && (
        <p className={`mb-2 ${errorClass}`} role="alert">
          {getApiError(cancel.error, "Could not cancel this booking")}
        </p>
      )}
      <button type="submit" disabled={cancel.isPending} className={secondaryButtonClass}>
        {cancel.isPending ? "Cancelling…" : "Cancel booking"}
      </button>
    </form>
  );
}
