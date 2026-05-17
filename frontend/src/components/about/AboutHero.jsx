import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

const ABOUT_HERO_IMAGE = "/about/about-hero-bg.jpg";

/**
 * CoRE-AI–style About intro: full-width washed background image + left-aligned copy.
 */
export default function AboutHero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={ABOUT_HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover object-[72%_center]"
          loading="eager"
          decoding="async"
        />
        {/* High-key wash — keeps text readable like core-ai.in/about */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.h1
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.55 }}
          className="max-w-2xl font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]"
        >
          About Aivora Solutions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.1, duration: reduced ? 0 : 0.55 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg"
        >
          We are a product-minded engineering partner for organizations that need dependable software — from
          AI-assisted workflows to citizen-facing portals. Our teams blend UX craft with robust backends so launches
          feel inevitable, not improvised.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.18, duration: reduced ? 0 : 0.55 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
        >
          We partner with businesses, schools, hospitals, churches, and government teams to deliver secure,
          scalable systems that respect users and operators alike.
        </motion.p>
      </div>
    </section>
  );
}
