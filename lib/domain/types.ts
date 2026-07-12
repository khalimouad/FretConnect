/**
 * FretConnect domain model.
 *
 * Designed per the cahier des charges: the geographic referential is
 * hierarchical (Country > Region > City, ISO-coded) so West-African and
 * European zones can be activated later without schema changes, and prices
 * carry an explicit currency for future multi-currency support.
 */

export type Role = "admin" | "manager" | "company" | "user";

/** Offer lifecycle — see lib/domain/workflow.ts for allowed transitions. */
export type OfferStatus =
  | "draft"
  | "active"
  | "filled"
  | "expired"
  | "suspended"
  | "archived"
  | "cancelled";

/** Carrier-company account lifecycle (validated by a Manager). */
export type CompanyStatus =
  | "pending" // registered, awaiting manager validation
  | "validated"
  | "suspended"
  | "rejected"
  | "closed";

export type SubscriptionState = "active" | "expiring" | "overdue" | "cancelled";

export type VehicleType =
  | "truck"
  | "van"
  | "semi_trailer"
  | "refrigerated"
  | "flatbed"
  | "tanker";

export type ZoneStatus = "active" | "planned";

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  zone: "maghreb" | "west_africa" | "europe";
  currency: string; // ISO 4217
  status: ZoneStatus;
}

export interface Region {
  id: string;
  countryCode: string;
  name: string;
}

export interface City {
  id: string;
  regionId: string;
  countryCode: string;
  name: string;
}

export interface Money {
  amount: number;
  currency: string; // ISO 4217 — MAD at MVP
}

export interface Offer {
  id: string;
  companyId: string;
  departureCityId: string;
  arrivalCityId: string;
  availableFrom: string; // ISO date
  availableTo?: string; // optional range end
  vehicleType: VehicleType;
  tonnage: number; // tons
  volume?: number; // m³
  price?: Money; // absent = on request / negotiable
  status: OfferStatus;
  publishedAt?: string;
  views: number;
  contacts: number;
  flagged?: { reason: string };
}

export interface Company {
  id: string;
  name: string;
  cityId: string;
  ice: string; // Moroccan company identifier
  phone: string;
  email: string;
  fleetSize: number;
  status: CompanyStatus;
  managerId: string;
  planId: string;
  subscription: {
    state: SubscriptionState;
    renewsOn: string;
    lastPaymentOn?: string;
  };
  registeredAt: string;
}

export interface EndUser {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  departureCityId?: string;
  arrivalCityId?: string;
  vehicleType?: VehicleType;
  channels: { email: boolean; push: boolean };
  createdAt: string;
}

/**
 * An end user "accepting" an offer creates an acceptance request; the
 * carrier then confirms the match (which fills the offer) or declines —
 * the manual-confirmation answer to open point #1 of section 9.
 */
export type AcceptanceStatus = "pending" | "confirmed" | "declined";

export interface Acceptance {
  id: string;
  offerId: string;
  userId: string;
  status: AcceptanceStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  from: "user" | "company";
  body: string;
  sentAt: string;
}

export interface Thread {
  id: string;
  offerId: string;
  userId: string;
  companyId: string;
  messages: Message[];
}

export interface Plan {
  id: string;
  nameKey: "basic" | "pro" | "enterprise";
  monthlyPrice: Money;
  maxActiveOffers: number | null; // null = unlimited
  subAccounts: number | null;
  featured: boolean;
  prioritySupport: boolean;
}
