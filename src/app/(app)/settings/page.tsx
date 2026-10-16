import { HydratedGate } from "@/components/shell/hydrated-gate";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Settings</h1>
      <div className="mt-8"><HydratedGate><SettingsPanel /></HydratedGate></div>
    </div>
  );
}
