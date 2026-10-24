import { INDUSTRIES, type IndustryKey } from "@/lib/tax-compliance";
import { Button } from "@/components/ui/button";

export function IndustryStep({ value, onChange, onNext }: {
  value: IndustryKey | "";
  onChange: (v: IndustryKey) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Select your industry</h2>
      <p className="mt-1 text-sm text-muted-foreground">We match experts by industry expertise first.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.key}
            onClick={() => onChange(ind.key)}
            className={`rounded-lg border bg-card p-4 text-left shadow-paper transition-colors ${
              value === ind.key ? "border-primary ring-1 ring-ring" : "border-border hover:border-primary/50"
            }`}
          >
            <ind.icon className={`h-6 w-6 ${value === ind.key ? "text-primary" : "text-muted-foreground"}`} />
            <div className="mt-3 font-bold">{ind.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{ind.desc}</div>
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!value}>Continue</Button>
      </div>
    </div>
  );
}
