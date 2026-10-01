import { Search } from "lucide-react";
import { Form } from "react-router";

import { DateTimeField } from "@/components/date-time-field";

function Fields({
  q,
  start,
  end,
  guests,
  stacked = false,
}: {
  q: string;
  start: string;
  end: string;
  guests: string;
  stacked?: boolean;
}) {
  const segment = stacked
    ? "flex flex-col gap-1 border-b border-hairline px-1 py-3 last:border-b-0"
    : "flex min-w-0 flex-1 flex-col justify-center border-r border-hairline px-6";

  return (
    <>
      <label className={segment}>
        <span className="text-xs font-bold text-ink">Where</span>
        <input
          name="q"
          defaultValue={q}
          placeholder="Space name"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
      <DateTimeField
        name="start"
        label="Start"
        defaultValue={start}
        appearance={stacked ? "stacked" : "segment"}
      />
      <DateTimeField
        name="end"
        label="End"
        defaultValue={end}
        appearance={stacked ? "stacked" : "segment"}
        align={stacked ? "start" : "end"}
      />
      <label className={stacked ? segment : "flex min-w-0 flex-1 flex-col justify-center px-6"}>
        <span className="text-xs font-bold text-ink">Who</span>
        <input
          type="number"
          min={1}
          name="guests"
          defaultValue={guests}
          placeholder="Add guests"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
    </>
  );
}

export function SearchBar({
  q,
  start,
  end,
  guests,
}: {
  q: string;
  start: string;
  end: string;
  guests: string;
}) {
  const defaults = { q, start, end, guests };

  return (
    <div>
      <details className="tablet:hidden">
        <summary className="flex h-16 cursor-pointer items-center rounded-full border border-hairline px-6">
          <span className="text-sm font-semibold">Search spaces</span>
          <span className="ml-3 truncate text-sm text-muted">{q || "Anywhere, any time"}</span>
        </summary>
        <Form method="get" action="/" className="mt-3 rounded-card border border-hairline p-4">
          <Fields {...defaults} stacked />
          <button
            type="submit"
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-base font-medium text-on-primary"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Search
          </button>
        </Form>
      </details>
      <Form method="get" action="/" className="hidden h-16 items-center rounded-full border border-hairline bg-canvas tablet:flex">
        <Fields {...defaults} />
        <button
          type="submit"
          aria-label="Search"
          className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-on-primary"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </button>
      </Form>
    </div>
  );
}
