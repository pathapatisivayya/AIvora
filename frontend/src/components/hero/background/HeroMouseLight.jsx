import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";

/** Soft mouse-reactive glow — background only, does not block clicks. */
export default function HeroMouseLight() {
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    let nx = 50;
    let ny = 50;

    const onMove = (e) => {
      const section = document.querySelector("[data-hero-section]");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      nx = ((e.clientX - rect.left) / rect.width) * 100;
      ny = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setPos({ x: nx, y: ny });
          raf = 0;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-[background] duration-200 ease-out"
      style={{
        background: `radial-gradient(700px circle at ${pos.x}% ${pos.y}%, rgba(34,211,238,0.12), transparent 50%)`,
      }}
    />
  );
}
