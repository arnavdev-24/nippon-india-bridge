import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { startAssessment, consumeAssessment } from "@/lib/ai/profile-assessment.server";
import { getLovableAiGatewayResponseHeaders } from "@/lib/ai/run-id.server";

export const Route = createFileRoute("/api/public/profile-assessment")({ server: { handlers: {
  POST: async ({ request }) => {
    const bearer = request.headers.get("Authorization");
    if (!bearer?.startsWith("Bearer ")) return Response.json({ message: "Sign in to assess your profile" }, { status: 401 });
    const url = process.env["SUPABASE_URL"], key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return Response.json({ message: "Assessment is not configured" }, { status: 500 });
    const client = createClient<Database>(url, key, { auth: { persistSession: false }, global: { headers: { Authorization: bearer } } });
    const { data: auth, error: authError } = await client.auth.getUser(bearer.slice(7));
    if (authError || !auth.user) return Response.json({ message: "Sign in again to assess your profile" }, { status: 401 });
    const input = z.object({ id: z.string().uuid() }).safeParse(await request.json().catch(() => null));
    if (!input.success) return Response.json({ message: "Invalid profile" }, { status: 400 });
    const { data: profile, error } = await client.from("provider_listings").select("*").eq("id", input.data.id).eq("user_id", auth.user.id).single();
    if (error || !profile) return Response.json({ message: "You can only assess your own registered profile" }, { status: 403 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: block } = await supabaseAdmin.from("profile_ai_access_state").select("*").eq("id", "profile-assessment").maybeSingle();
    if (block) return Response.json({ message: block.message }, { status: block.status });
    if (profile.assessed_at && Date.now() - Date.parse(profile.assessed_at) < 60000) return Response.json({ message: "Please wait a minute before assessing again" }, { status: 429 });
    let pdf: Blob | null = null;
    if (profile.resume_path) {
      const download = await client.storage.from("provider-resumes").download(profile.resume_path);
      if (download.error) return Response.json({ message: "Your résumé could not be read; upload it again" }, { status: 400 });
      pdf = download.data;
      if (pdf.size > 5 * 1024 * 1024 || (await pdf.slice(0, 5).text()) !== "%PDF-") return Response.json({ message: "Upload a valid PDF résumé, 5 MB or smaller" }, { status: 400 });
    }
    try {
      const upstream = await startAssessment(profile, pdf, request.signal);
      if (!upstream.ok) {
        const detail = await upstream.json().catch(() => ({}));
        const message = detail.message ?? detail.error?.message ?? `AI assessment unavailable (${upstream.status})`;
        if (upstream.status === 402 || upstream.status === 403) await supabaseAdmin.from("profile_ai_access_state").upsert({ id: "profile-assessment", status: upstream.status, message });
        return Response.json({ message }, { status: upstream.status });
      }
      const encoder = new TextEncoder();
      const body = new ReadableStream({ async start(controller) {
        const send = (event: object) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        try {
          send({ progress: true });
          const assessment = await consumeAssessment(upstream, () => send({ progress: true }));
          const result = await supabaseAdmin.from("provider_listings").update({ score: assessment.score, assessment, assessed_at: new Date().toISOString() }).eq("id", profile.id).eq("user_id", auth.user.id).eq("updated_at", profile.updated_at).select("id");
          if (result.error) throw new Error("Could not save your assessment");
          if (!result.data?.length) throw new Error("Your profile changed during assessment; assess the updated profile");
          send({ assessment });
        } catch (e) { send({ message: e instanceof Error ? e.message : "Assessment failed" }); }
        finally { controller.close(); }
      } });
      return new Response(body, { headers: getLovableAiGatewayResponseHeaders(upstream.headers, { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" }) });
    } catch (e) {
      if (request.signal.aborted) return new Response(null, { status: 499 });
      return Response.json({ message: e instanceof Error ? e.message : "Assessment failed" }, { status: 500 });
    }
  },
} } });