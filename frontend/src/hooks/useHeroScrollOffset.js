import { useEffect, useState } from "react";

/** Parallax offset for hero background layers only. */
export function useHeroScrollOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = document.querySelector("[data-hero-section]");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const h = rect.height || 1;
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      setOffset(progress * 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return offset;
}
