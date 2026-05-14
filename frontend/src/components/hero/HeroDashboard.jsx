import { lazy, Suspense, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Radio, Server, Shield, Zap } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

const HeroWireMesh = lazy(() => import("../three/HeroWireMesh.jsx"));

const barHeights = [38, 62, 48, 78, 55, 68, 44, 72, 51];

function LiveBars() {
  return (
    <div className="flex h-20 items-end justify-between gap-1.5 px-1">
      {barHeights.map((h, i) => {
        const base = Math.round((h / 100) * 72);
        const seq = [
          `${Math.max(12, base - 14)}px`,
          `${base}px`,
          `${Math.max(14, base - 8)}px`,
          `${base}px`,
        ];
        return (
          <motion.div
            key={i}
            className="w-1.5 min-h-[8px] rounded-t bg-gradient-to-t from-sky-600 via-cyan-400 to-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            initial={false}
            animate={{ height: seq }}
            transition={{
              duration: 2.2 + (i % 3) * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        );
      })}
    </div>
  );
}

function PulseRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 ${color}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="truncate text-xs text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <motion.span
          className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="font-mono text-xs text-cyan-200/90">{value}</span>
      </div>
    </div>
  );
}

export default function HeroDashboard() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  function onMove(e) {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -10,
      y: ((e.clientX - r.left) / r.width - 0.5) * 10,
    });
  }

  function onLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      className="relative flex min-h-[420px] flex-1 flex-col lg:max-w-xl lg:min-h-[480px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        perspective: "1400px",
      }}
    >
      {/* Rotating ring decoration */}
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full border border-cyan-400/20"
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-4 top-4 h-32 w-32 rounded-full border border-violet-400/25"
        animate={reduced ? {} : { rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative flex flex-1 flex-col gap-4"
        style={{
          transform: reduced ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main stack */}
        <div className="relative rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-white/[0.08] to-transparent p-1 shadow-[0_0_80px_-12px_rgba(34,211,238,0.35)] backdrop-blur-2xl">
          <div className="rounded-[22px] bg-aivora-950/60 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
                  AI Control Plane
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">Live system intelligence</p>
              </div>
              <motion.div
                className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1"
                animate={reduced ? {} : { boxShadow: ["0 0 0 0 rgba(52,211,153,0)", "0 0 20px 0 rgba(52,211,153,0.25)", "0 0 0 0 rgba(52,211,153,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-300">Live</span>
              </motion.div>
            </div>

            <Suspense
              fallback={<div className="mt-4 h-[200px] animate-pulse rounded-xl bg-white/5" />}
            >
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-950/80 to-aivora-950/90">
                <HeroWireMesh />
              </div>
            </Suspense>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500">
                <span>Throughput</span>
                <span className="font-mono text-cyan-400/90">req/s · rolling</span>
              </div>
              <LiveBars />
            </div>
          </div>
        </div>

        {/* Floating secondary cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
            whileHover={reduced ? {} : { y: -4, borderColor: "rgba(34,211,238,0.35)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center gap-2 text-sky-300">
              <Cpu className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Inference</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tabular-nums text-white">
              <motion.span
                initial={false}
                animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                98.7
              </motion.span>
              <span className="text-lg text-slate-500">%</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Model confidence · last 24h</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
            whileHover={reduced ? {} : { y: -4, borderColor: "rgba(167,139,250,0.35)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center gap-2 text-violet-300">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Latency</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tabular-nums text-white">
              &lt;112<span className="text-lg font-medium text-slate-500">ms</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">p95 edge · global</p>
          </motion.div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <PulseRow icon={Server} label="Deployments · orchestrated" value="Healthy" color="bg-emerald-500/15 text-emerald-300" />
          <PulseRow icon={Shield} label="Security posture" value="JWT · RBAC" color="bg-violet-500/15 text-violet-300" />
          <PulseRow icon={Radio} label="Edge regions active" value="12" color="bg-sky-500/15 text-sky-300" />
          <PulseRow icon={Zap} label="Job queue drain" value="Real-time" color="bg-amber-500/15 text-amber-200" />
        </div>
      </motion.div>
    </div>
  );
}
