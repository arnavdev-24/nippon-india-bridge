import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, ExternalLink, MapPin, Truck } from "lucide-react";
import { PageHeader, Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMyProfile } from "@/lib/profile";
import {
  BUSINESS_EXAMPLES,
  CATEGORIES,
  INDUSTRIES,
  STATES,
  hubProfilesQuery,
  matchReasons,
} from "@/lib/hubs";
import { Choice, Field, MultiChoice } from "@/components/hubs/HubControls";
import { ProfileEditor } from "@/components/hubs/ProfileEditor";
import { HubProfileCard } from "@/components/hubs/HubProfileCard";

export const Route = createFileRoute("/_authenticated/distributors")({
  head: () => ({
    meta: [
      { title: "Distributor Connect Hub — Japan2Nippon" },
      {
        name: "description",
        content:
          "Match your products with Indian distributors by industry, state and capabilities.",
      },
      { property: "og:title", content: "Distributor Connect Hub — Japan2Nippon" },
      {
        property: "og:description",
        content: "Find regional distribution partners for Japanese products in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(hubProfilesQuery("distribution")),
  component: Distributors,
});
function Distributors() {
  const { data: profiles } = useSuspenseQuery(hubProfilesQuery("distribution"));
  const { data: me } = useMyProfile();
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [market, setMarket] = useState("Expansion market");
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Matches");
  const needs = { industry, category, states, customers, capabilities };
  const list = profiles
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (tab === "Directory" ||
          ((!industry || p.industry === industry) &&
            (!category || p.categories.includes(category)) &&
            (!states.length ||
              states.some(
                (s) => p.service_areas.includes(s) || p.service_areas.includes("Nationwide"),
              )))),
    )
    .sort((a, b) => matchReasons(b, needs).length - matchReasons(a, needs).length);
  const examples = BUSINESS_EXAMPLES.filter(
    (p) =>
      (!category || p.categories.includes(category)) &&
      (!states.length ||
        states.some((s) => p.service_areas.includes(s) || p.service_areas.includes("Nationwide"))),
  ).sort((a, b) => matchReasons(b, needs).length - matchReasons(a, needs).length);
  return (
    <>
      <PageHeader
        kanji="販"
        title="Distributor Connect Hub"
        desc="Japanese products. Indian markets. The right distribution partner."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost">
              <Link to="/connections">
                My requests <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ProfileEditor
              hub="distribution"
              profile={profiles.find((p) => p.owner_id === me?.id)}
            />
          </div>
        }
      />
      <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="min-w-0 border-b border-border pb-6 lg:border-r lg:border-b-0 lg:pr-6">
          <div className="mb-5 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Your market brief</h2>
          </div>
          <div className="mb-5 flex gap-2">
            {[1, 2].map((n) => (
              <Button
                key={n}
                size="sm"
                variant={step === n ? "default" : "outline"}
                onClick={() => setStep(n)}
              >
                {n === 1 ? "1 · Product" : "2 · Target market"}
              </Button>
            ))}
          </div>
          {step === 1 ? (
            <div className="space-y-4">
              <Field label="Industry">
                <Choice
                  value={industry}
                  onChange={setIndustry}
                  options={INDUSTRIES}
                  placeholder="Select industry"
                />
              </Field>
              <Field label="Product category">
                <Choice
                  value={category}
                  onChange={setCategory}
                  options={CATEGORIES}
                  placeholder="Select product category"
                />
              </Field>
              <Field label="Product name">
                <Input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Industrial servo motor"
                />
              </Field>
              <Field label="Product details">
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specifications, applications and distribution requirements"
                />
              </Field>
              <Button
                onClick={() => setStep(2)}
                disabled={!industry || !category || !product.trim()}
              >
                Choose target markets <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Market objective">
                <Choice
                  value={market}
                  onChange={setMarket}
                  options={["Expansion market", "Already popular / established market"]}
                  placeholder="Select objective"
                />
              </Field>
              <Field label="Target Indian states / territories">
                <Choice
                  value=""
                  onChange={(v) => {
                    if (v && !states.includes(v)) setStates([...states, v]);
                  }}
                  options={STATES}
                  placeholder="Add a state"
                />
              </Field>
              <MultiChoice options={states} value={states} onChange={setStates} />
              <Field label="Target customers">
                <MultiChoice
                  options={["Retailers", "Manufacturers", "Hospitals", "Enterprises", "Consumers"]}
                  value={customers}
                  onChange={setCustomers}
                />
              </Field>
              <Field label="Required capabilities">
                <MultiChoice
                  options={[
                    "Warehousing",
                    "Dealer network",
                    "Import support",
                    "After-sales service",
                    "Cold chain",
                    "E-commerce",
                  ]}
                  value={capabilities}
                  onChange={setCapabilities}
                />
              </Field>
            </div>
          )}
        </section>
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {["Matches", "Directory"].map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tab === t ? "ink" : "outline"}
                  onClick={() => setTab(t)}
                >
                  {t === "Matches" ? "Suggested distributors" : "Directory"}
                </Button>
              ))}
            </div>
            <Input
              className="max-w-xs"
              aria-label="Search distributors"
              placeholder="Search companies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center justify-between text-sm">
            <span>
              {list.length} registered {list.length === 1 ? "distributor" : "distributors"}
            </span>
            {states.length > 0 && (
              <span className="text-muted-foreground">
                {states.length} target {states.length === 1 ? "state" : "states"}
              </span>
            )}
          </div>
          {list.length === 0 ? (
            <Empty>No registered distributors match this brief yet.</Empty>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {list.map((p) => (
                <HubProfileCard
                  key={p.id}
                  profile={p}
                  reasons={matchReasons(p, needs)}
                  details={{
                    industry,
                    category,
                    product,
                    description,
                    states,
                    customers,
                    capabilities,
                    market,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <section className="border-t border-border pt-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold">Business examples in your market</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Official company sources · Not registered members · Partnership suitability is not
            verified.
          </p>
        </div>
        {examples.length === 0 ? (
          <Empty>No sourced business example for these selections.</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {examples.map((p) => (
              <article key={p.name} className="rounded-lg border border-border bg-card p-5">
                <span className="text-xs font-medium text-primary">
                  REAL BUSINESS · EXTERNAL EXAMPLE
                </span>
                <h3 className="mt-2 text-lg font-bold">{p.name}</h3>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.city}
                </p>
                <p className="mt-3 text-sm">{p.bio}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Coverage: {p.service_areas.join(", ")}
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <a href={p.source} target="_blank" rel="noopener noreferrer">
                    Official website <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
