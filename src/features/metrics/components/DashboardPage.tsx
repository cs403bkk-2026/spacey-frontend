import { MetricsSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { useHealthQuery, useMetricsQuery } from "@/features/metrics/api/useMetricsQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatMoney, formatPercent } from "@/lib/format";

export function DashboardPage() {
  useDocumentTitle("Business metrics");
  const metricsQuery = useMetricsQuery();
  const healthQuery = useHealthQuery();

  if (metricsQuery.isPending) return <MetricsSkeleton />;

  if (!metricsQuery.data) {
    return (
      <PageMain>
        <p>Metrics are unavailable.</p>
      </PageMain>
    );
  }

  const data = metricsQuery.data;
  const top = Math.max(...data.revenue_by_space.map((row) => row.revenue_cents), 0);
  const cards = [
    ["Spaces", String(data.spaces)],
    ["Bookings", String(data.bookings)],
    ["Paid bookings", String(data.paid_bookings)],
    ["Unpaid bookings", String(data.unpaid_bookings)],
    ["Members", String(data.members)],
    ["Revenue", formatMoney(data.revenue_cents)],
    ["Utilization, next 7 days", formatPercent(data.utilization)],
    ["Repeat member rate", formatPercent(data.repeat_member_rate)],
    ["Payment conversion", formatPercent(data.payment_conversion)],
    ["Avg revenue per paid booking", formatMoney(data.avg_revenue_cents_per_paid_booking)],
  ];

  return (
    <PageMain>
      <h1 className="text-[28px] leading-[1.43] font-bold">Business metrics</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-body">
        Spacy is a space booking system where members find a space, book it, pay once or subscribe, and get access
        through a mocked lock.
      </p>
      <ul className="mt-10 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {cards.map(([label, value]) => (
          <li key={label} className="rounded-card border border-hairline p-6">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-[22px] font-medium tracking-[-0.44px]">{value}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-16 text-[21px] font-bold">Revenue per space</h2>
      {data.revenue_by_space.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No spaces yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {data.revenue_by_space.map((row) => {
            const width = top ? Math.round((row.revenue_cents / top) * 100) : 0;
            return (
              <li
                key={row.id}
                className="grid grid-cols-[8rem_1fr_5.5rem] items-center gap-3 tablet:grid-cols-[12rem_1fr_6rem]"
              >
                <span className="truncate text-sm">{row.name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-surface-strong">
                  <span className="block h-2 rounded-full bg-ink" style={{ width: `${width}%` }} />
                </span>
                <span className="text-right text-sm">{formatMoney(row.revenue_cents)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-10 text-sm text-muted">
        Figures come from the live Spacey API.
        {healthQuery.data ? ` Revision ${healthQuery.data.revision}.` : ""}
      </p>
    </PageMain>
  );
}
