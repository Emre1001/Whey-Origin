import { motion } from "framer-motion";

export interface TabDef {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="glass inline-flex gap-1 rounded-full p-1">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
              on ? "text-ink" : "text-fog hover:text-white"
            }`}
          >
            {on && (
              <motion.span
                layoutId="tabpill"
                className="absolute inset-0 rounded-full bg-acid"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span aria-hidden>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
