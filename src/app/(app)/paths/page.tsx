import { Suspense } from "react";
import { HydratedGate } from "@/components/shell/hydrated-gate";
import { DreamPaths } from "@/components/paths/dream-paths";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const navigationKey = JSON.stringify(params);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-4xl">Colorado Dreams</h1>
      <p className="mb-8 mt-2 text-muted">Your school dream and your job dream in one route, whatever stage you are at. Every step shows where it came from.</p>
      <HydratedGate><Suspense fallback={null}><DreamPaths key={navigationKey} /></Suspense></HydratedGate>
    </div>
  );
}
