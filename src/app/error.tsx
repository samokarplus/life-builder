"use client";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Something went sideways.</h1>
      <p className="mt-3 text-sm text-muted">This view could not load. Try again, and keep JSON backups of your plan.</p>
      <button onClick={retry} className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Try again</button>
    </div>
  );
}
