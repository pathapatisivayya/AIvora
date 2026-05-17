import { motion } from "framer-motion";
import GlowButton from "../ui/GlowButton.jsx";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

const line1 = "Transforming Ideas Into";

export default function HeroHeadline() {
  const reduced = usePrefersReducedMotion();
  const words = line1.split(" ");

  return (
    <div className="relative z-10 flex-1">
      <div
        className="pointer-events-none absolute -left-10 top-1/2 h-[120%] w-[85%] -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/25 via-violet-600/20 to-transparent blur-[80px]"
        aria-hidden
      />

      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.35em" }}
        animate={{ opacity: 1, letterSpacing: "0.2em" }}
        transition={{ duration: reduced ? 0 : 0.9 }}
        className="relative text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/95 sm:text-sm"
      >
        Aivora Solutions
      </motion.p>

      <h1 className="relative mt-5 font-display text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem]">
        <span className="flex flex-wrap gap-x-2 gap-y-1">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.04 + i * 0.035,
                duration: reduced ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {w}
            </motion.span>
          ))}
        </span>
        <motion.span
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.35, duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 block bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(34,211,238,0.35)]"
        >
          Intelligent Digital Solutions
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.55 }}
        className="relative z-10 mt-7 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg"
      >
        Aivora Solutions delivers modern AI-powered software solutions, websites, mobile apps, and enterprise systems
        for businesses, schools, hospitals, churches, and government organizations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.62, duration: reduced ? 0 : 0.5 }}
        className="relative mt-10 flex flex-wrap gap-4"
      >
        <GlowButton to="/contact">Get Started</GlowButton>
        <GlowButton to="/services" variant="secondary">
          View Services
        </GlowButton>
      </motion.div>
    </div>
  );
}
