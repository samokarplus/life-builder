import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Compare } from "@/components/compare/compare";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-4xl">Compare Paths</h1>
      <p className="mb-8 mt-2 text-muted">Duplicate your plan, try alternatives, and see exactly what changes.</p>
      <HydratedGate><Compare /></HydratedGate>
    </div>
  );
}
