import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Hub = "distribution" | "jv" | "tutoring";
export type HubProfile = Tables<"hub_profiles">;
export const INDUSTRIES = ["Automotive", "Electronics & IT", "Industrial Manufacturing", "Healthcare", "Food & Beverages", "Consumer Goods", "Energy", "Logistics", "Education", "Other"];
export const CATEGORIES = ["Networking & IT", "Electronics", "Musical instruments", "Medical imaging", "Motors & drives", "Robotics", "Automotive components", "Food products", "Consumer goods", "Other"];
export const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Lakshadweep", "Dadra and Nagar Haveli and Daman and Diu"];
export const LANGUAGES = ["Japanese", "Hindi", "English", "Tamil", "Bengali", "Marathi", "Other"];
export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Business"];
export const TECHNOLOGIES = ["Robotics", "AI", "Automation", "Advanced manufacturing", "Clean energy", "IoT", "Medical technology"];
export const STATUS: Record<string,string> = { pending: "Pending", accepted: "Accepted", declined: "Declined", in_discussion: "In Discussion", meeting_scheduled: "Meeting Scheduled", partnership_established: "Partnership Established", completed: "Completed", cancelled: "Cancelled" };
export const split = (value: string) => value.split(",").map(s => s.trim()).filter(Boolean);
export const hubProfilesQuery = (hub: Hub) => queryOptions({ queryKey: ["hub-profiles",hub], queryFn: async () => {
  const {data,error} = await supabase.from("hub_profiles").select("*").eq("hub",hub).order("updated_at",{ascending:false});
  if(error) throw error; return data;
}});
export const slotsQuery = queryOptions({queryKey:["tutor-slots"],queryFn:async()=>{
  const {data,error}=await supabase.from("tutor_slots").select("*").gte("starts_at",new Date().toISOString()).order("starts_at"); if(error)throw error;return data;
}});
export const requestsQuery = queryOptions({queryKey:["hub-requests"],queryFn:async()=>{
  const {data,error}=await supabase.from("hub_requests").select("*, from:profiles!hub_requests_from_user_fkey(full_name,company_name), to:profiles!hub_requests_to_user_fkey(full_name,company_name)").order("created_at",{ascending:false});if(error)throw error;return data;
}});
export type MatchNeeds = { industry?:string; category?:string; states?:string[]; customers?:string[]; capabilities?:string[]; technologies?:string[]; language?:string; level?:string; budget?:number; mode?:string };
export function matchReasons(p: Pick<HubProfile,"industry"|"categories"|"service_areas"|"customers"|"capabilities"|"technologies"|"levels"|"fee_inr"|"online"|"in_person">, n:MatchNeeds) {
  const reasons:string[]=[];
  if(n.industry && p.industry===n.industry)reasons.push("Industry expertise");
  if(n.category && p.categories.includes(n.category))reasons.push("Product expertise");
  if(n.states?.some(s=>p.service_areas.includes(s)||p.service_areas.includes("Nationwide")))reasons.push("Target region coverage");
  if(n.customers?.some(s=>p.customers.includes(s)))reasons.push("Target customers");
  if(n.capabilities?.some(s=>p.capabilities.includes(s)))reasons.push("Distribution capabilities");
  if(n.technologies?.some(s=>p.technologies.includes(s)))reasons.push("Technology fit");
  if(n.language&&p.categories.includes(n.language))reasons.push("Language match");
  if(n.level&&p.levels.includes(n.level))reasons.push("Proficiency level");
  if(n.budget!==undefined&&p.fee_inr<=n.budget)reasons.push("Within budget");
  return reasons;
}
export function allowedStatuses(hub:Hub,status:string,recipient:boolean){
  if(status==="pending")return recipient?["accepted","declined"]:["cancelled"];
  if(["declined","cancelled","completed","partnership_established"].includes(status))return [];
  return hub==="tutoring"?["meeting_scheduled","completed","cancelled"]:["in_discussion","meeting_scheduled","partnership_established","cancelled"];
}
export const BUSINESS_EXAMPLES = [
 {name:"Nippon Enterprises South",city:"Chennai",industry:"Electronics & IT",categories:["Musical instruments","Medical imaging"],service_areas:["Nationwide","Tamil Nadu"],customers:[],capabilities:["Dealer network","After-sales service"],technologies:[],levels:[],fee_inr:0,online:false,in_person:false,bio:"Musical instruments, pro audio and imaging distribution. The company reports 400+ dealers nationwide; medical imaging distribution and service in Tamil Nadu.",source:"https://nipponenterprises.in/"},
 {name:"Dataforce",city:"Mumbai, Pune & Ahmedabad",industry:"Electronics & IT",categories:["Networking & IT"],service_areas:["Maharashtra","Gujarat"],customers:[],capabilities:["Dealer network"],technologies:[],levels:[],fee_inr:0,online:false,in_person:false,bio:"Networking products, wireless and switching equipment, structured cabling and rack-management solutions, focused on western India.",source:"https://dataforce.in/"},
 {name:"Win Win Distribution",city:"Southern India",industry:"Industrial Manufacturing",categories:["Motors & drives"],service_areas:["Telangana","Andhra Pradesh","Karnataka","Tamil Nadu"],customers:[],capabilities:[],technologies:[],levels:[],fee_inr:0,online:false,in_person:false,bio:"Industrial electromechanical products including motors, VFDs, pumps and gearboxes across four southern states.",source:"https://winwindistribution.in/"},
];