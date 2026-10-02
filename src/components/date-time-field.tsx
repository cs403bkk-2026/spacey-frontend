"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

function parseLocal(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  return {
    date: new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
    time: `${match[4]}:${match[5]}`,
  };
}

function toLocalValue(date: Date, time: string) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${time}`;
}

function formatClock(time: string) {
  const [hourText, minute] = time.split(":");
  const hour24 = Number(hourText);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

function formatDisplay(value: string) {
  const parsed = parseLocal(value);
  if (!parsed) return "";
  const day = parsed.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${day}, ${formatClock(parsed.time)}`;
}

export function DateTimeField({
  name,
  label,
  defaultValue = "",
  value,
  onValueChange,
  required = false,
  appearance,
  align = "start",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  appearance: "segment" | "stacked" | "input";
  align?: "start" | "end";
}) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = controlled ? value : internal;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const parsed = parseLocal(current);
  const time = parsed?.time ?? "09:00";
  const slots = parsed && !SLOTS.includes(parsed.time) ? [...SLOTS, parsed.time].sort() : SLOTS;

  useEffect(() => {
    if (!controlled) setInternal(defaultValue);
  }, [controlled, defaultValue]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const selected = listRef.current.querySelector<HTMLButtonElement>("[data-selected='true']");
    if (!selected) return;
    listRef.current.scrollTop = selected.offsetTop - listRef.current.clientHeight / 2;
  }, [open]);

  function commit(next: string) {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  }

  function pickDay(date: Date | undefined) {
    if (!date) return;
    commit(toLocalValue(date, parsed?.time ?? "09:00"));
  }

  function pickTime(nextTime: string) {
    commit(toLocalValue(parsed?.date ?? new Date(), nextTime));
  }

  const shell =
    appearance === "stacked"
      ? "relative flex flex-col gap-1 border-b border-hairline px-1 py-3"
      : appearance === "segment"
        ? "relative flex min-w-0 flex-1 flex-col justify-center border-r border-hairline px-6"
        : "relative block";

  const trigger =
    appearance === "input"
      ? "flex h-14 w-full items-center rounded-lg border border-hairline bg-canvas px-3 text-left text-base outline-none focus-visible:border-2 focus-visible:border-ink"
      : "w-full truncate bg-transparent text-left text-sm outline-none";

  const panel =
    appearance === "input" || appearance === "stacked"
      ? "left-0 w-full"
      : align === "end"
        ? "right-0 w-[20.5rem] max-w-[calc(100vw-3rem)]"
        : "left-0 w-[20.5rem] max-w-[calc(100vw-3rem)]";

  return (
    <div ref={rootRef} className={shell}>
      <span className={appearance === "input" ? "mb-1.5 block text-sm font-medium text-muted" : "text-xs font-bold text-ink"}>
        {label}
      </span>
      <button
        type="button"
        className={trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-required={required}
        onClick={() => setOpen((next) => !next)}
      >
        {formatDisplay(current) || <span className="text-muted">Add date</span>}
      </button>
      <input
        type="text"
        name={name}
        value={current}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onInvalid={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      />
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={`absolute top-full z-50 mt-2 rounded-card border border-hairline bg-canvas p-3 ${panel}`}
        >
          <DayPicker
            mode="single"
            navLayout="around"
            weekStartsOn={0}
            showOutsideDays
            selected={parsed?.date}
            defaultMonth={parsed?.date}
            onSelect={pickDay}
            className="spacy-calendar"
          />
          <p className="mt-2 text-xs font-bold text-ink">Time</p>
          <div ref={listRef} className="mt-2 grid max-h-36 grid-cols-3 gap-1 overflow-y-auto">
            {slots.map((slot) => {
              const selected = Boolean(parsed) && slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  data-selected={selected}
                  onClick={() => pickTime(slot)}
                  className={`h-9 rounded-full text-sm ${
                    selected ? "bg-ink font-semibold text-on-primary" : "text-ink hover:bg-surface-soft"
                  }`}
                >
                  {formatClock(slot)}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-on-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
