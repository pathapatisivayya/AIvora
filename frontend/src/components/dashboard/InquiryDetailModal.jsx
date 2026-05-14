import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  X,
} from "lucide-react";

const STATUS_STYLE = {
  new: "border-sky-500/40 bg-sky-500/15 text-sky-200",
  in_progress: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  closed: "border-slate-500/40 bg-slate-600/25 text-slate-300",
};

const STATUS_LABEL = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
};

export default function InquiryDetailModal({ inquiry, onClose }) {
  useEffect(() => {
    if (!inquiry) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [inquiry, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {inquiry && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-detail-title"
            className="fixed inset-x-4 top-[8vh] z-[101] mx-auto max-h-[84vh] max-w-lg overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-aivora-900/98 to-aivora-950 shadow-[0_0_80px_-10px_rgba(34,211,238,0.35)] sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="min-w-0">
                <p id="inquiry-detail-title" className="font-display text-lg font-semibold text-white">
                  Inquiry detail
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-400">{inquiry.subject}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(84vh-8rem)] overflow-y-auto px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[inquiry.status] || STATUS_STYLE.new}`}
                >
                  {STATUS_LABEL[inquiry.status] || inquiry.status}
                </span>
                {inquiry.source && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                    Source: {inquiry.source}
                  </span>
                )}
              </div>

              <dl className="mt-6 space-y-4">
                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</dt>
                    <dd className="mt-1 break-all">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-sm font-medium text-cyan-300 hover:text-white"
                      >
                        {inquiry.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phone</dt>
                    <dd className="mt-1 text-sm text-white">
                      {inquiry.phone ? (
                        <a href={`tel:${inquiry.phone.replace(/\s/g, "")}`} className="hover:text-cyan-300">
                          {inquiry.phone}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not provided</span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Company</dt>
                    <dd className="mt-1 text-sm text-slate-200">{inquiry.company || "—"}</dd>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Tag className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contact name</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{inquiry.name}</dd>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Received</dt>
                    <dd className="mt-1 font-mono text-sm text-slate-300">
                      {inquiry.created_at
                        ? new Date(inquiry.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </dd>
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-500/15 bg-cyan-950/20 p-4">
                  <div className="flex items-center gap-2 text-cyan-400/90">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Message</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{inquiry.message}</p>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.subject}`)}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-aivora-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 sm:flex-none"
                >
                  <Mail className="h-4 w-4" />
                  Reply by email
                </a>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 sm:flex-none"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
