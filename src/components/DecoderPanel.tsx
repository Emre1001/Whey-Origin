import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OvalStamp from "./OvalStamp";
import LabCard from "./LabCard";
import { decode, supermarktcheckUrl } from "../lib/parser";
import { BRANDS } from "../data/brands";

interface Props {
  code: string;
  setCode: (c: string) => void;
  fav: { has: (c: string) => boolean; toggle: (c: string) => void };
  history: { hist: string[]; push: (c: string) => void; clear: () => void };
}

const EXAMPLES = ["DE SN 016 EG", "DE BY 718 EG", "DE BY 77723 EG"];

function Part({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-white/[0.02] px-3 py-2">
      <span className="text-[10px] uppercase tracking-wider text-fog">{label}</span>
      <span className={`font-mono text-lg font-bold ${tone}`}>{value || "—"}</span>
    </div>
  );
}

export default function DecoderPanel({ code, setCode, fav, history }: Props) {
  const d = useMemo(() => decode(code), [code]);
  const brands = d.lab ? BRANDS.filter((b) => b.labId === d.lab!.id) : [];
  const scUrl = supermarktcheckUrl(d);

  useEffect(() => {
    if (d.valid && d.canonical) {
      history.push(d.canonical);
      const slug = d.canonical.replace(/\s+/g, "-");
      if (location.hash.slice(1) !== slug) {
        window.history.replaceState(null, "", `#${slug}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.canonical, d.valid]);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {/* stamp */}
      <div className="order-1 flex flex-col items-center gap-6">
        <OvalStamp
          country={d.country}
          region={d.region}
          number={d.number}
          suffix={d.suffix}
          resolved={!!d.lab}
        />
        <div className="grid grid-cols-4 gap-2">
          <Part label="Land" value={d.country ?? ""} tone="text-acid" />
          <Part label="Region" value={d.region ?? "—"} tone="text-cyan" />
          <Part label="Nummer" value={d.number ?? ""} tone="text-white" />
          <Part label="Suffix" value={d.suffix ?? ""} tone="text-acid" />
        </div>
      </div>

      {/* input + result */}
      <div className="order-2 flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-fog">
            Ovalen Code eintippen
          </label>
          <div className="relative">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="z.B. DE SN 016 EG"
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded-xl border border-line bg-black/40 px-4 py-4 font-mono text-xl font-bold uppercase tracking-wider text-white outline-none transition focus:border-acid focus:ring-2 focus:ring-acid/40"
            />
            {code && (
              <button
                onClick={() => setCode("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-white"
                aria-label="Leeren"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setCode(ex)}
                className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-slate-300 transition hover:border-acid hover:text-acid"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* decode line */}
        {d.country && (
          <motion.p
            key={d.canonical}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-300"
          >
            <span className="text-xl">{d.flag}</span>{" "}
            <b className="text-white">{d.countryName}</b>
            {d.regionName && (
              <>
                {" · "}
                <b className="text-cyan">{d.regionName}</b>
              </>
            )}
            {d.number && (
              <>
                {" · Betrieb "}
                <b className="font-mono text-acid">{d.number}</b>
              </>
            )}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {d.lab ? (
            <motion.div
              key="hit"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-acid">
                <span className="text-lg">✓</span>
                <span className="font-semibold">Werk identifiziert</span>
              </div>
              <LabCard lab={d.lab} fav={fav} />
              {brands.length > 0 && (
                <div className="glass rounded-2xl p-4">
                  <p className="mb-2 text-sm font-semibold text-white">
                    Marken aus diesem Werk
                  </p>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {brands.map((b) => (
                      <li key={b.id} className="flex items-center gap-2 text-slate-300">
                        <span className="text-acid">▹</span>
                        {b.name}
                        {b.retailer && (
                          <span className="rounded bg-violet/15 px-1.5 text-[11px] text-violet">
                            {b.retailer}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : d.valid ? (
            <motion.div
              key="miss"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-5"
            >
              <p className="font-semibold text-amber">
                Noch nicht in der Datenbank
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Code-Format gültig, aber dieses Werk ist hier (noch) nicht
                erfasst. In der Community-Datenbank nachschlagen:
              </p>
              {scUrl && (
                <a
                  href={scUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-acid mt-3 inline-block rounded-lg bg-acid px-4 py-2 text-sm font-bold text-ink transition hover:brightness-110"
                >
                  Auf supermarktcheck.de prüfen →
                </a>
              )}
            </motion.div>
          ) : code.trim() ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-fog"
            >
              Weiter tippen… Format: <span className="font-mono">Land</span> +{" "}
              <span className="font-mono">Bundesland</span> +{" "}
              <span className="font-mono">Nummer</span> +{" "}
              <span className="font-mono">EG</span>
            </motion.p>
          ) : null}
        </AnimatePresence>

        {/* history */}
        {history.hist.length > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-fog">
                Verlauf
              </span>
              <button
                onClick={history.clear}
                className="text-xs text-fog hover:text-rose"
              >
                löschen
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.hist.map((h) => (
                <button
                  key={h}
                  onClick={() => setCode(h)}
                  className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-slate-300 transition hover:border-cyan hover:text-cyan"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
