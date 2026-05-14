import { motion } from "framer-motion";
import NeuralCanvas from "./NeuralCanvas.jsx";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

/** Layered aurora, grid, orbs, subtle stars, neural canvas. */
export default function HeroBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora washes */}
      <motion.div
        className="absolute -left-1/4 top-0 h-[120%] w-[70%] rounded-full bg-gradient-to-br from-cyan-500/25 via-violet-600/20 to-transparent blur-[100px]"
        animate={
          reduced
            ? {}
            : {
                x: [0, 40, -20, 0],
                y: [0, 30, 10, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[90%] w-[60%] rounded-full bg-gradient-to-tl from-sky-600/30 via-fuchsia-600/15 to-transparent blur-[90px]"
        animate={
          reduced
            ? {}
            : {
                x: [0, -50, 20, 0],
                y: [0, -40, 0, 0],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Moving perspective grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.09) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />
      {!reduced && (
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "96px 96px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, black 10%, transparent 70%)",
          }}
          animate={{ backgroundPosition: ["0px 0px", "96px 96px"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Floating orbs */}
      <motion.div
        className="absolute left-[12%] top-[25%] h-72 w-72 rounded-full bg-sky-500/15 blur-[80px]"
        animate={reduced ? {} : { y: [0, -25, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[8%] h-64 w-64 rounded-full bg-violet-500/20 blur-[70px]"
        animate={reduced ? {} : { y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Drifting stars */}
      {!reduced && (
        <div className="absolute inset-0">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${(i * 17.3) % 100}%`,
                top: `${(i * 31.7) % 100}%`,
                opacity: 0.15 + (i % 5) * 0.08,
              }}
              animate={{ opacity: [0.15, 0.55, 0.15], y: [0, -12, 0] }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Neural network canvas (interactive) */}
      <NeuralCanvas />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_45%,transparent_20%,rgba(3,7,18,0.75)_100%)]"
        aria-hidden
      />
    </div>
  );
}
