"use client";
import { useMemo } from "react";
import { BadgeCheck, CircleHelp, Clock3 } from "lucide-react";
import { sourceById, sources } from "@/data/sources";
import { sourceHealth } from "@/lib/source-health";
import { cn } from "@/lib/utils";

export function SourceStatus({sourceId,label}:{sourceId:string;label?:string}) {
 const today=useMemo(()=>new Date(),[]);
 const source=sourceById(sourceId);
 const health=sourceHealth(source,today);
 const Icon=health.state==='fresh'?BadgeCheck:health.state==='stale'?Clock3:CircleHelp;
 const content=<><Icon size={12} className="shrink-0" aria-hidden /><span>{label ? `${label} · ${health.label}`:health.label}</span></>;
 const className=cn("inline-flex max-w-full items-start gap-1 rounded-lg px-2 py-1 text-xs",health.state==='fresh'?"bg-soft text-primary":"bg-warm text-amber-800 dark:text-amber-300");
 return source?.url ? <a href={source.url} target="_blank" rel="noreferrer" title={source.note} className={cn(className,'underline')}>{content}</a> : <span title={source?.note} className={className}>{content}</span>;
}

export function SourceOverview() {
 const today=useMemo(()=>new Date(),[]);
 const stale=sources.filter(source=>sourceHealth(source,today).state==='stale').length;
 return <details className="rounded-2xl border border-border bg-surface p-5">
  <summary className="cursor-pointer font-medium">Sources and last checks ({sources.length}){stale>0?` · ${stale} need rechecking`:''}</summary>
  <p className="mt-3 text-sm text-muted">A check date records our last review, not a guarantee that a page is unchanged. Sources older than90 days are flagged. Nothing is fetched automatically.</p>
  <ul className="mt-4 space-y-3">{sources.map(source=><li key={source.id}><p className="text-xs text-muted">{source.id}</p><SourceStatus sourceId={source.id} /></li>)}</ul>
 </details>;
}
