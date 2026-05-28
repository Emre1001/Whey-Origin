import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_BY_ID } from "../data/labs";
import { COUNTRIES } from "../data/countries";
import { proteinPowders, brandHalal, HALAL_META } from "../lib/parser";
import type { Brand, Lab } from "../data/types";

interface Props {
  /** Jump to the decoder with this lab's oval code prefilled. */
  onShowInDecoder: (lab: Lab) => void;
}

function PowderCard({
  brand,
  onShowInDecoder,
}: {
  brand: Brand;
  onShowInDecoder: (lab: Lab) => void;
}) {
  const lab = brand.labId ? LAB_BY_ID[brand.labId] : null;
  const country = lab ? COUNTRIES[lab.country] : null;
  const hal = HALAL_META[brandHalal(brand)];

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
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${hal.cls}`}
          title={hal.label}
        >
          {hal.icon} {hal.short}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300">
          {brand.category}
        </span>
        {brand.privateLabel && brand.retailer && (
          <span className="rounded-full bg-violet/15 px-2 py-0.5 text-[11px] font-semibold text-violet">
            🏷️ {brand.retailer}
          </span>
        )}
      </div>

      {/* halal certificate box */}
      {brand.halal === "certified" && brand.halalCert && (
        <div className="rounded-xl border border-acid/30 bg-acid/[0.06] px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-acid">
            ☪ Halal-Zertifikat
          </p>
          <p className="text-sm font-semibold text-white">{brand.halalCert}</p>
        </div>
      )}

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
          Abpacker/Werk noch nicht zugeordnet — Ovalcode auf der Dose prüfen.
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

export default function ProteinPanel({ onShowInDecoder }: Props) {
  const [q, setQ] = useState("");
  const [onlyCertified, setOnlyCertified] = useState(false);

  const results = useMemo(() => {
    let r = proteinPowders(q);
    if (onlyCertified) r = r.filter((b) => b.halal === "certified");
    return r;
  }, [q, onlyCertified]);

  const certCount = useMemo(
    () => proteinPowders().filter((b) => b.halal === "certified").length,
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* hero banner */}
      <div className="glass relative overflow-hidden rounded-2xl p-6">
        <div className="aurora-blob -left-10 -top-10 h-40 w-40 bg-acid/30" aria-hidden />
        <div className="relative flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-acid/20 px-3 py-1 text-sm font-bold text-acid">
              ☪ 100 % Halal
            </span>
            <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-300">
              {results.length} Proteinpulver
            </span>
            <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-300">
              {certCount} zertifiziert
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Halal-Proteinpulver-Abteil
          </h2>
          <p className="max-w-2xl text-sm text-slate-400">
            Molkenprotein wird aus <b className="text-white">Milch</b> gewonnen
            und ist damit <b className="text-acid">halal</b>. Hier stehen alle
            Whey-/Casein-Pulver — keine veganen Produkte. Pulver mit offiziellem{" "}
            <b className="text-white">Halal-Zertifikat</b> sind extra
            gekennzeichnet.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche Pulver, Marke, Hersteller…"
          className="w-full rounded-xl border border-line bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-acid focus:ring-2 focus:ring-acid/40"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOnlyCertified((v) => !v)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              onlyCertified
                ? "bg-acid text-ink"
                : "border border-line bg-white/[0.03] text-slate-300 hover:text-white"
            }`}
          >
            ☪ nur zertifiziert
          </button>
        </div>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((b) => (
            <PowderCard key={b.id} brand={b} onShowInDecoder={onShowInDecoder} />
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <p className="py-10 text-center text-fog">Keine Treffer.</p>
      )}

      <p className="rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-fog">
        <b className="text-amber">Hinweis:</b> Reines Whey aus Milch ist halal.
        Haram wird ein Endprodukt nur durch zugesetzte Schweine-Gelatine (E441)
        oder Alkohol als Aroma-Trägerstoff. Im Zweifel die Zutatenliste und das
        Zertifikat auf der echten Dose prüfen.
      </p>
    </div>
  );
}
