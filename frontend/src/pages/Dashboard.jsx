import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";
import api from "../api/client.js";
import InquiryDetailModal from "../components/dashboard/InquiryDetailModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import GlowButton from "../components/ui/GlowButton.jsx";
import { listFromResponse } from "../utils/apiHelpers.js";

const INQUIRY_STATUS = {
  new: { label: "New", className: "border-sky-500/35 bg-sky-500/10 text-sky-200" },
  in_progress: { label: "In progress", className: "border-amber-500/35 bg-amber-500/10 text-amber-200" },
  closed: { label: "Closed", className: "border-slate-500/35 bg-slate-600/20 text-slate-300" },
};

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Internship" },
];

const emptyJobForm = () => ({
  title: "",
  department: "",
  location: "",
  employment_type: "full_time",
  description: "",
  requirements: "",
  is_open: true,
});

export default function Dashboard() {
  const { user, login, logout, isStaff } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobMessage, setJobMessage] = useState("");
  const [jobError, setJobError] = useState("");
  const [inquiryDetail, setInquiryDetail] = useState(null);

  const loadStaffData = useCallback(() => {
    api
      .get("/analytics/dashboard/")
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(null));
    api
      .get("/contact/admin/inquiries/")
      .then((res) => setInquiries(res.data?.results ?? res.data ?? []))
      .catch(() => setInquiries([]));
    api
      .get("/careers/admin/jobs/")
      .then((res) => setJobs(listFromResponse(res.data)))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    if (!isStaff) return;
    loadStaffData();
  }, [isStaff, loadStaffData]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const r = await login(username, password);
    if (!r.ok) setLoginError(r.error || "Login failed");
  }

  async function submitJob(e) {
    e.preventDefault();
    setJobMessage("");
    setJobError("");
    try {
      await api.post("/careers/admin/jobs/", jobForm);
      setJobForm(emptyJobForm());
      setJobMessage("Job posted — it will appear on the Careers page when marked open.");
      loadStaffData();
    } catch (err) {
      const detail = err?.response?.data;
      const msg =
        typeof detail === "object"
          ? JSON.stringify(detail)
          : detail || "Could not save job. Check that you are logged in as staff.";
      setJobError(msg);
    }
  }

  async function toggleJobOpen(job) {
    try {
      await api.patch(`/careers/admin/jobs/${job.id}/`, { is_open: !job.is_open });
      loadStaffData();
    } catch {
      /* ignore */
    }
  }

  async function removeJob(job) {
    if (!window.confirm(`Remove “${job.title}”? Applications stay in the database.`)) return;
    try {
      await api.delete(`/careers/admin/jobs/${job.id}/`);
      loadStaffData();
    } catch {
      /* ignore */
    }
  }

  const inquiryList = Array.isArray(inquiries) ? inquiries : [];

  return (
    <>
      <Helmet>
        <title>Team dashboard | Aivora Solutions</title>
      </Helmet>
      <InquiryDetailModal inquiry={inquiryDetail} onClose={() => setInquiryDetail(null)} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Team dashboard</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Sign in with your company account to view site analytics, contact inquiries, and publish roles on the{" "}
          <Link className="text-sky-300 hover:text-white" to="/careers">
            Careers
          </Link>{" "}
          page.
        </p>

        {!user && (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="glass-panel mt-10 max-w-md space-y-4 p-8"
          >
            <h2 className="font-display text-xl font-semibold text-white">Team sign in</h2>
            <p className="text-sm text-slate-500">Staff username and password.</p>
            <label className="block">
              <span className="text-sm text-slate-400">Username</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Password</span>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <GlowButton type="submit">Sign in</GlowButton>
          </motion.form>
        )}

        {user && !isStaff && (
          <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            Signed in as {user.username}. This area requires a staff account.
            <button type="button" className="ml-4 underline" onClick={logout}>
              Sign out
            </button>
          </p>
        )}

        {isStaff && (
          <div className="mt-10 space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-slate-400">
                Signed in as <span className="text-white">{user.username}</span>
              </p>
              <button type="button" onClick={logout} className="text-sm text-sky-300 hover:text-white">
                Sign out
              </button>
            </div>

            {analytics && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="glass-panel p-6">
                  <p className="text-sm text-slate-400">Page views (30d)</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{analytics.total_page_views}</p>
                </div>
                <div className="glass-panel p-6">
                  <p className="text-sm text-slate-400">Inquiries (30d)</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{analytics.total_inquiries}</p>
                </div>
                <div className="glass-panel p-6">
                  <p className="text-sm text-slate-400">Top path</p>
                  <p className="mt-2 truncate text-lg text-sky-200">{analytics.top_paths?.[0]?.path || "—"}</p>
                </div>
              </div>
            )}

            {/* Job postings */}
            <section className="glass-panel overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-display text-lg font-semibold text-white">Careers — post a job</h2>
                <p className="mt-1 text-sm text-slate-500">
                  New roles show on the public Careers page immediately when <strong className="text-slate-400">Open</strong>{" "}
                  is on.
                </p>
              </div>
              <form onSubmit={submitJob} className="space-y-4 border-b border-white/10 px-6 py-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="text-sm text-slate-400">Job title *</span>
                    <input
                      required
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Senior Full-Stack Engineer"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-400">Department</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      placeholder="Engineering"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-400">Location</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="Remote / Hyderabad"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm text-slate-400">Employment type</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-white/10 bg-aivora-900 px-4 py-2 text-white"
                      value={jobForm.employment_type}
                      onChange={(e) => setJobForm({ ...jobForm, employment_type: e.target.value })}
                    >
                      {EMPLOYMENT_TYPES.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm text-slate-400">Role description *</span>
                    <textarea
                      required
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      placeholder="What they'll do, team context, impact..."
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm text-slate-400">Requirements (optional)</span>
                    <textarea
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                      placeholder="Skills, years of experience, education..."
                    />
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 md:col-span-2">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/5 text-sky-500"
                      checked={jobForm.is_open}
                      onChange={(e) => setJobForm({ ...jobForm, is_open: e.target.checked })}
                    />
                    <span className="text-sm text-slate-300">List on Careers page (open role)</span>
                  </label>
                </div>
                {jobMessage && <p className="text-sm text-emerald-400">{jobMessage}</p>}
                {jobError && <p className="text-sm text-red-400">{jobError}</p>}
                <GlowButton type="submit">Publish job</GlowButton>
              </form>

              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Posted roles</h3>
                <div className="mt-4 divide-y divide-white/10">
                  {jobs.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-500">No jobs yet — add one above.</p>
                  )}
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white">{job.title}</p>
                        <p className="truncate text-sm text-slate-500">
                          {job.department || "—"} · {job.location || "—"} ·{" "}
                          {EMPLOYMENT_TYPES.find((t) => t.value === job.employment_type)?.label || job.employment_type}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleJobOpen(job)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                            job.is_open
                              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                              : "bg-slate-600/40 text-slate-300 hover:bg-slate-600/60"
                          }`}
                        >
                          {job.is_open ? "Open · visible on Careers" : "Closed · hidden"}
                        </button>
                        <Link
                          to={`/careers/${job.slug}`}
                          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-sky-300 hover:bg-white/5"
                        >
                          View page
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeJob(job)}
                          className="rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-sm">
                  <Link className="text-sky-400 hover:text-white" to="/careers">
                    Open public Careers page →
                  </Link>
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-white/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
                <h2 className="font-display text-xl font-semibold text-white">Contact inquiries</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Website leads with email, phone, and full message — open <strong className="text-slate-400">Detail</strong>{" "}
                  for the complete thread.
                </p>
              </div>

              {inquiryList.length === 0 ? (
                <p className="px-6 py-14 text-center text-sm text-slate-500">No inquiries yet.</p>
              ) : (
                <>
                  <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,5.5rem)_minmax(0,5.5rem)_auto] md:gap-3 md:border-b md:border-white/10 md:bg-white/[0.02] md:px-6 md:py-3 md:text-[11px] md:font-semibold md:uppercase md:tracking-wider md:text-slate-500">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Subject</span>
                    <span className="text-center">Received</span>
                    <span className="text-center">Status</span>
                    <span />
                  </div>
                  <div className="divide-y divide-white/10">
                    {inquiryList.slice(0, 20).map((q) => {
                      const st = INQUIRY_STATUS[q.status] || INQUIRY_STATUS.new;
                      const when = q.created_at
                        ? new Date(q.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—";
                      return (
                        <div
                          key={q.id}
                          className="flex flex-col gap-4 px-6 py-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,5.5rem)_minmax(0,5.5rem)_auto] md:items-center md:gap-3 md:py-4"
                        >
                          <div className="flex items-start justify-between gap-3 md:block">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:hidden">
                              Name
                            </span>
                            <span className="font-medium text-white">{q.name}</span>
                          </div>
                          <div className="flex items-start justify-between gap-3 md:block md:min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:hidden">
                              Email
                            </span>
                            <a
                              href={`mailto:${q.email}`}
                              className="break-all text-sm text-cyan-300/95 hover:text-white md:truncate md:block"
                            >
                              {q.email}
                            </a>
                          </div>
                          <div className="flex items-start justify-between gap-3 md:block">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:hidden">
                              Phone
                            </span>
                            {q.phone ? (
                              <a
                                href={`tel:${String(q.phone).replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-1.5 text-sm text-violet-300 hover:text-white"
                              >
                                <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate">{q.phone}</span>
                              </a>
                            ) : (
                              <span className="text-sm text-slate-500">—</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:hidden">
                              Subject
                            </span>
                            <p className="mt-0.5 truncate text-sm text-slate-300 md:mt-0" title={q.subject}>
                              {q.subject}
                            </p>
                          </div>
                          <div className="flex justify-between gap-3 border-t border-white/5 pt-4 md:border-0 md:pt-0 md:justify-center">
                            <span className="text-[11px] font-semibold uppercase text-slate-500 md:hidden">Received</span>
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400">
                              <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              {when}
                            </span>
                          </div>
                          <div className="flex justify-between gap-3 md:justify-center">
                            <span className="text-[11px] font-semibold uppercase text-slate-500 md:hidden">Status</span>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${st.className}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <div className="md:flex md:justify-end">
                            <button
                              type="button"
                              onClick={() => setInquiryDetail(q)}
                              className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 hover:text-white md:w-auto"
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
