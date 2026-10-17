import { cn } from "@/lib/utils";
function Block({ className }: { className?: string }) { return <div className={cn("rounded-xl bg-warm",className)}/>; }
function Card({className,rows=3}:{className?:string;rows?:number}){return <div className={cn("rounded-2xl border border-border bg-surface p-5",className)}><Block className="h-4 w-1/2"/>{Array.from({length:rows},(_,i)=><Block key={i} className={cn("mt-4 h-9",i%2?"w-4/5":"w-full")}/>)}</div>;}
export function PageSkeleton({page="overview"}:{page?:string}) {
 let body;
 switch(page){
  case "roadmap":body=<><Block className="h-9 w-72 max-w-full"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0,1,2].map(i=><Card key={i} rows={4} className="h-96"/>)}</div></>;break;
  case "explorer":body=<><Block className="h-11 w-full max-w-md"/><div className="flex gap-2">{[0,1,2].map(i=><Block key={i} className="h-8 w-24"/>)}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2,3,4,5].map(i=><Card key={i} rows={1}/>)}</div></>;break;
  case "careers":body=<div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]"><Card rows={5}/><Card rows={7} className="min-h-96"/></div>;break;
  case "costs":body=<div className="grid gap-6 lg:grid-cols-2"><Card rows={9}/><div className="space-y-4"><Card rows={3}/><Card rows={1}/><Card rows={3}/></div></div>;break;
  case "profile":case "settings":body=<div className="mx-auto max-w-2xl space-y-4">{[0,1,2].map(i=><Card key={i} rows={i===1?4:2}/>)}</div>;break;
  case "compare":body=<div className="space-y-6"><Card rows={2}/><Block className="h-16 w-1/2"/><Card rows={7}/></div>;break;
  case "onboarding":body=<div className="mx-auto max-w-2xl space-y-6"><Block className="h-2 w-full"/><div className="grid grid-cols-2 gap-3">{[0,1,2,3,4,5].map(i=><Block key={i} className="h-20"/>)}</div><Block className="ml-auto h-11 w-32"/></div>;break;
  default:body=<div className="grid gap-4 sm:grid-cols-2">{[0,1,2,3].map(i=><Card key={i} rows={3} className="h-56"/>)}</div>;
 }
 return <div role="status" aria-label="Loading your plan" aria-busy="true" className="mx-auto max-w-5xl animate-pulse space-y-6"><span className="sr-only">Loading your plan…</span><Block className="h-4 w-24"/><Block className="h-10 w-3/4 max-w-lg"/><Block className="h-4 w-2/3"/>{body}</div>;
}
