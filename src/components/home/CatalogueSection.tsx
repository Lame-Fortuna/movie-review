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
      className="relative h-50 flex items-center justify-center overflow-hidden text-white rounded-lg shadow-lg"
    >
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/15" />
      <div className="relative z-10 backdrop-blur-sm bg-black/40 px-4 py-2 rounded-md">
        <span className="text-xl font-semibold">{name}</span>
      </div>
    </Link>
  );
}
