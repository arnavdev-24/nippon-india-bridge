import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SECTIONS, registrationSchema, validateResume, type ProviderSection } from "@/lib/provider-registration";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = z.infer<typeof registrationSchema>;

interface Props {
  section: ProviderSection;
  trigger?: React.ReactNode;
}

interface AssessmentResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i + 1 === step
                ? "bg-primary text-primary-foreground"
                : i + 1 < step
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1 < step ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-px w-6 transition-colors ${i + 1 < step ? "bg-emerald-500" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function FieldRow({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RegisterAsPartnerDialog({ section, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [assessError, setAssessError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sec = SECTIONS[section];
  const hasTypes = sec.types.length > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger: triggerValidation,
    getValues,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      section,
      country: "India",
      organization: "",
      resume_path: null,
    },
  });

  // ─── Open/Close ─────────────────────────────────────────────────────────────

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (!val) {
      // reset all state when closing
      setStep(1);
      setSubmitting(false);
      setSubmitted(false);
      setListingId(null);
      setResumeFile(null);
      setResumeError(null);
      setAssessing(false);
      setAssessment(null);
      setAssessError(null);
      reset({ section, country: "India", organization: "", resume_path: null });
    }
  };

  // ─── Step navigation ─────────────────────────────────────────────────────────

  const STEP1_FIELDS: (keyof FormValues)[] = [
    "full_name",
    "specialization",
    "experience_years",
    "industry",
    "city",
    "state",
    "email",
    "phone",
  ];

  const goNext = async () => {
    const valid = await triggerValidation(STEP1_FIELDS);
    if (valid) setStep(2);
  };

  // ─── PDF handling ────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeError(null);
    try {
      validateResume(file);
      setResumeFile(file);
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : String(err));
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error("You must be signed in to register.");

      let resume_path: string | null = null;

      // Upload PDF if selected
      if (resumeFile) {
        const ext = ".pdf";
        const uuid = crypto.randomUUID();
        const path = `${user.id}/${uuid}${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("provider-resumes")
          .upload(path, resumeFile, { contentType: "application/pdf", upsert: false });
        if (uploadError) throw new Error(`Resume upload failed: ${uploadError.message}`);
        resume_path = path;
      }

      // Insert provider listing
      const { data: inserted, error: insertError } = await supabase
        .from("provider_listings")
        .insert({
          user_id: user.id,
          section: data.section,
          full_name: data.full_name,
          organization: data.organization ?? "",
          specialization: data.specialization,
          experience_years: data.experience_years,
          industry: data.industry,
          city: data.city,
          state: data.state,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
          resume_path,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);
      setListingId(inserted.id);
      setSubmitted(true);
    } catch (err) {
      // surface error under the form
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── AI Assessment ───────────────────────────────────────────────────────────

  const runAssessment = async () => {
    if (!listingId) return;
    setAssessing(true);
    setAssessError(null);
    setAssessment(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch("/api/public/profile-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: listingId }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Assessment request failed (${res.status})`);
      }

      // Read NDJSON line by line
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastParsed: AssessmentResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed.score === "number") {
              lastParsed = parsed as AssessmentResult;
            }
          } catch {
            // partial or non-JSON line — ignore
          }
        }
      }

      // Handle remaining buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          if (parsed && typeof parsed.score === "number") {
            lastParsed = parsed as AssessmentResult;
          }
        } catch {
          // ignore
        }
      }

      if (lastParsed) {
        setAssessment(lastParsed);
      } else {
        throw new Error("No assessment result received.");
      }
    } catch (err) {
      setAssessError(err instanceof Error ? err.message : String(err));
    } finally {
      setAssessing(false);
    }
  };

  // ─── Trigger button ──────────────────────────────────────────────────────────

  const defaultTrigger = (
    <Button size="sm" className="shadow-paper" onClick={() => setOpen(true)}>
      Register as {sec.singular}
    </Button>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger */}
      <span
        onClick={() => setOpen(true)}
        className="contents"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {trigger ?? defaultTrigger}
      </span>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Register as {sec.singular}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {sec.title} · All fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          {/* ── Success state ────────────────────────────────────────────────── */}
          {submitted ? (
            <div className="space-y-4 py-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ Registration submitted!
                </p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Your profile will be reviewed by our team. You may request an AI pre-assessment
                  below.
                </p>
              </div>

              {/* Assessment result */}
              {assessment ? (
                <div className="rounded-xl border border-border bg-card p-5 shadow-paper space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">AI Assessment</p>
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                      {assessment.score.toFixed(1)} / 10
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {assessment.summary}
                  </p>
                  {assessment.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Strengths</p>
                      <ul className="space-y-0.5">
                        {assessment.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-emerald-700 dark:text-emerald-400 flex gap-1.5">
                            <span>✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {assessment.gaps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Areas to develop</p>
                      <ul className="space-y-0.5">
                        {assessment.gaps.map((g, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                            <span>·</span> {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full shadow-paper"
                    onClick={runAssessment}
                    disabled={assessing}
                  >
                    {assessing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        Analysing your profile…
                      </span>
                    ) : (
                      "Get AI Assessment"
                    )}
                  </Button>
                  {assessError && (
                    <p className="text-xs text-destructive">✗ {assessError}</p>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpen(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            /* ── Form ──────────────────────────────────────────────────────── */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <StepIndicator step={step} total={2} />
                <span className="text-xs text-muted-foreground">
                  Step {step} of 2
                </span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  {/* Section badge (read-only) */}
                  <FieldRow label="Section">
                    <div className="inline-flex items-center rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                      {sec.title}
                    </div>
                  </FieldRow>

                  <FieldRow label="Full name" error={errors.full_name?.message} required>
                    <Input placeholder="Your full name" {...register("full_name")} />
                  </FieldRow>

                  <FieldRow label="Organisation (optional)" error={errors.organization?.message}>
                    <Input placeholder="Company or firm name" {...register("organization")} />
                  </FieldRow>

                  <FieldRow
                    label="Specialization"
                    error={errors.specialization?.message}
                    required
                  >
                    {hasTypes ? (
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...register("specialization")}
                      >
                        <option value="">Select specialization…</option>
                        {(sec.types as readonly string[]).map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="Your area of expertise"
                        {...register("specialization")}
                      />
                    )}
                  </FieldRow>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldRow
                      label="Years of experience"
                      error={errors.experience_years?.message}
                      required
                    >
                      <Input
                        type="number"
                        min="0"
                        max="80"
                        placeholder="e.g. 5"
                        {...register("experience_years")}
                      />
                    </FieldRow>

                    <FieldRow label="Industry" error={errors.industry?.message} required>
                      <Input placeholder="e.g. Finance" {...register("industry")} />
                    </FieldRow>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldRow label="City" error={errors.city?.message} required>
                      <Input placeholder="e.g. Mumbai" {...register("city")} />
                    </FieldRow>

                    <FieldRow label="State" error={errors.state?.message} required>
                      <Input placeholder="e.g. Maharashtra" {...register("state")} />
                    </FieldRow>
                  </div>

                  <FieldRow label="Email" error={errors.email?.message} required>
                    <Input type="email" placeholder="you@example.com" {...register("email")} />
                  </FieldRow>

                  <FieldRow label="Phone" error={errors.phone?.message} required>
                    <Input type="tel" placeholder="+91 98000 00000" {...register("phone")} />
                  </FieldRow>

                  <div className="flex justify-end pt-2">
                    <Button type="button" className="shadow-paper" onClick={goNext}>
                      Next — Profile &amp; Resume →
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FieldRow
                    label="Professional bio"
                    error={errors.bio?.message}
                    required
                  >
                    <Textarea
                      rows={5}
                      placeholder="Describe your experience, credentials, and what you offer — at least 20 characters."
                      className="resize-none"
                      {...register("bio")}
                    />
                  </FieldRow>

                  {/* PDF upload (optional) */}
                  <FieldRow label="Résumé / CV (PDF, optional)" error={resumeError ?? undefined}>
                    <div className="space-y-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                        // Don't register with RHF — we manage manually
                      />
                      {resumeFile && (
                        <p className="text-xs text-emerald-600">
                          ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        PDF only · max 5 MB · uploaded securely to Supabase storage
                      </p>
                    </div>
                  </FieldRow>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 shadow-paper"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                          </svg>
                          Submitting…
                        </span>
                      ) : (
                        "Submit registration"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
