import { HydratedGate } from "@/components/shell/hydrated-gate";
import { FundingHub } from "@/components/funding/funding-hub";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-4xl">Funding &amp; FAFSA</h1>
      <p className="mb-8 mt-2 text-muted">Scholarships, aid and deadlines for Colorado students, with sources.</p>
      <HydratedGate><FundingHub /></HydratedGate>
    </div>
  );
}
