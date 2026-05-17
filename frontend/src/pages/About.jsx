import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AboutHero from "../components/about/AboutHero.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

const CTO_IMAGE = "/team/pathapati-sivaiah-cto.png";

export default function About() {
  const reduced = usePrefersReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-72px" },
    transition: { duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
  };

  const stagger = reduced
    ? {}
    : {
        staggerChildren: 0.08,
        delayChildren: 0.06,
      };

  return (
    <>
      <Helmet>
        <title>About | Aivora Solutions</title>
        <meta
          name="description"
          content="Learn about Aivora Solutions — mission, values, and how we deliver intelligent digital products."
        />
      </Helmet>

      <AboutHero />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel p-6">
            <h2 className="font-display text-xl font-semibold text-white">Mission</h2>
            <p className="mt-3 text-slate-400">
              Accelerate digital maturity with secure, scalable systems that respect users and operators alike.
            </p>
          </div>
          <div className="glass-panel p-6">
            <h2 className="font-display text-xl font-semibold text-white">How we work</h2>
            <p className="mt-3 text-slate-400">
              Discovery workshops, iterative demos, measurable milestones, and documentation your teams can own.
            </p>
          </div>
        </div>

        <motion.section {...fadeUp} className="mt-12">
          <div className="glass-panel relative overflow-hidden p-6 sm:p-8 md:p-10">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/25 via-cyan-400/10 to-transparent blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-violet-500/20 to-transparent blur-3xl"
              aria-hidden
            />

            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">Leadership</p>
            <h2 className="relative mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              People behind the product
            </h2>

            <div className="relative mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-12">
              <motion.div
                className="relative mx-auto w-full max-w-[240px] md:mx-0 md:max-w-none"
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="pointer-events-none absolute inset-6 -z-10 rounded-[1.35rem] bg-gradient-to-tr from-sky-500/35 to-violet-500/25 blur-2xl"
                  aria-hidden
                />
                <div className="rounded-[1.25rem] bg-gradient-to-br from-sky-400 via-cyan-300/70 to-violet-500 p-[3px] shadow-[0_0_40px_-8px_rgba(56,189,248,0.45)]">
                  <div className="overflow-hidden rounded-[1.05rem] bg-aivora-950 ring-1 ring-white/10">
                    <img
                      src={CTO_IMAGE}
                      alt="Pathapati Sivaiah, Chief Technology Officer at Aivora Solutions"
                      width={520}
                      height={650}
                      className="aspect-[4/5] w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                {!reduced && (
                  <motion.div
                    className="pointer-events-none absolute -inset-1 -z-20 rounded-[1.4rem] opacity-60"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                    aria-hidden
                  />
                )}
              </motion.div>

              <motion.div
                className="min-w-0"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  show: { transition: stagger },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 12 },
                    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.45 } },
                  }}
                >
                  <p className="text-lg text-slate-200">
                    <span className="font-semibold text-white">Pathapati Sivaiah</span>
                    <span className="text-slate-500"> · </span>
                    <span className="text-gradient font-semibold">CTO</span>
                  </p>
                  <p className="mt-4 text-slate-400 leading-relaxed">
                    Technical direction for architecture, delivery, and AI-enabled products — from Django and FastAPI
                    services to polished React experiences.
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {["Agentic AI", "Django & DRF", "FastAPI", "React"].map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
