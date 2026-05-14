import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { fallbackPortfolio } from "../data/site.js";
import { listFromResponse } from "../utils/apiHelpers.js";

export default function Portfolio() {
  const [projects, setProjects] = useState(fallbackPortfolio);

  useEffect(() => {
    api
      .get("/portfolio/projects/")
      .then((res) => {
        const list = listFromResponse(res.data);
        if (list.length) setProjects(list);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio | Aivora Solutions</title>
        <meta name="description" content="Selected projects: school ERP, hospital systems, AI platforms, church sites, and government dashboards." />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Portfolio</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          A snapshot of recent launches — performance-tuned, accessible, and ready for scale.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.id ?? p.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <div className="h-44 bg-gradient-to-br from-cyan-600/50 to-indigo-900/70 grid-bg" />
              <div className="p-6">
                <p className="text-xs uppercase text-sky-300">{p.category}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">{p.title}</h2>
                <p className="mt-3 text-slate-400">{p.summary}</p>
                {p.client_name && <p className="mt-4 text-sm text-slate-500">Client: {p.client_name}</p>}
                {Array.isArray(p.stack) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
