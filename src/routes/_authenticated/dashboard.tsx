import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, Handshake, Truck, Languages, ClipboardList, Inbox, ArrowUpRight } from "lucide-react";
import { useMyProfile } from "@/lib/profile";
import { useT, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — nippon2japan" }, { name: "description", content: "Your Japan–India business hub." }, { property: "og:title", content: "Dashboard" }, { property: "og:description", content: "Your Japan–India business hub." }] }),
  component: Dashboard,
});

const tiles: { to: string; key: TKey; desc?: TKey; icon: typeof Inbox }[] = [
  { to: "/advisors", key: "advisors", desc: "advisorsDesc", icon: Calculator },
  { to: "/joint-ventures", key: "jv", desc: "jvDesc", icon: Handshake },
  { to: "/distributors", key: "distributors", desc: "distDesc", icon: Truck },
  { to: "/tutors", key: "tutors", desc: "tutorsDesc", icon: Languages },
  { to: "/surveys", key: "surveys", desc: "surveysDesc", icon: ClipboardList },
  { to: "/connections", key: "connections", icon: Inbox },
];

function Dashboard() {
  const { t, lang } = useT();
  const { data: p } = useMyProfile();
  return (
    <>
      <div className="mb-10">
        <div className="text-sm text-muted-foreground">{lang === "ja" ? "ようこそ" : "Welcome"} · नमस्ते</div>
        <h1 className="mt-1 text-4xl font-bold">{p?.full_name || p?.company_name}</h1>
        <div className="rule-ink mt-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tiles.map((x) => (
          <Link key={x.to} to={x.to} className="group rounded-lg border border-border bg-card p-6 shadow-paper transition-colors hover:border-primary">
            <div className="flex items-center justify-between">
              <x.icon className="h-6 w-6 text-primary" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-5 text-xl font-bold">{t(x.key)}</h3>
            {x.desc && <p className="mt-1 text-sm text-muted-foreground">{t(x.desc)}</p>}
          </Link>
        ))}
      </div>
    </>
  );
}
