import Link from "next/link"

const list = [
    {slug: "vintage", name: "Vintage"},
    {slug: "oldbollywood", name: "Golden Bollywood"},
    {slug: "chaplin", name: "Chaplin Comedy"},
    {slug: "noir", name: "Noir"},
    {slug: "oldjapanese", name: "Vintage Japanese Cinema"},
]

export default function Catalog() {
    return(
        <main className="min-h-screen pt-16 md:pt-20 p-5 text-surface">
            <h1 className="text-3xl text-white p-5">Catalogues</h1>

            <ul className="list bg-base-100 rounded-box shadow-md ml-15">
                {list.map(catalog=>(
                    <li key={catalog.name} className="list-row">
                        <Link key={catalog.name} href={`/catalogue/${catalog.slug}`} className="link p-2 m-2">
                            {catalog.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}