"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Generic slide-in drawer (CSS transitions only, no deps). `side` is a
 * logical edge ("start"/"end") so it anchors to the visually-correct side
 * in RTL locales too — see the `rtl:` variant on the closed-state transform.
 */
export function Drawer({
  open,
  onClose,
  side,
  children,
  ariaLabel,
}: {
  open: boolean;
  onClose: () => void;
  side: "start" | "end";
  children: ReactNode;
  ariaLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const closedTransform =
    side === "start"
      ? "-translate-x-full rtl:translate-x-full"
      : "translate-x-full rtl:-translate-x-full";

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`absolute inset-y-0 ${side}-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-slate-900 ${
          open ? "translate-x-0" : closedTransform
        }`}
      >
        {children}
      </div>
    </div>
  );
}
