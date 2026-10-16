import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Careers } from "@/components/careers/careers";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-4xl">Career Explorer</h1>
      <p className="mb-8 mt-2 text-muted">See the education a career may require, beyond the degree itself.</p>
      <HydratedGate><Careers /></HydratedGate>
    </div>
  );
}
