import type { Dictionary } from "@/lib/i18n";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";

/**
 * WhatsApp / Telegram contact buttons with a prefilled localized message.
 * Only rendered for the channels the carrier has configured.
 */
export function SocialContact({
  whatsapp,
  telegram,
  dict,
  route,
  date,
}: {
  whatsapp?: string;
  telegram?: string;
  dict: Dictionary;
  route: string;
  date: string;
}) {
  if (!whatsapp && !telegram) return null;

  const message = dict.offer.whatsappMessage.replace("{route}", route).replace("{date}", date);
  const waDigits = whatsapp?.replace(/[^\d]/g, "");

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {whatsapp ? (
        <a
          href={`https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#1FAF56]"
        >
          <WhatsAppIcon width={17} height={17} />
          {dict.offer.contactWhatsApp}
        </a>
      ) : null}
      {telegram ? (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#1C87BC]"
        >
          <TelegramIcon width={17} height={17} />
          {dict.offer.contactTelegram}
        </a>
      ) : null}
    </div>
  );
}
