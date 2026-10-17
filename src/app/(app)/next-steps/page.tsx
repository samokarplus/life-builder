import { HydratedGate } from "@/components/shell/hydrated-gate";
import { NextSteps } from "@/components/journey/next-steps";

export default function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Next Steps</h1>
      <p className="mb-8 mt-2 text-muted">What to do next toward your goal, why it matters, and where each suggestion comes from.</p>
      <HydratedGate><NextSteps /></HydratedGate>
    </div>
  );
}
