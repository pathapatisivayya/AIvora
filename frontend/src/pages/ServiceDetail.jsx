import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { fallbackServices } from "../data/site.js";
import ServiceIcon from "../components/services/ServiceIcon.jsx";
import GlowButton from "../components/ui/GlowButton.jsx";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [svc, setSvc] = useState(null);

  useEffect(() => {
    api
      .get(`/offerings/services/${slug}/`)
      .then((res) => setSvc(res.data))
      .catch(() => {
        const local = fallbackServices.find((s) => s.slug === slug);
        setSvc(
          local
            ? {
                ...local,
                description:
                  "Detailed delivery includes workshops, architecture, UX systems, QA, DevOps handoff, and documentation tailored to your stakeholders.",
              }
            : null,
        );
      });
  }, [slug]);

  if (!svc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{svc.title} | Aivora Solutions</title>
        <meta name="description" content={svc.summary} />
      </Helmet>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/services" className="text-sm text-sky-300 hover:text-white">
          ← All services
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <ServiceIcon name={svc.icon || "Sparkles"} className="h-10 w-10 text-sky-300" />
          <h1 className="mt-6 font-display text-4xl font-bold text-white">{svc.title}</h1>
          <p className="mt-4 text-lg text-slate-400">{svc.summary}</p>
          <div className="prose prose-invert mt-8 max-w-none text-slate-300">
            <p>{svc.description}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact">
              <GlowButton>Start a project</GlowButton>
            </Link>
            <Link to="/portfolio">
              <GlowButton variant="secondary">See portfolio</GlowButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
