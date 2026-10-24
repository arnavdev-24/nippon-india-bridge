import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ENTITY_TYPES, type EntityType } from "@/lib/market-entry";
import { STATES } from "@/lib/hubs";
import { Building2, Globe2, IndianRupee, Layers, Check } from "lucide-react";

interface Props {
  states: string[];
  onStatesChange: (states: string[]) => void;
  entity: EntityType;
  onEntityChange: (entity: EntityType) => void;
  investmentInrCr: number;
  onInvestmentChange: (val: number) => void;
  expectedTurnoverInrLakh: number;
  onTurnoverChange: (val: number) => void;
  sellsGoods: boolean;
  onSellsGoodsChange: (val: boolean) => void;
  importsGoods: boolean;
  onImportsGoodsChange: (val: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

const COMMON_STATES = [
  "Tamil Nadu",
  "Gujarat",
  "Maharashtra",
  "Karnataka",
  "Haryana",
  "Uttar Pradesh",
  "Telangana",
  "Andhra Pradesh",
  "Rajasthan",
  "Delhi",
];

export function ProfileStep({
  states,
  onStatesChange,
  entity,
  onEntityChange,
  investmentInrCr,
  onInvestmentChange,
  expectedTurnoverInrLakh,
  onTurnoverChange,
  sellsGoods,
  onSellsGoodsChange,
  importsGoods,
  onImportsGoodsChange,
  onBack,
  onNext,
}: Props) {
  const [selectedStateInput, setSelectedStateInput] = useState("");

  const toggleState = (s: string) => {
    if (states.includes(s)) {
      onStatesChange(states.filter((x) => x !== s));
    } else {
      onStatesChange([...states, s]);
    }
  };

  const handleAddState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !states.includes(val)) {
      onStatesChange([...states, val]);
    }
    setSelectedStateInput("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configure Your India Operation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your corporate vehicle, operating states, and trade model determine statutory FDI approvals, GST liability, and licensing.
        </p>
      </div>

      {/* 1. Entity Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <Label className="text-sm font-bold">Planned Corporate Entity in India</Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENTITY_TYPES.map((et) => {
            const active = entity === et.key;
            return (
              <button
                key={et.key}
                type="button"
                onClick={() => onEntityChange(et.key)}
                className={`relative rounded-xl border p-4 text-left shadow-paper transition-all ${
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {active && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="font-bold text-sm text-foreground">{et.name}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{et.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Operating States */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            <Label className="text-sm font-bold">Target Operating States / Locations</Label>
          </div>
          <span className="text-xs text-muted-foreground">
            {states.length === 0 ? "Select at least one state" : `${states.length} state(s) selected`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {COMMON_STATES.map((s) => {
            const active = states.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleState(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {active ? "✓ " : "+ "}
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <select
            value={selectedStateInput}
            onChange={handleAddState}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
          >
            <option value="">Add other Indian state / Union Territory…</option>
            {STATES.filter((s) => !states.includes(s)).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Trade & Supply Chain Model */}
      <div className="space-y-4 rounded-xl border border-border/80 bg-card p-5 shadow-paper">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <Label className="text-sm font-bold">Trade Model & Supply Chain</Label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Primary Offering</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={sellsGoods ? "default" : "outline"}
                onClick={() => onSellsGoodsChange(true)}
                className="flex-1"
              >
                Physical Goods / Manufacturing
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!sellsGoods ? "default" : "outline"}
                onClick={() => onSellsGoodsChange(false)}
                className="flex-1"
              >
                Services / Software
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Imports from Japan / Overseas</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={importsGoods ? "default" : "outline"}
                onClick={() => onImportsGoodsChange(true)}
                className="flex-1"
              >
                Yes (Raw materials / Finished products)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!importsGoods ? "default" : "outline"}
                onClick={() => onImportsGoodsChange(false)}
                className="flex-1"
              >
                No (100% Domestic Sourcing)
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <div>
            <Label htmlFor="inv-cr" className="text-xs">
              Proposed FDI Capital Inflow (₹ Crores)
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground">₹</span>
              <Input
                id="inv-cr"
                type="number"
                min="0"
                step="0.5"
                value={investmentInrCr || ""}
                onChange={(e) => onInvestmentChange(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 5 (Approx. ¥90M JPY)"
                className="pl-7 text-xs"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">₹1 Crore ≈ ¥18,000,000 JPY / $120,000 USD</p>
          </div>

          <div>
            <Label htmlFor="turnover-lakh" className="text-xs">
              Projected Year-1 Indian Turnover (₹ Lakhs)
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground">₹</span>
              <Input
                id="turnover-lakh"
                type="number"
                min="0"
                step="5"
                value={expectedTurnoverInrLakh || ""}
                onChange={(e) => onTurnoverChange(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 100 (₹1 Crore)"
                className="pl-7 text-xs"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">GST mandatory threshold: ₹40L (goods) / ₹20L (services)</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-border pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={states.length === 0}
          className="shadow-paper"
        >
          Generate Statutory Diagnosis
        </Button>
      </div>
    </div>
  );
}
