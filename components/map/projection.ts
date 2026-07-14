/**
 * Simple equirectangular projection of Morocco (lat/lng) onto a fixed SVG
 * viewBox. Not geographically precise — a stylized silhouette is enough
 * for a route-visualization widget with no tile-server dependency.
 */
export const MAP_WIDTH = 440;
export const MAP_HEIGHT = 520;

const LNG_MIN = -17;
const LNG_MAX = -1;
const LAT_MIN = 24;
const LAT_MAX = 36.2;

export function project(lat: number, lng: number): [number, number] {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * MAP_WIDTH;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT;
  return [x, y];
}

/** Hand-approximated Morocco silhouette (incl. southern provinces), clockwise from Tanger. */
const OUTLINE_LATLNG: [number, number][] = [
  [35.9, -5.9],
  [35.75, -5.3],
  [35.3, -3.9],
  [35.17, -2.93],
  [34.9, -1.9],
  [34.0, -1.7],
  [32.8, -1.55],
  [31.5, -2.0],
  [30.2, -3.0],
  [28.8, -4.3],
  [27.8, -5.5],
  [27.0, -7.5],
  [26.0, -9.5],
  [25.3, -11.5],
  [25.0, -13.2],
  [24.7, -14.6],
  [25.4, -15.6],
  [26.4, -14.2],
  [27.14, -13.19],
  [28.5, -11.2],
  [30.0, -9.9],
  [30.43, -9.6],
  [31.4, -9.85],
  [32.3, -9.24],
  [33.0, -8.6],
  [33.57, -7.59],
  [34.0, -6.95],
  [34.26, -6.58],
  [35.0, -6.0],
];

export const outlinePath =
  "M " +
  OUTLINE_LATLNG.map(([lat, lng]) => project(lat, lng).join(" ")).join(" L ") +
  " Z";
