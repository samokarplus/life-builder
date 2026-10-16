import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Costs } from "@/components/costs/costs";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-4xl">Costs &amp; Savings</h1>
      <p className="mb-8 mt-2 text-muted">Estimate what your plan costs using numbers you enter. Every figure shows where it came from.</p>
      <HydratedGate><Costs /></HydratedGate>
    </div>
  );
}
