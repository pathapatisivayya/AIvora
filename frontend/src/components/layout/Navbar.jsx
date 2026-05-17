import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/clients", label: "Clients" },
  { to: "/careers", label: "Careers" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isStaff } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-aivora-950/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center"
        >
          <img
            src="/aivora-logo.png"
            alt="Aivora Solutions — Building Smart Digital Solutions"
            className="h-10 w-auto max-w-[min(100%,220px)] object-contain object-left sm:h-12 sm:max-w-[260px]"
            width={260}
            height={80}
            decoding="async"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/dashboard"
            className={
              isStaff
                ? "rounded-lg px-3 py-2 text-sm font-medium text-sky-300 hover:text-white"
                : "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:border-sky-400/40 hover:text-white"
            }
          >
            {isStaff ? "Dashboard" : user ? "Account" : "Dash Board"}
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-white/10 p-2 text-slate-200 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-aivora-950/95 px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <Link to="/about" className="rounded-lg px-3 py-2 text-slate-200" onClick={() => setOpen(false)}>
              About
            </Link>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-slate-200"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-sky-300"
              onClick={() => setOpen(false)}
            >
              {isStaff ? "Dashboard" : user ? "Account" : "Dash Board"}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
