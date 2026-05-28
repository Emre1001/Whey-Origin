import { COUNTRIES } from "../data/countries";
import { REGIONS } from "../data/regions";
import { LABS } from "../data/labs";
import { BRANDS } from "../data/brands";
import type { Brand, Halal, Lab } from "../data/types";

export const HALAL_META: Record<
  Halal,
  { label: string; short: string; icon: string; cls: string }
> = {
  ok: {
    label: "Halal — Molkenprotein aus Milch (Lab/Rennet gilt als halal)",
    short: "Halal",
    icon: "☪",
    cls: "bg-acid/15 text-acid",
  },
  certified: {
    label: "Halal-zertifiziert (belegt)",
    short: "Halal ✓",
    icon: "☪",
    cls: "bg-acid/25 text-acid",
  },
  check: {
    label: "Halal: Endprodukt-Zutaten prüfen (Schweine-Gelatine, Alkohol-Aroma)",
    short: "Zutaten prüfen",
    icon: "⚠",
    cls: "bg-amber/15 text-amber",
  },
};

/** Molkenprotein aus Milch ist halal → Default "ok". */
export const halalStatus = (l: Lab): Halal => l.halal ?? "ok";

/** Marken-Halal-Status. Whey aus Milch ist halal → Default "ok". */
export const brandHalal = (b: Brand): Halal => b.halal ?? "ok";

/** Halal-Proteinpulver-Abteil: alle Pulver außer vegan. */
export function proteinPowders(q = ""): Brand[] {
  return searchBrands(q).filter((b) => b.powder && !b.vegan);
}

export interface Decoded {
  raw: string;
  valid: boolean;
  partial: boolean;
  country: string | null;
  countryName: string | null;
  flag: string | null;
  region: string | null;
  regionName: string | null;
  number: string | null;
  suffix: string | null;
  canonical: string | null;
  lab: Lab | null;
}

const SUFFIXES = ["EWG", "EG", "EC", "CE"];

const stripZeros = (n: string) => n.replace(/^0+/, "") || n;

export function decode(input: string): Decoded {
  const raw = input ?? "";
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const base: Decoded = {
    raw,
    valid: false,
    partial: false,
    country: null,
    countryName: null,
    flag: null,
    region: null,
    regionName: null,
    number: null,
    suffix: null,
    canonical: null,
    lab: null,
  };
  if (compact.length < 2) return base;

  let rest = compact;

  // 1. country code (leading 2 letters)
  let country: string | null = null;
  const cc = rest.slice(0, 2);
  if (COUNTRIES[cc]) {
    country = cc;
    rest = rest.slice(2);
  }

  // 2. suffix (trailing EG / EWG / EC / CE) — longest first
  let suffix: string | null = null;
  for (const s of SUFFIXES) {
    if (rest.length > s.length && rest.endsWith(s)) {
      suffix = s;
      rest = rest.slice(0, -s.length);
      break;
    }
  }

  // 3. no explicit country but starts with a Bundesland code => assume DE
  if (!country && REGIONS[rest.slice(0, 2)]) {
    country = "DE";
  }

  // 4. Bundesland code (DE only)
  let region: string | null = null;
  if (country === "DE") {
    const rc = rest.slice(0, 2);
    if (REGIONS[rc]) {
      region = rc;
      rest = rest.slice(2);
    }
  }

  // 5. establishment number = remainder
  const number = rest.length ? rest : null;

  const countryName = country ? COUNTRIES[country].name : null;
  const flag = country ? COUNTRIES[country].flag : null;
  const regionName = region ? REGIONS[region].name : null;

  const canonical = country
    ? [country, region, number, suffix].filter(Boolean).join(" ")
    : null;

  const lab = number
    ? LABS.find(
        (l) =>
          !!l.code &&
          l.country === country &&
          (l.region || "") === (region || "") &&
          !!l.number &&
          stripZeros(l.number) === stripZeros(number),
      ) ?? null
    : null;

  return {
    raw,
    valid: !!(country && number),
    partial: !!country,
    country,
    countryName,
    flag,
    region,
    regionName,
    number,
    suffix,
    canonical,
    lab,
  };
}

/** Deep-link zur Community-Datenbank, um beliebige Codes zu verifizieren. */
export function supermarktcheckUrl(d: Decoded): string | null {
  if (!d.country || !d.number) return null;
  const parts = [d.country, d.region, d.number, d.suffix].filter(Boolean);
  return (
    "https://www.supermarktcheck.de/no-name-hersteller/" + parts.join("-")
  );
}

export function mapUrl(geo: [number, number]): string {
  const [lat, lng] = geo;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}`;
}

export function searchLabs(q: string): Lab[] {
  const t = q.trim().toLowerCase();
  if (!t) return LABS;
  return LABS.filter((l) =>
    [l.company, l.group, l.city, l.code, l.country, l.region, ...l.types]
      .filter(Boolean)
      .some((f) => String(f).toLowerCase().includes(t)),
  );
}

export function searchBrands(q: string): Brand[] {
  const t = q.trim().toLowerCase();
  if (!t) return BRANDS;
  return BRANDS.filter((b) =>
    [b.name, b.owner, b.retailer, b.category]
      .filter(Boolean)
      .some((f) => String(f).toLowerCase().includes(t)),
  );
}
