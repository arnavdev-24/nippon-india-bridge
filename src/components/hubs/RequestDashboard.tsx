import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useMyProfile } from "@/lib/profile";
import { allowedStatuses, requestsQuery, STATUS, type Hub } from "@/lib/hubs";
import { Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Choice, Field } from "./HubControls";

type HubRequest = Awaited<ReturnType<NonNullable<typeof requestsQuery.queryFn>>>[number];
export function RequestDashboard() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const { data: requests = [], isLoading, error } = useQuery(requestsQuery);
  const [direction, setDirection] = useState("Sent");
  const [hub, setHub] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState<HubRequest | null>(null);
  const [meeting, setMeeting] = useState<HubRequest | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  async function update(r: HubRequest, status: string) {
    setBusy(r.id);
    const { error } = await supabase.from("hub_requests").update({ status }).eq("id", r.id);
    setBusy(null);
    if (error) toast.error(error.message);
    else {
      toast.success(`Request ${(STATUS[status] ?? status).toLowerCase()}`);
      qc.invalidateQueries({ queryKey: ["hub-requests"] });
    }
  }
  const list = requests.filter(
    (r) =>
      (direction === "Received" ? r.to_user === me?.id : r.from_user === me?.id) &&
      (!hub || r.hub === hub) &&
      (!status || r.status === status),
  );
  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["Sent", "Received"].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={direction === d ? "ink" : "outline"}
              onClick={() => setDirection(d)}
            >
              {d} ·{" "}
              {
                requests.filter((r) =>
                  d === "Received" ? r.to_user === me?.id : r.from_user === me?.id,
                ).length
              }
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter request hub"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={hub}
            onChange={(e) => setHub(e.target.value)}
          >
            <option value="">All hubs</option>
            <option value="distribution">Distribution</option>
            <option value="jv">Joint ventures</option>
            <option value="tutoring">Language training</option>
          </select>
          <select
            aria-label="Filter request status"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests…</p>
      ) : error ? (
        <p className="text-sm text-destructive">Could not load requests. Please refresh.</p>
      ) : list.length === 0 ? (
        <Empty>No {direction.toLowerCase()} requests in this view.</Empty>
      ) : (
        <div className="space-y-4">
          {list.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-primary">
                    {r.hub === "distribution"
                      ? "DISTRIBUTION"
                      : r.hub === "jv"
                        ? "COLLABORATION"
                        : "LANGUAGE TRAINING"}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{r.subject}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {direction === "Sent"
                      ? r.to?.company_name || r.to?.full_name
                      : r.from?.company_name || r.from?.full_name}{" "}
                    · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded bg-muted px-3 py-1 text-xs ${r.status === "accepted" || r.status === "partnership_established" ? "text-success" : r.status === "declined" ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {STATUS[r.status]}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm">{r.message}</p>
              <RequestDetails details={r.details} />
              {r.meeting_at && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-primary">
                  <Calendar className="h-4 w-4" />
                  {new Date(r.meeting_at).toLocaleString()} · {r.meeting_mode?.replace("_", " ")} ·{" "}
                  <span className="break-all">{r.meeting_location}</span>
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" onClick={() => setActive(r)}>
                  <MessageCircle className="h-4 w-4" />
                  Conversation
                </Button>
                {allowedStatuses(r.hub as Hub, r.status, r.to_user === me?.id).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={s === "accepted" ? "default" : "outline"}
                    disabled={busy === r.id}
                    onClick={() => (s === "meeting_scheduled" ? setMeeting(r) : update(r, s))}
                  >
                    {s === "meeting_scheduled"
                      ? "Schedule meeting"
                      : s === "accepted"
                        ? "Accept"
                        : s === "declined"
                          ? "Decline"
                          : STATUS[s]}
                  </Button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
      <Dialog
        open={!!active}
        onOpenChange={(v) => {
          if (!v) setActive(null);
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{active?.subject} · Conversation</DialogTitle>
          </DialogHeader>
          {active && me && <Conversation request={active} userId={me.id} />}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!meeting}
        onOpenChange={(v) => {
          if (!v) setMeeting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a meeting</DialogTitle>
          </DialogHeader>
          {meeting && <MeetingForm request={meeting} onSaved={() => setMeeting(null)} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
function RequestDetails({ details }: { details: Json }) {
  if (!details || Array.isArray(details) || typeof details !== "object") return null;
  const entries = Object.entries(details).filter(
    ([, v]) => v !== null && v !== undefined && v !== "" && (!Array.isArray(v) || v.length > 0),
  );
  return entries.length ? (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer text-muted-foreground">Request brief</summary>
      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
        {entries.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs capitalize text-muted-foreground">{k.replaceAll("_", " ")}</dt>
            <dd className="break-words">{Array.isArray(v) ? v.join(", ") : String(v)}</dd>
          </div>
        ))}
      </dl>
    </details>
  ) : null;
}
function Conversation({ request, userId }: { request: HubRequest; userId: string }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const { data: messages = [], error } = useQuery({
    queryKey: ["hub-messages", request.id],
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_messages")
        .select("*")
        .eq("request_id", request.id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const closed = ["declined", "cancelled", "completed", "partnership_established"].includes(
    request.status,
  );
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("hub_messages")
      .insert({ request_id: request.id, sender_id: userId, body: body.trim() });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      setBody("");
      qc.invalidateQueries({ queryKey: ["hub-messages", request.id] });
    }
  }
  return (
    <>
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {error ? (
          <p className="text-sm text-destructive">Could not load messages.</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-md p-3 ${m.sender_id === userId ? "ml-6 bg-primary/10" : "mr-6 bg-muted"}`}
            >
              <p className="text-xs text-muted-foreground">
                {m.sender_id === userId ? "You" : "Partner"} ·{" "}
                {new Date(m.created_at).toLocaleString()}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.body}</p>
            </div>
          ))
        )}
      </div>
      {closed ? (
        <p className="text-xs text-muted-foreground">
          This request is closed. Messages remain available to its participants.
        </p>
      ) : (
        <form onSubmit={send} className="space-y-3">
          <Textarea
            aria-label="Private message"
            rows={3}
            maxLength={4000}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a private message…"
          />
          <Button type="submit" disabled={busy || !body.trim()}>
            <Send className="h-4 w-4" />
            {busy ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </>
  );
}
function MeetingForm({ request, onSaved }: { request: HubRequest; onSaved: () => void }) {
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!date || new Date(date).getTime() <= Date.now()) {
      toast.error("Choose a future meeting time");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("hub_requests")
      .update({
        status: "meeting_scheduled",
        meeting_at: new Date(date).toISOString(),
        meeting_mode: mode,
        meeting_location: location.trim(),
      })
      .eq("id", request.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Meeting scheduled");
      qc.invalidateQueries({ queryKey: ["hub-requests"] });
      onSaved();
    }
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label="Date and time · your local timezone">
        <Input
          required
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>
      <Field label="Meeting mode">
        <Choice
          value={mode}
          onChange={setMode}
          options={["online", "in_person"]}
          placeholder="Select meeting mode"
        />
      </Field>
      <Field label={mode === "online" ? "Meeting link (provided by you)" : "Meeting address"}>
        <Input
          required
          type={mode === "online" ? "url" : "text"}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Schedule meeting"}
      </Button>
    </form>
  );
}
