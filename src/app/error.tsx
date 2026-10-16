"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Something went sideways.</h1>
      <p className="mt-3 text-sm text-muted">Your saved plan is safe in this browser. {error.message ? `(${error.message})` : ""}</p>
      <button onClick={reset} className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Try again</button>
    </div>
  );
}
