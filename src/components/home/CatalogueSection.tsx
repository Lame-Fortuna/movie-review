import Link from "next/link";
import Image from "next/image";

type Props = {
  name: string;
  bg: string;
  link: string;
};

export default function CatalogueItem({ name, bg, link }: Props) {
  return (
    <Link
      href={link}
      className="relative h-50 flex items-center justify-center overflow-hidden text-white rounded-lg shadow-lg"
    >
      <Image
        src={bg}
        alt={name}
        width={200}
        height={100}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/15" />
      <div className="relative z-10 bg-black/55 md:bg-black/40 md:backdrop-blur-sm px-4 py-2 rounded-md">
        <span className="text-xl font-semibold">{name}</span>
      </div>
    </Link>
  );
}
