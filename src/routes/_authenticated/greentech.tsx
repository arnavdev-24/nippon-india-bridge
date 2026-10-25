import { createFileRoute } from "@tanstack/react-router";
import { SectorDashboard } from "@/components/sectors/SectorDashboard";
export const Route = createFileRoute("/_authenticated/greentech")({
  head: () => ({
    meta: [
      { title: "GreenTech Alliance — nippon2bharat" },
      { name: "description", content: "Solar, wind, EV, recycling and energy-efficiency partnerships with a Carbon Reduction Challenge Board." },
      { property: "og:title", content: "GreenTech Alliance — nippon2bharat" },
      { property: "og:description", content: "Solar, wind, EV, recycling and energy-efficiency partnerships with a Carbon Reduction Challenge Board." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SectorDashboard sector="greentech" />,
});
