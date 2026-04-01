import Link from "next/link";

const Genres = ["action","adventure","animation","comedy","crime","documentary","drama","family","fantasy","history","horror","music","mystery","romance","science fiction","thriller","tv movie","war","western"]

export default function GenrePage() {
  

  return (
    <main className="p-16 md:p-20 min-h-screen">
        <h1 className="text-3xl text-white p-5">Genres</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Genres.map((genre) => (
                <Link key={genre} href={`/genre/${genre}`} className="text-white group hover:text-gray-400">
                    <div className="p-4 border border-gray-700 rounded-lg transition-colors duration-300 group-hover:bg-gray-700">
                        <h2 className="text-lg font-semibold text-center uppercase">{genre}</h2>
                    </div>
                </Link>
            ))}
        </div>
    </main>
  );
}