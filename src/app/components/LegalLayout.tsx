import Link from "next/link";
import Navbar from "./nav";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
    <Navbar />

    <main className="mx-auto max-w-3xl px-4 py-12 text-gray-200 text-center">
      <h1 className="mb-6 text-3xl font-semibold">{title}</h1>
      <div className="space-y-5 text-sm leading-relaxed text-gray-300">
        {children}
      </div>
    </main>
    <footer className="mt-16 border-t border-gray-200 py-6 text-sm text-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p>
            © {new Date().getFullYear()} Film Atlas. All rights reserved.
            </p>

            <nav className="flex gap-4">
            <Link href="/privacy-policy" className="hover:underline">
                Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
                Terms
            </Link>
            <Link href="/disclaimer" className="hover:underline">
                Disclaimer
            </Link>
            </nav>
        </div>
    </footer>
    </>
  );
}
