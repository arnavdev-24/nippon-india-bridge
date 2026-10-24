import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/lib/profile";
import { requestsQuery, slotsQuery, type HubProfile } from "@/lib/hubs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "./HubControls";

export function HubRequestDialog({profile,details={},label}:{profile:HubProfile;details?:Record<string,Json|undefined>;label?:string}){
 const {data:me}=useMyProfile();const qc=useQueryClient();const [open,setOpen]=useState(false);const [subject,setSubject]=useState(profile.hub==="tutoring"?"Language training request":"Partnership enquiry");const [message,setMessage]=useState("");const [slot,setSlot]=useState("");const [busy,setBusy]=useState(false);const [employees,setEmployees]=useState(1);
 const {data:slots=[]}=useQuery({...slotsQuery,enabled:open&&profile.hub==="tutoring"});const {data:requests=[]}=useQuery({...requestsQuery,enabled:open&&profile.hub==="tutoring"});
 const available=slots.filter(s=>s.tutor_id===profile.id&&!requests.some(r=>r.slot_id===s.id&&!["declined","cancelled"].includes(r.status)));
 if(me?.id===profile.owner_id)return <span className="text-xs text-muted-foreground">Your profile</span>;
 async function send(e:React.FormEvent){e.preventDefault();if(!me)return;setBusy(true);const {error}=await supabase.from("hub_requests").insert({from_user:me.id,to_user:profile.owner_id,profile_id:profile.id,hub:profile.hub,subject:subject.trim(),message:message.trim(),details:{...details,employees:profile.hub==="tutoring"?employees:undefined},slot_id:profile.hub==="tutoring"?slot:null});setBusy(false);if(error){toast.error(error.code==="23505"?"This slot was just requested. Please choose another.":error.message);qc.invalidateQueries({queryKey:["tutor-slots"]});return;}toast.success("Request sent — track it in Connections");qc.invalidateQueries({queryKey:["hub-requests"]});setOpen(false);setMessage("");}
 return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm"><Send className="h-4 w-4"/>{label??(profile.hub==="tutoring"?"Request training":"Connect")}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Contact {profile.name}</DialogTitle></DialogHeader><form onSubmit={send} className="space-y-4"><Field label="Subject"><Input required maxLength={200} value={subject} onChange={e=>setSubject(e.target.value)}/></Field><Field label="Personalised request"><Textarea required maxLength={4000} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Introduce your goals and the arrangement you have in mind…"/></Field>{profile.hub==="tutoring"&&<><Field label="Learners / employees"><Input type="number" min="1" max="10000" required value={employees} onChange={e=>setEmployees(Number(e.target.value))}/></Field><Field label="Available session · your local timezone"><select required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Choose a session</option>{available.map(s=><option key={s.id} value={s.id}>{new Date(s.starts_at).toLocaleString()} · {s.duration_minutes} min · {s.mode.replace("_"," ")}</option>)}</select></Field>{available.length===0&&<p className="text-sm text-muted-foreground">No sessions available yet. This tutor needs to add availability.</p>}<p className="text-sm text-muted-foreground">₹{profile.fee_inr.toLocaleString("en-IN")}/hour · Group fees to be agreed with the tutor.</p></>}<Button type="submit" disabled={busy||!message.trim()||!subject.trim()||(profile.hub==="tutoring"&&!slot)}>{busy?"Sending…":"Send request"}</Button></form></DialogContent></Dialog>;
}