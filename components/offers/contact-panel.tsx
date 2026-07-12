"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui";
import { CheckIcon, MessageIcon } from "@/components/icons";

/**
 * Accept + internal messaging panel (§4.5). Acceptance is a manifestation
 * of interest: the carrier is notified and must confirm the match.
 */
export function ContactPanel({ dict }: { dict: Dictionary }) {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4">
      {accepted ? (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">
          <p className="flex items-center gap-2 font-semibold">
            <CheckIcon width={16} height={16} />
            {dict.offer.acceptPending}
          </p>
        </div>
      ) : (
        <>
          <Button variant="accent" size="lg" className="w-full" onClick={() => setAccepted(true)}>
            {dict.offer.acceptOffer}
          </Button>
          <p className="text-xs leading-relaxed text-slate-400">{dict.offer.acceptNote}</p>
        </>
      )}

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MessageIcon width={16} height={16} className="text-brand-600" />
          {dict.offer.sendMessage}
        </p>
        {sent ? (
          <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-inset ring-brand-200">
            {dict.offer.messageSent}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) setSent(true);
            }}
            className="space-y-2"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={dict.offer.messagePlaceholder}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30"
            />
            <Button type="submit" variant="outline" className="w-full">
              {dict.common.send}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
