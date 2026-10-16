import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Wizard } from "@/components/onboarding/wizard";

export default function Page() {
  return <HydratedGate><Wizard /></HydratedGate>;
}
