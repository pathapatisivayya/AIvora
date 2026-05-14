import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { listFromResponse } from "../utils/apiHelpers.js";

export default function Careers() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api
      .get("/careers/jobs/")
      .then((res) => setJobs(listFromResponse(res.data)))
      .catch(() =>
        setJobs([
          {
            id: 1,
            title: "Senior Full-Stack Engineer",
            slug: "senior-full-stack-engineer",
            department: "Engineering",
            location: "Remote",
            employment_type: "full_time",
          },
          {
            id: 2,
            title: "Product Designer",
            slug: "product-designer",
            department: "Design",
            location: "Hybrid",
            employment_type: "full_time",
          },
        ]),
      );
  }, []);

  return (
    <>
      <Helmet>
        <title>Careers | Aivora Solutions</title>
        <meta name="description" content="Join Aivora Solutions — build intelligent products with a world-class engineering culture." />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Careers</h1>
        <p className="mt-4 text-lg text-slate-400">
          We hire builders who care about outcomes — thoughtful UX, resilient backends, and calm collaboration.
        </p>
        <div className="mt-10 space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-display text-xl font-semibold text-white">{job.title}</h2>
                <p className="text-sm text-slate-400">
                  {job.department} · {job.location} · {job.employment_type?.replace("_", " ")}
                </p>
              </div>
              <Link
                to={`/careers/${job.slug}`}
                className="text-sm font-semibold text-sky-300 hover:text-white"
              >
                Apply →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
