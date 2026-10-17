import { HydratedGate } from "@/components/shell/hydrated-gate";
import { DreamPaths } from "@/components/paths/dream-paths";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-4xl">Dream Paths</h1>
      <p className="mb-8 mt-2 text-muted">The whole route from where you are to the career you want: degrees, transfer dates, exams, experience and licensure, each step with its source.</p>
      <HydratedGate><DreamPaths /></HydratedGate>
    </div>
  );
}
