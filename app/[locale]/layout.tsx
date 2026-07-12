import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, localeMeta, locales } from "@/lib/i18n/config";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FretConnect — Fret retour à vide, Maroc",
    template: "%s · FretConnect",
  },
  description:
    "Plateforme de mise en relation entre sociétés de transport (trajets retour à vide) et expéditeurs au Maroc.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const meta = localeMeta[locale];

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
