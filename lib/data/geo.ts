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
  { id: "casablanca", regionId: "ma-cs", countryCode: "MA", name: "Casablanca" },
  { id: "settat", regionId: "ma-cs", countryCode: "MA", name: "Settat" },
  { id: "el-jadida", regionId: "ma-cs", countryCode: "MA", name: "El Jadida" },
  { id: "rabat", regionId: "ma-rsk", countryCode: "MA", name: "Rabat" },
  { id: "kenitra", regionId: "ma-rsk", countryCode: "MA", name: "Kénitra" },
  { id: "tanger", regionId: "ma-tth", countryCode: "MA", name: "Tanger" },
  { id: "tetouan", regionId: "ma-tth", countryCode: "MA", name: "Tétouan" },
  { id: "fes", regionId: "ma-fm", countryCode: "MA", name: "Fès" },
  { id: "meknes", regionId: "ma-fm", countryCode: "MA", name: "Meknès" },
  { id: "marrakech", regionId: "ma-ms", countryCode: "MA", name: "Marrakech" },
  { id: "safi", regionId: "ma-ms", countryCode: "MA", name: "Safi" },
  { id: "agadir", regionId: "ma-sm", countryCode: "MA", name: "Agadir" },
  { id: "oujda", regionId: "ma-or", countryCode: "MA", name: "Oujda" },
  { id: "nador", regionId: "ma-or", countryCode: "MA", name: "Nador" },
  { id: "beni-mellal", regionId: "ma-bk", countryCode: "MA", name: "Béni Mellal" },
  { id: "errachidia", regionId: "ma-do", countryCode: "MA", name: "Errachidia" },
  { id: "laayoune", regionId: "ma-lss", countryCode: "MA", name: "Laâyoune" },
];

const cityById = new Map(cities.map((c) => [c.id, c]));

export function cityName(id: string): string {
  return cityById.get(id)?.name ?? id;
}

export function getCity(id: string): City | undefined {
  return cityById.get(id);
}
