import { motion } from "framer-motion";
import type { Lab } from "../data/types";
import { COUNTRIES } from "../data/countries";
import { REGIONS } from "../data/regions";
import { mapUrl, halalStatus, HALAL_META } from "../lib/parser";

interface Props {
  lab: Lab;
  fav?: { has: (c: string) => boolean; toggle: (c: string) => void };
  onSelect?: (lab: Lab) => void;
}

export default function LabCard({ lab, fav, onSelect }: Props) {
  const country = COUNTRIES[lab.country];
  const region = lab.region ? REGIONS[lab.region] : null;
  const checkUrl = lab.code
    ? "https://www.supermarktcheck.de/no-name-hersteller/" +
      lab.code.replace(/\s+/g, "-")
    : null;
  const favCode = lab.code ?? lab.id;
  const hal = HALAL_META[halalStatus(lab)];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="glass group relative flex flex-col gap-3 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {country?.flag ?? "🏳️"}
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">
              {lab.company}
            </p>
            {lab.group && (
              <p className="text-xs text-fog">{lab.group}</p>
            )}
          </div>
        </div>
        {fav && (
          <button
            onClick={() => fav.toggle(favCode)}
            aria-label="Favorit"
            className="text-lg transition-transform hover:scale-125"
          >
            {fav.has(favCode) ? "★" : "☆"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {lab.code ? (
          <code className="rounded-md bg-black/40 px-2 py-1 font-mono text-sm font-bold text-acid">
            {lab.code}
          </code>
        ) : (
          <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-xs text-fog">
            Betriebsnr. unbestätigt
          </span>
        )}
        {lab.verified ? (
          <span className="rounded-full bg-acid/15 px-2 py-0.5 text-[11px] font-semibold text-acid">
            ✓ Quelle belegt
          </span>
        ) : (
          <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-semibold text-amber">
            ~ Recherche
          </span>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${hal.cls}`}
          title={hal.label}
        >
          {hal.icon} {hal.short}
        </span>
      </div>

      <p className="text-xs text-fog">
        📍 {lab.city}
        {region ? ` · ${region.name}` : ""}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {lab.types.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300"
          >
            {t}
          </span>
        ))}
      </div>

      {lab.note && (
        <p className="text-xs leading-relaxed text-slate-400">{lab.note}</p>
      )}

      {lab.halalNote && (
        <p className="rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5 text-xs leading-relaxed text-slate-300">
          <span className="font-semibold text-acid">☪ Halal:</span>{" "}
          {lab.halalNote}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-3 pt-1 text-xs">
        {lab.geo && (
          <a
            href={mapUrl(lab.geo)}
            target="_blank"
            rel="noreferrer"
            className="text-cyan hover:underline"
          >
            🗺️ Karte
          </a>
        )}
        {checkUrl && (
          <a
            href={checkUrl}
            target="_blank"
            rel="noreferrer"
            className="text-cyan hover:underline"
          >
            🔎 Prüfen
          </a>
        )}
        {lab.sources[0] && (
          <a
            href={lab.sources[0]}
            target="_blank"
            rel="noreferrer"
            className="text-cyan hover:underline"
          >
            🔗 Quelle
          </a>
        )}
        {onSelect && (
          <button
            onClick={() => onSelect(lab)}
            className="ml-auto font-semibold text-acid hover:underline"
          >
            Marken →
          </button>
        )}
      </div>
    </motion.div>
  );
}
