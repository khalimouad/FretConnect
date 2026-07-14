import type { Dictionary } from "@/lib/i18n";

export type NotificationKind =
  | "alertMatch"
  | "acceptanceConfirmed"
  | "acceptanceReceived"
  | "subscriptionExpiring"
  | "subscriptionOverdue"
  | "carrierPending"
  | "offerFlagged";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  /** Optional route context rendered under the title, e.g. "Casablanca → Agadir". */
  departureCityId?: string;
  arrivalCityId?: string;
  detail?: string;
  href?: string;
  createdAt: string; // ISO datetime
  read: boolean;
}

export function notifTitle(dict: Dictionary, kind: NotificationKind): string {
  return dict.notif[kind];
}

export const userNotifications: AppNotification[] = [
  {
    id: "n-u1",
    kind: "alertMatch",
    departureCityId: "casablanca",
    arrivalCityId: "agadir",
    href: "/offers/of-1001",
    createdAt: "2026-07-12T08:10:00Z",
    read: false,
  },
  {
    id: "n-u2",
    kind: "acceptanceConfirmed",
    departureCityId: "fes",
    arrivalCityId: "casablanca",
    href: "/offers/of-1014",
    createdAt: "2026-07-11T14:30:00Z",
    read: false,
  },
  {
    id: "n-u3",
    kind: "alertMatch",
    departureCityId: "tanger",
    arrivalCityId: "fes",
    href: "/offers/of-1004",
    createdAt: "2026-07-10T09:00:00Z",
    read: true,
  },
];

export const companyNotifications: AppNotification[] = [
  {
    id: "n-c1",
    kind: "acceptanceReceived",
    departureCityId: "casablanca",
    arrivalCityId: "agadir",
    detail: "Karim Idrissi",
    createdAt: "2026-07-11T10:15:00Z",
    read: false,
  },
  {
    id: "n-c2",
    kind: "subscriptionExpiring",
    detail: "19 juil. 2026",
    createdAt: "2026-07-10T07:00:00Z",
    read: false,
  },
  {
    id: "n-c3",
    kind: "acceptanceReceived",
    departureCityId: "marrakech",
    arrivalCityId: "casablanca",
    detail: "Karim Idrissi",
    createdAt: "2026-07-04T16:45:00Z",
    read: true,
  },
];

export const managerNotifications: AppNotification[] = [
  {
    id: "n-m1",
    kind: "carrierPending",
    detail: "Oriental Cargo",
    createdAt: "2026-07-08T11:20:00Z",
    read: false,
  },
  {
    id: "n-m2",
    kind: "carrierPending",
    detail: "Chamal Distribution",
    createdAt: "2026-07-10T09:40:00Z",
    read: false,
  },
  {
    id: "n-m3",
    kind: "subscriptionOverdue",
    detail: "Rif Fret Express",
    createdAt: "2026-07-05T08:00:00Z",
    read: true,
  },
];

export const adminNotifications: AppNotification[] = [
  {
    id: "n-a1",
    kind: "offerFlagged",
    departureCityId: "fes",
    arrivalCityId: "meknes",
    createdAt: "2026-07-11T12:00:00Z",
    read: false,
  },
  {
    id: "n-a2",
    kind: "carrierPending",
    detail: "Oriental Cargo",
    createdAt: "2026-07-08T11:20:00Z",
    read: true,
  },
];
