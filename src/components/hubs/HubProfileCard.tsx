import { useState } from "react";
import { MapPin, Video, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { HubProfile } from "@/lib/hubs";
import { Button } from "@/components/ui/button";
import { HubRequestDialog } from "./HubRequestDialog";

export function HubProfileCard({profile:p,reasons=[],details={},available}:{profile:HubProfile;reasons?:string[];details?:Record<string,Json|undefined>;available?:number}){
 const [video,setVideo]=useState("");const [expanded,setExpanded]=useState(false);
 async function watch(){if(!p.pitch_path)return;const {data,error}=await supabase.storage.from("company-pitches").createSignedUrl(p.pitch_path,3600);if(error)toast.error(error.message);else setVideo(data.signedUrl);}
 return <article className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-paper">
  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span>{p.hub==="tutoring"?p.categories.join(" · "):p.industry}</span><span>{p.country==="Japan"?"🇯🇵 Japan":"🇮🇳 India"}</span></div>
  <h3 className="mt-3 break-words text-xl font-bold">{p.name}</h3><div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0"/>{[p.city,p.state].filter(Boolean).join(", ")}</div>
  {reasons.length>0&&<div className="mt-3 flex flex-wrap gap-1">{reasons.map(r=><span key={r} className="rounded bg-success/10 px-2 py-1 text-xs text-success">{r}</span>)}</div>}
  <p className={`mt-4 break-words text-sm text-muted-foreground ${expanded?"":"line-clamp-3"}`}>{p.bio}</p>
  {p.hub==="distribution"&&<dl className="mt-4 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">Product expertise</dt><dd>{p.categories.join(", ")||"Not specified"}</dd></div><div><dt className="text-xs text-muted-foreground">Service areas</dt><dd>{p.service_areas.join(", ")}</dd></div>{expanded&&<><div><dt className="text-xs text-muted-foreground">Customers</dt><dd>{p.customers.join(", ")||"Not specified"}</dd></div><div><dt className="text-xs text-muted-foreground">Capabilities</dt><dd>{p.capabilities.join(", ")||"Not specified"}</dd></div></>}</dl>}
  {p.hub==="jv"&&<div className="mt-4 space-y-3 text-sm"><div><span className="text-xs font-medium text-primary">WE OFFER</span><p className={expanded?"":"line-clamp-2"}>{p.offers}</p></div><div><span className="text-xs font-medium text-primary">SEEKING</span><p className={expanded?"":"line-clamp-2"}>{p.seeking}</p></div><div className="flex flex-wrap gap-1">{p.technologies.map(t=><span key={t} className="rounded bg-accent px-2 py-1 text-xs text-accent-foreground">{t}</span>)}</div>{expanded&&p.goals&&<p><b>Goals:</b> {p.goals}</p>}</div>}
  {p.hub==="tutoring"&&<div className="mt-4 space-y-2 text-sm"><p>{p.experience_years} years experience · {p.levels.join(", ")}</p><p className="font-semibold">₹{p.fee_inr.toLocaleString("en-IN")}/hour</p><p className="text-xs text-muted-foreground">{[p.online?"Online":null,p.in_person?"In person":null].filter(Boolean).join(" · ")}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3"/>{available??0} upcoming slots</p><p className={expanded?"":"line-clamp-2"}>{p.qualifications}</p><p className={`flex items-center gap-1 text-xs ${p.qualification_verified?"text-success":"text-muted-foreground"}`}>{p.qualification_verified&&<ShieldCheck className="h-3 w-3"/>}{p.qualification_verified?"Qualifications independently verified":"Qualifications self-reported · not verified"}</p>{expanded&&<p>Training: {p.capabilities.join(", ")}</p>}</div>}
  {video&&<video controls className="mt-4 aspect-video w-full rounded-md bg-ink" src={video} preload="metadata"/>}
  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4"><Button size="sm" variant="ghost" onClick={()=>setExpanded(!expanded)}>{expanded?"Less":"Full profile"}</Button>{p.pitch_path&&!video&&<Button size="sm" variant="outline" onClick={watch}><Video className="h-4 w-4"/>Watch pitch</Button>}<HubRequestDialog profile={p} details={details}/>{expanded&&p.contact_email&&<a className="break-all text-sm text-primary underline" href={`mailto:${p.contact_email}`}>{p.contact_email}</a>}</div>
 </article>;
}