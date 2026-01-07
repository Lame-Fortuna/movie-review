import Link from "next/link";
import Navbar from "./nav";

export default function LegalLayout({title, children,}: {title: string; children: React.ReactNode;}) {
  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-100">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-orange-500/80" />
      </header>

      <section className="space-y-6 text-sm leading-relaxed text-gray-300">
        {children}
      </section>
    </main>

    <footer className="border-t border-gray-800 bg-gray-950/40">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy-policy" className="hover:text-gray-100 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-100 transition">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-gray-100 transition">
              Disclaimer
            </Link>
          </nav>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Film Atlas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);


}
