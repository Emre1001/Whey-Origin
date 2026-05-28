import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_BY_ID } from "../data/labs";
import { COUNTRIES } from "../data/countries";
import { searchBrands } from "../lib/parser";
import type { Brand, Lab } from "../data/types";

interface Props {
  /** Optional: only show brands of this lab (set from Explorer "Marken →"). */
  focusLabId?: string | null;
  clearFocus: () => void;
  /** Jump to the decoder with this lab's oval code prefilled. */
  onShowInDecoder: (lab: Lab) => void;
}

type FilterKey = "Alle" | "Eigenmarken" | "Markenware" | "Supplement";

const FILTERS: Record<FilterKey, (b: Brand) => boolean> = {
  Alle: () => true,
  Eigenmarken: (b) => b.privateLabel,
  Markenware: (b) => !b.privateLabel,
  Supplement: (b) =>
    /whey|casein|protein/i.test(b.category) && !/drink|milch/i.test(b.category),
};

function BrandCard({
  brand,
  onShowInDecoder,
}: {
  brand: Brand;
  onShowInDecoder: (lab: Lab) => void;
}) {
  const lab = brand.labId ? LAB_BY_ID[brand.labId] : null;
  const country = lab ? COUNTRIES[lab.country] : null;

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
        <div>
          <p className="text-sm font-bold leading-tight text-white">
            {brand.name}
          </p>
          {brand.owner && <p className="text-xs text-fog">{brand.owner}</p>}
        </div>
        {brand.verified ? (
          <span className="shrink-0 rounded-full bg-acid/15 px-2 py-0.5 text-[11px] font-semibold text-acid">
            ✓ belegt
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-semibold text-amber">
            ~ Recherche
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {brand.privateLabel && brand.retailer && (
          <span className="rounded-full bg-violet/15 px-2 py-0.5 text-[11px] font-semibold text-violet">
            🏷️ {brand.retailer}
          </span>
        )}
        <span className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300">
          {brand.category}
        </span>
      </div>

      {/* manufacturer link */}
      {lab ? (
        <div className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-fog">
            Hergestellt bei
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <span aria-hidden>{country?.flag ?? "🏭"}</span>
            {lab.company}
          </p>
          {lab.code && (
            <code className="mt-1 inline-block rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs font-bold text-acid">
              {lab.code}
            </code>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-line bg-white/[0.02] px-3 py-2 text-xs text-fog">
          Abpacker/Werk noch nicht zugeordnet — Ovalcode auf der Packung prüfen.
        </p>
      )}

      {brand.note && (
        <p className="text-xs leading-relaxed text-slate-400">{brand.note}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1 text-xs">
        {brand.sources?.[0] && (
          <a
            href={brand.sources[0]}
            target="_blank"
            rel="noreferrer"
            className="text-cyan hover:underline"
          >
            🔗 Quelle
          </a>
        )}
        {lab?.code && (
          <button
            onClick={() => onShowInDecoder(lab)}
            className="ml-auto font-semibold text-acid hover:underline"
          >
            Im Decoder zeigen →
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function BrandsPanel({
  focusLabId,
  clearFocus,
  onShowInDecoder,
}: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("Alle");

  const focusLab = focusLabId ? LAB_BY_ID[focusLabId] : null;

  const results = useMemo(() => {
    let r = searchBrands(q).filter(FILTERS[filter]);
    if (focusLabId) r = r.filter((b) => b.labId === focusLabId);
    return r;
  }, [q, filter, focusLabId]);

  return (
    <div className="flex flex-col gap-6">
      {focusLab && (
        <div className="glass flex flex-wrap items-center gap-3 rounded-xl px-4 py-3">
          <span className="text-sm text-slate-300">
            Gefiltert auf Werk:{" "}
            <b className="text-white">{focusLab.company}</b>
            {focusLab.code && (
              <code className="ml-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-acid">
                {focusLab.code}
              </code>
            )}
          </span>
          <button
            onClick={clearFocus}
            className="ml-auto rounded-full border border-line px-3 py-1 text-xs text-fog transition hover:border-rose hover:text-rose"
          >
            ✕ Filter aufheben
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche Marke, Eigentümer, Kette…"
          className="w-full rounded-xl border border-line bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-acid focus:ring-2 focus:ring-acid/40"
        />
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(FILTERS) as FilterKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === k
                  ? "bg-acid text-ink"
                  : "border border-line bg-white/[0.03] text-slate-300 hover:text-white"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-fog">
        {results.length} {results.length === 1 ? "Marke" : "Marken"}
      </h3>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((b) => (
            <BrandCard
              key={b.id}
              brand={b}
              onShowInDecoder={onShowInDecoder}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <p className="py-10 text-center text-fog">Keine Treffer.</p>
      )}
    </div>
  );
}
