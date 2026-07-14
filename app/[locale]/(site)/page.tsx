import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { searchOffers } from "@/lib/data/repository";
import { cities } from "@/lib/data/geo";
import { OfferCard } from "@/components/offers/offer-card";
import { ButtonLink } from "@/components/ui";
import {
  BellIcon,
  CheckIcon,
  GlobeIcon,
  MessageIcon,
  SearchIcon,
  TruckIcon,
} from "@/components/icons";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const latest = (await searchOffers({ sort: "date" })).slice(0, 3);

  const steps = [
    { icon: TruckIcon, title: dict.landing.step1Title, text: dict.landing.step1Text },
    { icon: SearchIcon, title: dict.landing.step2Title, text: dict.landing.step2Text },
    { icon: MessageIcon, title: dict.landing.step3Title, text: dict.landing.step3Text },
  ];

  const stats = [
    { value: "120+", label: dict.landing.statOffers },
    { value: "45", label: dict.landing.statCarriers },
    { value: `${cities.length}`, label: dict.landing.statCities },
    { value: "40%", label: dict.landing.statSavings },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero-grid bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-brand-100">
              <GlobeIcon width={14} height={14} className="text-accent-400" />
              {dict.landing.heroBadge}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {dict.landing.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
              {dict.landing.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/search`} variant="accent" size="lg">
                <SearchIcon width={18} height={18} />
                {dict.landing.heroCtaSearch}
              </ButtonLink>
              <ButtonLink
                href={`/${locale}/register?tab=company`}
                size="lg"
                className="border border-white/25 bg-white/10 text-white hover:bg-white/20"
                variant="ghost"
              >
                <TruckIcon width={18} height={18} />
                {dict.landing.heroCtaPublish}
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-brand-300">{dict.landing.langNote}</p>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="order-2 text-sm text-brand-300">{s.label}</dt>
                <dd className="text-3xl font-bold text-accent-400">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-brand-950 dark:text-white">
            {dict.landing.howTitle}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.landing.howSubtitle}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-900 text-accent-400">
                  <step.icon width={22} height={22} />
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-950 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest offers */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-brand-950 dark:text-white">
              {dict.search.title}
            </h2>
            <Link
              href={`/${locale}/search`}
              className="text-sm font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              {dict.common.viewAll}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {latest.map((offer) => (
              <OfferCard key={offer.id} offer={offer} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Two audiences */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-brand-950 p-8 text-white sm:p-10">
          <h3 className="text-2xl font-bold">{dict.landing.carriersTitle}</h3>
          <p className="mt-3 leading-relaxed text-brand-200">{dict.landing.carriersText}</p>
          <ul className="mt-6 space-y-3">
            {[dict.landing.carrierB1, dict.landing.carrierB2, dict.landing.carrierB3].map(
              (b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-brand-100">
                  <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-accent-400" />
                  {b}
                </li>
              ),
            )}
          </ul>
          <ButtonLink
            href={`/${locale}/pricing`}
            variant="accent"
            className="mt-8"
          >
            {dict.nav.pricing}
          </ButtonLink>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <h3 className="text-2xl font-bold text-brand-950 dark:text-white">{dict.landing.shippersTitle}</h3>
          <p className="mt-3 leading-relaxed text-slate-500 dark:text-slate-400">{dict.landing.shippersText}</p>
          <ul className="mt-6 space-y-3">
            {[dict.landing.shipperB1, dict.landing.shipperB2, dict.landing.shipperB3].map(
              (b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {b}
                </li>
              ),
            )}
          </ul>
          <ButtonLink href={`/${locale}/search`} className="mt-8">
            <BellIcon width={16} height={16} />
            {dict.landing.heroCtaSearch}
          </ButtonLink>
        </div>
      </section>

      {/* Coverage + CTA */}
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-brand-950 dark:text-white">
              {dict.landing.coverageTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-500 dark:text-slate-400">{dict.landing.coverageText}</p>
          </div>
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-950 p-8 text-center sm:p-12">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {dict.landing.ctaTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-brand-200">{dict.landing.ctaText}</p>
            <ButtonLink
              href={`/${locale}/register?tab=company`}
              variant="accent"
              size="lg"
              className="mt-7"
            >
              {dict.landing.ctaButton}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
