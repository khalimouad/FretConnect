import type { CompanyStatus, OfferStatus } from "./types";

/**
 * Offer lifecycle state machine.
 *
 *   draft ──publish──▶ active ──▶ filled / cancelled / suspended
 *   active ──(availability date passes)──▶ expired
 *   filled | expired | cancelled ──▶ archived
 *   suspended ──reactivate──▶ active
 *   draft | archived ──▶ (deleted)
 */
export const OFFER_TRANSITIONS: Record<OfferStatus, OfferStatus[]> = {
  draft: ["active", "cancelled"],
  active: ["filled", "expired", "suspended", "cancelled"],
  suspended: ["active", "cancelled"],
  filled: ["archived"],
  expired: ["active", "archived"], // republish with a new date, or archive
  cancelled: ["archived"],
  archived: [],
};

/** Statuses in which an offer may be permanently deleted by its owner. */
export const OFFER_DELETABLE: OfferStatus[] = ["draft", "archived"];

export function canTransitionOffer(
  from: OfferStatus,
  to: OfferStatus,
): boolean {
  return OFFER_TRANSITIONS[from].includes(to);
}

/** Actions the owning carrier can take from a given status. */
export function offerActions(status: OfferStatus): {
  to: OfferStatus | "delete";
  labelKey:
    | "publish"
    | "markFilled"
    | "cancelOffer"
    | "archive"
    | "republish"
    | "delete";
}[] {
  switch (status) {
    case "draft":
      return [
        { to: "active", labelKey: "publish" },
        { to: "delete", labelKey: "delete" },
      ];
    case "active":
      return [
        { to: "filled", labelKey: "markFilled" },
        { to: "cancelled", labelKey: "cancelOffer" },
      ];
    case "expired":
      return [
        { to: "active", labelKey: "republish" },
        { to: "archived", labelKey: "archive" },
      ];
    case "filled":
    case "cancelled":
      return [{ to: "archived", labelKey: "archive" }];
    case "archived":
      return [{ to: "delete", labelKey: "delete" }];
    case "suspended":
      return []; // only a manager/admin can lift a suspension
  }
}

/**
 * Carrier-company account lifecycle, driven by Managers:
 * pending → validated | rejected; validated ⇄ suspended; → closed.
 */
export const COMPANY_TRANSITIONS: Record<CompanyStatus, CompanyStatus[]> = {
  pending: ["validated", "rejected"],
  validated: ["suspended", "closed"],
  suspended: ["validated", "closed"],
  rejected: [],
  closed: [],
};

export function canTransitionCompany(
  from: CompanyStatus,
  to: CompanyStatus,
): boolean {
  return COMPANY_TRANSITIONS[from].includes(to);
}

/** An offer is only visible in public search when active. */
export function isPubliclyVisible(status: OfferStatus): boolean {
  return status === "active";
}

/** Compute effective status: active offers expire past their availability window. */
export function effectiveStatus(
  status: OfferStatus,
  availableFrom: string,
  availableTo: string | undefined,
  today: string,
): OfferStatus {
  if (status !== "active") return status;
  const lastDay = availableTo ?? availableFrom;
  return lastDay < today ? "expired" : status;
}
