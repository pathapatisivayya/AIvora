import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import api from "../api/client.js";
import GlowButton from "../components/ui/GlowButton.jsx";

export default function Contact() {
  const [settings, setSettings] = useState({ whatsapp_number: "", contact_email: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [mailNote, setMailNote] = useState("");

  useEffect(() => {
    api.get("/contact/settings/").then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/contact/inquiries/", { ...form, source: "website" });
      setOk(true);
      setMailNote("");
      if (import.meta.env.DEV && data?.email_notification_sent === false) {
        setMailNote(
          "Your message was saved, but the server could not send the notification email. Check backend terminal logs and SMTP settings (Gmail App Password, restart runserver).",
        );
      }
    } catch {
      setError("Could not reach the server. Start the API or try again shortly.");
    }
  }

  const wa = settings.whatsapp_number?.replace(/\D/g, "");

  return (
    <>
      <Helmet>
        <title>Contact | Aivora Solutions</title>
        <meta name="description" content="Contact Aivora Solutions for AI software, portals, mobile apps, and enterprise builds." />
      </Helmet>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-display text-4xl font-bold text-white">Let&apos;s build together</h1>
          <p className="mt-4 text-lg text-slate-400">
            Share your goals and constraints — we&apos;ll reply with architecture options and a pragmatic timeline.
          </p>
          <div className="mt-8 space-y-4 text-slate-300">
            {settings.contact_email && (
              <p>
                Email:{" "}
                <a className="text-sky-300 hover:text-white" href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email}
                </a>
              </p>
            )}
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200 hover:bg-emerald-500/20"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8">
          {ok ? (
            <div className="space-y-3">
              <p className="text-emerald-400">Thanks — your inquiry was received.</p>
              {mailNote && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                  {mailNote}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <label>
                <span className="text-sm text-slate-400">Name</span>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              <label>
                <span className="text-sm text-slate-400">Company</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </label>
              <label>
                <span className="text-sm text-slate-400">Subject</span>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </label>
              <label>
                <span className="text-sm text-slate-400">Message</span>
                <textarea
                  required
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              <GlowButton type="submit">Send message</GlowButton>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
