import { Link } from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-aivora-950/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="/aivora-logo.png"
                alt="Aivora Solutions"
                className="h-12 w-auto max-w-[220px] object-contain object-left sm:h-14 sm:max-w-[260px]"
                width={260}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm text-slate-400">
              Premium AI-powered software, portals, and platforms for enterprises and public-sector teams.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-sky-300" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-sky-300" to="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-sky-300" to="/careers">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Connect</p>
            <ul className="mt-3 flex gap-3 text-slate-400">
              <a href="mailto:hello@aivorasolutions.com" aria-label="Email" className="hover:text-sky-300">
                <Mail size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-sky-300">
                <ExternalLink size={20} />
              </a>
              <a href="https://github.com" aria-label="GitHub" className="hover:text-sky-300">
                <ExternalLink size={20} />
              </a>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aivora Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
