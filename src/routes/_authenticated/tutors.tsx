import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Languages } from "lucide-react";
import { PageHeader, Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMyProfile } from "@/lib/profile";
import { LANGUAGES, LEVELS, hubProfilesQuery, slotsQuery, matchReasons } from "@/lib/hubs";
import { Choice, Field } from "@/components/hubs/HubControls";
import { ProfileEditor } from "@/components/hubs/ProfileEditor";
import { HubProfileCard } from "@/components/hubs/HubProfileCard";
import { RegisterAsPartnerDialog } from "@/components/RegisterAsPartnerDialog";
export const Route = createFileRoute("/_authenticated/tutors")({
  head: () => ({
    meta: [
      { title: "Language & Cultural Exchange Hub — nippon2bharat" },
      {
        name: "description",
        content:
          "Find Japanese, Hindi and English tutors, cultural trainers and employee language sessions.",
      },
      { property: "og:title", content: "Language & Cultural Exchange Hub — nippon2bharat" },
      {
        property: "og:description",
        content: "Match tutors by language, goals, budget and available sessions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tutors,
});
function Tutors() {
  const { data: profiles = [] } = useQuery(hubProfilesQuery("tutoring"));
  const { data: slots = [] } = useQuery(slotsQuery);
  const { data: me } = useMyProfile();
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [mode, setMode] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [training, setTraining] = useState("Employee training");
  const needs = {
    language,
    level,
    budget: budget ? Number(budget) : undefined,
    capabilities: goal ? [goal] : [],
  };
  const available = (id: string) =>
    slots.filter(
      (s) =>
        s.tutor_id === id &&
        (!mode || s.mode === mode) &&
        (!date || new Date(s.starts_at).toLocaleDateString("en-CA") === date),
    );
  const list = profiles
    .filter(
      (p) =>
        (!language || p.categories.includes(language)) &&
        (!level || p.levels.includes(level)) &&
        (!budget || p.fee_inr <= Number(budget)) &&
        (!mode || (mode === "online" ? p.online : p.in_person)) &&
        (!date || available(p.id).length > 0) &&
        (!goal || p.capabilities.includes(goal)) &&
        `${p.name} ${p.city} ${p.bio}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        matchReasons(b, needs).length +
        (available(b.id).length ? 1 : 0) -
        (matchReasons(a, needs).length + (available(a.id).length ? 1 : 0)),
    );
  return (
    <>
      <PageHeader
        kanji="語"
        title="Language & Cultural Exchange Hub"
        desc="Better conversations. Stronger teams. Across Japan and India."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost">
              <Link to="/connections">
                My bookings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ProfileEditor hub="tutoring" profile={profiles.find((p) => p.owner_id === me?.id)} /><RegisterAsPartnerDialog section="tutors" />
          </div>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <section className="space-y-4 border-b border-border pb-6 lg:border-r lg:border-b-0 lg:pr-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Languages className="h-5 w-5 text-primary" />
            Training brief
          </h2>
          <Field label="Learning arrangement">
            <Choice
              value={training}
              onChange={setTraining}
              options={["Employee training", "Individual learning"]}
              placeholder="Select arrangement"
            />
          </Field>
          <Field label="Language">
            <Choice
              value={language}
              onChange={setLanguage}
              options={[...new Set([...LANGUAGES, ...profiles.flatMap((p) => p.categories)])]}
              placeholder="All languages"
            />
          </Field>
          <Field label="Current proficiency">
            <Choice value={level} onChange={setLevel} options={LEVELS} placeholder="All levels" />
          </Field>
          <Field label="Learning goal">
            <Choice
              value={goal}
              onChange={setGoal}
              options={[
                "Business Japanese",
                "Professional English",
                "Workplace communication",
                "Cultural etiquette",
                "Everyday conversation",
                "JLPT preparation",
              ]}
              placeholder="All training goals"
            />
          </Field>
          <Field label="Maximum fee · INR per hour">
            <Input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Any budget"
            />
          </Field>
          <Field label="Session mode">
            <Choice
              value={mode}
              onChange={setMode}
              options={["online", "in_person"]}
              placeholder="Any mode"
            />
          </Field>
          <Field label="Preferred date · local timezone">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Training requirements">
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Team size, workplace context and learning objectives"
            />
          </Field>
        </section>
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              {list.length} suitable {list.length === 1 ? "tutor" : "tutors"}
            </h2>
            <Input
              className="max-w-xs"
              aria-label="Search tutors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tutors or cities…"
            />
          </div>
          {list.length === 0 ? (
            <Empty>No tutors match these preferences yet.</Empty>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {list.map((p) => (
                <HubProfileCard
                  key={p.id}
                  profile={p}
                  reasons={[
                    ...matchReasons(p, needs),
                    ...(available(p.id).length ? ["Upcoming availability"] : []),
                  ]}
                  available={available(p.id).length}
                  details={{
                    language,
                    level,
                    goal,
                    budget,
                    mode,
                    preferred_date: date,
                    notes,
                    training,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
