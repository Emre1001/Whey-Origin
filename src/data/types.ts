/**
 * Halal-Einschätzung. Molkenprotein aus Milch ist halal (auch Lab/Rennet gilt
 * nach Mehrheitsmeinung als halal).
 * - "ok"        → halal (Molkenprotein aus Milch) — Standard
 * - "certified" → öffentlich Halal-zertifiziert (belegt)
 * - "check"     → nur, wenn das ENDPRODUKT kritische Zusätze hätte
 *                 (Schweine-Gelatine, Alkohol-Aroma)
 */
export type Halal = "ok" | "certified" | "check";

export interface Lab {
  id: string;
  /** Canonical oval code "DE SN 016 EG" — null when the establishment number is not confirmed. */
  code: string | null;
  country: string; // ISO country code, e.g. "DE"
  region: string; // German Bundesland code, e.g. "SN" — "" for non-DE / unknown
  number: string | null; // establishment number, e.g. "016"
  company: string;
  group?: string; // parent company / group
  city: string;
  geo?: [number, number]; // [lat, lng] for map links
  types: string[]; // e.g. ["Molkerei", "Whey-Ingredients", "Abfüller"]
  /** Halal-Status. Fehlt = "ok" (Molkenprotein aus Milch ist halal). */
  halal?: Halal;
  halalNote?: string;
  verified: boolean; // is the oval code itself confirmed by a public source
  sources: string[];
  note?: string;
}

export interface Brand {
  id: string;
  name: string;
  owner?: string; // brand owner / company
  retailer?: string; // for private labels: the chain selling it (Lidl, dm, Aldi …)
  privateLabel: boolean;
  category: string; // "Whey Konzentrat", "Clear Whey", "Milchprodukt" …
  labId: string | null; // FK -> Lab.id; null when packer/code unknown
  /** true => Proteinpulver (gehört in den Proteinpulver-Abteil). */
  powder?: boolean;
  /** true => vegan/pflanzlich — wird aus dem Halal-Proteinpulver-Abteil ausgeblendet. */
  vegan?: boolean;
  /** Halal-Status der Marke. Fehlt = "ok" (Whey aus Milch ist halal). */
  halal?: Halal;
  /** Name der Zertifizierungsstelle, wenn halal: "certified". */
  halalCert?: string;
  verified: boolean;
  sources?: string[];
  note?: string;
}
