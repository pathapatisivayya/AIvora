import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";

/** CSS/SVG atmosphere — rings, waves, geometric accents (background only). */
export default function HeroAtmosphere({ scrollY = 0 }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return null;

  const parallax = scrollY * 0.15;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
    >
      {/* Holographic rings */}
      <motion.div
        className="absolute left-1/2 top-[16%] h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-cyan-400/15"
        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
        transition={{ rotate: { duration: 48, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity } }}
      />
      <motion.div
        className="absolute left-1/2 top-[22%] h-[300px] w-[300px] -translate-x-1/2 rounded-full border border-violet-400/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-[26%] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-dashed border-sky-400/10"
        animate={{ rotate: 360, opacity: [0.3, 0.55, 0.3] }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          opacity: { duration: 6, repeat: Infinity },
        }}
      />

      {/* Floating geometric shapes */}
      {[
        { left: "46%", top: "22%", size: 48, delay: 0 },
        { left: "54%", top: "55%", size: 32, delay: 1.2 },
        { left: "50%", top: "70%", size: 40, delay: 0.6 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rotate-45 border border-cyan-400/20 bg-cyan-400/5"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.45, 0.2], rotate: [45, 90, 45] }}
          transition={{ duration: 9 + i, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Energy wave at bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-48 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(34,211,238,0.25), transparent 70%)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.25], scaleY: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cyber lines SVG */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.2]" preserveAspectRatio="none" viewBox="0 0 1440 800">
        <defs>
          <linearGradient id="hero-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0)" />
          </linearGradient>
        </defs>
        {[
          "M0 180 H400 L480 120 H900 L980 200 H1440",
          "M0 520 H250 L340 460 H700 L780 540 H1200 L1280 480 H1440",
          "M1440 300 H1000 L920 360 H500 L420 280 H0",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#hero-line-grad)"
            strokeWidth="1"
            strokeDasharray="4 12"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: [0.15, 0.4, 0.15] }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.5 },
              opacity: { duration: 5 + i, repeat: Infinity },
            }}
          />
        ))}
      </svg>

      {/* Vertical data streams */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent"
          style={{ left: `${15 + i * 14}%`, height: "35%" }}
          animate={{ y: ["-100%", "110%"], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
