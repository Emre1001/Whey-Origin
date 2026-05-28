// EU / EEA / agreement country codes that appear in the oval EU identification mark.
// Source: code-knacker.de/eg_herkunft.htm + EU Reg. 853/2004.
export interface Country {
  name: string;
  flag: string;
  eu: boolean;
}

export const COUNTRIES: Record<string, Country> = {
  AT: { name: "Österreich", flag: "🇦🇹", eu: true },
  BE: { name: "Belgien", flag: "🇧🇪", eu: true },
  BG: { name: "Bulgarien", flag: "🇧🇬", eu: true },
  CY: { name: "Zypern", flag: "🇨🇾", eu: true },
  CZ: { name: "Tschechien", flag: "🇨🇿", eu: true },
  DE: { name: "Deutschland", flag: "🇩🇪", eu: true },
  DK: { name: "Dänemark", flag: "🇩🇰", eu: true },
  EE: { name: "Estland", flag: "🇪🇪", eu: true },
  ES: { name: "Spanien", flag: "🇪🇸", eu: true },
  FI: { name: "Finnland", flag: "🇫🇮", eu: true },
  FR: { name: "Frankreich", flag: "🇫🇷", eu: true },
  GR: { name: "Griechenland", flag: "🇬🇷", eu: true },
  HR: { name: "Kroatien", flag: "🇭🇷", eu: true },
  HU: { name: "Ungarn", flag: "🇭🇺", eu: true },
  IE: { name: "Irland", flag: "🇮🇪", eu: true },
  IT: { name: "Italien", flag: "🇮🇹", eu: true },
  LT: { name: "Litauen", flag: "🇱🇹", eu: true },
  LU: { name: "Luxemburg", flag: "🇱🇺", eu: true },
  LV: { name: "Lettland", flag: "🇱🇻", eu: true },
  MT: { name: "Malta", flag: "🇲🇹", eu: true },
  NL: { name: "Niederlande", flag: "🇳🇱", eu: true },
  PL: { name: "Polen", flag: "🇵🇱", eu: true },
  PT: { name: "Portugal", flag: "🇵🇹", eu: true },
  RO: { name: "Rumänien", flag: "🇷🇴", eu: true },
  SE: { name: "Schweden", flag: "🇸🇪", eu: true },
  SI: { name: "Slowenien", flag: "🇸🇮", eu: true },
  SK: { name: "Slowakei", flag: "🇸🇰", eu: true },
  UK: { name: "Vereinigtes Königreich", flag: "🇬🇧", eu: false },
  GB: { name: "Vereinigtes Königreich", flag: "🇬🇧", eu: false },
  // Non-EU with EU agreements / common on labels
  CH: { name: "Schweiz", flag: "🇨🇭", eu: false },
  FO: { name: "Färöer", flag: "🇫🇴", eu: false },
  GL: { name: "Grönland", flag: "🇬🇱", eu: false },
  IS: { name: "Island", flag: "🇮🇸", eu: false },
  SM: { name: "San Marino", flag: "🇸🇲", eu: false },
  NO: { name: "Norwegen", flag: "🇳🇴", eu: false },
  // Common third-country raw-material origins (no "EG" suffix on their mark)
  US: { name: "USA", flag: "🇺🇸", eu: false },
  NZ: { name: "Neuseeland", flag: "🇳🇿", eu: false },
  CA: { name: "Kanada", flag: "🇨🇦", eu: false },
  AU: { name: "Australien", flag: "🇦🇺", eu: false },
};
