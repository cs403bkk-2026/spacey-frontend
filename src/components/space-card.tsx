import { Link } from "react-router";

import { SpaceWash } from "@/components/space-wash";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Space } from "@/types/api";

export function SpaceCard({
  space,
  href,
  booked,
  index,
}: {
  space: Space;
  href: string;
  booked: boolean;
  index: number;
}) {
  return (
    <Link to={href} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-card border border-hairline">
        <SpaceWash index={index} className="absolute inset-0" />
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            booked ? "bg-ink text-on-primary" : "border border-hairline bg-canvas text-ink",
          )}
        >
          {booked ? "Booked" : "Available"}
        </span>
      </div>
      <div className="mt-3">
        <h2 className="text-base font-semibold text-ink">{space.name}</h2>
        <p className="mt-0.5 text-sm text-muted">
          Up to {space.capacity} {space.capacity === 1 ? "person" : "people"}
        </p>
        <p className="mt-1 text-sm text-ink">
          <span className="font-semibold">{formatMoney(space.price_cents)}</span>
          <span className="text-muted"> / hour</span>
        </p>
      </div>
    </Link>
  );
}
