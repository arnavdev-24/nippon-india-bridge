import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { PilotBoard, SectorNav } from "@/components/sectors/SectorUI";
export const Route = createFileRoute("/_authenticated/pilots")({
  head: () => ({ meta: [{ title: "Pilot Project Exchange — Japan2Nippon" }, { name: "description", content: "Post business challenges, receive proposals, select partners and evaluate pilot results." }, { property: "og:title", content: "Pilot Project Exchange — Japan2Nippon" }, { property: "og:description", content: "Post business challenges, receive proposals, select partners and evaluate pilot results." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <>
      <SectorNav />
      <PageHeader kanji="試" title="Pilot Project Exchange" desc="Test before you invest: post a challenge, compare proposals, track milestones and evaluate results." />
      <PilotBoard title="All challenges" />
    </>
  ),
});
