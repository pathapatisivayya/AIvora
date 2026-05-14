import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { fallbackServices } from "../data/site.js";
import { listFromResponse } from "../utils/apiHelpers.js";
import ServiceIcon from "../components/services/ServiceIcon.jsx";

export default function Services() {
  const [items, setItems] = useState(fallbackServices);

  useEffect(() => {
    api
      .get("/offerings/services/")
      .then((res) => {
        const list = listFromResponse(res.data);
        if (list.length) setItems(list);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Services | Aivora Solutions</title>
        <meta
          name="description"
          content="AI solutions, school systems, hospital software, government portals, church websites, mobile apps, SaaS, and cloud engineering."
        />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-white">Services</h1>
          <p className="mt-4 text-lg text-slate-400">
            Strategic builds across sectors — each engagement tailored with architecture reviews, UX systems, and DevOps
            readiness.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <motion.article
              key={s.id ?? s.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-panel flex flex-col p-6"
            >
              <ServiceIcon name={s.icon || "Sparkles"} />
              <h2 className="mt-4 font-display text-xl font-semibold text-white">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-400">{s.summary}</p>
              <Link className="mt-4 text-sm font-semibold text-sky-300 hover:text-white" to={`/services/${s.slug}`}>
                View details →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
