import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Report } from "@/components/campaigns/Report";
import { AGRI_SAMPLE_QUESTIONS, type ResponseRow } from "@/lib/campaigns";
import type { Campaign } from "@/lib/campaigns-data";

const QS = AGRI_SAMPLE_QUESTIONS.map((q, i) => ({ ...q, id: `q${i}` }));
const ENGINE = QS[0]?.options ?? [];

// Illustrative sample answers in the attached agri-machinery format — not real dealers.
const RAW: [string, string, string, number, string, string, number, string, string, string, string][] = [
  ["Sample Punjab Agro Traders", "Punjab", "03AABCP1234A1Z5", 4, "12%", "10 units", 0, "Needs 30cm clearance for wet paddy", "48 hours", "SMAM subsidy essential", "Strengthen transplanting arm"],
  ["Sample Haryana Krishi Kendra", "Haryana", "06AACCH5678B1Z2", 5, "10%", "15 units", 0, "Standard clearance is fine", "24 hours", "Budni test certificate required", "Diesel parts must be local"],
  ["Sample Ludhiana Farm Equip", "Punjab", "03AADCL9012C1Z8", 3, "15%", "5 units", 1, "Raise chassis for clay soil", "72 hours", "Subsidy needed for small farmers", "Hindi manual please"],
  ["Sample UP Kisan Machinery", "Uttar Pradesh", "09AAECU3456D1Z1", 4, "12%", "20 units", 0, "Muddy fields need wider wheels", "48 hours", "State subsidy portal listing", "Price is key concern"],
  ["Sample Andhra Rice Tech", "Andhra Pradesh", "37AAFCA7890E1Z4", 5, "8%", "25 units", 2, "Works on delta soil", "24 hours", "Budni required", "Battery option attractive"],
  ["Sample Telangana Agri Hub", "Telangana", "36AAGCT2345F1Z7", 3, "15%", "8 units", 0, "Clearance ok", "1 week", "Subsidy essential", "Service network worry"],
  ["Sample Bengal Paddy Partners", "West Bengal", "19AAHCB6789G1Z0", 2, "18%", "3 units", 1, "Small plots, needs compact size", "72 hours", "Cooperative financing needed", "Too expensive vs Chinese"],
  ["Sample TN Delta Dealers", "Tamil Nadu", "33AAICT0123H1Z3", 4, "12%", "12 units", 0, "Rough terrain kit needed", "48 hours", "Budni test certificate required", "Tamil labels help"],
  ["Sample Karnataka Krishi", "Karnataka", "INVALID-GST", 3, "20%", "2 units", 2, "Hilly region adaptation", "1 week", "Subsidy needed", "Demo at mandi helps"],
  ["Sample Bihar Agro Mart", "Bihar", "10AAJCB4567J1Z6", 4, "10%", "18 units", 0, "Flood plain soil, raise clearance", "48 hours", "State subsidy portal listing", "Strong demand from FPOs"],
];

const RESPONSES: ResponseRow[] = RAW.map((r, i) => ({
  id: `sample-${i}`, dealer_name: r[0], territory: r[1], gstin: r[2], price_rating: r[3], margin: r[4], pilot_volume: r[5],
  answers: { q0: ENGINE[r[6]], q1: r[7], q2: r[8], q3: r[9], q4: r[10] },
}));

const CAMPAIGN = {
  id: "sample", sme_id: "sample", vendor_id: null, product_name_en: "Sample Rice Transplanter", product_name_jp: "田植機（サンプル）",
  industry: "Agri-machinery", description: "", photo_path: null, target_price_jpy: null, mrp_inr: null,
  target_states: [], dealer_types: [], target_responses: 20, deadline: null, bis_status: "not_started",
  custom_questions: QS, status: "data_review", public_token: "sample", quote_price_inr: null, quote_timeline_days: null,
  quote_note: null, vendor_commentary: "", clarification_note: null, created_at: "", updated_at: "",
} as unknown as Campaign;

export function SampleReportButton() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline"><BarChart3 /> Preview Sample Report</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader><DialogTitle>Sample report — Rice Transplanter</DialogTitle></DialogHeader>
        <p className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">Demo data: these dealers and answers are illustrative examples, not real responses. Actions are disabled in this preview.</p>
        <Report c={CAMPAIGN} responses={RESPONSES} role="sme" />
      </DialogContent>
    </Dialog>
  );
}
