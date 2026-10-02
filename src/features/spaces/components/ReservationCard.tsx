import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { getApiError } from "@/api/errors";
import { DateTimeField } from "@/components/date-time-field";
import { useCreateBookingMutation } from "@/features/spaces/api/useCreateBookingMutation";
import {
  amountFor,
  bangkokLocalToDate,
  formatHours,
  formatMoney,
  hoursBetween,
  toBangkokIso,
} from "@/lib/format";
import { errorClass, inputClass, labelClass, primaryButtonClass } from "@/lib/styles";
import type { Space } from "@/types/api";

const reservationSchema = z.object({
  member: z.string().trim().min(1, "Your name is required"),
  start_time: z.string().min(1, "Add a start time"),
  end_time: z.string().min(1, "Add an end time"),
  party_size: z.number().int().min(1),
});

type ReservationValues = z.infer<typeof reservationSchema>;

export function ReservationCard({
  space,
  defaultMember,
  defaultStart,
  defaultEnd,
  defaultGuests,
}: {
  space: Space;
  defaultMember: string;
  defaultStart: string;
  defaultEnd: string;
  defaultGuests: number;
}) {
  const navigate = useNavigate();
  const booking = useCreateBookingMutation(space.id);
  const [party, setParty] = useState(Math.min(Math.max(defaultGuests, 1), space.capacity));
  const form = useForm<ReservationValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      member: defaultMember,
      start_time: defaultStart,
      end_time: defaultEnd,
      party_size: Math.min(Math.max(defaultGuests, 1), space.capacity),
    },
  });

  const start = form.watch("start_time");
  const end = form.watch("end_time");
  const startDate = bangkokLocalToDate(start);
  const endDate = bangkokLocalToDate(end);
  const hours = startDate && endDate && endDate > startDate ? hoursBetween(startDate, endDate) : null;
  const estimate = hours != null && startDate && endDate ? amountFor(space.price_cents, startDate, endDate) : null;

  function setPartySize(next: number) {
    setParty(next);
    form.setValue("party_size", next);
  }

  function onSubmit(values: ReservationValues) {
    const startIso = toBangkokIso(values.start_time);
    const endIso = toBangkokIso(values.end_time);
    if (!startIso || !endIso) {
      form.setError("start_time", { message: "Add a valid date and time" });
      return;
    }

    booking.mutate(
      {
        member: values.member,
        start_time: startIso,
        end_time: endIso,
        party_size: values.party_size,
      },
      {
        onSuccess: (created) => {
          void navigate(`/bookings/${created.id}`);
        },
      },
    );
  }

  const serverError = booking.isError ? getApiError(booking.error, "Could not book this space") : null;

  return (
    <form
      id="reserve"
      onSubmit={form.handleSubmit(onSubmit)}
      className="scroll-mt-28 rounded-card border border-hairline bg-canvas p-6"
      noValidate
    >
      <p className="text-[21px] leading-snug font-bold text-ink">
        {formatMoney(space.price_cents)} <span className="text-base font-medium text-muted">/ hour</span>
      </p>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className={labelClass}>Your name</span>
          <input placeholder="Your name" className={inputClass} {...form.register("member")} />
          {form.formState.errors.member && (
            <p className={`mt-1.5 ${errorClass}`} role="alert">
              {form.formState.errors.member.message}
            </p>
          )}
        </label>
        <Controller
          name="start_time"
          control={form.control}
          render={({ field }) => (
            <DateTimeField
              name={field.name}
              label="Start · Bangkok time"
              value={field.value}
              required
              appearance="input"
              onValueChange={field.onChange}
            />
          )}
        />
        {form.formState.errors.start_time && (
          <p className={errorClass} role="alert">
            {form.formState.errors.start_time.message}
          </p>
        )}
        <Controller
          name="end_time"
          control={form.control}
          render={({ field }) => (
            <DateTimeField
              name={field.name}
              label="End · Bangkok time"
              value={field.value}
              required
              appearance="input"
              align="end"
              onValueChange={field.onChange}
            />
          )}
        />
        {form.formState.errors.end_time && (
          <p className={errorClass} role="alert">
            {form.formState.errors.end_time.message}
          </p>
        )}
        <div>
          <span className={labelClass}>Guests</span>
          <div className="flex h-14 items-center justify-between rounded-lg border border-hairline px-3">
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={party <= 1}
              onClick={() => setPartySize(party - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-strong text-lg disabled:text-muted-soft"
            >
              −
            </button>
            <span className="text-base">
              {party} {party === 1 ? "guest" : "guests"}
            </span>
            <button
              type="button"
              aria-label="More guests"
              disabled={party >= space.capacity}
              onClick={() => setPartySize(party + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-strong text-lg disabled:text-muted-soft"
            >
              +
            </button>
          </div>
          <p className="mt-1.5 text-sm text-muted">Capacity {space.capacity}</p>
        </div>
      </div>
      {estimate != null && hours != null && (
        <p className="mt-5 flex justify-between text-sm">
          <span>
            {formatMoney(space.price_cents)} × {formatHours(hours)}
          </span>
          <span className="font-semibold">{formatMoney(estimate)}</span>
        </p>
      )}
      {serverError && (
        <p className={`mt-4 ${errorClass}`} role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" disabled={booking.isPending} className={`mt-5 w-full ${primaryButtonClass}`}>
        {booking.isPending ? "Booking…" : "Book"}
      </button>
      <p className="mt-3 text-sm leading-5 text-muted">
        A subscribed name is booked already paid, at no extra charge. The name is matched without regard to
        case.
      </p>
    </form>
  );
}
