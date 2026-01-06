import Link from "next/link";

type Props = {
  name: string;
  bg: string;
  link: string;
};

export default function CatalogueItem({ name, bg, link }: Props) {
  return (
    <Link
      href={link}
      className="h-50 flex items-center justify-center bg-cover bg-top text-white rounded-lg shadow-lg"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", width: "100%"}}
    >
      <div className="backdrop-blur-sm bg-black/40 px-4 py-2 rounded-md">
        <span className="text-xl font-semibold">{name}</span>
      </div>
    </Link>
  );
}
