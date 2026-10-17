import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Explorer } from "@/components/explorer/explorer";

export default function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Course Explorer</h1>
      <p className="mb-8 mt-2 text-muted">Search the FRCC gtPathways courses and add them to your roadmap.</p>
      <HydratedGate><Explorer /></HydratedGate>
    </div>
  );
}
