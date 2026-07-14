import type { City, Country, Region } from "../domain/types";

/**
 * Hierarchical geographic referential (Country > Region > City).
 * Morocco is active at MVP; West-African and European entries are seeded
 * as "planned" to prove the schema extends without changes.
 */

export const countries: Country[] = [
  { code: "MA", name: "Maroc", zone: "maghreb", currency: "MAD", status: "active" },
  { code: "SN", name: "Sénégal", zone: "west_africa", currency: "XOF", status: "planned" },
  { code: "MR", name: "Mauritanie", zone: "west_africa", currency: "MRU", status: "planned" },
  { code: "CI", name: "Côte d'Ivoire", zone: "west_africa", currency: "XOF", status: "planned" },
  { code: "ML", name: "Mali", zone: "west_africa", currency: "XOF", status: "planned" },
  { code: "ES", name: "Espagne", zone: "europe", currency: "EUR", status: "planned" },
  { code: "FR", name: "France", zone: "europe", currency: "EUR", status: "planned" },
];

export const regions: Region[] = [
  { id: "ma-cs", countryCode: "MA", name: "Casablanca-Settat" },
  { id: "ma-rsk", countryCode: "MA", name: "Rabat-Salé-Kénitra" },
  { id: "ma-tth", countryCode: "MA", name: "Tanger-Tétouan-Al Hoceïma" },
  { id: "ma-fm", countryCode: "MA", name: "Fès-Meknès" },
  { id: "ma-ms", countryCode: "MA", name: "Marrakech-Safi" },
  { id: "ma-sm", countryCode: "MA", name: "Souss-Massa" },
  { id: "ma-or", countryCode: "MA", name: "L'Oriental" },
  { id: "ma-bk", countryCode: "MA", name: "Béni Mellal-Khénifra" },
  { id: "ma-do", countryCode: "MA", name: "Drâa-Tafilalet" },
  { id: "ma-lss", countryCode: "MA", name: "Laâyoune-Sakia El Hamra" },
];

export const cities: City[] = [
  { id: "casablanca", regionId: "ma-cs", countryCode: "MA", name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { id: "settat", regionId: "ma-cs", countryCode: "MA", name: "Settat", lat: 33.0, lng: -7.6166 },
  { id: "el-jadida", regionId: "ma-cs", countryCode: "MA", name: "El Jadida", lat: 33.2316, lng: -8.5007 },
  { id: "rabat", regionId: "ma-rsk", countryCode: "MA", name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { id: "kenitra", regionId: "ma-rsk", countryCode: "MA", name: "Kénitra", lat: 34.261, lng: -6.5802 },
  { id: "tanger", regionId: "ma-tth", countryCode: "MA", name: "Tanger", lat: 35.7595, lng: -5.834 },
  { id: "tetouan", regionId: "ma-tth", countryCode: "MA", name: "Tétouan", lat: 35.5785, lng: -5.3684 },
  { id: "fes", regionId: "ma-fm", countryCode: "MA", name: "Fès", lat: 34.0331, lng: -5.0003 },
  { id: "meknes", regionId: "ma-fm", countryCode: "MA", name: "Meknès", lat: 33.8935, lng: -5.5473 },
  { id: "marrakech", regionId: "ma-ms", countryCode: "MA", name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { id: "safi", regionId: "ma-ms", countryCode: "MA", name: "Safi", lat: 32.2994, lng: -9.2372 },
  { id: "agadir", regionId: "ma-sm", countryCode: "MA", name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { id: "oujda", regionId: "ma-or", countryCode: "MA", name: "Oujda", lat: 34.6805, lng: -1.9086 },
  { id: "nador", regionId: "ma-or", countryCode: "MA", name: "Nador", lat: 35.174, lng: -2.9287 },
  { id: "beni-mellal", regionId: "ma-bk", countryCode: "MA", name: "Béni Mellal", lat: 32.3373, lng: -6.3498 },
  { id: "errachidia", regionId: "ma-do", countryCode: "MA", name: "Errachidia", lat: 31.9314, lng: -4.4241 },
  { id: "laayoune", regionId: "ma-lss", countryCode: "MA", name: "Laâyoune", lat: 27.1418, lng: -13.1873 },
];

const cityById = new Map(cities.map((c) => [c.id, c]));

export function cityName(id: string): string {
  return cityById.get(id)?.name ?? id;
}

export function getCity(id: string): City | undefined {
  return cityById.get(id);
}
