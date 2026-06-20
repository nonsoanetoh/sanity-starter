import Link from "next/link";

/** Fallback for routes outside the (web) group. Web pages use app/(web)/not-found.tsx. */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-neutral-600">Page not found</p>
      <Link href="/" className="mt-8 text-sm font-medium underline underline-offset-4">
        Back to home
      </Link>
    </div>
  );
}
