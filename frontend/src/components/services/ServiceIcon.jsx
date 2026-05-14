import * as Icons from "lucide-react";

export default function ServiceIcon({ name, className = "h-6 w-6 text-sky-300" }) {
  const Cmp = Icons[name] || Icons.Sparkles;
  return <Cmp className={className} aria-hidden />;
}
