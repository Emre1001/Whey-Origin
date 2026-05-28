// German Bundesland codes used in the establishment number of the oval mark.
// geo = approximate state centroid [lat, lng] for the map link.
export interface Region {
  name: string;
  geo: [number, number];
}

export const REGIONS: Record<string, Region> = {
  BW: { name: "Baden-Württemberg", geo: [48.66, 9.35] },
  BY: { name: "Bayern", geo: [48.79, 11.5] },
  BE: { name: "Berlin", geo: [52.52, 13.4] },
  BB: { name: "Brandenburg", geo: [52.41, 13.05] },
  HB: { name: "Bremen", geo: [53.08, 8.8] },
  HH: { name: "Hamburg", geo: [53.55, 10.0] },
  HE: { name: "Hessen", geo: [50.65, 9.16] },
  MV: { name: "Mecklenburg-Vorpommern", geo: [53.76, 12.57] },
  NI: { name: "Niedersachsen", geo: [52.64, 9.85] },
  NW: { name: "Nordrhein-Westfalen", geo: [51.43, 7.66] },
  RP: { name: "Rheinland-Pfalz", geo: [49.91, 7.45] },
  SL: { name: "Saarland", geo: [49.38, 6.98] },
  SN: { name: "Sachsen", geo: [51.05, 13.74] },
  ST: { name: "Sachsen-Anhalt", geo: [51.95, 11.69] },
  SH: { name: "Schleswig-Holstein", geo: [54.22, 9.7] },
  TH: { name: "Thüringen", geo: [50.86, 11.05] },
};
