import { lazy, Suspense } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";

const HeroWebGLCanvas = lazy(() => import("./HeroWebGLCanvas.jsx"));

export default function HeroWebGLScene() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(14,165,233,0.15),transparent)]"
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sky-950/40 via-transparent to-violet-950/30" />
      }
    >
      <div className="absolute inset-0 opacity-[0.95]">
        <HeroWebGLCanvas />
      </div>
    </Suspense>
  );
}
