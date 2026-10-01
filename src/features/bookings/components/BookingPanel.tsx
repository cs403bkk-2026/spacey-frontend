import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getApiError } from "@/api/errors";
import { CancelBooking } from "@/features/bookings/components/CancelBooking";
import { usePayBookingMutation } from "@/features/bookings/api/usePayBookingMutation";
import { useUnlockBookingMutation } from "@/features/bookings/api/useUnlockBookingMutation";
import { formatMoney, formatRange } from "@/lib/format";
import { errorClass, inputClass, labelClass, primaryButtonClass } from "@/lib/styles";
import type { Booking } from "@/types/api";

const paySchema = z.object({
  card_number: z.string().regex(/^\d{13,19}$/, "card_number must be 13-19 digits"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "expiry must be in MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "cvc must be 3 or 4 digits"),
});

type PayValues = z.infer<typeof paySchema>;

export function BookingPanel({ booking, spaceName }: { booking: Booking; spaceName: string }) {
  const pay = usePayBookingMutation(booking.id);
  const unlock = useUnlockBookingMutation(booking.id);
  const form = useForm<PayValues>({
    resolver: zodResolver(paySchema),
    defaultValues: { card_number: "", expiry: "", cvc: "" },
  });

  const payError = pay.isError ? getApiError(pay.error, "Payment failed") : null;
  const unlockError = unlock.isError ? getApiError(unlock.error, "Could not unlock") : null;

  return (
    <section className="rounded-card border border-hairline bg-canvas p-6 shadow-card">
      <h1 className="text-[28px] leading-[1.43] font-bold">Booking #{booking.id}</h1>
      <p className="mt-2 text-base text-body">
        {spaceName} for {booking.member}
      </p>
      <p className="mt-1 text-sm text-muted">
        {formatRange(booking.start_time, booking.end_time)} · Bangkok time
      </p>
      <p className="mt-4 text-base">
        {booking.paid ? "Paid" : "Not paid yet"}. Total {formatMoney(booking.amount_cents)}
        {booking.card_last4 ? ` · card ending ${booking.card_last4}` : ""}
        {booking.paid && booking.amount_cents === 0 ? " · included with membership" : ""}
      </p>

      {booking.paid ? (
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            unlock.mutate();
          }}
        >
          {unlockError && (
            <p className={`mb-3 ${errorClass}`} role="alert">
              {unlockError}
            </p>
          )}
          {unlock.data?.access_code && (
            <p className="mb-4 text-base">
              Your access code:{" "}
              <strong className="font-semibold tracking-wide">{unlock.data.access_code}</strong>
            </p>
          )}
          <button type="submit" disabled={unlock.isPending} className={primaryButtonClass}>
            {unlock.isPending ? "Unlocking…" : "Unlock"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={form.handleSubmit((values) => pay.mutate(values))}
          className="mt-6 space-y-4"
          noValidate
        >
          <p className="text-sm text-muted">
            Pay to get your access code. Card details are checked for shape only.
          </p>
          <label className="block">
            <span className={labelClass}>Card number</span>
            <input
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242424242424242"
              className={inputClass}
              {...form.register("card_number")}
            />
            {form.formState.errors.card_number && (
              <p className={`mt-1.5 ${errorClass}`} role="alert">
                {form.formState.errors.card_number.message}
              </p>
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Expiry</span>
              <input
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className={inputClass}
                {...form.register("expiry")}
              />
              {form.formState.errors.expiry && (
                <p className={`mt-1.5 ${errorClass}`} role="alert">
                  {form.formState.errors.expiry.message}
                </p>
              )}
            </label>
            <label className="block">
              <span className={labelClass}>CVC</span>
              <input
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                className={inputClass}
                {...form.register("cvc")}
              />
              {form.formState.errors.cvc && (
                <p className={`mt-1.5 ${errorClass}`} role="alert">
                  {form.formState.errors.cvc.message}
                </p>
              )}
            </label>
          </div>
          {payError && (
            <p className={errorClass} role="alert">
              {payError}
            </p>
          )}
          <button type="submit" disabled={pay.isPending} className={`w-full ${primaryButtonClass}`}>
            {pay.isPending ? "Paying…" : "Pay"}
          </button>
        </form>
      )}

      <div className="mt-6 border-t border-hairline-soft pt-6">
        <CancelBooking id={booking.id} />
      </div>
    </section>
  );
}
