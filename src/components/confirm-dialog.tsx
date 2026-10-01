import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { errorClass, primaryButtonClass, secondaryButtonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  pending = false,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const pendingRef = useRef(pending);
  onCloseRef.current = onClose;
  pendingRef.current = pending;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (pendingRef.current) return;
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])")];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center tablet:items-center tablet:p-6">
      <button
        type="button"
        aria-label="Close"
        disabled={pending}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[568px] flex-col rounded-t-[32px] bg-canvas shadow-card outline-none tablet:rounded-[32px]"
      >
        <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-hairline-soft px-14">
          <button
            type="button"
            aria-label="Close"
            disabled={pending}
            className="absolute left-4 flex size-8 items-center justify-center rounded-full hover:bg-surface-soft disabled:cursor-not-allowed"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
        </div>
        <div className="px-6 py-6">
          <p id={descriptionId} className="text-base leading-6 text-body">
            {description}
          </p>
          {error && (
            <p className={`mt-3 ${errorClass}`} role="alert">
              {error}
            </p>
          )}
          <div className="mt-8 flex flex-col-reverse gap-3 tablet:flex-row tablet:justify-end">
            <button type="button" disabled={pending} className={secondaryButtonClass} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              disabled={pending}
              className={cn(primaryButtonClass, "tablet:min-w-32")}
              onClick={onConfirm}
            >
              {pending ? pendingLabel ?? confirmLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
