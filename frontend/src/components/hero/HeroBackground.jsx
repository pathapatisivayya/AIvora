import { motion } from "framer-motion";
import NeuralCanvas from "./NeuralCanvas.jsx";
import HeroAtmosphere from "./background/HeroAtmosphere.jsx";
import HeroMouseLight from "./background/HeroMouseLight.jsx";
import HeroGlobeLabels from "./background/HeroGlobeLabels.jsx";
import HeroWebGLScene from "./background/HeroWebGLScene.jsx";
import { useHeroScrollOffset } from "../../hooks/useHeroScrollOffset.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

/**
 * Cinematic AI hero atmosphere — background only.
 * Content/layout unchanged; left scrim preserves text readability.
 */
export default function HeroBackground() {
  const reduced = usePrefersReducedMotion();
  const scrollY = useHeroScrollOffset();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
    >
      {/* Deep space base */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,#0a1628_0%,#020617_45%,#000000_100%)]"
        style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
      />

      {/* WebGL digital globe + background neural network */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${scrollY * 0.45}px, 0) scale(1.02)` }}
      >
        <HeroWebGLScene />
      </div>

      {/* Hex data labels near digital globe */}
      <HeroGlobeLabels scrollY={scrollY} />

      {/* Aurora mesh gradients */}
      <motion.div
        className="absolute -left-[10%] top-[-20%] h-[130%] w-[75%] rounded-full bg-gradient-to-br from-cyan-500/30 via-sky-600/15 to-transparent blur-[110px]"
        animate={
          reduced
            ? {}
            : {
                x: [0, 50, -25, 0],
                y: [0, 35, 15, 0],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `translate3d(0, ${scrollY * 0.25}px, 0)` }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[-10%] h-[95%] w-[65%] rounded-full bg-gradient-to-tl from-cyan-600/20 via-sky-600/10 to-transparent blur-[100px]"
        animate={
          reduced
            ? {}
            : {
                x: [0, -45, 20, 0],
                y: [0, -35, 10, 0],
              }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0)` }}
      />

      {/* Animated tech grid — dual layer */}
      <motion.div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 15%, transparent 72%)",
          transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        }}
      />
      {!reduced && (
        <motion.div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "88px 88px",
            maskImage: "radial-gradient(ellipse 85% 70% at 50% 45%, black 10%, transparent 68%)",
          }}
          animate={{ backgroundPosition: ["0px 0px", "88px 88px"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Floating light orbs */}
      <motion.div
        className="absolute left-[8%] top-[20%] h-80 w-80 rounded-full bg-cyan-400/20 blur-[90px]"
        animate={reduced ? {} : { y: [0, -30, 0], opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[8%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[90px]"
        animate={reduced ? {} : { y: [0, 20, 0], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[48%] h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/20 blur-[80px]"
        animate={reduced ? {} : { opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Stars */}
      {!reduced && (
        <div className="absolute inset-0" style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}>
          {Array.from({ length: 64 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 23.1) % 100}%`,
                width: i % 7 === 0 ? 2 : 1,
                height: i % 7 === 0 ? 2 : 1,
              }}
              animate={{ opacity: [0.1, 0.65, 0.1], y: [0, -14, 0] }}
              transition={{
                duration: 3.5 + (i % 6),
                repeat: Infinity,
                delay: i * 0.06,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* 2D neural network + data pulses */}
      <div style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}>
        <NeuralCanvas className="opacity-95" />
      </div>

      {/* SVG rings, streams, cyber lines */}
      <HeroAtmosphere scrollY={scrollY} />

      {/* Mouse-reactive light */}
      <HeroMouseLight />

      {/* Readability: darken sides, globe visible in center */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.92)_0%,rgba(3,7,18,0.55)_20%,rgba(3,7,18,0.12)_50%,rgba(3,7,18,0.5)_80%,rgba(3,7,18,0.9)_100%)]" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_45%,transparent_20%,rgba(3,7,18,0.78)_100%)]" />

      {/* Subtle top shine — glass reflection */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent" />
    </div>
  );
}
