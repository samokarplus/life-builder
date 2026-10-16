import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">We couldn&apos;t find that page.</h1>
      <Link href="/overview" className="mt-6 inline-block text-sm text-primary underline">Back to your overview</Link>
    </div>
  );
}
