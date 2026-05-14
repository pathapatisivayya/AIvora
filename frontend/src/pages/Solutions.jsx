import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { listFromResponse } from "../utils/apiHelpers.js";

const fallback = [
  {
    id: 1,
    title: "Education Cloud",
    slug: "education-cloud",
    tagline: "Admissions to alumni on one spine.",
    body: "Attendance, grading, fees, transport, and parent apps unified with analytics for leadership.",
    highlights: ["Role-based portals", "Offline-first mobile", "Finance integrations"],
  },
  {
    id: 2,
    title: "Health Command",
    slug: "health-command",
    tagline: "Clinical clarity without compromising compliance.",
    body: "Scheduling, EMR workflows, billing hooks, and inventory tuned for hospital throughput.",
    highlights: ["Audit trails", "HL7/FHIR ready paths", "Secure messaging"],
  },
];

export default function Solutions() {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    api
      .get("/offerings/solutions/")
      .then((res) => {
        const list = listFromResponse(res.data);
        if (list.length) setItems(list);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Solutions | Aivora Solutions</title>
        <meta name="description" content="Industry solutions for education, healthcare, government, and AI-native products." />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Solutions</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          Opinionated blueprints that shorten time-to-value — mapped to your regulatory and operational reality.
        </p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {items.map((sol, i) => (
            <motion.div
              key={sol.id ?? sol.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-8"
            >
              <p className="text-xs uppercase tracking-wider text-sky-300">Blueprint</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">{sol.title}</h2>
              {sol.tagline && <p className="mt-2 text-sky-200">{sol.tagline}</p>}
              <p className="mt-4 text-slate-400">{sol.body}</p>
              {Array.isArray(sol.highlights) && sol.highlights.length > 0 && (
                <ul className="mt-6 space-y-2 text-sm text-slate-300">
                  {sol.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
