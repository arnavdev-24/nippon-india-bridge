import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Field({label,children}:{label:string;children:ReactNode}){return <label className="block min-w-0 space-y-2"><Label asChild><span>{label}</span></Label>{children}</label>;}
export function Choice({value,onChange,options,placeholder="All"}:{value:string;onChange:(v:string)=>void;options:readonly string[];placeholder?:string}){return <select aria-label={placeholder} className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={e=>onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(o=><option key={o}>{o}</option>)}</select>;}
export function MultiChoice({options,value,onChange}:{options:readonly string[];value:string[];onChange:(v:string[])=>void}){return <div className="flex flex-wrap gap-2">{options.map(o=><Button key={o} type="button" size="sm" variant={value.includes(o)?"default":"outline"} aria-pressed={value.includes(o)} onClick={()=>onChange(value.includes(o)?value.filter(v=>v!==o):[...value,o])}>{o}</Button>)}</div>;}