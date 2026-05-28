import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background";
import Tabs, { type TabDef } from "./components/Tabs";
import DecoderPanel from "./components/DecoderPanel";
import ExplorerPanel from "./components/ExplorerPanel";
import BrandsPanel from "./components/BrandsPanel";
import ProteinPanel from "./components/ProteinPanel";
import KnowledgePanel from "./components/KnowledgePanel";
import { useFavorites, useHistory } from "./lib/storage";
import type { Lab } from "./data/types";

type TabId = "decode" | "labs" | "brands" | "powder" | "info";

const TABS: TabDef[] = [
  { id: "decode", label: "Decoder", icon: "🔍" },
  { id: "labs", label: "Hersteller", icon: "🏭" },
  { id: "brands", label: "Marken", icon: "🏷️" },
  { id: "powder", label: "Protein", icon: "🏋️" },
  { id: "info", label: "Wissen", icon: "📖" },
];

function initialCode(): string {
  const h = decodeURIComponent(location.hash.slice(1)).replace(/-/g, " ").trim();
  return /^[A-Z]{2}/i.test(h) ? h.toUpperCase() : "";
}

export default function App() {
  const [tab, setTab] = useState<TabId>("decode");
  const [code, setCode] = useState(initialCode);
  const [focusLabId, setFocusLabId] = useState<string | null>(null);

  const fav = useFavorites();
  const history = useHistory();

  const showLabBrands = (lab: Lab) => {
    setFocusLabId(lab.id);
    setTab("brands");
  };
  const showInDecoder = (lab: Lab) => {
    if (lab.code) setCode(lab.code);
    setTab("decode");
  };

  return (
    <>
      <Background />
      <div className="grain-overlay" aria-hidden />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-20 pt-8 sm:px-6">
        {/* header */}
        <header className="flex flex-col items-center gap-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-acid">
              EU · Oval · Decoder
            </span>
            <h1 className="text-shimmer text-4xl font-bold tracking-tight sm:text-6xl">
              WHEY ORIGIN
            </h1>
            <p className="max-w-xl text-sm text-slate-400 sm:text-base">
              Entschlüssle den ovalen EU-Code auf deinem Molkeneiweiß und finde
              heraus, aus welchem Werk dein Whey wirklich kommt.
            </p>
          </motion.div>

          <Tabs
            tabs={TABS}
            active={tab}
            onChange={(id) => {
              setTab(id as TabId);
              if (id !== "brands") setFocusLabId(null);
            }}
          />
        </header>

        {/* panels */}
        <main className="mt-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "decode" && (
                <DecoderPanel
                  code={code}
                  setCode={setCode}
                  fav={fav}
                  history={history}
                />
              )}
              {tab === "labs" && (
                <ExplorerPanel fav={fav} onSelectLab={showLabBrands} />
              )}
              {tab === "brands" && (
                <BrandsPanel
                  focusLabId={focusLabId}
                  clearFocus={() => setFocusLabId(null)}
                  onShowInDecoder={showInDecoder}
                />
              )}
              {tab === "powder" && (
                <ProteinPanel onShowInDecoder={showInDecoder} />
              )}
              {tab === "info" && <KnowledgePanel />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* footer */}
        <footer className="mt-16 border-t border-line pt-6 text-center text-xs text-fog">
          <p>
            Daten aus öffentlichen Quellen (supermarktcheck.de, das-ist-drin.de,
            Herstellerangaben). Ovalcode = letzter Verarbeiter, nicht zwingend
            die Rohstoffquelle. Ohne Gewähr.
          </p>
          <p className="mt-2 font-mono text-[11px] text-slate-600">
            WHEY ORIGIN · gebaut mit React + Vite + Framer Motion
          </p>
        </footer>
      </div>
    </>
  );
}
