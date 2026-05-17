import { motion } from "framer-motion";
import { useMemo } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";

function hexLabel(seed) {
  const n = (0x08a89458 + seed * 0x1f3a7) >>> 0;
  return `0x${n.toString(16).toUpperCase().slice(0, 8)}`;
}

const POSITIONS = [
  { left: "42%", top: "20%", delay: 0 },
  { left: "56%", top: "28%", delay: 0.4 },
  { left: "38%", top: "42%", delay: 0.8 },
  { left: "62%", top: "38%", delay: 1.2 },
  { left: "48%", top: "56%", delay: 0.6 },
  { left: "58%", top: "62%", delay: 1.6 },
  { left: "34%", top: "32%", delay: 0.2 },
  { left: "66%", top: "52%", delay: 1.0 },
];

/** Floating hex data strings near the digital globe (background only). */
export default function HeroGlobeLabels({ scrollY = 0 }) {
  const reduced = usePrefersReducedMotion();
  const labels = useMemo(() => POSITIONS.map((p, i) => ({ ...p, text: hexLabel(i) })), []);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 font-mono text-[10px] tracking-wider text-cyan-300/40 md:text-[11px]"
      style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
    >
      {labels.map((l, i) => (
        <motion.span
          key={i}
          className="absolute whitespace-nowrap"
          style={{ left: l.left, top: l.top }}
          animate={{ opacity: [0.15, 0.55, 0.15], y: [0, -6, 0] }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: l.delay,
            ease: "easeInOut",
          }}
        >
          {l.text}
        </motion.span>
      ))}
    </motion.div>
  );
}
