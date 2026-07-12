import type { Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import fr from "./dictionaries/fr";
import ar from "./dictionaries/ar";
import es from "./dictionaries/es";

const dictionaries: Record<Locale, Dictionary> = { en, fr, ar, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
