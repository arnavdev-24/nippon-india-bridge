import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SectorNav } from "@/components/sectors/SectorUI";
import { LangToggle } from "@/lib/i18n";
export const Route = createFileRoute("/_authenticated/trust-center")({
  head: () => ({ meta: [{ title: "Trust & Localization Center — Japan2Nippon" }, { name: "description", content: "Verification policy, Japanese–English–Hindi support, cultural guides and language training." }, { property: "og:title", content: "Trust & Localization Center — Japan2Nippon" }, { property: "og:description", content: "Verification policy, Japanese–English–Hindi support, cultural guides and language training." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Trust,
});
const GUIDES = [
  { title: "Meetings & hierarchy", ja: "会議と序列", body: "Indian decisions often involve senior leadership; share agendas early and confirm who signs off. Japanese partners value advance materials and consensus (nemawashi)." },
  { title: "Time & follow-up", ja: "時間とフォローアップ", body: "Confirm deadlines in writing. A polite written recap after each call avoids ambiguity on both sides." },
  { title: "Saying no", ja: "断り方", body: "Both cultures can avoid a direct 'no'. Ask open questions about feasibility rather than yes/no questions." },
  { title: "Relationship building", ja: "関係構築", body: "Trust is built over repeated visits and meals. Plan in-person meetings for key milestones." },
];
function Trust() {
  return (
    <>
      <SectorNav />
      <PageHeader kanji="信" title="Trust & Localization Center" desc="Transparency about data, plus language and cultural support." action={<LangToggle />} />
      <section className="mb-10 rounded-lg border border-primary/40 bg-card p-6">
        <h2 className="text-xl font-bold">Verification policy</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Sector dashboard companies are fictional demo profiles, marked "Demo · unverified".</li>
          <li>Matching ranks profiles by transparent criteria counts; it is not a due-diligence result.</li>
          <li>Pilot challenges and proposals are simulated and saved only in your browser.</li>
          <li>No company on the platform is currently shown as verified. Always conduct your own due diligence.</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Cultural guides · 文化ガイド · सांस्कृतिक मार्गदर्शिका</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((g) => (
            <div key={g.title} className="rounded-lg border border-border bg-card p-5"><h3 className="font-bold">{g.title} <span className="text-sm font-normal text-muted-foreground">{g.ja}</span></h3><p className="mt-2 text-sm">{g.body}</p></div>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap gap-3">
        <Button asChild><Link to="/surveys">Business practice surveys</Link></Button>
        <Button asChild variant="outline"><Link to="/tutors">Japanese–Indian language training</Link></Button>
      </section>
    </>
  );
}
