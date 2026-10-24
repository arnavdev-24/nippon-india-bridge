import { SERVICES, type ServiceKey } from "@/lib/tax-compliance";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export function RequirementsStep({ services, notes, onToggle, onNotes, onBack, onNext }: {
  services: ServiceKey[];
  notes: string;
  onToggle: (s: ServiceKey) => void;
  onNotes: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Understand your compliance needs</h2>
      <p className="mt-1 text-sm text-muted-foreground">Select everything you need help with — you can choose more than one.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((svc) => {
          const active = services.includes(svc.key);
          return (
            <button
              key={svc.key}
              onClick={() => onToggle(svc.key)}
              className={`relative rounded-lg border bg-card p-4 text-left shadow-paper transition-colors ${
                active ? "border-primary ring-1 ring-ring" : "border-border hover:border-primary/50"
              }`}
            >
              {active && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div className="pr-6 font-bold">{svc.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{svc.desc}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <Label htmlFor="tc-notes">Tell us briefly about your business or the challenge you are facing (optional)</Label>
        <Textarea
          id="tc-notes"
          className="mt-2"
          rows={3}
          maxLength={1000}
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="e.g. We are a Japanese auto-parts maker planning a plant in Chennai…"
        />
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={services.length === 0}>Find matching experts</Button>
      </div>
    </div>
  );
}
