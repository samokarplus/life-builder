import { HydratedGate } from "@/components/shell/hydrated-gate";
import { ProfileForm } from "@/components/profile/profile-form";

export default function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl">My Profile</h1>
      <div className="mt-8"><HydratedGate><ProfileForm /></HydratedGate></div>
    </div>
  );
}
