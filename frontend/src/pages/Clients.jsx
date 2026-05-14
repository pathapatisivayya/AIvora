import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { listFromResponse } from "../utils/apiHelpers.js";

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    api
      .get("/testimonials/clients/")
      .then((res) => setClients(listFromResponse(res.data)))
      .catch(() =>
        setClients([
          { id: 1, name: "Northwind Schools", logo_url: "" },
          { id: 2, name: "Harbor Health", logo_url: "" },
          { id: 3, name: "CivicWorks Agency", logo_url: "" },
        ]),
      );
  }, []);

  return (
    <>
      <Helmet>
        <title>Clients | Aivora Solutions</title>
        <meta name="description" content="Organizations that trust Aivora Solutions for mission-critical software." />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Clients</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          Long-term partnerships across education, healthcare, public sector, and high-growth startups.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel flex items-center justify-center p-8"
            >
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="max-h-12 object-contain opacity-90" />
              ) : (
                <span className="font-display text-lg font-semibold text-white">{c.name}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
