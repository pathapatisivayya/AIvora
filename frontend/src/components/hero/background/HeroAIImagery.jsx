import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";

const LAYERS = [
  {
    src: "/hero/ai-neural-mesh.svg",
    className:
      "absolute -right-[8%] top-[2%] w-[min(85vw,720px)] max-w-[720px] mix-blend-screen opacity-[0.55] md:opacity-[0.62]",
    parallax: 0.14,
    animate: { scale: [1, 1.04, 1], x: [0, 12, 0], y: [0, -8, 0] },
    duration: 18,
  },
  {
    src: "/hero/ai-hologram-stack.svg",
    className:
      "absolute right-[2%] top-[18%] w-[min(70vw,560px)] max-w-[560px] mix-blend-lighten opacity-[0.38] md:opacity-[0.45]",
    parallax: 0.22,
    animate: { scale: [1, 1.03, 1], x: [0, -10, 0], y: [0, 14, 0] },
    duration: 22,
  },
  {
    src: "/hero/ai-data-streams.svg",
    className:
      "absolute -right-[5%] bottom-[8%] w-[min(95vw,900px)] max-w-[900px] mix-blend-screen opacity-[0.32] md:opacity-[0.4]",
    parallax: 0.1,
    animate: { x: [0, 24, 0], opacity: [0.3, 0.45, 0.3] },
    duration: 16,
  },
];

/**
 * Layered AI imagery — neural mesh, hologram UI, data streams.
 * Background only; no eye motif.
 */
export default function HeroAIImagery({ scrollY = 0 }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 85% 75% at 68% 48%, black 25%, transparent 78%)",
      }}
    >
      {LAYERS.map((layer, i) => (
        <motion.img
          key={layer.src}
          src={layer.src}
          alt=""
          draggable={false}
          className={layer.className}
          style={{
            transform: `translate3d(0, ${scrollY * layer.parallax}px, 0)`,
          }}
          animate={reduced ? {} : layer.animate}
          transition={{
            duration: layer.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Soft AI core bloom behind dashboard */}
      <motion.div
        className="absolute right-[10%] top-[28%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-500/10 to-violet-600/20 blur-[90px]"
        animate={reduced ? {} : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)` }}
      />
    </motion.div>
  );
}
