import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Roadmap } from "@/components/roadmap/roadmap";

export default function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl">My Roadmap</h1>
      <p className="mb-8 mt-2 text-muted">Drag courses between semesters. Everything saves automatically.</p>
      <HydratedGate><Roadmap /></HydratedGate>
    </div>
  );
}
