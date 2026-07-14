import type { CargoType, Company, Offer, VehicleType } from "../domain/types";
import { effectiveStatus, isPubliclyVisible } from "../domain/workflow";
import { acceptances, companies, offers } from "./mock";

/**
 * Read API over the seed data. Functions are async so the implementation
 * can later be swapped for Supabase/PostgREST queries without touching
 * the pages that consume them.
 */

/** Fixed "today" so the demo dataset renders consistently. */
export const TODAY = "2026-07-12";

export interface SearchFilters {
  departure?: string;
  arrival?: string;
  dateFrom?: string;
  vehicle?: VehicleType;
  cargo?: CargoType;
  minTonnage?: number;
  maxPrice?: number;
  sort?: "date" | "price" | "capacity";
}

export interface OfferWithCompany extends Offer {
  company: Company;
}

const companyById = new Map(companies.map((c) => [c.id, c]));

function withEffectiveStatus(offer: Offer): Offer {
  return {
    ...offer,
    status: effectiveStatus(
      offer.status,
      offer.availableFrom,
      offer.availableTo,
      TODAY,
    ),
  };
}

export async function searchOffers(
  filters: SearchFilters = {},
): Promise<OfferWithCompany[]> {
  let results = offers
    .map(withEffectiveStatus)
    .filter((o) => isPubliclyVisible(o.status))
    .filter((o) => companyById.get(o.companyId)?.status === "validated");

  if (filters.departure)
    results = results.filter((o) => o.departureCityId === filters.departure);
  if (filters.arrival)
    results = results.filter((o) => o.arrivalCityId === filters.arrival);
  if (filters.dateFrom)
    results = results.filter(
      (o) => (o.availableTo ?? o.availableFrom) >= filters.dateFrom!,
    );
  if (filters.vehicle)
    results = results.filter((o) => o.vehicleType === filters.vehicle);
  if (filters.cargo)
    results = results.filter((o) => o.cargoType === filters.cargo);
  if (filters.minTonnage !== undefined)
    results = results.filter((o) => o.tonnage >= filters.minTonnage!);
  if (filters.maxPrice !== undefined)
    results = results.filter(
      (o) => o.price !== undefined && o.price.amount <= filters.maxPrice!,
    );

  const sort = filters.sort ?? "date";
  results.sort((a, b) => {
    if (sort === "price") {
      const pa = a.price?.amount ?? Infinity;
      const pb = b.price?.amount ?? Infinity;
      return pa - pb;
    }
    if (sort === "capacity") return b.tonnage - a.tonnage;
    return a.availableFrom.localeCompare(b.availableFrom);
  });

  return results.map((o) => ({ ...o, company: companyById.get(o.companyId)! }));
}

export async function getOffer(id: string): Promise<OfferWithCompany | null> {
  const offer = offers.find((o) => o.id === id);
  if (!offer) return null;
  const company = companyById.get(offer.companyId);
  if (!company) return null;
  return { ...withEffectiveStatus(offer), company };
}

export async function getCompanyOffers(companyId: string): Promise<Offer[]> {
  return offers
    .filter((o) => o.companyId === companyId)
    .map(withEffectiveStatus);
}

export async function getCompany(id: string): Promise<Company | null> {
  return companyById.get(id) ?? null;
}

export async function getPendingAcceptances(companyId: string) {
  const companyOfferIds = new Set(
    offers.filter((o) => o.companyId === companyId).map((o) => o.id),
  );
  return acceptances.filter(
    (a) => a.status === "pending" && companyOfferIds.has(a.offerId),
  );
}
