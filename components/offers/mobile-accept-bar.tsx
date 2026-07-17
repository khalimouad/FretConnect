"use client";

import type { Dictionary } from "@/lib/i18n";
import type { Company } from "@/lib/domain/types";
import { Button } from "@/components/ui";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { useAccept } from "@/components/offers/accept-state";
import { buildWhatsAppHref } from "@/components/offers/social-contact";

/**
 * Native-app-style sticky bottom action bar for the offer detail page on
 * mobile, so the primary Accept CTA is reachable without scrolling past
 * the whole page. Shares state with the sidebar ContactPanel via
 * AcceptProvider so the two surfaces never disagree.
 */
export function MobileAcceptBar({
  company,
  dict,
  route,
  date,
}: {
  company: Company;
  dict: Dictionary;
  route: string;
  date: string;
}) {
  const { accepted, setAccepted } = useAccept();

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
      {accepted ? (
        <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckIcon width={16} height={16} />
          {dict.offer.acceptPending}
        </span>
      ) : (
        <>
          <Button
            variant="accent"
            size="lg"
            className="flex-1"
            onClick={() => setAccepted(true)}
          >
            {dict.offer.acceptOffer}
          </Button>
          {company.whatsapp ? (
            <a
              href={buildWhatsAppHref(
                company.whatsapp,
                dict.offer.whatsappMessage.replace("{route}", route).replace("{date}", date),
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.offer.contactWhatsApp}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white transition-opacity hover:opacity-90 dark:bg-[#1FAF56]"
            >
              <WhatsAppIcon width={20} height={20} />
            </a>
          ) : null}
        </>
      )}
    </div>
  );
}
