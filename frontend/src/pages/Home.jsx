import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import HeroBackground from "../components/hero/HeroBackground.jsx";
import HeroDashboard from "../components/hero/HeroDashboard.jsx";
import HeroHeadline from "../components/hero/HeroHeadline.jsx";
import ServiceIcon from "../components/services/ServiceIcon.jsx";
import api from "../api/client.js";
import { listFromResponse } from "../utils/apiHelpers.js";
import GlowButton from "../components/ui/GlowButton.jsx";
import {
  fallbackPortfolio,
  fallbackServices,
  techStack,
  whyChoose,
} from "../data/site.js";

const sectionFade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

export default function Home() {
  const [services, setServices] = useState(fallbackServices);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio.slice(0, 4));
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [svc, proj, tst] = await Promise.all([
          api.get("/offerings/services/"),
          api.get("/portfolio/projects/"),
          api.get("/testimonials/testimonials/"),
        ]);
        const svcList = listFromResponse(svc.data);
        const projList = listFromResponse(proj.data);
        const tstList = listFromResponse(tst.data);
        if (!cancelled && svcList.length) setServices(svcList);
        if (!cancelled && projList.length) setPortfolio(projList.slice(0, 4));
        if (!cancelled && tstList.length) setTestimonials(tstList);
      } catch {
        /* use fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const demoQuotes =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 1,
            client_name: "Priya N.",
            role: "CTO",
            company: "Regional Health Group",
            quote:
              "Aivora shipped compliant workflows in weeks — UX and performance exceeded our board demo.",
            rating: 5,
          },
          {
            id: 2,
            client_name: "Marcus L.",
            role: "Director",
            company: "Metro School District",
            quote:
              "Their school ERP unified admissions and finance; parents finally have one portal that actually works.",
            rating: 5,
          },
        ];

  return (
    <>
      <Helmet>
        <title>Aivora Solutions | Transforming Ideas Into Intelligent Digital Solutions</title>
        <meta
          name="description"
          content="Aivora Solutions delivers AI-powered software, websites, mobile apps, and enterprise systems for schools, hospitals, churches, and government."
        />
      </Helmet>

      {/* Hero — cinematic AI control plane */}
      <section className="relative overflow-hidden border-b border-white/10">
        <HeroBackground />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-28 pt-14 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-8 lg:pb-36 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col justify-center"
          >
            <HeroHeadline />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col justify-center lg:max-w-[520px]"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <motion.section {...sectionFade} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass-panel grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Enterprise-grade delivery</h2>
            <p className="mt-4 text-slate-400">
              We pair Django &amp; DRF backends with polished React experiences — production-ready for AWS. From
              discovery to launch, your roadmap stays visible and measurable.
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-transparent p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">What we ship</p>
            <ul className="space-y-2 text-slate-300">
              <li>✓ Secure REST APIs &amp; admin dashboards</li>
              <li>✓ Background processing &amp; scheduled tasks</li>
              <li>✓ SEO-ready marketing experiences</li>
              <li>✓ WhatsApp-ready contact flows</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <section className="border-y border-white/5 bg-aivora-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionFade} className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">Services</h2>
            <p className="mt-3 text-slate-400">
              Full-spectrum engineering for digital transformation — tailored playbooks for every sector we serve.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.article
                key={s.id ?? s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel group relative overflow-hidden border-white/10 p-6 shadow-lg shadow-cyan-950/20 hover:border-cyan-400/35"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-500/20 blur-2xl" />
                </div>
                <ServiceIcon name={s.icon || "Sparkles"} />
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.summary}</p>
                <Link
                  className="mt-4 inline-flex text-sm font-medium text-sky-300 hover:text-white"
                  to={`/services/${s.slug}`}
                >
                  Explore →
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions teaser */}
      <motion.section {...sectionFade} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-600/20 via-aivora-900 to-aivora-950 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Solutions that scale with you</h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Modular architectures for SaaS, portals, and regulated environments — analytics, workflows, and AI where
              it matters.
            </p>
          </div>
          <GlowButton to="/solutions">Explore Solutions</GlowButton>
        </div>
      </motion.section>

      {/* Why choose */}
      <section className="border-y border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...sectionFade} className="font-display text-3xl font-semibold text-white">
            Why choose Aivora
          </motion.h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whyChoose.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel p-6"
              >
                <h3 className="font-display text-lg font-semibold text-white">{w.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <motion.section {...sectionFade} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-center text-3xl font-semibold text-white">Technology stack</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Modern, proven tools — optimized for reliability and velocity.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {techStack.map((t) => (
            <div
              key={t.name}
              className="glass-panel flex flex-col items-center justify-center gap-2 py-6 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 font-display text-sm font-bold text-sky-200">
                {t.abbr}
              </span>
              <span className="text-xs font-medium text-slate-300">{t.name}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Portfolio */}
      <section className="border-t border-white/5 bg-aivora-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">Portfolio highlights</h2>
              <p className="mt-3 max-w-xl text-slate-400">Recent builds spanning AI, healthcare, education, and civic tech.</p>
            </div>
            <Link to="/portfolio" className="text-sm font-semibold text-sky-300 hover:text-white">
              View all projects →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {portfolio.map((p, i) => (
              <motion.div
                key={p.id ?? p.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-panel overflow-hidden"
              >
                <div className="h-36 bg-gradient-to-br from-sky-600/40 to-indigo-900/60 grid-bg" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-sky-300">{p.category}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{p.summary}</p>
                  {Array.isArray(p.stack) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.stack.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <motion.section {...sectionFade} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-center text-3xl font-semibold text-white">Trusted by leaders</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {demoQuotes.map((q) => (
            <blockquote key={q.id} className="glass-panel relative p-8">
              <p className="text-lg text-slate-200">&ldquo;{q.quote}&rdquo;</p>
              <footer className="mt-6 text-sm text-slate-400">
                <span className="font-semibold text-white">{q.client_name}</span>
                {q.role && ` · ${q.role}`}
                {q.company && ` · ${q.company}`}
              </footer>
            </blockquote>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-gradient-to-r from-sky-900/40 to-aivora-950 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-white">Ready to build what&apos;s next?</h2>
          <p className="max-w-xl text-slate-400">
            Tell us about your roadmap — we&apos;ll respond with architecture options and a clear delivery plan.
          </p>
          <GlowButton to="/contact">Contact our team</GlowButton>
        </div>
      </section>
    </>
  );
}
