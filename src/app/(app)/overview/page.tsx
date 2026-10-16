import { HydratedGate } from "@/components/shell/hydrated-gate";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function Page() {
  return <HydratedGate><Dashboard /></HydratedGate>;
}
