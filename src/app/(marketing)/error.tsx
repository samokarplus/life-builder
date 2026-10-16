"use client";
export default function ErrorPage({ retry }: { retry: () => void }) {
  return <main className="mx-auto max-w-xl space-y-4 p-8"><h1 className="font-serif text-3xl">Let’s try that again.</h1><p className="text-muted">This view could not load. Your saved plan remains in this browser. Try reloading this view.</p><button onClick={retry} className="rounded-full bg-primary px-5 py-3 text-primary-foreground">Try again</button></main>;
}
