import { HydratedGate } from "@/components/shell/hydrated-gate";
import { PrintPlan } from "@/components/print/print-plan";

export default function Page() {
  return <HydratedGate><PrintPlan /></HydratedGate>;
}
