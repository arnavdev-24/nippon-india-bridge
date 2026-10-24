import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="relative inline-block h-7 w-7 rounded-full bg-primary">
        <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-saffron" />
      </span>
      <span className={`font-display text-lg font-bold ${light ? "text-sidebar-foreground" : "text-foreground"}`}>
        nippon<span className="text-primary">2</span>japan
      </span>
    </Link>
  );
}
