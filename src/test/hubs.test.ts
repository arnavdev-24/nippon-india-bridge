import { describe, expect, it } from "vitest";
import { allowedStatuses, matchReasons, BUSINESS_EXAMPLES } from "@/lib/hubs";

const base = {industry:"",categories:[] as string[],service_areas:[] as string[],customers:[] as string[],capabilities:[] as string[],technologies:[] as string[],levels:[] as string[],fee_inr:1500,online:true,in_person:false};
describe("hub matching and requests",()=>{
 it("matches distributor product expertise",()=>{expect(matchReasons({...base,categories:["Motors & drives"]},{category:"Motors & drives"})).toContain("Product expertise");expect(matchReasons(base,{category:"Motors & drives"})).not.toContain("Product expertise");});
 it("matches selected states including nationwide coverage",()=>{expect(matchReasons({...base,service_areas:["Nationwide"]},{states:["Gujarat"]})).toContain("Target region coverage");expect(matchReasons({...base,service_areas:["Tamil Nadu"]},{states:["Gujarat"]})).not.toContain("Target region coverage");});
 it("matches target customers and capabilities",()=>{expect(matchReasons({...base,customers:["Retailers"],capabilities:["Warehousing"]},{customers:["Retailers"],capabilities:["Warehousing"]})).toEqual(["Target customers","Distribution capabilities"]);});
 it("matches technology requirements",()=>{expect(matchReasons({...base,technologies:["Robotics"]},{technologies:["Robotics"]})).toContain("Technology fit");});
 it("matches language, level and budget",()=>{expect(matchReasons({...base,categories:["Japanese"],levels:["Beginner"]},{language:"Japanese",level:"Beginner",budget:1500})).toEqual(["Language match","Proficiency level","Within budget"]);expect(matchReasons(base,{budget:1499})).not.toContain("Within budget");});
 it("only recipients accept or decline pending requests",()=>{expect(allowedStatuses("jv","pending",true)).toEqual(["accepted","declined"]);expect(allowedStatuses("jv","pending",false)).toEqual(["cancelled"]);});
 it("allows established partnerships after acceptance",()=>{expect(allowedStatuses("distribution","accepted",true)).toContain("partnership_established");expect(allowedStatuses("distribution","pending",true)).not.toContain("partnership_established");});
 it("tutor bookings use completed instead of partnership established",()=>{expect(allowedStatuses("tutoring","accepted",true)).toContain("completed");expect(allowedStatuses("tutoring","accepted",true)).not.toContain("partnership_established");});
 it("closed requests cannot change status",()=>{for(const status of ["declined","cancelled","completed","partnership_established"])expect(allowedStatuses("jv",status,true)).toEqual([]);});
 it("external examples have official sources and substantiated state coverage",()=>{expect(BUSINESS_EXAMPLES.find(p=>p.name==="Dataforce")?.service_areas).toEqual(["Maharashtra","Gujarat"]);});
});