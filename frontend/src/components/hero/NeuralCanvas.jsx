import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

/** AI network canvas — nodes, edges, traveling data pulses, mouse coupling. */
export default function NeuralCanvas({ className = "" }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;

    const ctx = canvas.getContext("2d");
    let animationId;
    const nodes = [];
    const pulses = [];
    const n = 52;
    let w = 0;
    let h = 0;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.length = 0;
      pulses.length = 0;
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 2 + 0.6,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }

    function spawnPulse(a, b) {
      if (pulses.length > 24) return;
      pulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, speed: 0.008 + Math.random() * 0.012 });
    }

    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;

      for (const p of nodes) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 240) {
          p.vx += (dx / d) * 0.01;
          p.vy += (dy / d) * 0.01;
        }
        p.vx *= 0.988;
        p.vy *= 0.988;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
        p.pulse += 0.025;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 145) {
            const alpha = ((145 - dist) / 145) * 0.4;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(56, 189, 248, ${alpha * 0.35})`);
            grad.addColorStop(0.5, `rgba(129, 140, 248, ${alpha * 0.45})`);
            grad.addColorStop(1, `rgba(167, 139, 250, ${alpha * 0.3})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            if (Math.random() < 0.0008) spawnPulse(a, b);
          }
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const x = p.ax + (p.bx - p.ax) * p.t;
        const y = p.ay + (p.by - p.ay) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 243, 252, ${0.9 * (1 - Math.abs(p.t - 0.5) * 2)})`;
        ctx.fill();
      }

      for (const p of nodes) {
        const glow = 0.35 + Math.sin(p.pulse) * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${0.06 + glow * 0.06})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${0.5 + glow * 0.25})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    animationId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
