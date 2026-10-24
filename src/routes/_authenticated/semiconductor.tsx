import { createFileRoute } from "@tanstack/react-router";
import { SectorDashboard } from "@/components/sectors/SectorDashboard";
export const Route = createFileRoute("/_authenticated/semiconductor")({
  head: () => ({ meta: [{ title: "Semiconductor Connect — Japan2Nippon" }, { name: "description", content: "Discover Indian chip-design, PCB, component, testing and manufacturing partners." }, { property: "og:title", content: "Semiconductor Connect — Japan2Nippon" }, { property: "og:description", content: "Discover Indian chip-design, PCB, component, testing and manufacturing partners." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SectorDashboard sector="semiconductor" />,
});
