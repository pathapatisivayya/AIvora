import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";
import GlowButton from "../components/ui/GlowButton.jsx";

export default function JobDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    linkedin_url: "",
    cover_letter: "",
    resume_url: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/careers/jobs/${slug}/`)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null));
  }, [slug]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/careers/apply/", { ...form, job: job?.id });
      setSent(true);
    } catch {
      setErr("Could not submit. Ensure the API is running and the job exists.");
    }
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-400">
        Loading role…
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job.title} | Careers</title>
        <meta name="description" content={job.description?.slice(0, 160)} />
      </Helmet>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/careers" className="text-sm text-sky-300 hover:text-white">
          ← All roles
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <h1 className="font-display text-4xl font-bold text-white">{job.title}</h1>
          <p className="mt-2 text-slate-400">
            {job.department} · {job.location}
          </p>
          <div className="prose prose-invert mt-8 max-w-none text-slate-300 whitespace-pre-wrap">{job.description}</div>
          {job.requirements && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-white">Requirements</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-400">{job.requirements}</p>
            </div>
          )}
        </motion.div>

        <div className="glass-panel mt-12 p-8">
          <h2 className="font-display text-xl font-semibold text-white">Apply</h2>
          {sent ? (
            <p className="mt-4 text-emerald-400">Application received. We&apos;ll be in touch.</p>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm text-slate-400">Full name</span>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </label>
              <label>
                <span className="text-sm text-slate-400">Email</span>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                <span className="text-sm text-slate-400">Phone</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm text-slate-400">LinkedIn URL</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm text-slate-400">Resume URL</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  placeholder="Link to PDF or portfolio"
                  value={form.resume_url}
                  onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm text-slate-400">Cover letter</span>
                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.cover_letter}
                  onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                />
              </label>
              {err && <p className="sm:col-span-2 text-sm text-red-400">{err}</p>}
              <div className="sm:col-span-2">
                <GlowButton type="submit">Submit application</GlowButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
