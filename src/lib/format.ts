const BANGKOK = "Asia/Bangkok";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const when = new Intl.DateTimeFormat("en-US", {
  timeZone: BANGKOK,
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const hoursFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const dayLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: BANGKOK,
  weekday: "short",
  month: "short",
  day: "numeric",
});

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: BANGKOK,
  hour: "numeric",
  minute: "2-digit",
});

const dayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: BANGKOK,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatMoney(cents: number) {
  return money.format(cents / 100);
}

export function formatPercent(share: number) {
  return `${(share * 100).toFixed(1)}%`;
}

export function formatWhen(iso: string) {
  return when.format(new Date(iso));
}

export function formatRange(start: string, end: string) {
  return `${formatWhen(start)} to ${formatWhen(end)}`;
}

/** Compact Bangkok window: same-day times stay on one line, overnight spans keep both dates. */
export function formatBookingSlot(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (dayKey.format(startDate) === dayKey.format(endDate)) {
    return `${dayLabel.format(startDate)} · ${clock.format(startDate)} – ${clock.format(endDate)}`;
  }
  return `${dayLabel.format(startDate)}, ${clock.format(startDate)} – ${dayLabel.format(endDate)}, ${clock.format(endDate)}`;
}

export function hoursBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 3_600_000;
}

export function amountFor(priceCents: number, start: Date, end: Date) {
  return Math.round(priceCents * hoursBetween(start, end));
}

export function formatHours(hours: number) {
  const text = hoursFormat.format(hours);
  return `${text} ${text === "1" ? "hour" : "hours"}`;
}

/** datetime-local value interpreted as Bangkok wall time (UTC+7, no DST). */
export function toBangkokIso(localValue: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2}))?$/.exec(localValue);
  if (!match) return null;
  return `${match[1]}:${match[2] ?? "00"}+07:00`;
}

export function bangkokLocalToDate(localValue: string): Date | null {
  const iso = toBangkokIso(localValue);
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function dollarsToCents(raw: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
  return Math.round(Number(raw) * 100);
}
