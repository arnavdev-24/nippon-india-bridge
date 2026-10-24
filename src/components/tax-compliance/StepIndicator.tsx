const STEPS = ["Industry", "Profile & States", "Diagnosis", "Advisor Match", "Consultation", "Confirmation"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-y-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
              i < current
                ? "border-primary bg-primary text-primary-foreground"
                : i === current
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
            }`}
          >
            {i + 1}
          </span>
          <span className={`ml-2 text-xs sm:text-sm ${i === current ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="mx-2 h-px w-4 bg-border sm:mx-3 sm:w-8 md:w-10" />}
        </li>
      ))}
    </ol>
  );
}
