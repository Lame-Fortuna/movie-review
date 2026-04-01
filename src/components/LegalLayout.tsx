import Link from "next/link";
import Navbar from "./Navbar";

export default function LegalLayout({title, children,}: {title: string; children: React.ReactNode;}) {
  return (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 mx-auto max-w-3xl px-4 pt-25">
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
  </div>
);


}
