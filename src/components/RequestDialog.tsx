import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMyProfile } from "@/lib/profile";

type Kind = "advisory" | "jv" | "tutoring" | "distribution";

export function RequestDialog({ toUser, toName, kind, label = "Connect", defaultMessage = "" }: {
  toUser: string; toName: string; kind: Kind; label?: string; defaultMessage?: string;
}) {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(defaultMessage);
  const [busy, setBusy] = useState(false);

  if (me?.id === toUser) return <span className="text-xs text-muted-foreground">You</span>;

  async function send() {
    if (!me) return;
    setBusy(true);
    const { error } = await supabase.from("connection_requests").insert({ from_user: me.id, to_user: toUser, kind, message: msg.slice(0, 1000) });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Request sent to ${toName}`);
    qc.invalidateQueries({ queryKey: ["connections"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm">{label}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Message {toName}</DialogTitle></DialogHeader>
        <Textarea rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Introduce your company and what you need…" />
        <Button onClick={send} disabled={busy || !msg.trim()}>{busy ? "Sending…" : "Send request"}</Button>
      </DialogContent>
    </Dialog>
  );
}
