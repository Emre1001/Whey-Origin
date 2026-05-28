import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LabCard from "./LabCard";
import { searchLabs } from "../lib/parser";
import { LABS } from "../data/labs";
import type { Lab } from "../data/types";

interface Props {
  fav: { favs: string[]; has: (c: string) => boolean; toggle: (c: string) => void };
  onSelectLab: (lab: Lab) => void;
}

type FilterKey =
  | "Alle"
  | "Molkerei"
  | "Whey"
  | "Abfüller"
  | "Handelsmarken"
  | "Supplement"
  | "International";

const FILTERS: Record<FilterKey, (l: Lab) => boolean> = {
  Alle: () => true,
  Molkerei: (l) => l.types.some((t) => t.includes("Molkerei")),
  Whey: (l) => l.types.some((t) => t.includes("Whey") || t.includes("WPC")),
  Abfüller: (l) => l.types.some((t) => t.includes("Abfüller")),
  Handelsmarken: (l) => l.types.some((t) => t.includes("Handelsmarken")),
  Supplement: (l) => l.types.some((t) => t.includes("Supplement")),
  International: (l) => l.country !== "DE",
};

export default function ExplorerPanel({ fav, onSelectLab }: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("Alle");
  const [onlyVerified, setOnlyVerified] = useState(false);

  const results = useMemo(() => {
    let r = searchLabs(q).filter(FILTERS[filter]);
    if (onlyVerified) r = r.filter((l) => l.verified);
    return r;
  }, [q, filter, onlyVerified]);

  const favLabs = LABS.filter((l) => fav.has(l.code ?? l.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche Hersteller, Stadt, Code…"
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
          <button
            onClick={() => setOnlyVerified((v) => !v)}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold transition ${
              onlyVerified
                ? "bg-cyan text-ink"
                : "border border-line bg-white/[0.03] text-slate-300 hover:text-white"
            }`}
          >
            ✓ nur belegt
          </button>
        </div>
      </div>

      {favLabs.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-amber">★ Favoriten</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {favLabs.map((l) => (
                <LabCard key={l.id} lab={l} fav={fav} onSelect={onSelectLab} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-fog">
          {results.length} Hersteller
        </h3>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((l) => (
            <LabCard key={l.id} lab={l} fav={fav} onSelect={onSelectLab} />
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <p className="py-10 text-center text-fog">Keine Treffer.</p>
      )}
    </div>
  );
}
