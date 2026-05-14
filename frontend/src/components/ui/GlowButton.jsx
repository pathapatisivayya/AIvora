import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function GlowButton({
  children,
  variant = "primary",
  className = "",
  to,
  href,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-aivora-950 shadow-glow hover:brightness-110"
      : "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10";

  const cls = `${base} ${styles} ${className}`;

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Link to={to} className={cls} {...props}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={href}
        className={cls}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type={type} className={cls} {...props}>
      {children}
    </motion.button>
  );
}
