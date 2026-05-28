import { useState } from "react";
import { motion } from "framer-motion";
import OvalStamp from "./OvalStamp";
import { COUNTRIES } from "../data/countries";
import { REGIONS } from "../data/regions";

const ANATOMY = [
  {
    part: "Land",
    example: "DE",
    tone: "text-acid",
    text: "ISO-Ländercode des Betriebs, der das Produkt zuletzt verarbeitet/abgepackt hat.",
  },
  {
    part: "Bundesland",
    example: "SN",
    tone: "text-cyan",
    text: "Nur Deutschland: Kürzel des Bundeslands (SN = Sachsen).",
  },
  {
    part: "Betriebsnummer",
    example: "016",
    tone: "text-white",
    text: "Eindeutige Zulassungsnummer des Betriebs in diesem Bundesland.",
  },
  {
    part: "Suffix",
    example: "EG",
    tone: "text-acid",
    text: "EG / EWG / EC / CE = im EU-Binnenmarkt zugelassen.",
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-acid">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function KnowledgePanel() {
  const [showCountries, setShowCountries] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* anatomy */}
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="flex justify-center">
          <OvalStamp
            country="DE"
            region="SN"
            number="016"
            suffix="EG"
            resolved
            size={300}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-white">
            So liest du den ovalen Stempel
          </h2>
          <p className="text-sm text-slate-400">
            Das ovale Identitätskennzeichen sitzt auf fast jedem tierischen
            EU-Lebensmittel — auch auf deiner Whey-Dose. Es verrät den{" "}
            <b className="text-white">zuletzt verarbeitenden Betrieb</b>.
          </p>
          <div className="flex flex-col gap-2">
            {ANATOMY.map((a) => (
              <motion.div
                key={a.part}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-3 py-2"
              >
                <code
                  className={`w-14 shrink-0 text-center font-mono text-lg font-bold ${a.tone}`}
                >
                  {a.example}
                </code>
                <div>
                  <p className="text-sm font-semibold text-white">{a.part}</p>
                  <p className="text-xs text-fog">{a.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* disclaimer */}
      <Section title="Wichtig: Code ≠ Rohstoffquelle">
        <p className="text-sm leading-relaxed text-slate-300">
          Der Ovalcode zeigt den{" "}
          <b className="text-amber">letzten Verarbeiter/Abfüller</b> — nicht
          zwingend, woher das Molkenprotein ursprünglich stammt. Whey-Rohstoff
          (WPC/WPI) wird global gehandelt (z.B. Glanbia, Arla, Fonterra) und in
          DE/EU-Werken weiterverarbeitet. Der Code ist trotzdem der beste
          öffentliche Hinweis, in welchem Werk dein Produkt tatsächlich vom Band
          lief.
        </p>
      </Section>

      {/* halal */}
      <Section title="☪ Halal — Molkenprotein aus Milch ist halal">
        <p className="text-sm leading-relaxed text-slate-300">
          Molkenprotein (Whey) wird aus <b className="text-white">Milch</b>{" "}
          gewonnen — und Milch ist{" "}
          <b className="text-acid">halal</b>. Auch das bei der Käse-/Molke-
          Herstellung verwendete <b className="text-white">Lab (Rennet)</b> gilt
          nach Mehrheitsmeinung der Gelehrten als halal, unabhängig von der
          Quelle. Reines Whey-Pulver ist damit erlaubt.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          <b className="text-amber">Haram wird es nur</b>, wenn dem{" "}
          <b className="text-white">Endprodukt</b> klar verbotene Zutaten
          zugesetzt sind:
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
          <li className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
            <b className="text-amber">Schweine-Gelatine</b> (E441) — v.a. in
            Kapseln oder Gummi-Form.
          </li>
          <li className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
            <b className="text-amber">Alkohol</b> als Trägerstoff in manchen
            Aromen.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Klassisches Whey-Pulver aus Milch ist also{" "}
          <b className="text-acid">halal</b>. Im Zweifel die Zutatenliste auf
          die zwei Punkte oben checken oder ein Halal-Zertifikat suchen.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-acid/15 px-2 py-0.5 font-semibold text-acid">
            ☪ Halal = Molkenprotein aus Milch
          </span>
          <span className="rounded-full bg-acid/25 px-2 py-0.5 font-semibold text-acid">
            ☪ Halal ✓ = zertifiziert
          </span>
        </div>
      </Section>

      {/* region table */}
      <Section title="Deutsche Bundesland-Kürzel">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {Object.entries(REGIONS).map(([code, r]) => (
            <div
              key={code}
              className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5"
            >
              <code className="font-mono text-sm font-bold text-cyan">
                {code}
              </code>
              <span className="truncate text-xs text-slate-300">{r.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* country table (collapsible) */}
      <Section title={`Ländercodes (${Object.keys(COUNTRIES).length})`}>
        <button
          onClick={() => setShowCountries((v) => !v)}
          className="mb-3 rounded-full border border-line px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-acid hover:text-acid"
        >
          {showCountries ? "▲ einklappen" : "▼ alle anzeigen"}
        </button>
        {showCountries && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-1.5 overflow-hidden sm:grid-cols-3 lg:grid-cols-4"
          >
            {Object.entries(COUNTRIES).map(([code, c]) => (
              <div
                key={code + c.name}
                className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5"
              >
                <span aria-hidden>{c.flag}</span>
                <code className="font-mono text-sm font-bold text-acid">
                  {code}
                </code>
                <span className="truncate text-xs text-slate-300">
                  {c.name}
                </span>
                {!c.eu && (
                  <span className="ml-auto rounded bg-amber/15 px-1 text-[9px] font-semibold text-amber">
                    Nicht-EU
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </Section>

      {/* sources */}
      <Section title="Quellen & Weiterführendes">
        <ul className="flex flex-col gap-1.5 text-sm">
          {[
            ["supermarktcheck.de — Hersteller-Datenbank", "https://www.supermarktcheck.de/no-name-hersteller"],
            ["das-ist-drin.de — Betriebsnummern", "https://das-ist-drin.de/glossar/betriebsnummern/"],
            ["BVL — Liste zugelassener Betriebe", "https://www.bvl.bund.de/"],
            ["EU-Verordnung (EG) Nr. 853/2004", "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32004R0853"],
          ].map(([label, url]) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-cyan hover:underline"
              >
                🔗 {label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
