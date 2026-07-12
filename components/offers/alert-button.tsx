"use client";

import { useState } from "react";
import { BellIcon, CheckIcon } from "@/components/icons";

/** Demo alert creation: flips to a confirmation state (§4.4 alerts). */
export function AlertButton({
  label,
  confirmation,
}: {
  label: string;
  confirmation: string;
}) {
  const [created, setCreated] = useState(false);

  if (created) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
        <CheckIcon width={16} height={16} />
        {confirmation}
      </span>
    );
  }
  return (
    <button
      onClick={() => setCreated(true)}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
    >
      <BellIcon width={16} height={16} />
      {label}
    </button>
  );
}
