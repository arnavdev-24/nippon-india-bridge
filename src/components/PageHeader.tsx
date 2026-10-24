import type { ReactNode } from "react";

export function PageHeader({
  kanji,
  title,
  desc,
  action,
}: {
  kanji: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-border/80 pb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-serif text-xs font-bold text-primary shadow-xs">
            {kanji}
          </span>
          <span className="text-[11px] font-mono tracking-widest text-primary font-semibold uppercase">
            Bilateral Corridor
          </span>
        </div>
        <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {desc && (
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-card/50 p-12 text-center text-xs text-muted-foreground shadow-paper">
      <div className="mx-auto max-w-sm leading-relaxed">{children}</div>
    </div>
  );
}
