import Link from "next/link";
import { unstable_cache } from "next/cache";
import { createMetadata } from "@/lib/metadata";
import { getAllCatalogues } from "@/lib/mongodb"; 

export const metadata = createMetadata({
  title: "Curated Catalogues",
  description: "Explore curated Film Atlas catalogues covering classic cinema, public-domain gems, and themed collections.",
  path: "/catalogue",
});

const getCachedCatalogues = unstable_cache(
  async () => {
    const catalogues = await getAllCatalogues();
    
    // Clean up the ObjectId warning by ensuring _id is a string
    return catalogues.map(cat => ({
      ...cat,
      _id: cat._id.toString()
    }));
  },
  ['all-catalogues'], // Cache key
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['catalogues'], 
  }
);

export default async function Catalog() {
  const catalogues = await getCachedCatalogues();
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "Explore this curated collection of films.";
    if (text.length <= maxLength) return text;
    // .trim() ensures we don't leave a weird space before the ellipsis, e.g. "word ..."
    return text.slice(0, maxLength).trim() + "..."; 
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-headline font-black uppercase tracking-[0.2em] text-white">
            Curated Catalogues
          </h1>
          <p className="mt-4 text-neutral-500 font-label tracking-widest uppercase text-xs">
            Discover hand-picked collections of cinematic history
          </p>
        </div>

        {/* Catalogues Grid */}
        {catalogues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogues.map((catalog: any) => (
            <Link
              key={catalog._id}
              href={`/catalogue/${catalog._id}`}
              className="card bg-black border border-white/10 hover:border-white/40 hover:bg-white/2 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 group rounded-sm overflow-hidden"
            >
                <div className="card-body p-6 md:p-8 relative flex flex-col min-h-55">
                    
                    {/* Decorative Subtle Gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content Top: Title */}
                    <div className="relative z-10 transform group-hover:-translate-y-1 transition-transform duration-500 mb-3">
                        <h2 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-widest text-white leading-tight">
                            {catalog.title || catalog._id.replace(/-/g, ' ')}
                        </h2>
                    </div>

                    {/* Content Middle: Description */}
                    {/* CHANGED: Increased to line-clamp-3 and added mb-8 to guarantee space between text and the button */}
                    <p className="relative z-10 text-sm font-body text-neutral-400 opacity-80 group-hover:opacity-100 transition-opacity mb-8">
                        {truncateText(catalog.desc, 120)}
                    </p>
                    
                    {/* Content Bottom: Arrow */}
                    {/* CHANGED: Used mt-auto to strictly pin this to the bottom of the card, preventing any overlap */}
                    <div className="relative z-10 mt-auto flex items-center text-amber-300/80 font-label text-[10px] uppercase tracking-[0.3em] group-hover:text-amber-300 transition-colors">
                        <span className="mr-2">Explore</span>
                        <svg 
                            className="w-4 h-4 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>

                </div>
            </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 border border-white/5 bg-black/50 rounded-sm">
            <p className="text-neutral-500 font-label text-xs uppercase tracking-widest">
              No catalogues found.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
