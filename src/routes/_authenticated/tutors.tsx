import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ExpertDirectory } from "@/components/ExpertDirectory";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/tutors")({
  head: () => ({ meta: [{ title: "Language Training — nippon2japan" }, { name: "description", content: "Japanese and Hindi tutors for employee training." }, { property: "og:title", content: "Language Training" }, { property: "og:description", content: "Train teams in Japanese and Hindi." }] }),
  component: () => {
    const { t } = useT();
    return (
      <>
        <PageHeader kanji="語" title={t("tutors")} desc={t("tutorsDesc")} />
        <ExpertDirectory types={["japanese_tutor", "hindi_tutor"]} kind="tutoring" />
      </>
    );
  },
});
