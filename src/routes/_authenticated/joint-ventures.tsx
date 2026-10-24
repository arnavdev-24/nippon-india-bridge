import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { PageHeader, Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyProfile } from "@/lib/profile";
import { INDUSTRIES, TECHNOLOGIES, hubProfilesQuery, matchReasons } from "@/lib/hubs";
import { Choice, Field, MultiChoice } from "@/components/hubs/HubControls";
import { ProfileEditor } from "@/components/hubs/ProfileEditor";
import { HubProfileCard } from "@/components/hubs/HubProfileCard";
export const Route = createFileRoute("/_authenticated/joint-ventures")({
  head: () => ({
    meta: [
      { title: "Joint Venture & Technology Exchange — nippon2japan" },
      {
        name: "description",
        content:
          "Discover Indian and Japanese companies, technology needs, video pitches and collaboration partners.",
      },
      { property: "og:title", content: "Joint Venture & Technology Exchange — nippon2japan" },
      {
        property: "og:description",
        content: "Two-way Japan–India partnerships and technology transfer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(hubProfilesQuery("jv")),
  component: JV,
});
function JV() {
  const { data: profiles } = useSuspenseQuery(hubProfilesQuery("jv"));
  const { data: me } = useMyProfile();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [technology, setTechnology] = useState<string[]>([]);
  const [view, setView] = useState("All opportunities");
  const own = profiles.find((p) => p.owner_id === me?.id);
  const needs = {
    industry: industry || own?.industry,
    technologies: technology.length ? technology : own?.technologies,
  };
  const list = profiles
    .filter(
      (p) =>
        (!country || p.country === country) &&
        (!industry || p.industry === industry) &&
        (!technology.length || technology.some((t) => p.technologies.includes(t))) &&
        [p.name, p.bio, p.offers, p.seeking, p.city]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (view !== "Technology requirements" || p.seeking.trim().length > 0),
    )
    .sort((a, b) => matchReasons(b, needs).length - matchReasons(a, needs).length);
  return (
    <>
      <PageHeader
        kanji="合"
        title="Joint Venture & Technology Exchange"
        desc="Shared ambition. Complementary capabilities. Japan × India."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost">
              <Link to="/connections">
                My collaborations <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ProfileEditor hub="jv" profile={own} />
          </div>
        }
      />
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["All opportunities", "Technology requirements"].map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "ink" : "outline"}
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Handshake className="h-4 w-4" />
          {list.length} companies
        </span>
      </div>
      <section className="mb-8 space-y-5 border-y border-border py-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Search companies or opportunities">
            <Input
              aria-label="Search companies"
              placeholder="Company, technology, capability…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <Field label="Country">
            <Choice
              value={country}
              onChange={setCountry}
              options={["India", "Japan"]}
              placeholder="Both countries"
            />
          </Field>
          <Field label="Industry">
            <Choice
              value={industry}
              onChange={setIndustry}
              options={INDUSTRIES}
              placeholder="All industries"
            />
          </Field>
        </div>
        <Field label="Technology focus">
          <MultiChoice options={TECHNOLOGIES} value={technology} onChange={setTechnology} />
        </Field>
      </section>
      {list.length === 0 ? (
        <Empty>
          No company pitches match yet. Publish your collaboration interests to join the network.
        </Empty>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <HubProfileCard
              key={p.id}
              profile={p}
              reasons={matchReasons(p, needs)}
              details={{ industry, technologies: technology }}
            />
          ))}
        </div>
      )}
    </>
  );
}
