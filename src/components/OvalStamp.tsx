import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  country?: string | null;
  region?: string | null;
  number?: string | null;
  suffix?: string | null;
  resolved?: boolean; // a matching lab was found
  size?: number;
}

export default function OvalStamp({
  country,
  region,
  number,
  suffix,
  resolved = false,
  size = 340,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), {
    stiffness: 150,
    damping: 15,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), {
    stiffness: 150,
    damping: 15,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["10%", "90%"]);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const ink = resolved ? "#fbbf24" : "#4ade80";
  const top = country || "··";
  const mid = [region, number].filter(Boolean).join(" ") || "·····";
  const bot = suffix || "EG";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ perspective: 1000, width: size, height: size * 0.7 }}
      className="relative mx-auto select-none"
    >
      {/* expanding rings when resolved */}
      {resolved && (
        <>
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber"
            style={{ animation: "pulse-ring 1.8s ease-out infinite" }}
          />
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber"
            style={{ animation: "pulse-ring 1.8s ease-out 0.9s infinite" }}
          />
        </>
      )}

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        <motion.svg
          viewBox="0 0 360 252"
          className="h-full w-full overflow-visible"
          style={{
            filter: `drop-shadow(0 0 18px ${ink}66) drop-shadow(0 18px 30px #000a)`,
          }}
        >
          {/* rotating dashed halo */}
          <motion.ellipse
            cx="180"
            cy="126"
            rx="168"
            ry="116"
            fill="none"
            stroke={ink}
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="2 10"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "180px 126px" }}
          />
          {/* outer solid ring */}
          <ellipse
            cx="180"
            cy="126"
            rx="150"
            ry="98"
            fill="rgba(8,10,18,0.55)"
            stroke={ink}
            strokeWidth="6"
          />
          {/* inner dashed ring */}
          <motion.ellipse
            cx="180"
            cy="126"
            rx="136"
            ry="86"
            fill="none"
            stroke={ink}
            strokeWidth="2"
            strokeDasharray="9 7"
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "180px 126px" }}
          />
          {/* divider lines */}
          <line x1="62" y1="96" x2="298" y2="96" stroke={ink} strokeWidth="2" strokeOpacity="0.6" />
          <line x1="62" y1="156" x2="298" y2="156" stroke={ink} strokeWidth="2" strokeOpacity="0.6" />

          <text
            x="180"
            y="86"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="800"
            fontSize="42"
            fill={ink}
            letterSpacing="4"
          >
            {top}
          </text>
          <text
            x="180"
            y="146"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="800"
            fontSize="34"
            fill="#f1f5f9"
            letterSpacing="3"
          >
            {mid}
          </text>
          <text
            x="180"
            y="196"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="800"
            fontSize="34"
            fill={ink}
            letterSpacing="6"
          >
            {bot}
          </text>
        </motion.svg>

        {/* moving glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.5), transparent 45%)`,
            ),
          }}
        />
      </motion.div>
    </div>
  );
}
